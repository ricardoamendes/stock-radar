const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dev = process.env.NODE_ENV == 'development';

const getPlugins = () => {
    var plugins = [];
    plugins.push(new webpack.EnvironmentPlugin({NODE_ENV: process.env.NODE_ENV, DEBUG: dev}));
    plugins.push(new HtmlWebpackInlineSourcePlugin());
    //plugins.push(new CopyWebpackPlugin([{ from: 'list.json' }]));
    plugins.push(new HtmlWebpackPlugin({
        template: __dirname + '/src/client/index.html',
        filename: 'index.html',
        inject: 'body',
        inlineSource: '.js'
    }));
    if (!dev) {
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }));
    }
    return plugins;
}

export default[
    {
        entry : path.resolve(__dirname, './src/client/app/index'),
        devtool : 'hidden-source-map',
        resolve : {
            modules: [
                'src/client/app', 'node_modules'
            ],
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        output : {
            filename: 'bundle-[hash:6].js',
            path: __dirname + '/dist'
        },
        module : {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }, {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loaders: ['react-hot-loader', 'babel-loader', 'ts-loader']
                }
            ]
        },
        plugins : getPlugins()
    }, {
        entry : path.resolve(__dirname, './src/server/index'),
        target : 'node',
        output : {
            filename: 'server.js',
            libraryTarget: 'commonjs'
        },
        module : {
            loaders: [
                {
                    test: /\.json$/,
                    loader: "json-loader"
                }, {
                    test: /\.js$/,
                    exclude: [path.join(__dirname, "node_modules")],
                    loader: 'babel-loader'
                }
            ]
        },
        externals : [/^(?!\.|\/).+/i]
    }
];