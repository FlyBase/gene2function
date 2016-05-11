var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './app/index.js',
    output: {
        path: '../../public/assets',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["transform-object-rest-spread"]
                }
            },
            {
                test: /\.json$/, loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolveLoader: {
    },
    resolve: {
    },
    externals: {
    },
    plugins: [
        new ExtractTextPlugin('bundle.css')
    ]
};
