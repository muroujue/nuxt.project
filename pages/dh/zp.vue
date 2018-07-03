<template>
  <div id="wrapper">
    <div id="content">
      <header>
        <img src="~assets/img/dh/zp/btn_record.png" alt="" @click="showRecord()">
        <h1>{{MainTitle}}</h1>
        <h2>{{SubTitle}}</h2>
        <p class="time">活动时间：{{OpenStartTime}}-{{OpenEndTime}}</p>
        <p class="info"><span class="fl">{{DisplayContent}}：{{TargetValue}}</span><span class="fr">可抽奖次数：{{LuckyDrawCount}}</span></p>
      </header>
      <div id="dial">
        <ul :style="{transform:'rotate('+rotateDeg+'deg)'}">
            <li v-for="item of zoneArray" :style="{transform:'rotate('+item.deg+'deg) skew('+skewDeg+'deg)'}" :key="item.id">
              <span :style="{transform:'skew('+(-skewDeg)+'deg) rotate('+((90-skewDeg)/2 - 90)+'deg)',height:inHeight,width:inWidth}">
                <em>{{ item.DescOne }}</em>{{ item.DescTwo }}
              </span>
            </li>
        </ul>
        <p class="btn" @click="start"><span>抽奖</span></p>
      </div>
      <div class="copyright">活动声明：本次活动与Apple Inc.无关</div>
    </div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade">
      <div class="record">
        <h4>中奖记录</h4>
        <ul class="recordList">
          <li v-for="item of recordList" :key="item.id">
            <span class="fl">{{item.WinningTime}}</span>
            <span class="fr">{{item.AwardName}}</span>
          </li>
        </ul>
        <p class="tipInfo" v-show="noRecordShow">您暂时还没有中奖纪录哦！</p>
        <i class="iconfont close" @click="closePop(1)">&#xe659;</i>
      </div>
    </mt-popup>
    <mt-popup v-model="haveAwardPop" popup-transition="popup-fade">
      <div class="awardPop">
        <img src="~assets/img/dh/zp/prize.png" alt="">
        <p><strong>恭喜您抽中{{getAwardName}}</strong><span>手气真不错，再接再厉</span></p>
        <i class="iconfont close" @click="closePop(2)">&#xe659;</i>
      </div>
    </mt-popup>
    <mt-popup v-model="noAwardPop" popup-transition="popup-fade">
      <div class="awardPop">
        <img src="~assets/img/dh/zp/noprize.png" alt="">
        <p><strong>好可惜，差一点点就抽中了</strong><span>下次再来试试运气吧！</span></p>
        <i class="iconfont close" @click="closePop(3)">&#xe659;</i>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
// import { timeFormat, addVisit } from '~/plugins/hdhzMethods'
import { mapState } from 'vuex'
import { Toast,MessageBox,Popup } from 'mint-ui'

