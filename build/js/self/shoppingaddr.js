"use strict";

var sessionId = sessionStorage.sessionId || "";
var shoppingaddr = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.getProduct(); //产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		this.isSame(); //是否同收件人
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
		$(".product-btn .back").on("click", function () {
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
			shoppingaddr.oMenu();
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
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	getProduct: function getProduct() {
		var oList = JSON.parse(sessionStorage.productList);
		console.log(oList);
		var oHtml = template("cartListTpl", oList);
		$(".m-shoppingaddr-product-lists").html(oHtml);
		$(".m-shoppingaddr-product-price .price").text(oList.total.format_goods_price);
	},
	isSame: function isSame() {
		$("input[name='destination']").on("click", function () {
			console.log($(this).val());
			if ($(this).val() == "same") {
				$(".m-shoppingaddr-detail-module-diff").hide();
			} else {
				$(".m-shoppingaddr-detail-module-diff").show();
			}
		});
	},
	oNext: function oNext() {
		$(".product-btn").on("click", ".go", function () {
			var dataUrl = oDomain + "/home/cart/address",
			    param = void 0;

			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
			});
		});
	}
};
if (sessionId && sessionId != "") {
	shoppingaddr.init();
} else {
	getSession.data(function () {
		shoppingaddr.init();
	});
}