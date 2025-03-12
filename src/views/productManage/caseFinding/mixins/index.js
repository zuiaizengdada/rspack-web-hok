import { mixinNode } from './mixinNode'
import { mixinPublic } from './mixinPublic'
export const mixinIndex = {

  mixins: [mixinNode, mixinPublic],
  methods: {
    // 资讯聚合，包含百度和微信公众号，支持两个渠道同时查询
    async newsListSearch(data) {
      const promiseList = []
      let list = []
      try {
        if (data.platfromValue.includes('zxwz')) {
          data.newsChecks.forEach(async (item) => {
            promiseList.push(this.getBaiduDodeSearch(data, item))
          })
        }
        if (data.platfromValue.includes('wxgzh')) {
          data.weixinChecks.length && promiseList.push(this.newsWeixinSearch(data))
        }
        const res = await Promise.all(promiseList)
        // 代码待优化
        res.forEach((item) => {
          list = [...list, ...item]
        })
      } catch (err) {
        console.log(err)
      }
      return list
    },
    // 视频搜索聚合
    async videoListSearch(data) {
      const promiseList = []
      const { damedkeyword, domain, industry } = data
      const keyword = `${industry} ${domain} ${damedkeyword}`
      console.log(keyword, '关键字查询。。。。。')
      if (data.platfromVideoValue.includes('bdsp')) {
        if (data.videoBaiduChecks.length) {
          data.videoBaiduChecks.forEach((name) => {
            promiseList.push(this.baiduSearch(`${name} ${keyword}`))
          })
        } else {
          promiseList.push(this.baiduSearch(keyword))
        }
      }
      if (data.platfromVideoValue.includes('douyin')) {
        if (data.videoDouyinChecks.length) {
          data.videoDouyinChecks.forEach((name) => {
            promiseList.push(this.getDouyinNodeSearch(`${name} ${keyword}`))
          })
        } else {
          promiseList.push(this.getDouyinNodeSearch(keyword))
        }
      }
      if (data.platfromVideoValue.includes('bilibili')) {
        if (data.videoBilibiliChecks.length) {
          data.videoBilibiliChecks.forEach((name) => {
            promiseList.push(this.bilibiliSearch(`${name} ${keyword}`))
          })
        } else {
          promiseList.push(this.bilibiliSearch(keyword))
        }
      }

      if (data.platfromVideoValue.includes('kuaishou')) {
        if (data.videoKuaishouChecks.length) {
          data.videoKuaishouChecks.forEach((name) => {
            promiseList.push(this.kuaishouSearch(`${name} ${keyword}`))
          })
        } else {
          promiseList.push(this.kuaishouSearch(keyword))
        }
      }

      if (data.platfromVideoValue.includes('xiaohongshu')) {
        if (data.videoXiaohongshuChecks.length) {
          data.videoXiaohongshuChecks.forEach((name) => {
            promiseList.push(this.xiaohongshuSearch(`${name} ${keyword}`))
          })
        } else {
          promiseList.push(this.xiaohongshuSearch(keyword))
        }
      }

      // 代码逻辑待优化
      try {
        const res = await Promise.all(promiseList)
        let list = []
        res.forEach((item) => {
          if (item.length) {
            list = [...list, ...item]
          }
        })
        return list
      } catch (err) {
        console.log(err)
      }
    }
  }
}
