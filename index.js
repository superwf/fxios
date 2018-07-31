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
const EventEmitter = require("events");
// copy from lodash
function isPlainObject(value) {
    if (value === undefined || value === null) {
        return false;
    }
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
exports.parseUrl = (url, query) => {
    if (typeof url === 'object') {
        url = pathToRegexp.compile(url.url)(url.param);
    }
    if (query) {
        const urlObject = URL.parse(url, true); // true: let the urlObject.query is object
        // see url#format, only search is absent, query will be used
        delete urlObject.search;
        return URL.format(Object.assign({}, urlObject, { query: Object.assign({}, urlObject.query, query) }));
    }
    return url;
};
class Fxios extends EventEmitter {
    constructor(config = exports.defaultRequestConfig) {
        super();
        this.interceptor = {
            request: [],
            response: [],
            catch: [],
        };
        const { base } = config, requestConfig = __rest(config, ["base"]);
        this.config = Object.assign({}, exports.defaultRequestConfig, requestConfig);
        this.base = base || '';
        // default max is 10
        // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        // 1000 should be enough
        this.setMaxListeners(1000);
        this.get = (url, query, runtimeConfig) => this.request('get', url, undefined, query, runtimeConfig);
        this.head = (url, query, runtimeConfig) => this.request('head', url, undefined, query, runtimeConfig);
        this.post = (url, body, query, runtimeConfig) => this.request('post', url, body, query, runtimeConfig);
        this.put = (url, body, query, runtimeConfig) => this.request('put', url, body, query, runtimeConfig);
        this.patch = (url, body, query, runtimeConfig) => this.request('patch', url, body, query, runtimeConfig);
    }
    request(method, url, body, query, runtimeConfig = {}) {
        const parsedUrl = exports.parseUrl(url, query);
        const { base } = this;
        const request = Object.assign({}, this.config, { method }, runtimeConfig);
        let headers = request.headers || {};
        if (isPlainObject(body)) {
            request.headers = Object.assign({ 'content-type': exports.jsonType }, headers);
            body = JSON.stringify(body);
        }
        request.body = body;
        let req = new Request(`${base}${parsedUrl}`, request);
        this.interceptor.request.forEach(cb => {
            req = cb(req);
        });
        let promise = fetch(req);
        this.interceptor.response.forEach(cb => {
            promise = promise.then(res => cb(res, req));
        });
        this.interceptor.catch.forEach(cb => {
            promise = promise.catch(err => cb(err, req));
        });
        return promise;
    }
}
exports.Fxios = Fxios;
