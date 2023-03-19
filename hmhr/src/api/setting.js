import request from '@/utils/request'

/**
 * 请求 ->所有角色列表
 * @param {*} params {page：页码数，pagesize：每页条数}
 * @returns Promise对象
 */
export function getRoleListAPI(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 根据公司Id获取，公司详细信息
 * @param {*} companyId 公司Id
 * @returns Promise对象
 */
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * @description: 添加角色
 * @param {*} data {name:角色名字,description:角色描述}
 * @return {*} Promise对象
 */
export function addRoleAPI(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * @description: 根据角色ID -> 获取角色详情
 * @param {*} roleId 角色ID值
 * @return {*} Promise对象
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`
  })
}

/**
 * @description: 根据角色id ->更新角色
 * @param {*} roleObj 角色对象
 * @return {*} Promise对象
 */
export function updateRoleAPI(roleObj) {
  return request({
    url: `/sys/role/${roleObj.id}`,
    method: 'PUT',
    data: roleObj

  })
}

/**
 * @description: 根据角色ID->删除角色
 * @param {*} roleId 角色id
 * @return {*} Promise对象
 */
export function deleteRoleAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'DELETE'
  })
}
