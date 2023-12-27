import { Defered } from './defered'
import { LRUCache } from 'lru-cache'

export type Options = {
  ttl: number // ms
  max: number
}

export class SyncDefer {
  private cache: LRUCache<string, Defered>

  constructor(options?: Options) {
    this.cache = new LRUCache({
      ttl: options?.ttl || 1000 * 60 * 5, // 5 min
      max: options?.max || 500
    })
  }

  public async sync(key: string, value: any, error?: any) {
    const defered = this.cache.get(key)
    if (error) {
      this.cache.delete(key)
      return defered?.reject(error)
    }
    return defered?.resolve(value)
  }

  public async defer(key: string): Promise<any> {
    const defered = new Defered()
    this.cache.set(key, defered)
    const result: any = await defered?.promise
    this.cache.delete(key)
    return result
  }
}
