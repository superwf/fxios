/// <reference path="typings/index.d.ts" />
import { Interceptor, FxiosRequestOption, RequestFunction, FxiosConfig } from './typings/index';
export declare function isPlainObject(value: any): boolean;
export declare const defaultRequestConfig: RequestInit;
export declare const jsonType: string;
export declare const parseUrl: (url: string, option?: FxiosRequestOption | undefined) => string;
export declare class Fxios {
    baseURL: string;
    interceptor: Interceptor;
    fetchConfig: RequestInit;
    get: RequestFunction;
    post: RequestFunction;
    put: RequestFunction;
    delete: RequestFunction;
    patch: RequestFunction;
    [key: string]: any;
    constructor(config?: FxiosConfig);
    extendHttpMethod(method: string): void;
    request<T>(method: string, url: string, option?: FxiosRequestOption, runtimeConfig?: FxiosConfig): Promise<T | Response>;
}
