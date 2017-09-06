"use strict";

var catId = void 0,
    sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "";
if (localStorage.catId) {
	catId = localStorage.catId;
} else if (getQueryString("catId")) {
	catId = getQueryString("catId");
} else {
	failLoad();
}
var classify = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.getBasics(); //获取分类模块基本信息
		this.getAllseal(); //获取所有印材
		this.getGoodsList(); //获取分类商品
		//this.goInfo();			//跳转详情页PS:getGoodsList调用
		//this.oTiao();			//锚点跳转PS:getAllseal调用
	},
	oLoad: function oLoad() {
		$(window).on("scroll", function () {
			var oT = 200,
			    oS = $(window).scrollTop();
			if (oS > oT) {
				$(".m-nav-bottom").show();
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			} else {
				$(".m-nav-bottom").hide();
				$(".m-common-stick").hide();
				$(".m-common-go-top").hide();
			}
		});
		var dataUrl = oDomain + "/home/cart/cartTotal";
		var param = { "sessionId": sessionId };
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (result) {
			if (result.code == 0) {
				$(".m-common-car em").text(result.data.count);
			}
		});
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
		$(".m-common-menu,.m-common-stick-menu").on("click", function () {
			$(".m-common-menu-box").show();
		});
	},
	oMenu: function oMenu() {
		if (userId && userId != "") {
			$(".m-common-menu-content-list .go").closest("li").show().siblings("li").hide();
			$(".m-common-menu-content-list .go").on("click", function () {
				localStorage.removeItem("userId");
				window.location.href = "index.html";
			});
		} else {
			$(".m-common-menu-content-list .go").closest("li").hide();
		}
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
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	getBasics: function getBasics() {
		var dataUrl = oDomain + "/home/category/cateBaseInfo";
		var param = {
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			$(".f-nowpage a").text(data.data.cat_name);
			for (var v in data.data) {
				console.log(v);
				if (v != "cat_id" && v != "cat_name") {
					$(".m-classify-ranking").show();
					$(".m-classify-ranking .content").append(data.data[v]);
				}
			}
		});
	},
	getAllseal: function getAllseal() {
		var dataUrl = oDomain + "/home/category/materiallist";
		var param = {
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			if (data.code == 0) {
				for (var i = 0; i < data.data.length; i++) {
					var oName = data.data[i].name;
					if (oName.indexOf("<br />") > 0) {
						data.data[i].name = oName.split("<br />");
					} else {
						data.data[i].name = new Array(oName);
					}
				}
				sessionStorage.materiallist = JSON.stringify(data);
				if (data.data && data.data != "") {
					var oHtml = template("classifyTpl", data);
					$(".m-classify-type").find(".content").html(oHtml);
					$(".m-classify-type").show();
					$(".m-classify-type .btn").on("click", function () {
						$(".m-classify-type ul").toggle();
					});
					classify.oTiao();
				} else {
					$(".m-classify-type").hide();
				}
			}
		});
	},
	getGoodsList: function getGoodsList() {
		var dataUrl = oDomain + "/home/category/cateGoodsList";
		var param = {
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
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
				window.location.href = "detail.html?goodsId=" + $(elem).attr("data-goodsid");
			});
			$(elem).on("click", ".btn", function () {
				$(".m-common-spinner").show();
				var dataUrl = oDomain + "/home/cart/addToCart",
				    userId = localStorage.userId || 0,
				    goodsId = $(elem).closest("li").attr("data-goodsid");
				var param = { "sessionId": sessionId, "userId": userId, "goodsId": goodsId, "number": 1 };
				jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
					console.log(data);
					if (data.code == 0) {
						$(".m-common-spinner").hide();
						window.location.href = "shoppingcart.html";
					}
				});
			});
		});
	},
	oTiao: function oTiao() {
		$(".m-classify-type li").each(function (index, elem) {
			$(elem).on("click", function () {
				var ov = $(elem).attr("data-id");
				window.location.href = "#" + ov;
			});
		});
	}
};

if (sessionId && sessionId != "") {
	classify.init();
} else {
	getSession.data(function () {
		classify.init();
	});
}