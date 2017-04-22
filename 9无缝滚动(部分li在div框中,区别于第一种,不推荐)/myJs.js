//属性获取
function getStyle(obj, attr) {
	return obj.currentStyle? obj.currentStyle[attr]: getComputedStyle(obj)[attr];
}
//匀速运动
function startMove(obj, attr, speed, aim, endFn) {
	speed= parseInt(getStyle(obj, attr)) < aim? speed: -speed;
	clearInterval(obj.timer);
	obj.timer=setInterval(function() {
		var newpos= parseInt(getStyle(obj, attr)) + speed;
		if (newpos>aim && speed>0 || newpos<aim && speed<0) {
			newpos=aim;
		}
		obj.style[attr]=newpos + "px";
		if (newpos===aim) {
			clearInterval(obj.timer);
			endFn && endFn();
		}
	}, 20)
}

//摇动
function shake(obj, attr, firstShake, eachShake, timerInterval) {
		var timer=null;     //加上obj就不行，这是为什么？索性下面的timer都不加obj
		var arr=[];
		var num=0;
		var pos=parseInt(getStyle(obj, attr));
		for (var i=firstShake; i>=0; i-=eachShake) {
			arr.push(i, -i)
		};
			clearInterval(timer);
			timer=setInterval(function() {
					obj.style[attr]=pos + arr[num] + "px";
					num++;
					if (num===arr.length) {
						clearInterval(timer)
					};
				}
			, timerInterval)
}

//透明度变化
function opa(obj, speed, aim, endFn) {
	speed= getStyle(obj, "opacity")*100<aim? speed: -speed;
	clearInterval(obj.timer)
	obj.timer=setInterval(function() {
		var newopa= parseInt(getStyle(obj, "opacity")*100) + speed;
		if (newopa>aim && speed>0 || newopa<aim && speed<0) {
			newopa=aim;
		}
		obj.style.opacity=newopa/100;
		obj.style.filter="alpha(opacity="+newopa+")";
		if (newopa===aim) {
			clearInterval(obj.timer);
			endFn && endFn();
		}
	}, 50)
}

//透明度匀速变化
function opa1(obj, aim) {
	var newopa=100;
	clearInterval(obj.timer)
	obj.timer=setInterval(function() {
		var speed=0;
		if (newopa<aim) {
			speed=1
		} else {
			speed=-1
		}
		if (newopa===aim) {
			clearInterval(obj.timer)
		} else {
			newopa+=speed;
			obj.style.opacity=newopa/100;
			obj.style.filter="alpha(opacity="+newopa+")";
		}
	}, 50)
}

//透明度缓冲变化,其中alpha在所调用事件上需定义为相应对象的自定义属性aLi[i].alpha=啥
function opa2(obj, aim) {
	clearInterval(obj.timer)
	obj.timer=setInterval(function() {
		var speed=(aim-obj.alpha)/8;
		speed= speed>0? Math.ceil(speed): Math.floor(speed);
		if (obj.alpha===aim) {
			clearInterval(obj.timer)
		} else {
			obj.alpha+=speed;
			obj.style.opacity=obj.alpha/100;
			obj.style.filter="alpha(opacity="+obj.alpha+")";
		}
	}, 50)
}

//left缓冲运动
function cushion(obj, aim, endFn) {
	clearInterval(obj.timer)
	obj.timer=setInterval(function() {
		var speed=(aim - obj.offsetLeft)/5;
		// if(speed>0) {
		// 	speed=Math.ceil(speed);
		// } else {
		// 	speed=Math.floor(speed)
		// }
		speed=speed>0? Math.ceil(speed):Math.floor(speed);
		if (obj.offsetLeft===aim) {
			clearInterval(obj.timer)
			endFn && endFn();
		} else {
			obj.style.left=obj.offsetLeft+speed + "px";
		}
		document.title= obj.offsetLeft+" speed:"+speed;//问题
	}, 50)
}

//缓冲运动基础
function cushion1(obj, attr, aim, endFn) {
	clearInterval(obj.timer)
	obj.timer=setInterval(function() {
		var iCur=parseInt(getStyle(obj, attr));
		var speed=(aim - iCur)/5;
		speed=speed>0? Math.ceil(speed):Math.floor(speed);
		if (iCur===aim) {
			clearInterval(obj.timer)
			endFn && endFn();
		} else {
			obj.style[attr]=iCur+speed + "px";
		}
	}, 50)
}

