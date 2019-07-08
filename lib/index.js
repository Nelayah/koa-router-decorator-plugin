"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var KoaRouter = require("koa-router");
var glob = require("glob");
var path = require("path");
var KoaDecoratorRouter = new KoaRouter();
// 执行全局通用设置
var executeDefaultFunc = function (obj) {
    return R.forEachObjIndexed(function (v, k) {
        if (Array.isArray(v))
            return obj[k].apply(null, v);
        return obj[k](v);
    });
};
// 执行 koa-router 定义的方法
var executeRouterFunc = function (router) {
    return R.forEachObjIndexed(function (_, k, obj) { return obj[k].value(router); });
};
// controller 全局设置装饰器
exports.Controller = function (params) {
    var router = new KoaRouter();
    var decorator = function (target) {
        var keys = Object.getOwnPropertyDescriptors(target.prototype);
        delete keys.constructor;
        executeRouterFunc(router)(keys);
        KoaDecoratorRouter.use('', router.routes(), router.allowedMethods());
        router.__koa_router_decorator__ = true;
        return router;
    };
    if (!R.isNil(params['prototype']))
        return decorator(params);
    if (!R.isNil(params) && !R.isEmpty(params))
        executeDefaultFunc(router)(params);
    return decorator;
};
// koa-router 装饰器
exports.RequestMapping = function (_a) {
    var url = _a.url, method = _a.method, _b = _a.middleware, middleware = _b === void 0 ? [] : _b;
    return function (_, __, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function (router) {
            return router[method.toLocaleLowerCase()].apply(router, [
                url
            ].concat(middleware, [
                function (ctx, next) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fn(ctx, next)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                }); }); }
            ]));
        };
    };
};
// 加载所有装饰路由
exports.loadDecoratorRouter = function (_a) {
    var dir = _a.dir, _b = _a.extension, extension = _b === void 0 ? '.js' : _b;
    glob("**/*" + extension, {
        cwd: dir,
        silent: true
    }, function (_, files) { return files.forEach(function (v) { return require(path.join(dir, v)); }); });
};
exports.default = KoaDecoratorRouter;