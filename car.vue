<template>
  <div>
    <div id="bg">
      <div id="all">
        <div v-for="(item,index) in lists" :key="index" :id="item.id" :style="{backgroundImage:`url(${item.style.backgroundUrl})`}">
        </div>
      </div>
      <div id="car">
      </div>
      <div id="goUp" @click="goUp">
        <p>向前</p>
      </div>
      <div id="goDown"  @click="goDown">
        <p>向后</p>
      </div>
      
    </div>
    <div id="number">
        {{num}}
    </div>
  </div>
</template>


<script>
  import $ from "jquery";
  export default{
    name:'car',
    data() {
      return {
        lists:[{id:"up",style:{}},{id:'now',style:{}},{id:'down',style:{}}],
        num:0,
        speed:10,
        timer:false,
      }
    },
    mounted(){
        this.init();
    },
    methods:{
      init(){
        this.createDown();
        this.createUp();
        this.createNow();
      },
      goUp(){
        if(!this.timer){
          setTimeout(()=>{
            $("#all").css({'top':'0.5vw','transitionDuration':'3s'});
          },100);
          this.timer=setTimeout(()=>{
            [this.lists[1].style,this.lists[2].style]=[this.lists[0].style,this.lists[1].style];
            $("#all").css({'top':'-100vw','transitionDuration':'0s'});
            this.timer=false;
          },3000);
          this.createUp();
          this.num=this.num+this.speed;
        }
      },
      goDown(){
        if(!this.timer && this.num>0){
          setTimeout(()=>{
            $("#all").css({'top':'-200vw','transitionDuration':'3s'});
          },100);
          this.timer=setTimeout(()=>{
            [this.lists[0].style,this.lists[1].style]=[this.lists[1].style,this.lists[2].style];
            $("#all").css({'top':'-100vw','transitionDuration':'0s'});
            this.timer=false;
          },3000);
          this.createDown();
          this.num=this.num-this.speed;
        }
      },
      createUp(){
        let obj={};
        obj['backgroundUrl']=this.changeBg(this.num+10);
        this.$set(this.lists[0],'style',obj);
      },
      createNow(){
        let obj={};
        obj['backgroundUrl']=this.changeBg(this.num);
        this.$set(this.lists[1],'style',obj);
      },
      createDown(){
        let obj={};
        obj['backgroundUrl']=this.changeBg(this.num-10);
        this.$set(this.lists[2],'style',obj);
      },
      changeBg(n){
        //当超过多少米时会切换背景图
        switch (true) {
          case n>400:
            return "../../static/images/bg5.jpg";
            break;
          case n>300 && n<400:
            return "../../static/images/bg4.jpg";
            break;
          case n>200 && n<300:
            return "../../static/images/bg3.jpg";
            break;
          case n>100 && n<200:
            return "../../static/images/bg2.jpg";
            break;
          case n>=0 && n<100:
            return "../../static/images/bg1.jpg";
            break;
          default:
            return "../../static/images/bg6.jpg";
            break;
        }
      }

    }
  }

</script>

<style scoped>
#canvas{
  height:100%;
  width:100%;
}
#up,#now,#down{
  height: 100.5vw;
  width:160px;
  position: relative;
  background-size: 100% 100%;
  margin:-0.25vw 0;
}
#bg{
  width: 160px;
  height: 100vw;
  position: absolute;
  overflow: hidden;
  transform: rotate(90deg);
  top:calc(50vh - 50vw);
  left:calc(50vw - 80px);
}
#now{
}
#up{
}
#down{
}
#all{
  transition-timing-function:ease;
  position: absolute;
  top:-100%;
}
#car{
  height: 8rem;
  position: absolute;
  top:40%;
  left: calc(50% - 2rem);
  width: 4rem;
  background:url("../../static/images/cars_atlas.png");
  background-position: 1px 2px;
  transform: scale(0.5);
}
#goUp{
  top:3rem;
}
#goDown{
  bottom:3rem
}
#goUp,#goDown{
  width: 6rem;
  height: 3rem;
  position: absolute;
  text-align: center;
  left: 40px;
  background: rgba(10, 5, 5, 0.43);
}
#goUp p,#goDown p{
  color: white;
  line-height: 3rem;
}
#number{
  position: absolute;
  top:10px;
  left: 10px;
  font-size: 3rem;
  color: #6d6c6ce3;
  font-weight: bold;
}
</style>
