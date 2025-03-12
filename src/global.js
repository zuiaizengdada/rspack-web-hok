import store from './store'

// 获取所有地区下拉
const getSmsAreaCodesQuery = async () => {
  store.dispatch('global/getSmsAreaCodes')
}

// 获取所有邮箱下拉
const getMailSuffixesQuery = async () => {
  store.dispatch('global/getMailSuffixesList')
}

const globalQuery = () => {
  getSmsAreaCodesQuery()
  getMailSuffixesQuery()
}
export default globalQuery
