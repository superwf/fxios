(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.fxios = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
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
    }

    /**
     * Expose `pathToRegexp`.
     */
    var compile_1 = compile;

    /**
     * Default configs.
     */
    var DEFAULT_DELIMITER = '/';

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
      // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
      '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {string}  str
     * @param  {Object=} options
     * @return {!Array}
     */
    function parse (str, options) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER;
      var whitelist = (options && options.whitelist) || undefined;
      var pathEscaped = false;
      var res;

      while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          pathEscaped = true;
          continue
        }

        var prev = '';
        var name = res[2];
        var capture = res[3];
        var group = res[4];
        var modifier = res[5];

        if (!pathEscaped && path.length) {
          var k = path.length - 1;
          var c = path[k];
          var matches = whitelist ? whitelist.indexOf(c) > -1 : true;

          if (matches) {
            prev = c;
            path = path.slice(0, k);
          }
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
          pathEscaped = false;
        }

        var repeat = modifier === '+' || modifier === '*';
        var optional = modifier === '?' || modifier === '*';
        var pattern = capture || group;
        var delimiter = prev || defaultDelimiter;

        tokens.push({
          name: name || key++,
          prefix: prev,
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: pattern
            ? escapeGroup(pattern)
            : '[^' + escapeString(delimiter === defaultDelimiter ? delimiter : (delimiter + defaultDelimiter)) + ']+?'
        });
      }

      // Push any remaining characters.
      if (path || index < str.length) {
        tokens.push(path + str.substr(index));
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {string}             str
     * @param  {Object=}            options
     * @return {!function(Object=, Object=)}
     */
    function compile (str, options) {
      return tokensToFunction(parse(str, options))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
        }
      }

      return function (data, options) {
        var path = '';
        var encode = (options && options.encode) || encodeURIComponent;

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;
            continue
          }

          var value = data ? data[token.name] : undefined;
          var segment;

          if (Array.isArray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but got array')
            }

            if (value.length === 0) {
              if (token.optional) continue

              throw new TypeError('Expected "' + token.name + '" to not be empty')
            }

            for (var j = 0; j < value.length; j++) {
              segment = encode(value[j], token);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            segment = encode(String(value), token);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but got "' + segment + '"')
            }

            path += token.prefix + segment;
            continue
          }

          if (token.optional) continue

          throw new TypeError('Expected "' + token.name + '" to be ' + (token.repeat ? 'an array' : 'a string'))
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {string} str
     * @return {string}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {string} group
     * @return {string}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$/()])/g, '\\$1')
    }

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var punycode = createCommonjsModule(function (module, exports) {
    (function(root) {

    	/** Detect free variables */
    	var freeExports = exports &&
    		!exports.nodeType && exports;
    	var freeModule = module &&
    		!module.nodeType && module;
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
    	if (
    		freeGlobal.global === freeGlobal ||
    		freeGlobal.window === freeGlobal ||
    		freeGlobal.self === freeGlobal
    	) {
    		root = freeGlobal;
    	}

    	/**
    	 * The `punycode` object.
    	 * @name punycode
    	 * @type Object
    	 */
    	var punycode,

    	/** Highest positive signed 32-bit float value */
    	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

    	/** Bootstring parameters */
    	base = 36,
    	tMin = 1,
    	tMax = 26,
    	skew = 38,
    	damp = 700,
    	initialBias = 72,
    	initialN = 128, // 0x80
    	delimiter = '-', // '\x2D'

    	/** Regular expressions */
    	regexPunycode = /^xn--/,
    	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
    	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

    	/** Error messages */
    	errors = {
    		'overflow': 'Overflow: input needs wider integers to process',
    		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    		'invalid-input': 'Invalid input'
    	},

    	/** Convenience shortcuts */
    	baseMinusTMin = base - tMin,
    	floor = Math.floor,
    	stringFromCharCode = String.fromCharCode,

    	/** Temporary variable */
    	key;

    	/*--------------------------------------------------------------------------*/

    	/**
    	 * A generic error utility function.
    	 * @private
    	 * @param {String} type The error type.
    	 * @returns {Error} Throws a `RangeError` with the applicable error message.
    	 */
    	function error(type) {
    		throw RangeError(errors[type]);
    	}

    	/**
    	 * A generic `Array#map` utility function.
    	 * @private
    	 * @param {Array} array The array to iterate over.
    	 * @param {Function} callback The function that gets called for every array
    	 * item.
    	 * @returns {Array} A new array of values returned by the callback function.
    	 */
    	function map(array, fn) {
    		var length = array.length;
    		var result = [];
    		while (length--) {
    			result[length] = fn(array[length]);
    		}
    		return result;
    	}

    	/**
    	 * A simple `Array#map`-like wrapper to work with domain name strings or email
    	 * addresses.
    	 * @private
    	 * @param {String} domain The domain name or email address.
    	 * @param {Function} callback The function that gets called for every
    	 * character.
    	 * @returns {Array} A new string of characters returned by the callback
    	 * function.
    	 */
    	function mapDomain(string, fn) {
    		var parts = string.split('@');
    		var result = '';
    		if (parts.length > 1) {
    			// In email addresses, only the domain name should be punycoded. Leave
    			// the local part (i.e. everything up to `@`) intact.
    			result = parts[0] + '@';
    			string = parts[1];
    		}
    		// Avoid `split(regex)` for IE8 compatibility. See #17.
    		string = string.replace(regexSeparators, '\x2E');
    		var labels = string.split('.');
    		var encoded = map(labels, fn).join('.');
    		return result + encoded;
    	}

    	/**
    	 * Creates an array containing the numeric code points of each Unicode
    	 * character in the string. While JavaScript uses UCS-2 internally,
    	 * this function will convert a pair of surrogate halves (each of which
    	 * UCS-2 exposes as separate characters) into a single code point,
    	 * matching UTF-16.
    	 * @see `punycode.ucs2.encode`
    	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
    	 * @memberOf punycode.ucs2
    	 * @name decode
    	 * @param {String} string The Unicode input string (UCS-2).
    	 * @returns {Array} The new array of code points.
    	 */
    	function ucs2decode(string) {
    		var output = [],
    		    counter = 0,
    		    length = string.length,
    		    value,
    		    extra;
    		while (counter < length) {
    			value = string.charCodeAt(counter++);
    			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
    				// high surrogate, and there is a next character
    				extra = string.charCodeAt(counter++);
    				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
    					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
    				} else {
    					// unmatched surrogate; only append this code unit, in case the next
    					// code unit is the high surrogate of a surrogate pair
    					output.push(value);
    					counter--;
    				}
    			} else {
    				output.push(value);
    			}
    		}
    		return output;
    	}

    	/**
    	 * Creates a string based on an array of numeric code points.
    	 * @see `punycode.ucs2.decode`
    	 * @memberOf punycode.ucs2
    	 * @name encode
    	 * @param {Array} codePoints The array of numeric code points.
    	 * @returns {String} The new Unicode string (UCS-2).
    	 */
    	function ucs2encode(array) {
    		return map(array, function(value) {
    			var output = '';
    			if (value > 0xFFFF) {
    				value -= 0x10000;
    				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
    				value = 0xDC00 | value & 0x3FF;
    			}
    			output += stringFromCharCode(value);
    			return output;
    		}).join('');
    	}

    	/**
    	 * Converts a basic code point into a digit/integer.
    	 * @see `digitToBasic()`
    	 * @private
    	 * @param {Number} codePoint The basic numeric code point value.
    	 * @returns {Number} The numeric value of a basic code point (for use in
    	 * representing integers) in the range `0` to `base - 1`, or `base` if
    	 * the code point does not represent a value.
    	 */
    	function basicToDigit(codePoint) {
    		if (codePoint - 48 < 10) {
    			return codePoint - 22;
    		}
    		if (codePoint - 65 < 26) {
    			return codePoint - 65;
    		}
    		if (codePoint - 97 < 26) {
    			return codePoint - 97;
    		}
    		return base;
    	}

    	/**
    	 * Converts a digit/integer into a basic code point.
    	 * @see `basicToDigit()`
    	 * @private
    	 * @param {Number} digit The numeric value of a basic code point.
    	 * @returns {Number} The basic code point whose value (when used for
    	 * representing integers) is `digit`, which needs to be in the range
    	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
    	 * used; else, the lowercase form is used. The behavior is undefined
    	 * if `flag` is non-zero and `digit` has no uppercase form.
    	 */
    	function digitToBasic(digit, flag) {
    		//  0..25 map to ASCII a..z or A..Z
    		// 26..35 map to ASCII 0..9
    		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    	}

    	/**
    	 * Bias adaptation function as per section 3.4 of RFC 3492.
    	 * http://tools.ietf.org/html/rfc3492#section-3.4
    	 * @private
    	 */
    	function adapt(delta, numPoints, firstTime) {
    		var k = 0;
    		delta = firstTime ? floor(delta / damp) : delta >> 1;
    		delta += floor(delta / numPoints);
    		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
    			delta = floor(delta / baseMinusTMin);
    		}
    		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    	}

    	/**
    	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
    	 * symbols.
    	 * @memberOf punycode
    	 * @param {String} input The Punycode string of ASCII-only symbols.
    	 * @returns {String} The resulting string of Unicode symbols.
    	 */
    	function decode(input) {
    		// Don't use UCS-2
    		var output = [],
    		    inputLength = input.length,
    		    out,
    		    i = 0,
    		    n = initialN,
    		    bias = initialBias,
    		    basic,
    		    j,
    		    index,
    		    oldi,
    		    w,
    		    k,
    		    digit,
    		    t,
    		    /** Cached calculation results */
    		    baseMinusT;

    		// Handle the basic code points: let `basic` be the number of input code
    		// points before the last delimiter, or `0` if there is none, then copy
    		// the first basic code points to the output.

    		basic = input.lastIndexOf(delimiter);
    		if (basic < 0) {
    			basic = 0;
    		}

    		for (j = 0; j < basic; ++j) {
    			// if it's not a basic code point
    			if (input.charCodeAt(j) >= 0x80) {
    				error('not-basic');
    			}
    			output.push(input.charCodeAt(j));
    		}

    		// Main decoding loop: start just after the last delimiter if any basic code
    		// points were copied; start at the beginning otherwise.

    		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

    			// `index` is the index of the next character to be consumed.
    			// Decode a generalized variable-length integer into `delta`,
    			// which gets added to `i`. The overflow checking is easier
    			// if we increase `i` as we go, then subtract off its starting
    			// value at the end to obtain `delta`.
    			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

    				if (index >= inputLength) {
    					error('invalid-input');
    				}

    				digit = basicToDigit(input.charCodeAt(index++));

    				if (digit >= base || digit > floor((maxInt - i) / w)) {
    					error('overflow');
    				}

    				i += digit * w;
    				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

    				if (digit < t) {
    					break;
    				}

    				baseMinusT = base - t;
    				if (w > floor(maxInt / baseMinusT)) {
    					error('overflow');
    				}

    				w *= baseMinusT;

    			}

    			out = output.length + 1;
    			bias = adapt(i - oldi, out, oldi == 0);

    			// `i` was supposed to wrap around from `out` to `0`,
    			// incrementing `n` each time, so we'll fix that now:
    			if (floor(i / out) > maxInt - n) {
    				error('overflow');
    			}

    			n += floor(i / out);
    			i %= out;

    			// Insert `n` at position `i` of the output
    			output.splice(i++, 0, n);

    		}

    		return ucs2encode(output);
    	}

    	/**
    	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
    	 * Punycode string of ASCII-only symbols.
    	 * @memberOf punycode
    	 * @param {String} input The string of Unicode symbols.
    	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
    	 */
    	function encode(input) {
    		var n,
    		    delta,
    		    handledCPCount,
    		    basicLength,
    		    bias,
    		    j,
    		    m,
    		    q,
    		    k,
    		    t,
    		    currentValue,
    		    output = [],
    		    /** `inputLength` will hold the number of code points in `input`. */
    		    inputLength,
    		    /** Cached calculation results */
    		    handledCPCountPlusOne,
    		    baseMinusT,
    		    qMinusT;

    		// Convert the input in UCS-2 to Unicode
    		input = ucs2decode(input);

    		// Cache the length
    		inputLength = input.length;

    		// Initialize the state
    		n = initialN;
    		delta = 0;
    		bias = initialBias;

    		// Handle the basic code points
    		for (j = 0; j < inputLength; ++j) {
    			currentValue = input[j];
    			if (currentValue < 0x80) {
    				output.push(stringFromCharCode(currentValue));
    			}
    		}

    		handledCPCount = basicLength = output.length;

    		// `handledCPCount` is the number of code points that have been handled;
    		// `basicLength` is the number of basic code points.

    		// Finish the basic string - if it is not empty - with a delimiter
    		if (basicLength) {
    			output.push(delimiter);
    		}

    		// Main encoding loop:
    		while (handledCPCount < inputLength) {

    			// All non-basic code points < n have been handled already. Find the next
    			// larger one:
    			for (m = maxInt, j = 0; j < inputLength; ++j) {
    				currentValue = input[j];
    				if (currentValue >= n && currentValue < m) {
    					m = currentValue;
    				}
    			}

    			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    			// but guard against overflow
    			handledCPCountPlusOne = handledCPCount + 1;
    			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
    				error('overflow');
    			}

    			delta += (m - n) * handledCPCountPlusOne;
    			n = m;

    			for (j = 0; j < inputLength; ++j) {
    				currentValue = input[j];

    				if (currentValue < n && ++delta > maxInt) {
    					error('overflow');
    				}

    				if (currentValue == n) {
    					// Represent delta as a generalized variable-length integer
    					for (q = delta, k = base; /* no condition */; k += base) {
    						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
    						if (q < t) {
    							break;
    						}
    						qMinusT = q - t;
    						baseMinusT = base - t;
    						output.push(
    							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
    						);
    						q = floor(qMinusT / baseMinusT);
    					}

    					output.push(stringFromCharCode(digitToBasic(q, 0)));
    					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
    					delta = 0;
    					++handledCPCount;
    				}
    			}

    			++delta;
    			++n;

    		}
    		return output.join('');
    	}

    	/**
    	 * Converts a Punycode string representing a domain name or an email address
    	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
    	 * it doesn't matter if you call it on a string that has already been
    	 * converted to Unicode.
    	 * @memberOf punycode
    	 * @param {String} input The Punycoded domain name or email address to
    	 * convert to Unicode.
    	 * @returns {String} The Unicode representation of the given Punycode
    	 * string.
    	 */
    	function toUnicode(input) {
    		return mapDomain(input, function(string) {
    			return regexPunycode.test(string)
    				? decode(string.slice(4).toLowerCase())
    				: string;
    		});
    	}

    	/**
    	 * Converts a Unicode string representing a domain name or an email address to
    	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
    	 * i.e. it doesn't matter if you call it with a domain that's already in
    	 * ASCII.
    	 * @memberOf punycode
    	 * @param {String} input The domain name or email address to convert, as a
    	 * Unicode string.
    	 * @returns {String} The Punycode representation of the given domain name or
    	 * email address.
    	 */
    	function toASCII(input) {
    		return mapDomain(input, function(string) {
    			return regexNonASCII.test(string)
    				? 'xn--' + encode(string)
    				: string;
    		});
    	}

    	/*--------------------------------------------------------------------------*/

    	/** Define the public API */
    	punycode = {
    		/**
    		 * A string representing the current Punycode.js version number.
    		 * @memberOf punycode
    		 * @type String
    		 */
    		'version': '1.3.2',
    		/**
    		 * An object of methods to convert from JavaScript's internal character
    		 * representation (UCS-2) to Unicode code points, and back.
    		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
    		 * @memberOf punycode
    		 * @type Object
    		 */
    		'ucs2': {
    			'decode': ucs2decode,
    			'encode': ucs2encode
    		},
    		'decode': decode,
    		'encode': encode,
    		'toASCII': toASCII,
    		'toUnicode': toUnicode
    	};

    	/** Expose `punycode` */
    	// Some AMD build optimizers, like r.js, check for specific condition patterns
    	// like the following:
    	if (freeExports && freeModule) {
    		if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
    			freeModule.exports = punycode;
    		} else { // in Narwhal or RingoJS v0.7.0-
    			for (key in punycode) {
    				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
    			}
    		}
    	} else { // in Rhino or a web browser
    		root.punycode = punycode;
    	}

    }(commonjsGlobal));
    });

    var util = {
      isString: function(arg) {
        return typeof(arg) === 'string';
      },
      isObject: function(arg) {
        return typeof(arg) === 'object' && arg !== null;
      },
      isNull: function(arg) {
        return arg === null;
      },
      isNullOrUndefined: function(arg) {
        return arg == null;
      }
    };

    // Copyright Joyent, Inc. and other Node contributors.

    // If obj.hasOwnProperty has been overridden, then calling
    // obj.hasOwnProperty(prop) will break.
    // See: https://github.com/joyent/node/issues/1707
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var decode = function(qs, sep, eq, options) {
      sep = sep || '&';
      eq = eq || '=';
      var obj = {};

      if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
      }

      var regexp = /\+/g;
      qs = qs.split(sep);

      var maxKeys = 1000;
      if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
      }

      var len = qs.length;
      // maxKeys <= 0 means that we should not limit keys count
      if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
      }

      for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
          kstr = x.substr(0, idx);
          vstr = x.substr(idx + 1);
        } else {
          kstr = x;
          vstr = '';
        }

        k = decodeURIComponent(kstr);
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {
          obj[k] = v;
        } else if (Array.isArray(obj[k])) {
          obj[k].push(v);
        } else {
          obj[k] = [obj[k], v];
        }
      }

      return obj;
    };

    // Copyright Joyent, Inc. and other Node contributors.

    var stringifyPrimitive = function(v) {
      switch (typeof v) {
        case 'string':
          return v;

        case 'boolean':
          return v ? 'true' : 'false';

        case 'number':
          return isFinite(v) ? v : '';

        default:
          return '';
      }
    };

    var encode = function(obj, sep, eq, name) {
      sep = sep || '&';
      eq = eq || '=';
      if (obj === null) {
        obj = undefined;
      }

      if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
          var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
          if (Array.isArray(obj[k])) {
            return obj[k].map(function(v) {
              return ks + encodeURIComponent(stringifyPrimitive(v));
            }).join(sep);
          } else {
            return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
          }
        }).join(sep);

      }

      if (!name) return '';
      return encodeURIComponent(stringifyPrimitive(name)) + eq +
             encodeURIComponent(stringifyPrimitive(obj));
    };

    var querystring = createCommonjsModule(function (module, exports) {

    exports.decode = exports.parse = decode;
    exports.encode = exports.stringify = encode;
    });
    var querystring_1 = querystring.decode;
    var querystring_2 = querystring.parse;
    var querystring_3 = querystring.encode;
    var querystring_4 = querystring.stringify;

    var parse$1 = urlParse;
    var format = urlFormat;

    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }

    // Reference: RFC 3986, RFC 1808, RFC 2396

    // define these here so at least they only have to be
    // compiled once on the first module load.
    var protocolPattern = /^([a-z0-9.+-]+:)/i,
        portPattern = /:[0-9]*$/,

        // Special case for a simple path URL
        simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

        // RFC 2396: characters reserved for delimiting URLs.
        // We actually just auto-escape these.
        delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

        // RFC 2396: characters not allowed for various reasons.
        unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

        // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
        autoEscape = ['\''].concat(unwise),
        // Characters that are never ever allowed in a hostname.
        // Note that any invalid chars are also handled, but these
        // are the ones that are *expected* to be seen, so we fast-path
        // them.
        nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
        hostEndingChars = ['/', '?', '#'],
        hostnameMaxLen = 255,
        hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
        hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        // protocols that can allow "unsafe" and "unwise" chars.
        unsafeProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that never have a hostname.
        hostlessProtocol = {
          'javascript': true,
          'javascript:': true
        },
        // protocols that always contain a // bit.
        slashedProtocol = {
          'http': true,
          'https': true,
          'ftp': true,
          'gopher': true,
          'file': true,
          'http:': true,
          'https:': true,
          'ftp:': true,
          'gopher:': true,
          'file:': true
        };

    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && util.isObject(url) && url instanceof Url) return url;

      var u = new Url;
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }

    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (!util.isString(url)) {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }

      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      var queryIndex = url.indexOf('?'),
          splitter =
              (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
          uSplit = url.split(splitter),
          slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, '/');
      url = uSplit.join(splitter);

      var rest = url;

      // trim before proceeding.
      // This is to support parse stuff like "  http://foo.com  \n"
      rest = rest.trim();

      if (!slashesDenoteHost && url.split('#').length === 1) {
        // Try fast path regexp
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = '';
            this.query = {};
          }
          return this;
        }
      }

      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }

      // figure out if it's got a host
      // user@server is *always* interpreted as a hostname, and url
      // resolution will treat //foo/bar as host=foo,path=bar because that's
      // how the browser resolves relative URLs.
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var slashes = rest.substr(0, 2) === '//';
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }

      if (!hostlessProtocol[proto] &&
          (slashes || (proto && !slashedProtocol[proto]))) {

        // there's a hostname.
        // the first instance of /, ?, ;, or # ends the host.
        //
        // If there is an @ in the hostname, then non-host chars *are* allowed
        // to the left of the last @ sign, unless some host-ending character
        // comes *before* the @-sign.
        // URLs are obnoxious.
        //
        // ex:
        // http://a@b@c/ => user:a@b host:c
        // http://a@b?@c => user:a host:c path:/?@c

        // v0.12 TODO(isaacs): This is not quite how Chrome does things.
        // Review our test case against browsers more comprehensively.

        // find the first instance of any hostEndingChars
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }

        // at this point, either we have an explicit point where the
        // auth portion cannot go past, or the last @ char is the decider.
        var auth, atSign;
        if (hostEnd === -1) {
          // atSign can be anywhere.
          atSign = rest.lastIndexOf('@');
        } else {
          // atSign must be in auth portion.
          // http://a@b/c@d => host:b auth:a path:/c@d
          atSign = rest.lastIndexOf('@', hostEnd);
        }

        // Now we have a portion which is definitely the auth.
        // Pull that off.
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }

        // the host is the remaining to the left of the first non-host char
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
            hostEnd = hec;
        }
        // if we still have not hit it, then the entire thing is a host.
        if (hostEnd === -1)
          hostEnd = rest.length;

        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);

        // pull out port.
        this.parseHost();

        // we've indicated that there is a hostname,
        // so even if it's empty, it has to be present.
        this.hostname = this.hostname || '';

        // if hostname begins with [ and ends with ]
        // assume that it's an IPv6 address.
        var ipv6Hostname = this.hostname[0] === '[' &&
            this.hostname[this.hostname.length - 1] === ']';

        // validate a little.
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) continue;
            if (!part.match(hostnamePartPattern)) {
              var newpart = '';
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  // we replace non-ASCII char with a temporary placeholder
                  // we need this to make sure size of hostname is not
                  // broken by replacing non-ASCII by nothing
                  newpart += 'x';
                } else {
                  newpart += part[j];
                }
              }
              // we test again with ASCII char only
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = '/' + notHost.join('.') + rest;
                }
                this.hostname = validParts.join('.');
                break;
              }
            }
          }
        }

        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = '';
        } else {
          // hostnames are always lower case.
          this.hostname = this.hostname.toLowerCase();
        }

        if (!ipv6Hostname) {
          // IDNA Support: Returns a punycoded representation of "domain".
          // It only converts parts of the domain name that
          // have non-ASCII characters, i.e. it doesn't matter if
          // you call it with a domain that already is ASCII-only.
          this.hostname = punycode.toASCII(this.hostname);
        }

        var p = this.port ? ':' + this.port : '';
        var h = this.hostname || '';
        this.host = h + p;
        this.href += this.host;

        // strip [ and ] from the hostname
        // the host field still retains them, though
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== '/') {
            rest = '/' + rest;
          }
        }
      }

      // now rest is set to the post-host stuff.
      // chop off any delim chars.
      if (!unsafeProtocol[lowerProto]) {

        // First, make 100% sure that any "autoEscape" chars get
        // escaped, even if encodeURIComponent doesn't think they
        // need to be.
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1)
            continue;
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }


      // chop off from the tail first.
      var hash = rest.indexOf('#');
      if (hash !== -1) {
        // got a fragment string.
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf('?');
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        // no query string, but parseQueryString still requested
        this.search = '';
        this.query = {};
      }
      if (rest) this.pathname = rest;
      if (slashedProtocol[lowerProto] &&
          this.hostname && !this.pathname) {
        this.pathname = '/';
      }

      //to support http.request
      if (this.pathname || this.search) {
        var p = this.pathname || '';
        var s = this.search || '';
        this.path = p + s;
      }

      // finally, reconstruct the href based on what has been validated.
      this.href = this.format();
      return this;
    };

    // format a parsed object into a url string
    function urlFormat(obj) {
      // ensure it's an object, and not a string url.
      // If it's an obj, this is a no-op.
      // this way, you can call url_format() on strings
      // to clean up potentially wonky urls.
      if (util.isString(obj)) obj = urlParse(obj);
      if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
      return obj.format();
    }

    Url.prototype.format = function() {
      var auth = this.auth || '';
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ':');
        auth += '@';
      }

      var protocol = this.protocol || '',
          pathname = this.pathname || '',
          hash = this.hash || '',
          host = false,
          query = '';

      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(':') === -1 ?
            this.hostname :
            '[' + this.hostname + ']');
        if (this.port) {
          host += ':' + this.port;
        }
      }

      if (this.query &&
          util.isObject(this.query) &&
          Object.keys(this.query).length) {
        query = querystring.stringify(this.query);
      }

      var search = this.search || (query && ('?' + query)) || '';

      if (protocol && protocol.substr(-1) !== ':') protocol += ':';

      // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
      // unless they had them to begin with.
      if (this.slashes ||
          (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
      } else if (!host) {
        host = '';
      }

      if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
      if (search && search.charAt(0) !== '?') search = '?' + search;

      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace('#', '%23');

      return protocol + host + pathname + search + hash;
    };

    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };

    Url.prototype.resolveObject = function(relative) {
      if (util.isString(relative)) {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }

      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }

      // hash is always overridden, no matter what.
      // even href="" will remove it.
      result.hash = relative.hash;

      // if the relative url is empty, then there's nothing left to do here.
      if (relative.href === '') {
        result.href = result.format();
        return result;
      }

      // hrefs like //foo/bar always cut to the protocol.
      if (relative.slashes && !relative.protocol) {
        // take everything except the protocol from relative
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== 'protocol')
            result[rkey] = relative[rkey];
        }

        //urlParse appends trailing / to urls like http://www.example.com
        if (slashedProtocol[result.protocol] &&
            result.hostname && !result.pathname) {
          result.path = result.pathname = '/';
        }

        result.href = result.format();
        return result;
      }

      if (relative.protocol && relative.protocol !== result.protocol) {
        // if it's a known url protocol, then changing
        // the protocol does weird things
        // first, if it's not file:, then we MUST have a host,
        // and if there was a path
        // to begin with, then we MUST have a path.
        // if it is file:, then the host is dropped,
        // because that's known to be hostless.
        // anything else is assumed to be absolute.
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }

        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || '').split('/');
          while (relPath.length && !(relative.host = relPath.shift()));
          if (!relative.host) relative.host = '';
          if (!relative.hostname) relative.hostname = '';
          if (relPath[0] !== '') relPath.unshift('');
          if (relPath.length < 2) relPath.unshift('');
          result.pathname = relPath.join('/');
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || '';
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        // to support http.request
        if (result.pathname || result.search) {
          var p = result.pathname || '';
          var s = result.search || '';
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }

      var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
          isRelAbs = (
              relative.host ||
              relative.pathname && relative.pathname.charAt(0) === '/'
          ),
          mustEndAbs = (isRelAbs || isSourceAbs ||
                        (result.host && relative.pathname)),
          removeAllDots = mustEndAbs,
          srcPath = result.pathname && result.pathname.split('/') || [],
          relPath = relative.pathname && relative.pathname.split('/') || [],
          psychotic = result.protocol && !slashedProtocol[result.protocol];

      // if the url is a non-slashed url, then relative
      // links like ../.. should be able
      // to crawl up to the hostname, as well.  This is strange.
      // result.protocol has already been set by now.
      // Later on, put the first path part into the host field.
      if (psychotic) {
        result.hostname = '';
        result.port = null;
        if (result.host) {
          if (srcPath[0] === '') srcPath[0] = result.host;
          else srcPath.unshift(result.host);
        }
        result.host = '';
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === '') relPath[0] = relative.host;
            else relPath.unshift(relative.host);
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
      }

      if (isRelAbs) {
        // it's absolute.
        result.host = (relative.host || relative.host === '') ?
                      relative.host : result.host;
        result.hostname = (relative.hostname || relative.hostname === '') ?
                          relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
        // fall through to the dot-handling below.
      } else if (relPath.length) {
        // it's relative
        // throw away the existing file, and take the new path instead.
        if (!srcPath) srcPath = [];
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (!util.isNullOrUndefined(relative.search)) {
        // just pull out the search.
        // like href='?foo'.
        // Put this after the other two cases because it simplifies the booleans
        if (psychotic) {
          result.hostname = result.host = srcPath.shift();
          //occationaly the auth can get stuck only in host
          //this especially happens in cases like
          //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
          var authInHost = result.host && result.host.indexOf('@') > 0 ?
                           result.host.split('@') : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.host = result.hostname = authInHost.shift();
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        //to support http.request
        if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
          result.path = (result.pathname ? result.pathname : '') +
                        (result.search ? result.search : '');
        }
        result.href = result.format();
        return result;
      }

      if (!srcPath.length) {
        // no path at all.  easy.
        // we've already handled the other stuff above.
        result.pathname = null;
        //to support http.request
        if (result.search) {
          result.path = '/' + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }

      // if a url ENDs in . or .., then it must get a trailing slash.
      // however, if it ends in anything else non-slashy,
      // then it must NOT get a trailing slash.
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (
          (result.host || relative.host || srcPath.length > 1) &&
          (last === '.' || last === '..') || last === '');

      // strip single dots, resolve double dots to parent dir
      // if the path tries to go above the root, `up` ends up > 0
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === '.') {
          srcPath.splice(i, 1);
        } else if (last === '..') {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }

      // if the path is allowed to go above the root, restore leading ..s
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift('..');
        }
      }

      if (mustEndAbs && srcPath[0] !== '' &&
          (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
        srcPath.unshift('');
      }

      if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
        srcPath.push('');
      }

      var isAbsolute = srcPath[0] === '' ||
          (srcPath[0] && srcPath[0].charAt(0) === '/');

      // put the host back
      if (psychotic) {
        result.hostname = result.host = isAbsolute ? '' :
                                        srcPath.length ? srcPath.shift() : '';
        //occationaly the auth can get stuck only in host
        //this especially happens in cases like
        //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
        var authInHost = result.host && result.host.indexOf('@') > 0 ?
                         result.host.split('@') : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.host = result.hostname = authInHost.shift();
        }
      }

      mustEndAbs = mustEndAbs || (result.host && srcPath.length);

      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift('');
      }

      if (!srcPath.length) {
        result.pathname = null;
        result.path = null;
      } else {
        result.pathname = srcPath.join('/');
      }

      //to support request.http
      if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
        result.path = (result.pathname ? result.pathname : '') +
                      (result.search ? result.search : '');
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };

    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ':') {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) this.hostname = host;
    };

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
    var jsonType = 'application/json';
    var parseUrl = function (url, option) {
        if (option && option.path) {
            for (var _i = 0, _a = Object.keys(option.path); _i < _a.length; _i++) {
                var k = _a[_i];
                option.path[k] = encodeURIComponent(String(option.path[k]));
            }
            url = compile_1(url)(option.path);
        }
        if (option && option.query) {
            var urlObject = parse$1(url, true); // true: let the urlObject.query is object
            // see url#format, only search is absent, query will be used
            delete urlObject.search;
            url = format(__assign({}, urlObject, { query: __assign({}, urlObject.query, option.query) }));
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
                            if (typeof option === 'string') {
                                option = {
                                    method: key,
                                    url: option,
                                };
                            }
                            else {
                                option.method = key;
                            }
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
                    if (typeof option === 'string') {
                        option = {
                            method: 'get',
                            url: option,
                        };
                    }
                    option.method = option.method || 'get';
                    baseURL = option.baseURL || this.baseURL;
                    url = baseURL ? "" + baseURL + option.url : option.url;
                    parsedUrl = parseUrl(url, option);
                    requestOption = removeNonRequestInitProperty(option);
                    headers = requestOption.headers || {};
                    if (option.body) {
                        body = option.body;
                        // add application/json header when body is plain object
                        // and auto json stringify the body
                        if (isPlainObject(body)) {
                            requestOption.headers = __assign({ 'Content-Type': jsonType }, headers);
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
    var index = new Fxios();

    exports.Fxios = Fxios;
    exports.default = index;
    exports.isPlainObject = isPlainObject;
    exports.jsonType = jsonType;
    exports.parseUrl = parseUrl;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
