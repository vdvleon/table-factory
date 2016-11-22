import React, { PropTypes } from 'react'

import merge from 'lodash/merge'
import map from 'lodash/map'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import toArray from 'lodash/toArray'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import omit from 'lodash/omit'

/**
 * Helper to quickly generate tables based on columns and data
 *
 * An example:
 * <TableFactory
 *   elemProps={{
 *     table: {className: 'table'},
 *     th: (col) => ({title: col.title})
 *   }}
 *   columns={{
 *     name: 'Name',
 *     age: {
 *       title: 'Age',
 *       render: (row, col, index, data) => <strong>{row.age} y/o</strong>
 *     },
 *     actions: {
 *       title: '',
 *       props: {style: {textAlign: 'right'}},
 *       render: row => (
 *         <span>
 *           <a href={`/user/${row.id}/edit`}>Edit/a>
 *           <a href={`/user/${row.id}/delete`}>Delete</a>
 *         </span>
 *       )
 *     }
 *   }}
 *   id='id'
 *   data={[
 *     {id: 1, name: 'Alice', age: 24},
 *     {id: 2, name: 'Bob', age: 43},
 *     {id: 666, name: 'Eve', age: 99}
 *   ]}
 * />
 *
 * The prop 'elemProps' can be used to specify props per table elemnt type. The
 * value of the prop should be an object where keys can consist of: 'table',
 * 'thead', 'tbody', 'tr', 'th' and 'td'. The value of the keys can either be an
 * object with the props or a function returning an props object. The signature
 * for this function is:
 * - 'th': (object col, array rows, object cols) => object
 * - 'td': (object col, object row, int rowIndex, array rows, object cols) => object
 * - 'tr': (bool thead, object|null row, int rowIndex, array rows, object cols) => object
 * - 'thead': (array rows, object cols) => object
 * - 'tbody': (array rows, object cols) => object
 * - 'table': (array rows, object cols) => object
 *
 * 'elemProps' is useful for styling of the table (e.g. by passing className
 * or style).
 *
 */
export default class TableFactory extends React.Component {
  /**
   * Normalize 'columns' input
   *
   * @return {object[]}
   */
  static normalizeColumns (columns) {
    return toArray(map(columns, (col, key) => {
      if (!isPlainObject(col)) col = {title: col}
      if (isString(key)) col.key = key
      if (!col.title) col.title = col.key
      return col
    }))
  }

  /**
   * Normalize 'data' input
   *
   * @return {object[]}
   */
  static normalizeData (data) {
    return toArray(data)
  }

  /**
   * Row click handler
   *
   * Passes event to 'onRowClick' prop (if given).
   *
   * @param {object} row
   * @param {Event} e
   */
  handleRowClick (row, e) {
    this.props.onRowClick && this.props.onRowClick(e, row)
  }

  /**
   * Normalize elem props
   *
   * @param object|function|null props
   * @param any... args
   * @return object
   */
  static normalizeElemProps (props) {
    if (isPlainObject(props)) {
      return props
    } else if (isFunction(props)) {
      const args = [].slice.call(arguments, 1)
      return props.apply(null, args)
    } else {
      return {}
    }
  }

  /**
   * Helper to generate the {thead}
   *
   * @param {object[]} columns
   * @return {thead}
   */
  renderHeader (columns, data) {
    const { elemProps = {} } = this.props
    const { thead: theadProps, tr: trProps, th: thProps } = elemProps

    return (
      <thead {...this.constructor.normalizeElemProps(theadProps, data, columns)}>
        <tr {...this.constructor.normalizeElemProps(trProps, true, null, 0, data, columns)}>
          {map(columns, col => {
            return React.isValidElement(col.header)
              ? React.cloneElement(
                col.header,
                {
                  key: col.key,
                  ...this.constructor.normalizeElemProps(
                    elemProps[col.header.type || 'th'],
                    col,
                    data,
                    columns
                  ),
                  ...(col.props || {}),
                  ...(col.thProps || {})
                }
              )
              : <th
                key={col.key}
                {...this.constructor.normalizeElemProps(thProps, col, data, columns)}
                {...(col.props || {})}
                {...(col.thProps || {})}
              >
                {col.title}
              </th>
          })}
        </tr>
      </thead>
    )
  }

  /**
   * Helper to generate the {tbody}
   *
   * @param {object[]} columns
   * @param {object[]} data
   * @param {bool} header
   * @return {tbody}
   */
  renderBody (columns, data, header) {
    // Extra props
    const { id, elemProps = {} } = this.props
    const { tbody: tbodyProps, tr: trProps, td: tdProps } = elemProps

    const id_ = (row, index) =>
      isFunction(id)
        ? id(row, index)
        : (id && row[id] ? row[id] : index)

    return (
      <tbody {...this.constructor.normalizeElemProps(tbodyProps, data, columns)}>
        {map(data, (row, index) =>
          <tr
            key={id_(row, index)}
            onClick={this.handleRowClick.bind(this, row)}
            {...this.constructor.normalizeElemProps(trProps, false, row, index, data, columns)}
          >
            {columns.map(col =>
              <td
                key={col.key}
                {...this.constructor.normalizeElemProps(tdProps, col, row, index, data, columns)}
                {...(col.props || {})}
                {...(col.tdProps || {})}
              >
                {col.render
                  ? col.render(row, col, index, data, columns)
                  : row[col.key]
                }
              </td>
            )}
          </tr>
        )}
      </tbody>
    )
  }

  /**
   * Render the table
   *
   * @return {table}
   */
  render () {
    const { columns, data, elemProps = {}, header = true, ...rest } = this.props
    const { table: tableProps } = elemProps
    const props = omit(rest, [
      'onRowClick',
      'id'
    ])

    // Normalize input
    const normalizedColumns = this.constructor.normalizeColumns(columns)
    const normalizedData = this.constructor.normalizeData(data)

    return (
      <table
        {...this.constructor.normalizeElemProps(
          tableProps,
          normalizedData,
          normalizedColumns
        )}
        {...props}
      >
        {header ? this.renderHeader(normalizedColumns, normalizedData) : null}
        {this.renderBody(normalizedColumns, normalizedData, header)}
      </table>
    )
  }
}

/**
 * Prop types
 *
 * This element supports the following props:
 * - onRowClick  - a callback(e, row) triggered when a row is clicked
 * - header      - render thead or not (enabled by default)
 * - id          - key to use from the data rows
 * - columns     - column data structure (see {TableFactory})
 * - data        - the row data (see {TableFactory})
 * - elemProps   - key/value pair with extra classes
 */
TableFactory.propTypes = {
  onRowClick: PropTypes.func,
  header: PropTypes.bool,
  id: PropTypes.string,
  columns: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
    // PropTypes.objectOf(columnType),
    // PropTypes.arrayOf(columnType)
  ]).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired,
  elemProps: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]))
}

const columnType = PropTypes.oneOfType([
  PropTypes.object,
  // PropTypes.shape({
  //   key: PropTypes.any,
  //   title: PropTypes.string,
  //   props: PropTypes.object,
  //   tdProps: PropTypes.object,
  //   thProps: PropTypes.object,
  //   header: PropTypes.element, // th
  //   render: PropTypes.func
  // }),
  PropTypes.string
])
