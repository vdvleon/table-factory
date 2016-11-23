import React from 'react'
import TableFactory from 'table-factory'

export default (props) => {
  const rows = [
    {id: 1, name: 'Foo', age: 34},
    {id: 2, name: 'Bar', age: 1337}
  ]

  const columns = {
    id: '#',
    name: {
      title: 'Name',

      // Props applied to the <th>'s
      thProps: {className: 'th', title: 'Name of the user'},

      // Props applied to the <td>'s
      tdProps: {className: 'td', style: {textDecoration: 'line-through'}},

      // Props applied to both the <th>'s and the <td>'s
      props: {className: 'th-td', style: {fontStyle: 'italic'}}
    },
    age: {
      title: 'Age',
      render: row => <span>{row.age} y/o</span>
    }
  }

  // The class names of 'thProps' and 'props' and the class names of 'tdProps'
  // and 'props' will be smartly merged. So this gives <th class="th-td th">
  // and <td class="th-td td">.

  return <TableFactory
    id='id' // Tell React to use the field 'id' as key for every <tr>
    columns={columns}
    data={rows}
  />
}
