"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.transformRawValue =
  exports.getStylesForProperty =
  exports.getPropertyName =
  exports["default"] =
    void 0;
var _camelize = _interopRequireDefault(require("camelize"));
var _postcssValueParser = _interopRequireDefault(
  require("postcss-value-parser")
);
var _TokenStream = _interopRequireDefault(require("./TokenStream"));
var _index = _interopRequireDefault(require("./transforms/index"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (obj) {
            return typeof obj;
          }
        : function (obj) {
            return obj &&
              "function" == typeof Symbol &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? "symbol"
              : typeof obj;
          }),
    _typeof(obj)
  );
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
} /* eslint-disable no-param-reassign */
// Note if this is wrong, you'll need to change tokenTypes.js too
var numberOrLengthRe =
  /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)((?:px)|(?:vw$)|(?:vh$)|(?:vmin$)|(?:vmax$))?$/i;
var boolRe = /^true|false$/i;
var nullRe = /^null$/i;
var undefinedRe = /^undefined$/i;

// Undocumented export
var transformRawValue = function transformRawValue(input) {
  var value = input.trim();
  var numberMatch = value.match(numberOrLengthRe);
  if (numberMatch !== null) {
    var num = Number(numberMatch[1]);
    var unit = numberMatch[2];
    var isViewportUnit = ["vw", "vh", "vmin", "vmax"].includes(unit);
    if (isViewportUnit) {
      return "scaleVu2dp(".concat(num, ", '").concat(unit, "')");
    } else if (/(\d+)px/.test(value)) {
      return value;
    } else {
      return num / 2 + "PX";
    }
  }
  var boolMatch = input.match(boolRe);
  if (boolMatch !== null) return boolMatch[0].toLowerCase() === "true";
  var nullMatch = input.match(nullRe);
  if (nullMatch !== null) return null;
  var undefinedMatch = input.match(undefinedRe);
  if (undefinedMatch !== null) return undefined;
  return value;
};
exports.transformRawValue = transformRawValue;
var baseTransformShorthandValue = function baseTransformShorthandValue(
  propName,
  inputValue
) {
  // const ast = parse(inputValue.trim().replace(/PX|Px|pX$/g, ""));
  var ast = (0, _postcssValueParser["default"])(inputValue);
  var tokenStream = new _TokenStream["default"](ast.nodes);
  return _index["default"][propName](tokenStream);
};
var checkBaseTransformShorthandValue =
  function checkBaseTransformShorthandValue(propName, inputValue) {
    try {
      return baseTransformShorthandValue(propName, inputValue);
    } catch (e) {
      throw new Error(
        ""
          .concat(e.message, ' Failed to parse declaration "')
          .concat(propName, ": ")
          .concat(inputValue, '"')
      );
    }
  };
var transformShorthandValue =
  process.env.NODE_ENV === "production"
    ? baseTransformShorthandValue
    : checkBaseTransformShorthandValue;
var getStylesForProperty = function getStylesForProperty(
  propName,
  inputValue,
  allowShorthand
) {
  var isRawValue = allowShorthand === false || !(propName in _index["default"]);
  var propValue = isRawValue
    ? transformRawValue(inputValue)
    : transformShorthandValue(propName, inputValue.trim());
  return propValue && propValue.$merge
    ? propValue.$merge
    : _defineProperty({}, propName, propValue);
};
exports.getStylesForProperty = getStylesForProperty;
var getPropertyName = function getPropertyName(propName) {
  var isCustomProp = /^--\w+/.test(propName);
  if (isCustomProp) {
    return propName;
  }
  return (0, _camelize["default"])(propName);
};
exports.getPropertyName = getPropertyName;
var _default = function _default(rules) {
  var shorthandBlacklist =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return rules.reduce(function (accum, rule) {
    var propertyName = getPropertyName(rule[0]);
    var value = rule[1];
    var allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1;
    return Object.assign(
      accum,
      getStylesForProperty(propertyName, value, allowShorthand)
    );
  }, {});
};
exports["default"] = _default;
