"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
var classify = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getBasics(); //获取分类模块基本信息
		this.getAllseal(); //获取所有印材
		this.getGoodsList(); //获取分类商品
	},
	oLoad: function oLoad() {},
	getBasics: function getBasics() {
		var dataUrl = oDomain + "/home/category/cateBaseInfo";
		jsonData.getData(dataUrl, "GET", { "catId": "61" }, function (data) {
			console.log(data);
		});
	},
	getAllseal: function getAllseal() {
		var dataUrl = oDomain + "/home/category/materialist";
		jsonData.getData(dataUrl, "GET", { "catId": "61" }, function (data) {
			console.log(data);
		});
	},
	getGoodsList: function getGoodsList() {
		var dataUrl = oDomain + "/home/category/cateGoodsList";
		jsonData.getData(dataUrl, "GET", { "catId": "61" }, function (data) {
			console.log(data);
		});
	}
};
classify.init();