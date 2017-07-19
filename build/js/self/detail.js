"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
var detail = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.oMenu(); //菜单详情
		this.getDetail(); //获取详情
	},
	oLoad: function oLoad() {
		$(".m-common-menu").on("click", function () {
			$(".m-common-menu-box").show();
		});
		$(".m-detail-backbtn").on("click", function () {
			window.history.back();
		});
	},
	oMenu: function oMenu() {
		$(".m-common-menu-content-list-header").each(function (index, elem) {
			$(elem).on("click", function () {
				$(elem).siblings("ul").toggle();
			});
		});
		$(".m-common-menu-content-header").find(".btn").on("click", function () {
			$(".m-common-menu-box").hide();
		});
		$(".m-common-menu-close").on("click", function () {
			$(".m-common-menu-box").hide();
		});
	},
	getDetail: function getDetail() {
		var dataUrl = oDomain + "/home/Goods/goodsInfo";
		var param = {
			"goodsId": 13261
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
		});
	}
};
detail.init();