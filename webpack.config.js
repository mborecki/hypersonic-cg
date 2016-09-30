module.exports = {
    resolve: {
        root: __dirname + '/src',
        extentions: ['.js', '']
    },

    entry: {
        javascript: __dirname + '/src/app.js'
    },

    output: {
        path: __dirname,
        filename: 'index.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