//复合属性+缓冲运动
function doMove(obj, attr, iCur, endFn) {
	clearInterval(obj.timer); 
	obj.timer=setInterval(function() {
		var iCur=0;
		if (attr==="opacity") {
			iCur= parseInt(parseFloat(getStyle(obj, attr))*100);
		} else {
			iCur= parseInt(getStyle(obj, attr));
		}
		var speed=(aim-iCur)/5;
		speed= speed>0? Math.ceil(speed): Math.floor(speed);
		if (iCur===aim) {
			clearInterval(obj.timer);
			endFn && endFn();
		} else {
			if (attr==="opacity") {
				obj.style.opacity= (iCur+speed)/100;
				obj.style.filter= "alpha(opacity=" +(iCur+speed)+")";
			} else {
				obj.style[attr]=(iCur+speed) + "px";
			}
		}

	}, 50) 
}
//完美运动框架+缓冲运动
function startMove1(obj, json, fn)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;		//这一次运动就结束了――所有的值都到达了
		for(var attr in json)
		{
			//1.取当前的值
			var iCur=0;
			iCur=attr==="opacity"? parseInt(parseFloat(getStyle(obj, attr))*100): 
			parseInt(getStyle(obj, attr));

			// if(attr=='opacity')
			// {
			// 	iCur=parseInt(parseFloat(getStyle(obj, attr))*100);
			// }
			// else
			// {
			// 	iCur=parseInt(getStyle(obj, attr));
			// }
			
			//2.算速度
			var iSpeed=(json[attr]-iCur)/8;
			iSpeed=iSpeed>0? Math.ceil(iSpeed):Math.floor(iSpeed);
			
			//3.检测停止
			
			if(attr=='opacity')
			{
				obj.style.filter='alpha(opacity:'+(iCur+iSpeed)+')';
				obj.style.opacity=(iCur+iSpeed)/100;
			}
			else
			{
				obj.style[attr]=iCur+iSpeed+'px';
			}
		}
		
		if(iCur!=json[attr])  bStop=false;
		if(bStop)
		{
			clearInterval(obj.timer);
			
			fn && fn();
		}
	}, 30)
}
//弹性运动基础
var speed=0; 
var left=0;
function fn(obj, iTarget) {
	clearInterval(obj.timer);
	obj.timer=setInterval(function() {
		speed+=(iTarget-obj.offsetLeft)/5;
		speed*=0.7;//每运动一个速度单位，下个速度就是0.7倍上个速度：摩擦力

		left+=speed;//避免直接应用left可能出现小数的问题

		if(Math.abs(speed)<1 && Math.abs(iTarget-left)<1) {
			clearInterval(obj.timer);
			obj.style.left=iTarget+"px";
		} else {
			obj.style.left=left+"px";
		}
		document.title=speed;
	}, 50)
}
//匀速撞墙反弹运动
var speedX=6;
var speedY=8;
var timer=null;
function fn1(obj) {
	clearInterval(timer)
	timer=setInterval(function() {
		var L=obj.offsetLeft+speedX;
		var T=obj.offsetTop+speedY;
		//右墙
		if(L>=document.documentElement.clientWidth-obj.offsetWidth) {
			speedX*=-1
			L=document.documentElement.clientWidth-obj.offsetWidth;
		}else if(L<=0) {
		//左墙
			speedX*=-1
			L=0;
		}
		//地面
		if(T>=document.documentElement.clientHeight-obj.offsetHeight) {
			speedY*=-1;
			T=document.documentElement.clientHeight-obj.offsetHeight;
		} else if(T<=0) {
		//天花板
			speedY*=-1;
			T=0;
		}
		obj.style.left=L+"px";
		obj.style.top=T+"px";

	} ,20)
}
//撞墙+落地重力运动
var speedX=6;
var speedY=8;
var timer=null;
function fn2(obj) {
	clearInterval(timer)
	timer=setInterval(function() {
		speedY+=5;

		var L=obj.offsetLeft+speedX;
		var T=obj.offsetTop+speedY;
		//右墙和左墙
		if(L>=document.documentElement.clientWidth-obj.offsetWidth) {
			speedX*=-0.8;//撞墙后速度较上次较小
			L=document.documentElement.clientWidth-obj.offsetWidth;
		}else if(L<=0) {
			speedX*=-0.8;//撞墙后速度较上次较小
			L=0;
		}
		//地面和天花板
		if(T>=document.documentElement.clientHeight-obj.offsetHeight) {
			speedY*=-0.9;//跳起来时比上次高度比上次更低
			speedX*=0.9;//撞墙后横向速度减小
			T=document.documentElement.clientHeight-obj.offsetHeight;
		} else if(T<=0) {
			speedY*=-1;
			speedX*=0.9;
			T=0;
		}
		//当速度减小至1以下时的处理方法
		if (Math.abs(speedX)<1) {
			speedX=0;
		}
		if (Math.abs(speedY)<1) {
			speedY=0;
		}
		obj.style.left=L+"px";
		obj.style.top=T+"px";

	} ,20)
}
//撞墙+落地重力运动,应用这个函数的例子是一个拖拽时松开鼠标扔出div的案例，在document.onmouseup下执行这个函数；
//下面这个定时器obj.timer可以直接关闭，也可以不把定时器设置在函数外：
//比如：clearInterval(oDiv.timer)
var speedX=0;//初始速度和方向设置，这里是垂直落地，也可以X=6偏离落地
var speedY=0;
function fn3(obj) {
	clearInterval(obj.timer);
	obj.timer=setInterval(function() {
	//速度和横纵向速度
		speedY+=3;//向下重力加速
		var L=obj.offsetLeft+speedX;
		var T=obj.offsetTop+speedY;
	//撞墙时速度和位置设置
		if (L<=0) {
			speedX*=-0.8;
			L=0;
		} else if (L>=document.documentElement.clientWidth-obj.offsetWidth) {
			speedX*=-0.8;
			L=document.documentElement.clientWidth-obj.offsetWidth;
			//避免因速度是小数时出现窗口滚动条
		}
		if (T<=0) {
			speedY*=-1.2;//撞天花板掉下来速度增加
			speedX*=0.8;
			T=0;
		} else if (T>=document.documentElement.clientHeight-obj.offsetHeight) {
			speedY*=-0.8;
			speedX*=0.8;
			T=document.documentElement.clientHeight-obj.offsetHeight;
		}
	//停止条件：速度足够小并且距离足够近
		//避免速度是小数的问题
		if (Math.abs(speedX)<1) {
			speedX=0;
		}
		if (Math.abs(speedY)<1) {
			speedY=0;
		}
		//当横纵向速度为零并且落地后(距离足够近)停止运动
		if (speedX===0 && speedY===0 && T===document.documentElement.clientHeight-obj.offsetHeight) {
			clearInterval(obj.timer);
		} else {
			obj.style.left=L+"px";
			obj.style.top=T+"px";
		}
	} ,50)
}