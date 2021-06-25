const Oss = require('ali-oss')

class OssClient{
	constructor(option={}) {
		this.client = new Oss(option)
	}
	put(arr){
		try {
			 arr.map(async item => {
				const result = await this.client.put(item.name,item.url) || {}
				const {name,res={}} = result
				if(res.status === 200){
					console.log(name+'上传成功')
				}
				return item
			})
		}catch (e) {
			console.log(e)
		}
	}
}


module.exports = OssClient
