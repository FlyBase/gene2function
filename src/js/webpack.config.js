var path = require('path');

module.exports = {
    entry: './app/index.js',
    output: {
        path: '../../public/js',
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
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    resolveLoader: {
    },
    resolve: {
    },
    externals: {
    }
};
