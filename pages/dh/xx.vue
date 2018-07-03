<template>
  <div class="page">
    <div class="animation">
      <em class="midBtn">寻找产品</em>
      <div class="inside">
        <span>{{sixHave.InsuranceInfo === 1 ? '有保单' : '无保单'}}</span>
        <span>{{Identity}}</span>
        <span>{{sixHave.HaveHouse === 1 ? '有房' : '无房'}}</span>
        <span>{{sixHave.Age}}岁</span>
      </div>
      <div class="outside">
        <span>{{sixHave.HaveCar === 1 ? '有车' : '无车'}}</span>
        <span>{{SalaryText}}</span>
        <span>{{SocialSecurityFundText[0]}}</span>
        <span>{{SocialSecurityFundText[1]}}</span>
      </div>
    </div>
    <p class="wait">请稍等...</p>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { Toast } from 'mint-ui'

export default {
  data() {
    return {
    }
  },
  async asyncData ( { app , req , error , store } ) {
    try {
      let sixHave = {
        // 身份
        Identity: 4,
        // 收入类型
        IncomeDistributionType: '工资收入',
        // 工资收入
        Salary:8000,
        // 社保公积金
        SocialSecurityFund: 4,
        // 有车
        HaveCar: 1,
        // 有房
        HaveHouse: 1,
        // 保单情况
        InsuranceInfo: 1,
        // 年龄
        Age: 32
      }
      return {
        sixHave
      }
    } catch (err) {
      console.log(err)
      error({ statusCode: 500 , message: 'Oops, An Error Occurred' })
    }
  },
  head () {
    return {
      title: '寻找产品'
    }
  },
  computed :{
    Identity() {
      let value
      switch (this.sixHave.Identity) {
        case 4:
          value = '工薪族'
          break
        case 1:
          value = '企业主'
          break
        case 2:
          value = '个体户'
          break
        case 8:
          value = '自由职业者'
          break
      }
      return value
    },
    SalaryText() {
      let value
      if (this.sixHave.IncomeDistributionType === 2) {
        value = '现金'
      } else {
        value = `月打卡<${this.sixHave.Salary || 3000}`
      }
      return value
    },
    SocialSecurityFundText() {
      let value = []
      switch (this.sixHave.SocialSecurityFund) {
        case 1:
          value = ['无公积金','无社保']
          break
        case 2:
          value = ['有公积金','有社保']
          break
        case 4:
          value = ['无公积金','有社保']
          break
        case 8:
          value = ['有公积金','无社保']
          break
      }
      return value
    }
  },
  mounted() {
  },
  methods : {

  }
}
</script>

<style scoped lang="scss" >
.page {
  height:100%;
  text-align: center;
  .animation{
    position: relative;
    width:9.41rem;
    height:9.41rem;
    margin: 2.73rem auto 0;
    background:url(~/assets/img/dh/xx/bg_xz.png) no-repeat center top;
    background-size:100% auto;
    .midBtn{
      width:1.87rem;
      height:1.87rem;
      border-radius: 100%;
      background: #fff;
      color:#f93c49;
      font-size:.51rem;
      border:#fccccc solid .08rem;
      box-shadow: 0 .17rem .11rem rgba(255,7,7,0.75);
      position: absolute;
      left:50%;
      top:50%;
      margin:-0.935rem 0 0 -0.935rem;
      box-sizing: border-box;
      padding:.26rem 0.1rem 0;
      line-height: 1.2;
      font-weight: bold;
    }
    .inside{
      position: absolute;
      box-sizing: border-box;
      border:1px solid #fdc0c3;
      border-radius: 100%;
      width:3.6rem;
      height:3.6rem;
      left:50%;
      top:50%;
      margin: -1.8rem 0 0 -1.8rem;
      animation:round 10s infinite linear;
      transform-origin:center center;
      span{
        animation:round_reverse 10s infinite linear;
        &:nth-child(1){
          left:5%;
          top:0;
        }
        &:nth-child(2){
          top:20%;
          right:-11%;
        }
        &:nth-child(3){
          bottom:15%;
          right:-8%;
        }
        &:nth-child(4){
          bottom:25%;
          left:-10%;
        }
      }
    }
    .outside{
      position: absolute;
      box-sizing: border-box;
      border:1px solid #fdc0c3;
      border-radius: 100%;
      width:6.87rem;
      height:6.87rem;
      left:50%;
      top:50%;
      margin: -3.435rem 0 0 -3.435rem;
      animation:round_reverse 10s infinite linear;
      transform-origin:center center;
      span{
        animation:round 10s infinite linear;
        &:nth-child(1){
          left:0;
          top:20%;
        }
        &:nth-child(2){
          top:20%;
          right:-5%;
        }
        &:nth-child(3){
          bottom:20%;
          right:-5%;
        }
        &:nth-child(4){
          bottom:30%;
          left:-7%;
        }
      }
    }
    span{
      position: absolute;
      font-size:.32rem;
      color:#fff;
      background: #fe7976;
      height: .43rem;
      line-height: .43rem;
      padding:0 0.2rem;
      border-radius: .43rem;
      box-shadow: 0 .03rem .09rem rgba(255,7,7,0.5);
      transform-origin:center center;
      transform:translate(-50% -50%);
    }
  }
  .wait{
    margin-top: .53rem;
    font-size:.4rem;
    color:#fa4f38;
  }
}
@keyframes round{
  from {transform: rotate(0)}
  to {transform: rotate(360deg)}
}
@keyframes round_reverse{
  from {transform: rotate(0)}
  to {transform: rotate(-360deg)}
}
</style>
