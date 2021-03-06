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
		/*搜索*/
		$(".search-box .search-btn").on("click",function(){
			let oVal = $(".search-box input").val();
			sessionStorage.searchVal = oVal;
			window.location.href = "search.html?search=1";
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
		if(userId && userId !=""){
			$(".m-common-menu-content-list .go").closest("li").show()
				.siblings("li").hide();
			$(".m-common-menu-content-list .go").on("click",function(){
				localStorage.removeItem("userId");
				window.location.href = "index.html";
			})
		}else{
			$(".m-common-menu-content-list .go").closest("li").hide();
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
		let memberinfo = sessionStorage.memberinfo ? JSON.parse(sessionStorage.memberinfo):"",
			dataUrl,param,oList = new Array();
		if(memberinfo && memberinfo !=""){
			$("input[name='consignee-firstname']").val(memberinfo.real_name_former)
			$("input[name='consignee-lastname']").val(memberinfo.real_name_later)
			$("input[name='consignee-pingyin-firstname']").val(memberinfo.kana_name_former)
			$("input[name='consignee-pingyin-lastname']").val(memberinfo.kana_name_later)
			$("input[name='zipcode01']").val(memberinfo.zipcode1)
			$("input[name='zipcode02']").val(memberinfo.zipcode2)
			$("input[name='province']").val(memberinfo.province_name).attr("data-id",memberinfo.province)
			$("input[name='address_0']").val(memberinfo.address_0)
			$("input[name='address_1']").val(memberinfo.address_1)
			$("input[name='address_2']").val(memberinfo.address_2)
			$("input[name='tel_0']").val(memberinfo.tel_0)
			$("input[name='tel_1']").val(memberinfo.tel_1)
			$("input[name='tel_2']").val(memberinfo.tel_2)
			$("input#sex"+memberinfo.sex).attr("checked",true)
			$("input[name='year']").val(memberinfo.birthday_year)
			$("input[name='month']").val(memberinfo.birthday_month)
			$("input[name='day']").val(memberinfo.birthday_day)
			$(".m-memberinfo-module-box").attr({"data-addressId":memberinfo.address_id})
			$("#password").val(memberinfo.password)
			$("#re_password").val(memberinfo.password)
		}else{
			$(".m-common-spinner").show();
			dataUrl = oDomain + "/home/user/userInfo";
			param = {
				"userId" : userId
			};
			oList=new Array();
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				$(".m-common-spinner").hide();
				if(data.code ==0){
					$("input[name='consignee-firstname']").val(data.data.consignee[0] || "")
					$("input[name='consignee-lastname']").val(data.data.consignee[1] || "")
					$("input[name='consignee-pingyin-firstname']").val(data.data.consignee_pinyin[0] || "")
					$("input[name='consignee-pingyin-lastname']").val(data.data.consignee_pinyin[1] || "")
					$("input[name='zipcode01']").val(data.data.zipcode[0] || "")
					$("input[name='zipcode02']").val(data.data.zipcode[1] || "")
					$("input[name='province']").val(data.data.province || "").attr("data-id",data.data.province_id || "")
					$("input[name='address_0']").val(data.data.address[0] || "")
					$("input[name='address_1']").val(data.data.address[1] || "")
					$("input[name='address_2']").val(data.data.address[2] || "")
					$("input[name='tel_0']").val(data.data.tel[0] || "")
					$("input[name='tel_1']").val(data.data.tel[1] || "")
					$("input[name='tel_2']").val(data.data.tel[2] || "")
					$("input#sex"+(data.data.sex || "0")).attr("checked",true)
					$("input[name='year']").val(data.data.birthday[0] || "")
					$("input[name='month']").val(data.data.birthday[1] || "")
					$("input[name='day']").val(data.data.birthday[2] || "")
					$(".m-memberinfo-module-box").attr({"data-addressId":data.data.address_id || ""})
				}
			})
		}
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
	            	position:[45],
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
			let zipcode = $("#zipcode01").val() + $("#zipcode02").val(),
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
			$(".m-common-spinner").show();
			let password = $("input[name='password']").val() || "",
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
				prompt={
					"password" : "パスワードをご入力ください。",
					"re_password" : "確認用パスワードもご入力ください。",
					"consignee-firstname" : "姓はご記入ください。",
					"consignee-lastname" : "名をご記入ください。",
					"consignee-pingyin-firstname" : "姓をふりかなでご入力ください。",
					"consignee-pingyin-lastname" : "名をふりかなでご入力ください。",
					"year" : "年をご記入ください。",
					"month" : "月をご記入ください。",
					"day" : "日をご記入ください。",
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
			$(".m-memberinfo-module-box input[type='text'],.m-memberinfo-module-box input[type='number']").each(function(){
				if($(this).attr("name") !="address_2"){
					if(!$(this).val() || $(this).val() == ""){
						let oT = $(this).attr("name");
						$(".m-popup-small-box .m-popup-small").text(prompt[oT]);
						$(".m-popup-small-box").show();
						setTimeout(function(){$(".m-popup-small-box").hide();},800)
						isGo = false;
						return false;
					}
				}
			})
			$(".m-memberinfo-module-box input[type='password']").each(function(){
				if($(this).val() && $(this).val() != ""){
					if($(this).attr("name") == "password" || $(this).attr("name") == "re_password"){
						if($(this).val().length <6 || $(this).val().length>10){
							$(".m-popup-small-box .m-popup-small").text("半角英数・記号6～10文字までご入力ください。");
							$(".m-popup-small-box").show();
							setTimeout(function(){$(".m-popup-small-box").hide();},800)
							isGo = false;
							return false;
						}else if($("input[name='re_password']").val() != $("input[name='password']").val()){
							$(".m-popup-small-box .m-popup-small").text("同じパスワードをご入力ください。");
							$(".m-popup-small-box").show();
							setTimeout(function(){$(".m-popup-small-box").hide();},800)
							isGo = false;
							return false;
						}
					}
				}
				
			})
			if(isGo == true){
				let registerinfo = {
					"user_id" : userId,
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
					"province" : province_id,
					"province_name" : province,
					"address_0" : address_0,
					"address_1" : address_1,
					"address_2" : address_2,
					"tel_0" : tel_0,
					"tel_1" : tel_1,
					"tel_2" : tel_2,
					"address_id" : address_id
				};
				sessionStorage.memberinfo = JSON.stringify(registerinfo);
				window.location.href = "memberinfoconfirm.html";
				return;
				let dataUrl = oDomain + "/home/user/updateUserInfo";
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(registerinfo)},function(data){
					$(".m-common-spinner").hide();
					if(data.code ==0 ){
						window.location.reload();
					}
				})
			}else{
				$(".m-common-spinner").hide();
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
