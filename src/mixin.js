/*
 * @Author: Aming 17666130388@163.com
 * @Date: 2023-05-23 18:24:04
 * @LastEditors: Aming 17666130388@163.com
 * @LastEditTime: 2023-05-25 18:08:25
 * @FilePath: \h5-hokd:\huoke\web-hok\src\mixin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import store from '@/store'
const searchMixin = {
  methods: {
    // 全局获取页面存储的search
    $getPageSearch() {
      const key = this.$route.fullPath
      const pageSearchData = this.$store?.getters?.pageSearchData[key] || {}
      return pageSearchData
    },
    // 全局修改页面存储的search
    $setPageSearch(data) {
      const key = this.$route.fullPath
      this.$store.dispatch('search/setPageSearch', { [key]: data })
    },
    // 通过字典key 和 value 获取字典表的name
    $getdictName(key, value) {
      // eslint-disable-next-line eqeqeq
      return (
        store?.getters?.dictList[key]?.find(item => item?.value == value)
          ?.label || ''
      )
    },
    $getDictList(key) {
      return store?.getters?.dictList[key] || []
    },
    // 全局获取页面存储的自定义search
    $getPageCustomSearch(data) {
      const key = data
      const pageSearchData = this.$store?.getters?.pageSearchData[key] || {}
      return pageSearchData
    },
    // 全局修改页面存储的自定义search
    $setPageCustomSearch(data, data2) {
      const key = data2
      this.$store.dispatch('search/setPageSearch', { [key]: data })
    }
  }
}
Vue.mixin(searchMixin)
