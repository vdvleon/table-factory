# Table Factory

An easy to use table factory for React.

## How to install

```bash
npm install table-factory
```

## How to use?

A quick example:
```jsx
const rows = [
  {id: 1, name: 'Foo', age: 34},
  {id: 2, name: 'Bar', age: 1337}
]

<TableFactory
  id='id'
  columns={{
    id: '#',
    name: 'Name',
    age: 'Age'
  }}
  data={rows}
/>
```

More examples can be found in
[examples](https://github.com/vdvleon/table-factory/blob/master/examples/).

## API

### Props

All props except data are optional. But when no `columns` prop is given the
[alternative columns specification](#alternative-columns-specification)
should be given.

```jsx
<TableFactory
  onRowClick={(event, row) => void} // when <tr> inside the <tbody> is clicked
  header={bool} // show thead yes or not
  id={string} // use this property of the data for the React key for the <tr>'s
  columns={objectOrArray} // specify columns
  elemProps={object} // specify elem specific props (e.g. a class for a <tr>)
  data={array} // list of row objects
/>
```

#### columns

The `columns` prop is either an array of column objects (with a `name` prop) or
an object where the key is the name of the column, and the value the column
object. In the second case it's also possible to specify a string as the column
object, which will be translated to column object with the title set.

An example:
```jsx
const columnsArray = [
  {name: 'id', title: '#'},
  {name: 'name': title: 'Name'}
]
const columnsObject = {
  id: '#',
  name: {title: 'Name'}
}
```

For each column the following props are supported:

| Prop | Description |
| --- | --- |
| name | column name |
| title | column title |
| props | props that should be applied on the `<th>` and the `<td>` of the column |
| thProps | props that should be applied on the `<th>` of the column |
| tdProps | props that should be applied on the `<td>` of the column |
| render | a function to render the contents of the `<td>`, when discarded the value for 'name' of the row will be used |

The `render` function has the following signature: `(row, col, index, data, columns) => any`.

#### elemProps

The prop `elemProps` is an object where the keys are either: 'table', 'thead',
'tbody', 'tr', 'th' or 'td'. The values are either objects which specify the
props of the element of a callback function which should return an object.
The arguments for the callback function vary per element type. The signatures
are as following:

| Element type | Arguments |
| --- | --- |
| table | *array* **data**, *object* **columns** |
| thead | *array* **data**, *object* **columns** |
| tbody | *array* **data**, *object* **columns** |
| tr    | bool **header**, *object\|null* **row**, int **index**, *array* **data**, *object* **columns** |
| th    | *object* **column**, *array* **data**, *object* **columns** |
| td    | *object* **column**, *object* **row**, int **index**, *array* **data**, *object* **columns** |

### Alternative Columns Specification

It's also possible to specify columns using `<th>` children. Every sub `<th>`
inside the `<TableFactory>` should have at least the prop `name`. This will be
the name of the column. All other props on the element will be used like the
props in the `columns` prop. The contents of the `<th>` will be title.

An example:
```jsx
<TableFactory id='id' data={rows}>
  <th name='id'>#</th>
  <th name='name'>Name</th>
  <th name='age' props={{
    style: {textAlign: 'right'} // Align both the <th> and the <td> to the right
  }}>Age</th>
</TableFactory>
```

This sub element syntax can also be used for specifying `elemProps` like this:

```jsx
<TableFactory id='id' data={rows} className='table'>
  {/* Specify elem props */}
  <thead className='table__head' />
  <tbody className='table__body' />
  <tr className='table__row' />
  <td className='table__cell' />
  <th className='table__cell table__cell--head' />

  {/* <th>'s with the name prop are ignored as elemProp */}
  <th name='id'>#</th>
  <th name='name'>Name</th>
  <th name='age'>Age</th>
</TableFactory>
```

Because `<tr>`'s are used in both `<thead>`'s and `<tbody>`'s it's possible to
specify props for just the `<thead>` of the `<tbody>` situations by nesting
them like this:

```jsx
<TableFactory id='id' data={rows} className='table'>
  {/* Specify thead specific <tr> class */}
  <thead className='table__head'>
    <tr className='table__row--head' />
  </thead>

  {/* Specify tbody specific <tr> class */}
  <tbody className='table__body'>
    <tr className='table__row--body' />
  </tbody>

  {/* Specify base <tr> class for both cases */}
  <tr className='table__row' />

  { ... }
</TableFactory>
```
