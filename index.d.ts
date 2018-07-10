/// <reference types="node" />
import * as EventEmitter from 'events';
export declare const defaultConfig: RequestInit;
export declare const jsonType: string;
export declare const parseUrl: (url: Url, query?: Query | undefined) => string;
export declare class Fxios {
    config: FxiosConfig;
    base: string;
    interceptor: Interceptor;
    on: (event: string, listener: (data?: any) => void) => EventEmitter;
    off: (event: string, listener: (data?: any) => void) => EventEmitter;
    emit: (event: string) => boolean;
    emitter: EventEmitter;
    requestConfig: RequestInit;
    constructor(config?: FxiosConfig);
    request(method: string, url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    get(url: Url, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    post(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    delete(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
    put(url: Url, body?: any, query?: Query, runtimeConfig?: RequestInit): Promise<any>;
}
