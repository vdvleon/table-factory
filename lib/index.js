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
    value: function renderHeader(columns, data) {
      var _this2 = this;

      var _props$elemProps = this.props.elemProps,
          elemProps = _props$elemProps === undefined ? {} : _props$elemProps;
      var theadProps = elemProps.thead,
          trProps = elemProps.tr,
          thProps = elemProps.th;


      return _react2.default.createElement(
        'thead',
        this.constructor.normalizeElemProps(theadProps, data, columns),
        _react2.default.createElement(
          'tr',
          this.constructor.normalizeElemProps(trProps, true, null, 0, data, columns),
          (0, _lodash.map)(columns, function (col) {
            return _react2.default.isValidElement(col.header) ? _react2.default.cloneElement(col.header, (0, _extends3.default)({
              key: col.key
            }, _this2.constructor.normalizeElemProps(elemProps[col.header.type || 'th'], col, data, columns), col.props || {}, col.thProps || {})) : _react2.default.createElement(
              'th',
              (0, _extends3.default)({
                key: col.key
              }, _this2.constructor.normalizeElemProps(thProps, col, data, columns), col.props || {}, col.thProps || {}),
              col.title
            );
          })
        )
      );
    }
  }, {
    key: 'renderBody',
    value: function renderBody(columns, data, header) {
      var _this3 = this;

      var _props = this.props,
          id = _props.id,
          _props$elemProps2 = _props.elemProps,
          elemProps = _props$elemProps2 === undefined ? {} : _props$elemProps2;
      var tbodyProps = elemProps.tbody,
          trProps = elemProps.tr,
          tdProps = elemProps.td;


      var id_ = function id_(row, index) {
        return (0, _lodash.isFunction)(id) ? id(row, index) : id && row[id] ? row[id] : index;
      };

      return _react2.default.createElement(
        'tbody',
        this.constructor.normalizeElemProps(tbodyProps, data, columns),
        (0, _lodash.map)(data, function (row, index) {
          return _react2.default.createElement(
            'tr',
            (0, _extends3.default)({
              key: id_(row, index),
              onClick: _this3.handleRowClick.bind(_this3, row)
            }, _this3.constructor.normalizeElemProps(trProps, false, row, index, data, columns)),
            columns.map(function (col) {
              return _react2.default.createElement(
                'td',
                (0, _extends3.default)({
                  key: col.key
                }, _this3.constructor.normalizeElemProps(tdProps, col, row, index, data, columns), col.props || {}, col.tdProps || {}),
                col.render ? col.render(row, col, index, data, columns) : row[col.key]
              );
            })
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          columns = _props2.columns,
          data = _props2.data,
          _props2$elemProps = _props2.elemProps,
          elemProps = _props2$elemProps === undefined ? {} : _props2$elemProps,
          _props2$header = _props2.header,
          header = _props2$header === undefined ? true : _props2$header,
          rest = (0, _objectWithoutProperties3.default)(_props2, ['columns', 'data', 'elemProps', 'header']);
      var tableProps = elemProps.table;

      var props = (0, _lodash.omit)(rest, ['onRowClick', 'id']);

      var normalizedColumns = this.constructor.normalizeColumns(columns);
      var normalizedData = this.constructor.normalizeData(data);

      return _react2.default.createElement(
        'table',
        (0, _extends3.default)({}, this.constructor.normalizeElemProps(tableProps, normalizedData, normalizedColumns), props),
        header ? this.renderHeader(normalizedColumns, normalizedData) : null,
        this.renderBody(normalizedColumns, normalizedData, header)
      );
    }
  }], [{
    key: 'normalizeColumns',
    value: function normalizeColumns(columns) {
      return (0, _lodash.toArray)((0, _lodash.map)(columns, function (col, key) {
        if (!(0, _lodash.isPlainObject)(col)) col = { title: col };
        if ((0, _lodash.isString)(key)) col.key = key;
        if (typeof col.title === 'undefined') col.title = col.key;
        return col;
      }));
    }
  }, {
    key: 'normalizeData',
    value: function normalizeData(data) {
      return (0, _lodash.toArray)(data);
    }
  }, {
    key: 'normalizeElemProps',
    value: function normalizeElemProps(props) {
      if ((0, _lodash.isPlainObject)(props)) {
        return props;
      } else if ((0, _lodash.isFunction)(props)) {
        var args = [].slice.call(arguments, 1);
        return props.apply(null, args);
      } else {
        return {};
      }
    }
  }]);
  return TableFactory;
}(_react2.default.Component);

exports.default = TableFactory;

TableFactory.propTypes = {
  onRowClick: _react.PropTypes.func,
  header: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  columns: _react.PropTypes.oneOfType([_react.PropTypes.array, _react.PropTypes.object]).isRequired,
  data: _react.PropTypes.oneOfType([_react.PropTypes.objectOf(_react.PropTypes.object), _react.PropTypes.arrayOf(_react.PropTypes.object)]).isRequired,
  elemProps: _react.PropTypes.objectOf(_react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]))
};

var columnType = _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string]);