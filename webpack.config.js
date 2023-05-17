const path = require('path')

module.exports = {
    mode:'development',
    entry: './frontend/assets/main.js',    
    output: {
        publicPath: "/public/",
        path: path.resolve(__dirname, 'public', 'assets', 'js'),
        filename: 'bundle.js'
      },
      devtool: 'source-map'
}