function shape(canvas,cobj,xp,selectarea){
    this.coty=canvas;
    this.cobj=cobj;
    this.xp=xp;
    this.selectarea=selectarea;
    this.history=[];
    this.style="stroke";
    this.type="line";
    this.fillStyle="#000";
    this.strokeStyle="#000";
    this.lineWidth=1;
    this.canvasW=canvas.offsetWidth;
    this.canvasH=500;
    this.bianNum=5;
    this.jiaoNum=5;
    this.xpsize=10;
    this.isback=true;
    this.isshowxp=true;
}
shape.prototype= {
    init: function () {
        this.cobj.fillStyle = this.fillStyle;
        this.cobj.strokeStyle = this.strokeStyle;
        this.cobj.lineWidth = this.lineWidth;
        this.xp.style.display="none";
    },
    draw: function () {
        var that = this;
        that.coty.onmousedown = function (e) {
            that.init();
            var startx = e.offsetX;
            var starty = e.offsetY;
            that.coty.onmousemove = function (e) {
                that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
                if (that.history.length!= 0) {
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var movex = e.offsetX;
                var movey = e.offsetY;
                that[that.type](startx,starty,movex,movey);
            }
            that.coty.onmouseup = function () {
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH));
                that.coty.onmousemove = null;
                that.coty.onmouseup = null;
            }
        }
    },
    line: function (x, y, x1, y1) {
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect: function (x, y, x1, y1) {
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();
    },
    pen:function(){
        var that=this;
        that.coty.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty)
            that.coty.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                that.cobj.lineTo(movex,movey);
                that.cobj.stroke();
            }
            that.coty.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH));
                that.coty.onmousemove=null;
                that.coty.onmouseup=null;
            }
        }
    },
    arc: function (x, y, x1, y1) {
        this.cobj.beginPath();
        var r = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
        this.cobj.arc(x, y, r, 0, Math.PI * 2)
        this.cobj[this.style]();
    },
    dbx:function(x,y,x1,y1){
        var a=360/this.bianNum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.beginPath();
        for(var i=0;i<this.bianNum;i++ ){
            this.cobj.lineTo(x+r*Math.cos(a*i),y+r*Math.sin(a*i));
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    djx:function(x,y,x1,y1){
        var a=360/(this.jiaoNum*2)*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/3;
        this.cobj.beginPath();
        for(var i=0;i<this.jiaoNum*2;i++ ){
            if(i%2==0) {
                this.cobj.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i))
            }else{
                this.cobj.lineTo(x + r1 * Math.cos(a * i), y + r1 * Math.sin(a * i))
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    // 擦除
    clear:function(){
        var that=this;
        that.coty.onmousemove=function(e){
            if(!that.isshowxp){
                return false;
            }
            var movex= e.offsetX;
            var movey= e.offsetY;
            var left=movex-that.xpsize/2;
            var top=movey-that.xpsize/2;
            if(left<0){
                left=0;
            }
            if(left>that.canvasW-that.xpsize){
                left=that.canvasW-that.xpsize
            }
            if(top<0){
                top=0;
            }
            if(top>that.canvasH-that.xpsize){
                top=that.canvasH-that.xpsize
            }
            that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
        }
        that.coty.onmousedown=function(){
            that.coty.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                var left=movex-that.xpsize/2;
                var top=movey-that.xpsize/2;
                if(left<0){
                    left=0;
                }
                if(left>that.canvasW-that.xpsize){
                    left=that.canvasW-that.xpsize
                }
                if(top<0){
                    top=0;
                }
                if(top>that.canvasH-that.xpsize){
                    top=that.canvasH-that.xpsize
                }
                that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
                that.cobj.clearRect(left,top,that.xpsize,that.xpsize);
            }
            that.coty.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH));
                that.coty.onmousemove=null;
                that.coty.onmouseup=null;
                that.clear();
            }

        }
    },
    // 剪切
    select:function(selectareaobj){
        var that=this;
        that.coty.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny,w,h;
            that.init();
            that.coty.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    left:minx,
                    top:miny,
                    width:w,
                    height:h,
                    display:"block"
                })
            }
            that.coty.onmouseup=function(){
                that.coty.onmouseup=null;
                that.coty.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.canvasW,that.canvasH));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            }
        }
    },
    //拖拽
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.coty.onmousemove=function(e){
            selectareaobj.css("cursor","move");
        }
        that.coty.onmousedown=function(e){
            var ax= selectareaobj.position().left;
            var ay= selectareaobj.position().top;
            var ox= e.clientX;
            var oy= e.clientY;
            that.coty.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
                if(that.history.length!=0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var mx= e.clientX;
                var my= e.clientY;
                var lefts=(mx-ox)+ax;
                var tops=(my-oy)+ay;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.canvasW-w){
                    lefts=that.canvasW-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.canvasH-h){
                    tops=that.canvasH-h;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                })
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
                that.selectarea.style.border="1px dotted #000";
            }
            that.coty.onmouseup=function(){
                that.coty.onmousemove=null;
                that.coty.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj);
                that.selectarea.style.border="none";
            }
        }
    }
}