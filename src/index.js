import React, { PropTypes } from 'react'
import {
  map,
  merge,
  size,
  findIndex,
  isPlainObject,
  toArray,
  isString,
  isFunction,
  forEach,
  omit
} from 'lodash'

/**
 * Helper to quickly generate tables based on columns and data
 */
export default class TableFactory extends React.Component {
  /**
   * Normalize 'columns' input
   *
   * @param {array}|{object} columns
   * @return {object[]}
   */
  static normalizeColumns (columns) {
    return toArray(map(columns, (col, name) => {
      if (!isPlainObject(col)) col = {title: col}
      if (isString(name)) col.name = name
      if (typeof col.title === 'undefined') col.title = col.name
      return col
    }))
  }

  /**
   * Normalize 'data' input
   *
   * @param {array}|{object} data
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
   * @param {Event} e
   */
  handleRowClick (row, e) {
    this.props.onRowClick && this.props.onRowClick(e, row)
  }

  /**
   * Evaluate elem props
   *
   * The the elem props is function, call it using the given arguments, return
   * an props object otherwise.
   *
   * @param {object}|{function}|{null} props
   * @param {any}... args
   * @return object
   */
  static evalElemProps (props, ...args) {
    if (isPlainObject(props)) {
      return props
    } else if (isFunction(props)) {
      return props(...args)
    } else {
      return {}
    }
  }

