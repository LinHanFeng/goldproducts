"use strict";var sessionId=sessionStorage.sessionId||"",code=getQueryString("code"),forgetpwd={init:function(){this.oLoad(),this.getMenu(),this.goCar(),this.oNext()},oLoad:function(){$(window).on("scroll",function(){var o=200,n=$(window).scrollTop();n>o?($(".m-nav-bottom").show(),$(".m-common-stick").show(),$(".m-common-go-top").show()):($(".m-nav-bottom").hide(),$(".m-common-stick").hide(),$(".m-common-go-top").hide())});var o=oDomain+"/home/cart/cartTotal",n={sessionId:sessionId};jsonData.getData(o,"GET",{data:JSON.stringify(n)},function(o){0==o.code&&$(".m-common-car em").text(o.data.count)}),$(".m-common-menu").on("click",function(){$(".m-common-menu-box").show()}),$(".m-detail-backbtn").on("click",function(){window.history.back()})},getMenu:function(){var o=oDomain+"/home/index/menuList";jsonData.getData(o,"GET",{},function(o){var n=template("menuTpl",o);if($(".m-common-menu-content-lists").html(n),o.data.other&&""!=o.data.other)for(var t=0;t<o.data.other.length;t++){'<div class="m-common-menu-content-list"><a href="'+o.data.other[t].href+'">'+o.data.other[t].name;$(".m-common-menu-content-lists").append()}forgetpwd.oMenu()}),$(".m-common-menu,.m-common-stick-menu").on("click",function(){$(".m-common-menu-box").show()})},oMenu:function(){$(".m-common-menu-content-list-header").each(function(o,n){$(n).on("click",function(){$(n).find(".jt img").toggleClass("fan"),$(n).siblings("ul").toggle()})}),$(".m-common-menu-content-header").find(".btn").on("click",function(){$(".m-common-menu-box").hide()}),$(".m-common-menu-close").on("click",function(){$(".m-common-menu-box").hide()})},goCar:function(){$(".m-nav-bottom-car,.m-common-car").on("click",function(){window.location.href="shoppingcart.html"})},oNext:function(){$(".m-member-common-btn-box").on("click",".go",function(){var o=oDomain+"/home/user/authentication",n=$("#id").val()||"",t=$("#date").val()||"";n&&""!=n?t&&""!=t||($(".m-popup-small-box .m-popup-small").text("生年月日をご記入ください"),$(".m-popup-small-box").show(),setTimeout(function(){$(".m-popup-small-box").hide()},800)):($(".m-popup-small-box .m-popup-small").text("メールアドレスをご入力ください"),$(".m-popup-small-box").show(),setTimeout(function(){$(".m-popup-small-box").hide()},800));var m={email:n,birth:t};jsonData.getData(o,"GET",{data:JSON.stringify(m)},function(o){console.log(o),0==o.code&&(sessionStorage.msg="パスワードの確認メールを送信しました。",localStorage.userId=o.data.user_id,window.location.href="prompt.html?form=forgetpwd")})})}};sessionId&&""!=sessionId?forgetpwd.init():getSession.data(function(){forgetpwd.init()});