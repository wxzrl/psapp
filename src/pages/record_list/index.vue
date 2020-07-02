<template>
	<view class="box">
		<view class="box_center" v-for="(item,index) in ResultList" :key='index'>
			<view class="boxs">
				<view class="center_data">
					{{item.warnTime}}
				</view>
				<view class="center_status">
					{{item.warnStatusName}}
				</view>
			</view>
			<view class="box_status">
				<view class="status_site">
					监测点 ： {{item.monitoringPointName}}
				</view>
				<view class="status_site">
					报警类型 ： {{item.warnTypeName}}
				</view>
			</view>
			<view class="button">
				<button v-if='item.warnStatus == "1"' @click="dispose(item.id,1,index)" style="width: 45%; height: 40px;line-height: 40px;margin-top: 15px;" type="primary">处理</button>
				<button v-if='item.warnStatus == "3"' @click="dispose(item.id,3,index)" style="width: 45%;height: 40px;line-height: 40px;margin-top: 15px;" type="primary">查看处理结果</button>
				<button v-if='item.warnStatus == "2"' @click="dispose(item.id,2,index)" style="width: 45%;height: 40px;line-height: 40px;margin-top: 15px;" type="primary">完成</button>
				<button @click="dispose(item.id,4,index)" style="width: 45%;height: 40px;line-height: 40px;margin-top: 15px;" type="primary">短信查看</button>
			</view>
		</view>
		<view class="loading">{{loadingText}}</view>
	</view>
</template>

<script>
export default {
	data(){
		return{
			chargePersonPhone:"",
			loadingText:"加载中...",
			pageNo:1,
			ResultList:[],
			from:{
				id:"",
				warnStatus:""
			}
		}
	},
	onReachBottom(){
		var _self = this
	  if(timer != null){
	   clearTimeout(timer);
	  }
	  var timer = setTimeout(function(){
	   _self.getmorenews();
	  }, 1000);
	},
	onLoad() {
		var _self = this;
		uni.getStorage({
		    key: 'phone',
		    success(res) {
				_self.chargePersonPhone = res.data
				_self.getlist()
		    }
		});
	},
	methods:{
		dispose(id,status,indexs){
			var _self = this
			if(status == 1){
				_self.from.id = id;
				_self.from.warnStatus = 2
				this.$api.savePWarnLog(this.from).then(res=>{
					if(res.data.code == 0){
						_self.getlist()
					}
				})
			}else if(status == 2){
				uni.redirectTo({
					url:`/pages/dispose/index?id=${id}&index=${status}`
				})
			}else if(status == 3){
				uni.redirectTo({
					url:`/pages/dispose/index?id=${id}&index=${status}`
				})
			}else if(status == 4){
				uni.redirectTo({
					url:`/pages/sms/index?id=${id}&index=${status}`
				})
			}
		},
		// 滑到底加载
		getmorenews(){
			var _self = this;
			_self.loadingText = '加载中...';
			uni.showLoading({
				title:"加载中"
			})
			this.$api.findLogList({chargePersonPhone:this.chargePersonPhone,pageNo:_self.pageNo}).then(res=>{
				if(res.data.code == 0){
					uni.hideLoading();
					for(var i in res.data.page.list){
						_self.ResultList.push(res.data.page.list[i])
					}
					_self.loadingText = '已加载全部';
					_self.pageNo++;
				}
			})
		},
		// 进入请求
		getlist(){
			var _self = this;
			_self.pageNo = 1;
			uni.showLoading({
				title:"加载中"
			})
			this.$api.findLogList({chargePersonPhone:_self.chargePersonPhone,pageNo:_self.pageNo}).then(res=>{
				if(res.data.code == 0){
					uni.hideLoading()
					_self.ResultList = res.data.page.list
					_self.pageNo++;
				}
			})
		}
	}
}
</script>

<style scoped>
.box{
	width: 100%;	
}
.box_center{
	width: 660upx;
	height: 290upx;
	padding: 20upx;
	background-color: #f5f5f5;
	box-shadow: 0 0 6px 0 rgba(0,0,0,0.14);
	border-radius: 4px;
	margin: 30upx auto 0;
}
.boxs{
	display: flex;
	justify-content:space-between;
	font-size: 18px;
	color: #000;
}
.status_site{
	margin-top: 20upx;
	font-size: 34upx;
}
.loading{
	text-align:center; 
	line-height:80px;
	font-size: 16px;
}
.button{
	display: flex;
	justify-content:space-between;
}
</style>
