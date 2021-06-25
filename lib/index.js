(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('path'), require('ali-oss')) :
	typeof define === 'function' && define.amd ? define(['path', 'ali-oss'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.webpackOss = factory(global.path, global.Oss));
}(this, (function (path, aliOss$1) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
	var aliOss__default = /*#__PURE__*/_interopDefaultLegacy(aliOss$1);

	class OssClient {
	  constructor(option = {}) {
	    this.client = new aliOss__default['default'](option);
	  }

	  put(arr) {
	    try {
	      arr.map(async item => {
	        const result = (await this.client.put(item.name, item.url)) || {};
	        const {
	          name,
	          res = {}
	        } = result;

	        if (res.status === 200) {
	          console.log(name + '上传成功');
	        }

	        return item;
	      });
	    } catch (e) {
	      console.log(e);
	    }
	  }

	}

	var aliOss = OssClient;

	const config = require(path__default['default'].resolve(process.cwd(), 'ossup.config.js')) || {};

	function FileListPlugin(opt = {}) {
	  let options = { ...config,
	    ...opt
	  };
	  console.log(config);
	  this.reg = options.reg || '';
	  this.matchReg = new RegExp(`(${options.reg})(.+?\.(png|jpg|jpeg|svg|gif))`, 'g');
	  this.replace = options.prefix ? options.replace + '/' + options.prefix : options.replace;
	  this.assets = options.assets || '';
	  this.prefix = options.prefix || '';
	  this.OssClient = new aliOss({
	    region: options.region,
	    accessKeyId: options.accessKeyId,
	    accessKeySecret: options.accessKeySecret,
	    bucket: options.bucket
	  });
	  this.suffix = ['wxml'].concat(options.suffix || []);
	  this.isUp = options.isUp || false;
	}

	FileListPlugin.prototype.apply = function (compiler) {
	  compiler.hooks.emit.tap('compile', compilation => {
	    const assets = compilation.assets; // 获取输出资源

	    let imgArr = [];

	    for (let filename in assets) {
	      let source = assets[filename].source();

	      if (typeof source !== 'string') {
	        // 处理图片等内容是Buffer情况
	        const sf = filename.split('.')[1];

	        if (this.suffix.indexOf(sf) > -1) {
	          source = source.toString();
	        } else {
	          continue;
	        }
	      }

	      let matchImg = source.match(this.matchReg);

	      if (matchImg && matchImg.length > 0) {
	        imgArr = imgArr.concat(matchImg);
	      } // 替换后的资源


	      let res = source.replace(this.matchReg, `${this.replace}$2`);
	      assets[filename] = {
	        source() {
	          return res;
	        },

	        size() {
	          return this.source().length;
	        }

	      };
	    }
	    /**
	     * 图片去重 上传
	     *
	     *  isUp参数用于区分是否上传图片  还是只是单纯的替换图片路径
	     * */


	    if (this.isUp) {
	      imgArr = [...new Set(imgArr)].map(item => {
	        const url = item.replace(this.reg, this.assets);
	        const name = item.replace(this.reg + '/', '');
	        return {
	          name: this.prefix ? `${this.prefix}/${name}` : name,
	          url
	        };
	      });
	      this.OssClient.put(imgArr);
	    }
	  });
	};

	var plugin = FileListPlugin;

	return plugin;

})));
