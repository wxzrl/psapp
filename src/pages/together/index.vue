<template>
  <div>
    <div class="box">
      <div class="rinse_box">
        <div class="rinse">
          <span class="rinse_word">频率：</span>
          <picker class="select" mode="selector" @change="bindPickerChange" :value="index" :range="array" range-key="text">
            <input
              type="text"
              placeholder="请选择>"
              class="input_rinse"
              disabled
              :value="index == ''?'' : array[index].text"
            />
          </picker>
        </div>
        <div class="rinse">
          <span class="rinse_word">监测点：</span>
          <picker class="select" @change="monitorChange" :value="index" :range="monitorList" range-key="monitoringPointName">
            <input
              type="text"
              placeholder="请选择>"
              class="input_rinse"
              disabled
              :value="monitor_index==''?'' : monitorList[monitor_index].monitoringPointName"
            />
          </picker>
        </div>
        <div class="rinse">
          <span class="rinse_word">时间：</span>
          <picker class="select" mode="date" :value="startDates" @change="startDateChange">
          	<input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates">
          </picker>
        </div>
        <div class="inquire" @click="inquire">查询</div>
      </div>
      
    </div>
	<view class="box-charts">
	 <view class="qiun-title-bar" style="position: relative;margin-bottom: 20px;margin-left: 10px;">
		  <view class="qiun-title-dot-light">曲线图</view>
		  <view class="unit">{{this.name}}</view>
	  </view>
	  <view class="qiun-charts" >
		<canvas canvas-id="canvasLineA" disable-scroll=true id="canvasLineA" class="charts" @touchstart="touchLineA"  @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
	  </view>
	</view>
  </div>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';


export default {
  data() {
    return {
      title: "picker",
      array: [
        {
          text: "余氯/二氧化氯",
          value: "1"
        },
        {
          text: "PH值",
          value: "2"
        },
        {
          text: "浊度",
          value: "3"
        },
        {
          text: "亚氯酸盐",
          value: "4"
        }
      ],
      index: "0",
      src: "",
      monitorList: [],
      monitor_index: "",
      startDates: "",
      from: {
        range: "1",
        id: "",
        time: ""
      },
      tyecharts: "",
      Test: "",
	  pixelRatio:1,
	  canvaLineA:"",
	  chartDataA:{},
	  cWidth:"",
	  cHeight:"",
	  times:"",
	  name:"余氯 /二氧化氯(mg/l)"
    };
  },
  mounted() {
    this.inquire();
	
  },
  computed: {
    startDate() {
      return this.getDate("start");
    }
  },
  onLoad() {
	var  _self = this;
	this.cWidth=uni.upx2px(750);
	this.cHeight=uni.upx2px(500);
    this.$api.formPCleanTask().then(res => {
      if (res.data.code == 0) {
        this.monitorList = res.data.pMonitoringPointList;
      }
    });
  },
  methods: {
    // 频率
    bindPickerChange(e) {
      this.index = e.target.value.toString();
      this.from.range = this.array[this.index].value;
	  this.name = this.array[this.index].text
    },
    // 监测点
    monitorChange(e) {
      this.monitor_index = e.target.value.toString();
      this.from.id = this.monitorList[this.monitor_index].id;
    },
    //
    change(e) {
      console.log(e.detail);
    },
    // 查询
    inquire() {
      var _that = this;
      var valueName = {
        "1": "余氯 /二氧化氯(mg/l)",
        "2": "PH值",
        "3": "浊度 (NTU)",
        "4": "亚氯酸盐"
      };
      uni.showLoading({
        title: "加载中"
      });
      this.$api.findMonitoringIndexPC(this.from).then(res => {
        if (res.data.code == 0) {
          var result = res.data.result;
          var time = res.data.time;
          this.times = time.map(function(item) {
            var y = new Date(item).getFullYear() ;
            var m = (new Date(item).getMonth() + 1);
            var d = new Date(item).getDate() ;
            var h = new Date(item).getHours() ;
             h = h < 10 ? ('0' + h) : h;
            var s = new Date(item).getMinutes();
             s = s < 10 ? ('0' + s) : s;  
            return y + '-' + m + '-' + d + " "+ h +":" +s;
          });
		  this.showArea("canvasLineA",result)
          uni.hideLoading();
        }
      });
    },
    // 时间
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
      this.startDates = `${year}-${month}-${day}`;
      return `${year}-${month}-${day}`;
    },
    showArea(canvasId,result){
	  var _self = this
	  var chartData = {
			categories: this.times,
			series: [{
				name: '今日',
				data: result.now,
				color: '#40B8ED'
			},{
				name: '昨日',
				data: result.day,
				color: '#67B54F'
			},{
				name: '上周',
				data: result.week,
				color: '#FD9000'
			},{
				name: '上月',
				data: result.month,
				color: '#FE0202'
			},{
				name: '上年',
				data: result.year,
				color: '#CE64EC'
			}]
		}
		var canvaArea = {}
		canvaArea=new uCharts({
			$this:_self,
			canvasId: canvasId,
			type: 'area',
			fontSize:11,
			legend:{
				show:true,
				// position: 'top',
			 //    float: 'right',
			    padding: 20,
			    margin: 0
			},
			enableScroll: true,//开启图表拖拽功能
			dataLabel:true,
			dataPointShape:false,
			background:'#FFFFFF',
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
			}
			
		});
		this.canvaLineA  = canvaArea
		
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
.box-charts{
	margin-bottom: 48upx;
}
.unit{
	position: absolute;
	top: 50upx;
	left: 20upx;
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
  height: 460upx;
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
  width: 720upx;
  height: 80upx;
  line-height: 80upx;
  margin: 50upx auto 0;
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
  width: 720upx;
  height: 650upx;
  margin: 0 auto;
}
</style>