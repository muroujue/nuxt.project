<template>
    <div class="ly2-container">
        <div v-show="canvasFlag" class="headerBox">
            <h5>完善度会极大影响</h5>
            <h4>您的放款成功率</h4>
            <div class="canvasBox">
                <canvas id="canvas"></canvas>
            </div>
        </div>
        <div class="container">
            <div v-show="isTextShowFlagNew" class="bigTitle" v-html="warningText"></div>
            <h4 v-show="shouFlag && canvasFlag" class="bigTitle">非常
                <span class="shou1"></span>
                <span class="shou2"></span>完美</h4>
            <div class="chooseArea" v-for="(listData,index) in asssHtmlData" :key="index">
                <ul class="list">
                    <li class="item" @click="clickIDTypeOK(listData,listData.type,item,index,$event)" :class="{'active': item.isChecked}" v-for="(item,index) in listData.list" :key="index">{{item.name}}</li>
                </ul>
                <div class="borderImage"></div>
            </div>
            <div class="dongAge">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item,index) in age" :key="index">{{item}}
                            <span v-show="swiperIndexActive == index">岁</span>
                        </div>
                    </div>
                    <!-- 如果需要导航按钮 -->
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '~/plugins/axios'
import CircleProgress from '~/plugins/jdCanvas.js'
import Swiper from '~/node_modules/swiper/dist/js/swiper.min.js'
import '~/node_modules/swiper/dist/css/swiper.min.css'
import { Popup } from 'mint-ui'
export default {
    head() {
        return {
            title: '进度Canvas'
        }
    },
    async asyncData({ app, req, error, store }) {
        try {
            let loanAmount
            let applyUserInfor = {
                Identity : 4,
                IncomeDistributionType : [],
                Salary : null,
                SocialSecurityFund : null,
                HaveCar : null,
                HaveHouse : null,
                InsuranceInfo : null,
                Age : 30,
                UseLoanCity : null
            }
            // 前台展示数据封装
            let sixToHtmlData = {
                "salaryAndType": "",
                "SocialSecurityFund": "",
                "isHaveCarAndHouse": "",
                "InsuranceInfo": "",
                "Age": ""
            }
            let assessHtmlData = [
                {
                    "title": "月均打卡",
                    "type": "salaryAndType",
                    "nextClick": true,
                    "list": [
                        {
                            "name": "打卡工资2千",
                            "val": 2000,
                            "isChecked": false
                        },
                        {
                            "name": "3千",
                            "val": 3000,
                            "isChecked": false
                        },
                        {
                            "name": "4千",
                            "val": 4000,
                            "isChecked": false
                        },
                        {
                            "name": "5千",
                            "val": 5000,
                            "isChecked": false
                        },
                        {
                            "name": "更多",
                            "val": 6000,
                            "isChecked": false
                        },
                        {
                            "name": "现金",
                            "val": 2,
                            "isChecked": false
                        }
                    ]
                },
                {
                    "title": "社保公积金",
                    "nextClick": true,
                    "type": "SocialSecurityFund",
                    "list": [
                        {
                            "name": "都有",
                            "val": 2,
                            "isChecked": false
                        },
                        {
                            "name": "仅社保",
                            "val": 4,
                            "isChecked": false
                        },
                        {
                            "name": "仅公积金",
                            "val": 8,
                            "isChecked": false
                        },
                        {
                            "name": "都没有",
                            "val": 1,
                            "isChecked": false
                        }
                    ]
                },
                {
                    "title": "资产状况",
                    "nextClick": true,
                    "type": "isHaveCarAndHouse",
                    "list": [
                        {
                            "name": "有房有车",
                            "isChecked": false,
                            "val": 1
                        },
                        {
                            "name": "仅有房",
                            "isChecked": false,
                            "val": 2
                        },
                        {
                            "name": "仅有车",
                            "isChecked": false,
                            "val": 3
                        },
                        {
                            "name": "都没有",
                            "isChecked": false,
                            "val": 4
                        }
                    ]
                },
                {
                    "title": "寿险保单",
                    "nextClick": true,
                    "type": "InsuranceInfo",
                    "list": [
                        {
                            "name": "有寿险保单",
                            "val": 1,
                            "isChecked": false
                        },
                        {
                            "name": "无寿险保单",
                            "val": 2,
                            "isChecked": false
                        }
                    ]
                }
            ]
            for (let i = 0; i < assessHtmlData.length; i++) {
                for (let k in sixToHtmlData) {
                    if (k == assessHtmlData[i].type) {
                        for (let j = 0; j < assessHtmlData[i].list.length; j++) {
                            if (assessHtmlData[i].list[j].val == sixToHtmlData[k]) {
                                assessHtmlData[i].list[j].isChecked = true;
                            }
                        }
                    }
                }
            }

            let canvasStep = 0
            for (let t in sixToHtmlData) {
                if (t != "Age") {
                    if (sixToHtmlData[t]) {
                        canvasStep++
                    }
                }
            }
            let warningText = "提升<span style='color: #ffc4bf;font-size: .506667rem;font-weight: 600'>完善度</span>，只需点几下"
            let isTextShowFlagNew = true
            let shouFlag = false
            if (canvasStep == 1) {
                warningText = "这还不够，继续提升放款成功率";
            } else if (canvasStep == 2) {
                warningText = "继续点击，提升更多放款成功率";
            } else if (canvasStep == 3) {
                warningText = "再点一个，马上提升放款成功率";
            } else if (canvasStep == 4) {
                // this.warningText = "恭喜您，您的完善度已提升";
                isTextShowFlagNew = false;
                shouFlag = true;
            } else {
                warningText = "提升<span style='color: #ffc4bf;font-size: .506667rem;font-weight: 600'>完善度</span>，只需点击下";
            }
            return {
                swiperIndexActive: 0,
                applyInfor: sixToHtmlData,
                postData: applyUserInfor,
                mySwiper: "",
                canvasStep: canvasStep,
                age: [],
                loanAmount:loanAmount,
                liuchengFlag: false,
                isTextShowFlagNew: isTextShowFlagNew,
                shouFlag: shouFlag,
                canvasFlag: true,
                canvas: null,
                title: "极速贷款",
                popupVisible: false,
                warningText: warningText,
                canvasOption: {
                    radius: parseInt(300 / 2.5),
                    arcBackColor: "#ffb9ac",
                    arcLineWidth: 4,
                    scaleColor: '#ffb9ac',
                    activeColor: '#fff',
                    //刻度字体
                    scaleFont: '12px "microsoft yahei"',
                    //等级字体
                    gradeFont: 'bold 24px "microsoft yahei"',
                    //提示字体
                    tipFont: "12px 'microsoft yahei'",
                    scales: [
                        {
                            degree: 10,
                            text: '极低'
                        },
                        {
                            degree: 40,
                            text: '较低'
                        },
                        {
                            degree: 90,
                            text: '中等'
                        },
                        {
                            degree: 140,
                            text: '较好'
                        },
                        {
                            degree: 170,
                            text: '很好'
                        }
                    ]
                },
                asssHtmlData: assessHtmlData
            }
        } catch (err) {
            console.log(err)
            error({ statusCode: 500, message: 'Oops, An Error Occurred' })
        }
    },
    mounted() {
        for (let i = 0; i <= 100; i++) {
            this.age.push(i);
        }
        this.$nextTick(() => {
            this.mySwiper = new Swiper('.swiper-container', {
                direction: "horizontal",
                slidesPerView: 6,
                spaceBetween: 0,
                loop: false,
                initialSlide: this.postData.Age || 30,
                centeredSlides: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            })
        })
        this.canvas = new CircleProgress(document.getElementById('canvas'), this.canvasOption);
        this.isNumberReturnText(this.canvasStep);
        this.canvas.step = this.canvasStep;
        this.canvas._speed();
    },
    watch: {
        'mySwiper.activeIndex'(val) {
            this.swiperIndexActive = val;
            if (val <= 15) {
                this.postData.Age = 15;
            } else if (val >= 70) {
                this.postData.Age = 70;
            } else {
                this.postData.Age = val;
            }
        }
    },
    methods: {
        isPopupVisible(data) {
            this.popupVisible = false;
        },
        next() {
            this.canvas._run();
        },
        isNumberReturnText(num) {
            if (num == 1) {
                this.warningText = "这还不够，继续提升放款成功率";
            } else if (num == 2) {
                this.warningText = "继续点击，提升更多放款成功率";
            } else if (num == 3) {
                this.warningText = "再点一个，马上提升放款成功率";
            } else if (num == 4) {
                // this.warningText = "恭喜您，您的完善度已提升";
                this.isTextShowFlagNew = false;
                this.shouFlag = true;
            } else {
                this.warningText = "提升<span style='color: #ffc4bf;font-size: .506667rem;font-weight: 600'>完善度</span>，只需点击下";
            }
        },
        isCheckTrueOrFalse(type) {
            for (var i = 0; i < this.asssHtmlData.length; i++) {
                if (this.asssHtmlData[i].type == type) {
                    for (var j = 0; j < this.asssHtmlData[i].list.length; j++) {
                        if (this.asssHtmlData[i].list[j].isChecked == true) {
                            this.asssHtmlData[i].nextClick = false;
                            this.asssHtmlData[i].list[j].isChecked = false;
                        }
                    }
                }
            }
        },
        clickIDTypeOK(list, type, item, index, event) {
            this.isCheckTrueOrFalse(type);
            var Y = event.offsetY + event.pageY;
            window.scrollTo(0, Y);
            switch (type) {
                case "salaryAndType":
                    item.isChecked = true;
                    if (list.nextClick) {
                        this.next();
                    }
                    this.isNumberReturnText(this.canvas.step);
                    if (index == 0 || index == 1 || index == 2 || index == 3 || index == 4) {
                        this.postData.Salary = item.val;
                        if (this.postData.IncomeDistributionType.indexOf('1') === -1){
                            this.postData.IncomeDistributionType.push('1');
                        }
                    } else {
                        if (this.postData.IncomeDistributionType.indexOf('8') === -1){
                            this.postData.IncomeDistributionType.push('8');
                        }
                    }
                    break;
                case "isHaveCarAndHouse":
                    item.isChecked = true;
                    if (list.nextClick) {
                        this.next();
                    }
                    this.isNumberReturnText(this.canvas.step);
                    if (index == 0) {
                        this.postData.HaveHouse = 1;
                        this.postData.HaveCar = 1;
                    } else if (index == 1) {
                        this.postData.HaveHouse = 1;
                        this.postData.HaveCar = 2;
                    } else if (index == 2) {
                        this.postData.HaveHouse = 2;
                        this.postData.HaveCar = 1;
                    } else {
                        this.postData.HaveHouse = 2;
                        this.postData.HaveCar = 2;
                    }
                    break;
                case "Age":
                    item.isChecked = true;
                    this.postData.Age = item.val;
                    break;
                case "SocialSecurityFund":
                    item.isChecked = true;
                    if (list.nextClick) {
                        this.next();
                    }
                    this.isNumberReturnText(this.canvas.step);
                    this.postData.SocialSecurityFund = item.val;
                    break;
                case "InsuranceInfo":
                    item.isChecked = true;
                    if (list.nextClick) {
                        this.next();
                    }
                    this.isNumberReturnText(this.canvas.step);
                    this.postData.InsuranceInfo = item.val;
                    break;
                default:
            }
        }
    },
    beforeDestroy () {
        Bus.$off('HEADER_LEFT_BUTTON_CLICK_EVENT')
    }
}
</script>
<style scoped lang="scss">
.ly2-container {
    .headerBox {
        padding-top: 40px;
        overflow: hidden;
        width: 100%;
        height: 5.746667rem;
        background: url("~/assets/img/dh/jd/headbeijing.png") no-repeat center center;
        background-size: cover;
        position: relative;
        h5,
        h4 {
            text-align: center;
            font-weight: bold;
        }
        h5 {
            margin-top: .533333rem;
            margin-bottom: .133333rem;
            font-size: .48rem;
            color: #ff9a8f;
        }
        h4 {
            font-size: .546667rem;
            color: #fff;
        }
        .canvasBox {
            position: absolute;
            box-sizing: border-box;
            width: 100%;
            height: 2.933333rem;
            padding: 0 2rem;
            bottom: .4rem;
            #canvas {
                width: 100%;
                height: 100%;
            }
        }
    }
    .container {
        box-sizing: border-box;
        padding: 0 .466667rem;
        .chooseArea {
            margin-bottom: .266667rem;
            .title {
                font-size: .373333rem;
                color: #b3b3b3;
                font-weight: 500;
                margin-bottom: .4rem;
            }
            .list {
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .item {
                    flex: 1;
                    text-align: center;
                    color: #333333;
                    font-weight: 600;
                    height: 1.066667rem;
                    line-height: 1.066667rem;
                    font-family: "PingFang SC";
                    font-size: .32rem;
                    padding: 0 .2rem;
                    margin-right: .18rem; // padding: .22rem .18rem;
                    border: 1px solid #e5e5e5;
                    border-radius: .48rem;
                    white-space: nowrap;
                    &:last-child {
                        margin-right: 0;
                    }
                    &.active {
                        background-color: #fff;
                        color: #ff4b42;
                        border-color: #ff9a8f;
                        font-weight: 600;
                    }
                }
            }
            .borderImage {
                width: 100%;
                height: .16rem;
                margin-top: .266667rem;
                background: url('~/assets/img/dh/jd/line.png') no-repeat center center;
                background-size: cover;
            }
        }
        .bigTitle {
            margin-top: .373333rem;
            color: #ff4b42;
            text-align: center;
            font-size: .506667rem;
            font-weight: 600;
            margin-top: .533333rem;
            margin-bottom: .613333rem;
            .danse {
                color: #ffc4bf;
                font-size: .506667rem;
                font-weight: 600;
            }
            .shou1 {
                display: inline-block;
                width: .36rem;
                height: .573333rem;
                background: url("~/assets/img/dh/jd/show2.png") no-repeat center center;
                background-size: cover;
                margin-right: .16rem;
                margin-left: .24rem;
            }
            .shou2 {
                display: inline-block;
                width: .36rem;
                height: .573333rem;
                background: url("~/assets/img/dh/jd/shou1.png") no-repeat center center;
                background-size: contain;
                margin-right: .24rem;
            }
        }
        .dongAge {
            height: 1.066667rem;
            line-height: 1.066667rem;
            border: 1px solid #e5e5e5;
            border-radius: .666667rem;
            padding-left: .8rem;
            padding-right: .8rem;
            position: relative;
            margin-bottom: .2rem;
            .swiper-container {
                width: 100%;
                height: 100%;
                position: static;
            }
            .swiper-button-next,
            .swiper-button-prev {
                position: absolute;
                width: .8rem;
                height: .4rem;
                margin-top: 0;
                outline: none;
            }
            .swiper-button-prev {
                background: url('~/assets/img/dh/jd/prev.png') no-repeat center center;
                background-size: contain;
                left: .246667rem;
                top: 50%;
                right: auto;
                transform: translateY(-50%);
            }
            .swiper-button-next {
                background: url('~/assets/img/dh/jd/next.png') no-repeat center center;
                background-size: contain;
                right: .246667rem;
                top: 50%;
                left: auto;
                transform: translateY(-50%);
            }
            .swiper-slide {
                text-align: center;
                color: #dadada;
            }
            .swiper-slide-prev {
                color: #999999;
            }
            .swiper-slide-active {
                color: #e62117;
            }
            .swiper-slide-next {
                color: #999999;
            }
        }
        .btnList {
            text-align: center;
            margin-top: .8rem;
            margin-bottom: .4rem;
            // .btn1,
            // .btn2 {
            //     display: inline-block;
            //     padding: .186667rem .906667rem;
            //     border-radius: .08rem;
            //     color: #fff;
            //     -moz-appearance: none;
            //     -webkit-appearance: none;
            //     border-style: none;
            //     border: none;
            //     outline: none;
            //     font-weight: 500;
            //     font-size: .426667rem;
            // }
            .btn1 {
                padding: .186667rem .906667rem;
                border-radius: .08rem;
                color: #fff;
                -moz-appearance: none;
                -webkit-appearance: none;
                border-style: none;
                border: none;
                outline: none;
                font-weight: 500;
                font-size: .426667rem;
                background-color: #e62117;
                &.unActive {
                    background-color: #999999;
                    color: #fff;
                }
            }
            // .btn2 {
            //     background-color: #fff;
            //     border: 1px solid #e62117;
            //     color: #e62117;
            //     font-weight: 500;
            //     &.unActive {
            //         background-color: #fff;
            //         color: #999999;
            //         border: 1px solid #e5e5e5;
            //     }
            // }
            .infoText {
                margin-top: .106667rem;
                text-align: center;
                font-size: .373333rem;
            }
        }
        .btnList2 {
            text-align: center;
            margin-top: .8rem;
            margin-bottom: .4rem;
            .btn1 {
                padding: .186667rem .906667rem;
                border-radius: .08rem;
                color: #fff;
                -moz-appearance: none;
                -webkit-appearance: none;
                border-style: none;
                border: none;
                outline: none;
                font-weight: 500;
                font-size: .426667rem;
                background-color: #e62117;
                &.unActive {
                    background-color: #999999;
                    color: #fff;
                }
            }
        }
    }
    /deep/ .mint-popup{
        background:transparent;
    }
    .xeCredit{
        width:8rem;
        height:9.33rem;
        background: #fff;
        border-radius: 0.1rem;
        /deep/ li{
            &:first-child{
                border-bottom: 1px solid #cdcdcd;
                padding: 1.07rem 0 .4rem;
            }
            &:last-child{
                padding: 0.4rem 0 1.07rem;
            }
        }
    }
}
</style>