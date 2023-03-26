import request from '@/utils/request'

/**
 * 获取-部门列表-方法
 * @returns Promise对象
 */
export function getDepartmentsListAPI() {
  return request({
    url: '/company/department'
    // method: 'GET'
  })
}

/**
 * 获取-员工简单列表(只有名字和员工id)
 * @returns Promise对象
 */
export function getEmployeesSimpleListAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 *
 * @param {*} data 5对key+value的数据对象
 * @returns Promise对象
 */
export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data: data
    // params:{} //里面的参数和值会出现在url?后面
    // data：{} //里面的参数名和值会出现在请求体body中
  })
}

/**
 * 根据部门id - 获取部门详情
 * @param {*} departId 表示当前要编辑项的id值(部门id)
 * @return {*} Promise对象
 */
export function getDepartDetailAPI(departId) {
  return request({
    url: `/company/department/${departId}`
  })
}

/**
 * 根据 id->更新部门详情
 * @param {*} dataObj  9对key+value参数和值对象
 * @returns Promise对象
 */
export function updateDepartDetailAPI(dataObj) {
  return request({
    url: `/company/department/${dataObj.id}`,
    method: 'PUT',
    data: dataObj
  })
}

/**
 * 根据id->删除某个部门
 * @param {*} departId 部门id
 * @returns Promise对象
 */
export function delDepartAPI(departId) {
  return request({
    url: `/company/department/${departId}`,
    method: 'DELETE'
  })
}
