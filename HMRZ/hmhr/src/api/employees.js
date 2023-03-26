import request from '@/utils/request'

/**
 * 获取员工-列表
 * @param {*} params { page:页码，size:条数 }
 * @returns Promise对象
 */
export function getEmployeesListAPI(params) {
  return request({
    url: '/sys/user',
    params
  })
}
/**
 * 新增员工
 * @param {*} data 员工信息对象(7对key+value但有些不是必须传递的)
 * @returns
 */
export function addEmployeesAPI(data) {
  return request({
    url: 'sys/user',
    method: 'POST',
    data
  })
}

/**
 * @description: 导入excel
 * @param {*} data [{}, {}, {}]
 * @return {*}
 */
export function importEmployeeAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
/**
 * 根据员工id,更新员工基本信息
 * @param {*} empObj  员工数据对象
 * @returns Promise对象
 */
export function updateEmployeesAPI(empObj) {
  return request({
    url: `/sys/user/${empObj.id}`,
    method: 'PUT',
    data: empObj
  })
}

/**
 * 给员工 ->分配保存角色
 * @param {*} data { id：员工ID, rolesIds: 角色ID字符串组成数组 }
 * @returns Promise对象
 */
export function saveEmployeesRoleAPI(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
