/// <reference path="typings/index.d.ts" />
/// <reference types="node" />
import * as EventEmitter from 'events';
export declare function isPlainObject(value: any): boolean;
export declare const defaultRequestConfig: RequestInit;
export declare const jsonType: string;
export declare const parseUrl: (url: Url, query?: Query | undefined) => string;
export declare class Fxios extends EventEmitter {
    base: string;
    interceptor: Interceptor;
    config: RequestInit;
    get: RequestWithoutBody;
    head: RequestWithoutBody;
    post: RequestWithBody;
    put: RequestWithBody;
    delete: RequestWithBody;
    patch: RequestWithBody;
    constructor(config?: FxiosConfig);
    request(method: string, url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
}
