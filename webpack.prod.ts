import fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

module.exports = () => {
    return {
        mode: 'production',

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'game.[contenthash].js'
        },

        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css'
            }),

            new webpack.DefinePlugin({
                VERSION: JSON.stringify(pkg.version + '-r')
            }),

            new ESLintPlugin({
                extensions: ['js', 'jsx', 'ts', 'tsx'],
                emitError: true,
                emitWarning: true,
                failOnError: true,
                failOnWarning: true
            }),

            new webpack.ProgressPlugin()
        ]
    };
};
