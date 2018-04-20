## Fetch Maker

### 定制fetch库的生成器，可根据不同配置生成符合每个项目的定制要求的fetch请求库

### 安装

```bash
npm install fetch-maker
```

启动项目时可能会提示babel的preset缺少react-app，先
```bash
npm i babel-preset-react-app -D
```

### 例子 参见当前项目中的example.js

### 使用方法

### API

```js
const yourFetch = new Fetch({
  ...your configs
})
```

#### 实例方法
| 方法 | 参数 | 说明 |
|---|---|---|
| get | string, [query] | url请求地址, [Object&#124;String]，url上的query对象或字符串，如{abc: 'def'}或'abc=def'，一下所有query参数说明相同。 |
| delete | string, [query] | url, Object, [Object&#124;String] |
| post | string, data, [query] | url, Object, [Object] |
| put | string, data, [query] | url, Object, [Object] |
| on | string, function | eventName, Function(...args) 监听函数，参数由emit发射出去的决定 |
| off | string, function | eventName, func，移除eventName事件队列中的该监听函数 |
| emit | string, [any] | eventName, 任何想要发射的数据，可多个 |
| useThen | function | Function(response) => {}在fetch的then回调里处理response的函数，根据添加顺序依次执行，每个函数接收的参数为上一个的返回值，遵守promise原则即可。 |
| useCatch | function | Function(error) 处理错误的函数，error参数参照下面事件说明中的error参数。 |

#### 注意事项

使用 useThen 或 useCatch 添加的处理成功或失败的函数。
参照了express的app.use(func)的用法。

### 实例属性

| 名称 | 说明 |
|---|---|---|
| config | 生成实例对象时传入的config, 可随时更改，更改后在下一个请求立即生效 |
| emitter | 一个EveitEmitter对象实例，fetch的on, off，emit都是emitter的方法，也可直接调用emitter的方法 |

emitter可直接参考nodejs的[events api](https://nodejs.org/api/events.html)
