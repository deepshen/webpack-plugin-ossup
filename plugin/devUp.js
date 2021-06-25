#!/usr/bin/env nod
const path = require('path')
const fs = require('fs')
const OssClient = require('./aliOss')

const config = require(path.resolve(process.cwd(),'ossup.config.js')) || {}

const {ignoreSuffix=[], reg, prefix, assets} = config

const Oss = new OssClient({
	region: config.region,
	accessKeyId:config.accessKeyId,
	accessKeySecret:config.accessKeySecret,
	bucket: config.bucket,
})

const ignore = ['png','jpeg','jpg', 'gif', ...ignoreSuffix] // 忽略读取的文件类型
const matReg = new RegExp(`(${reg})(.+?\.(png|jpg|jpeg|svg|gif))`,'g')

/**
 * 主入口文件  默认src文件
 * */
const main = config.mainEntry || path.resolve(process.cwd(), 'src')

function repeatPath(route){
	fs.readdir(route,(err,files)=>{
		files.map(item => {
			const itemPath = path.resolve(route,item)
			const stat = fs.statSync(itemPath)
			if(stat.isDirectory()){
				// 是文件夹
				repeatPath(itemPath)
			}else {
				// 不是文件夹   读取下内容
				const suffix = item.split('.')
				if(suffix[1] && ignore.includes(suffix[1])){
					return
				}
				const data = fs.readFileSync(itemPath,'utf-8')
				const matchImg = data.match(matReg) || []
				const upData = matchImg.map(item => {
					const url = item.replace(reg, assets)
					const name = item.replace(reg+'/', '')
					return {name:prefix?`${prefix}/${name}`:name,url}
				})
				Oss.put(upData)
			}
		})
	})
}

repeatPath(main)

