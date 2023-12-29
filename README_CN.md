# SyncDefer ![build-status](https://github.com/chakhsu/sync-defer/actions/workflows/ci.yml/badge.svg) ![npm](https://img.shields.io/npm/v/sync-defer) ![license](https://img.shields.io/npm/l/sync-defer)

[English](./README.md) | [简体中文](./README_CN.md)

这是一个基于 `LRUCache` 和 `Promise` 实现的多服务异步处理的同步等待的执行代理 Node.js 库。

## 为什么有这个库

需求场景：我们有一个服务 A，它要对服务 B 发起一次同步请求，服务 B 需要对这次请求进行处理，处理的方式是把任务发送给服务 C，这个任务还需要经过服务 D 和服务 E 的处理，并最终由服务 E 将这次的任务处理结果发送给服务 B，服务 B 拿到处理结果后，返回给服务 A。

引出的问题是：服务 E 把结果提交到服务 B 后，**服务 B 怎么样才能把结果返回给服务 A** ？

解决问题之前，我们先做步骤的拆分。

我们把这个过程拆分出两个步骤，分别是 `sync` 和 `defer`，我们将等到任务处理的步骤标记为`defer`, 将发送任务结果的步骤标记为`sync`，如图所示：

![sync-defer](./docs/sync-defer.svg)

`sync-defer` 库就是对这两个步骤进行抽象和代码封装，并独立成库。

核心设计逻辑是使用`LRUCache` 对任务ID进行缓存，使得发送请求和接收结果这两个步骤可以根据 ID 进行匹配，并使用`Promise`等待处理，对接收结果进行`resolve`或`reject`，从而实现同步等待的执行。

## 开始使用

### 安装依赖

```sh
npm i sync-defer
```

### 依赖引用

```js
// for commonjs
const { SyncDefer } = require('sync-defer')
// for esm
import { SyncDefer } from 'sync-defer'
```

### new SyncDefer(options)

```js
const syncDefer = new SyncDefer({
  ttl: 500, // 缓存过期时间，单位毫秒, 默认 5 分钟
  max: 10 // 最大缓存数量，默认 500 条
})
```

### defer()

等待 `sync` 方法执行后返回的结果。

```js
const result = await syncDefer.defer('id')
```

### sync()

正常结果同步：

```js
syncDefer.sync('id', { result: true })
```

异常结果同步：

```js
syncDefer.sync('id', null, new Error())
```

### Deferred

```js
// for commonjs
const { Deferred } = require('sync-defer')
// for esm
import { Deferred } from 'sync-defer'

const deferred = new Deferred()

deferred.resolve({ bool: true })
deferred.reject(new Error())
const res = await deferred.promise
```

---

完整的用法可以查看我们的[测试代码](./test/index.test.ts)。

## License

Released under the MIT License.
