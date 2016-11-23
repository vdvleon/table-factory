import React from 'react'
import classNames from 'classnames'
import TableFactory from 'table-factory'

export default (props) => {
  const rows = [
    {id: 1, name: 'Foo', age: 34},
    {id: 2, name: 'Bar', age: 1337}
  ]

  const columns = {
    id: '#',
    name: 'Name',
    age: 'Age'
  }

  const elemProps = {
    table: {className: 'table'},
    thead: {className: 'table__head'},
    tbody: {className: 'table__body'},
    th:    {className: 'table__cell'},
    td:    {className: 'table__cell'},

    // Alternating row style
    tr: (header, row, index) => ({className: classNames(
      'table__row',
      !header && (index % 2) === 0 && 'table__row--uneven'
    )})
  }

  return <TableFactory
    id='id' // Tell React to use the field 'id' as key for every <tr>
    columns={columns}
    data={rows}
    elemProps={elemProps}
  />
}
