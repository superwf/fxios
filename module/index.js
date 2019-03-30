import { parse, format } from 'url';
import { compile } from 'path-to-regexp';

// copy from lodash
function isPlainObject(value) {
    if (Object.getPrototypeOf(value) === null || Array.isArray(value)) {
        return true;
    }
    if (typeof value !== 'object' ||
        value === null ||
        String(value) !== '[object Object]') {
        return false;
    }
    let proto = Object.getPrototypeOf(value);
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(value) === proto;
}
const defaultRequestConfig = {
    credentials: 'include',
    redirect: 'manual',
    mode: 'cors',
    cache: 'reload',
};
const jsonType = 'application/json';
const parseUrl = (url, option) => {
    if (option && option.param) {
        for (let k of Object.keys(option.param)) {
            option.param[k] = encodeURIComponent(option.param[k]);
        }
        url = compile(url)(option.param);
    }
    if (option && option.query) {
        const urlObject = parse(url, true); // true: let the urlObject.query is object
        // see url#format, only search is absent, query will be used
        delete urlObject.search;
        url = format({
            ...urlObject,
            query: {
                ...urlObject.query,
                ...option.query,
            },
        });
    }
    return url;
};
class Fxios {
    constructor(config = defaultRequestConfig) {
        this.interceptor = {};
        const { baseURL, ...requestConfig } = config;
        this.fetchConfig = { ...requestConfig };
        this.baseURL = baseURL || '';
        const methods = ['get', 'post', 'put', 'delete', 'patch'];
        methods.forEach((method) => {
            this[method] = (url, option, runtimeConfig) => this.request(method, url, option, runtimeConfig);
        });
    }
    extendHttpMethod(method) {
        this[method] = (url, option, runtimeConfig) => this.request(method, url, option, runtimeConfig);
    }
    async request(method, url, option, runtimeConfig) {
        method = method.toUpperCase();
        if (runtimeConfig === undefined) {
            runtimeConfig = {
                method,
            };
        }
        else {
            runtimeConfig.method = method;
        }
        if (this.interceptor.request) {
            [url, option, runtimeConfig] = await this.interceptor.request.call(this, url, option, runtimeConfig);
        }
        const parsedUrl = parseUrl(url, option);
        const baseURL = runtimeConfig && 'baseURL' in runtimeConfig
            ? runtimeConfig.baseURL
            : this.baseURL;
        const requestOption = {
            ...this.fetchConfig,
            ...runtimeConfig,
        };
        let headers = requestOption.headers || {};
        if (option && option.body) {
            let { body } = option;
            if (isPlainObject(body)) {
                requestOption.headers = {
                    'Content-Type': jsonType,
                    ...headers,
                };
                body = JSON.stringify(body);
            }
            requestOption.body = body;
        }
        const req = new Request(`${baseURL}${parsedUrl}`, requestOption);
        return fetch(req)
            .then(res => {
            if (this.interceptor.response !== undefined) {
                return this.interceptor.response.call(this, res, req);
            }
            return res;
        })
            .catch((err) => {
            if (this.interceptor.catch !== undefined) {
                return this.interceptor.catch.call(this, err, req);
            }
            throw err;
        });
    }
    create(config = defaultRequestConfig) {
        return new Fxios(config);
    }
}

export { Fxios, defaultRequestConfig, isPlainObject, jsonType, parseUrl };
