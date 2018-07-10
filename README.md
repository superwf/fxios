## Fxios

### inspired by axios, use typescript

### 安装

```bash
npm install fxios
```

启动项目时可能会提示babel的preset缺少react-app，先
```bash
npm i babel-preset-react-app -D
```

### 例子 参见当前项目中的example.js

### 使用方法

### API

```js
import fetchMaker from 'fetch-maker'
const yourFetch = fetchMaker({
  ...your configs
})
```

config通常配置
```js
{
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
}
```
`config.base` 配置所有请求的前缀，
如
```js
{
  ...
  base: '/api'
}
```
则所有请求都会添加`/api`路径


yourFetch实例是yourFetch.get的简写形式
```js
yourFetch(url) // 与下面的请求方式相同
yourFetch.get(url)
```

#### 实例方法
| 方法 | 参数 | 说明 |
|---|---|---|
| get|yourFetch | string url请求地址<br /> [query][Object&#124;String]，url上的query对象或字符串，如{abc: 'def'}或'abc=def'，以下所有query参数说明相同<br> [runtimeConfig] 发生请求时的fetch的config, 会与配置的config合并生效 |
| delete | string, [query] | url, [Object&#124;String], [runtimeConfig] |
| post | string, data, [query] | url, Object, [Object|String], [runtimeConfig] |
| put | string, data, [query] | url, Object, [Object|String], [runtimeConfig] |
| on | string, function | eventName, Function(...args) 监听函数，参数由emit发射出去的决定 |
| off | string, function | eventName, func，移除eventName事件队列中的该监听函数 |
| emit | string, [any] | eventName, 任何想要发射的数据，可多个 |
| useThen | function | Function(response) => {}在fetch的then回调里处理response的函数，根据添加顺序依次执行，每个函数接收的参数为上一个的返回值，遵守promise原则即可。 |
| useCatch | function | Function(error) 处理错误的函数，error参数参照下面事件说明中的error参数。 |
| use | function | Function():Boolean => {}在fetch每次请求前执行，返回bool值，若返回false则该次请求不执行，根据添加顺序依次执行。 |
| clearUse | | 清空user函数 |

#### 注意事项

使用 useThen 或 useCatch 添加的处理成功或失败的函数。
参照了express的app.use(func)的用法。

### 实例属性

| 名称 | 说明 |
|---|---|---|
| config | 生成实例对象时传入的config, 可随时更改，更改后在下一个请求立即生效 |
| emitter | 一个EveitEmitter对象实例，fetch的on, off，emit都是emitter的方法，也可直接调用emitter的方法 |

emitter可直接参考nodejs的[events api](https://nodejs.org/api/events.html)
