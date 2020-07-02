<template>
 <div>
    <div class="box">
        <div class="rinse_box">
            <div class="rinse">
                <span class="rinse_word">
                    监测点：
                </span>
                <picker class="select" mode="selector" @change="bindPickerChange" value="id" :range="array" range-key="monitoringPointName">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="index==''?'' : array[index].monitoringPointName">
                </picker>
            </div>
            <div class="rinse">
                <span class="rinse_word">
                    维护人员：
                </span>
                <picker class="select" mode="selector" @change="userlistChange" :range="userlist" range-key="name">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="userIndex==''?'' : userlist[userIndex].name">
                </picker>
            </div>
            <div class="rinse">
                <span class="rinse_word">
                    开始时间：
                </span>
                <picker class="select" mode="date" :value="startDates" :start="startDate" :end="endDate" @change="startDateChange">
					<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
				</picker>
            </div>
            <div class="rinse">
                <span class="rinse_word">
                    结束时间：
                </span>
                <picker class="select" mode="date" :value="endDates" :start="startDate" :end="endDate" @change="endDateChange">
                	<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="endDates">
                </picker>
            </div>
            <div class="inquire" @click="Inquire">
                查询
            </div>
        </div>
        <div class="tables_box">
            <div class="box_center">
                <table style="border-collapse: collapse;margin: 0 20upx;">
                 <tr class="box_tr">
                    <th align="center">监测点</th>
                    <th align="center">维护人员</th>
                    <th align="center">清洁类型</th>
                    <th align="center">检查状态</th>
                </tr>
                <tr class="box_center_td" v-for="item in tableList" :key="item.id">
                    <td>{{ item.monitoringPointName }}</td>
                    <td>{{ item.cleanUserName }}</td>
                    <td>{{ item.cleanTypeName }}</td>
                    <td>{{ item.cleanTaskStatusName }}</td>
                </tr>
            </table>
            <div class="more" @click="more">{{record}}</div>
            <!-- <div class="more">已全部加载</div> -->
            </div>
        </div>
    </div>
 </div>
</template>

<script>
 export default {
     data() {
        return {
			from:{
				monitoringPointId:"",
				cleanUserId:"",
				start:"",
				end:"",
				pageNo:1
			},
            title: 'picker',
            array: [],
            index:'',
			userIndex:'',
            src:"",
			endDates:"",
			userlist:[],
			startDates: '',
            tableList: [],
			record:'查看更多记录'
        }
    },
	onLoad(){
		this.$api.findUserAndPoints().then(res=>{
			if(res.data.code == 0){
				console.log('1234',res)
				this.userlist = res.data.userList;
				this.array = res.data.pMonitoringPointList;
			}
		})
		this.Inquire()
	},
	computed: {
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
    methods:{
		// 监测点选择
        bindPickerChange(e){
			console.log(e)
            this.index = e.target.value.toString();
			this.from.monitoringPointId = this.array[e.target.value].id;
        },
		// 监测人员选择
		userlistChange(e){
			this.userIndex = e.target.value.toString();
			this.from.cleanUserId = this.userlist[e.target.value].id
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
		// 开始时间选择
		startDateChange(e) {
			this.startDates = e.target.value
			let d = new Date(e.target.value)
			this.from.start = d.getTime()
		},
		// 结束时间选择
		endDateChange(e){
			this.endDates = e.target.value
			let d = new Date(e.target.value)
			this.from.end = d.getTime()
			console.log(this.from)
		},
		// 查询列表
		Inquire(){
			uni.showLoading({
			    title: '加载中'
			});
			this.$api.listPCleanTask(this.from).then(res=>{
				if(res.data.code == 0){
					uni.hideLoading();
					if(this.from.pageNo ==1){
						this.tableList = res.data.page.list
					}else if(this.from.pageNo !=1){
						for(var i in res.data.page.list){
							this.tableList.push(res.data.page.list[i]) 
						}
					}
					console.log(this.tableList)
				}
			})
		},
		more(){
			
			this.from.pageNo = this.from.pageNo + 1;
			console.log(this.from.pageNo)
			this.Inquire();
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
    background-color: #f4f4f4;
}
.rinse_box{
    width: 704upx;
    height: 434upx;
    margin: 0 auto;
    background: #FFFFFF;
    box-shadow: 0 0 6px 0 rgba(0,0,0,0.14);
    border-radius: 4px;
}
.rinse{
    height: 78upx;
    line-height: 78upx;
    font-family: PingFangSC-Regular;
    font-size: 28upx;
    color: #4A4A4A;
    letter-spacing: 0;
    border-bottom: 1px solid #D5D5D5;
}
.input_rinse{
    /* line-height: 78upx; */
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
.inquire{
    width: 682upx;
    height: 80upx;
    line-height: 80upx;
    margin: 10upx auto 0;
    text-align: center;
    background-image: url(../../static/tijiao.svg);
    background-repeat: no-repeat;
    background-size: cover;
    font-family: PingFangSC-Medium;
    font-size: 32upx;
    color: #FFFFFF;
    letter-spacing: 0;
}
.tables_box{
    padding: 20upx;
    background: #f4f4f4;
}
.box_center{
    width: 704upx;
    margin: 0 auto;
    background-color: #fff;
}

.box_tr th{
    width: 167upx;
    height: 50upx;
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 26upx;
    color: #A0A0A0;
    letter-spacing: 0;
}
.box_center_td:nth-child(2n+1){
    background: #F4F4F4;
}
.box_center_td td{
    height: 96upx;
    text-align: center;
    font-family: PingFangSC-Regular;
    font-size: 26upx;
    color: #666666;
    letter-spacing: 0;
}
.more{
    width: 704upx;
    height: 88upx;
    text-align: center;
    line-height: 88upx;
    font-family: PingFangSC-Medium;
    font-size: 26upx;
    color: #A0A0A0;
    letter-spacing: 0;
}
</style>