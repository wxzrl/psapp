<template>
 <div>
    <view class="header_img">
		<image src="../../static/me_header.png" mode=""></image>
    	<view class="imega">
			<image style="border-radius: 50%;" :src="images" mode=""></image>
		</view>
    </view>
	<view class="center_word">
		<span class="words">姓名</span>
		<span class="words" style="float: right;">{{name}}</span>
	</view>
	<view class="center_word">
		<span class="words">职位</span>
		<span class="words" style="float: right;">{{remarks}}</span>
	</view>
	<navigator :url="'/pages/record_list/index'">
		<view class="center_word">
			<span class="words">预警通知</span>
			<span class="arrowUp" style="float: right;"></span>
		</view>
	</navigator>
	<view class="center_word">
		<span @click="loginout" class="words">退出登录</span>
	</view>
 </div>
</template>

<script>
 export default {
	 data(){
		 return{
			 loginName:"",
			 name:"",
			 remarks:"",
			 images:""
		 }
	 },
	onLoad() {
		var _this =this
		uni.getStorage({
		key:"username",
		success(e){
			console.log(e)
		_this.loginName = e.data//这就是你想要取的token
			_this.$api.findUserInfo({loginName:_this.loginName}).then(res=>{
				if(res.data.code==0){
					_this.name = res.data.user.name;
					_this.remarks = res.data.user.remarks;
					let url_config = "";
					if(process.env.NODE_ENV === 'development'){
					    // 开发环境
					    url_config = 'http://192.168.1.7:8182/'
					}else{
					    // 生产环境
					    url_config = 'http://wqms.joyue-tech.com/'
					}
					_this.images = url_config + res.data.user.photo;
					uni.setStorage({
						key:"phone",
						data:res.data.user.mobile
					})
				}
			})
			}
		})
	},
	methods:{
		loginout(){
			this.$api.logout().then(res=>{
				if(res.data.code == 0){
					uni.reLaunch({url: '/pages/login/login'})
				}
			})
		}
	}
 }
</script>

<style scoped>
.header_img{
	width: 750upx;
	height: 360upx;
	position: relative;
}
.header_img image{
	width: 100%;
	height: 100%;
}
.imega{
	width: 140upx;
	height: 140upx;
	margin: 0 auto;
	border-radius: 50%;
	background-color: #FFFFFF;
	position: absolute;
	top: calc(50% - 70upx);
	left: calc(50% - 70upx);
}
.center_word{
	width: 710upx;
	height: 60upx;
	line-height: 60upx;
	padding: 20upx;
}
.center_word .words{
	font-family: PingFangSC-Regular;
	font-size: 16px;
	color: #142133;
	letter-spacing: 0;
	line-height: 20px;
}
.cenrer_icon{
　　position: relative;
}
.cenrer_icon::before{
　　content:"";
　　width:0;
　　height:0;
　　position: absolute;
　　top: 34px;
　　left: 100px;
　　border-top:solid 15px transparent;
　　border-left:solid 15px black ;
　　border-bottom:solid 15px transparent;
}
.arrowUp:after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-top: 1px solid #656565;
    border-right: 1px solid #656565;
    transform: rotate(45deg);
}
</style>