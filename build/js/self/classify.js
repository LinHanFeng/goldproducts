"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
var classify = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.oMenu(); //
		this.getBasics(); //获取分类模块基本信息
		this.getAllseal(); //获取所有印材
		this.getGoodsList(); //获取分类商品
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
	getBasics: function getBasics() {
		var dataUrl = oDomain + "/home/category/cateBaseInfo";
		var param = {
			"catId": 61
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
		});
	},
	getAllseal: function getAllseal() {
		var dataUrl = oDomain + "/home/category/materiallist";
		var param = {
			"catId": 61
		};
		if (sessionStorage.materiallist) {
			console.log(JSON.parse(sessionStorage.materiallist));
			var oHtml = template("classifyTpl", JSON.parse(sessionStorage.materiallist));
			$(".m-classify-type").find(".content").html(oHtml);
			$(".m-classify-type .btn").on("click", function () {
				$(".m-classify-type ul").toggle();
			});
		} else {
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				if (data.code == 0) {
					sessionStorage.materiallist = JSON.stringify(data);
					var _oHtml = template("classifyTpl", data);
					$(".m-classify-type").find(".content").html(_oHtml);
					$(".m-classify-type .btn").on("click", function () {
						$(".m-classify-type ul").toggle();
					});
				}
			});
		}
	},
	getGoodsList: function getGoodsList() {
		var dataUrl = oDomain + "/home/category/cateGoodsList";
		var param = {
			"catId": 61
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
		});
	}
};
classify.init();