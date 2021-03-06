let sessionId = sessionStorage.sessionId ?sessionStorage.sessionId: "",userId,code;
if(getQueryString("userId") && getQueryString("userId") != "" &&getQueryString("code")&&getQueryString("code")!=""){
	userId = getQueryString("userId");
	code = getQueryString("code");
}
const changepwd = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.lookpwd();			//显示密码
		this.delText();			//删除内容
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
			changepwd.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
		if(userId && userId !=""){
			$(".m-common-menu-content-list-header .go").closest("li").show()
				.siblings("li").hide();
			$(".m-common-menu-content-list-header .go").on("click",function(){
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
	lookpwd:function(){
		$("#lookpwd").on("click",function(){
			if($("#lookpwd").attr("checked") == true){
				$("#memberpwd").attr({"type":"text"})
			}else{
				$("#memberpwd").attr({"type":"password"})
			}
		})
	},
	delText:function(){
		$(".f-del").each(function(index,elem){
			$(elem).on("click",function(){
				$(this).siblings("input").val("");
			})
		})
	},
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oNext:function(){
		$(".m-member-common-btn-box").on("click",".go",function(){
			$(".m-common-spinner").show();
			let dataUrl = oDomain + "/home/user/resetPassword",
			password=$("#password").val() || "",
			re_password = $("#re_password").val() || "";
			if(!password || password == ""){
				$(".m-changepwd-notice").text("パスワードをご入力ください。").show();
				$(".m-common-spinner").hide();
				return;
			}
			if(!re_password || re_password == ""){
				$(".m-changepwd-notice").text("確認用パスワードもご入力ください。").show();
				$(".m-common-spinner").hide();
				return;
			}
			if(password != re_password){
				$(".m-changepwd-notice").text("同じパスワードをご入力ください。").show();
				$(".m-common-spinner").hide();
				return;
			}
			if(password.length<6 || re_password.length<6 || password.length>10 || re_password.length>10){
				$(".m-changepwd-notice").text("半角英数・記号6～10文字までご入力ください。").show();
				$(".m-common-spinner").hide();
				return;
			}
			let param={
				"code" : code,
				"userId" : userId,
				"password" : password,
				"repassword" : re_password
			};
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				$(".m-common-spinner").hide();
				if(data.code == 0){
					localStorage.removeItem("userId");
					window.location.href = "prompt.html?form=changepwd";
				}else{
					$(".m-changepwd-notice").text(data.msg).show();
				}
			})
		})
	}
}

if(sessionId && sessionId != ""){
	changepwd.init();
}else{
	getSession.data(function(){
		changepwd.init();
	})
}
