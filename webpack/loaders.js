module.exports = [
  {
    test: /\.js|\.jsx$/,
    loader: 'babel-loader',
    query: {
      retainLines: true,
      plugins: ['transform-runtime', 'transform-react-jsx'],
      presets: ['es2015', 'stage-2']
    },
    exclude: /node_modules/
  },
  {
    test: /\.html$/,
    loader: 'html-loader'
  },
  {
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
  }
]
