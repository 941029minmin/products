$(function(){
    window.onerror=function(){return true;}
    //导航菜单栏
    $("nav ul li").click(function(){
        var index=$("nav ul li").index(this);
        $("nav ul li").css("text-shadow","none")
        $("nav ul li").css({color:"#000"}).eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
        $("header ul").css({display:"none"});
        $("header ul").eq(index).css({display:"block"})
    })
    //绘图
    var canvas=document.querySelector("canvas");
    var coty=$(".coty")[0];
    var xp=$(".xp")[0];
    var selectarea=$(".selectarea")[0];
    var cobj=canvas.getContext("2d");
    var newobj=new shape(coty,cobj,xp,selectarea);
    //文件
    var wenjian=$(".one li");
    wenjian.click(function(){
        var index=wenjian.index(this);
        wenjian.css({color:"#000"}).css("text-shadow","none");
        wenjian.eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
        //新建
        if(index==0){
            if(newobj.history.length>0){
                var yes=confirm("是否保存");
                if(yes){
                    location.href=canvas.toDataURL().replace("image/png","stream/octet");
                }
                newobj.history=[];
                cobj.clearRect(0,0,canvas.width,canvas.height);
            }
        }
        //保存
        if(index==1){
            if(newobj.history.length>0){
                location.href=(canvas.toDataURL().replace("data:image/png","data:stream/octet"))
            }
        }
        //返回
        if(index==2){
            if(newobj.history.length==0){
                cobj.clearRect(0,0,canvas.width,canvas.height);
                setTimeout(function(){
                    alert("不能返回");
                },10)
            }
            if(newobj.isback){
                if(newobj.history.length==1){
                    newobj.history.pop();
                    cobj.clearRect(0,0,canvas.width,canvas.height);
                }else{
                    newobj.history.pop();
                    cobj.putImageData(newobj.history[newobj.history.length-1],0,0);
                }
            }else{
                cobj.putImageData(newobj.history.pop(),0,0);
            }
            newobj.isback=false;
        }
    })
    //绘图形状
    var xingzhuang=$(".two li:not(last)");
    for(var i=0;i<xingzhuang.length;i++){
        xingzhuang[i].onclick=function(){
            newobj.type=this.getAttribute("data-role");
            newobj.draw();
        }
    }
    xingzhuang.click(function(){
        var index=xingzhuang.index(this);
        xingzhuang.css({color:"#000"}).css("text-shadow","none");
        xingzhuang.eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
    })
    $(".two li").eq(3).click(function(){
        newobj.bianNum=prompt("请输入边数")
    })
    $(".two li").eq(4).click(function(){
        newobj.jiaoNum=prompt("请输入角数")
    })
    $(".two li").eq(5).click(function(){
        newobj.pen();
    })
    //绘图类型
    var leixing=$(".three li");
    for(var i=0;i<leixing.length;i++){
        leixing[i].onclick=function(){
            newobj.style=this.getAttribute("data-role");
        }
    }
    leixing.click(function(){
        var index=leixing.index(this);
        leixing.css({color:"#000"}).css("text-shadow","none");
        leixing.eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
    })
    //绘图颜色
    //1.边框颜色
    var bkys=$(".four input")[0];
    bkys.onchange=function(){
        newobj.strokeStyle=bkys.value;
    }
    //2.填充颜色
    var tcys=$(".four input")[1];
    tcys.onchange=function(){
        newobj.fillStyle=tcys.value;
    }

    //线条宽度
    var xk=$(".five li:not(last)");
    for(var i=0;i<xk.length;i++){
        xk[i].onclick=function(){
            newobj.lineWidth=this.getAttribute("data-role");
        }
    }
    var five1=$(".five1 input")[0];
    five1.onchange=function(){
        newobj.lineWidth=five1.value;
    }
    xk.click(function(){
        var index=xk.index(this);
        xk.css({color:"#000"}).css("text-shadow","none");
        xk.eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
    })
    //橡皮擦
    var xp=$(".sex li:not(last)");
    for(var i=0;i<xp.length;i++){
        xp[i].onclick=function(){
            newobj.xpsize=this.getAttribute("data-role");
            newobj.clear();
        }
    }
    var sex1=$(".sex1 input")[0];
    sex1.onchange=function(){
        newobj.xpsize=sex1.value;
    }
    xp.click(function(){
        var index=xp.index(this);
        xp.css({color:"#000"}).css("text-shadow","none");
        xp.eq(index).css({color:"#fff"}).css("text-shadow","0 0 3px #000");
    })
    //选择
    $(".select").click(function(){
        newobj.select($(".selectarea"));
        $(".select").css({color:"#fff"}).css("text-shadow","0 0 3px #000");
        selectarea.style.border="1px dotted #000";
    })


})