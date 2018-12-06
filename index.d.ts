/// <reference path="typings/index.d.ts" />
/// <reference types="node" />
import * as EventEmitter from 'events';
export declare function isPlainObject(value: any): boolean;
export declare const defaultRequestConfig: RequestInit;
export declare const jsonType: string;
export declare const parseUrl: (url: string, option?: Option | undefined) => string;
export declare class Fxios extends EventEmitter {
    base: string;
    interceptor: Interceptor;
    config: RequestInit;
    get: RequestFunction;
    post: RequestFunction;
    head: RequestFunction;
    put: RequestFunction;
    delete: RequestFunction;
    patch: RequestFunction;
    constructor(config?: FxiosConfig);
    request(method: string, url: string, option?: Option, runtimeConfig?: FxiosConfig): Promise<any>;
}
