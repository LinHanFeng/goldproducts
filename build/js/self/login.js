"use strict";

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "";
var login = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.lookpwd(); //显示密码
		this.delText(); //删除内容
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
			login.oMenu();
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
	lookpwd: function lookpwd() {
		$("#lookpwd").on("click", function () {
			if ($("#lookpwd").attr("checked") == true) {
				$("#memberpwd").attr({ "type": "text" });
			} else {
				$("#memberpwd").attr({ "type": "password" });
			}
		});
	},
	delText: function delText() {
		$(".f-del").each(function (index, elem) {
			$(elem).on("click", function () {
				$(this).siblings("input").val("");
			});
		});
	},
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	oNext: function oNext() {
		$(".btn-login").on("click", function () {
			$(".m-common-spinner").show();
			var name = $("input[name='memberid']").val() || undefined,
			    password = $("input[name='memberpwd']").val() || undefined,
			    dataUrl = oDomain + "/home/user/login",
			    param = {
				"username": name,
				"password": password
			};
			if (!name || name == "") {
				$(".m-popup-small-box .m-popup-small").text("会員ＩＤ（メールアドレス）、をご確認ください。");
				$(".m-popup-small-box").show();
				setTimeout(function () {
					$(".m-popup-small-box").hide();
				}, 800);
				return false;
			}
			if (!password || password == "") {
				$(".m-popup-small-box .m-popup-small").text("パスワードをご確認ください。");
				$(".m-popup-small-box").show();
				setTimeout(function () {
					$(".m-popup-small-box").hide();
				}, 800);
				return false;
			}
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					localStorage.userId = data.data.user_id;
					sessionStorage.clear();
					window.location.href = "index.html";
				} else {
					$(".m-login-notice").text(data.msg).show();
					return;
					$(".m-popup-small-box .m-popup-small").text(data.msg);
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 1000);
				}
			});
		});
		$(".btn-login-new").on("click", function () {
			window.location.href = "register.html";
		});
	}
};

if (sessionId && sessionId != "") {
	login.init();
} else {
	getSession.data(function () {
		login.init();
	});
}