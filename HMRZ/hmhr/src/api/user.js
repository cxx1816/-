import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data 手机号+密码的数据对象
 * @returns Promise对象
 */
export function loginAPI(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    // headers:{} axios默认携带请求头Content-Type: 'application/json'
    // Content-Type: 'application/json' ->请求体里参数名和值，会变成JSON字符串格式给后台
    data: data
    // data: {
    //     mobile: data.mobile,
    //     password: data.password
    // }
  })
}

/**
 * 用户-获取用户资料
 * @param {*}
 * @returns {*}
 */
export function getUserProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * 获取用户基本信息
 * @returns  Promise对象(axios留下的)
 */
export function getProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取员工基本信息(只为了拿到员工头像)
 */
export function getUserPhotoAPI(id) {
  return request({
    url: `/sys/user/${id}` // 把员工的id值，带在路径上传递给后台
    // method: 'GET' // method默认请求方式就是'GET'(可写可不写)
  })
}
