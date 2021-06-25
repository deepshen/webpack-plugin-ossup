const path = require('path')
const env = process.env.NODE_ENV
console.log(env)
module.exports = {
	assets: path.resolve(__dirname,'src/assets'),
	reg: '@oss',
	prefix: 'ceshi',
	replace: 'https://gxm-gf.oss-cn-beijing.aliyuncs.com',
	region: 'oss-cn-beijing',
	accessKeyId:'LTAI4G38u4xvLeUcrq5y7xz7',
	accessKeySecret:'t6pTYIqHeIqZoNA1IhC7eBx0vN7DUF',
	bucket:'gxm-gf',
}
