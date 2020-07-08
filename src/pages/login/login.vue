<template>
<div class="box">
	 <div class="login">
		 <div class="login_haeder">
			坪山生活饮用水卫生在线监管系统
		 </div>
		 <div class="login_from">
			
			 <div class="name">
				<input class="input" type="text" v-model="form.username" placeholder="请输入用户名" placeholder-class="placeholder"/>
			 </div>
			<div class="name password">
				<input class="input" type="password" v-model="form.password" placeholder="请输入密码" placeholder-class="placeholder"/>
			 </div>
		 </div>
		 <div class="login_button" @click="sbmit">
			登录
		 </div>
		 
	 </div>
	 <image class="login_img" src="../../static/login.png" mode=""></image>
 </div>
</template>

<script>
 export default {
     data(){
         return{
             form:{
                 username:"",
                 password:"",
                 mobileLogin:true
             }
         }
     },
     onLoad(){
        
     },
     methods:{
         sbmit(){
			 uni.showLoading({
			 	title:"登录中"
			 })
            this.$api.login(this.form).then(res => {
				if(res.data.code == 0){
					uni.setStorage({
					key:"username",
					data:this.form.username
					})
					uni.reLaunch({url: '/pages/index/index'})
					uni.hideLoading()
				}
				
            }).catch(res => {
            　　// 失败进行的操作
            })
            

         }
         
     }
 }
</script>

<style scoped>
.box{
	position: relative;
}
.login{
    /* position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
    background-image: url(~@/static/img/login.png);
    background-size: cover;
    background-repeat: no-repeat; */
	width: 750upx;
	height: 1334upx;
	position: relative;
	z-index: 1;
}
.login_img{
	width: 750upx;
	height: 1334upx;
	position: absolute;
	top: 0px;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
}
.login_haeder{
    width: 528upx;
    height: 188upx;
    margin: 0 auto 0;
    font-family: PingFangSC-Semibold;
    font-size: 48upx;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    padding: 242upx 0 0 0;
}
.login_from{
    margin-top: 338upx;
}
.name{
    width: 540upx;
    height: 80upx;
    line-height: 80upx;
    border: 1px solid #ffffff;
    margin: 0 auto;
    border-radius: 40upx;
    padding: 0 0 0 40upx
}
.input{
    height: 80upx;
    line-height: 80upx;
    color: #FFFFFF;
}
.password{
    margin-top:32upx;
}
.login_button{
    width: 580upx;
    height: 86upx;
    line-height: 80upx;
    background-image: url(/static/login_button.svg);
    background-size: cover;
    background-repeat: no-repeat;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    margin: 40upx auto 0;
}
</style>