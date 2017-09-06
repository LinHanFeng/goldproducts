"use strict";

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "";
var memberinfoconfirm = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getInfo(); //获取会员信息
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
		$(".m-member-common-btn-box").on("click", ".back", function () {
			window.history.go(-1);
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
			memberinfoconfirm.oMenu();
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
	getInfo: function getInfo() {
		var registerinfo = sessionStorage.memberinfo ? JSON.parse(sessionStorage.memberinfo) : "";
		if (!registerinfo || registerinfo == "") {
			window.history.go(-1);
		}
		console.log(registerinfo);
		$(".real_name .value").text(registerinfo.real_name_former + registerinfo.real_name_later);
		$(".kana_name .value").text(registerinfo.kana_name_former + registerinfo.kana_name_later);
		$(".sex .value").text(registerinfo.sex == 0 ? "男" : "女");
		$(".birthday .value").text(registerinfo.birthday_year + registerinfo.birthday_month + registerinfo.birthday_day);
		$(".addr .value").text(registerinfo.zipcode1 + registerinfo.zipcode2 + " " + registerinfo.province + registerinfo.address_0 + registerinfo.address_1 + registerinfo.address_2);
		$(".tel .value").text(registerinfo.tel_0 + registerinfo.tel_1 + registerinfo.tel_2);
		$(".password .value").text(registerinfo.password);
		$(".re_password .value").text(registerinfo.re_password);
	},
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	oNext: function oNext() {
		$(".m-member-common-btn-box").on("click", ".go", function () {
			$(".m-common-spinner").show();
			var memberinfo = JSON.parse(sessionStorage.memberinfo);
			var dataUrl = oDomain + "/home/user/updateUserInfo";
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(memberinfo) }, function (data) {
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					sessionStorage.msg = memberinfo.real_name_former + memberinfo.real_name_later + "様、登録内容の変更が完了しました。";
					window.location.href = "prompt.html?code=0&form=memberinfo";
				} else {
					sessionStorage.msg = data.msg;
					window.location.href = "prompt.html?code=-1&form=memberinfo";
				}
			});
		});
	}
};

if (sessionId && sessionId != "") {
	memberinfoconfirm.init();
} else {
	getSession.data(function () {
		memberinfoconfirm.init();
	});
}