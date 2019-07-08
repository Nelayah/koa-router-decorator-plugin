import * as R from 'ramda';
import * as KoaRouter from 'koa-router';
import * as glob from 'glob';
import * as path from 'path';
import * as Koa from 'koa';

interface IRequestParams {
  url?: string;
  method?: string;
  middleware?: any[];
}
interface IRequestDecoratedFunc extends Function {
  (ctx?: Koa.Context | never, next?: Function | never): Promise<any> | any;
}
interface IRequestDecoratorFunc extends Function {
  (target: Object, key: string, descriptor: TypedPropertyDescriptor<IRequestDecoratedFunc>): void;
}
interface IRequestMapping extends Function {
  (prams: IRequestParams): IRequestDecoratorFunc;
}

const KoaDecoratorRouter = new KoaRouter();

// 执行全局通用设置
const executeDefaultFunc = (obj: object) =>
  R.forEachObjIndexed((v: any, k: string) => {
    if (Array.isArray(v)) return obj[k].apply(null, v);
    return obj[k](v);
  });

// 执行 koa-router 定义的方法
const executeRouterFunc = router =>
  R.forEachObjIndexed((_, k: string, obj: object) => obj[k].value(router));

// controller 全局设置装饰器
export const Controller = (params?: KoaRouter | any) => {
  const router: any = new KoaRouter();
  const decorator = (target: any) => {
    const keys = Object.getOwnPropertyDescriptors(target.prototype);
    delete keys.constructor;
    executeRouterFunc(router)(keys);
    KoaDecoratorRouter.use('', router.routes(), router.allowedMethods());
    router.__koa_router_decorator__ = true;
    return router
  };

  if (!R.isNil(params['prototype'])) return decorator(params);
  if (!R.isNil(params) && !R.isEmpty(params)) executeDefaultFunc(router)(params);
 
  return decorator;
}

// koa-router 装饰器
export const RequestMapping: IRequestMapping = ({
  url,
  method,
  middleware = []
}) => {
  return (_, __, descriptor) => {
    const fn = descriptor.value;
    descriptor.value = router =>
      router[method.toLocaleLowerCase()].apply(
        router,
        [
          url,
          ...middleware,
          async (ctx, next) => await fn(ctx, next)
        ]
      );
  }
}

// 加载所有装饰路由
export const loadDecoratorRouter = ({dir, extension = '.js'}) => {
  glob(
    `**/*${extension}`,
    {
      cwd: dir,
      silent: true
    },
    (_, files) => files.forEach(v => require(path.join(dir, v)))
  );
}

export default KoaDecoratorRouter;