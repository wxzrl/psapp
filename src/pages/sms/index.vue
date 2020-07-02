<template>
 <div>
    <div class="form_box">
        <div class="form">
            <p class="form_word"> 
			监测点名称：</p>
            <input disabled v-model="from.monitoringPointName" type="text" class="form_input" placeholder="暂无">
            <p class="form_word"> 发送短信的时间：</p>
            <input disabled v-model="from.sendTime" type="text" class="form_input" placeholder="暂无">
			<p class="form_word"> 负责人：</p>
			<input disabled v-model="from.chargePerson" type="text" class="form_input" placeholder="暂无">
			<p class="form_word"> 短信内容：</p>
			<input disabled v-model="from.smsContent" type="text" class="form_input" placeholder="暂无">
           
        </div>
    </div>
	<div class="smbit" >
	    <p class="form_button" @click="back">
	        返回
	    </p>
	</div>
 </div>
</template>

<script>
 export default {
     data() {
        return {
            from:{
				monitoringPointName:"",      // 监测点名称
				sendTime:"",    // 发送短信的时间
				chargePerson:"",      // 负责人
				smsContent:""   // 短信内容
			}
        }
    },
	onLoad(option){
		this.$api.findWarnSmsByLogId({warnLogId:option.id}).then(res=>{
			if(res.data.code == 0){
				this.from = res.data.list[0]
			}
		})
	},
	computed: {
		
	},
    methods:{
		back(){
			uni.navigateTo({
				url:"/pages/record_list/index"
			})
		}
    }
    
 }
</script>

<style scoped>
.select{
    width: 72%;
    display: inline-block;
    vertical-align: middle;
}
.box{
    padding: 20upx 0;
    background-color: #f8f8f8;
}
.rinse_box{
    width: 704upx;
    height: 170upx;
    margin: 0 auto;
    background-color: #fff;
}
.rinse{
    height: 78upx;
    line-height: 78upx;
    font-family: PingFangSC-Regular;
    font-size: 28upx;
    color: #4A4A4A;
    letter-spacing: 0;
    border-bottom: 1px solid #d5d5d5;
}

.input_rinse{
    text-align: right;
    font-size: 28upx;
}
.rinse:nth-child(2){
    border-bottom: 0px;
}
.rinse_word{
    width: 180upx;
    vertical-align: middle;
    display: inline-block;
    text-indent: 10px;
}
.form_box{
    background-color: #f8f8f8;
    /* padding: 20upx; */
}
.form{
    width: 664upx;
    margin: 0 auto;
     padding: 20upx;
    background-color: #fff;
}
.form_input{
    width: 660upx;
    height: 80upx;
    background-color: #F6F5F4;
    margin: 20upx auto;
    font-size: 28upx;
}
.form_word{
    width: 660upx;
    height: 40upx;
    line-height: 40upx;
    margin: 0 auto;
    font-family: PingFangSC-Regular;
    font-size: 28upx;
    color: #4A4A4A;
    letter-spacing: 0;
}
.form_img{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    float: right;
}
.smbit{
    width: 750upx;
    height: 160upx;
    /* line-height: 240upx; */
    text-align: center;
    background-color: #f8f8f8;
    display: flex;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.form_button{
    width: 682upx;
    height: 80upx;
    line-height: 80upx;
    margin: 0 auto;
    background-image: url(../../static/tijiao.svg);
    background-repeat: no-repeat;
    background-size: cover;
    font-family: PingFangSC-Medium;
    font-size: 32upx;
    color: #FFFFFF;
    letter-spacing: 0;
}
</style>