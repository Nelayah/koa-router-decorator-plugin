# koa-router-decorator-plugin

一个 `koa router` 装饰器

## 安装

```bash
npm i koa-router-decorator-plugin --save
```

## 使用

`controller/example01.ts` 文件配置如下：

```typescript
import {Controller, RequestMapping} from 'koa-router-decorator-plugin';

@Controller
export default class {
  @RequestMapping({method: 'GET', url: '/example01'})
  async example01(ctx) {
    ctx.body = 'example01';
  }
}
```

或者, 添加 `koa-router` 通用配置，

`controller/example02.ts` 文件配置如下：

```typescript
import {Controller, RequestMapping} from 'koa-router-decorator-plugin';

@Controller({prefix: '/prefix'})
export default class {
  @RequestMapping({method: 'GET', url: '/example02'})
  async example01(ctx) {
    ctx.body = 'example02';
  }
}
```

在 `koa` 和 `koa-router` 中使用，

```
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as path from 'path';
import KoaDecoratorRouter, {loadDecoratorRouter} from 'koa-router-decorator-plugin';

const app = new Koa();
const router = new KoaRouter();

// 1.加载配置 controller 文件
loadDecoratorRouter({dir: path.join(__dirname, '/path/to/controller'), extension: '.ts'});

router.get('/heartbeats', async (ctx, _) => {
  ctx.body = 'success';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

// 2.app.use 使用已配置的路由
app
  .use(KoaDecoratorRouter.routes())
  .use(KoaDecoratorRouter.allowedMethods());

app.listen(4000);

```

输出结果：

```javascript
http.get('http://localhost:4000/heartbeats'); // output: success

http.get('http://localhost:4000/example01'); // output: example01

http.get('http://localhost:4000/prefix/example02'); // output: example02
```

## API

### @Controller

参数：支持传入 `koa-router` Router `instance` 中所有的方法。不传参，可以直接调用 `@Controller` 来使用。

如 `router.prefix`， 可以这么配置 `@Controller({prefix: '/user'});`

Router `instance` 方法中多参数调用，需要以数组形式参入。

例如，

```javascript
router.url('user', { id: 3 }, { query: { limit: 1 } });
```

可以这么配置，

```javascript
@Controller({url: ['user', { id: 3 }, {query: { limit: 1 }}]});
```

### @RequestMapping({method: string, url: string, middleware?: []})

#### method

koa router `HTTP METHOD` 值，支持大小写

#### url

koa router 中请求 url 配置

#### middleware

请求中间件配置，

```javascript
@RequestMapping({
  method: 'GET',
  url: '/users/:id',
  middleware: [
   (ctx, next) => {
     return User.findOne(ctx.params.id).then(function(user) {
       ctx.user = user;
       next();
     });
   },
   // ...middleware
  ]
})
ctx => {
 console.log(ctx.user);
}
```
转化为 `koa-router` 配置,

```javascript
router.get(
  '/users/:id',
  (ctx, next) => {
    return User.findOne(ctx.params.id).then(function(user) {
      ctx.user = user;
      next();
    });
  },
  // ...middleware
  ctx => {
    console.log(ctx.user);
  }
);
```

### loadDecoratorRouter(dir: string, extension?: string)

该方法调用之后，将写入 `koa-router-decorator-plugin` 里的全局变量，
`koa` 使用的时候，直接从 `koa-router-decorator-plugin` 导出这个全局变量 KoaDecoratorRouter 使用即可。

#### dir

使用 `koa-router-decorator-plugin` 配置文件目录路径

#### extension(default = '.js')

匹配配置文件的拓展名