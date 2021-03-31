import common from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
	input: 'plugin/index.js',
	output:{
		name: 'webpackOss',
		file: 'lib/index.js',
		format: 'umd',
		globals:{
			'ali-oss':'Oss'
		}
	},
	external:[
		'ali-oss'
	],
	plugins:[
		resolve(),
		common(),
		babel({
			exclude:['node_modules']
		}),
	]
}