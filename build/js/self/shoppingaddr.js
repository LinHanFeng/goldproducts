"use strict";

var sessionId = sessionStorage.sessionId || "";
var shoppingaddr = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar(); //跳转购物车
		this.getProduct(); //产品渲染
		this.selectAddr(); //选择城市
		this.searchAddr(); //搜索地址
		this.isSame(); //是否同收件人
		this.onBlur(); //失去焦点存储
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
		var shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {};
		if (shoppingaddr && shoppingaddr != "") {
			for (var v in shoppingaddr) {
				if (v == "province") {
					$("input[name='" + v + "']").val(shoppingaddr[v]).attr({ "data-id": shoppingaddr["province_id"] });
				} else if (v == "province_d") {
					$("input[name='" + v + "']").val(shoppingaddr[v]).attr({ "data-id": shoppingaddr["province_d_id"] });
				} else if (v == "other_address") {
					if (shoppingaddr[v] == "0") {
						$("#same").attr({ "checked": "checked" });
						$(".m-shoppingaddr-detail-module-diff").hide();
					} else {
						$("#diff").attr({ "checked": "checked" });
						$(".m-shoppingaddr-detail-module-diff").show();
					}
				} else if (v == "deliverytime") {
					$("#deliverytime").val(shoppingaddr[v]);
				} else {
					$("input[name='" + v + "']").val(shoppingaddr[v]);
				}
			}
		}
	},
	getMenu: function getMenu() {
		var dataUrl = oDomain + "/home/index/menuList";
		jsonData.getData(dataUrl, "GET", {}, function (data) {
			console.log(data);
			if (data.code == 0) {
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
			}
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
		$(".m-shoppingaddr-product-lists").html(oHtml);
		// $(".m-shoppingaddr-product-price .price").text(oList.data.total.format_goods_price);
	},
	selectAddr: function selectAddr() {
		var dataUrl = oDomain + "/home/param/cityList",
		    oList = new Array();
		jsonData.getData(dataUrl, "GET", {}, function (result) {
			if (result.code == 0) {
				for (var i = 0; i < result.data.length; i++) {
					oList.push({
						"id": result.data[i].region_id,
						"value": result.data[i].region_name
					});
				}
				var selectProvince = new MobileSelect({
					trigger: '#province',
					wheels: [{
						data: oList
					}],
					// position:[2], //Initialize positioning
					callback: function callback(i, d) {
						var shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {};
						shoppingaddr['province'] = d[0].value;
						shoppingaddr['province_id'] = d[0].id;
						sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
						$("#province").val(d[0].value);
						$("#province").attr({ "data-id": d[0].id });
					}
				});
				var selectProvince_d = new MobileSelect({
					trigger: '#province_d',
					wheels: [{
						data: oList
					}],
					// position:[2], //Initialize positioning
					callback: function callback(i, d) {
						var shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {};
						shoppingaddr['province_d'] = d[0].value;
						shoppingaddr['province_d_id'] = d[0].id;
						sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
						$("#province_d").val(d[0].value);
						$("#province_d").attr({ "data-id": d[0].id });
					}
				});
			}
		});
	},
	searchAddr: function searchAddr() {
		$(".zipcode-btn").on("click", function () {
			$(".m-common-spinner").show();
			var zipcode = $("#zipcode_0").val() + $("#zipcode_1").val(),
			    dataUrl = oDomain + "/home/param/getAddressByCode",
			    shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {},
			    param = {
				"code": zipcode
			};
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					$("#province").val(data.data.region_name).attr({ "data-id": data.data.region_id });
					$("#address_0").val(data.data.address);
					shoppingaddr['province'] = data.data.region_name;
					shoppingaddr['province_id'] = data.data.region_id;
					shoppingaddr['address_0'] = data.data.address;
					sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
				}
			});
		});
		$(".zipcode-d-btn").on("click", function () {
			$(".m-common-spinner").show();
			var zipcode = $("#zipcode_d_0").val() + $("#zipcode_d_1").val(),
			    dataUrl = oDomain + "/home/param/getAddressByCode",
			    shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {},
			    param = {
				"code": zipcode
			};
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					$("#province_d").val(data.data.region_name).attr({ "data-id": data.data.region_id });
					$("#address_d_0").val(data.data.address);
					shoppingaddr['province_d'] = data.data.region_name;
					shoppingaddr['province_d_id'] = data.data.region_id;
					shoppingaddr['address_d_0'] = data.data.address;
					sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
				}
			});
		});
	},
	isSame: function isSame() {
		$("input[name='other_address']").on("click", function () {
			if ($(this).val() == "0") {
				$(".m-shoppingaddr-detail-module-diff").hide();
			} else {
				$(".m-shoppingaddr-detail-module-diff").show();
			}
		});
	},
	onBlur: function onBlur() {
		var shoppingaddr = sessionStorage.shoppingaddr ? JSON.parse(sessionStorage.shoppingaddr) : {};
		$("input").on("change", function () {
			var oClass = $(this).attr("name");
			shoppingaddr[oClass] = $(this).val();
			console.log(province);
			sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
		});

		$("#deliverytime").on("change", function () {
			shoppingaddr["deliverytime"] = $(this).val();
			sessionStorage.shoppingaddr = JSON.stringify(shoppingaddr);
		});
	},
	oNext: function oNext() {
		$(".product-btn").on("click", ".go", function () {
			$(".m-common-spinner").show();
			var dataUrl = oDomain + "/home/cart/address",
			    param = void 0,
			    consignee = $("#consignee").val(),
			    consignee_pinyin = $("#consignee_pinyin").val(),
			    email = $("#email").val(),
			    email_confirm = $("#email-confirm").val(),
			    tel_0 = $("#tel_0").val(),
			    tel_1 = $("#tel_1").val(),
			    tel_2 = $("#tel_2").val(),
			    zipcode_0 = $("#zipcode_0").val(),
			    zipcode_1 = $("#zipcode_1").val(),
			    province = $("#province").attr("data-id"),
			    address_0 = $("#address_0").val(),
			    address_1 = $("#address_1").val(),
			    address_2 = $("#address_2").val(),
			    fax_0 = $("#fax_0").val(),
			    fax_1 = $("#fax_1").val(),
			    fax_2 = $("#fax_2").val(),
			    company_name = $("#company_name").val(),
			    company_name_pinyin = $("#company_name_pinyin").val(),
			    department = $("#department").val(),
			    other_address = $("input[name='other_address']:checked").val(),
			    best_time = $("#deliverytime").val(),
			    invoice_owner = $("#receiptaddress").val(),
			    invoice_title = $("#receiptnotice").val(),
			    remark = $("#contactinfo").val(),
			    issuing = $("#receive").val();
			if (other_address == 0) {
				if (consignee == "") {
					$(".m-popup-small-box .m-popup-small").text("注文者氏名は空っぽにならない");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (consignee_pinyin == "") {
					$(".m-popup-small-box .m-popup-small").text("氏名ふりがなをご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				var email_reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
				if (email == "") {
					$(".m-popup-small-box .m-popup-small").text("メールアドレスをご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				} else if (email_reg.test(email) == false) {
					$(".m-popup-small-box .m-popup-small").text("正しいメールアドレスをご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (email_confirm != email) {
					$(".m-popup-small-box .m-popup-small").text("同じメールアドレスをご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (tel_0 == "" || tel_1 == "" || tel_2 == "") {
					$(".m-popup-small-box .m-popup-small").text("電話番号をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (zipcode_0 == "" || zipcode_1 == "") {
					$(".m-popup-small-box .m-popup-small").text("郵便番号をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (province == "") {
					$(".m-popup-small-box .m-popup-small").text("都道府県をご選択ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (address_0 == "") {
					$(".m-popup-small-box .m-popup-small").text("市区郡町村をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (address_1 == "") {
					$(".m-popup-small-box .m-popup-small").text("町・番地をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				param = {
					"sessionId": sessionId,
					"consignee": consignee,
					"consignee_pinyin": consignee_pinyin,
					"email": email,
					"email_confirm": email_confirm,
					"tel_0": tel_0,
					"tel_1": tel_1,
					"tel_2": tel_2,
					"zipcode_0": zipcode_0,
					"zipcode_1": zipcode_1,
					"province": province,
					"address_0": address_0,
					"address_1": address_1,
					"address_2": address_2,
					"fax_0": fax_0,
					"fax_1": fax_1,
					"fax_2": fax_2,
					"company_name": company_name,
					"company_name_pinyin": company_name_pinyin,
					"department": department,
					"other_address": other_address,
					"best_time": best_time,
					"invoice_owner": invoice_owner,
					"invoice_title": invoice_title,
					"remark": remark,
					"issuing": issuing
				};
			} else {
				var consignee_d = $("#familyname").val() + " " + $("#lastname").val(),
				    consignee_d_pinyin = $("#kana-familyname").val() + " " + $("#kana-lastname").val(),
				    province_d = $("#province_d").attr("data-id"),
				    tel_d_0 = $("#diff-phone1").val(),
				    tel_d_1 = $("#diff-phone2").val(),
				    tel_d_2 = $("#diff-phone3").val(),
				    zipcode_d_0 = $("#zipcode_d_0").val(),
				    zipcode_d_1 = $("#zipcode_d_1").val(),
				    address_d_0 = $("#address_d_0").val(),
				    address_d_1 = $("#address_d_1").val(),
				    address_d_2 = $("#address_d_2").val();
				if (consignee_d == "") {
					$(".m-popup-small-box .m-popup-small").text("注文者氏名は空っぽにならない");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (consignee_d_pinyin == "") {
					$(".m-popup-small-box .m-popup-small").text("氏名ふりがなをご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (tel_d_0 == "" || tel_d_1 == "" || tel_d_2 == "") {
					$(".m-popup-small-box .m-popup-small").text("電話番号をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (zipcode_d_0 == "" || zipcode_d_1 == "") {
					$(".m-popup-small-box .m-popup-small").text("郵便番号をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (province_d == "") {
					$(".m-popup-small-box .m-popup-small").text("都道府県をご選択ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (address_d_0 == "") {
					$(".m-popup-small-box .m-popup-small").text("市区郡町村をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				if (address_d_1 == "") {
					$(".m-popup-small-box .m-popup-small").text("町・番地をご入力ください");
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					$(".m-common-spinner").hide();
					return false;
				}
				param = {
					"sessionId": sessionId,
					"consignee": consignee,
					"consignee_pinyin": consignee_pinyin,
					"email": email,
					"email_confirm": email_confirm,
					"tel_0": tel_0,
					"tel_1": tel_1,
					"tel_2": tel_2,
					"zipcode_0": zipcode_0,
					"zipcode_1": zipcode_1,
					"province": province,
					"address_0": address_0,
					"address_1": address_1,
					"address_2": address_2,
					"fax_0": fax_0,
					"fax_1": fax_1,
					"fax_2": fax_2,
					"company_name": company_name,
					"company_name_pinyin": company_name_pinyin,
					"department": department,
					"other_address": other_address,
					"consignee_d": consignee_d,
					"consignee_pinyin_d": consignee_d_pinyin,
					"tel_d_0": tel_d_0,
					"tel_d_1": tel_d_1,
					"tel_d_2": tel_d_2,
					"zipcode_d_0": zipcode_d_0,
					"zipcode_d_1": zipcode_d_1,
					"province_d": province_d,
					"address_d_0": address_d_0,
					"address_d_1": address_d_1,
					"address_d_2": address_d_2,
					"best_time": best_time,
					"invoice_owner": invoice_owner,
					"invoice_title": invoice_title,
					"remark": remark,
					"issuing": issuing

				};
			}

			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				if (data.code == 0) {
					$(".m-common-spinner").hide();
					window.location.href = "shoppingconfirm.html";
				}
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