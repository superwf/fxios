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
var URL = require("url");
var pathToRegexp = require("path-to-regexp");
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
        for (var _i = 0, _a = Object.keys(option.param); _i < _a.length; _i++) {
            var k = _a[_i];
            option.param[k] = encodeURIComponent(option.param[k]);
        }
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
var Fxios = /** @class */ (function () {
    function Fxios(config) {
        var _this = this;
        if (config === void 0) { config = exports.defaultRequestConfig; }
        this.interceptor = {};
        var baseURL = config.baseURL, requestConfig = __rest(config, ["baseURL"]);
        this.fetchConfig = __assign({}, requestConfig);
        this.baseURL = baseURL || '';
        var methods = ['get', 'post', 'put', 'delete', 'patch'];
        methods.forEach(function (method) {
            _this[method] = function (url, option, runtimeConfig) { return _this.request(method, url, option, runtimeConfig); };
        });
    }
    Fxios.prototype.extendHttpMethod = function (method) {
        var _this = this;
        this[method] = function (url, option, runtimeConfig) { return _this.request(method, url, option, runtimeConfig); };
    };
    Fxios.prototype.request = function (method, url, option, runtimeConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, parsedUrl, baseURL, requestOption, headers, body, req;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        method = method.toUpperCase();
                        if (runtimeConfig === undefined) {
                            runtimeConfig = {
                                method: method,
                            };
                        }
                        else {
                            runtimeConfig.method = method;
                        }
                        if (!this.interceptor.request) return [3 /*break*/, 2];
                        ;
                        return [4 /*yield*/, this.interceptor.request.call(this, url, option, runtimeConfig)];
                    case 1:
                        _a = _b.sent(), url = _a[0], option = _a[1], runtimeConfig = _a[2];
                        _b.label = 2;
                    case 2:
                        parsedUrl = exports.parseUrl(url, option);
                        baseURL = runtimeConfig && 'baseURL' in runtimeConfig
                            ? runtimeConfig.baseURL
                            : this.baseURL;
                        requestOption = __assign({}, this.fetchConfig, runtimeConfig);
                        headers = requestOption.headers || {};
                        if (option && option.body) {
                            body = option.body;
                            if (isPlainObject(body)) {
                                requestOption.headers = __assign({ 'Content-Type': exports.jsonType }, headers);
                                body = JSON.stringify(body);
                            }
                            requestOption.body = body;
                        }
                        req = new Request("" + baseURL + parsedUrl, requestOption);
                        return [2 /*return*/, fetch(req)
                                .then(function (res) {
                                if (_this.interceptor.response !== undefined) {
                                    return _this.interceptor.response.call(_this, res, req);
                                }
                                return res;
                            })
                                .catch(function (err) {
                                if (_this.interceptor.catch !== undefined) {
                                    return _this.interceptor.catch.call(_this, err, req);
                                }
                                throw err;
                            })];
                }
            });
        });
    };
    Fxios.prototype.create = function (config) {
        if (config === void 0) { config = exports.defaultRequestConfig; }
        return new Fxios(config);
    };
    return Fxios;
}());
exports.Fxios = Fxios;
//# sourceMappingURL=index.js.map