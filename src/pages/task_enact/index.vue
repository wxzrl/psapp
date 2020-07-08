<template>
 <div>
     <div class="box">
        <div class="rinse_box">
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    监测点：
                </span>
                <picker class="select" mode="selector" @change="bindPickerChange" value="id" :range="array" range-key="monitoringPointName">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="index==''?'' : array[index].monitoringPointName">
                </picker>
            </div>
            <div class="rinse" @click="Clickdevice">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    设备：
                </span>
                <picker class="select" mode="selector" @change="monitorChange"  :disabled = disableds  :range="monitorList" range-key="deviceName">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled  :value="monitor_index==''? '': monitorList[monitor_index].deviceName">
                </picker>
            </div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    维护人员：
                </span>
                <picker class="select" mode="selector" @change="userlistChange" :range="userlist" range-key="name">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="userIndex==''?'' : userlist[userIndex].name">
                </picker>
            </div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    清洗类型：
                </span>
                <picker class="select" mode="selector" @change="cleanChange" :value="index" :range="cleanTypeList" range-key="label">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="clean_index ==''?'': cleanTypeList[clean_index].label">
                </picker>
            </div>
            <div class="rinse">
				<i style="color: red;">*</i>
                <span class="rinse_word">
                    计划时间：
                </span>
                <picker class="select" mode="date" :value="startDates" :start="startDate" @change="startDateChange">
            		<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
            	</picker>
            </div>
            <div class="center" style="margin-top:20upx;">
                <span class="rinse_word"v >
                    任务内容：
                </span>
                <textarea v-model="from.cleanTaskContent" type="textarea" class="texta" placeholder="请输入任务内容" ></textarea>
            </div>
        </div>
    </div>
    <div class="smbit">
        <p class="form_button" @click="smbit">
            提交
        </p>
    </div>
 </div>
</template>

<script>
 export default {
     data() {
        
        return {
            title: 'picker',
            array: [],
            index:'',
            src:"",
			userlist:[],
			userIndex:"",
			from:{
				monitoringPointId:"", 
				monitoringPointName:"",
				deviceName:"",
				cleanUserName:"",
				deviceId:"",
				cleanUserId:"",
				cleanType:"",
				planDate:"",
				cleanTaskContent:"",
			},
			startDates:"",
			monitorList:[],
			monitor_index:"",
			disableds:true,
			cleanTypeList:[],
			clean_index:""
        }
    },
	onLoad(){
		this.$api.formPCleanTask().then(res=>{
			if(res.data.code == 0){
				console.log('1234',res)
				this.userlist = res.data.userList;
				this.array = res.data.pMonitoringPointList;
				this.cleanTypeList = res.data.cleanTypeList;
			}
		})
	},
	computed: {
		startDate() {
			return this.getDate('start');
		}
	},
    methods:{
		smbit(){
			if(this.from.cleanUserName == ""){
				uni.showModal({
					title: '提示',
					content: '请选择清洁人员',
				});
				return
			}else if(this.from.deviceName == ""){
				uni.showModal({
					title: '提示',
					content: '请选择设备',
				});
				return
			}else if(this.from.monitoringPointName == ""){
				uni.showModal({
					title: '提示',
					content: '请选择监测点',
				});
				return
			}else if(this.from.cleanType == ""){
				uni.showModal({
					title: '提示',
					content: '请选择清洗类型',
				});
				return
			}else if(this.from.planDate == ""){
				uni.showModal({
					title: '提示',
					content: '请选择计划日期',
				});
				return
			}
			this.$api.savePCleanTask(this.from).then(res=>{
				if(res.data.code == 0){
					uni.navigateTo({
						url:"/pages/task/index"
					})
				}
			})
		},
		startDateChange(e) {
			this.startDates = e.target.value
			this.from.planDate = e.target.value
		},
		// 时间选择处理
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
        takePhoto() {
           uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: function (res) {
                    console.log(JSON.stringify(res));
                }
            });
        },
		// 设备调取接口
		monitor(id){
			this.$api.findUserByPoint({pointId:id}).then(res=>{
				if(res.data.code == 0){
					this.monitorList = res.data.pDeviceInfoList			
				}
			})
		},
		// 监测点的选择
		bindPickerChange(e){
			console.log(e)
		    this.index = e.target.value.toString();
			this.from.monitoringPointId = this.array[e.target.value].id;
			this.from.monitoringPointName = this.array[e.target.value].monitoringPointName
			this.disableds = false
			this.monitor(this.from.monitoringPointId)
		},
		// 监测人员选择
		userlistChange(e){
			this.userIndex = e.target.value.toString();
			this.from.cleanUserId = this.userlist[e.target.value].id;
			this.from.cleanUserName = this.userlist[e.target.value].name;
		},
		// 监测点设备
		monitorChange(e){
			this.monitor_index = e.target.value.toString();
			this.from.deviceId = this.monitorList[this.monitor_index].id
			this.from.deviceName = this.monitorList[this.monitor_index].deviceName
		},
		// 监测点没有选择的判断
		Clickdevice(){
			if(this.from.monitoringPointId == ""){
				uni.showModal({
					title: '提示',
					content: '请选择监测点',
				});
				return
			}
		},
		// 清洁类型的选择
		cleanChange(e){
			this.clean_index = e.target.value.toString();
			this.from.cleanType = this.cleanTypeList[this.clean_index].value
		}
    }
 }
</script>

<style scoped>
.select{
    /* line-height: 78upx; */
    width: 72%;
    display: inline-block;
    vertical-align: middle;
   
}
.box{
    padding: 20upx 0;
    background-color: #f8f8f8;
}
.rinse_box{
    width: 694upx;
    height: 708upx;
    margin: 0 auto;
    padding:0 10upx ;
    background-color: #fff;
}
.rinse{
    height: 84upx;
    line-height: 84upx;
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
.rinse_word{
    width: 180upx;
    font-size: 28upx;
    vertical-align: middle;
    display: inline-block;
    text-indent: 10px;
}
.smbit{
    width: 750upx;
    height: 240upx;
    /* line-height: 240upx; */
    text-align: center;
    /* background-color: #f8f8f8; */
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
.texta{
    width: 660upx;
    height: 160upx;
    margin: 20upx auto 0;
    background: #F6F5F4 ;
    border: 1px solid #9B9B9B;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 26upx;
    color: rgba(74,74,74,0.78);
    letter-spacing: 0;
    padding: 10upx;
    text-indent: 20upx;
}
</style>