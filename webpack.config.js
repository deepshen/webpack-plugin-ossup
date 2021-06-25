const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const Webpackoss = require('./lib/index')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{
					loader: "style-loader"
				},
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					}
				]
			},
			{
				test: /\.(png|jpg)$/,
				use: [{
					loader: "file-loader",
					options: {
						outputPath: 'img'
					}
				}],
			},
		]
	},
	devServer: {
		port: 8814,
	},
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlPlugin({
			title: "Webpack App"
		}),
		new Webpackoss({
			isUp: true
		})
	],
	devtool: 'inline-source-map',
}
