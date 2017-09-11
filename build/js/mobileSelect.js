window.MobileSelect=function(){function e(e,t){return e.getElementsByClassName(t)}function t(e){this.mobileSelect,this.wheelsData=e.wheels,this.jsonType=!1,this.cascadeJsonData=[],this.checkDataType(),this.renderWheels(this.wheelsData),this.displayJson=[],this.cascade=!1,this.startY,this.moveEndY,this.moveY,this.oldMoveY,this.offset=0,this.offsetSum=0,this.oversizeBorder,this.curDistance=[],this.clickStatus=!1,this.init(e)}return t.prototype={constructor:t,init:function(t){var i=this;if(i.trigger=document.querySelector(t.trigger),i.wheel=e(i.mobileSelect,"wheel"),i.slider=e(i.mobileSelect,"selectContainer"),i.wheels=i.mobileSelect.querySelector(".wheels"),i.liHeight=i.mobileSelect.querySelector("li").offsetHeight,i.ensureBtn=i.mobileSelect.querySelector(".ensure"),i.closeBtn=i.mobileSelect.querySelector(".cancel"),i.grayLayer=i.mobileSelect.querySelector(".grayLayer"),i.popUp=i.mobileSelect.querySelector(".content"),i.callback=t.callback?t.callback:function(){},i.transitionEnd=t.transitionEnd?t.transitionEnd:function(){},i.initPosition=t.position?t.position:[],i.titleText=t.title?t.title:"",i.trigger.style.cursor="pointer",i.setTitle(i.titleText),i.checkCascade(),i.cascade&&i.initCascade(),i.initPosition.length<i.slider.length)for(var n=i.slider.length-i.initPosition.length,s=0;s<n;s++)i.initPosition.push(0);i.setCurDistance(i.initPosition),i.addListenerAll(),i.closeBtn.addEventListener("click",function(){i.mobileSelect.classList.remove("mobileSelect-show")}),i.ensureBtn.addEventListener("click",function(){i.mobileSelect.classList.remove("mobileSelect-show");for(var e="",t=0;t<i.wheel.length;t++)e+=t==i.wheel.length-1?i.getValue(t):i.getValue(t)+" ";i.trigger.innerHTML=e,i.callback(i.getIndexArr(),i.getResult())}),i.trigger.addEventListener("click",function(){i.mobileSelect.classList.add("mobileSelect-show")}),i.grayLayer.addEventListener("click",function(){i.mobileSelect.classList.remove("mobileSelect-show")}),i.popUp.addEventListener("click",function(){event.stopPropagation()}),i.fixRowStyle()},setTitle:function(e){var t=this;t.titleText=e,t.mobileSelect.querySelector(".title").innerHTML=t.titleText},show:function(){this.mobileSelect.classList.add("mobileSelect-show")},renderWheels:function(e){var t=this;t.mobileSelect=document.createElement("div"),t.mobileSelect.className="mobileSelect",t.mobileSelect.innerHTML='<div class="grayLayer"></div><div class="content"><div class="btnBar"><div class="fixWidth"><div class="cancel">キャンセル</div><div class="title"></div><div class="ensure">選択</div></div></div><div class="panel"><div class="fixWidth"><div class="wheels"></div><div class="selectLine"></div><div class="shadowMask"></div></div></div></div>',document.body.appendChild(t.mobileSelect);for(var i="",n=0;n<e.length;n++){if(i+='<div class="wheel"><ul class="selectContainer">',t.jsonType)for(var s=0;s<e[n].data.length;s++)i+='<li data-id="'+e[n].data[s].id+'">'+e[n].data[s].value+"</li>";else for(var s=0;s<e[n].data.length;s++)i+="<li>"+e[n].data[s]+"</li>";i+="</ul></div>"}t.mobileSelect.querySelector(".wheels").innerHTML=i},addListenerAll:function(){for(var e=this,t=0;t<e.slider.length;t++)!function(t){e.addListenerWheel(e.wheel[t],t),e.addListenerLi(t)}(t)},addListenerWheel:function(e,t){var i=this;e.addEventListener("touchstart",function(){i.touch(event,this.firstChild,t)},!1),e.addEventListener("touchend",function(){i.touch(event,this.firstChild,t)},!1),e.addEventListener("touchmove",function(){i.touch(event,this.firstChild,t)},!1),e.addEventListener("mousedown",function(){i.dragClick(event,this.firstChild,t)},!1),e.addEventListener("mousemove",function(){i.dragClick(event,this.firstChild,t)},!1),e.addEventListener("mouseup",function(){i.dragClick(event,this.firstChild,t)},!0)},addListenerLi:function(e){for(var t=this,i=t.slider[e].getElementsByTagName("li"),n=0;n<i.length;n++)!function(n){i[n].addEventListener("click",function(){t.singleClick(this,n,e)},!1)}(n)},checkDataType:function(){var e=this;"object"==typeof e.wheelsData[0].data[0]&&(e.jsonType=!0,e.cascadeJsonData=e.wheelsData[0].data)},checkCascade:function(){var e=this;if(e.jsonType){for(var t=e.wheelsData[0].data,i=0;i<t.length;i++)if("childs"in t[i]&&t[i].childs.length>0){e.cascade=!0;break}}else e.cascade=!1},initCascade:function(){var e=this;e.displayJson.push(e.generateArrData(e.cascadeJsonData)),e.initPosition[0]?e.checkArrDeep(e.cascadeJsonData[e.initPosition[0]]):e.checkArrDeep(e.cascadeJsonData[0]),e.reRenderWheels()},generateArrData:function(e){for(var t=[],i=0;i<e.length;i++)t.push({id:e[i].id,value:e[i].value});return t},checkArrDeep:function(e){var t=this;"childs"in e&&e.childs.length>0&&(t.displayJson.push(t.generateArrData(e.childs)),t.checkArrDeep(e.childs[0]))},checkRange:function(e,t){for(var i=this,n=i.displayJson.length-1-e,s=0;s<n;s++)i.displayJson.pop();for(var a,s=0;s<=e;s++)a=0==s?i.cascadeJsonData[t[0]]:a.childs[t[s]];i.checkArrDeep(a),i.reRenderWheels(),i.fixRowStyle(),i.setCurDistance(i.resetPostion(e,t))},resetPostion:function(e,t){var i,n=this,s=t;if(n.slider.length>t.length){i=n.slider.length-t.length;for(var a=0;a<i;a++)s.push(0)}else if(n.slider.length<t.length){i=t.length-n.slider.length;for(var a=0;a<i;a++)s.pop()}for(var a=e+1;a<s.length;a++)s[a]=0;return s},reRenderWheels:function(){var e=this;if(e.wheel.length>e.displayJson.length)for(var t=e.wheel.length-e.displayJson.length,i=0;i<t;i++)e.wheels.removeChild(e.wheel[e.wheel.length-1]);for(var i=0;i<e.displayJson.length;i++)!function(t){var i="";if(e.wheel[t]){for(var n=0;n<e.displayJson[t].length;n++)i+='<li data-id="'+e.displayJson[t][n].id+'">'+e.displayJson[t][n].value+"</li>";e.slider[t].innerHTML=i}else{var s=document.createElement("div");s.className="wheel",i='<ul class="selectContainer">';for(var n=0;n<e.displayJson[t].length;n++)i+='<li data-id="'+e.displayJson[t][n].id+'">'+e.displayJson[t][n].value+"</li>";i+="</ul>",s.innerHTML=i,e.addListenerWheel(s,t),e.wheels.appendChild(s)}e.addListenerLi(t)}(i)},updateWheels:function(e){var t=this;t.cascade&&(t.cascadeJsonData=e,t.displayJson=[],t.initCascade(),t.setCurDistance(t.initPosition),t.fixRowStyle())},updateWheel:function(e,t){var i=this,n="";if(i.cascade)return console.error("级联格式不支持updateWheel(),请使用updateWheels()更新整个数据源"),!1;if(i.jsonType){for(var s=0;s<t.length;s++)n+='<li data-id="'+t[s].id+'">'+t[s].value+"</li>";i.wheelsData[e]={data:t}}else{for(var s=0;s<t.length;s++)n+="<li>"+t[s]+"</li>";i.wheelsData[e]=t}i.slider[e].innerHTML=n,i.addListenerLi(e)},fixRowStyle:function(){for(var e=this,t=(100/e.wheel.length).toFixed(2),i=0;i<e.wheel.length;i++)e.wheel[i].style.width=t+"%"},getIndex:function(e){return Math.round((2*this.liHeight-e)/this.liHeight)},getIndexArr:function(){for(var e=this,t=[],i=0;i<e.curDistance.length;i++)t.push(e.getIndex(e.curDistance[i]));return t},getResult:function(){var e=this,t=[],i=e.getIndexArr();if(e.cascade)for(var n=0;n<e.wheel.length;n++)t.push(e.displayJson[n][i[n]]);else if(e.jsonType)for(var n=0;n<e.curDistance.length;n++)t.push(e.wheelsData[n].data[e.getIndex(e.curDistance[n])]);else for(var n=0;n<e.curDistance.length;n++)t.push(e.getValue(n));return t},calcDistance:function(e){return 2*this.liHeight-e*this.liHeight},setCurDistance:function(e){for(var t=this,i=[],n=0;n<t.slider.length;n++)i.push(t.calcDistance(e[n])),t.movePosition(t.slider[n],i[n]);t.curDistance=i},fixPosition:function(e){return-(this.getIndex(e)-2)*this.liHeight},movePosition:function(e,t){e.style.webkitTransform="translate3d(0,"+t+"px, 0)",e.style.transform="translate3d(0,"+t+"px, 0)"},locatePostion:function(e,t){this.curDistance[e]=this.calcDistance(t),this.movePosition(this.slider[e],this.curDistance[e])},updateCurDistance:function(e,t){this.curDistance[t]=parseInt(e.style.transform.split(",")[1])},getDistance:function(e){return parseInt(e.style.transform.split(",")[1])},getValue:function(e){var t=this,i=t.getIndex(t.curDistance[e]);return t.slider[e].getElementsByTagName("li")[i].innerHTML},touch:function(e,t,i){var n=this;switch(e=e||window.event,e.type){case"touchstart":n.startY=e.touches[0].clientY,n.oldMoveY=n.startY;break;case"touchend":if(n.moveEndY=e.changedTouches[0].clientY,n.offsetSum=n.moveEndY-n.startY,n.updateCurDistance(t,i),n.curDistance[i]=n.fixPosition(n.curDistance[i]),n.movePosition(t,n.curDistance[i]),n.oversizeBorder=-(t.getElementsByTagName("li").length-3)*n.liHeight,n.curDistance[i]+n.offsetSum>2*n.liHeight?(n.curDistance[i]=2*n.liHeight,setTimeout(function(){n.movePosition(t,n.curDistance[i])},100)):n.curDistance[i]+n.offsetSum<n.oversizeBorder&&(n.curDistance[i]=n.oversizeBorder,setTimeout(function(){n.movePosition(t,n.curDistance[i])},100)),n.transitionEnd(n.getIndexArr(),n.getResult()),n.cascade){var s=n.getIndexArr();s[i]=n.getIndex(n.curDistance[i]),n.checkRange(i,s)}break;case"touchmove":e.preventDefault(),n.moveY=e.touches[0].clientY,n.offset=n.moveY-n.oldMoveY,n.updateCurDistance(t,i),n.curDistance[i]=n.curDistance[i]+n.offset,n.movePosition(t,n.curDistance[i]),n.oldMoveY=n.moveY}},dragClick:function(e,t,i){var n=this;switch(e=e||window.event,e.type){case"mousedown":n.startY=e.clientY,n.oldMoveY=n.startY,n.clickStatus=!0;break;case"mouseup":if(n.moveEndY=e.clientY,n.offsetSum=n.moveEndY-n.startY,n.updateCurDistance(t,i),n.curDistance[i]=n.fixPosition(n.curDistance[i]),n.movePosition(t,n.curDistance[i]),n.oversizeBorder=-(t.getElementsByTagName("li").length-3)*n.liHeight,n.curDistance[i]+n.offsetSum>2*n.liHeight?(n.curDistance[i]=2*n.liHeight,setTimeout(function(){n.movePosition(t,n.curDistance[i])},100)):n.curDistance[i]+n.offsetSum<n.oversizeBorder&&(n.curDistance[i]=n.oversizeBorder,setTimeout(function(){n.movePosition(t,n.curDistance[i])},100)),n.clickStatus=!1,n.transitionEnd(n.getIndexArr(),n.getResult()),n.cascade){var s=n.getIndexArr();s[i]=n.getIndex(n.curDistance[i]),n.checkRange(i,s)}break;case"mousemove":e.preventDefault(),n.clickStatus&&(n.moveY=e.clientY,n.offset=n.moveY-n.oldMoveY,n.updateCurDistance(t,i),n.curDistance[i]=n.curDistance[i]+n.offset,n.movePosition(t,n.curDistance[i]),n.oldMoveY=n.moveY)}},singleClick:function(e,t,i){var n=this;if(n.cascade){var s=n.getIndexArr();s[i]=t,n.checkRange(i,s)}else n.curDistance[i]=(2-t)*n.liHeight,n.movePosition(e.parentNode,n.curDistance[i])}},t}();