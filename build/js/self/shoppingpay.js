"use strict";

var sessionId = sessionStorage.sessionId || "";
var shoppingpay = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getProduct(); //产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		this.choosePay(); //选择付款方式
	},
	oLoad: function oLoad() {},
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
			shoppingpay.oMenu();
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
	getProduct: function getProduct() {
		var oList = JSON.parse(sessionStorage.productList);
		console.log(oList);
		var oHtml = template("cartListTpl", oList);
		$(".m-shoppingpay-product-lists").html(oHtml);
		$(".m-shoppingpay-product-price .price").text(oList.total.format_goods_price);
		shoppingpay.getInfo();
	},
	getInfo: function getInfo() {},
	choosePay: function choosePay() {
		$(".m-shoppingpay-payment-lists").on("click", "input,label", function () {
			$(this).closest(".head").siblings(".content").show();
			$(this).closest(".m-shoppingpay-payment-box").siblings().find(".content").hide();
		});
	}
};
if (sessionId && sessionId != "") {
	shoppingpay.init();
} else {
	getSession.data(function () {
		shoppingpay.init();
	});
}