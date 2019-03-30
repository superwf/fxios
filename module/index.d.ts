export interface Query {
    [index: string]: string | string[];
}
export interface Param {
    [index: string]: string;
}
export interface FxiosRequestOption {
    query?: Query;
    param?: Param;
    body?: any;
}
export interface FxiosConfig extends RequestInit {
    baseURL?: string;
}
export declare type ResponseCallback = (res: any, req: Request) => any;
export declare type RequestCallback = (url: string, option?: FxiosRequestOption, runtimeConfig?: FxiosConfig) => [string, FxiosRequestOption | undefined, FxiosConfig | undefined];
export declare type CatchCallback = (err: Error, req: Request) => any | never;
export interface Interceptor {
    request?: RequestCallback;
    response?: ResponseCallback;
    catch?: CatchCallback;
}
export declare type RequestFunction = <T = Response>(url: string, option?: FxiosRequestOption, runtimeConfig?: FxiosConfig) => Promise<T>;
export declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
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
    request<T = Response>(method: string, url: string, option?: FxiosRequestOption, runtimeConfig?: FxiosConfig): Promise<any>;
    create(config?: FxiosConfig): Fxios;
}
