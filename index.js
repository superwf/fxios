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
var deepAssign = require("deep-assign");
var pathToRegexp = require("path-to-regexp");
var URL = require("url");
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
var removeNonRequestInitProperty = function (option) {
    var query = option.query, body = option.body, path = option.path, baseURL = option.baseURL, url = option.url, formData = option.formData, requestInit = __rest(option, ["query", "body", "path", "baseURL", "url", "formData"]);
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
exports.jsonType = 'application/json';
exports.parseUrl = function (url, option) {
    if (option && option.path) {
        for (var _i = 0, _a = Object.keys(option.path); _i < _a.length; _i++) {
            var k = _a[_i];
            option.path[k] = encodeURIComponent(String(option.path[k]));
        }
        url = pathToRegexp.compile(url)(option.path);
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
        this.interceptor = {};
        this.baseURL = '';
        // instance factory method
        this.create = Fxios.create;
        if (config) {
            var baseURL = config.baseURL, requestInit = __rest(config, ["baseURL"]);
            this.baseURL = config.baseURL || '';
            this.requestOption = requestInit;
        }
        var methods = [
            'get',
            'post',
            'put',
            'delete',
            'patch',
            'head',
            'options',
        ];
        return new Proxy(this, {
            get: function (target, key, receiver) {
                // console.log(target, key, receiver)
                if (key in target) {
                    return Reflect.get(target, key, receiver);
                }
                if (methods.includes(key)) {
                    var method = function (option) {
                        if (!option) {
                            option = { url: '', method: 'get' };
                        }
                        option.method = key;
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
    Fxios.create = function (config) {
        return new Fxios(config);
    };
    Fxios.prototype.request = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var baseURL, url, parsedUrl, requestOption, headers, body, formData_1, form_1, req;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.interceptor.request) {
                    option = this.interceptor.request(option);
                }
                option.method = option.method || 'get';
                baseURL = option.baseURL || this.baseURL;
                url = baseURL ? "" + baseURL + option.url : option.url;
                parsedUrl = exports.parseUrl(url, option);
                requestOption = removeNonRequestInitProperty(option);
                headers = requestOption.headers || {};
                if (option.body) {
                    body = option.body;
                    // add application/json header when body is plain object
                    // and auto json stringify the body
                    if (isPlainObject(body)) {
                        requestOption.headers = __assign({ 'Content-Type': exports.jsonType }, headers);
                        body = JSON.stringify(body);
                    }
                    requestOption.body = body;
                }
                // when upload file
                if (option.formData) {
                    formData_1 = option.formData;
                    if (formData_1 instanceof FormData) {
                        requestOption.body = formData_1;
                    }
                    if (isPlainObject(formData_1)) {
                        form_1 = new FormData();
                        Object.keys(formData_1).forEach(function (k) {
                            if (formData_1.hasOwnProperty(k)) {
                                form_1.append(k, formData_1[k]);
                            }
                        });
                        requestOption.body = form_1;
                    }
                }
                req = deepAssign({}, this.requestOption, requestOption);
                return [2 /*return*/, fetch(parsedUrl, req)
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
            });
        });
    };
    return Fxios;
}());
exports.Fxios = Fxios;
exports.default = new Fxios();
//# sourceMappingURL=index.js.map