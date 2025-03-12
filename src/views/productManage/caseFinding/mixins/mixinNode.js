import moment from 'moment'
import { mapGetters } from 'vuex'
import { nodeVideoDouyin, nodeNewsBaidu } from './request'
import { assembleBaiduString } from './utils'
const _ = require('lodash')
const douyinNodeApi = 'https://baidu.f.hokkj.cn'
const baiduSiteNodeApi = 'https://baidu.hokkj.cn'
// const localNodeApi = 'http://127.0.0.1:8000'
export const mixinNode = {
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    // 百度聚合
    async newsBaiduSearch(data, name) {
      const { damedkeyword, pn, industry, domain } = data
      const keyword = `${industry} ${domain} ${damedkeyword}`
      const list = this.$refs.search.newsZixunList
      const index = _.findIndex(list, { accountName: name })
      const website = list[index].webUrl.replace(/^https?\:\/\//i, '')
      const res = await nodeNewsBaidu(`${baiduSiteNodeApi}/url?keyword=${keyword}&website=${website}&pn=${pn}`)
      this.noMoreData = res.data.length < 10
      return assembleBaiduString(res.data, name)
    },

    async getBaiduDodeSearch(data, name) {
      const { damedkeyword, industry, domain } = data
      const keyword = `${industry} ${domain} ${damedkeyword}`
      const list = this.$refs.search.newsZixunList
      const index = _.findIndex(list, { accountName: name })
      const website = list[index].webUrl.replace(/^https?\:\/\//i, '')
      const res = await nodeNewsBaidu(`${baiduSiteNodeApi}/site?keyword=${keyword}&website=${website}`)
      this.noMoreData = true
      return assembleBaiduString(res.data, name)
    },

    async getDouyinNodeSearch(keyword) {
      const list = this.pn > 1 ? this.caseVideoList : []
      try {
        const userId = this.userInfo.userId
        const nodeApiUrl = `${douyinNodeApi}/douyin?keyword=${keyword}&userId=${userId}&pn=${this.pn}`
        const res = await nodeVideoDouyin(nodeApiUrl)
        const { data, status } = res
        this.noMoreData = data.data.length < 6
        if (status === 200) {
          data.data.forEach((item) => {
            list.push({
              platform: '抖音',
              vidoeId: item.aweme_info.aweme_id,
              coverSrc: item.aweme_info.video.cover.url_list[0],
              title: item.aweme_info.desc,
              iframeSrc: 'https://www.douyin.com/video/' + item.aweme_info.aweme_id,
              author: item.aweme_info.author.nickname,
              avatar: item.aweme_info.author.avatar_thumb.url_list[0],
              publishDate: moment(item.aweme_info.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              duration: moment(item.aweme_info.video.duration).format('mm:ss'),
              playNum: item.playNum,
              zanNum: item.aweme_info.statistics.digg_count
            })
          })
        }
      } catch (err) {
        console.log(err)
      }
      return list
    }
  }
}
