const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 返回用户头像
  name: state => state.user.userInfo.username, // 返回用户名
  companyId: state => state.user.userInfo.companyId // 返回公司Id
}
export default getters
