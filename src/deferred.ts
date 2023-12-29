export class Deferred {
  public promise: Promise<any>
  public resolve!: <T>(value: T | PromiseLike<T>) => void
  public reject!: (reason?: any) => void

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
