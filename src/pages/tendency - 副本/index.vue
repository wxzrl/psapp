<template>
  <div>
    <div class="box">
      <div class="rinse_box">
        <div class="rinse">
          <span class="rinse_word">频率：</span>
          <picker class="select" @change="bindPickerChange" :value="index" :range="frequencyColumns" range-key="text">
            <input
              type="text"
              placeholder="请选择>"
              class="input_rinse"
              disabled
              :value="index == ''? '': frequencyColumns[index].text"
            />
          </picker>
        </div>
        <div class="rinse">
          <span class="rinse_word">监测点：</span>
          <picker class="select" @change="monitoringChange" :value="index" :range="array" range-key="monitoringPointName">
            <input
              type="text"
              placeholder="请选择>"
              class="input_rinse"
              disabled
              :value="monitoring_index == ''?'' : array[monitoring_index].monitoringPointName"
            />
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
        <div class="inquire" @click="inquire">查询</div>
      </div>
	  <!-- 余氯/二氧化氯变化对比分析图 -->
	  <view class="box-charts">
		  <view class="qiun-title-bar" style="position: relative;">
			  <view class="qiun-title-dot-light">余氯/二氧化氯变化对比分析图</view>
			  <view class="unit">单位（mg/l)</view>
		  </view>
		  <view class="qiun-charts" >
			<canvas canvas-id="canvasLineA" disable-scroll=true id="canvasLineA" class="charts" @touchstart="touchLineA"  @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
		  </view>
	  </view>
	  <!-- PH值变化对比分析图 -->
	  <view class="box-charts">
	  		  <view class="qiun-title-bar" style="position: relative;">
	  			  <view class="qiun-title-dot-light">PH值变化对比分析图</view>
	  			  <!-- <view class="unit">单位（mg/l)</view> -->
	  		  </view>
	  		  <view class="qiun-charts" >
	  			<canvas canvas-id="canvasLineB" disable-scroll=true id="canvasLineB" class="charts" @touchstart="touchLineB" @touchmove="moveLineB" @touchend="touchEndLineB"></canvas>
	  		  </view>
	  </view>
	  <!-- 亚氯酸盐变化对比分析图 -->
	  <view class="box-charts">
		  <view class="qiun-title-bar" style="position: relative;">
			  <view class="qiun-title-dot-light">亚氯酸盐变化对比分析图</view>
			  <view class="unit">单位（mg/l)</view>
		  </view>
		  <view class="qiun-charts" >
			<canvas canvas-id="canvasLineC" disable-scroll=true id="canvasLineC" class="charts" @touchstart="touchLineC"   @touchmove="moveLineC" @touchend="touchEndLineC"></canvas>
		  </view>
	  </view>
	  <!-- 浊度变化对比分析图 -->
	  <view class="box-charts">
		  <view class="qiun-title-bar" style="position: relative;">
			  <view class="qiun-title-dot-light">浊度变化对比分析图</view>
			  <view class="unit">单位 (NTU)</view>
		  </view>
		  <view class="qiun-charts" >
			<canvas canvas-id="canvasLineD" disable-scroll=true id="canvasLineD" class="charts" @touchstart="touchLineD" @touchmove="moveLineD" @touchend="touchEndLineD"></canvas>
		  </view>
	  </view>
    </div>
  </div>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
