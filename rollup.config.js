import common from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'

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
		'ali-oss',
		'path'
	],
	plugins:[
		copy({
			targets: [
				{src: 'plugin/aliOss.js', dest: 'lib'},
				{src: 'plugin/devUp.js', dest: 'lib'}
			]
		}),
		resolve(),
		common({
			ignore: [ 'conditional-runtime-dependency' ]
		}),
		babel({
			exclude:['node_modules']
		}),
	]
}
