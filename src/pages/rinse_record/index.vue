<template>
 <div>
     <div class="box">
        <div class="rinse_box">
			<div class="rinse">
				<i style="color: red;">*</i>
			    <span class="rinse_word">
			        监测点：
			    </span>
				
			    <picker class="select" mode="selector" @change="bindPickerChange" :range="array" range-key="monitoringPointName">
			        <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="index ==''?'':array[index].monitoringPointName">
			        <!-- <span >{{array[index]}}</span> -->
			    </picker>
			</div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    任务：
                </span>
                <picker class="select" mode="selector" @change="facilityChange" :range="facilityList" range-key="planDateFormat">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="facility_index ==''?'':facilityList[facility_index].planDateFormat">
                    <!-- <span >{{array[index]}}</span> -->
                </picker>
            </div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    设备状态：
                </span>
                <picker class="select" @change="inspect" :value="index" :range="inspectList" range-key="label">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="inspect_index == ''? '':inspectList[inspect_index].label">
                    <!-- <span >{{array[index]}}</span> -->
                </picker>
            </div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    维护日期：
                </span>
                <picker class="select" mode="date" :value="startDates" :start="startDate" @change="startDateChange">
                	<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
                </picker>
            </div>
        </div>
    </div>
    <div class="form_box">
        <div class="form">
            <p class="form_word"> <i style="color: red;margin-right: 5px;">*</i> 处理过程描述：</p>
            <input type="text" v-model="from.dealProcess" class="form_input" placeholder="请输入处理过程描述">
            <p class="form_word"> <i style="color: red;margin-right: 5px;">*</i> 清洗维护项目：</p>
            <input v-model="from.cleanMaintain" type="text" class="form_input" placeholder="请输入清洗维护项目：">
            <p class="form_word"> <i style="color: red;margin-right: 5px;">*</i> 设备异常描述：</p>
            <input v-model="from.deviceErrDescribe" type="text" class="form_input" placeholder="请输入设备异常描述">
            <p class="form_word"> <i style="color: red;margin-right: 5px;">*</i> 处理结果：</p>
            <input v-model="from.deviceDealResult" type="text" class="form_input" placeholder="请输入处理结果">
            <p class="form_word"> 处理过程照片：
                <image class="form_img" @click="takePhoto" src="../../static/picture.svg" alt="" srcset=""></image>
            </p>
				<image style="width: 660upx;margin-top: 20upx;" :src="image" mode=""></image>
        </div>
    </div>
    <div class="smbit">
        <p class="form_button" @click="cleanFrom">
            提交
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
				monitoringPointId:"",         // 监测点id
				deviceId:"",    			 // 设备id
				taskId:"",                   //任务id
				deviceCheckStatus:"",        //设备检查状态(1.正常 2.异常)
				cleanDate:"",                //清洗维护日期
				dealProcess:"",              //处理过程描述
				cleanMaintain:"",            //清洗维护项目
				deviceErrDescribe:"",        //设备异常描述
				deviceDealResult:"",         //设备异常处理结果
				dealImage:""                 //处理过程照片
			}
        }
    },
	onLoad(){
		this.$api.formPCleanRecord().then(res=>{
			if(res.data.code == 0){
				this.array = res.data.pMonitoringPointList;
				this.inspectList = res.data.inspectStatusList;
			}
		})
	},computed: {
		startDate() {
			return this.getDate('start');
		}
	},
    methods:{
		
		cleanFrom(){
			if(this.from.monitoringPointId == ""){
				uni.showModal({
					title: '提示',
					content: '请选择监测点',
				});
				return
			}else if(this.from.taskId == ""){
				uni.showModal({
					title: '提示',
					content: '请选择任务',
				});
				return
			}else if(this.from.monitoringPointName == ""){
				uni.showModal({
					title: '提示',
					content: '请选择监测点',
				});
				return
			}else if(this.from.deviceCheckStatus == ""){
				uni.showModal({
					title: '提示',
					content: '请选择设备状态',
				});
				return
			}else if(this.from.cleanDate == ""){
				uni.showModal({
					title: '提示',
					content: '请选择维护日期',
				});
				return
			}else if(this.from.dealProcess == ""){
				uni.showModal({
					title: '提示',
					content: '请输入处理过程描述',
				});
				return
			}else if(this.from.cleanMaintain == ""){
				uni.showModal({
					title: '提示',
					content: '请输入清洗维护项目',
				});
				return
			}else if(this.from.deviceErrDescribe == ""){
				uni.showModal({
					title: '提示',
					content: '请输入设备异常描述',
				});
				return
			}else if(this.from.deviceDealResult == ""){
				uni.showModal({
					title: '提示',
					content: '请输入设备异常处理结果',
				});
				return
			}
			
			this.$api.savePCleanRecord(this.from).then(res=>{
				if(res.data.code == 0){
					uni.navigateTo({
						url:"/pages/clean/index"
					})
				}
			})
		},
        bindPickerChange(e){
            console.log('picker发送选择改变，携带值为', e.target.value)
            this.index = e.target.value.toString()
			this.facility(this.array[this.index].id)
			this.from.monitoringPointId = this.array[this.index].id
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
			this.from.cleanDate = d.getTime()
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
			this.from.deviceCheckStatus = this.inspectList[this.index].value
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
    height: 320upx;
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
.rinse:nth-child(4){
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