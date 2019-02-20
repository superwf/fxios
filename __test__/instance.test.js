var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const url_1 = require("url");
const fetchMock = require("fetch-mock");
const mockData = {
    get: { code: 'success', message: 'ok', data: [] },
    post: { code: 'success', message: 'ok', data: [] },
};
const mockUrls = {
    get: '/get',
    post: '/post',
};
const httpMethods = ['get', 'post', 'put', 'delete', 'patch'];
describe('fetch', () => {
    beforeEach(() => {
        fetchMock.restore();
    });
    it('测试isPlainObject', () => {
        class Foo {
            constructor() {
                this.a = 'a';
            }
        }
        expect(index_1.isPlainObject(new Foo())).toBe(false);
        expect(index_1.isPlainObject([1, 2, 3])).toBe(true);
        expect(index_1.isPlainObject({ x: 1, y: 2 })).toBe(true);
        expect(index_1.isPlainObject(Object.create(null))).toBe(true);
        expect(index_1.isPlainObject(Object.create({ a: 1 }))).toBe(false);
    });
    it('get方法，无intern.response，直接获取Response类型数据', () => __awaiter(this, void 0, void 0, function* () {
        const fxios = new index_1.Fxios();
        fetchMock.get(mockUrls.get, mockData.get);
        const res = yield fxios.get(mockUrls.get);
        expect(res).toBeInstanceOf(Response);
        return res.json().then((d) => {
            expect(d).toEqual(mockData.get);
        });
    }));
    httpMethods.forEach((method) => {
        it(`${method}方法，测试路由函数`, () => {
            const getWithRouterParam = '/get/superwf/edit/33';
            fetchMock[method](getWithRouterParam, {
                body: mockData.get,
            });
            // fetchMock.post(getWithRouterParam, {
            //   body: mockData.get,
            // })
            const fxios = new index_1.Fxios();
            return fxios[method]('/get/:name/edit/:id', {
                param: { name: 'superwf', id: '33' },
            }).then((res) => {
                expect(res).toBeInstanceOf(Response);
                return res.text().then((d) => {
                    expect(d).toEqual(JSON.stringify(mockData.get));
                });
            });
        });
        it(`fxios.${method}方法已与fxios绑定，可以不被fxios调用单独执行，效果不变`, () => {
            const getWithRouterParam = '/get/superwf/edit/33';
            fetchMock[method](getWithRouterParam, mockData.get);
            const fxios = new index_1.Fxios();
            const request = fxios[method];
            return request('/get/:name/edit/:id', {
                param: { name: 'superwf', id: '33' },
            }).then(res => {
                expect(res).toBeInstanceOf(Response);
                return res.text().then((d) => {
                    expect(d).toEqual(JSON.stringify(mockData.get));
                });
            });
        });
        it(`${method}方法，测试路由函数，param可为空值`, () => {
            ;
            fetchMock[method](mockUrls.get, mockData.get);
            const fxios = new index_1.Fxios();
            return fxios[method](mockUrls.get).then(res => {
                expect(res).toBeInstanceOf(Response);
                return res.text().then((d) => {
                    expect(d).toEqual(JSON.stringify(mockData.get));
                });
            });
        });
        it(`${method}方法，测试url baseURL`, () => {
            const withBase = '/api/get';
            fetchMock[method](withBase, mockData.get);
            const fxios = new index_1.Fxios({ baseURL: '/api' });
            return fxios[method]('/get').then(res => {
                expect(res).toBeInstanceOf(Response);
            });
        });
        it(`${method}方法，测试res.text()`, () => {
            const fxios = new index_1.Fxios();
            fetchMock[method](mockUrls.get, mockData.get);
            return fxios[method](mockUrls.get).then(res => {
                expect(res).toBeInstanceOf(Response);
                return res.text().then((d) => {
                    expect(d).toEqual(JSON.stringify(mockData.get));
                });
            });
        });
        // it(`${method}方法，测试定制headers`, () => {
        //   const headers = {
        //     'X-Request': 'power',
        //   }
        //   const fxios = new Fxios({ headers })
        //   ;(<fetchMockMethod>fetchMock[method])(`${mockUrls.get}/abc`, mockData.get)
        //   fxios.interceptor.request = (url, option, runtimeConfig) => {
        //     return [`${url}/abc`, option, runtimeConfig]
        //   }
        //   return fxios[method](mockUrls.get).then(res => {
        //     // const lastCall = fetchMock.lastCall()
        //     const lastPost = fetchMock.lastCall()!.request!
        //     expect(lastPost.headers).toEqual({
        //       'x-request': ['power'],
        //     })
        //     expect(res).toBeInstanceOf(Response)
        //   })
        // })
        if (method !== 'get') {
            it(`${method}方法，测试定制headers，与提交对象是自动添加的json header`, () => {
                const headers = {
                    'X-Request': 'power',
                };
                const fxios = new index_1.Fxios({ headers });
                fetchMock[method](mockUrls.get, mockData.get);
                const data = { name: 'abc' };
                return fxios[method](mockUrls.get, { body: data }).then(res => {
                    const lastRequest = fetchMock.lastCall().request;
                    expect(lastRequest.headers.get('x-request')).toBe('power');
                    expect(lastRequest.headers.get('content-type')).toEqual(index_1.jsonType);
                    expect(res).toBeInstanceOf(Response);
                });
            });
            it(`${method}方法，测试默认requestConfig.redirect`, () => {
                const fxios = new index_1.Fxios();
                fetchMock[method](mockUrls.get, mockData.get);
                return fxios[method](mockUrls.get).then(res => {
                    const lastRequest = fetchMock.lastCall().request;
                    expect(lastRequest.redirect).toBe(index_1.defaultRequestConfig.redirect);
                    expect(res).toBeInstanceOf(Response);
                });
            });
            it(`${method}方法，测试runtimeConfig`, () => {
                const fxios = new index_1.Fxios();
                fetchMock[method](mockUrls.get, mockData.get);
                return fxios[method](mockUrls.get, undefined, {
                    redirect: 'error',
                }).then((res) => {
                    const lastRequest = fetchMock.lastCall().request;
                    expect(lastRequest.redirect).toBe('error');
                    expect(res).toBeInstanceOf(Response);
                });
            });
        }
    });
    it('get方法，测试interceptor.request', () => {
        const query = { abc: 'xyz' };
        const fxios = new index_1.Fxios();
        fxios.interceptor.request = (url, option, runtimeConfig) => {
            const u = url_1.parse(url, true);
            u.query.name = 'def';
            delete url.search;
            const u1 = url_1.format(url);
            return [u1, option, runtimeConfig];
        };
        const url = url_1.format({
            pathname: mockUrls.get,
            query: { abc: 'xyz', name: 'def' },
        });
        fetchMock.get(url, mockData.get);
        return fxios.get(url, { query }).then(res => {
            expect(fetchMock.lastCall()[0]).toBe('/get?abc=xyz&name=def');
            expect(res).toBeInstanceOf(Response);
        });
    });
    it('get方法，通过interceptor处理数据', () => {
        const fxios = new index_1.Fxios();
        fetchMock.get(mockUrls.get, mockData.get);
        class FError extends Error {
        }
        fxios.interceptor.response = (res, req) => {
            if (!res.ok) {
                const error = new FError(res.statusText);
                error.response = res;
                error.request = req;
                throw error;
            }
            return res.json().then((data) => {
                return data;
            });
        };
        return fxios.get(mockUrls.get).then(res => {
            expect(res).toEqual(mockData.get);
        });
    });
    it('post方法，测试post object', () => __awaiter(this, void 0, void 0, function* () {
        const data = { name: '123' };
        const fxios = new index_1.Fxios();
        fetchMock.post(mockUrls.post, mockData.post);
        yield fxios.post(mockUrls.post, { body: data });
        let lastPost = fetchMock.lastCall().request;
        expect(lastPost.body).toBe(JSON.stringify(data));
        yield fxios.post(mockUrls.post, { body: Object.create(null) });
        lastPost = fetchMock.lastCall().request;
        expect(lastPost.body).toBe(JSON.stringify({}));
    }));
    it('post方法，测试post string', () => {
        const data = 'abcdefaesdf';
        const fxios = new index_1.Fxios();
        fetchMock.post(mockUrls.post, mockData.post);
        return fxios.post(mockUrls.post, { body: data }).then(res => {
            const lastPost = fetchMock.lastCall().request;
            expect(lastPost.body).toBe(data);
        });
    });
    it('post方法，测试post Buffer', () => {
        const data = Buffer.alloc(8);
        const fxios = new index_1.Fxios();
        fetchMock.post(mockUrls.post, mockData.post);
        return fxios.post(mockUrls.post, { body: data }).then(res => {
            const lastPost = fetchMock.lastCall().request;
            expect(lastPost.body).toBe(data);
        });
    });
    it('interceptor.catch', done => {
        const fxios = new index_1.Fxios();
        fxios.interceptor.catch = (err, req) => {
            expect(err).toBeInstanceOf(Error);
            expect(req).toBeInstanceOf(Request);
            done();
        };
        fxios.interceptor.response = (res, req) => {
            if (res.status !== 200) {
                throw new Error(res.status);
            }
        };
        const init = { status: 404 };
        const res = new Response(undefined, init);
        fetchMock.get(mockUrls.get, res);
        fxios.get(mockUrls.get);
    });
    it('当没有interceptor.catch时，通过普通catch可以捕获错误', done => {
        const fxios = new index_1.Fxios();
        fxios.interceptor.response = (res, req) => {
            if (res.status !== 200) {
                throw new Error(res.status);
            }
        };
        const init = { status: 404 };
        const res = new Response(undefined, init);
        fetchMock.get(mockUrls.get, res);
        fxios.get(mockUrls.get).catch(err => {
            expect(err).toBeInstanceOf(Error);
            done();
        });
    });
    it(`测试runtimeConfig更改baseURL`, () => {
        const fxios = new index_1.Fxios({
            baseURL: '/api/',
        });
        fetchMock.get('/xxx/abc', mockData.get);
        return fxios
            .get('abc', undefined, {
            baseURL: '/xxx/',
        })
            .then((res) => {
            expect(res).toBeInstanceOf(Response);
        });
    });
    it('测试query中有数组的情况', () => {
        const fxios = new index_1.Fxios({
            baseURL: '/api/',
        });
        fetchMock.get('/api/abc?type=a&type=b', mockData.get);
        return fxios
            .get('abc', {
            query: {
                type: ['a', 'b'],
            },
        })
            .then(res => {
            expect(res).toBeInstanceOf(Response);
        });
    });
    it('测试url参数param中有乱码字符', () => {
        const fxios = new index_1.Fxios({
            baseURL: '/api/',
        });
        fetchMock.get('/api/%25EF%25BF%25BD%25EF%25BF%25BDt%25E7%259C%259F%25E5%25AE%259E18ww', mockData.get);
        return fxios
            .get(':name', {
            param: {
                name: '��t真实18ww',
            },
        })
            .then(res => {
            expect(res).toBeInstanceOf(Response);
        });
    });
    describe('测试自定义http方法', () => {
        it('扩展trace方法', () => __awaiter(this, void 0, void 0, function* () {
            const fxios = new index_1.Fxios({});
            expect('trace' in fxios).toBe(false);
            fxios.extendHttpMethod('trace');
            expect('trace' in fxios).not.toBe(false);
            const url = '/xxx/abc';
            fetchMock.mock(url, 200);
            yield fxios.trace(url);
            const lastPost = fetchMock.lastCall().request;
            expect(lastPost.method).toBe('trace');
        }));
    });
});
