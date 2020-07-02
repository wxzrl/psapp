import request from '../common/uni.request.js'

const api = {}
const PORT1 = 'baseinfo'
// POST请求方式

// 登录接口 
api.login = params => request.globalRequest(`a/login`, 'POST', params, 1)

// 维护人员与监测点的选择
api.findUserAndPoints = params => request.globalRequest(`a/pslw/pCleanRecord/findUserAndPoints`, 'GET', params, 1)

// 清洁记录列表查询
api.listPCleanRecord = params => request.globalRequest(`a/pslw/pCleanRecord/listPCleanRecord`, 'GET', params, 1)

// 任务列表
api.listPCleanTask = params => request.globalRequest(`a/pslw/pCleanTask/listPCleanTask`, 'GET', params, 1)

// 监测点设备
api.findUserByPoint = params => request.globalRequest(`a/pslw/pFaultRepair/findUserByPoint`, 'GET', params, 1)

// 清洁类型
api.formPCleanTask = params => request.globalRequest(`a/pslw/pCleanTask/formPCleanTask`, 'GET', params, 1)

// 任务定制
api.savePCleanTask = params => request.globalRequest(`a/pslw/pCleanTask/savePCleanTask`, 'GET', params, 1)

// 任务类型，设备状态
api.formPCleanRecord = params => request.globalRequest(`a/pslw/pCleanRecord/formPCleanRecord`, 'GET', params, 1)

// 任务列表
api.listTaskByPointId = params => request.globalRequest(`a/pslw/pCleanTask/listTaskByPointId`, 'GET', params, 1)

// 文件上传接口
api.uploadFile = params => request.globalRequest(`a/pslw/usr/uploadFile`, 'POST', params, 2)

// 清洁记录提交
api.savePCleanRecord = params => request.globalRequest(`a/pslw/pCleanRecord/savePCleanRecord`, 'GET', params, 1)

// 同期对比
api.findMonitoringIndexPC = params => request.globalRequest(`a/pslw/analysis/findMonitoringIndexPC`, 'GET', params, 1)

// 历史数据查询
api.findMonitoringForm = params => request.globalRequest(`a/pslw/analysis/findMonitoringForm`, 'GET', params, 1)

// 趋势查询
api.findCompositeIndex = params => request.globalRequest(`a/pslw/analysis/findCompositeIndex`, 'GET', params, 1)

// 地图请求点位
api.getRealTimeData = params => request.globalRequest(`a/pslw/waterData/getRealTimeData`, 'GET', params, 1)

// 我的消息请求
api.findUserInfo = params => request.globalRequest(`a/pslw/usr/findUserInfo`, 'GET', params, 1)

// 退出登录
api.logout = params => request.globalRequest(`a/pslw/usr/logout`, 'GET', params, 1)

// 处理异常原因
api.formPWarnLog = params => request.globalRequest(`a/pslw/pWarnLog/formPWarnLog`, 'GET', params, 1)

// 处理异常提交
api.savePWarnLog = params => request.globalRequest(`a/pslw/pWarnLog/savePWarnLog`, 'GET', params, 1)

// 预警列表
api.findLogList = params => request.globalRequest(`a/pslw/usr/findLogList`, 'GET', params, 1)

// 查看预警处理结果
api.findWarnLogById = params => request.globalRequest(`a/pslw/pWarnLog/findWarnLogById`, 'GET', params, 1)

// 短信查看
api.findWarnSmsByLogId = params => request.globalRequest(`a/pslw/pWarnSms/findWarnSmsByLogId`, 'GET', params, 1)

// GET请求方式
export default api