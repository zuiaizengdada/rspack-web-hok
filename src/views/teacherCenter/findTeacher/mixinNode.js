import { assembleBaiduString, assembleSogouString, assembleSogouJSON } from './utils'
import { getExternalTeacherListApi, closeDouyinApi, closeBaiduApi, closeSogouApi } from '@/api/tearchCenter/findTearch'
export const mixinNode = {
  data() {
    return {
      apiUrl: {
        'douyin': {
          'development': 'https://baidu.f.hokkj.cn',
          'staging': 'https://baidu.f.hokkj.cn',
          'test': 'https://baidu.f.hokkj.cn',
          'beta': 'https://prod.douyinvideo.hokkj.cn',
          'production': 'https://prod.douyinvideo.hokkj.cn'
        },
        'sougo': {
          'development': 'https://test.sougouvideo.hokkj.cn',
          'staging': 'https://test.sougouvideo.hokkj.cn',
          'test': 'https://test.sougouvideo.hokkj.cn',
          'beta': 'https://prod.sougouvideo.hokkj.cn',
          'production': 'https://prod.sougouvideo.hokkj.cn'
        },
        'baidu': {
          'development': 'https://test.baiduvideo.hokkj.cn',
          'staging': 'https://test.baiduvideo.hokkj.cn',
          'test': 'https://test.baiduvideo.hokkj.cn',
          'beta': 'https://prod.baiduvideo.hokkj.cn',
          'production': 'https://prod.baiduvideo.hokkj.cn'
        }
      }
    }
  },
  destroyed() {
    this.closeDouyinTab()
    this.closeBaiduTab()
    this.closeSogouTab()
  },
  methods: {
    async getBaiduVideoList() {
      const baiduList = []
      if (!this.search.type.includes('1')) {
        return baiduList
      }
      try {
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        // `/baidu/web/search/api?pn=${this.current}&rn=${this.pageSize}&type=video&query=${keyword}`

        // const local = `http://127.0.0.1:7003/baiduVideo?keyword=${keyword}&userId=${this.userInfo.userId}&pn=${this.current}`
        const url = `${this.apiUrl['baidu'][process.env.NODE_ENV]}/baiduVideo?keyword=${keyword}&userId=${this.userInfo.userId}&pn=${this.current}`
        // const url = `https://test.baiduvideo.hokkj.cn/baiduVideo?keyword=${keyword}&userId=${this.userInfo.userId}&pn=${this.current}`
        // eslint-disable-next-line no-undef
        const res = await getExternalTeacherListApi(url)
        return assembleBaiduString(res)
      } catch (err) {
        console.log(err)
      }
      return baiduList
    },
    async getSogouVideoList() {
      const list = []
      if (!this.search.type.includes('2')) {
        return list
      }
      try {
        let keyword = this.search.keyWord
        if (this.search.industry && this.search.industry.length > 0) {
          const industry = this.$refs.cascader.getCheckedNodes(true)[0].label
          keyword = keyword + ' ' + industry
        }
        if (this.search.area !== '') {
          keyword = keyword + ' ' + this.search.area
        }
        // `/baidu/web/search/api?pn=${this.current}&rn=${this.pageSize}&type=video&query=${keyword}`
        // const local = `http://127.0.0.1:7002/sogou?keyword=${keyword}&userId=${this.userInfo.userId}&pn=${this.current}`
        const url = `${this.apiUrl['sougo'][process.env.NODE_ENV]}/sogou?keyword=${keyword}&userId=${this.userInfo.userId}&pn=${this.current}`
        // eslint-disable-next-line no-undef
        const res = await getExternalTeacherListApi(url)
        // return assembleSogouString(res)
        if (res.data.info) {
          return assembleSogouJSON(res.data.data.list)
        } else {
          return assembleSogouString(res)
        }
      } catch (err) {
        console.log(err)
      }
      return list
    },
    async closeDouyinTab() {
      // const url = `http://172.17.82.56:7001/clean?userId=${this.userInfo.userId}`
      const url = `${this.apiUrl['douyin'][process.env.NODE_ENV]}/clean?userId=${this.userInfo.userId}`
      await closeDouyinApi(url)
    },
    async closeBaiduTab() {
      // const url = `http://172.17.82.56:7002/clean?userId=${this.userInfo.userId}`
      const url = `${this.apiUrl['baidu'][process.env.NODE_ENV]}/clean?userId=${this.userInfo.userId}`
      await closeBaiduApi(url)
    },
    async closeSogouTab() {
      // const url = `http://172.17.82.56:7003/clean?userId=${this.userInfo.userId}`
      const url = `${this.apiUrl['sougo'][process.env.NODE_ENV]}/clean?userId=${this.userInfo.userId}`
      await closeSogouApi(url)
    }
  }
}
