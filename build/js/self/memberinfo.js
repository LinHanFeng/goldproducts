"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sessionId = sessionStorage.sessionId || "",
    userId = localStorage.userId || "";
var memberinfo = {
	init: function init() {
		this.oLoad(); //页面初始化
		this.getMenu(); //获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getInfo(); //用户信息
		this.searchAddr(); //搜索地址
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
		$(".m-memberinfo-btn-box .back").on("click", function () {
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
			memberinfo.oMenu();
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
	getInfo: function getInfo() {
		var dataUrl = oDomain + "/home/user/userInfo",
		    param = {
			"userId": userId
		},
		    oList = new Array();
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			console.log(data);
			if (data.code == 0) {
				$("input[name='consignee-firstname']").val(data.data.consignee[0]);
				$("input[name='consignee-lastname']").val(data.data.consignee[1]);
				$("input[name='consignee-pingyin-firstname']").val(data.data.consignee[0]);
				$("input[name='consignee-pingyin-lastname']").val(data.data.consignee[1]);
				$("input[name='zipcode01']").val(data.data.zipcode[0]);
				$("input[name='zipcode02']").val(data.data.zipcode[1]);
				$("input[name='province']").val(data.data.province).attr("data-id", data.data.province_id);
				$("input[name='address_0']").val(data.data.address[0]);
				$("input[name='address_1']").val(data.data.address[1]);
				$("input[name='address_2']").val(data.data.address[2]);
				$("input[name='tel_0']").val(data.data.tel[0]);
				$("input[name='tel_1']").val(data.data.tel[1]);
				$("input[name='tel_2']").val(data.data.tel[2]);
				$("input#sex" + data.data.sex).attr("checked", true);
				$("input[name='year']").val(data.data.birthday[0]);
				$("input[name='month']").val(data.data.birthday[1]);
				$("input[name='day']").val(data.data.birthday[2]);
				$(".m-memberinfo-module-box").attr({ "data-addressId": data.data.address_id });
			}
		});
		dataUrl = oDomain + "/home/param/setBirthday", jsonData.getData(dataUrl, "GET", {}, function (data) {
			console.log(data);
			if (data.code == 0) {
				var year = data.data.year,
				    month = data.data.month,
				    day = data.data.day;
				var selectyear = new MobileSelect({
					trigger: '#year',
					wheels: [{
						data: year
					}],
					callback: function callback(i, d) {
						$("#year").val(d[0]);
					}
				});
				var selectmonth = new MobileSelect({
					trigger: '#month',
					wheels: [{
						data: month
					}],
					callback: function callback(i, d) {
						$("#month").val(d[0]);
					}
				});
				var selectday = new MobileSelect({
					trigger: '#day',
					wheels: [{
						data: day
					}],
					callback: function callback(i, d) {
						$("#day").val(d[0]);
					}
				});
			}
		});
		dataUrl = oDomain + "/home/param/cityList";
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
					callback: function callback(i, d) {
						$("#province").val(d[0].value);
						$("#province").attr({ "data-id": d[0].id });
					}
				});
			}
		});
	},
	searchAddr: function searchAddr() {
		$(".zipcode-btn").on("click", function () {
			$(".m-common-spinner").show();
			var zipcode = $("#zipcode1").val() + $("#zipcode2").val(),
			    dataUrl = oDomain + "/home/param/getAddressByCode",
			    registerinfo = sessionStorage.registerinfo ? JSON.parse(sessionStorage.registerinfo) : {},
			    param = {
				"code": zipcode
			};
			jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
				console.log(data);
				$(".m-common-spinner").hide();
				if (data.code == 0) {
					$("#province").val(data.data.region_name).attr({ "data-id": data.data.region_id });
					$("#address_0").val(data.data.address);
					registerinfo['province'] = data.data.region_name;
					registerinfo['province_id'] = data.data.region_id;
					registerinfo['address_0'] = data.data.address;
					sessionStorage.registerinfo = JSON.stringify(registerinfo);
				}
			});
		});
	},
	goCar: function goCar() {
		$(".m-nav-bottom-car,.m-common-car").on("click", function () {
			window.location.href = "shoppingcart.html";
		});
	},
	oNext: function oNext() {
		$(".m-memberinfo-btn-box").on("click", ".go", function () {
			var _prompt;

			$(".m-common-spinner").show();
			var password = $("input[name='password']").val() || "",
			    re_password = $("input[name='re_password']").val() || "",
			    real_name_former = $("input[name='consignee-firstname']").val() || "",
			    real_name_later = $("input[name='consignee-lastname']").val() || "",
			    kana_name_former = $("input[name='consignee-pingyin-firstname']").val() || "",
			    kana_name_later = $("input[name='consignee-pingyin-lastname']").val() || "",
			    sex = $("input[name='sex']:checked").val() || "",
			    birthday_year = $("input[name='year']").val() || "",
			    birthday_month = $("input[name='month']").val() || "",
			    birthday_day = $("input[name='day']").val() || "",
			    zipcode1 = $("input[name='zipcode01']").val() || "",
			    zipcode2 = $("input[name='zipcode02']").val() || "",
			    province = $("input[name='province']").val() || "",
			    province_id = $("input[name='province']").attr("data-id") || "",
			    address_0 = $("input[name='address_0']").val() || "",
			    address_1 = $("input[name='address_1']").val() || "",
			    address_2 = $("input[name='address_2']").val() || "",
			    tel_0 = $("input[name='tel_0']").val() || "",
			    tel_1 = $("input[name='tel_1']").val() || "",
			    tel_2 = $("input[name='tel_2']").val() || "",
			    address_id = $(".m-memberinfo-module-box").attr("data-addressId") || "",
			    isGo = true,
			    prompt = (_prompt = {
				"password": "メールアドレスをご入力ください",
				"re_password": "正しいメールアドレスをご入力ください"
			}, _defineProperty(_prompt, "password", "パスワードをご入力ください。"), _defineProperty(_prompt, "re_password", "確認用パスワードもご入力ください。"), _defineProperty(_prompt, "consignee-firstname", "注文者氏名は空っぽにならない"), _defineProperty(_prompt, "consignee-lastname", "注文者氏名は空っぽにならない"), _defineProperty(_prompt, "consignee-pingyin-firstname", "氏名ふりがなをご入力ください"), _defineProperty(_prompt, "consignee-pingyin-lastname", "氏名ふりがなをご入力ください"), _defineProperty(_prompt, "year", "生年月日をご記入ください"), _defineProperty(_prompt, "month", "生年月日をご記入ください"), _defineProperty(_prompt, "day", "生年月日をご記入ください"), _defineProperty(_prompt, "zipcode1", "郵便番号をご入力ください"), _defineProperty(_prompt, "zipcode2", "郵便番号をご入力ください"), _defineProperty(_prompt, "province", "都道府県をご選択ください"), _defineProperty(_prompt, "address_0", "市区郡町村をご入力ください"), _defineProperty(_prompt, "address_1", "町・番地をご入力ください"), _defineProperty(_prompt, "address_2", "17"), _defineProperty(_prompt, "tel_0", "電話番号をご入力ください"), _defineProperty(_prompt, "tel_1", "電話番号をご入力ください"), _defineProperty(_prompt, "tel_2", "電話番号をご入力ください"), _prompt);
			$(".m-memberinfo-module-box input[type='text']").each(function () {
				if (!$(this).val() || $(this).val() == "") {
					var oT = $(this).attr("name");
					$(".m-popup-small-box .m-popup-small").text(prompt[oT]);
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					isGo = false;
					return false;
				}
			});
			$(".m-memberinfo-module-box input[type='password']").each(function () {
				if (!$(this).val() || $(this).val() == "") {
					var oT = $(this).attr("name");
					$(".m-popup-small-box .m-popup-small").text(prompt[oT]);
					$(".m-popup-small-box").show();
					setTimeout(function () {
						$(".m-popup-small-box").hide();
					}, 800);
					isGo = false;
					return false;
				} else {
					if ($(this).attr("name") == "password" || $(this).attr("name") == "re_password") {
						if ($(this).val().length < 6 || $(this).val().length > 10) {
							$(".m-popup-small-box .m-popup-small").text("半角英数・記号6～10文字までご入力ください。");
							$(".m-popup-small-box").show();
							setTimeout(function () {
								$(".m-popup-small-box").hide();
							}, 800);
							isGo = false;
							return false;
						} else if ($("input[name='re_password']").val() != $("input[name='password']").val()) {
							$(".m-popup-small-box .m-popup-small").text("同じパスワードをご入力ください。");
							$(".m-popup-small-box").show();
							setTimeout(function () {
								$(".m-popup-small-box").hide();
							}, 800);
							isGo = false;
							return false;
						}
					}
				}
			});
			if (isGo == true) {
				var registerinfo = {
					"user_id": userId,
					"password": password,
					"re_password": re_password,
					"real_name_former": real_name_former,
					"real_name_later": real_name_later,
					"kana_name_former": kana_name_former,
					"kana_name_later": kana_name_later,
					"sex": sex,
					"birthday_year": birthday_year,
					"birthday_month": birthday_month,
					"birthday_day": birthday_day,
					"zipcode1": zipcode1,
					"zipcode2": zipcode2,
					"province": province,
					"province_id": province_id,
					"address_0": address_0,
					"address_1": address_1,
					"address_2": address_2,
					"tel_0": tel_0,
					"tel_1": tel_1,
					"tel_2": tel_2
				};
				var dataUrl = oDomain + "/home/user/updateUserInfo";
				jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(registerinfo) }, function (data) {
					$(".m-common-spinner").hide();
					if (data.code == 0) {
						window.location.reload();
					}
				});
			} else {
				$(".m-common-spinner").hide();
			}
		});
	}
};
if (sessionId && sessionId != "") {
	memberinfo.init();
} else {
	getSession.data(function () {
		memberinfo.init();
	});
}