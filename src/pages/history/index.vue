<template>
 <div>
    <div class="box">
        <div class="rinse_box">
            <div class="rinse">
                <span class="rinse_word">
                    频率：
                </span>
                <picker class="select" @change="frequencyChange" :range="frequencyColumns" range-key="text">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="index == ''? '': frequencyColumns[index].text">
                    <!-- <span >{{array[index]}}</span> -->
                </picker>
            </div>
            <div class="rinse">
                <span class="rinse_word">
                    监测点：
                </span>
                <picker class="select" @change="bindPickerChange" :value="index" :range="array" range-key="monitoringPointName">
                    <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="array_index ==''? '' : array[array_index].monitoringPointName">
                </picker>
            </div>
            <div class="rinse">
                <span class="rinse_word">
                    时间：
                </span>
                <picker class="select" mode="date" :value="startDates"  @change="startDateChange">
                	<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
                </picker>
            </div>
            <div class="inquire" @click="history(1)">
                查询
            </div>
        </div>
        <div class="tables_box">
            <div class="box_center">
                <table style="border-collapse: collapse;margin: 0 20upx;">
                 <tr class="box_tr">
                    <th align="center" style="width: 134upx;">时间</th>
                    <th align="center">监测点</th>
                    <th align="center">余氯/二氧化氯（mg/l）</th>
                    <th align="center">PH值</th>
                    <th align="center">亚氯酸盐（mg/l）</th>
                    <th align="center">浊度（NTU）</th>
                </tr>
                <tr class="box_center_td" v-for="item in tableList" :key="item.id">
                    <td>{{ item.timestamp }}</td>
                    <td>{{ item.monitoringPointName }}</td>
                    <td>{{ item.chlorineResidual }}</td>
                    <td>{{ item.phValue }}</td>
                    <td>{{ item.ylsy }}</td>
                    <td>{{ item.turbidity }}</td>
                </tr>
            </table>
            <div class="more" @click="more">查看更多记录</div>
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
            title: 'picker',
            array: ['中国', '美国', '巴西', '日本'],
			array_index:"",
            index:'',
            src:"",
			startDates:"",
            tableList: [],
			frequencyColumns: [
				{
					text: "5分钟",
					value: "1"
				},
				{
					text: "15分钟",
					value: "2"
				},
				{
					text: "30分钟",
					value: "3"
				},
				{
					text: "1小时",
					value: "4"
				},
				{
					text: "1天",
					value: "5"
				}
			],
			from:{
				range: "",
				id:"" ,
				time: "",
				pageNo: 1,
				pageSize: 15
			}
        }
    },
	onLoad(){
		this.history()
		this.$api.formPCleanTask().then(res=>{
			if(res.data.code == 0){
				this.array = res.data.pMonitoringPointList;
			}
		})
	},
	computed: {
	  startDate() {
	    return this.getDate();
	  }
	},
    methods:{
		history(index){
			uni.showLoading({
			  title: "加载中"
			});
			if(index == 1){
				this.from.pageNo = 1;
			}
			this.$api.findMonitoringForm(this.from).then(res=>{
				if(res.data.code == 0){
					if(this.from.pageNo == 1){
						this.tableList = res.data.page.list;
					}else{
						for(var i in res.data.page.list){
						    this.tableList.push(res.data.page.list[i])
						}
					}
					uni.hideLoading();
				}
			});
		},
		more(){
			this.from.pageNo = this.from.pageNo + 1;
			this.history();
		},
		startDateChange(e) {
		  this.startDates = e.target.value;
		  let d = new Date(this.startDates);
		  this.from.time = d.getTime();
		},
		// 时间选择处理
		getDate(type) {
		  const date = new Date();
		  let year = date.getFullYear();
		  let month = date.getMonth() + 1;
		  let day = date.getDate();
		  day = day > 9 ? day : "0" + day;
		  return `${year}-${month}-${day}`;
		},
        bindPickerChange(e){
            this.array_index = e.target.value.toString();
			this.from.id = this.array[this.array_index].id
        },
		frequencyChange(e){
			this.index = e.target.value.toString();
			this.from.range = this.frequencyColumns[this.index].value
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
    background-color: #f4f4f4;
}
.rinse_box{
    width: 704upx;
    height: 360upx;
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
    margin: 20upx auto 0;
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
    /* width: 167upx; */
    height: 50upx;
	/* padding: 10upx 10upx; */
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 24upx;
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
    font-size: 22upx;
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