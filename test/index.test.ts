import { SyncDefer } from '../src'

const options = { ttl: 500, max: 10 }

describe('SyncDefer', () => {
  test('defer and sync methods', async () => {
    const key = 'testKey'
    const value = { test: 'value' }
    const error = new Error('Test Error')

    // Create SyncDefer
    const syncDefer = new SyncDefer(options)

    // Test defer method
    const deferPromise = syncDefer.defer(key)
    expect(syncDefer['cache'].has(key)).toBeTruthy()

    // Test sync method with value
    syncDefer.sync(key, value)
    const result = await deferPromise
    expect(result).toBe(value)
    expect(syncDefer['cache'].has(key)).toBeFalsy()

    // Test sync method with error
    const errorPromise = syncDefer.defer(key)
    syncDefer.sync(key, null, error)
    try {
      await errorPromise
    } catch (err) {
      expect(err).toBe(error)
    }
    expect(syncDefer['cache'].has(key)).toBeFalsy()
  })
})