export default {
  layout: 'huodong',
  head () {
    return {
      title: '转盘'
    }
  },
  data() {
    return {
      MainTitle:'转盘活动展示',
      SubTitle:'欢乐转盘一起玩',
      OpenStartTime:'2018.07.02',
      OpenEndTime:'2022.07.31',
      HasRule:false,
      RuleText:'',
      TargetValue:2600,
      LuckyDrawCount:12,
      swidth:'100',
      goal: 0,            //中奖区域
      round: 7,          //旋转圈数
      rotateDeg:0,        //转盘旋转角度
      endDeg:0,           //转盘停下来时的角度
      accelerate:50,      //加速角度
      frequently:50,      //定时器频率
      isHaveAward:false,
      haveAwardPop:false,
      noAwardPop:false,
      getAwardName:'',
      popupVisible:false,
      recordList:[],
      inProgress:false,
      LuckyDrawList:[
        {
          'DescOne':'一等奖',
          'DescTwo':'双人游'
        },
        {
          'DescOne':'二等奖',
          'DescTwo':'ipad'
        },
        {
          'DescOne':'三等奖',
          'DescTwo':'扫地机器人'
        },
        {
          'DescOne':'四等奖',
          'DescTwo':'靠枕'
        },
        {
          'DescOne':'五等奖',
          'DescTwo':'抽纸'
        },
        {
          'DescOne':'安慰奖',
          'DescTwo':'大大拥抱'
        },
        {
          'DescOne':'无中奖',
          'DescTwo':'呜呜呜'
        }
      ],
      innerCss:['0/0','0/0','0/0','2.8/2.6','2.7/2.35','2.45/2.2','2.6/1.9','2.7/1.8','2.6/1.65']
    }
  },
  async asyncData ({error}) {
    try {
    } catch (err){
      error({ statusCode: 500 , message: 'Oops, An Error Occurred' })
    }
  },
  computed: {
    ...mapState([
      'gConfig'
    ]),
    parts:function(){
      return this.LuckyDrawList.length
    },
    zoneArray:function(){
      let items = []
      if (this.LuckyDrawList) {
        items = this.LuckyDrawList.map((v,i,array)=>{
          v.deg = -360/this.parts * i
          return v
        })
      }
      return items
    },
    skewDeg:function(){
      return 90-360/this.parts
    },
    inWidth:function(){
      let value = this.innerCss[this.parts-1];
      let wv = value.split('/')[0]
      return wv +'rem'
    },
    inHeight:function(){
      let value = this.innerCss[this.parts-1];
      let hv = value.split('/')[1]
      return hv +'rem'
    },
    DisplayContent:function(){
      return '累计消费积分'
    },
    noRecordShow:function(){
      let val
      if (this.recordList.length > 0) {
        val = false
      } else {
        val = true
      }
      return val
    }
  },
  mounted() {
    this.rotateDeg = 90-360/this.parts
    this.getRecord()
  },
  methods: {
    getRecord(){
      // 获取中奖记录
      // axios.post(`//${this.gConfig.miapiDomain}/miPage/ActivityBox/GetLuckyDrawRecord`, {
      //   "Head": {
      //       "Version":"3.5.3",
      //       "Token":this.token,
      //       "AppType":1,
      //       "Build":127
      //   },
      //   "Content":{
      //       "UserId": this.userid,
      //       "ActivityId": this.activityid
      //   }
      // }).then((res) => {
      //   let data = res.data
      //   if (data.Head.Ret == 0){
      //     this.recordList = data.Content
      //   }
      // })
    },
    start(){
      if (this.LuckyDrawCount === 0) {
        MessageBox('提示', '您已无抽奖机会')
        return
      }
      if (this.inProgress) return
      this.inProgress = true
      this.getGoal(Math.floor(this.parts * Math.random()))
      this.LuckyDrawCount--
      // axios.post(`//${this.gConfig.miapiDomain}/miPage/ActivityBox/LuckyDraw`, {
      //   "Head": {
      //       "Version":"3.5.3",
      //       "Token":this.token,
      //       "AppType":1,
      //       "Build":127
      //   },
      //   "Content":{
      //       "UserId": this.userid,
      //       "ActivityId": this.activityid
      //   }
      // }).then((res) => {
      //   let data = res.data
      //   if (data.Head.Ret == 0) {
      //     this.getGoal(data.Content.Id)
      //     this.LuckyDrawCount = data.Content.LuckyDrawCount
      //     this.isHaveAward = data.Content.IsHaveAward
      //     if (this.isHaveAward) this.getAwardName = data.Content.AwardName
      //   } else {
      //     this.inProgress = false
      //     MessageBox('提示', data.Head.Msg)
      //   }
      // })
    },
    showRecord() {
      this.popupVisible = true
    },
    setDefault() {
      this.rotateDeg = 90-360/this.parts
      this.accelerate = 50
      this.inProgress = false
    },
    getGoal(index) {
      this.goal = index
      const startDeg = 90-360/this.parts
      const perPartDeg = 360/this.parts
      this.endDeg = startDeg + (this.round * 360) +(perPartDeg * this.goal + 5 + parseInt((perPartDeg-10) * Math.random()))  // 转盘的初始角度 + 要旋转的圈数*360 + 目标区域的角度范围
      if (index == this.parts-1) {
        this.isHaveAward = false
      } else {
        this.isHaveAward = true
      }
      this.goRotate()
    },
    goRotate() {
      let cutDeg = this.endDeg - (this.accelerate + 1) * (this.accelerate / 2) - 10
      setTimeout(() => {
          if (this.rotateDeg >= cutDeg && this.accelerate > 1) {
            this.accelerate -= 1
          }
          this.rotateDeg = this.rotateDeg + this.accelerate
          if (this.rotateDeg<this.endDeg) {
            this.goRotate()
          } else {
            setTimeout(()=>{
              if (this.isHaveAward) {
                this.haveAwardPop = true
                this.getRecord()
              } else {
                this.noAwardPop = true
              }
              this.setDefault()
            },1000)
          }
      }, this.frequently);
    },
    closePop(type) {
      if (type==1) {
        this.popupVisible = false
      } else if (type==2) {
        this.haveAwardPop = false
      } else if (type==3) {
        this.noAwardPop = false
      }
    }
  }
}
</script>

