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
	  <view class="qiun-charts" >
		  <echarts :option="option" style="height: 300px;"></echarts>
	  </view>
	</view>
  </div>
</template>

<script>
import echarts from "@/components/echarts/echarts.vue";
export default {
  data() {
    return {
		option: {
			notMerge: true, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					label: {
						backgroundColor: "#6a7985"
					}
				},
				positionStatus: true, // 自定义变量：是否防止tooltip超出画布
				formatterStatus: true, // 自定义变量：是否格式化tooltip，设置为false时下面三项均不起作用
				formatterUnit: 'mg/l', // 自定义变量：数值后面的单位
				formatFloat2: true, // 自定义变量：是否格式化为两位小数
				formatThousands: true // 自定义变量：是否添加千分位
			},
			title: {
				text: '余氯/二氧化氯变化对比分析图',
				subtext: '正常范围0.1-0.5',
				left: 'center',
				align: 'right'
			},
			
			grid: {
				left: "5%",
				right: "8%",
				bottom: "5%",
				containLabel: true
			},
			xAxis: [{
				type: "category",
				boundaryGap: false,
				data:  []
			}],
			yAxis: [{
				type: "value",
				name: '单位（mg/l）',
				// max:0.6,
				// min:0
			}],
			series:[{
					type: "line",
					markLine: {
						data: [
							{name: '余氯最低值',yAxis: 0.3,label: {normal: {position: 'end',formatter: '最低范围值'}}},
							{name: '余氯最低值',yAxis: 0.5,label: {normal: {position: 'end',formatter: '最高范围值'}}}
						]
					},
					data: []
				}
			]
		},
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
	  arrays: [
		"正常范围0.3-0.5",
		"正常范围6.5-8.5",
		"正常范围≤0.7",
		"正常范围≤1"
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
	  name:"余氯 /二氧化氯(mg/l)",
	  maxs:""
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
	  this.names = this.name;
	  this.indexs =  this.index;
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
		  this.showArea(result)
          uni.hideLoading();
        }
      })
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
    showArea(result){
		var _this = this
		var maxs = "";
		
		var markLines ={};
		if(this.inex == "1"){
			markLines: {
				data: [
					{name: '余氯/二氧化氯最低值',yAxis: 0.3,label: {normal: {position: 'end',formatter: '最低范围值'}}},
					{name: '余氯/二氧化氯最高值',yAxis: 0.5,label: {normal: {position: 'end',formatter: '最高范围值'}}}
				]
			};
			this.maxs = 0.6;
			
		}else if(this.inex == "2"){
			markLines= {
				data: [
					{name: 'PH值最低值',yAxis: 6.5,label: {normal: {position: 'end',formatter: '最低范围值'}}},
					{name: 'PH值最高值',yAxis: 8.5,label: {normal: {position: 'end',formatter: '最高范围值'}}}
				]
			};
			this.maxs = 10;
		}else if(this.inex == "4"){
			markLines= {
				data: [
					{name: '亚氯酸盐最高值',yAxis: 0.7,label: {normal: {position: 'end',formatter: '最高范围值'}}}
				]
			};
			this.maxs = 1;
		}else if(this.inex == "3"){
			markLines= {
				data: [
					{name: '浊度最高值',yAxis: 1,label: {normal: {position: 'end',formatter: '最高范围值'}}}
				]
			};
			this.maxs = 1.5
		}
	  _this.option = {
	  	notMerge: false, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
		title: {
			text: this.names,
			subtext:_this.arrays[this.indexs],
			left: 'center',
			align: 'right'
		},
	  	xAxis: {
	  		type: 'category',
	  		data: _this.times
	  	},
		yAxis: [{
			type: "value",
			name: '单位（mg/l）',
			// max:_this.maxs,
			// min:0
		}],
	  	series: [
		{
	  		name: '今日',
			type: "line",
	  		data: result.month,
	  		color: '#40B8ED',
			markLine: markLines
	  	},{
	  		name: '昨日',
			type: "line",
	  		data: result.day,
	  		color: '#67B54F',
	  	},{
	  		name: '上周',
			type: "line",
	  		data: result.week,
	  		color: '#FD9000',
	  	},{
	  		name: '上月',
			type: "line",
	  		data: result.month,
	  		color: '#FE0202',
	  	},{
	  		name: '上年',
			type: "line",
	  		data: result.year,
	  		color: '#CE64EC',
	  	}]
	  }
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