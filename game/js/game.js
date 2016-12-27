
//角色
function person(canvas,cxt,runs,jumps){
    this.life=3;
    this.canvas=canvas;
    this.cxt=cxt;
    this.runs=runs;
    this.jumps=jumps;
    this.x=200;
    this.y=420;
    this.width=180;
    this.height=206;
    this.speedx=5;
    this.speedy=5;
    this.zhongli=0.4;
    this.status="runs";
    this.state=0;
}
person.prototype={
    draw:function(){
        this.cxt.save();
        this.cxt.translate(this.x,this.y);
        this.cxt.drawImage(this[this.status][this.state],0,0,1000,870,0,0,this.width,this.height);
        this.cxt.restore();
    }
};

//子弹
function zidan(canvas,cxt,bullet){
    this.canvas=canvas;
    this.cxt=cxt;
    this.x=100;
    this.y=100;
    this.bullet=bullet;
    this.speedx=5;
    this.jia=1;
    this.state=0;
    this.speedy=1;
    this.width=30;
    this.height=30;
}
zidan.prototype={
    draw:function(){
        this.cxt.save();
        this.cxt.translate(this.x,this.y);
        this.cxt.drawImage(this.bullet[this.state],0,0);
        this.cxt.restore();
    },
    update:function(){
        this.y+=this.speedy;
        this.x+=this.speedx;
    }
};
//障碍物
function Roadblock(canvas,cxt,roadObj) {
    this.canvas=canvas;
    this.cxt=cxt;
    this.roadObj=roadObj;
    this.x=canvas.width-50;
    this.y=500;
    this.width=250;
    this.height=250;
    this.state=0;
    this.speedx=10;
    this.stive=[];
}
Roadblock.prototype={
    draw:function () {
        this.cxt.save();
        this.cxt.translate(this.x,this.y);
        this.cxt.drawImage(this.roadObj[this.state],0,0,500,500,0,0,this.width,this.height);
        this.cxt.restore();
    }
};

