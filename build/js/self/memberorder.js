"use strict";

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "";
var memberorder = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getPoint(); //获取积分
		this.getOrder(); //获取订单记录
		this.goCar(); //跳转购物车
		this.oNext(); //下一步
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
			memberorder.oMenu();
		});
		$(".m-common-menu,.m-common-stick-menu").on("click", function () {
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
	getPoint: function getPoint() {
		var dataUrl = oDomain + "/home/user/userMenuShow",
		    param = {
			"userId": userId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			if (data.code == 0) {
				$(".m-common-module-notice").find("em").text(data.data.consignee);
			}
		});
	},
	getOrder: function getOrder() {
		var dataUrl = oDomain + "/home/user/orderList",
		    param = {
			"userId": userId,
			"page": 1
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			if (data.code == 0) {
				if (data.data.length > 0) {
					var oHtml = template("orderTpl", data);
					$(".m-membermenu-history tbody").html(oHtml);
					$(".m-membermenu-history tbody").find("tr").each(function (index, elem) {
						$(elem).on("click", function () {
							window.location.href = "http://www.inkans.com/order-done-" + $(elem).attr("data-go") + ".html";
						});
					});
				}
			}
		});
	},
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	oNext: function oNext() {
		$(".m-member-common-btn-box .go").on("click", function () {
			window.location.href = "index.html";
		});
	}
};
if (sessionId && sessionId != "") {
	memberorder.init();
} else {
	getSession.data(function () {
		memberorder.init();
	});
}