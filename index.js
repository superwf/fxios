var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="typings/index.d.ts" />
const URL = require("url");
const pathToRegexp = require("path-to-regexp");
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
exports.isPlainObject = isPlainObject;
exports.defaultRequestConfig = {
    credentials: 'include',
    redirect: 'manual',
    mode: 'cors',
    cache: 'reload',
};
exports.jsonType = 'application/json';
exports.parseUrl = (url, option) => {
    if (option && option.param) {
        for (let k of Object.keys(option.param)) {
            option.param[k] = encodeURIComponent(option.param[k]);
        }
        url = pathToRegexp.compile(url)(option.param);
    }
    if (option && option.query) {
        const urlObject = URL.parse(url, true); // true: let the urlObject.query is object
        // see url#format, only search is absent, query will be used
        delete urlObject.search;
        url = URL.format(Object.assign({}, urlObject, { query: Object.assign({}, urlObject.query, option.query) }));
    }
    return url;
};
class Fxios {
    constructor(config = exports.defaultRequestConfig) {
        this.interceptor = {
            request: undefined,
            response: undefined,
            catch: undefined,
        };
        const { baseURL } = config, requestConfig = __rest(config, ["baseURL"]);
        this.fetchConfig = Object.assign({}, requestConfig);
        this.baseURL = baseURL || '';
        const methods = ['get', 'post', 'put', 'delete', 'patch'];
        methods.forEach((method) => {
            this[method] = (url, option, runtimeConfig) => this.request(method, url, option, runtimeConfig);
        });
    }
    extendHttpMethod(method) {
        this[method] = (url, option, runtimeConfig) => this.request(method, url, option, runtimeConfig);
    }
    request(method, url, option, runtimeConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.interceptor.request) {
                if (!runtimeConfig) {
                    runtimeConfig = {
                        method,
                    };
                }
                ;
                [url, option, runtimeConfig] = yield this.interceptor.request.call(this, url, option, runtimeConfig);
            }
            const parsedUrl = exports.parseUrl(url, option);
            if (runtimeConfig === undefined) {
                runtimeConfig = {};
            }
            const baseURL = 'baseURL' in runtimeConfig ? runtimeConfig.baseURL : this.baseURL;
            const requestOption = Object.assign({}, this.fetchConfig, { method }, runtimeConfig);
            let headers = requestOption.headers || {};
            if (option && option.body) {
                let { body } = option;
                if (isPlainObject(body)) {
                    requestOption.headers = Object.assign({ 'Content-Type': exports.jsonType }, headers);
                    body = JSON.stringify(body);
                }
                requestOption.body = body;
            }
            const req = new Request(`${baseURL}${parsedUrl}`, requestOption);
            let promise = fetch(req);
            promise = promise.then(res => {
                if (this.interceptor.response !== undefined) {
                    return this.interceptor.response.call(this, res, req);
                }
                return res;
            });
            promise = promise.catch(err => {
                if (this.interceptor.catch !== undefined) {
                    return this.interceptor.catch.call(this, err, req);
                }
                throw err;
            });
            return promise;
        });
    }
}
exports.Fxios = Fxios;
