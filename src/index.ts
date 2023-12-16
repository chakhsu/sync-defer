import { Deferred } from './defered'
import { LRUCache } from 'lru-cache'

export type Options = {
  ttl: number // ms
  max: number
}

export class SyncDefer {
  private cache: LRUCache<string, Deferred>

  constructor(options?: Options) {
    this.cache = new LRUCache({
      ttl: options?.ttl || 1000 * 60 * 5, // 5 min
      max: options?.max || 500
    })
  }

  public async sync(key: string, value: any, error?: any) {
    const deferred = this.cache.get(key)
    if (error) {
      this.cache.delete(key)
      return deferred?.reject(error)
    }
    return deferred?.resolve(value)
  }

  public async defer(key: string): Promise<any> {
    const deferred = new Deferred()
    this.cache.set(key, deferred)
    const result: any = await deferred?.promise
    this.cache.delete(key)
    return result
  }
}
