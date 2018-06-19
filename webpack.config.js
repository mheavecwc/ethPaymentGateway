var path = require('path');
var webpack = require('webpack');

 module.exports = {
     entry: ['babel-polyfill','./ui/src/EthPaymentGateway-transpiled.js'],
     output: {
         path: path.resolve(__dirname, './ui/contents'),
         filename: 'gateway.js',
         libraryTarget: "var",
         library: "EthPaymentGatewayLib"
     },
     module: {
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'   
 };