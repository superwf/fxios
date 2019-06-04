import { compile } from 'path-to-regexp';
import { parse, format } from 'url';

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
const removeNonRequestInitProperty = (option) => {
    const { query, body, path, baseURL, url, formData, ...requestInit } = option;
    return requestInit;
};
// export const defaultRequestConfig: Omit<IFxiosRequestOption, 'url'> = {
//   credentials: 'include',
//   redirect: 'manual',
//   mode: 'cors',
//   cache: 'reload',
//   method: 'get',
//   baseURL: '',
// }
const jsonType = 'application/json';
const parseUrl = (url, option) => {
    if (option && option.path) {
        for (const k of Object.keys(option.path)) {
            option.path[k] = encodeURIComponent(String(option.path[k]));
        }
        url = compile(url)(option.path);
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
    constructor(config) {
        this.interceptor = {};
        this.baseURL = '';
        // instance factory method
        this.create = Fxios.create;
        if (config) {
            const { baseURL, ...requestInit } = config;
            this.baseURL = config.baseURL || '';
            this.requestOption = requestInit;
        }
        const methods = [
            'get',
            'post',
            'put',
            'delete',
            'patch',
            'head',
            'options',
        ];
        return new Proxy(this, {
            get(target, key, receiver) {
                // console.log(target, key, receiver)
                if (key in target) {
                    return Reflect.get(target, key, receiver);
                }
                if (methods.includes(key)) {
                    const method = (option) => {
                        if (!option) {
                            option = { url: '', method: 'get' };
                        }
                        if (typeof option === 'string') {
                            option = {
                                method: key,
                                url: option,
                            };
                        }
                        else {
                            option.method = key;
                        }
                        return target.request(option);
                    };
                    Reflect.set(target, key, method);
                    return method;
                }
            },
        });
    }
    /** factory method
     * follow axios create method */
    static create(config) {
        return new Fxios(config);
    }
    async request(option) {
        if (this.interceptor.request) {
            option = this.interceptor.request(option);
        }
        if (typeof option === 'string') {
            option = {
                method: 'get',
                url: option,
            };
        }
        option.method = option.method || 'get';
        const baseURL = option.baseURL || this.baseURL;
        const url = baseURL ? `${baseURL}${option.url}` : option.url;
        const parsedUrl = parseUrl(url, option);
        const requestOption = removeNonRequestInitProperty(option);
        const headers = requestOption.headers || {};
        if (option.body) {
            let { body } = option;
            // add application/json header when body is plain object
            // and auto json stringify the body
            if (isPlainObject(body)) {
                requestOption.headers = {
                    'Content-Type': jsonType,
                    ...headers,
                };
                body = JSON.stringify(body);
            }
            requestOption.body = body;
        }
        // when upload file
        if (option.formData) {
            const { formData } = option;
            if (formData instanceof FormData) {
                requestOption.body = formData;
            }
            if (isPlainObject(formData)) {
                const form = new FormData();
                Object.keys(formData).forEach(k => {
                    if (formData.hasOwnProperty(k)) {
                        form.append(k, formData[k]);
                    }
                });
                requestOption.body = form;
            }
        }
        const req = deepAssign({}, this.requestOption, requestOption);
        return fetch(parsedUrl, req)
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
}
var index = new Fxios();

export default index;
export { Fxios, isPlainObject, jsonType, parseUrl };
