(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('url'), require('querystring'), require('events')) :
  typeof define === 'function' && define.amd ? define(['exports', 'url', 'querystring', 'events'], factory) :
  (factory((global['fetch-maker'] = {}),global.url,global.qs,global.EventEmitter));
}(this, (function (exports,url,qs,EventEmitter) { 'use strict';

  url = url && url.hasOwnProperty('default') ? url['default'] : url;
  qs = qs && qs.hasOwnProperty('default') ? qs['default'] : qs;
  EventEmitter = EventEmitter && EventEmitter.hasOwnProperty('default') ? EventEmitter['default'] : EventEmitter;

  const jsonType = 'application/json';

  const parseUrl = (urlString, query) => {
    if (typeof query === 'string') {
      query = qs.parse(query);
    }
    if (query) {
      const urlObject = url.parse(urlString, true); // true: let the urlObject.query is object
      // see url#format, only search is absent, query will be used
      delete urlObject.search;
      return url.format({
        ...urlObject,
        query: {
          ...urlObject.query,
          ...query,
        },
      })
    }
    return urlString
  };

  const generateMethods = config => {
    const base = config.base || '';
    delete config.base;

    const result = {};

    const thenCallbacks = [];
    const catchCallbacks = [];

    // chain callbacks to promise
    const chainCallbacks = (promise, request) => {
      thenCallbacks.forEach(thenFunc => {
        promise = promise.then(thenFunc);
      });
      catchCallbacks.forEach(catchFunc => {
        promise = promise.catch(error => {
          error.request = request;
          catchFunc(error);
          throw error
        });
      });
      return promise
    }
    ;['get', 'delete'].forEach(method => {
      result[method] = (url$$1, query) => {
        const parsedUrl = parseUrl(url$$1, query);
        const promise = global.fetch(`${base}${parsedUrl}`, { ...config, method });
        return chainCallbacks(promise, { url: url$$1, query })
      };
    })
    ;['post', 'put'].forEach(method => {
      result[method] = (url$$1, data, query) => {
        const parsedUrl = parseUrl(url$$1, query);
        const headers = config.headers || {};
        let body;
        if (typeof data === 'object') {
          body = JSON.stringify(data);
        } else {
          body = data;
        }
        const promise = global.fetch(`${base}${parsedUrl}`, {
          ...config,
          method,
          headers,
          body,
        });
        return chainCallbacks(promise, { url: url$$1, data, query })
      };
    });

    const emitter = new EventEmitter();

    // default max is 10
    // https://nodejs.org/api/events.html#events_emitter_setmaxlisteners_n
    // 1000 should be enough
    emitter.setMaxListeners(1000);

    result.emitter = emitter;
    result.on = emitter.on.bind(emitter);
    result.off = emitter.removeListener.bind(emitter);
    result.emit = emitter.emit.bind(emitter);

    result.config = config;

    result.useThen = func => {
      thenCallbacks.push(func);
    };
    result.useCatch = func => {
      catchCallbacks.push(func);
    };
    return result
  };

  function Fetch(config) {
    const fe = generateMethods(config);
    const fetcher = fe.get;
    Object.assign(fetcher, fe);
    return fetcher
  }

  exports.jsonType = jsonType;
  exports.default = Fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
