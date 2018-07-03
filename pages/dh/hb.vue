<template>
	<div id="hongbao" :class="{hb_open:isOpening,hb_open_more:isLiVisible}">
		<header>
			<p class="logo"><img src="~assets/img/dh/hb/logo.png" alt=""></p>
		</header>
		<section>
			<div id="redPacket" :class="{rp_animation:isOpening}">
				<div class="rp-back" :class="{back_animation:isOpening}"></div>
				<div class="rp-card" :class="{card_animation:isOpening}"><img src="~assets/img/dh/hb/rp_card.png" alt=""></div>
				<div class="rp-front"></div>
				<div class="rp-cover" :class="{cover_animation:isOpening}"><img src="~assets/img/dh/hb/rp_cover.png" alt=""></div>
				<div class="rp-seal" :class="{seal_animation:isOpening}"><img src="~assets/img/dh/hb/rp_seal.png" alt=""></div>
			</div>
			<div class="beforeOpen" v-show="!isOpening">
				<p>恭喜你获得1个神秘红包</p>
				<div class="openBtn" @click="openRedPacket">立即拆开</div>
			</div>
			<transition name="fade">
				<div class="apply-box" v-show="applyShow">
					<div class="range">
						<p class="range-value" :style="{marginLeft:((amount) / 10) + 'rem' }">
							借款<strong>{{userData.LoanMoney}}</strong>万
						</p>
						<mt-range v-model="amount" :min="0" :max="50" :step="1"></mt-range>
						<div class="scale"><span class="fl">0万</span><span class="fr">50万</span></div>
					</div>
					<ul class="apply-form" v-show="noLoginUser">
						<li>
							<input type="tel" class="txt2" id="phone" maxlength="11" :placeholder="telholder" v-model="userData.CellPhoneNumber">
						</li>
						<li v-show="isLiVisible">
							<input type="tel" class="txt2" id="yzm" maxlength="4" :placeholder="imgCodeholder" v-model="CmsVertify">
							<div class="refresh-code"><img id="codeImg" @click="refreshRandom"><i class="icon iconfont" @click="refreshRandom">&#xe61a;</i></div>
						</li>
						<li v-show="isLiVisible">
							<input type="tel" class="txt1" id="msg" maxlength="6" :placeholder="smsCodeholder" v-model="userData.SmsCode"><button class="getyzm" @click="sendSmsCode" :disabled="isTiming">{{yzmTime}}</button>
						</li>
					</ul>
					<p class="apply-btn">{{buttonText}}</p>
				</div>
			</transition>
		</section>
	</div>
</template>

<script>
// import vCitySelect from '../components/CitySelect'
// import { mapState } from 'vuex'
import { Indicator,Toast } from 'mint-ui'
export default {
	data() {
		return {
			cityPopupVisible:false,
			isOpening:false,  //红包正在打开
			applyShow:false,  //申请区域是否显示
			noLoginUser:true,
			amount:50,
			// nameholder:'你的姓名',
			telholder:'手机号码',
			imgCodeholder:'图形验证码',
			smsCodeholder:'短信验证码',
			random: Math.round(Math.random() * 10000),
			yzmTime:'点击获取',
			isLiVisible:false,
			isTiming:false,
			validateImage:'/api/Account/ValidateImage',
			buttonText:'立即获得',
			CmsVertify: '',
			userData: {
				cityName: '',
				cityID: '',
				cityQuanPin:'',
                UserName: '用户',
                LoanMoney: 50,
				Gender: 1,
				Identity: '',
                CellPhoneNumber: '',
                SmsCode: '',
				RegisterSource:50
            }
		}
	},
	components: {
		// vCitySelect
	},
	mounted(){
	},
	watch: {
		// 监控贷款金额
		'amount': function (val) {
			this.userData.LoanMoney = val;
			if (val < 1) {
				this.amount = 1;
				return;
			}
		},
		// 监控输入手机号位数，11位时显示下面2个表单
		'userData.CellPhoneNumber': function (val) {
			let telReg = /^\d{11}$/;
            if( telReg.test(val) ){
				// 刷新图形验证码
				this.refreshRandom();
                this.isLiVisible = true;
                setTimeout(()=>{
                    this.$el.querySelector('#yzm').focus();
                },0)
            }
		},
		// 监控登录状态
		noLoginUser: function(val) {
			// if(val){
			// 	this.nextLink = window.location.protocol + '//' + this.gConfig.mDomain + '/Assessment/assessStep1?urlFlag=1'
			// }else{
			// 	this.nextLink = window.location.protocol + '//' + this.gConfig.mDomain + '/Assessment/AssessStep2?urlFlag=1'
			// }
			this.nextLink = window.location.protocol + '//' + this.gConfig.mvDomain + '/cp/ly'
		}
	},
	methods: {
		// 弹出城市选择框
		selectCity() {
            this.cityPopupVisible = true
		},
		// 拆红包
		openRedPacket() {
			this.isOpening = true;
			setTimeout(() => {
				this.applyShow = true;
			},1000);
			setTimeout(() => {
				document.body.scrollTop = document.documentElement.scrollTop = '1000';
			},1300);
		},
		// 切换性别
		// toggleGender() {
		// 	this.userData.Gender = this.userData.Gender === 1 ? 2 : 1
		// },
		// 刷新验证码
		refreshRandom() {
			this.random = Math.round(Math.random() * 10000);
		},
		// 获取短信验证码倒计时
		runTime() {
			this.isTiming = true;
			this.countDown();
		},
		// 短信验证码倒计时
		countDown() {
			let seconds = 60;
			this.yzmTime = seconds + 's';
			let timer = setInterval(()=>{
				seconds --;
				this.yzmTime = seconds + 's';
				if(seconds==0){
					this.yzmTime = '重新获取';
					this.isTiming = false;
					this.refreshRandom();
					clearInterval(timer);
				}
			},1000)
		},
		// 发送短信验证码
		sendSmsCode(){
		}
	}
}
</script>

