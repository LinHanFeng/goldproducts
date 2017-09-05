let sessionId = sessionStorage.sessionId || "",
	userId = localStorage.userId || "";
const registerinfo = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getInfo();			//获取日期&省
		this.searchAddr();			//搜索地址
		this.goCar();			//跳转购物车
		this.oNext();			//下一步
	},
	oLoad : function(){
		$(window).on("scroll",function(){
			let oT = 200,
				oS = $(window).scrollTop();
			if(oS > oT){
				$(".m-nav-bottom").show();
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			}else{
				$(".m-nav-bottom").hide();
				$(".m-common-stick").hide();
				$(".m-common-go-top").hide();
			}
		})
		let dataUrl = oDomain + "/home/cart/cartTotal";
		let param = {"sessionId":sessionId}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(result){
			if(result.code == 0){
				$(".m-common-car em").text(result.data.count);
			}
		})
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
		$(".m-detail-backbtn").on("click",function(){
			window.history.back();
		})
	},
	getMenu:function(){
		let dataUrl = oDomain + "/home/index/menuList";
		jsonData.getData(dataUrl,"GET",{},function(data){
			let oHtml = template("menuTpl",data);
			$(".m-common-menu-content-lists").html(oHtml);
			if(data.data.other && data.data.other !=""){						
				for(let i=0;i<data.data.other.length;i++){
					let oHtml = '<div class="m-common-menu-content-list">'+
					'<a href="'+data.data.other[i].href+'">'+data.data.other[i].name
					'</a>'+
					'</div>';
					$(".m-common-menu-content-lists").append();
				}
			}
			registerinfo.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
		if(userId && userId !=""){
			$(".m-common-menu-content-list .go").closest("li").show()
				.siblings("li").hide();
			$(".m-common-menu-content-list .go").on("click",function(){
				localStorage.removeItem("userId");
				window.location.href = "index.html";
			})
		}
		$(".m-common-menu-content-list-header").each(function(index,elem){
			$(elem).on("click",function(){
				$(elem).find(".jt img").toggleClass("fan");
				$(elem).siblings("ul").toggle();
			})
		})
		$(".m-common-menu-content-header").find(".btn").on("click",function(){
			$(".m-common-menu-box").hide();
		})
		$(".m-common-menu-close").on("click",function(){
			$(".m-common-menu-box").hide();
		})
	},
	getInfo:function(){
		let dataUrl = oDomain + "/home/param/setBirthday",oList=new Array(),
			registerinfo =sessionStorage.registerinfo ? JSON.parse(sessionStorage.registerinfo) : "";
		jsonData.getData(dataUrl,"GET",{},function(data){
			console.log(data);
			if(data.code == 0){
				let year = data.data.year,
					month = data.data.month,
					day = data.data.day;
				let selectyear = new MobileSelect({
				    trigger: '#year', 
				    wheels: [
				                {
				                	data:year
				                }
				            ],
				    callback:function(i,d){
				    	$("#year").val(d[0]);
				    }
				});
				let selectmonth= new MobileSelect({
				    trigger: '#month', 
				    wheels: [
				                {
				                	data:month
				                }
				            ],
				    callback:function(i,d){
				    	$("#month").val(d[0]);
				    }
				});
				let selectday = new MobileSelect({
				    trigger: '#day', 
				    wheels: [
				                {
				                	data:day
				                }
				            ],
				    callback:function(i,d){
				    	$("#day").val(d[0]);
				    }
				});
			}
		})
		dataUrl = oDomain + "/home/param/cityList";
		jsonData.getData(dataUrl,"GET",{},function(result){
			if(result.code == 0){
				for(let i=0;i<result.data.length;i++){
					oList.push({
						"id" : result.data[i].region_id,
						"value" : result.data[i].region_name
					})
				}
				let selectProvince = new MobileSelect({
				    trigger: '#province', 
				    wheels: [
				                {
				                	data:oList
				                }
				            ],
				    callback:function(i,d){
				    	$("#province").val(d[0].value);
				    	$("#province").attr({"data-id":d[0].id});
				    }
				});
			}
		})
		console.log(registerinfo);
		if(registerinfo && registerinfo != ""){
			$("input[name='email']").val(registerinfo.email);
			$("input[name='re-email']").val(registerinfo.re_email);
			$("input[name='consignee-firstname']").val(registerinfo.real_name_former);
			$("input[name='consignee-lastname']").val(registerinfo.real_name_later);
			$("input[name='consignee-pingyin-firstname']").val(registerinfo.kana_name_former);
			$("input[name='consignee-pingyin-lastname']").val(registerinfo.kana_name_later);
			$("input[name='year']").val(registerinfo.birthday_year);
			$("input[name='month']").val(registerinfo.birthday_month);
			$("input[name='day']").val(registerinfo.birthday_day);
			$("input[name='zipcode1']").val(registerinfo.zipcode1);
			$("input[name='zipcode2']").val(registerinfo.zipcode2);
			$("input[name='province']").val(registerinfo.province).attr("data-id",registerinfo.province_id);
			$("input[name='address_0']").val(registerinfo.address_0);
			$("input[name='address_1']").val(registerinfo.address_1);
			$("input[name='address_2']").val(registerinfo.address_2);
			$("input[name='tel_0']").val(registerinfo.tel_0);
			$("input[name='tel_1']").val(registerinfo.tel_1);
			$("input[name='tel_2']").val(registerinfo.tel_2);
			$("input[name='password']").val(registerinfo.password);
			$("input[name='re_password']").val(registerinfo.re_password);
			$("#sex"+registerinfo.sex).attr("checked",true);
			$("#wish"+registerinfo.wish).attr("checked",true);
		}
	},
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	searchAddr:function(){
		$(".zipcode-btn").on("click",function(){
			$(".m-common-spinner").show();
			let zipcode = $("#zipcode1").val() + $("#zipcode2").val(),
				dataUrl = oDomain + "/home/param/getAddressByCode",
				registerinfo = sessionStorage.registerinfo ? JSON.parse(sessionStorage.registerinfo):{},
				param = {
					"code" : zipcode
				};
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				$(".m-common-spinner").hide();
				if(data.code == 0){
					$("#province").val(data.data.region_name).attr({"data-id":data.data.region_id});
					$("#address_0").val(data.data.address)
					registerinfo['province'] = data.data.region_name;
					registerinfo['province_id'] = data.data.region_id;
					registerinfo['address_0'] = data.data.address;
					sessionStorage.registerinfo = JSON.stringify(registerinfo);
				}
			})
		})
	},
	oNext:function(){
		$(".m-member-common-btn-box").on("click",".go",function(){
			let email = $("input[name='email']").val() || "",
				re_email = $("input[name='re-email']").val() || "",
				password = $("input[name='password']").val() || "",
				re_password = $("input[name='re_password']").val() || "",
				real_name_former = $("input[name='consignee-firstname']").val() || "",
				real_name_later = $("input[name='consignee-lastname']").val() || "",
				kana_name_former = $("input[name='consignee-pingyin-firstname']").val() || "",
				kana_name_later = $("input[name='consignee-pingyin-lastname']").val() || "",
				sex = $("input[name='sex']:checked").val() || "",
				birthday_year = $("input[name='year']").val() || "",
				birthday_month = $("input[name='month']").val() || "",
				birthday_day = $("input[name='day']").val() || "",
				zipcode1 = $("input[name='zipcode1']").val() || "",
				zipcode2 = $("input[name='zipcode2']").val() || "",
				province = $("input[name='province']").val() || "",
				province_id = $("input[name='province']").attr("data-id") || "",
				address_0 = $("input[name='address_0']").val() || "",
				address_1 = $("input[name='address_1']").val() || "",
				address_2 = $("input[name='address_2']").val() || "",
				tel_0 = $("input[name='tel_0']").val() || "",
				tel_1 = $("input[name='tel_1']").val() || "",
				tel_2 = $("input[name='tel_2']").val() || "",
				wish = $("input[name='wish']:checked").val() || "",
				isGo = true,
				prompt={
					"email" : "メールアドレスをご入力ください",
					"re-email" : "正しいメールアドレスをご入力ください",
					"password" : "パスワードをご入力ください。",
					"re_password" : "確認用パスワードもご入力ください。",
					"consignee-firstname" : "注文者氏名は空っぽにならない",
					"consignee-lastname" : "注文者氏名は空っぽにならない",
					"consignee-pingyin-firstname" : "氏名ふりがなをご入力ください",
					"consignee-pingyin-lastname" : "氏名ふりがなをご入力ください",
					"year" : "生年月日をご記入ください",
					"month" : "生年月日をご記入ください",
					"day" : "生年月日をご記入ください",
					"zipcode1" : "郵便番号をご入力ください",
					"zipcode2" : "郵便番号をご入力ください",
					"province" : "都道府県をご選択ください",
					"address_0" : "市区郡町村をご入力ください",
					"address_1" : "町・番地をご入力ください",
					"address_2" : "17",
					"tel_0" : "電話番号をご入力ください",
					"tel_1" : "電話番号をご入力ください",
					"tel_2" : "電話番号をご入力ください"
				};
			$(".m-registerinfo-content input[type='text']").each(function(){
				if($(this).attr("name") != "address_2"){
					if(!$(this).val() || $(this).val() == ""){
						let oT = $(this).attr("name");
						$(".m-popup-small-box .m-popup-small").text(prompt[oT]);
						$(".m-popup-small-box").show();
						setTimeout(function(){$(".m-popup-small-box").hide();},800)
						isGo = false;
						return false;
					}else{
						if($(this).attr("name") == "password" || $(this).attr("name") == "re_password"){
							if($(this).val().length < 6){
								$(".m-popup-small-box .m-popup-small").text("半角英数・記号6～10文字までご入力ください。");
								$(".m-popup-small-box").show();
								setTimeout(function(){$(".m-popup-small-box").hide();},800)
								isGo = false;
								return false;
							}else if($("#password").val() != $("#re_password").val()){
								$(".m-popup-small-box .m-popup-small").text("同じパスワードをご入力ください。");
								$(".m-popup-small-box").show();
								setTimeout(function(){$(".m-popup-small-box").hide();},800)
								isGo = false;
								return false;
							}
						}
						if($(this).attr("name") == "re-email"){
							if($(this).val() != $("input[name='email']").val()){
								$(".m-popup-small-box .m-popup-small").text("同じメールアドレスをご入力ください");
								$(".m-popup-small-box").show();
								setTimeout(function(){$(".m-popup-small-box").hide();},800)
								isGo = false;
								return false;
							}
						}
					}
				}
			})
			console.log(isGo);
			if(isGo == true){
				let registerinfo = {
					"email" : email,
					"re_email" : re_email,
					"password" : password,
					"re_password" : re_password,
					"real_name_former" : real_name_former,
					"real_name_later" : real_name_later,
					"kana_name_former" : kana_name_former,
					"kana_name_later" : kana_name_later,
					"sex" : sex,
					"birthday_year" : birthday_year,
					"birthday_month" : birthday_month,
					"birthday_day" : birthday_day,
					"zipcode1" : zipcode1,
					"zipcode2" : zipcode2,
					"province" : province,
					"province_id" : province_id,
					"address_0" : address_0,
					"address_1" : address_1,
					"address_2" : address_2,
					"tel_0" : tel_0,
					"tel_1" : tel_1,
					"tel_2" : tel_2,
					"wish" : wish
				}
				sessionStorage.registerinfo = JSON.stringify(registerinfo);
				window.location.href = "registerconfirm.html";
			}
		})
	}
}

if(sessionId && sessionId != ""){
	registerinfo.init();
}else{
	getSession.data(function(){
		registerinfo.init();
	})
}
