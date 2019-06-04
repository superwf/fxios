/** all supported http method */
export declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';
export interface IQuery {
    [index: string]: string | string[] | number | number[] | boolean | boolean[] | undefined;
}
export interface IPath {
    [index: string]: string | number | boolean | undefined;
}
export interface IFxiosRequestOption extends RequestInit {
    query?: IQuery;
    body?: any;
    path?: IPath;
    formData?: any;
    baseURL?: string;
    url: string;
}
export declare type FxiosRequestOption = IFxiosRequestOption | string;
export interface IFxiosConfig extends RequestInit {
    baseURL?: string;
}
export declare type ResponseInterceptor = (res: any, req: Request) => any;
export declare type RequestInterceptor = (option?: FxiosRequestOption) => FxiosRequestOption;
export declare type CatchInterceptor = (err: Error, req: Request) => any | never;
export interface IInterceptor {
    request?: RequestInterceptor;
    response?: ResponseInterceptor;
    catch?: CatchInterceptor;
}
export declare type RequestFunction = <T = Response>(option?: FxiosRequestOption) => Promise<T>;
export declare function isPlainObject(value: any): boolean;
export declare const jsonType: string;
export declare const parseUrl: (url: string, option?: IFxiosRequestOption | undefined) => string;
export declare class Fxios {
    /** factory method
     * follow axios create method */
    static create(config?: IFxiosConfig): Fxios;
    interceptor: IInterceptor;
    baseURL: string;
    get: RequestFunction;
    post: RequestFunction;
    put: RequestFunction;
    delete: RequestFunction;
    patch: RequestFunction;
    head: RequestFunction;
    options: RequestFunction;
    create: typeof Fxios.create;
    requestOption: RequestInit;
    constructor(config?: IFxiosConfig);
    request(option: FxiosRequestOption): Promise<any>;
}
declare const _default: Fxios;
export default _default;
