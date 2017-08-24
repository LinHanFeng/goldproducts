"use strict";

var sessionId = sessionStorage.sessionId || "";
var shoppingcart = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.getList(); //获取购物车列表
		//this.oProduct();		//商品操作PS:getList调用
		//this.oCal();			//计算总价PS:oProduct调用
		this.delProduct(); //删除商品
	},
	oLoad: function oLoad() {
		$(window).on("scroll", function () {
			var oT = 200,
			    oS = $(window).scrollTop();
			if (oS > oT) {
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			} else {
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
		$(".product-btn").on("click", ".go", function () {
			window.location.href = "shoppingInfo.html";
		});
		$(".product-btn").on("click", ".back", function () {
			window.history.go(-1);
		});
		$(".m-shoppingcart-container").on("click", ".content-no-goback", function () {
			window.location.href = "index.html";
		});
		// return;
		// let productList = {
		// 	goods_list:[],
		// 	total:{}
		// };
		// let $list =$(".content-has .product-list");
		// for(let i=0;i< $list.length;i++ ){
		// 	let oNum = $list.eq(i).find(".num").text(),
		// 		img = $list.eq(i).find(".pic img").attr("src"),
		// 		name = $list.eq(i).find(".f-name").text(),
		// 		price = $list.eq(i).find(".text em").text(),
		// 		goodsid = $list.eq(i).attr("data-goodsid"),
		// 		catid = $list.eq(i).attr("data-catid");
		// 	let list = {
		// 		goods_number : oNum,
		// 		goods_id : goodsid,
		// 		goods_thumb : img,
		// 		goods_name  : name,
		// 		goods_price : price,
		// 		cat_id : catid
		// 	};
		// 	productList.goods_list.push(list)
		// }
		// productList.total.format_goods_price = $(".product-total .price").text();
		// sessionStorage.productList = JSON.stringify(productList);
		// window.location.href = "shoppingInfo.html";
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
			shoppingcart.oMenu();
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
	getList: function getList() {
		var dataUrl = oDomain + "/home/cart/cartList";
		var param = { "sessionId": sessionId, "showall": 1 };
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			var oldData = sessionStorage.shoppingcart ? JSON.parse(sessionStorage.shoppingcart) : undefined;
			if (!oldData) {
				sessionStorage.removeItem("productList");
			} else {
				if (oldData.data.goods_list.length != data.data.goods_list.length) {
					sessionStorage.removeItem("productList");
				} else {
					for (var i = 0; i < oldData.data.goods_list.length; i++) {
						if (oldData.data.goods_list[i].goods_id != data.data.goods_list[i].goods_id || oldData.data.goods_list[i].goods_number != data.data.goods_list[i].goods_number) {
							sessionStorage.removeItem("productList");
						}
					}
				}
			}
			sessionStorage.shoppingcart = JSON.stringify(data);
			if (data.code == 0) {
				if (data.data.goods_list.length > 0) {
					$("content-no").hide();
					$(".m-shoppingcart-login,.m-shoppingcart-content-no-table").hide();
					$(".content-has").show();
					$(".product-price em").text(data.data.total.format_goods_price);
					$(".product-total .price").text(data.data.total.format_goods_price);
					$(".product-total .price").attr({ "data-total": data.data.total.goods_price });
					var oHtml = template("cartListTpl", data.data);
					$(".content-has").find(".product-lists").html(oHtml);
					shoppingcart.oProduct();
				} else {
					$(".content-has").hide();
					$(".content-no").show();
					$(".m-shoppingcart-login,.m-shoppingcart-content-no-table").show();
				}
			} else {
				failLoad();
			}
		});
	},
	oProduct: function oProduct() {
		var dataUrl = oDomain + "/home/cart/updateNumber",
		    param = {};
		$(".f-reduce").each(function (index, elem) {
			$(elem).on("click", function () {
				var oNum = parseInt($(elem).siblings(".num").text()),
				    singlePrice = $(elem).siblings(".num").attr("data-singleprice");
				if (oNum > 0) {
					$(elem).siblings(".num").text(oNum - 1);
					param = {
						"sessionId": sessionId,
						"cid": $(elem).closest(".product-list").attr("data-cid"),
						"number": $(elem).siblings(".num").text()
					};
					jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
						if (data.code == 0) {
							console.log("ok");
							sessionStorage.removeItem("productList");
						}
					});
					shoppingcart.oCal();
				}
			});
		});
		$(".f-add").each(function (index, elem) {
			$(elem).on("click", function () {
				var oNum = parseInt($(elem).siblings(".num").text()),
				    singlePrice = $(elem).siblings(".num").attr("data-singleprice");
				$(elem).siblings(".num").text(oNum + 1);
				param = {
					"sessionId": sessionId,
					"cid": $(elem).closest(".product-list").attr("data-cid"),
					"number": $(elem).siblings(".num").text()
				};
				jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
					if (data.code == 0) {
						console.log("ok");
						sessionStorage.removeItem("productList");
					}
				});
				shoppingcart.oCal();
			});
		});
	},
	oCal: function oCal() {
		var $oList = $(".content-has").find(".product-list"),
		    oTotal = 0;
		for (var i = 0; i < $oList.length; i++) {
			var oSingle = parseFloat($oList.eq(i).find(".num").attr("data-singleprice")),
			    oNum = parseInt($oList.eq(i).find(".num").text());
			oTotal += oSingle * oNum;
		}
		var n = JSON.stringify(oTotal),
		    newPrice = "";
		n = n.split("").reverse();
		for (var j = 0; j < n.length; j++) {
			console.log(n[j]);
			if (j % 3 == 0 && j != 0) {
				newPrice += ",";
			}
			newPrice += n[j];
		}
		newPrice = newPrice.split("").reverse().join("");
		$(".product-price").find("em").html("￥" + newPrice + "円");
		$(".product-total").find(".price").html("￥" + newPrice + "円");
		$(".product-total").find(".price").attr({ "data-total": newPrice });
	},
	delProduct: function delProduct() {
		$(".m-shoppingcart-detail").on("click", ".f-del", function () {
			$(".m-common-spinner").show();
			var that = this,
			    cid = $(that).attr("data-recid"),
			    dataUrl = oDomain + "/home/cart/delCartGoods",
			    param = { "sessionId": sessionId, "cid": cid };
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					var total = parseFloat($(".product-total").find(".price").attr("data-total")),
					    price = parseFloat($(that).closest(".product-list").find(".num").attr("data-goodsid")),
					    num = parseInt($(that).closest(".product-list").find(".num").text());
					sessionStorage.removeItem("productList");
					$(".product-price").find("em").html("￥" + total - price * num + "円~");
					$(".product-total").find(".price").html("￥" + total - price * num + "円~");
					$(".product-total").find(".price").attr({ "data-total": total - price * num });
					$(that).closest(".product-list").remove();
					shoppingcart.oCal();
					if ($(".content-has").find(".product-list").length == 0) {
						$(".content-has").hide();
						$(".content-no").show();
						$(".m-shoppingcart-login,.m-shoppingcart-content-no-table").show();
					}
				}
			});
		});
	}
};
if (sessionId && sessionId != "") {
	shoppingcart.init();
} else {
	getSession.data(function () {
		shoppingcart.init();
	});
}