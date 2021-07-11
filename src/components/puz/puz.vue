<template>
    <!--头部-->
    <div>
        <div class="bg"></div>
        <div class="bg2"></div>
        <div class="vs"></div>
        <div id="game_hrader">
            <img src="./img/back.png">
            <span style="font-size: 20px;">小西拼图</span>
            <div style="width: 48px;"></div>
        </div>
        <!--头部结束-->
        <!--中间游戏部分-->
        <div id="game_top">
          <div id="user-img">
              <div id="user-left">
                  <img :src="user1.src" v-if="user1.src">
                  <img src="" v-else>
              </div>
              <div>
              </div>
              <div id="user-right">
                  <img v-if="user2.src" :src="user2.src">
                  <img v-else src="./img/add.png" class="invite" >
              </div>
          </div>
          <div id="user-name">
            <div>
                <span v-if="user1.name">{{user1.name}}</span>
            </div>
            <div>
                <span v-if="user2.name">{{user2.name}}</span>
            </div>
          </div>
        </div>
        <div id="game_content"  style="display: none">
            <div id="imgArea"></div>
        </div>
        <div id="game_c">
            <div id="game_control">
                <!-- <span id="btn">开始</span> -->
                <!-- <span id="level">level: 3x3</span> -->
                <!-- <span id="scroe">步数：0</span> -->
            </div>
            <!-- <div id="game_result"><span>展示图</span></div> -->
        </div>
        <!--中间游戏部分结束-->
        <!--底部tab栏-->
        <div id="game_footer"  style="display: none">
            <ul id="img_list">
                <li><img class='imgcontent'/></li>
            </ul>
        </div>
        <!--底部tab栏结束-->
    </div>
</template>


