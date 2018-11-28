"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.__esModule = true;
/// <reference path="typings/index.d.ts" />
var URL = require("url");
var pathToRegexp = require("path-to-regexp");
var EventEmitter = require("events");
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
    var proto = Object.getPrototypeOf(value);
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
    cache: 'reload'
};
exports.jsonType = 'application/json';
exports.parseUrl = function (url, query) {
    if (typeof url === 'object') {
        url = pathToRegexp.compile(url.url)(url.param);
    }
    if (query) {
        var urlObject = URL.parse(url, true); // true: let the urlObject.query is object
        // see url#format, only search is absent, query will be used
        delete urlObject.search;
        return URL.format(__assign({}, urlObject, { query: __assign({}, urlObject.query, query) }));
    }
    return url;
};
var Fxios = /** @class */ (function (_super) {
    __extends(Fxios, _super);
    function Fxios(config) {
        if (config === void 0) { config = exports.defaultRequestConfig; }
        var _this = _super.call(this) || this;
        _this.interceptor = {
            request: [],
            response: [],
            "catch": []
        };
        var base = config.base, requestConfig = __rest(config, ["base"]);
        _this.config = __assign({}, exports.defaultRequestConfig, requestConfig);
        _this.base = base || '';
        // default max is 10
        // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        // 1000 should be enough
        _this.setMaxListeners(1000);
        _this.get = function (url, query, runtimeConfig) { return _this.request('get', url, undefined, query, runtimeConfig); };
        _this.head = function (url, query, runtimeConfig) {
            return _this.request('head', url, undefined, query, runtimeConfig);
        };
        _this.post = function (url, body, query, runtimeConfig) { return _this.request('post', url, body, query, runtimeConfig); };
        _this.put = function (url, body, query, runtimeConfig) { return _this.request('put', url, body, query, runtimeConfig); };
        _this.patch = function (url, body, query, runtimeConfig) { return _this.request('patch', url, body, query, runtimeConfig); };
        _this["delete"] = function (url, body, query, runtimeConfig) { return _this.request('delete', url, body, query, runtimeConfig); };
        return _this;
    }
    Fxios.prototype.request = function (method, url, body, query, runtimeConfig) {
        if (runtimeConfig === void 0) { runtimeConfig = {}; }
        var parsedUrl = exports.parseUrl(url, query);
        var base = this.base;
        var request = __assign({}, this.config, { method: method }, runtimeConfig);
        var headers = request.headers || {};
        if (isPlainObject(body)) {
            request.headers = __assign({ 'content-type': exports.jsonType }, headers);
            body = JSON.stringify(body);
        }
        request.body = body;
        var req = new Request("" + base + parsedUrl, request);
        this.interceptor.request.forEach(function (cb) {
            req = cb(req);
        });
        var promise = fetch(req);
        this.interceptor.response.forEach(function (cb) {
            promise = promise.then(function (res) { return cb(res, req); });
        });
        this.interceptor["catch"].forEach(function (cb) {
            promise = promise["catch"](function (err) { return cb(err, req); });
        });
        return promise;
    };
    return Fxios;
}(EventEmitter));
exports.Fxios = Fxios;
