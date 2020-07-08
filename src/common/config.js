// let url_config = /api/

let url_config = ''

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    url_config = 'http://192.168.1.7:8182/ps_lwms/'
}else{
    // 生产环境
    url_config = 'http://wqms.joyue-tech.com/ps_lwms/'
}
export default url_config