<style scoped lang="scss">
#hongbao{
	position: relative;
	background: #3f3c51 url(~assets/img/dh/hb/bg_cd.png) no-repeat center 1.07rem;
	background-size:100% auto;
	height:100vh;
	&.hb_open{
		height:18.89rem;
	}
	&.hb_open_more{
		height:19.97rem;
		section{
			#redPacket{
				div{
					&.rp-front{
						height:9rem;
					}
				}
			}
		}
	}
	header{
		position: relative;
		.logo{
			padding:.4rem 0 0 .4rem;
			box-sizing: border-box;
			img{
				width:2.67rem;
				height:auto;
				vertical-align: top;
			}
		}
	}
	section{
		position: relative;
		text-align: center;
		#redPacket{
			position: absolute;
			width:100%;
			left:0;
			top:0;
			div{
				position: absolute;
				width:100%;
				&.rp-back{
					// top:2.08rem;
					top:1.61rem;
					height:9.8rem;
					overflow: hidden;
					background: #e24332;
					border-radius: .4rem;
					width:8.71rem;
					left:.65rem;
				}
				&.rp-front{
					top:4.9rem;
					width:8.71rem;
					height:7.6rem;
					left:.65rem;
					background: #ff5e4c;
					border-radius:0 0 .4rem .4rem;
					&:before{
						content:'';
						display: block;
						background: url(~assets/img/dh/hb/rp_front.png) no-repeat center top;
						background-size:100% auto;
						height: 2.2rem;
						margin-top:-2.1rem;
					}
				}
				&.rp-cover{
					top:1.61rem;
					img{
						width:8.89rem;
						height:3.23rem;
					}
				}
				&.rp-seal{
					top:3.26rem;
					img{
						width:2.41rem;
						height:2.43rem;
					}
				}
				&.rp-card{
					top:4.7rem;
					opacity: 0;
					height:7.5rem;
					overflow: hidden;
					img{
						width:7.75rem;
						height:8rem;
					}
				}
			}
		}
		.beforeOpen{
			position: relative;
			z-index:2;
			color:#fff;
			font-size:.4rem;
			padding-top: 8.1rem;
			.openBtn{
				width: 7.33rem;
				height: 1.31rem;
				padding-top:.33rem;
				background: #ffd73b;
				border-radius: 1.31rem;
				margin: .33rem auto 0;
				font-size: .48rem;
				color:#f2331d;
				box-shadow: 0 .11rem .11rem rgba(196,37,20,0.5);
				-webkit-animation: 1s linear 0.5s infinite pulse;
				animation: 1s linear 0.5s infinite pulse;
				box-sizing: border-box;
			}
		}
		.apply-box{
			padding-top:8.67rem;
			width:7.36rem;
			margin:0 auto;
			position: relative;
			.range{
				.range-value{
					color:#fff;
					font-size:.45rem;
					font-weight: bold;
					line-height: 1;
					text-align: left;
					margin-bottom:.2rem;
					strong{
						color:#fff600;
						font-size: .8rem;
						vertical-align: -.05rem;
					}
				}
				.scale{
					color:#fff;
					font-size:.32rem;
					font-weight:bold;
					&:after{
						display:block;
						clear:both;
						content:'';
					}
					.fl{
						float:left;
					}
					.fr{
						float:right;
					}
				}
			}
			.apply-form{
				margin-top:.53rem;
				text-align: left;
				font-size:.4rem;
				li{
					position: relative;
					margin-bottom:.27rem;
					input{
						height:.93rem;
						line-height: .53rem;
						font-size:.4rem;
						box-sizing: border-box;
						padding:.2rem .27rem;
						border-radius: 0;
						&.txt1{
							width:4.93rem;
						}
						&.txt2{
							width:100%;
						}
					}
					// .gender-box{
					// 	position: absolute;
					// 	right:0;
					// 	top:0;
					// 	color:#fff;
					// 	&:after{
					// 		display:block;
					// 		clear:both;
					// 		content:'';
					// 	}
					// 	a{
					// 		float:left;
					// 		width:1.07rem;
					// 		height:.93rem;
					// 		background: #ff6e5e;
					// 		text-align: center;
					// 		line-height: .93rem;
					// 		&.active{
					// 			background: #ffbe00;
					// 		}
					// 	}
					// }
					.refresh-code{
						position: absolute;
						right:0;
						top:0;
						height:0.93rem;
						padding-right: .13rem;
						display:flex;
						justify-content:center;
						align-items:center;
						.icon{
							color: #999;
							font-size: 24px;
						}
					}
					.getyzm{
						position: absolute;
						height:.93rem;
						line-height: .53rem;
						box-sizing: border-box;
						padding:.2rem 0;
						right:0;
						top:0;
						width:2.13rem;
						background: #ffbe00;
						border:none;
						color:#fff;
						font-size: .4rem;
						white-space:nowrap;
					}
				}
			}
			.apply-btn{
				width:7.36rem;
				height:.93rem;
				background: #ffbe00;
				color:#fff;
				font-size:.4rem;
				font-weight: bold;
				line-height:.95rem;
				margin-top:.53rem;
			}
		}
	}
}
@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}
@-webkit-keyframes pulse {
  from {
    -webkit-transform: scale3d(1, 1, 1);
  }

  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    -webkit-transform: scale3d(1, 1, 1);
  }
}
.seal_animation{
	-webkit-animation:sealNone 0.1s 0.4s both linear;
	animation:sealNone 0.1s 0.4s both linear;
}
@keyframes sealNone {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}
@-webkit-keyframes sealNone {
	from {
		opacity: 1;
	}
	to {
		opacity: 0;
	}
}
.cover_animation{
	transform-origin:center top;
	-webkit-animation: coverOpen 0.1s 0.4s both linear;
	animation: coverOpen 0.1s 0.4s both linear;
}
@keyframes coverOpen {
	0% {
		-webkit-transform: rotateX(0);
		transform: rotateX(0);
	}
	50% {
		-webkit-transform: rotateX(45deg);
		transform: rotateX(45deg);
	}
	90% {
		-webkit-transform: rotateX(75deg);
		transform: rotateX(75deg);
	}
	100% {
		-webkit-transform: rotateX(90deg);
		transform: rotateX(90deg);
	}
}
@-webkit-keyframes coverOpen {
	0% {
		-webkit-transform: rotateX(0);
		transform: rotateX(0);
	}
	50% {
		-webkit-transform: rotateX(45deg);
		transform: rotateX(45deg);
	}
	90% {
		-webkit-transform: rotateX(75deg);
		transform: rotateX(75deg);
	}
	100% {
		-webkit-transform: rotateX(90deg);
		transform: rotateX(90deg);
	}
}
.card_animation{
	opacity: 1!important;
	-webkit-animation: cardMove 0.2s 0.6s both ease-in;
	animation: cardMove 0.2s 0.6s both ease-in;
}
@keyframes cardMove {
	0% {
		top:4.7rem;
	}
	100% {
		top:-2.18rem;
	}
}
@-webkit-keyframes cardMove {
	0% {
		top:4.7rem;
	}
	100% {
		top:-2.18rem;
	}
}
.rp_animation{
	-webkit-animation: rpMove 0.2s 0.2s both linear;
	animation: rpMove 0.2s 0.2s both linear;
}
@keyframes rpMove {
	0% {
		top:0;
	}
	100% {
		top:3.22rem;
	}
}
@-webkit-keyframes rpMove {
	0% {
		top:0;
	}
	100% {
		top:3.22rem;
	}
}
.back_animation{
	-webkit-animation: backMove 0.2s 0.5s both linear;
	animation: backMove 0.2s 0.5s both linear;
}
@keyframes backMove {
	0% {
		top:1.61rem;
	}
	100% {
		top:-1.11rem;
	}
}
@-webkit-keyframes backMove {
	0% {
		top:1.61rem;
	}
	100% {
		top:-1.11rem;
	}
}
.fade-enter-active{
	-webkit-transition: opacity .5s;
    transition: opacity .5s;
}
.fade-enter{
  opacity: 0;
}
</style>