//血
function lizi(cobj){
    this.cobj=cobj;
    this.x = 300;
    this.y = 300;
    this.r = 1+Math.random();
    this.color = "red";
    this.speedy = Math.random()*16-8;
    this.speedx = Math.random()*16-8;
    this.zhongli = 0.3;
    this.speedr = 0.03;
    this.start=0;
}
lizi.prototype = {
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.arc(this.start,this.start,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function(){
        this.x+=this.speedx;
        this.speedy+=this.zhongli;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
};

function xue(cobj,x,y,num,role){
    var arr = [];
    for(var i = 0;i<num;i++)
    {
        var obj = new lizi(cobj);
        if (role=="boom"){
            obj.color="rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
            obj.start=100+Math.ceil(Math.random()*200);
        }else if(role=="xue"){
            obj.color="red";
            obj.start=0;
        }
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++)
        {
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    },20)
}
//游戏运行
function game(canvas,cxt,runs,jumps,roadObj,bullet,audio){
    this.canvas=canvas;
    this.cxt=cxt;
    this.roadObj=roadObj;
    this.bullet=bullet;
    this.audio=audio;
    this.height=canvas.height;
    this.width=canvas.width;
    this.person=new person(canvas,cxt,runs,jumps);
    this.roadArr=[];
    this.angle=0;
    this.angleSpeed=10;
    this.zhongli=4;
    this.flag=true;
    this.flag1=true;
    this.timeChange=0;
    this.score=0;
    this.isfire=false;
    this.zidan=new zidan(canvas,cxt,bullet);
    this.user="";
    this.flagR=true;
    //move
    this.ts={};
    this.num2=0;
    this.num=0;
    this.time=(2+6*Math.ceil(Math.random()))*1000;
    this.top=0;
    //move2
    this.r=450;
    
}
game.prototype={
    play:function(){
        this.user=prompt("请输入你的用户名","min");
        this.audio[0].play();
        this.audio[0].loop=true;
        var that=this;
        that.ts.t1=setInterval(function () {
            that.move()
        },40);
    },
    move:function () {
        var that=this;
        that.timeChange+=50;
        that.cxt.clearRect(0,0,that.width,that.height);
        that.num++;
        that.num2+=10;
        if (that.person.status=="runs"){
            that.person.state=that.num%9;
        }else if(that.person.status=="jumps"){
            that.person.state=0;
        }
        // if (that.flag){
        //     that.person.speedy+=that.person.zhongli;
        //     that.top+=that.person.speedy;
        //     that.person.y=that.top;
        //     if(that.person.y>=420){
        //         that.person.y=420
        //     }
        // }
        that.person.draw();
        that.canvas.style.backgroundPosition=-that.num2+"px";
        // 操作障碍物
        if (that.timeChange%that.time==0){
            that.timeChange=0;
            that.time=(2+6*Math.ceil(Math.random()))*1000;
            Road=new Roadblock(that.canvas,that.cxt,that.roadObj);
            Road.state=Math.floor(Math.random()*that.roadObj.length);
            that.roadArr.push(Road);
        }
        for (var i=0;i<that.roadArr.length;i++){
            that.roadArr[i].x-=that.roadArr[i].speedx;
            that.roadArr[i].draw();
            // 检查碰撞
            if (hitPix(that.canvas,that.cxt,that.person,that.roadArr[i])){
                if (!that.roadArr[i].flag){
                    xue(that.cxt,that.person.x+that.person.width/2+40,that.person.y+that.person.height/2+40,30,"xue");
                    that.audio[3].play();
                    that.person.life--;
                    if (that.person.life<0){
                        that.audio[4].play();
                        var temp={};
                        temp["user"]=that.user;
                        temp["score"]=that.score;

                        var message=localStorage.messages?JSON.parse(localStorage.messages):[];
                        if (message.length>0){
                            message.sort(function (a,b) {
                                return a.score<b.score;
                            });
                            if (message.length<5){
                                message.push(temp)
                            }else {
                                message[message.length-1]=temp
                            }

                        }else if (message.length==0){
                            message.push(temp)
                        }
                        var msg=JSON.stringify(message);
                        localStorage.messages=msg;
                        that.over();
                        // return
                    }
                    that.roadArr[i].flag=true;
                }

            }
            if (that.person.x>(that.roadArr[i].x+that.roadArr[i].width)){
                if(!that.roadArr[i].flag&&!that.roadArr[i].flag1){
                    that.score++;
                    document.title=that.score;
                    that.roadArr[i].flag1=true;
                }
            }
            // 子弹打击
            if (hitPix(that.canvas,that.cxt,that.zidan,that.roadArr[i])){
                that.audio[3].play();
                var hind=that.cxt.getImageData(that.roadArr[i].x,that.roadArr[i].y,that.roadArr[i].width,that.roadArr[i].height);
                that.cxt.clearRect(that.roadArr[i].x,that.roadArr[i].y,that.roadArr[i].width,that.roadArr[i].height);
                xue(that.cxt,that.roadArr[i].x,that.roadArr[i].y,2000,"boom");


                that.roadArr.splice(i,1);
            }
        }

        //操作子弹
        if(that.isfire){
            that.zidan.speedx+=that.zidan.jia;
            that.zidan.x+=that.zidan.speedx;
            that.zidan.y+=that.zidan.speedy;
            that.zidan.draw();
            that.zidan.update();
        }
    },
    move2:function () {
        var that=this;
        that.angle += that.angleSpeed;

        if (that.angle > 180) {
            that.flag1=true;
            that.angle = 0;
            clearInterval(that.ts.t2);
            that.person.status="runs";
        } else {
            if (that.angle<90){
                that.r-=that.zhongli;
                that.person.y = 420-Math.sin(that.angle * Math.PI / 180) * that.r;
            }else if(that.angle>90&&that.angle<180){
                that.r+=that.zhongli;
                that.person.y = 490-Math.sin(that.angle * Math.PI / 180) * that.r;
            }

        }  
    },
    over:function () {
        for(var i in this.ts){
            clearInterval(this.ts[i]);
        }
        this.audio[0].pause();
        var gameOver=document.querySelector(".gameOver");
        var userScore=document.querySelector(".userScore");
        userScore.innerHTML=this.score;
        gameOver.style.marginTop="70px";
        var lis=document.querySelector(".gameOver ul");
        var messages=localStorage.messages?JSON.parse(localStorage.messages):[{}];
        var str="";
        for(var j=0;j<messages.length;j++){
            str+="<li>"+messages[j].user+":<span>"+messages[j].score+"</span></li>";

        }
        lis.innerHTML=str;
        this.again();

    },
    again:function () {
        var again=document.querySelector(".again");
        var that=this;
        again.onclick=function () {
            var gameOver=document.querySelector(".gameOver");
            gameOver.style.marginTop="-999px";
            that.person.x=200;
            that.person.y=100;
            that.score=0;
            that.person.life=3;
            that.person.status="runs";
            that.roadArr=[];
            that.play();
            that.key();
            that.mouse()
        }
    },
    key:function () {
        var that=this;
            document.onkeydown=function (e) {
                if (e.keyCode==13){
                    if (that.flagR){
                        for(var i in that.ts){
                            clearInterval(that.ts[i]);
                        }
                        that.audio[0].pause();

                        that.flagR=false
                    }else{
                        that.ts.t1=setInterval(function(){
                            that.move();
                        },50);
                        if (!that.flag1){
                            clearInterval(that.ts.t2);
                            that.ts.t2=setInterval(function(){
                                that.move2();
                            },50);
                        }
                        that.audio[0].play();
                        that.audio[0].loop=true;

                        that.flagR=true;
                    }
                
                
                }

                if (e.keyCode == 32) {
                    if (!that.flag1){
                        return false
                    }
                    that.flag1=false;
                    that.flag=false;
                    if (that.flagR){
                        that.audio[1].play();
                    }
                    that.person.status="jumps";
                    that.person.y=420;
                    that.ts.t2 = setInterval(function () {
                        that.move2()
                    }, 100);
                }
            };
    },
    mouse:function(){
        var that=this;
        this.canvas.onclick=function(){
            that.zidan.x=that.person.x+150;
            that.zidan.y=that.person.y+150;
            that.zidan.speedx=5;
            that.isfire=true;
            if (that.flagR){
                that.audio[2].play();
            }
           
        }
    }

};


