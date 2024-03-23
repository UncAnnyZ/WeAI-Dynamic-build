"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _tokenTypes = require("../tokenTypes");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var SPACE = _tokenTypes.tokens.SPACE,
  COMMA = _tokenTypes.tokens.COMMA,
  LENGTH = _tokenTypes.tokens.LENGTH,
  NUMBER = _tokenTypes.tokens.NUMBER,
  ANGLE = _tokenTypes.tokens.ANGLE;
var oneOfType = function oneOfType(tokenType) {
  return function (functionStream) {
    var value = functionStream.expect(tokenType);
    functionStream.expectEmpty();
    return value;
  };
};
var singleNumber = oneOfType(NUMBER);
var singleLength = oneOfType(LENGTH);
var singleAngle = oneOfType(ANGLE);
var xyTransformFactory = function xyTransformFactory(tokenType) {
  return function (key, valueIfOmitted) {
    return function (functionStream) {
      var x = functionStream.expect(tokenType);
      var y;
      if (functionStream.hasTokens()) {
        functionStream.expect(COMMA);
        y = functionStream.expect(tokenType);
      } else if (typeof valueIfOmitted !== 'undefined') {
        y = valueIfOmitted;
      } else {
        // Assumption, if x === y, then we can omit XY
        // I.e. scale(5) => [{ scale: 5 }] rather than [{ scaleX: 5 }, { scaleY: 5 }]
        return x;
      }
      functionStream.expectEmpty();
      return [_defineProperty({}, "".concat(key, "Y"), y), _defineProperty({}, "".concat(key, "X"), x)];
    };
  };
};
var xyNumber = xyTransformFactory(NUMBER);
var xyLength = xyTransformFactory(LENGTH);
var xyAngle = xyTransformFactory(ANGLE);
var partTransforms = {
  perspective: singleNumber,
  scale: xyNumber('scale'),
  scaleX: singleNumber,
  scaleY: singleNumber,
  translate: xyLength('translate', 0),
  translateX: singleLength,
  translateY: singleLength,
  rotate: singleAngle,
  rotateX: singleAngle,
  rotateY: singleAngle,
  rotateZ: singleAngle,
  skewX: singleAngle,
  skewY: singleAngle,
  skew: xyAngle('skew', '0deg')
};
var _default = function _default(tokenStream) {
  var transforms = [];
  var didParseFirst = false;
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE);
    var functionStream = tokenStream.expectFunction();
    var functionName = functionStream.functionName;
    var transformedValues = partTransforms[functionName](functionStream);
    if (!Array.isArray(transformedValues)) {
      transformedValues = [_defineProperty({}, functionName, transformedValues)];
    }
    transforms = transformedValues.concat(transforms);
    didParseFirst = true;
  }
  return transforms;
};
exports["default"] = _default;