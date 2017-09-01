let sessionId = sessionStorage.sessionId || "",userId = localStorage.userId || "";
const memberinfo = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getInfo();		//用户信息
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
		$(".m-memberinfo-btn-box .back").on("click",function(){
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
			memberinfo.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
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
		let dataUrl = oDomain + "/home/user/userInfo",
			param = {
				"userId" : userId
			},oList=new Array();
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code ==0){
				$("input[name='consignee-firstname']").val(data.data.consignee[0])
				$("input[name='consignee-lastname']").val(data.data.consignee[1])
				$("input[name='consignee-pingyin-firstname']").val(data.data.consignee[0])
				$("input[name='consignee-pingyin-lastname']").val(data.data.consignee[1])
				$("input[name='zipcode01']").val(data.data.zipcode[0])
				$("input[name='zipcode02']").val(data.data.zipcode[1])
				$("input[name='province']").val(data.data.province).attr("data-id",data.data.province_id)
				$("input[name='address_0']").val(data.data.address[0])
				$("input[name='address_1']").val(data.data.address[1])
				$("input[name='address_2']").val(data.data.address[2])
				$("input[name='tel_0']").val(data.data.tel[0])
				$("input[name='tel_1']").val(data.data.tel[1])
				$("input[name='tel_2']").val(data.data.tel[2])
				$("input#sex"+data.data.sex).attr("checked",true)
				$("input[name='year']").val(data.data.birthday[0])
				$("input[name='month']").val(data.data.birthday[1])
				$("input[name='day']").val(data.data.birthday[2])
				$("input[name='email']").val(data.data.email)
				$("input[name='email_confirm']").val(data.data.email)
			}
		})
		dataUrl = oDomain + "/home/param/setBirthday",
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
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oNext:function(){
		$(".m-memberinfo-btn-box").on("click",".go",function(){
			let email = $("input[name='email']").val() || "",
				re_email = $("input[name='email_confirm']").val() || "",
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
						if($(this).attr("name") == "email_confirm"){
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
				};
				let dataUrl = oDomain + "/home/user/updateUserInfo";
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(registerinfo)},function(data){
					if(data.code ==0 ){
						window.location.reload();
					}
				})
			}
		})
	}
}
if(sessionId && sessionId != ""){
	memberinfo.init();
}else{
	getSession.data(function(){
		memberinfo.init();
	})
}
