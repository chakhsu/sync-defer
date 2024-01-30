export class Deferred {
  public promise: Promise<any>
  public resolve!: <T>(value: T | PromiseLike<T>) => void
  public reject!: (reason?: any) => void
  public then!: Promise<any>['then']
  public catch!: Promise<any>['catch']

  constructor() {
    this.promise = new Promise(
      ((resolve: any, reject: any) => {
        this.resolve = resolve
        this.reject = reject
      }).bind(this)
    )
    this.then = this.promise.then.bind(this.promise)
    this.catch = this.promise.catch.bind(this.promise)
  }
}
