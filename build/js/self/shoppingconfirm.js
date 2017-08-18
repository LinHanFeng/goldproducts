"use strict";

var sessionId = sessionStorage.sessionId || "";
var shoppingconfirm = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.getProduct(); //产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
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
			shoppingconfirm.oMenu();
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
		var oList = JSON.parse(sessionStorage.payProductLists);
		var oHtml = template("cartListTpl", oList.data);
		$(".m-shoppingconfirm-product-lists").html(oHtml);
		shoppingconfirm.getInfo();
	},
	getInfo: function getInfo() {
		var oList = JSON.parse(sessionStorage.productList),
		    oHtml = '',
		    oPriceHtml = '',
		    list = oList.goods_list;
		/*
  *印影信息
  */
		for (var i = 0; i < list.length; i++) {
			if (list[i].shadow && list[i].shadow != "") {
				oHtml += '<tr>' + '<td>書体：</td>' + '<td>' + list[i].shadow_name + '</td>' + '</tr>';
			}
			if (list[i].word_last_name && list[i].word_last_name != "") {
				oHtml += '<tr>' + '<td>雕刻名：</td>' + '<td>' + list[i].word_last_name + '</td>' + '</tr>';
			}
			if (list[i].sculpture_code && list[i].sculpture_code != "") {
				oHtml += '<tr>' + '<td>旧字コード：</td>' + '<td>' + list[i].sculpture_code + '</td>' + '</tr>';
			}
			if (list[i].diy && list[i].diy != "") {
				oHtml += '<tr>' + '<td>手彫り作成：</td>' + '<td>' + list[i].diy_name + '</td>' + '</tr>';
			}
			if (list[i].dummy && list[i].dummy != "") {
				oHtml += '<tr>' + '<td>アタリ：</td>' + '<td>' + list[i].dummy_name + '</td>' + '</tr>';
			}
			if (list[i].shadow_confirm && list[i].shadow_confirm != "") {
				oHtml += '<tr>' + '<td>デザイン確定：</td>' + '<td>' + list[i].shadow_confirm_name + '</td>' + '</tr>';
			}
			if (list[i].add_box_list && list[i].add_box_list != "") {
				oHtml += '<tr>' + '<td>追加商品：</td>' + '<td>' + list[i].add_box_list_name + '</td>' + '</tr>';
			}
			$(".m-shoppingconfirm-info-box-" + list[i].goods_id).find(".m-shoppingconfirm-info").html(oHtml);
			$(".m-shoppingconfirm-info-box-" + list[i].goods_id).show();
		}
		/*ご注文者情報*/
		var oI = list.length - 1;
		var dataUrl = oDomain + "/home/cart/checkout",
		    best_time = void 0;
		jsonData.getData(dataUrl, "GET", { "goodsId": list[oI].goods_id }, function (data) {
			console.log(data);
			if (data.code == 0) {
				$(".m-shoppingconfirm-info-box-" + list[oI].goods_id).find(".m-shoppingconfirm-method .text").text(data.data.payment.pay_name);
				$(".m-shoppingconfirm-info-box-" + list[oI].goods_id).find(".m-shoppingconfirm-service .text").text(data.data.payment.send_info);
				oHtml += '<tr><td>ご注文者氏名</td><td>' + data.data.consignee.consignee + '</td></tr>';
				oHtml += '<tr><td>ご注文者氏名ふりかな</td><td>' + data.data.consignee.consignee_pinyin + '</td></tr>';
				oHtml += '<tr><td>メールアドレス</td><td>' + data.data.consignee.email + '</td></tr>';
				oHtml += '<tr><td>メールアドレス[確認用]</td><td>' + data.data.consignee.email_confirm + '</td></tr>';
				oHtml += '<tr><td>電話番号</td><td>' + data.data.consignee.tel + '</td></tr>';
				oHtml += '<tr><td>FAX番号</td><td>' + data.data.consignee.fax + '</td></tr>';
				oHtml += '<tr><td>法人名</td><td>' + data.data.consignee.company_name + '</td></tr>';
				oHtml += '<tr><td>法人ふりがな</td><td>' + data.data.consignee.company_name_pinyin + '</td></tr>';
				oHtml += '<tr><td>部署名</td><td>' + data.data.consignee.department + '</td></tr>';
				oHtml += '<tr><td>郵便番号</td><td>' + data.data.consignee.zip + '</td></tr>';
				oHtml += '<tr><td>都道府県</td><td>' + data.data.consignee.province + '</td></tr>';
				oHtml += '<tr><td>市区郡町村</td><td>' + data.data.consignee.address + '</td></tr>';
				oHtml += '<tr><td>町・番地</td><td>' + data.data.consignee.address + '</td></tr>';
				oHtml += '<tr><td>アパート マンション ビル名等</td><td>' + data.data.consignee.address + '</td></tr>';
				if (data.data.consignee.best_time == "0") {
					best_time = "指定なし";
				} else if (data.data.consignee.best_time == "1") {
					best_time = "午前中";
				} else if (data.data.consignee.best_time == "2") {
					best_time = "14～16 時";
				} else if (data.data.consignee.best_time == "3") {
					best_time = "16～18 時";
				} else if (data.data.consignee.best_time == "4") {
					best_time = "18～20 時";
				} else if (data.data.consignee.best_time == "5") {
					best_time = "19～21 時";
				}
				oHtml += '<tr><td>配達希望時間</td><td>' + best_time + '</td></tr>';
				oHtml += '<tr><td>ヤマト運輸営業所での受け取り</td><td>' + data.data.consignee.issuing + '</td></tr>';
				oHtml += '<tr><td>領収証の宛名</td><td>' + data.data.consignee.invoice_owner + '</td></tr>';
				oHtml += '<tr><td>領収証の但し書き</td><td>' + data.data.consignee.invoice_title + '</td></tr>';
				oHtml += '<tr><td>ご連絡事項欄</td><td>' + data.data.consignee.remark + '</td></tr>';
				$(".m-shoppingconfirm-info-box-" + list[oI].goods_id).find(".m-shoppingconfirm-orderinfo tbody").html(oHtml);
				oPriceHtml += '<tr><td>商品小計金額</td><td>' + (data.data.total.goods_price ? data.data.total.goods_price : 0) + '</td></tr>';
				oPriceHtml += '<tr><td>送料</td><td>' + (data.data.total.shipping_fee ? data.data.total.shipping_fee : 0) + '</td></tr>';
				oPriceHtml += '<tr><td>利用ポイント</td><td>' + (data.data.total.use_point ? data.data.total.use_point : 0) + '</td></tr>';
				oPriceHtml += '<tr><td>獲得ポイント</td><td>' + (data.data.total.goods_all_point ? data.data.total.goods_all_point : 0) + '</td></tr>';
				oPriceHtml += '<tr><td>決済手数料</td><td>' + (data.data.total.pay_fee ? data.data.total.pay_fee : 0) + '</td></tr>';
				oPriceHtml += '<tr><td>合計金額</td><td class="total">' + (data.data.total.amount ? data.data.total.amount : 0) + '</td></tr>';
				$(".m-shoppingconfirm-info-box-" + list[oI].goods_id).find(".m-shoppingconfirm-price tbody").html(oPriceHtml);
			}
		});
	},
	oNext: function oNext() {
		$(".product-btn").on("click", ".go", function () {
			var dataUrl = oDomain + "/home/cart/done",
			    param = {
				"sessionId": sessionId
			};
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				if (data.code == 0) {
					window.location.href = "shoppingok.html?code=0&ordersn=" + data.data.order_sn;
				} else {
					window.location.href = "shoppingok.html?code=-1";
				}
			});
		});
	}
};
if (sessionId && sessionId != "") {
	shoppingconfirm.init();
} else {
	getSession.data(function () {
		shoppingconfirm.init();
	});
}