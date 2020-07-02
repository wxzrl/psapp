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
          <canvas id="myChart" class="charts"></canvas>
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
				formatterUnit: '元', // 自定义变量：数值后面的单位
				formatFloat2: true, // 自定义变量：是否格式化为两位小数
				formatThousands: true // 自定义变量：是否添加千分位
			},
			title: {
				text: '余氯/二氧化氯变化对比分析图',
				// subtext: '数据来自西安兰特水电测控技术有限公司',
				// left: 'center',
				// align: 'right'
			},
			// legend: {
			// 	data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
			// },
			// grid: {
			// 	left: "5%",
			// 	right: "8%",
			// 	bottom: "5%",
			// 	containLabel: true
			// },
			xAxis: [{
				type: "category",
				boundaryGap: false,
				data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
			}],
			yAxis: [{
				type: "value",
				name: '单位（mg/l）'
				
			}],
			series: [{
					name: "邮件营销",
					type: "line",
					stack: "总量",
					areaStyle: {},
					markLine: {
						data: [{name: '余氯最低值',yAxis: 200,label: {normal: {position: 'end',formatter: '最低范围值'}}}]
					},
					data: [120, 132, 101, 134, 90, 230, 210]
				}
			]
		},
		
      title: "picker",
      array: ["中国", "美国", "巴西", "日本"],
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
  mounted() {
	  
	  
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
    }
  }
};
</script>

<style scoped>
.qiun-charts {
  width: 750upx;
  height: 500upx;
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