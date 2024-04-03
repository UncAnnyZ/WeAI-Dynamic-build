"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokens = exports.regExpToken = void 0;
var _cssColorKeywords = _interopRequireDefault(require("css-color-keywords"));
var _postcssValueParser = require("postcss-value-parser");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* eslint-disable react/display-name */

var matchString = function matchString(node) {
  if (node.type !== 'string') return null;
  return node.value.replace(/\\([0-9a-f]{1,6})(?:\s|$)/gi, function (match, charCode) {
    return String.fromCharCode(parseInt(charCode, 16));
  }).replace(/\\/g, '');
};
var hexColorRe = /^(#(?:[0-9a-f]{3,4}){1,2})$/i;
var cssFunctionNameRe = /^(rgba?|hsla?|hwb|lab|lch|gray|color)$/;
var matchColor = function matchColor(node) {
  if (node.type === 'word' && (hexColorRe.test(node.value) || node.value in _cssColorKeywords["default"] || node.value === 'transparent')) {
    return node.value;
  } else if (node.type === 'function' && cssFunctionNameRe.test(node.value)) {
    return (0, _postcssValueParser.stringify)(node);
  }
  return null;
};
var noneRe = /^(none)$/i;
var autoRe = /^(auto)$/i;
var identRe = /(^-?[_a-z][_a-z0-9-]*$)/i;
// Note if these are wrong, you'll need to change index.js too
var numberRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)$/;
// Note lengthRe is sneaky: you can omit units for 0
var lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)((?=px$)|(?=Px$)|(?=PX$)|(?=pX$)|(?=vw$)|(?=vh$)|(?=vmin$)|(?=vmax$)))/;
var unsupportedUnitRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?(ch|em|ex|rem|cm|mm|in|pc|pt))$/;
var angleRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?(?:deg|rad))$/;
var percentRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?%)$/;
var viewportUnitRe = /(\d+)(vw|vh|vmin|vmax)/;
var noopToken = function noopToken(predicate) {
  return function (node) {
    return predicate(node) ? '<token>' : null;
  };
};
var valueForTypeToken = function valueForTypeToken(type) {
  return function (node) {
    return node.type === type ? node.value : null;
  };
};
var functionValueForTypeToken = function functionValueForTypeToken(type) {
  return function (node) {
    if (node.type === type) {
      // handle rgb(a) function value
      if (/^rgba?$/i.test(node.value)) {
        var result = node.nodes.filter(function (token) {
          return token.type === 'word';
        }).map(function (token) {
          return token.value;
        });
        return "".concat(node.value, "(").concat(result.join(', '), ")");
      }
    }
    return null;
  };
};
var regExpToken = function regExpToken(regExp) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String;
  return function (node) {
    var _node$value$match;
    if (node.type !== 'word') return null;
    var match = node.value.match(regExp);
    if (match === null) return null;
    var value = transform(match[1]);
    var unit = (_node$value$match = node.value.match(viewportUnitRe)) === null || _node$value$match === void 0 ? void 0 : _node$value$match[2];
    var isViewportUnit = ['vh', 'vw', 'vmin', 'vmax'].includes(unit);
    if (isViewportUnit) {
      return "scaleVu2dp(".concat(value, ", '").concat(unit, "')");
    } else if (/(\d+)px/.test(node.value)) {
      return node.value;
    } else {
      return value;
    }
  };
};
exports.regExpToken = regExpToken;
var tokens = {
  SPACE: noopToken(function (node) {
    return node.type === 'space';
  }),
  SLASH: noopToken(function (node) {
    return node.type === 'div' && node.value === '/';
  }),
  COMMA: noopToken(function (node) {
    return node.type === 'div' && node.value === ',';
  }),
  WORD: valueForTypeToken('word'),
  FUNC: functionValueForTypeToken('function'),
  NONE: regExpToken(noneRe),
  AUTO: regExpToken(autoRe),
  NUMBER: regExpToken(numberRe, Number),
  LENGTH: regExpToken(lengthRe, Number),
  UNSUPPORTED_LENGTH_UNIT: regExpToken(unsupportedUnitRe),
  ANGLE: regExpToken(angleRe),
  PERCENT: regExpToken(percentRe),
  IDENT: regExpToken(identRe),
  STRING: matchString,
  COLOR: matchColor,
  LINE: regExpToken(/^(none|underline|line-through)$/i)
};
exports.tokens = tokens;