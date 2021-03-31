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
			assets: path.resolve(__dirname,'src/assets'),
			reg: '@oss',
			prefix: 'ceshi',
			replace: 'https://gxm-gf.oss-cn-beijing.aliyuncs.com',
			region: 'oss-cn-beijing',
			accessKeyId:'LTAI4G38u4xvLeUcrq5y7xz7',
			accessKeySecret:'t6pTYIqHeIqZoNA1IhC7eBx0vN7DUF',
			bucket:'gxm-gf',
		})
	],
	devtool: 'inline-source-map',
}
