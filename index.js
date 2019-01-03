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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    cache: 'reload',
};
exports.jsonType = 'application/json';
exports.parseUrl = function (url, option) {
    if (option && option.param) {
        url = pathToRegexp.compile(url)(option.param);
    }
    if (option && option.query) {
        var urlObject = URL.parse(url, true); // true: let the urlObject.query is object
        // see url#format, only search is absent, query will be used
        delete urlObject.search;
        url = URL.format(__assign({}, urlObject, { query: __assign({}, urlObject.query, option.query) }));
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
            catch: [],
        };
        var base = config.base, requestConfig = __rest(config, ["base"]);
        _this.config = __assign({}, exports.defaultRequestConfig, requestConfig);
        _this.base = base || '';
        // default max is 10
        // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
        // 1000 should be enough
        _this.setMaxListeners(1000);
        var methods = [
            'get',
            'head',
            'post',
            'put',
            'delete',
            'patch',
        ];
        methods.forEach(function (method) {
            _this[method] = function (url, option, runtimeConfig) { return _this.request(method, url, option, runtimeConfig); };
        });
        return _this;
    }
    Fxios.prototype.request = function (method, url, option, runtimeConfig) {
        if (runtimeConfig === void 0) { runtimeConfig = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var parsedUrl, base, request, headers, body, req, _i, _a, cb, promise;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parsedUrl = exports.parseUrl(url, option);
                        base = 'base' in runtimeConfig ? runtimeConfig.base : this.base;
                        request = __assign({}, this.config, { method: method }, runtimeConfig);
                        headers = request.headers || {};
                        if (option && option.body) {
                            body = option.body;
                            if (isPlainObject(body)) {
                                request.headers = __assign({ 'content-type': exports.jsonType }, headers);
                                body = JSON.stringify(body);
                            }
                            request.body = body;
                        }
                        req = new Request("" + base + parsedUrl, request);
                        _i = 0, _a = this.interceptor.request;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        cb = _a[_i];
                        return [4 /*yield*/, cb(req)];
                    case 2:
                        req = _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        promise = fetch(req);
                        this.interceptor.response.forEach(function (cb) {
                            promise = promise.then(function (res) { return cb(res, req); });
                        });
                        this.interceptor.catch.forEach(function (cb) {
                            promise = promise.catch(function (err) { return cb(err, req); });
                        });
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    return Fxios;
}(EventEmitter));
exports.Fxios = Fxios;
