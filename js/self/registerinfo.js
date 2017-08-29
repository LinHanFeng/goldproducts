let sessionId = sessionStorage.sessionId || "";
const registerinfo = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getInfo();			//获取日期&省
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
		let dataUrl = oDomain + "/home/param/setBirthday",oList=new Array();
		jsonData.getData(dataUrl,"GET",{},function(data){
			console.log(data);
			if(data.code == 0){
				let year = data.data.year,
					month = data.data.month,
					day = data.day;
					console.log(year)
				let selectyear = new MobileSelect({
				    trigger: '#year', 
				    wheels: [
				                {
				                	data:year
				                }
				            ],
				    callback:function(i,d){
				    	$("#year").val(d[0].value);
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
				    	$("#month").val(d[0].value);
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
				    	$("#day").val(d[0].value);
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
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oNext:function(){
		$(".m-member-common-btn-box").on("click",".go",function(){
			let email = $("input[name='email']").val() || undefined,
				re_email = $("input[name='re-email']").val() || undefined,
				password = $("input[name='password']").val() || undefined,
				re_password = $("input[name='re_password']").val() || undefined,
				real_name_former = $("input[name='consignee-firstname']").val() || undefined,
				real_name_later = $("input[name='consignee-lastname']").val() || undefined,
				kana_name_former = $("input[name='consignee-pingyin-firstname']").val() || undefined,
				kana_name_later = $("input[name='consignee-pingyin-lastname']").val() || undefined,
				sex = $("input[name='sex']:checked").val() || undefined,
				birthday_year = $("input[name='year']").val() || undefined,
				birthday_month = $("input[name='month']").val() || undefined,
				birthday_day = $("input[name='day']").val() || undefined,
				zipcode1 = $("input[name='zipcode1']").val() || undefined,
				zipcode2 = $("input[name='zipcode2']").val() || undefined,
				province = $("input[name='province']").val() || undefined,
				province_id = $("input[name='province']").attr("data-id") || undefined,
				address_0 = $("input[name='address_0']").val() || undefined,
				address_1 = $("input[name='address_1']").val() || undefined,
				address_2 = $("input[name='address_2']").val() || undefined,
				tel_0 = $("input[name='tel_0']").val() || undefined,
				tel_1 = $("input[name='tel_1']").val() || undefined,
				tel_2 = $("input[name='tel_2']").val() || undefined,
				isGo = true,
				prompt={
					"email" : "111",
					"re-email" : "",
					"password" : "",
					"re_password" : "",
					"consignee-firstname" : "",
					"consignee-lastname" : "",
					"consignee-pingyin-firstname" : "",
					"consignee-pingyin-lastname" : "",
					"year" : "",
					"month" : "",
					"day" : "",
					"zipcode1" : "",
					"zipcode2" : "",
					"province" : "",
					"address_0" : "",
					"address_1" : "",
					"address_2" : "",
					"tel_0" : "",
					"tel_1" : "",
					"tel_2" : ""
				};
			$(".m-registerinfo-content input[type='text']").each(function(){
				if(!$(this).val() || $(this).val() == ""){
					let oT = $(this).attr("name");
					console.log(prompt[oT]);
					isGo = false;
					return false;
				}
			})
			console.log(isGo);
			return;
			if(isChecked == true){
				window.location.href = "registerconfirm.html";
			}else{
				$(".m-popup-small-box .m-popup-small").text("会員規約に同意する");
				$(".m-popup-small-box").show();
				setTimeout(function(){$(".m-popup-small-box").hide();},800)
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
