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
exports.parseUrl = (url, option) => {
    if (option && option.param) {
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
        const methods = [
            'get',
            'head',
            'post',
            'put',
            'delete',
            'patch',
        ];
        methods.forEach((method) => {
            this[method] = (url, option, runtimeConfig) => this.request(method, url, option, runtimeConfig);
        });
    }
    request(method, url, option, runtimeConfig = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedUrl = exports.parseUrl(url, option);
            const base = 'base' in runtimeConfig ? runtimeConfig.base : this.base;
            const request = Object.assign({}, this.config, { method }, runtimeConfig);
            let headers = request.headers || {};
            if (option && option.body) {
                let { body } = option;
                if (isPlainObject(body)) {
                    request.headers = Object.assign({ 'content-type': exports.jsonType }, headers);
                    body = JSON.stringify(body);
                }
                request.body = body;
            }
            let req = new Request(`${base}${parsedUrl}`, request);
            for (const cb of this.interceptor.request) {
                req = yield cb(req);
            }
            let promise = fetch(req);
            this.interceptor.response.forEach(cb => {
                promise = promise.then(res => cb(res, req));
            });
            this.interceptor.catch.forEach(cb => {
                promise = promise.catch(err => cb(err, req));
            });
            return promise;
        });
    }
}
exports.Fxios = Fxios;
