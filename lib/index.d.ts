import * as KoaRouter from 'koa-router';
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
declare const KoaDecoratorRouter: KoaRouter<any, {}>;
export declare const Controller: (params?: any) => any;
export declare const RequestMapping: IRequestMapping;
export declare const loadDecoratorRouter: ({ dir, extension }: {
    dir: any;
    extension?: string;
}) => void;
export default KoaDecoratorRouter;
