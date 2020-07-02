<template>
 <view>
	 <view class="box">
	
	 <map style="width: 100%;height: 100%;"  scale="12" :latitude="latitude" @markertap="mktap" :longitude="longitude" :markers="covers" class="allmap">
		 <cover-view class="box-message">
		 </cover-view>
		 <cover-view style="position: absolute;top: 5px;height: 30px;left: 10px;z-index: 100;font-size: 16px;color: #000;">
		 	{{list_data.monitoringPointName}}
		 </cover-view>
		 <cover-view style="position: absolute;top: 70upx;height: 20px;left: 20upx;z-index: 100;font-size: 28upx;color: #000;">
		 	余氯（mg/1):{{list_data.monitoringPointName}}
		 </cover-view>
		 <cover-view style="position: absolute;top: 70upx;height: 20px;left: 410upx;z-index: 100;font-size: 28upx;color: #000;">
		 	二氧化氯（mg/1):0.1-0.8
		 </cover-view>
		 <cover-view style="position: absolute;top: 120upx;height: 20px;left: 20upx;z-index: 100;font-size: 28upx;color: #000;">
		 	亚氯酸盐（mg/1):<0.7
		 </cover-view>
		 <cover-view style="position: absolute;top: 120upx;height: 20px;left: 410upx;z-index: 100;font-size: 28upx;color: #000;">
		 	PH值：6.5-8.5
		 </cover-view>
		 <cover-view style="position: absolute;top: 170upx;height: 20px;left: 20upx;z-index: 100;font-size: 28upx;color: #000;">
		 	浊度（NTU):<1
		 </cover-view>
		 <cover-view class="box-map"></cover-view>
		  <cover-view class="indicator_data">
		  			标准数据	
		  </cover-view>
		  <cover-view class="indicator_span">余氯（mg/1):0.2-1.0</cover-view>
		  <cover-view class="indicator_co">二氧化氯（mg/1):0.1-0.8</cover-view>
		  <cover-view class="indicator_PH">PH值：6.5-8.5</cover-view>
		  <cover-view class="indicator_ya">亚氯酸盐（mg/1):<0.7</cover-view>
		  <cover-view class="indicator_NTU">浊度（NTU):<1</cover-view>
	 </map>
	 </view>
	
 </view>
</template>

<script>
 export default {
     data(){
         return{
			tableData:"",
			latitude: 22.700313,
			longitude: 114.382418,
			covers: [],
			list_data:{}
         }
     },
	 onLoad() {
	 	this.$api.getRealTimeData().then(res=>{
			if(res.data.code == 0) {
				this.tableData = res.data.list;
				this.maps();
			} else if(res.data.code == 1) {
				this.tableData = [];
			}
		})
	 },
     methods:{
		 maps(){
			 this.covers = []
			 for(var i in this.tableData){
				 this.covers.push({
					 latitude: this.tableData[i].pMonitoringPoint.latitude,
					 id: parseInt(this.tableData[i].pMonitoringPoint.id),
					 longitude: this.tableData[i].pMonitoringPoint.longitude,
					 iconPath: 'http://wqms.joyue-tech.com/sz_wqms/html/static/blue.png',
					 title:this.tableData[i].pMonitoringPoint.monitoringPointName,//标注点名
					 callout:{//自定义标记点上方的气泡窗口 点击有效
					 	content:this.tableData[i].pMonitoringPoint.monitoringPointName,
					 	color:'#F76350',
					 	fontSize:12,
					 	borderRadius:5
				 }})
			 }
		 },
		 mktap(e){
			for(var k in this.tableData){
				if(this.tableData[k].pMonitoringPoint.id == e.detail.markerId.toString()){
					console.log(this.tableData[k])
					this.list_data = this.tableData[k]
				}			 
			}
		 }
     }
 }
</script>

<style scoped>
.allmap{
    width:100%;
    height: 100%;position: relative;
	z-index: 1;
}
    
.box{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
}
.optsMessage {
	font-size: 26upx;
}
.box-map{
	width: 640upx;
	height: 244upx;
	background: #FFFFFF;
	box-shadow: 0 2px 6px 0 rgba(0,0,0,0.06);
	margin: 0 auto;
	padding: 24upx 32upx;
	position: absolute;
	bottom: 100upx;
	left: 24upx;
	right: 36upx;
	z-index: 100;
}
.indicator{
	font-family: PingFangSC-Semibold;
	font-size: 32upx;
	color: #4A4A4A;
	letter-spacing: 0;
}
.indicator_data{
	width: 184upx;
	height: 150upx;
	margin: 0 auto;
	font-size: 16px;
	position: absolute;
	bottom: 214upx;
	left: 70upx;
	z-index: 100;
	font-family: PingFangSC-Regular;
	color: #4A4A4A;
	letter-spacing: 0;
}
.indicator_span{
	width: 320upx;
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	font-size: 26upx;
	position: absolute;
	bottom: 270upx;
	color: #000;
	left: 70upx;
	z-index: 100;
}
.indicator_co{
	width: 320upx;
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	font-size: 26upx;
	position: absolute;
	bottom: 270upx;
	color: #000;
	left: 360upx;
	z-index: 100;
}
.indicator_PH{
	width: 320upx;
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	font-size: 26upx;
	position: absolute;
	bottom: 226upx;
	color: #000;
	left: 70upx;
	z-index: 100;
}
.indicator_ya{
	width: 320upx;
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	font-size: 26upx;
	position: absolute;
	bottom: 226upx;
	color: #000;
	left: 360upx;
	z-index: 100;
}
.indicator_NTU{
	width: 320upx;
	display: inline-block;
	height: 50upx;
	line-height: 50upx;
	font-size: 26upx;
	position: absolute;
	bottom: 182upx;
	color: #000;
	left: 70upx;
	z-index: 100;
}
.box-message{
	width: 750upx;
	height: 260upx;
	position: absolute;
	top: 0;
	z-index: 100;
	background: #fff;
}
</style>