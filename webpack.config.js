const path = require('path');
var SRC = path.resolve(__dirname, '');
module.exports = {
  module: {
    rules: [
      {
        test: /\.mp3$/,
        include: SRC,
        loader: 'file-loader'
      }
    ]
  }
};