export default {
  data() {
    return {
      title: "picker",
      array: ["中国", "美国", "巴西", "日本"],
	  monitoring_index:"",
      index: "",
      src: "",
	  startDates:"",
	  endDates:"",
	  frequencyColumns: [
		  {
			text: "分",
			value: "1"
		  },
		  {
			text: "小时",
			value: "2"
		  },
		  {
			text: "日",
			value: "3"
		  }
	  ],
	  from:{
		  end:"",
		  start:"",
		  range: "",
		  ids: ""
	  },
	  categories:"",
	  cWidth:'',
	  cHeight:'',
	  pixelRatio:1,
	  canvaLineA:"",
	  canvaLineB:{},
	  canvaLineC:{},
	  canvaLineD:{},
	  chartDataA:{},
	  chartDataB:{},
	  chartDataC:{},
	  chartDataD:{},
	  name:""
    };
  },
  mounted() {
   
  },
  onLoad() {
  	this.$api.formPCleanTask().then(res=>{
  		if(res.data.code == 0){
  			this.array = res.data.pMonitoringPointList;
  		}
  	});
	this.cWidth=uni.upx2px(750);
	this.cHeight=uni.upx2px(500);
	this.inquire();
  },
  computed: {
  	startDate() {
  		return this.getDate('start');
  	},
  	endDate() {
  		return this.getDate('end');
  	}
  },
  methods: {
	  showLineA(canvasId,datas){
		  var _self = this
		  var  canvaLineA = {}
		  var chartData = {
		  	categories: _self.categories,
		  	series: [{
		  		name: _self.name,
		  		data: datas,
		  		color: '#0294FF'
		  	}]
		  },
		  
		canvaLineA = new uCharts({
			$this:_self,
			canvasId: canvasId,
			type: 'area',
			fontSize:11,
			legend:{
				show:true,
				position: 'top',
                float: 'right',
                padding: 10,
                margin: 0
			},
			enableScroll: true,//开启图表拖拽功能
			dataLabel:true,
			dataPointShape:false,
			background:'#FFFFFF',
			enableMarkLine: true, 
			pixelRatio:1,
			categories: chartData.categories,
			series: chartData.series,
			animation: true,
			enableScroll: true,//开启图表拖拽功能
			xAxis: {
				type:'grid',
				gridColor:'#CCCCCC',
				gridType:'solid',
				dashLength:8,
				disableGrid:true,
				boundaryGap: 'center',
				rotateLabel: true, //X轴刻度（数值）标签是否旋转（仅在文案超过单屏宽度时有效）
				itemCount:3,//x轴单屏显示数据的数量，默认为5个
				scrollShow:true,//新增是否显示滚动条，默认false
				scrollAlign:'left',//滚动条初始位置
				scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
				scrollColor:'#DEE7F7',//默认为 #A6A6A6
			},
			yAxis: {
				gridType:'solid',
				gridColor:'#CCCCCC',
				dashLength:8,
				splitNumber:5,
				format:(val)=>{return val.toFixed(2)}
			},
			
			width: _self.cWidth*_self.pixelRatio,
			height: _self.cHeight*_self.pixelRatio,
			extra: {
				area:{
					type: 'straight',
					opacity:0.2,
					addLine:true,
					width:2
				},
				markLine:{
					type:'solid',
					// dashLength:,
					data: [{
						value:0.3,
						lineColor: '#f04864',
						showLabel:true,
						label:true,
						labelAlign:'right',
						// yAxisIndex:0.5,
						labelFontColor:'#000'
					}]
				},
			}
		});
		
		if(canvasId == "canvasLineA"){
			this.canvaLineA = canvaLineA;
		}else if(canvasId == "canvasLineB"){
			this.canvasLineB = canvaLineA
		}else if(canvasId == "canvasLineC"){
			this.canvasLineC = canvaLineA
		}else if(canvasId == "canvasLineD"){
			this.canvasLineD = canvaLineA
		}
		
	},
	touchEndLineA(e) {
		this.canvaLineA.scrollEnd(e);
		this.canvaLineA.showToolTip(e, {
			format: function (item, category) {
				return category + ' ' + item.name + ':' + item.data 
			}
		});
	},
	 moveLineA(e){
	 	this.canvaLineA.scroll(e);
	 },
	 touchLineA(e){
	 	this.canvaLineA.scrollStart(e);
	 }, 
	 touchEndLineB(e) {
	 	this.canvasLineB.scrollEnd(e);
	 	this.canvasLineB.showToolTip(e, {
	 		format: function (item, category) {
	 			return category + ' ' + item.name + ':' + item.data 
	 		}
	 	});
	 },
	  moveLineB(e){
	  	this.canvasLineB.scroll(e);
	  },
	  touchLineB(e){
	  	this.canvasLineB.scrollStart(e);
	  }, 
	  touchEndLineC(e) {
		this.canvasLineC.scrollEnd(e);
		this.canvasLineC.showToolTip(e, {
			format: function (item, category) {
				return category + ' ' + item.name + ':' + item.data 
			}
		});
	},
	 moveLineC(e){
	 	this.canvasLineC.scroll(e);
	 },
	 touchLineC(e){
	 	this.canvasLineC.scrollStart(e);
	 }, 
	 touchEndLineD(e) {
		this.canvasLineD.scrollEnd(e);
		this.canvasLineD.showToolTip(e, {
			format: function (item, category) {
				return category + ' ' + item.name + ':' + item.data 
			}
		});
	},
	 moveLineD(e){
	 	this.canvasLineD.scroll(e);
	 },
	 touchLineD(e){
	 	this.canvasLineD.scrollStart(e);
	 }, 
	  
	// 时间选择
    bindPickerChange(e) {
      this.index = e.target.value.toString();
	  this.from.range = this.frequencyColumns[this.index].value
    },
	// 查询
	inquire(){
		console.log(this.from)
		uni.showLoading({
			title:"加载中"
		})
		this.$api.findCompositeIndex(this.from).then(res=>{
			if(res.data.code == 0){
				uni.hideLoading();
				this.categories = res.data.time.map(function(item) {
					var y = new Date(item).getFullYear() ;
					var m = (new Date(item).getMonth() + 1);
					var d = new Date(item).getDate() ;
					var h = new Date(item).getHours() ;
					 h = h < 10 ? ('0' + h) : h;
					var s = new Date(item).getMinutes();
					 s = s < 10 ? ('0' + s) : s;  
					return y + '-' + m + '-' + d + " "+ h +":" +s;  
				});
				if(res.data.list.length != 0){
					this.name = res.data.list[0].monitoringPointName;
					for(var i = 0; i < res.data.list.length; i++) {
						if (res.data.list[i].result!=undefined) {
							this.showLineA("canvasLineA",res.data.list[i].result["iot.water.residual_chlorine"]);
							this.showLineA("canvasLineB",res.data.list[i].result["iot.water.PH"]);
							this.showLineA("canvasLineC",res.data.list[i].result["iot.water.ylsy"]);
							this.showLineA("canvasLineD",res.data.list[i].result["iot.water.turbidity"]);
						}
					}
				}
				
				
			}
		})
	},
	// 监测点
	monitoringChange(e){
		this.monitoring_index = e.target.value.toString();
		this.from.ids = this.array[this.monitoring_index].id;
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
	// 折线图
  }
};
</script>

<style scoped>
.qiun-charts {
	width: 750upx;
	height: 500upx;
	background-color: #FFFFFF;
}

.charts {
	width: 750upx;
	height: 500upx;
	background-color: #FFFFFF;
}
.qiun-title-dot-light{
	font-family: PingFangSC-Semibold;
	font-size: 16px;
	color: #4A4A4A;
	letter-spacing: 0;
	margin-left: 20upx;
}
.box-charts{
	margin-bottom: 48upx;
}
.unit{
	position: absolute;
	top: 35px;
	left: 10px;
	z-index: 1;
	font-family: PingFangSC-Regular;
	font-size: 26upx;
	color: #4A4A4A;
	letter-spacing: 0;
}
	
uni-page-wrapper {
  background-color: #ffffff;
}
.select {
  width: 72%;
  display: inline-block;
  vertical-align: middle;
}
.box {
  padding: 20upx 0;
}
.rinse_box {
  width: 704upx;
  height: 520upx;
  margin: 0 auto;
  border-radius: 4px;
}
.rinse {
  height: 78upx;
  line-height: 78upx;
  font-family: PingFangSC-Regular;
  font-size: 28upx;
  color: #4a4a4a;
  letter-spacing: 0;
  border-bottom: 1px solid #d5d5d5;
}
.input_rinse {
  text-align: right;
  font-size: 28upx;
}
.rinse:nth-child(5) {
  border-bottom: 0px;
}
.rinse_word {
  width: 180upx;
  vertical-align: middle;
  display: inline-block;
  text-indent: 10px;
}
.inquire {
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
  color: #ffffff;
  letter-spacing: 0;
}
#tendency {
  width: 710upx;
  height: 568upx;
  margin: 0 auto;
}
</style>