const path = require('path')
const OssClient = require('./aliOss')
const config = require(path.resolve(process.cwd(),'ossup.config.js')) || {}


function FileListPlugin(opt={}) {
	let options = {...config,...opt}
	this.reg = options.reg || ''
	this.matchReg = new RegExp(`(${options.reg})(.+?\.(png|jpg|jpeg|svg|gif))`,'g')
	this.replace = options.prefix?options.replace+'/'+options.prefix:options.replace
	this.assets = options.assets || ''
	this.prefix = options.prefix || ''
	this.OssClient = new OssClient({
		region: options.region,
		accessKeyId:options.accessKeyId,
		accessKeySecret:options.accessKeySecret,
		bucket: options.bucket,
	})
	this.suffix = ['wxml'].concat(options.suffix || [])
	this.isUp = options.isUp || false
}
FileListPlugin.prototype.apply = function(compiler) {
	compiler.hooks.emit.tap('compile',compilation => {
		const assets = compilation.assets // 获取输出资源
		let imgArr = []
		for(let filename in assets){
			let source = assets[filename].source()
			if(typeof source !== 'string'){
				// 处理图片等内容是Buffer情况
				const sf = filename.split('.')[1]
				if(this.suffix.indexOf(sf)>-1){
					source = source.toString()
				}else {
					continue
				}
			}
			let matchImg = source.match(this.matchReg)
			if(matchImg && matchImg.length>0){
				imgArr = imgArr.concat(matchImg)
			}
			// 替换后的资源
			let res = source.replace(this.matchReg,`${this.replace}$2`)
			assets[filename] = {
				source(){
					return res
				},
				size(){
					return this.source().length
				}
			}
		}
		/**
		 * 图片去重 上传
		 *
		 *  isUp参数用于区分是否上传图片  还是只是单纯的替换图片路径
		 * */
		if(this.isUp){
			imgArr = [...new Set(imgArr)].map(item => {
				const url = item.replace(this.reg, this.assets)
				const name = item.replace(this.reg+'/', '')
				return {name:this.prefix?`${this.prefix}/${name}`:name,url}
			})
			this.OssClient.put(imgArr)
		}

	})
};

module.exports = FileListPlugin;