  /**
   * Helper to generate the {thead}
   *
   * @param {object} columns
   * @param {object[]} data
   * @param {object} elemProps
   * @return {thead}
   */
  renderHeader (columns, data, elemProps) {
    const { thead: theadProps, tr: trProps, th: thProps } = elemProps
    const { evalElemProps, mergeProps } = this.constructor

    return (
      <thead {...evalElemProps(theadProps, data, columns)}>
        <tr {...evalElemProps(trProps, true, null, 0, data, columns)}>
          {map(columns, col =>
            <th key={col.name} {...mergeProps(
              evalElemProps(thProps, col, data, columns),
              evalElemProps(col.props, col, data, columns),
              evalElemProps(col.thProps, col, data, columns)
            )}>
              {col.title}
            </th>
          )}
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
   * @param {object} elemProps
   * @return {tbody}
   */
  renderBody (columns, data, header, elemProps) {
    // Extra props
    const { id } = this.props
    const { tbody: tbodyProps, tr: trProps, td: tdProps } = elemProps
    const { evalElemProps, mergeProps } = this.constructor

    const id_ = (row, index) =>
      isFunction(id)
        ? id(row, index)
        : (id && row[id] ? row[id] : index)

    return (
      <tbody {...evalElemProps(tbodyProps, data, columns)}>
        {map(data, (row, index) =>
          <tr
            key={id_(row, index)}
            onClick={this.handleRowClick.bind(this, row)}
            {...evalElemProps(trProps, false, row, index, data, columns)}
          >
            {columns.map(col =>
              <td key={col.name} {...mergeProps(
                evalElemProps(tdProps, col, row, index, data, columns),
                evalElemProps(col.props, col, row, index, data, columns),
                evalElemProps(col.tdProps, col, row, index, data, columns)
              )}>
                {col.render
                  ? col.render(row, col, index, data, columns)
                  : row[col.name]
                }
              </td>
            )}
          </tr>
        )}
      </tbody>
    )
  }

  /**
   * Parse children for custom props / column definition
   *
   * @param {any} children
   * @param {object} columns
   * @param {object} elemProps
   * @param {string} parent Optional parent type
   */
  static parseChildren (
    children,
    columns,
    elemProps,
    parent
  ) {
    return React.Children.map(children, el => {
      // Ignore?
      if (!React.isValidElement(el)) return

      const { type, props } = el

      // Merge simple props
      const simpleProps = ['table', 'thead', 'tbody', 'td']
      if (simpleProps.indexOf(type) !== -1) {
        elemProps[type] = this.propsWithDefault(
          omit(props, ['children']),
          elemProps[type]
        )

      // Parse columns
      } else if (type === 'th') {
        const { name, children: childs, ...props_ } = props

        // Parse specific column (with name)
        // If children are given use these as title
        if (isString(name)) {
          // New or existing columns?
          let index = findIndex(columns, {name})
          if (index === -1) {
            const { props, thProps, tdProps, title, render, ...rest } = props_
            columns.push(merge(
              {props, tdProps, title, render, name, thProps: {
                ...thProps,
                ...rest
              }},
              childs ? {title: childs} : {}
            ))
          } else {
            columns[index] = merge(
              {thProps: props_},
              childs ? {title: childs} : {},
              columns[index] || {}
            )
          }

        // Or parse the general th props
        } else {
          elemProps[type] = this.propsWithDefault(
            props_,
            elemProps[type]
          )
        }

      // Parse row
      } else if (type === 'tr') {
        const old = elemProps[type]
        elemProps[type] = (header, ...args) => {
          // Specific props for header?
          if (header && parent === 'thead') {
            return this.mergeProps(
              this.evalElemProps(old, header, ...args),
              omit(props, 'children')
            )

          // Specific props for the body?
          } else if (!header && parent === 'tbody') {
            return this.mergeProps(
              this.evalElemProps(old, header, ...args),
              omit(props, 'children')
            )

          // Type mismatch?
          } else if (parent === 'tbody' || parent === 'tbody') {
            return this.evalElemProps(old, header, ...args)

          // Or just merge
          } else {
            return this.mergeProps(
              omit(props, 'children'),
              this.evalElemProps(old, header, ...args),
            )
          }
        }
      }

      // Recursively continue
      this.parseChildren(props.children, columns, elemProps, el.type)
    })
  }

  /**
   * Specify default props (which will be overwritten by 'elemProps' props)
   *
   * Returns a props function that will return the new props merged with the
   * original elemProp for the element.
   *
   * @param {object} props
   * @param {object}|{function}|{null} originalProps
   * @return {function}
   */
  static propsWithDefault (props, originalProps) {
    return (...args) => this.mergeProps(
      isPlainObject(props) ? props : {},
      this.evalElemProps(originalProps, ...args)
    )
  }

  /**
   * Merge props (and merge className appropiately)
   *
   * @param {object} ...props
   */
  static mergeProps (...props) {
    const classNames = []
    const newProps = {}
    forEach(props, props => {
      const { className, ...rest } = props || {}
      if (isString(className)) classNames.push(className)
      merge(newProps, rest)
    })
    if (classNames.length > 0) {
      newProps.className = classNames.join(' ')
    }
    return newProps
  }

  /**
   * Render the table
   *
   * @return {table}
   */
  render () {
    // Prepare vars / static helpers
    const {
      columns,
      data,
      elemProps = {},
      header = true,
      children,
      pagination: {
        page,
        perPage = 0
      },
      ...rest
    } = this.props
    const {
      evalElemProps,
      normalizeColumns,
      normalizeData
    } = this.constructor
    let elemProps_ = {...elemProps}

    // Normalize input
    let columns_ = normalizeColumns(columns || {})
    const normalizedData = normalizeData(data)
    const slicedData = perPage > 0
      ? normalizedData.slice(perPage * (page - 1), perPage * page)
      : normalizedData

    // Parse chilren
    this.constructor.parseChildren(
      children,
      columns_,
      elemProps_
    )

    // No columns?
    if (size(columns_) === 0) {
      throw new Error(
        'No columns specified, specify them either by the columns prop ' +
        'or by passing <th>\'s (with a name prop)'
      )
    }

    // Prepare props
    const { table: tableProps } = elemProps_
    const props = omit(rest, [
      'onRowClick',
      'id'
    ])

    // Render
    const thead = header && this.renderHeader(columns_, slicedData, elemProps_)
    const tbody = this.renderBody(columns_, slicedData, header, elemProps_)
    return (
      <table
        {...evalElemProps(tableProps, slicedData, columns_)}
        {...props}
      >
        {thead}
        {tbody}
      </table>
    )
  }
}

TableFactory.defaultProps = {
  pagination: {}
}

TableFactory.propTypes = {
  onRowClick: PropTypes.func,
  header: PropTypes.bool,
  id: PropTypes.string,
  columns: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object),
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired,
  elemProps: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ])),
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number
  })
}
