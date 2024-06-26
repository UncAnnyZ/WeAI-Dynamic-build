"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SYMBOL_MATCH = 'SYMBOL_MATCH';
var TokenStream = /*#__PURE__*/function () {
  function TokenStream(nodes, parent) {
    _classCallCheck(this, TokenStream);
    this.index = 0;
    this.nodes = nodes;
    this.functionName = parent != null ? parent.value : null;
    this.lastValue = null;
    this.rewindIndex = -1;
  }
  _createClass(TokenStream, [{
    key: "node",
    get: function get() {
      return this.nodes[this.index];
    }
  }, {
    key: "length",
    get: function get() {
      return this.nodes.length;
    }
  }, {
    key: "hasTokens",
    value: function hasTokens() {
      return this.index <= this.length - 1;
    }
  }, {
    key: SYMBOL_MATCH,
    value: function value() {
      if (!this.hasTokens()) return null;
      var node = this.node;
      for (var i = 0; i < arguments.length; i += 1) {
        var tokenDescriptor = i < 0 || arguments.length <= i ? undefined : arguments[i];
        var value = tokenDescriptor(node);
        if (value !== null) {
          this.index += 1;
          this.lastValue = value;
          return value;
        }
      }
      return null;
    }
  }, {
    key: "matches",
    value: function matches() {
      return this[SYMBOL_MATCH].apply(this, arguments) !== null;
    }
  }, {
    key: "expect",
    value: function expect() {
      var value = this[SYMBOL_MATCH].apply(this, arguments);
      return value !== null ? value : this["throw"]();
    }
  }, {
    key: "matchesFunction",
    value: function matchesFunction() {
      var node = this.node;
      if (node.type !== 'function') return null;
      var value = new TokenStream(node.nodes, node);
      this.index += 1;
      this.lastValue = null;
      return value;
    }
  }, {
    key: "expectFunction",
    value: function expectFunction() {
      var value = this.matchesFunction();
      return value !== null ? value : this["throw"]();
    }
  }, {
    key: "expectEmpty",
    value: function expectEmpty() {
      if (this.hasTokens()) this["throw"]();
    }
  }, {
    key: "throw",
    value: function _throw() {
      var _this$node;
      throw new Error("Unexpected token type: ".concat((_this$node = this.node) === null || _this$node === void 0 ? void 0 : _this$node.type));
    }
  }, {
    key: "saveRewindPoint",
    value: function saveRewindPoint() {
      this.rewindIndex = this.index;
    }
  }, {
    key: "rewind",
    value: function rewind() {
      if (this.rewindIndex === -1) throw new Error('Internal error');
      this.index = this.rewindIndex;
      this.lastValue = null;
    }
  }]);
  return TokenStream;
}();
exports["default"] = TokenStream;