# 用途
用于图片资源上传阿里云oss cdn并且引用，不用再打包图片资源到项目   
只会针对项目中的图片格式png|jpg|jpeg|svg|gif
# 引入plugin
```
npm i webpack-ossup-plugin 或者
yarn add webpack-ossup-plugin
```
# 使用方式
### 使用配置文件
配置文件在项目外层为ossup.config.js,插件会默认读取这个配置文件的内容，
然后和传入插件的options合并，传入插件的参数权重更高一点。
```
module.export = {
    assets: path.resolve(__dirname,'src/assets'),
    reg: '@oss',
    prefix: 'ceshi',
    replace: 'https://gxm-gf.oss-cn-beijing.aliyuncs.com',
    region: 'oss-cn-beijing',
    accessKeyId:'LTAI4G38u4xvLeUcrq5y7xz7',
    accessKeySecret:'t6pTYIqHeIqZoNA1IhC7eBx0vN7DUF',
    bucket:'gxm-gf',
}
```
### 1.常规项目
在webpack.config.js中
```
const WebpackOss = require('webpack-ossup-plugin')
module.exports = {
	plugins:[
    	new WebpackOss({
            assets: path.resolve(__dirname,'src/assets'),
            reg: '@oss',
            prefix: 'ceshi',
            replace: 'https://gxm-gf.oss-cn-beijing.aliyuncs.com',
            region: 'oss-cn-beijing',
            accessKeyId:'LTAI4G38u4xvLeUcrq5y7xz7',
            accessKeySecret:'t6pTYIqHeIqZoNA1IhC7eBx0vN7DUF',
            bucket:'gxm-gf',
        })
    ]
}
```
项目中使用图片：
比如按上述配置assets使用src/assets目录下图片
```
<img src='@oss/a.png' /> 
 或者在css中
 backgroun-img:url('@oss/a.png')
```
#### 注意：在css中使用style-loader会认为url是个静态模块，打包会报错，可以在rule中设置如下：
```
module.exports={
{
 test: /\.css$/,
 use: [{
  loader: "style-loader"
 },
  {
   loader: 'css-loader',
   options: {
    url: false  // 禁止url模块处理
   }
  }
 ]
},
}
```

### 2.在taro小程序中使用，目前只测试taro2可行
在config/index.js中，具体插件引入根据项目情况
```
mini: {
  webpackChain(config){
    config.plugin('ossup')
      .use(WebpackOssUp,[{
        assets: path.resolve(__dirname,'..','src/assets'),
        reg: '/@oss',
        prefix: 'ceshi',
        replace: 'https://gxm-gf.oss-cn-beijing.aliyuncs.com',
        region: 'oss-cn-beijing',
        accessKeyId:'LTAI4G38u4xvLeUcrq5y7xz7',
        accessKeySecret:'t6pTYIqHeIqZoNA1IhC7eBx0vN7DUF',
        bucket:'gxm-gf',
      }])
  },
```

# 插件参数说明
|名称|作用|默认值|类型|   
|---|---|---|---|   
|assets|上传图片放置位置,便于上传操作|''|string|
|reg|图片使用时固定前缀,带有此前缀的图片会被替换|''|string|
|prefix|上传至阿里云前置文件夹名称|''|string|
|replace|替换reg前缀为oss图片的路径url|''|string|
|`region`|阿里云oss区域|''|string|
|`accessKeyId`|阿里云oss的key值|''|string|
|`accessKeySecret`|阿里云oss的sevret|‘’|string|
|`bucket`|上传图片放置oss的bucket|‘’|string|
|suffix|用于解析输出文件时数据是buffer转string后处理数据，目前主要taro中导出的wxml文件是buffer数据无法替换|['wxml']|string[]|

# 注意事项
1.css解析图片报错具体参照上述修改css-loader配置修改
2.taro中解析会默认将@oss类似的图片路径解析为静态资源加上默认./@oss而导致他的loader解析报错，处理方式改为/@oss前缀来处理
3.taro中css的图片还未测试

# 建议
1.图片分环境上传至不通的文件夹，防止线上和测试环境一致导致不可估问题。
2.插件使用在build打包的时候，不要使用在本地服务中，不然hotserver每次更改会运行插件上传图片，浪费资源。
