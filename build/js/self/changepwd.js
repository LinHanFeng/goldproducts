"use strict";

var sessionId = sessionStorage.sessionId ? sessionStorage.sessionId : "",
    userId = localStorage.userId ? localStorage.userId : "";
var changepwd = {
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
			changepwd.oMenu();
		});
		$(".m-common-menu,.m-common-stick-menu").on("click", function () {
			$(".m-common-menu-box").show();
		});
	},
	oMenu: function oMenu() {
		if (userId && userId != "") {
			$(".m-common-menu-content-list-header .go").closest("li").show().siblings("li").hide();
			$(".m-common-menu-content-list-header .go").on("click", function () {
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
		$(".m-member-common-btn-box").on("click", ".go", function () {
			var dataUrl = oDomain + "/home/user/resetPassword",
			    password = $("#password").val() || "",
			    re_password = $("#re_password").val() || "";
			if (!password || password == "") {
				$(".m-popup-small-box .m-popup-small").text("パスワードをご入力ください。");
				$(".m-popup-small-box").show();
				setTimeout(function () {
					$(".m-popup-small-box").hide();
				}, 800);
				return;
			}
			if (!re_password || re_password == "") {
				$(".m-popup-small-box .m-popup-small").text("確認用パスワードもご入力ください。");
				$(".m-popup-small-box").show();
				setTimeout(function () {
					$(".m-popup-small-box").hide();
				}, 800);
				return;
			}
			if (password != re_password) {
				$(".m-popup-small-box .m-popup-small").text("同じパスワードをご入力ください。");
				$(".m-popup-small-box").show();
				setTimeout(function () {
					$(".m-popup-small-box").hide();
				}, 800);
				return;
			}
			var param = {
				"userId": userId,
				"password": password,
				"repassword": re_password
			};
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				if (data.code == 0) {
					localStorage.removeItem("userId");
					window.location.href = "login.html";
				} else if (data.code == 1) {
					localStorage.removeItem("userId");
					window.location.href = "login.html";
				}
			});
		});
	}
};

if (sessionId && sessionId != "") {
	changepwd.init();
} else {
	getSession.data(function () {
		changepwd.init();
	});
}