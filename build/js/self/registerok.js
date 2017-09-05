"use strict";

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "",
    code = getQueryString("code");
var registerok = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
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
		$(".m-detail-backbtn").on("click", function () {
			window.history.back();
		});
		if (code == "0") {
			var registerinfo = sessionStorage.registerinfo ? JSON.parse(sessionStorage.registerinfo) : "";
			$(".m-registerok-content-box-ok .email").text(registerinfo.email);
			$(".m-registerok-content-box-ok").show();
			$(".m-registerok-content-box-not").hide();
		} else {
			var errormsg = sessionStorage.errormsg ? sessionStorage.errormsg : "システムエラーが発生しました。";
			$(".m-registerok-content-notice").text(errormsg);
			$(".m-registerok-content-box-not").show();
			$(".m-registerok-content-box-ok").hide();
		}
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
			registerok.oMenu();
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
		$(".m-member-common-btn-box").on("click", ".go", function () {
			window.location.href = "login.html";
		});
	}
};
if (sessionId && sessionId != "") {
	registerok.init();
} else {
	getSession.data(function () {
		registerok.init();
	});
}