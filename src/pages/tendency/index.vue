<template>
  <div>
    <div class="box">
      <div class="rinse_box">
        <div class="rinse">
          <span class="rinse_word">频率：</span>
          <picker
            class="select"
            @change="bindPickerChange"
            :value="index"
            :range="frequencyColumns"
            range-key="text"
          >
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
          <picker
            class="select"
            @change="monitoringChange"
            :value="index"
            :range="array"
            range-key="monitoringPointName"
          >
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
          <span class="rinse_word">开始时间：</span>
          <picker
            class="select"
            mode="date"
            :value="startDates"
            :start="startDate"
            :end="endDate"
            @change="startDateChange"
          >
            <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="startDates" />
          </picker>
        </div>
        <div class="rinse">
          <span class="rinse_word">结束时间：</span>
          <picker
            class="select"
            mode="date"
            :value="endDates"
            :start="startDate"
            :end="endDate"
            @change="endDateChange"
          >
            <input type="text" placeholder="请选择>" class="input_rinse" disabled :value="endDates" />
          </picker>
        </div>
        <div class="inquire" @click="inquire">查询</div>
      </div>
      <!-- 余氯/二氧化氯变化对比分析图 -->
      <view class="box-charts">
        <view class="qiun-charts">
          <echarts :option="option" style="height: 300px;"></echarts>
        </view>
		<view class="qiun-charts">
		  <echarts :option="optionph" style="height: 300px;"></echarts>
		</view>
		<view class="qiun-charts">
		  <echarts :option="optionyax" style="height: 300px;"></echarts>
		</view>
		<view class="qiun-charts">
		  <echarts :option="optionNTU" style="height: 300px;"></echarts>
		</view>
      </view>
    </div>
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
				max:0.6,
				min:0
			}],
			series: [{
					type: "line",
					markLine: {
						data: [
							{name: '余氯/二氧化氯最低值',yAxis: 0.3,label: {normal: {position: 'end',formatter: '最低范围值'}}},
							{name: '余氯/二氧化氯最低值',yAxis: 0.5,label: {normal: {position: 'end',formatter: '最高范围值'}}}
						]
					},
					data: []
				}
			]
		},
		
		optionph: {
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
				text: 'PH值变化对比分析图',
				subtext: '正常范围6.5-8.5',
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
				name: 'PH',
				max:10,
				min:0,
				splitNumber:5
			}],
			series: [{
					type: "line",
					markLine: {
						data: [
							{name: 'PH值最低值',yAxis: 6.5,label: {normal: {position: 'end',formatter: '最低范围值'}}},
							{name: 'PH值最高值',yAxis: 8.5,label: {normal: {position: 'end',formatter: '最高范围值'}}}
						]
					},
					data: []
				}
			]
		},
		
		optionyax: {
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
				text: '亚氯酸盐变化对比分析图',
				subtext: '正常范围≤0.7',
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
				max:1,
				min:0,
			}],
			series: [{
					type: "line",
					markLine: {
						data: [
							{name: '亚氯酸盐最低值',yAxis: 0.7,label: {normal: {position: 'end',formatter: '最高范围值'}}}
						]
					},
					data: []
				}
			]
		},
		
		optionNTU: {
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
				formatterUnit: 'NTU', // 自定义变量：数值后面的单位
				formatFloat2: true, // 自定义变量：是否格式化为两位小数
				formatThousands: true // 自定义变量：是否添加千分位
			},
			title: {
				text: '浊度变化对比分析图',
				subtext: '正常范围≤1',
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
				max:1.5,
				min:0,
				splitNumber:3
			}],
			series: [{
					type: "line",
					markLine: {
						data: [
							{name: '浊度最高值',yAxis: 1,label: {normal: {position: 'end',formatter: '最高范围值'}}}
						]
					},
					data: []
				}
			]
		},
		
		
		
      title: "picker",
      array: ["中国", "美国", "巴西", "日本"],
	  categories:"",
      monitoring_index: "",
      index: "",
      src: "",
      startDates: "",
      endDates: "",
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
      from: {
        end: "",
        start: "",
        range: "",
        ids: ""
      },
      name: ""
    };
  },
  created() {
  	this.inquire();
  },
  onLoad() {
	this.$api.formPCleanTask().then(res=>{
		if(res.data.code == 0){
			this.array = res.data.pMonitoringPointList;
		}
	});
  	this.cWidth=uni.upx2px(750);
  	this.cHeight=uni.upx2px(500);
  	
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    }
  },
  methods: {
    // 时间选择
    bindPickerChange(e) {
      this.index = e.target.value.toString();
      this.from.range = this.frequencyColumns[this.index].value;
    },
    // 时间选择处理
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    // 开始时间选择
    startDateChange(e) {
      this.startDates = e.target.value;
      let d = new Date(e.target.value);
      this.from.start = d.getTime();
    },
    // 结束时间选择
    endDateChange(e) {
      this.endDates = e.target.value;
      let d = new Date(e.target.value);
      this.from.end = d.getTime();
      console.log(this.from);
    },
	// 查询
	inquire(){
		var _this = this;
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
				
				let residual_chlorines = ""
				if(res.data.list.length != 0){
					this.name = res.data.list[0].monitoringPointName;
					for(var i = 0; i < res.data.list.length; i++) {
						if (res.data.list[i].result!=undefined) {
							this.res_chlorine(res.data.list[i].result["iot.water.residual_chlorine"])
							this.res_chlorineph(res.data.list[i].result["iot.water.PH"])
							this.res_chlorineyax(res.data.list[i].result["iot.water.ylsy"])
							this.res_chlorineNTU(res.data.list[i].result["iot.water.turbidity"])
						}
					}
				}
				
			}
		})
	},
	monitoringChange(e){
		this.monitoring_index = e.target.value.toString();
		this.from.ids = this.array[this.monitoring_index].id;
	},
	// 余氯渲染
	res_chlorine(datas){
		let _this = this;
		this.option = {
			notMerge: false, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			xAxis: {
			        type: 'category',
			        data: _this.categories
			    },
			series: [{
				name: '余氯',
				data: datas,
				
			}]
		}
	},
	// ph值渲染    
	res_chlorineph(datas){
		let _this = this;
		this.optionph = {
			notMerge: false, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			xAxis: {
				type: 'category',
				data: _this.categories
			},
			series: [{
				name: 'ph值',
				data: datas,
				
			}]
		}
	},
	// 亚硝酸盐渲染
	res_chlorineyax(datas){
		let _this = this;
		this.optionyax = {
			notMerge: false, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			xAxis: {
				type: 'category',
				data: _this.categories
			},
			series: [{
				name: '亚硝酸盐',
				data: datas,
				
			}]
		}
	},
	// 浊度变化渲染
	res_chlorineNTU(datas){
		let _this = this;
		this.optionNTU = {
			notMerge: false, // 自定义变量：true代表不合并数据，比如从折线图变为柱形图则需设置为true；false或不写代表合并
			xAxis: {
				type: 'category',
				data: _this.categories
			},
			series: [{
				name: '浊度',
				data: datas,
				
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
  margin-bottom: 100upx;
  background-color: #ffffff;
}

.charts {
  width: 750upx;
  height: 500upx;
  background-color: #ffffff;
}
.qiun-title-dot-light {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #4a4a4a;
  letter-spacing: 0;
  margin-left: 20upx;
}
.box-charts {
  margin-bottom: 48upx;
}
.unit {
  position: absolute;
  top: 35px;
  left: 10px;
  z-index: 1;
  font-family: PingFangSC-Regular;
  font-size: 26upx;
  color: #4a4a4a;
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