<script>
import axios from "axios";
import $ from "jquery";
export default {
  name: 'puz',
  data () {
    return {
       user1:{src:"/static/img/111.adbdb70.jpeg",name:"我都依你"},
       user2:{},
       imgOrigArr : [],  //图片的正确顺序
       imgRandArr : [], //图片打乱后的顺序
       width:"",    //整张图片的宽度
       height:"",          //整张图片的高度
       cellWidth:"",       //每一碎块的宽度
       cellHeight:"",      //每一碎块的高度
       moveTime:50,  //记录animate动画的运动时间，默认400毫秒
       imgCells:'',    //记录碎片节点
       lever:3,     //难度 3x3
       isInGame:false,       //标记是否在游戏中
       scroe:0,        //游戏步数
       presentImg:"",          //当前图片
       passImg:[],        //已经通关的图片
       s:0,
    }
  },
  mounted(){
    const _this=this;
    
    // _this.setBgPic();
    _this.preperforM();
    // _this.getImg();
  },
  methods:{
    //获取图片和乱序的数组
    getImg(){
      const _this=this
      var _div=$("#img_list").children("li").find("img")[0]
      axios.get("/api/get/img").then(res=>{
        $(_div).attr("src",res.data.src)
        _this.presentImg=res.data.src
        _this.imgSplit(_this.presentImg)
        _this.imgRandArr=res.data.random_data
        setTimeout(()=>{
          // _this.randomArr();
          _this.cellOrder(_this.imgRandArr);
          _this.beginGamePc();
          _this.beginGamePhone();
          _this.isInGame = true;
          _this.scroe = 0;
          // $("#scroe").text("步数：0");
        },3000)
      })
    },
    //设置背景图片
    setBgPic:function(){
      // $(".bg").css('background', 'url("'+ './img/bg_sunny.png' +'")');
      if (document.documentElement.clientWidth > 700){
        $(".bg").css('background-size', 'auto '+document.documentElement.clientHeight +'px');
        $(".bg").css('background-repeat', 'repeat');
      }else {
        $(".bg").css('background-size', document.documentElement.clientWidth+'px '+document.documentElement.clientHeight+'px');
        $(".bg").css('background-repeat', 'repeat-y');
      }
    },
    //切割图片
    imgSplit:function (img) {
      const _this=this
      _this.width = $("#imgArea").width();
      _this.height = $("#imgArea").height();
      _this.cellWidth = _this.width/_this.lever;
      _this.cellHeight = _this.height/_this.lever;
      _this.imgOrigArr = [];
      _this.imgRandArr = [];
      var cell = '';   //记录单个图片碎片的变量
      $("#imgArea").html("");
      for (var i = 0; i < _this.lever; i++){
        for (var j = 0; j < _this.lever; j++){
          _this.imgOrigArr.push(i*_this.lever+j);
          cell = document.createElement("div");
          cell.className = "imgCell";
          $(cell).css({width: _this.cellWidth - 2, height: _this.cellHeight - 2, left: j * _this.cellWidth, top: i * _this.cellHeight, background: "url('"+ img +"')", backgroundPosition: (-j)*_this.cellWidth + 'px ' + (-i)*_this.cellHeight + 'px',backgroundSize:$("#imgArea").width()+"px"+" "+$("#imgArea").width()+"px"});
          $("#imgArea").append(cell);
        }
      }
      _this.imgCells = $(".imgCell");
      _this.imgCells.css('cursor', 'pointer');
    },
    //PC端
    beginGamePc:function () {
      const _this=this
      _this.imgCells.bind("mouseover", function () {
        $(this).addClass("hover");
      });
      _this.imgCells.bind("mouseout", function () {
        $(this).removeClass("hover");
      });
      _this.imgCells.bind("mousedown", function (e) {
        /*此处是图片移动*/
        $(this).css('cursor','move');
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.pageX - $(this).offset().left;
        var cell_mouse_y = e.pageY - $(this).offset().top;
        //拖动碎片
        $(document).bind("mousemove", function (e2) {
          _this.imgCells.eq(cellIndex_1).css({
            zIndex: '40',
            left: e2.pageX - cell_mouse_x - $("#imgArea").offset().left,
            top: e2.pageY - cell_mouse_y - $("#imgArea").offset().top
          });
        });
        $(document).bind("mouseup", function (e3) {
          var cellIndex_2 = _this.cellChangeIndex(e3.pageX - $("#imgArea").offset().left, e3.pageY - $("#imgArea").offset().top, cellIndex_1);
          //console.log(cellIndex_2);
          if (cellIndex_1 == cellIndex_2){
            _this.cellReturn(cellIndex_1);
          }else {
            _this.cellExchange(cellIndex_1, cellIndex_2);
          }
          //移除绑定
          $(document).unbind('mousemove').unbind('mouseup');
        })
      });
      _this.imgCells.bind("mouseup", function () {
        $(this).css('cursor','pointer');
      })
    },
    //移动端
    beginGamePhone:function(){
      const _this=this
      _this.imgCells.on('touchstart', function (e) {
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.touches[0].pageX - $(this).offset().left;
        var cell_mouse_y = e.touches[0].pageY - $(this).offset().top;
        $(document).on('touchmove', function (e2) {
          _this.imgCells.eq(cellIndex_1).css({
            zIndex: '40',
            left: e2.touches[0].pageX - cell_mouse_x - $("#imgArea").offset().left,
            top: e2.touches[0].pageY - cell_mouse_y - $("#imgArea").offset().top
          });
        });
        $(document).on('touchend', function (e3) {
          var cellIndex_2 = _this.cellChangeIndex(e3.changedTouches[0].pageX - $("#imgArea").offset().left, e3.changedTouches[0].pageY - $("#imgArea").offset().top, cellIndex_1);
          //console.log(cellIndex_2);
          if (cellIndex_1 == cellIndex_2){
            _this.cellReturn(cellIndex_1);
          }else {
            _this.cellExchange(cellIndex_1, cellIndex_2);
          }
          //移除绑定
          $(document).off('touchmove').off('touchend');
        })
      });

    },
    //打乱数组顺序
    randomArr:function(){
      const _this=this
      _this.imgRandArr = [].concat(_this.imgOrigArr);   //将顺序的数组值赋给新数组之后打乱顺序
      for (var i = 0; i < _this.imgOrigArr.length; i++){
        _this.imgRandArr.sort(function () {
          return 0.5 - Math.random();
        });
      }
    },
    //根据打乱的数组给图片排序
    cellOrder:function (arr) {
      const _this=this
      for (var i = 0; i < arr.length; i++){
        _this.imgCells.eq(i).animate({
          left: arr[i] % _this.lever * _this.cellWidth,
          top: Math.floor(arr[i] / _this.lever) * _this.cellHeight     //Math.floor向下取值（1.6为1）
        }, _this.moveTime);
      }
    },
    //计算被交换碎片的下标
    cellChangeIndex:function(x,y,index1){
      const _this=this
      if (x < 0 || x > _this.width || y < 0 || y > _this.height){
        return index1;
      }
      //鼠标拖动碎片在大图范围内移动
      var row = Math.floor(y / _this.cellHeight);
      var col = Math.floor(x / _this.cellWidth);
      var position = row * _this.lever + col;

      var i = 0;
      while ((i < _this.imgRandArr.length) && (_this.imgRandArr[i] != position)){
        i++;
      }
      return i;
    },
    //被拖动的图片返回原位置
    cellReturn:function(index){
      const _this=this
      var row = Math.floor(_this.imgRandArr[index]/_this.lever);
      var col = _this.imgRandArr[index] % _this.lever;
      _this.imgCells.eq(index).animate({
        left: col * _this.cellWidth,
        top: row * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(index).css('z-index','10');
      })
    },
    //交换图片位置
    cellExchange:function (indexfrom,indexto) {
      const _this=this;
      var rowform = Math.floor(_this.imgRandArr[indexfrom] / _this.lever);
      var colform = _this.imgRandArr[indexfrom] % _this.lever;
      var rowto = Math.floor(_this.imgRandArr[indexto] / _this.lever);
      var colto = _this.imgRandArr[indexto] % _this.lever;
      //交换图片的位置
      _this.imgCells.eq(indexfrom).animate({
        left: colto * _this.cellWidth,
        top: rowto * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(indexfrom).css('z-index','10');
      });

      _this.imgCells.eq(indexto).css('z-index','30').animate({
        left: colform * _this.cellWidth,
        top: rowform * _this.cellHeight
      }, _this.moveTime, function () {
        _this.imgCells.eq(indexto).css('z-index','10');

        //交换存储的数据
        var temp = _this.imgRandArr[indexfrom];
        _this.imgRandArr[indexfrom] = _this.imgRandArr[indexto];
        _this.imgRandArr[indexto] = temp;

        $("#scroe").text("步数：" + (_this.scroe+=1));

        //判断是否完成全部移动，可以结束游戏
        if (_this.checkPass(_this.imgOrigArr, _this.imgRandArr)){
          alert("游戏结束！！！")
          _this.passGame();
        }
      })
      
    },
    //判断是否完成全部移动，可以结束游戏
    checkPass:function (rightArr,puzzleArr) {
      if (rightArr.toString() == puzzleArr.toString()){
        return true;
      }
      return false;
    },
    //成功完成游戏之后的处理
    passGame:function(){
      const _this=this
      if ($.inArray(_this.presentImg, _this.passImg) == -1){
        _this.passImg.push(_this.presentImg);
      }
      else{
        _this.passKnowledge[_this.presentImg] = $("#gameAnswer").text();
        console.log("info:"+_this.passKnowledge[_this.presentImg]);
        _this.showReward(_this.presentImg);
      }
    },
    //展示游戏成功之后的界面
    showReward:function (img) {
      const _this=this;
      $("#imgArea").fadeOut();
      $("#game_reward").fadeIn();
      $("#btn").unbind();
      $("#level").unbind();
      // $("#game_result span").text("back");
      $("#game_reward").css('background', 'url('+ img +')');
      _this.s = 1;
    },
    //自适应手机
    preperforM:function () {
      var w;
      if (document.documentElement.clientWidth > 700){
        w = 300;
        $("#imgArea").css('width', w);
      }else {
        w = document.documentElement.clientHeight*0.8;
        if ($("#imgArea").width() > w){
          $("#imgArea").css('width', w);
        }else {
          w = $("#imgArea").width();
        }
      }
      $("#imgArea").css('height', w);
      var show_w=$("#game_footer").css("width")
      var img_w=Math.min(parseInt(show_w),(document.documentElement.clientHeight-w-150))
      $("#game_footer").css("height",img_w)
      var ca=img_w*0.2
      $(".imgcontent").css({"width":img_w-ca,"height":img_w-ca,"margin":ca/10})
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "./css/weatherGame.css";
@import "./css/demo.css";

</style>
