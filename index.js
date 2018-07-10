"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = require("url");
const pathToRegexp = require("path-to-regexp");
const EventEmitter = require("events");
// import merge = require('lodash/merge')
exports.defaultConfig = {
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
class Fxios {
    constructor(config = { base: '', request: exports.defaultConfig }) {
        this.interceptor = {
            request: [],
            response: [],
        };
        this.requestConfig = config.request || exports.defaultConfig;
        this.config = config;
        const emitter = new EventEmitter();
        // default max is 10
        // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        // 1000 should be enough
        emitter.setMaxListeners(1000);
        this.on = emitter.on.bind(emitter);
        this.off = emitter.removeListener.bind(emitter);
        this.emit = emitter.emit.bind(emitter);
        this.emitter = emitter;
    }
    request(method, url, query, runtimeConfig = {}) {
        const parsedUrl = exports.parseUrl(url, query);
        const base = this.config.base;
        const request = Object.assign({}, this.requestConfig, { method: 'get' }, runtimeConfig);
        let promise = fetch(`${base}${parsedUrl}`, request);
        this.interceptor.response.forEach(cb => {
            promise = promise.then(res => cb(res, request));
        });
        return promise;
    }
    get(url, query, runtimeConfig = {}) {
        return this.request('get', url, query, runtimeConfig);
    }
    requestWithBody(method, url, data, query, runtimeConfig = {}) {
        const parsedUrl = exports.parseUrl(url, query);
        const base = this.config.base;
        const request = Object.assign({}, this.requestConfig, { method: 'post' }, runtimeConfig);
        let headers = request.headers || {};
        let body;
        if (typeof data === 'object') {
            headers = Object.assign({ 'Content-Type': exports.jsonType }, headers);
            body = JSON.stringify(data);
        }
        else {
            body = data;
        }
        request.body = body;
        let promise = fetch(`${base}${parsedUrl}`, request);
        this.interceptor.response.forEach(cb => {
            promise = promise.then(res => cb(res, request));
        });
        return promise;
    }
    post(url, data, query, runtimeConfig = {}) {
        return this.requestWithBody('post', url, data, query, runtimeConfig);
    }
}
exports.default = Fxios;
