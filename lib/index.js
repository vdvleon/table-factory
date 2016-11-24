'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableFactory = function (_React$Component) {
  (0, _inherits3.default)(TableFactory, _React$Component);

  function TableFactory() {
    (0, _classCallCheck3.default)(this, TableFactory);
    return (0, _possibleConstructorReturn3.default)(this, (TableFactory.__proto__ || (0, _getPrototypeOf2.default)(TableFactory)).apply(this, arguments));
  }

  (0, _createClass3.default)(TableFactory, [{
    key: 'handleRowClick',
    value: function handleRowClick(row, e) {
      this.props.onRowClick && this.props.onRowClick(e, row);
    }
  }, {
    key: 'renderHeader',
    value: function renderHeader(columns, data, elemProps) {
      var theadProps = elemProps.thead,
          trProps = elemProps.tr,
          thProps = elemProps.th;
      var _constructor = this.constructor,
          evalElemProps = _constructor.evalElemProps,
          mergeProps = _constructor.mergeProps;


      return _react2.default.createElement(
        'thead',
        evalElemProps(theadProps, data, columns),
        _react2.default.createElement(
          'tr',
          evalElemProps(trProps, true, null, 0, data, columns),
          (0, _lodash.map)(columns, function (col) {
            return _react2.default.createElement(
              'th',
              (0, _extends3.default)({ key: col.name }, mergeProps(evalElemProps(thProps, col, data, columns), evalElemProps(col.props, col, data, columns), evalElemProps(col.thProps, col, data, columns))),
              col.title
            );
          })
        )
      );
    }
  }, {
    key: 'renderBody',
    value: function renderBody(columns, data, header, elemProps) {
      var _this2 = this;

      var id = this.props.id;
      var tbodyProps = elemProps.tbody,
          trProps = elemProps.tr,
          tdProps = elemProps.td;
      var _constructor2 = this.constructor,
          evalElemProps = _constructor2.evalElemProps,
          mergeProps = _constructor2.mergeProps;


      var id_ = function id_(row, index) {
        return (0, _lodash.isFunction)(id) ? id(row, index) : id && row[id] ? row[id] : index;
      };

      return _react2.default.createElement(
        'tbody',
        evalElemProps(tbodyProps, data, columns),
        (0, _lodash.map)(data, function (row, index) {
          return _react2.default.createElement(
            'tr',
            (0, _extends3.default)({
              key: id_(row, index),
              onClick: _this2.handleRowClick.bind(_this2, row)
            }, evalElemProps(trProps, false, row, index, data, columns)),
            columns.map(function (col) {
              return _react2.default.createElement(
                'td',
                (0, _extends3.default)({ key: col.name }, mergeProps(evalElemProps(tdProps, col, row, index, data, columns), evalElemProps(col.props, col, row, index, data, columns), evalElemProps(col.tdProps, col, row, index, data, columns))),
                col.render ? col.render(row, col, index, data, columns) : row[col.name]
              );
            })
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          columns = _props.columns,
          data = _props.data,
          _props$elemProps = _props.elemProps,
          elemProps = _props$elemProps === undefined ? {} : _props$elemProps,
          _props$header = _props.header,
          header = _props$header === undefined ? true : _props$header,
          children = _props.children,
          rest = (0, _objectWithoutProperties3.default)(_props, ['columns', 'data', 'elemProps', 'header', 'children']);
      var _constructor3 = this.constructor,
          evalElemProps = _constructor3.evalElemProps,
          normalizeColumns = _constructor3.normalizeColumns,
          normalizeData = _constructor3.normalizeData;

      var elemProps_ = (0, _extends3.default)({}, elemProps);

      var columns_ = normalizeColumns(columns || {});
      var data_ = normalizeData(data);

      this.constructor.parseChildren(children, columns_, elemProps_);

      if ((0, _lodash.size)(columns_) === 0) {
        throw new Error('No columns specified, specify them either by the columns prop ' + 'or by passing <th>\'s (with a name prop)');
      }

      var tableProps = elemProps_.table;

      var props = (0, _lodash.omit)(rest, ['onRowClick', 'id']);

      var thead = header && this.renderHeader(columns_, data_, elemProps_);
      var tbody = this.renderBody(columns_, data_, header, elemProps_);
      return _react2.default.createElement(
        'table',
        (0, _extends3.default)({}, evalElemProps(tableProps, data_, columns_), props),
        thead,
        tbody
      );
    }
  }], [{
    key: 'normalizeColumns',
    value: function normalizeColumns(columns) {
      return (0, _lodash.toArray)((0, _lodash.map)(columns, function (col, name) {
        if (!(0, _lodash.isPlainObject)(col)) col = { title: col };
        if ((0, _lodash.isString)(name)) col.name = name;
        if (typeof col.title === 'undefined') col.title = col.name;
        return col;
      }));
    }
  }, {
    key: 'normalizeData',
    value: function normalizeData(data) {
      return (0, _lodash.toArray)(data);
    }
  }, {
    key: 'evalElemProps',
    value: function evalElemProps(props) {
      if ((0, _lodash.isPlainObject)(props)) {
        return props;
      } else if ((0, _lodash.isFunction)(props)) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return props.apply(undefined, args);
      } else {
        return {};
      }
    }
  }, {
    key: 'parseChildren',
    value: function parseChildren(children, columns, elemProps, parent) {
      var _this3 = this;

      return _react2.default.Children.map(children, function (el) {
        if (!_react2.default.isValidElement(el)) return;

        var type = el.type,
            props = el.props;

        var simpleProps = ['table', 'thead', 'tbody', 'td'];
        if (simpleProps.indexOf(type) !== -1) {
          elemProps[type] = _this3.defaultProps((0, _lodash.omit)(props, ['children']), elemProps[type]);
        } else if (type === 'th') {
          var name = props.name,
              childs = props.children,
              props_ = (0, _objectWithoutProperties3.default)(props, ['name', 'children']);

          if ((0, _lodash.isString)(name)) {
            var index = (0, _lodash.findIndex)(columns, { name: name });
            if (index === -1) {
              var _props2 = props_.props,
                  thProps = props_.thProps,
                  tdProps = props_.tdProps,
                  title = props_.title,
                  render = props_.render,
                  rest = (0, _objectWithoutProperties3.default)(props_, ['props', 'thProps', 'tdProps', 'title', 'render']);

              columns.push((0, _lodash.merge)({ props: _props2, tdProps: tdProps, title: title, render: render, name: name, thProps: (0, _extends3.default)({}, thProps, rest) }, childs ? { title: childs } : {}));
            } else {
              columns[index] = (0, _lodash.merge)({ thProps: props_ }, childs ? { title: childs } : {}, columns[index] || {});
            }
          } else {
            elemProps[type] = _this3.defaultProps(props_, elemProps[type]);
          }
        } else if (type === 'tr') {
          (function () {
            var old = elemProps[type];
            elemProps[type] = function (header) {
              for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              if (header && parent === 'thead') {
                return _this3.mergeProps(_this3.evalElemProps.apply(_this3, [old, header].concat(args)), (0, _lodash.omit)(props, 'children'));
              } else if (!header && parent === 'tbody') {
                return _this3.mergeProps(_this3.evalElemProps.apply(_this3, [old, header].concat(args)), (0, _lodash.omit)(props, 'children'));
              } else if (parent === 'tbody' || parent === 'tbody') {
                return _this3.evalElemProps.apply(_this3, [old, header].concat(args));
              } else {
                return _this3.mergeProps((0, _lodash.omit)(props, 'children'), _this3.evalElemProps.apply(_this3, [old, header].concat(args)));
              }
            };
          })();
        }

        _this3.parseChildren(props.children, columns, elemProps, el.type);
      });
    }
  }, {
    key: 'defaultProps',
    value: function defaultProps(props, originalProps) {
      var _this4 = this;

      return function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return _this4.mergeProps((0, _lodash.isPlainObject)(props) ? props : {}, _this4.evalElemProps.apply(_this4, [originalProps].concat(args)));
      };
    }
  }, {
    key: 'mergeProps',
    value: function mergeProps() {
      for (var _len4 = arguments.length, props = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        props[_key4] = arguments[_key4];
      }

      var classNames = [];
      var newProps = {};
      (0, _lodash.forEach)(props, function (props) {
        var _ref = props || {},
            className = _ref.className,
            rest = (0, _objectWithoutProperties3.default)(_ref, ['className']);

        if ((0, _lodash.isString)(className)) classNames.push(className);
        (0, _lodash.merge)(newProps, rest);
      });
      if (classNames.length > 0) {
        newProps.className = classNames.join(' ');
      }
      return newProps;
    }
  }]);
  return TableFactory;
}(_react2.default.Component);

exports.default = TableFactory;


TableFactory.propTypes = {
  onRowClick: _react.PropTypes.func,
  header: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  columns: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]),
  data: _react.PropTypes.oneOfType([_react.PropTypes.objectOf(_react.PropTypes.object), _react.PropTypes.arrayOf(_react.PropTypes.object)]).isRequired,
  elemProps: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]))
};