<style lang="scss">
  .mint-popup{
    background: none;
  }
  .guide{
    li,p{
      margin-top: .2rem;
      line-height: 1.6;
    }
    img{
      max-width: 100%;
      height: auto!important;
    }
  }
</style>
<style scoped lang="scss">
#wrapper{
  background: #ffc878 url(~assets/img/dh/zp/bg_body.jpg) no-repeat center top;
  background-size:100% auto;
  min-height: 100vh;
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  header{
    height:5.3rem;
    position: relative;
    padding-top: 0.9rem;
    box-sizing: border-box;
    text-align:center;
    img{
      width: 2.09rem;
      position: absolute;
      right:.24rem;
      top:.24rem;
    }
    h1{
      height: 1.1rem;
      font-size: .71rem;
      font-weight: bold;
      color:#fff;
      text-shadow:0 0.07rem 0 #ff7800;
    }
    h2{
      font-size: .48rem;
      font-weight: bold;
      color:#fff;
      height: 1.2rem;
      text-shadow:0 0.04rem 0 #ff7800;
    }
    .time{
      // margin-top: 0.55rem;
      margin-bottom: 0.3rem;
      color:#fff;
      text-shadow:0 0.04rem 0 #e42007;
    }
    .info{
      background: url(~assets/img/dh/zp/bg_info.png) no-repeat center top;
      background-size: 9.4rem auto;
      width: 9.4rem;
      height: .77rem;
      margin: 0 auto;
      color:#ff3700;
      font-size:.37rem;
      line-height: 0.77rem;
      text-align: center;
      padding:0 .47rem;
      box-sizing: border-box;
    }
  }
  #dial{
    position: relative;
    width:8.77rem;
    height:8.77rem;
    background: url(~assets/img/dh/zp/bg_dial.png) no-repeat center top;
    border-radius: 100%;
    background-size:100% auto;
    padding-bottom: .13rem;
    margin: 0 auto;
    overflow: hidden;
    ul{
      position: absolute;
      width:7.48rem;
      height:7.48rem;
      border-radius: 100%;
      left:50%;
      top:50%;
      margin: -3.86rem 0 0 -3.76rem;
      transition: all .3s ease;
      overflow: hidden;
      li{
        position: absolute;
        transform-origin: 100% 100%;
        overflow: hidden;
        width:4.5rem;
        height:4.5rem;
        left: 50%;
        top: 50%;
        margin-top: -4.5rem;
        margin-left: -4.5rem;
        border-right:.055rem solid #ffb081;
        span{
          position: absolute;
          display: block;
          color:#b63e06;
          height: 2.8rem;
          font-size:.4rem;
          text-align: center;
          box-sizing: border-box;
          right:0;
          bottom:0;
          em{
            display: block;
          }
        }
      }
    }
    .btn{
      position: absolute;
      margin:-1.15rem 0 0 -1.15rem;
      top:50%;
      left:50%;
      color:#fff;
      width:1.74rem;
      height:1.74rem;
      background: #fff;
      border-radius: 100%;
      padding:0.12rem;
      border:.16rem solid #ff9600;
      span{
        position: relative;
        display: block;
        width:100%;
        height:100%;
        border-radius: 100%;
        background:linear-gradient(to bottom,#ff9a00,#ff0220);
        text-align: center;
        line-height: 1.74rem;
        font-size: .59rem;
        z-index: 3;
      }
      &:before{
        content: "";
        width: 0;
        height: 0;
        top: -1.4rem;
        left:50%;
        margin-left: -0.295rem;
        position: absolute;
        border-left: .32rem solid transparent;
        border-bottom: 1.8rem solid #ffa178;
      }
      &:after{
        content: "";
        width: 0;
        height: 0;
        top: -1.4rem;
        left:50%;
        margin-left: 0.01rem;
        position: absolute;
        border-right: .32rem solid transparent;
        border-bottom: 1.8rem solid #ff2008;
      }
    }
  }
  .copyright{
    color:#b63e06;
    text-align: center;
    font-size: 0.32rem;
    padding:0.5rem 0;
  }
  .record{
    position: relative;
    h4{
      position: relative;
      background: #ffc57a;
      color:#f50303;
      font-size:.45rem;
      height:1.04rem;
      line-height: 1.04rem;
      text-align:center;
      border-radius:.18rem .18rem 0 0;
      &:before,&:after{
        position: absolute;
        content:'';
        width:1.24rem;
        height:1px;
        top:50%;
      }
      &:before{
        right:50%;
        margin-right: 1.2rem;
        background:linear-gradient(to right,#ffc57a,#fff);
      }
      &:after{
        left:50%;
        background:linear-gradient(to right,#fff,#ffc57a);
        margin-left: 1.2rem
      }
    }
    .tipInfo{
      position:absolute;
      width:100%;
      top:4.24rem;
      text-align:center;
      color:#666;
      left:0;
    }
    ul{
      padding:0 .4rem;
      width:8rem;
      height:7.67rem;
      overflow-y: auto;
      box-sizing: border-box;
      background: #fff;
      border-radius:0 0 .18rem .18rem;
      li{
        height:1.07rem;
        line-height: 1.07rem;
        border-bottom: 1px solid #e5e5e5;
        color:#666;
        font-size:.36rem;
      }
    }
  }
  .awardPop{
    width:6.93rem;
    margin:0 auto;
    background: #fff;
    border-radius:.27rem;
    text-align:center;
    padding-top: .8rem;
    padding-bottom: .67rem;
    position: relative;
    img{
      width:5.72rem;
    }
    p{
      line-height: 1.4;
      margin-top: 0.2rem;
      strong{
        display: block;
        font-weight: normal;
        color:#4b2a13;
        font-size:0.36rem;
      }
      span{
        color:#666;
        font-size:.32rem;
      }
    }
  }
  .iconfont.close{
    position: absolute;
    color:#fff;
    top:-0.7rem;
    right:0;
    font-size:.54rem;
  }
  .guide{
    background: #fff;
    width:9.47rem;
    border-radius:.27rem;
    margin: .6rem auto 0;
    box-sizing:border-box;
    padding:.77rem .29rem .53rem;
    color:#737373;
    font-size:.36rem;
    position: relative;
    &:before{
      content:'';
      display: block;
      width:6.97rem;
      margin:-1.22rem auto 0;
      height: .93rem;
      background: url(~assets/img/dh/zp/rope.png) no-repeat center top;
      background-size: 100% auto;
    }
    .guideCont{
      border:.04rem dashed #ff4600;
      border-radius:.27rem;
      padding:.27rem;
      margin-top: .13rem;
    }
  }
  #error{
    position: absolute;
    background: #f6f6f6;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:10;
    text-align:center;
    img{
      width:2rem;
      margin-top: 3.2rem;
    }
    p{
      color:#999;
      font-size:.4rem;
      margin-bottom: 1rem;
      margin-top: .27rem;
    }
    button{
      background: #fa5a5a;
      width: 3.33rem;
      height: 1.07rem;
      line-height: 1.07rem;
      font-size:.45rem;
      color:#fff;
      border:none;
      border-radius:5px;
    }
  }
}
</style>