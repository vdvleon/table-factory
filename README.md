# table-factory

An easy to use table factory for React

## How to install

```
npm install table-factory
```

## How to use?

```
const rows = [
  {id: 1, name: 'Foo', age: 34},
  {id: 2, name: 'Bar', age: 1337}
]
const columns = {
  id: '#',
  name: 'Name',
  age: {
    title: '',
    render: row => <span>{row.age} y/o</span>
  }
}

<TableFactory
  id='id'
  columns={columns}
  data={rows}
/>
```

This example will generate:

```
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Foo</td>
      <td><span>34 y/o</span></td>
    </tr>
    <tr>
      <td>2</td>
      <td>Bar</td>
      <td><span>1337 y/o</span></td>
    </tr>
  </tbody>
</table>
```
