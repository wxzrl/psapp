<template>
 <div>
     <div class="box">
        <div class="rinse_box">
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    处理时间：
                </span>
                <picker class="select" mode="date" :value="startDates" :start="startDate" @change="startDateChange">
                	<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
                </picker>
            </div>
			<div class="rinse">
				<i style="color: red;">*</i>
			    <span class="rinse_word">
			        异常原因：
			    </span>
			    <picker class="select" @change="inspect" :value="index" :range="inspectList" range-key="label">
			        <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="inspect_index == ''? '':inspectList[inspect_index].label">
			    </picker>
			</div>
        </div>
    </div>
    <div class="form_box">
        <div class="form">
            <p class="form_word"> 
			<i style="color: red;margin-right: 10upx;">*</i>
			反馈人：</p>
            <input v-model="from.feedBackPerson" type="text" class="form_input" placeholder="请输入反馈人名称">
            <p class="form_word"> 处理过程描述：</p>
            <input v-model="from.dealProcess" type="text" class="form_input" placeholder="请输入处理过程描述">
            <p class="form_word"> 处理过程照片：
                <img class="form_img" @click="takePhoto" src="../../static/picture.svg" alt="" srcset="">
            </p>
				<img style="width: 660upx;margin-top: 20upx;" :src="image" mode="">
        </div>
    </div>
    <div class="smbit" v-if="from.warnStatus != 3 ">
        <p class="form_button" @click="cleanFrom">
            提交
        </p>
    </div>
	<div class="smbit" v-if="from.warnStatus == 3 ">
	    <p class="form_button" @click="back">
	        返回
	    </p>
	</div>
 </div>
</template>

<script>
	import urlConfig from '../../common/config.js'
 export default {
     data() {
        return {
            title: 'picker',
            array: [],
            index:'',
            src:"",
			facilityList:[{planDateFormat:"暂无任务"}],
			facility_index:"",
			inspectList:[],
			inspect_index:"",
			startDates:"",
			image:"",
			from:{
				id: "",
				dealProcess: "",
				feedBackPerson: "",
				feedBackTime: "",
				warnStatus: 3,
				unusualReason:""
			}
        }
    },
	onLoad(option){
		console.log(option)
		this.$api.formPWarnLog({}).then(res=>{
			if(res.data.code == 0){
				this.inspectList =  res.data.warnReasultList
				if(option.index == "3"){
					this.$nextTick(function(){
						this.from.id = option.id
						this.$api.findWarnLogById({id:option.id}).then(res=>{
							if(res.data.code == 0){
								this.from = res.data.pWarnLog
								console.log(this.from)
								this.inspect_index = parseInt(this.from.unusualReason);
								this.startDates = this.from.feedBackTime;
							}
						})
					})
				}
			}
		})
		
		
		
	},computed: {
		startDate() {
			return this.getDate('start');
		}
	},
    methods:{
		cleanFrom(){
			if(this.from.feedBackPerson == ""){
				uni.showModal({
					title:"提示",
					content: '请输入姓名'
				})
				return
			}else if(this.from.feedBackTime == ""){
				uni.showModal({
					title:"提示",
					content: '请选择处理时间'
				})
				return
			}else if(this.from.warnStatus == ""){
				uni.showModal({
					title:"提示",
					content: '请选择异常原因'
				})
				return
			}
			this.from.warnStatus = "3";
			this.$api.savePWarnLog(this.from).then(res=>{
				if(res.data.code == 0){
					uni.navigateTo({
						url:"/pages/record_list/index"
					})
				}
			})
		},
		facility(id){
			this.$api.listTaskByPointId({monitoringPointId:id}).then(res=>{
				if(res.data.code == 0){
					if(res.data.list.length != 0){
						this.facilityList = res.data.list
					}
				}
			})
		},
		// 时间显示处理
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
		
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		// 时间处理
		startDateChange(e) {
			this.startDates = e.target.value
			let d = new Date(e.target.value)
			this.from.feedBackTime = d.getTime()
		},
		// 任务
		facilityChange(e){
			this.facility_index = e.target.value.toString()
			this.from.taskId = this.facilityList[this.index].id
			this.from.deviceId = this.facilityList[this.index].deviceId
		},
		// 图片上传
        takePhoto() {
			var _this = this
           uni.chooseImage({
                success: function (res) {
					var test = res.tempFilePaths[0]
					uni.uploadFile({
						url: urlConfig +'a/pslw/usr/uploadFile',
						filePath:test,
						name: 'file',
						success: (uploadFileRes) => {
							let datas = JSON.parse(uploadFileRes.data);
							_this.from.dealImage = datas.filePath;
							let url_config= "";
							if(process.env.NODE_ENV === 'development'){
							    // 开发环境
							    url_config = 'http://192.168.1.7:8182/ps_lwms/'
							}else{
							    // 生产环境
							    url_config = 'http://wqms.joyue-tech.com/ps_lwms/'
							}
							_this.image = url_config + datas.filePath
						}
					});
                }
            });
        },
		// 设备选择
		inspect(e){
			this.inspect_index = e.target.value.toString();
			this.from.warnStatus = this.inspectList[this.index].value
		},
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