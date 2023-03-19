// api里统一接口，这样逻辑页面直接引入api,不需要考虑接口方法具体在哪个名字文件里
// 导入所有user.js里按需导出的方法，并按需中转导出
export * from './user.js'
export * from './departments.js'
export * from './setting.js'
export * from './employees.js'
export * from './permission.js'
