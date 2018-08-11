// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../compiler/token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = function Token(type, value, extra) {
    _classCallCheck(this, Token);

    this.type = type;

    if (value) {
        this.value = value;
    }

    if (extra) {
        Object.assign(this, extra);
    }
};

exports.default = Token;
},{}],"../compiler/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
    function State() {
        _classCallCheck(this, State);

        this.state = [];
    }

    _createClass(State, [{
        key: "push",
        value: function push(name) {
            this.state.push(name);
        }
    }, {
        key: "pop",
        value: function pop(name) {
            if (name === undefined || this.is(name)) {
                this.state.pop();
            }
        }
    }, {
        key: "is",
        value: function is(name) {
            return this.state[this.state.length - 1] === name;
        }
    }]);

    return State;
}();

exports.default = State;
},{}],"../compiler/lexer.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _token = require('./token');

var _token2 = _interopRequireDefault(_token);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qname = '((?:' + ncname + '\\:)?' + ncname + ')';
var _startTagOpen = new RegExp('^<' + qname);
var _startTagClose = /^(\/?)>/;
var _attribute = /^([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var _endTag = new RegExp('^<\\/' + qname + '[^>]*>');
var _whitespace = /^\s+/;
var _text = /^[^\x00]/;
// TODO doctype, comment

var Lexer = function () {
    function Lexer(_ref) {
        var _ref$source = _ref.source,
            source = _ref$source === undefined ? '' : _ref$source,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options;

        _classCallCheck(this, Lexer);

        this.source = source;
        this.rest = source;
        this.options = options;
        this.tokens = [];
        this.state = new _state2.default();
    }

    _createClass(Lexer, [{
        key: 'lexer',
        value: function lexer() {
            if (this.options.trim) {
                this.rest = this.rest.trim();
            }
            var token = this.advance();
            while (token && token.type !== 'eof') {
                this.tokens.push(token);
                token = this.advance();
            }
            this.tokens.push(new _token2.default('eof'));
            return this.tokens;
        }
    }, {
        key: 'advance',
        value: function advance() {
            var token = this.eof() || this.whitespace() || this.startTagOpen() || this.attribute() || this.startTagClose() || this.endTag() || this.text();

            return token;
        }
    }, {
        key: 'skip',
        value: function skip(length) {
            this.rest = this.rest.slice(length);
        }
    }, {
        key: 'eof',
        value: function eof() {
            if (this.rest.length > 0) return false;
            return new _token2.default('eof');
        }
    }, {
        key: 'whitespace',
        value: function whitespace() {
            var res = _whitespace.exec(this.rest);

            if (res) {
                this.skip(res[0].length);
                return new _token2.default('whitespace', res[0]);
            }
            return false;
        }
    }, {
        key: 'startTagOpen',
        value: function startTagOpen() {
            var res = _startTagOpen.exec(this.rest);

            if (res) {
                this.state.push('startTagOpen');
                this.skip(res[0].length);
                return new _token2.default('startTagOpen', res[0]);
            }
            return false;
        }
    }, {
        key: 'attribute',
        value: function attribute() {
            if (!this.state.is('startTagOpen')) return false;

            var res = _attribute.exec(this.rest);

            if (res) {
                this.skip(res[0].length);
                var name = res[1];
                var value = res[3] || res[4] || res[5];
                return new _token2.default('attribute', { name: name, value: value });
            }
            return false;
        }
    }, {
        key: 'startTagClose',
        value: function startTagClose() {
            if (!this.state.is('startTagOpen')) return false;

            var res = _startTagClose.exec(this.rest);

            if (res) {
                this.state.pop();
                this.skip(res[0].length);
                return new _token2.default('startTagClose', res[0]);
            }
            return false;
        }
    }, {
        key: 'endTag',
        value: function endTag() {
            var res = _endTag.exec(this.rest);

            if (res) {
                this.skip(res[0].length);
                return new _token2.default('endTag', res[0]);
            }
            return false;
        }
    }, {
        key: 'text',
        value: function text() {
            if (this.state.is('startTagOpen')) return false;

            var res = _text.exec(this.rest);

            if (res) {
                this.skip(res[0].length);
                return new _token2.default('text', res[0]);
            }
            return false;
        }
    }]);

    return Lexer;
}();

exports.default = Lexer;
},{"./token":"../compiler/token.js","./state":"../compiler/state.js"}],"../compiler/parser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {};
},{}],"../compiler/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Parser = exports.Lexer = undefined;

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Lexer = _lexer2.default;
exports.Parser = _parser2.default;
},{"./lexer":"../compiler/lexer.js","./parser":"../compiler/parser.js"}],"../index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _compiler = require('./compiler');

Object.defineProperty(exports, 'Lexer', {
  enumerable: true,
  get: function () {
    return _compiler.Lexer;
  }
});
Object.defineProperty(exports, 'Parser', {
  enumerable: true,
  get: function () {
    return _compiler.Parser;
  }
});
},{"./compiler":"../compiler/index.js"}],"lexer.js":[function(require,module,exports) {
'use strict';

var _index = require('../../index');

var source = '\n    <div id="app">\n        <input type="text" v-model="name">\n        <p>{{name}}</p>\n    </div>\n';

var tokens = new _index.Lexer({
    source: source
}).lexer();

console.log(tokens);
},{"../../index":"../index.js"}],"../../node_modules/_parcel-bundler@1.9.7@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '50489' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../node_modules/_parcel-bundler@1.9.7@parcel-bundler/src/builtins/hmr-runtime.js","lexer.js"], null)
//# sourceMappingURL=/lexer.c1303547.map