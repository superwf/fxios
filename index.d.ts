/// <reference path="typings/index.d.ts" />
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
    request(method: string, url: string, option?: FxiosRequestOption, runtimeConfig?: FxiosConfig): Promise<any>;
}
