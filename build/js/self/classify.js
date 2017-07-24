"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
var catId = getQueryString("catId");
var classify = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getBasics(); //获取分类模块基本信息
		this.getAllseal(); //获取所有印材
		this.getGoodsList(); //获取分类商品
		//this.goInfo();			//跳转详情页PS:getGoodsList调用
	},
	oLoad: function oLoad() {
		$(".m-common-menu").on("click", function () {
			$(".m-common-menu-box").show();
		});
		$(".m-detail-backbtn").on("click", function () {
			window.history.back();
		});
	},
	getMenu: function getMenu() {
		var dataUrl = oDomain + "/home/index/menuList";
		jsonData.getData(dataUrl, "GET", {}, function (data) {
			console.log(data);
			var oHtml = template("menuTpl", data);
			$(".m-common-menu-content-lists").html(oHtml);
			if (data.data.other && data.data.other != "") {
				for (var i = 0; i < data.data.other.length; i++) {
					var _oHtml = '<div class="m-common-menu-content-list">' + '<a href="' + data.data.other[i].href + '">' + data.data.other[i].name;
					'</a>' + '</div>';
					$(".m-common-menu-content-lists").append();
				}
			}
			classify.oMenu();
		});
		$(".m-common-menu").on("click", function () {
			$(".m-common-menu-box").show();
		});
	},
	oMenu: function oMenu() {
		$(".m-common-menu-content-list-header").each(function (index, elem) {
			$(elem).on("click", function () {
				$(elem).find(".jt img").toggleClass("fan");
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
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			var ranking = data.data.ranking || "",
			    font = data.data.font || "",
			    general = data.data.general || "",
			    made = data.data.made || "",
			    instructions = data.data.instructions || "";
			if (font == "" && ranking == "" && general == "" && made == "" && instructions == "") {
				$(".m-classify-ranking").hide();
			}
			if (ranking && ranking != "") {
				$(".m-classify-ranking").show();
				$(".m-classify-ranking .content").append(ranking);
			}
			if (font && font != "") {
				$(".m-classify-ranking").show();
				$(".m-classify-ranking .content").append(font);
			}
			if (general && general != "") {
				$(".m-classify-ranking").show();
				$(".m-classify-ranking .content").append(general);
			}
			if (made && made != "") {
				$(".m-classify-ranking").show();
				$(".m-classify-ranking .content").append(made);
			}
			if (instructions && instructions != "") {
				$(".m-classify-ranking").show();
				$(".m-classify-ranking .content").append(instructions);
			}
		});
	},
	getAllseal: function getAllseal() {
		var dataUrl = oDomain + "/home/category/materiallist";
		var param = {
			"catId": catId
		};
		if (sessionStorage.materiallist) {
			console.log(JSON.parse(sessionStorage.materiallist));
			var data = JSON.parse(sessionStorage.materiallist);
			for (var i = 0; i < data.data.length; i++) {
				var oName = data.data[i].name;
				if (oName.indexOf("<br />") > 0) {
					data.data[i].name = oName.split("<br />");
				}
			}
			var oHtml = template("classifyTpl", data);
			$(".m-classify-type").find(".content").html(oHtml);
			$(".m-classify-type .btn").on("click", function () {
				$(".m-classify-type ul").toggle();
			});
		} else {
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				if (data.code == 0) {
					for (var _i = 0; _i < data.data.length; _i++) {
						var _oName = data.data[_i].name;
						if (_oName.indexOf("<br />") > 0) {
							data.data[_i].name = _oName.split("<br />");
						}
					}
					sessionStorage.materiallist = JSON.stringify(data);
					var _oHtml2 = template("classifyTpl", data);
					$(".m-classify-type").find(".content").html(_oHtml2);
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
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			if (data.code == 0) {
				var oHtml = template("moduleTpl", data);
				$(".m-classify-modules").html(oHtml);
				classify.goInfo();
			}
		});
	},
	goInfo: function goInfo() {
		$(".modules-list-content-scroll li").each(function (index, elem) {
			$(elem).on("click", ".img,.detail", function () {
				window.location.href = "detail.html?goodsId=" + $(elem).attr("data-id");
			});
		});
	}
};
classify.init();