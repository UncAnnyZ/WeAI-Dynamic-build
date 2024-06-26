"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.borderWidth = exports.borderTop = exports.borderRight = exports.borderRadius = exports.borderLeft = exports.borderColor = exports.borderBottom = exports.border = void 0;
var _tokenTypes = require("../tokenTypes");
var _util = require("./util");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var WORD = _tokenTypes.tokens.WORD,
  FUNC = _tokenTypes.tokens.FUNC,
  COLOR = _tokenTypes.tokens.COLOR,
  LENGTH = _tokenTypes.tokens.LENGTH,
  UNSUPPORTED_LENGTH_UNIT = _tokenTypes.tokens.UNSUPPORTED_LENGTH_UNIT;
function borderDirectionFactory() {
  var _anyOrderFactory;
  var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var prefix = "border".concat(direction);
  return (0, _util.anyOrderFactory)((_anyOrderFactory = {}, _defineProperty(_anyOrderFactory, "".concat(prefix, "Width"), {
    tokens: [LENGTH, UNSUPPORTED_LENGTH_UNIT],
    "default": 1
  }), _defineProperty(_anyOrderFactory, "".concat(prefix, "Color"), {
    tokens: [COLOR],
    "default": 'black'
  }), _defineProperty(_anyOrderFactory, "borderStyle", {
    tokens: [(0, _tokenTypes.regExpToken)(/^(solid|dashed|dotted)$/)],
    "default": 'solid'
  }), _anyOrderFactory));
}
var border = borderDirectionFactory();
exports.border = border;
var borderTop = borderDirectionFactory('Top');
exports.borderTop = borderTop;
var borderRight = borderDirectionFactory('Right');
exports.borderRight = borderRight;
var borderBottom = borderDirectionFactory('Bottom');
exports.borderBottom = borderBottom;
var borderLeft = borderDirectionFactory('Left');
exports.borderLeft = borderLeft;
var borderColor = (0, _util.directionFactory)({
  types: [WORD, FUNC],
  prefix: 'border',
  suffix: 'Color'
});
exports.borderColor = borderColor;
var borderRadius = (0, _util.directionFactory)({
  directions: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'],
  prefix: 'border',
  suffix: 'Radius'
});
exports.borderRadius = borderRadius;
var borderWidth = (0, _util.directionFactory)({
  prefix: 'border',
  suffix: 'Width'
});
exports.borderWidth = borderWidth;