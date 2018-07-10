"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const URL = require("url");
const pathToRegexp = require("path-to-regexp");
const EventEmitter = require("events");
const isPlainObject = require("lodash/isPlainObject");
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
    request(method, url, body, query, runtimeConfig = {}) {
        const parsedUrl = exports.parseUrl(url, query);
        const base = this.config.base;
        const request = Object.assign({}, this.requestConfig, { method }, runtimeConfig);
        let headers = request.headers || {};
        if (isPlainObject(body)) {
            headers = Object.assign({ 'Content-Type': exports.jsonType }, headers);
            body = JSON.stringify(body);
        }
        request.body = body;
        const req = new Request(`${base}${parsedUrl}`, request);
        console.log(req);
        let promise = fetch(req);
        this.interceptor.response.forEach(cb => {
            promise = promise.then(res => cb(res, request));
        });
        return promise;
    }
    get(url, query, runtimeConfig = {}) {
        return this.request('get', url, undefined, query, runtimeConfig);
    }
    post(url, body, query, runtimeConfig = {}) {
        return this.request('post', url, body, query, runtimeConfig);
    }
    delete(url, body, query, runtimeConfig = {}) {
        return this.request('delete', url, body, query, runtimeConfig);
    }
    put(url, body, query, runtimeConfig = {}) {
        return this.request('delete', url, body, query, runtimeConfig);
    }
}
exports.default = Fxios;
