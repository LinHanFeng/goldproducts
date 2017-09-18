"use strict";

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "",
    code = getQueryString("code") || "",
    order_sn = getQueryString("ordersn") || "";
var shoppingok = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.oNext(); //下一步
	},
	oLoad: function oLoad() {
		if (code == 0) {
			$(".order-sn").text(order_sn);
			$(".m-shoppingok-detail-module-ok").show();
			$(".m-shoppingok-detail-module-not").hide();
		} else {
			var errormsg = sessionStorage.errorMsg ? JSON.parse(sessionStorage.errorMsg) : "";
			if (errormsg && errormsg != "") {
				$(".errormsg").text(errormsg);
			} else {
				$(".errormsg").hide();
			}
			$(".m-shoppingok-detail-module-not").show();
			$(".m-shoppingok-detail-module-ok").hide();
		}
		/*搜索*/
		$(".search-box .search-btn").on("click", function () {
			var oVal = $(".search-box input").val();
			sessionStorage.searchVal = oVal;
			window.location.href = "search.html?search=1";
		});
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
		if (userId && userId != "") {
			$(".m-shoppingcart-login").hide();
			var consignee = sessionStorage.consignee || "";
			if (consignee && consignee != "") {
				$(".m-common-step-text").find("em").text(consignee);
			} else {
				var _dataUrl = oDomain + "/home/user/userMenuShow",
				    _param = {
					"userId": userId
				};
				jsonData.getData(_dataUrl, "GET", { "data": JSON.stringify(_param) }, function (data) {
					console.log(data);
					if (data.code == 0) {
						$(".m-common-step-text").find("em").text(data.data.consignee);
						sessionStorage.consignee = data.data.consignee;
					}
				});
			}
		}
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
		$(".product-btn .back").on("click", function () {
			window.history.go(-1);
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
			shoppingok.oMenu();
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
	oNext: function oNext() {
		$(".product-btn").on("click", ".go", function () {
			window.location.href = "index.html";
		});
	}
};
if (sessionId && sessionId != "") {
	shoppingok.init();
} else {
	getSession.data(function () {
		shoppingok.init();
	});
}