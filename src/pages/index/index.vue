<template>
	<view class="content">
		<view>
			<div class="index_img">
				<image style="width:100%;height:100%;" src="/static/img/banner.png" alt="" srcset=""></image>
			</div>
			
			<div class="list">
				<navigator :url="'/pages/Real_time/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/ss.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">实时监测</span>
				</div>
				</navigator>
				<navigator :url="'/pages/history/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/history.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">历史数据</span>
				</div>
				</navigator>
				<navigator :url="'/pages/tendency/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/trend.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">趋势分析</span>
				</div>
				</navigator>
				<navigator :url="'/pages/together/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/with.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">同期对比</span>
				</div>
				</navigator>
			</div>
			<div class="list list_action">
				<navigator :url="'/pages/task_enact/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/rinse.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">任务制定</span>
				</div>
				</navigator>
				<navigator :url="'/pages/rinse_record/index'">
					<div class="index_center">
						<p class="index_name">
							<image src="/static/record.svg" alt="" srcset=""></image>
						</p>
						<span class="index_worde">提交清洗记录</span>
					</div>
				</navigator>
				<navigator :url="'/pages/clean/index'">
					<div class="index_center">
						<p class="index_name">
							<image  src="/static/clean.svg" alt="" srcset=""></image>
						</p>
						<span class="index_worde">清洗记录</span>
					</div>
				</navigator>
				<navigator :url="'/pages/task/index'">
				<div class="index_center">
					<p class="index_name">
						<image src="/static/task.svg" alt="" srcset=""></image>
					</p>
					<span class="index_worde">任务记录</span>
				</div>
				</navigator>
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
		},
		methods: {

		}
	}
</script>

<style scoped>
.index_img{
	width: 692upx;
	height: 332upx;
	margin: 30upx auto 30upx;
}
.index_center{
	width: 180upx;
	height: 136upx;
	display: inline-block;
	font-family: PingFangSC-Medium;
	font-size: 28upx;
	color: #3A444A;
	text-align: center;
}
.list{
	display: flex;
	justify-content:center;
}
.index_name{
	width:90upx ;
	height: 90upx;
	margin: 0 auto;
}
.index_name image{
	width: 100%;
	height: 100%;
}
.index_worde{
	width:168upx;
	height:40upx;
	display:block;
	margin: 0 auto;
}
.list_action{
	margin-top: 20upx;
}
</style>
