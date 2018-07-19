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
    constructor(config?: FxiosConfig);
    request(method: string, url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    get(url: Url, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    post(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    delete(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    put(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
}
