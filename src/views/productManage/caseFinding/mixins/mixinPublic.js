import moment from 'moment'
import Cookies from 'js-cookie'
const key = 'c3b6a6a563290dc4a394eed21631e352ff26d2aa76240471a7caf31d'
import { whosecardDouyin, whosecardWeixin, whosecardKuaishou, whosecardXiaohongshu, publicVideoHaokan, publicVideoBilibili } from './request'
export const mixinPublic = {
  data() {
    return {
      weixinPn: 0,
      douyinPn: 0,
      baiduPn: 1,
      kuaishouPn: { pcursor: '', ussid: '' }
    }
  },
  methods: {
    // 微信公众号聚合
    async newsWeixinSearch(data) {
      const list = this.pn > 1 ? this.caseNewsList : []
      try {
        const pn = this.pn === 1 ? 1 : this.weixinPn
        const { weixinChecks, damedkeyword } = data
        const account = weixinChecks.join(',')
        const url = `https://api.whosecard.com/api/wx/article/search?keyword=${damedkeyword}&accountName=${account}&key=${key}&count=40&start=${pn}`
        const res = await whosecardWeixin(url)
        const { ok, result } = res.data
        this.weixinPn = result?.nextStart
        if (ok) {
          result.items.forEach((item) => {
            list.push({
              platform: 'weixin',
              title: item.title,
              desc: item.content,
              coverSrc: item.cover,
              link: item.url,
              releasTime: item.publishedDate,
              account: item.accountName,
              author: item.author
            })
          })
        }
      } catch (err) {
        console.log(err)
      }
      return list
    },
    async baiduSearch(keyword) {
      const list = this.baiduPn > 1 ? this.caseVideoList : []
      try {
        const url = `/baidu/web/search/api?pn=${this.pn}&rn=20&type=video&query=${keyword}`
        Cookies.set('BAIDUID', '0559F07E3D97959D297A207A26A36183')
        Cookies.set('FG', '1')
        const res = await publicVideoHaokan(url)
        const { data, errmsg } = res.data
        this.noMoreData = data.list.length < 10
        if (errmsg === '成功') {
          this.baiduPn = data.pn
          data.list.forEach((item) => {
            list.push({
              platform: '百度视频',
              vidoeId: item.vid,
              coverSrc: item.cover_src,
              title: item.title,
              iframeSrc: item.url,
              author: item.author,
              publishDate: item.publishTimeText,
              duration: item.duration,
              playNum: item.read_num,
              zanNum: ''
            })
          })
        }
      } catch (err) {
        console.log(err)
      }
      return list
    },
    async douyinSearch(keyword) {
      const list = this.pn > 1 ? this.caseVideoList : []
      const pn = this.pn === 1 ? 1 : this.douyinPn
      const whosecardUrl = `https://api.whosecard.com/api/douyin/aweme/search?search_source=video_search&cursor=${pn}&keyword=${keyword}&key=${key}`
      try {
        const res = await whosecardDouyin(whosecardUrl)
        const { ok, result } = res.data
        this.noMoreData = result?.cursor < result.aweme_list.length
        this.douyinPn = result?.cursor
        if (ok) {
          result.aweme_list.forEach((item) => {
            list.push({
              platform: '抖音',
              vidoeId: item.aweme_id,
              coverSrc: item.video.cover.url_list[0],
              title: item.desc,
              iframeSrc: `https://www.douyin.com/video/${item.aweme_id}`,
              author: item.author.nickname,
              publishDate: moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              duration: moment(item.duration).format('mm:ss'),
              playNum: '',
              zanNum: item.statistics.digg_count
            })
          })
        }
      } catch (err) {
        console.log(err)
      }
      return list
    },
    async kuaishouSearch(keyword) {
      const list = this.pn > 1 ? this.caseVideoList : []
      try {
        const pn = this.pn === 1 ? { pcursor: '', ussid: '' } : this.kuaishouPn
        const urlPn = this.pn > 1 ? `&pcursor=${pn.pcursor}&ussid=${pn.ussid}` : ''
        const url = `https://api.whosecard.com/api/kuaishou/search?key=${key}&search_type=feed&keyword=${keyword}${urlPn}`
        const res = await whosecardKuaishou(url)
        const { ok, result } = res.data
        const { pcursor, ussid } = result
        this.kuaishouPn = {
          pcursor,
          ussid
        }
        this.noMoreData = result.feeds.length < 10
        if (ok) {
          result.feeds.forEach((item) => {
            list.push({
              platform: '快手',
              vidoeId: item.photoId,
              coverSrc: item.coverUrls[0].url,
              title: item.caption,
              iframeSrc: item.mainMvUrls[0].url,
              author: item.userName,
              publishDate: moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
              duration: moment(item.duration).format('mm:ss'),
              playNum: item.viewCount,
              zanNum: ''
            })
          })
        }
      } catch (err) {
        console.log(err)
      }
      return list
    },
    async xiaohongshuSearch(keyword) {
      const list = this.pn > 1 ? this.caseVideoList : []
      const url = `https://api.whosecard.com/api/xiaohongshu/search/notes/v1?keyword=${keyword}&key=${key}&page=${this.pn}&sort=general&filter_note_type=视频笔记`
      const res = await whosecardXiaohongshu(url)
      const { ok, result } = res.data
      this.noMoreData = result.data.items < 10
      if (ok) {
        result.data.items.forEach((item) => {
          list.push({
            platform: '小红书',
            vidoeId: item.note.id,
            coverSrc: item.note.images_list[0].url,
            title: item.note.desc,
            iframeSrc: item.note.video_info.url,
            author: item.note.user.nickname,
            publishDate: moment(item.note.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
            duration: moment(item.preload_size).format('mm:ss'),
            playNum: '',
            zanNum: item.note.liked_count
          })
        })
      }
      return list
    },
    async bilibiliSearch(keyword) {
      const list = this.pn > 1 ? this.caseVideoList : []
      try {
        const url = `/bibili/x/web-interface/search/type?page=${this.pn}&page_size=40&search_type=video&keyword='${keyword}`
        const res = await publicVideoBilibili(url)
        const { code, data } = res.data
        Cookies.set('main_confirmation', '5rbfDuxKd9tm%2BpzFwX%2BbGJzOPgEKhXPFMuLQRNbFC%2Bo%3D')
        Cookies.set('innersign', '0')
        Cookies.set('buvid3', '042543FD-B652-5D03-D5CA-D146F9820DAE85358infoc')
        this.noMoreData = data.result < 10
        if (code === 0) {
          data.numResults > 0 &&
              data.result.forEach((item) => {
                list.push({
                  platform: 'B站',
                  vidoeId: item.id,
                  coverSrc: item.pic,
                  title: item.title,
                  iframeSrc: item.arcurl,
                  playNum: item.play,
                  zanNum: item.like,
                  publishDate: moment(item.pubdate * 1000).format('YYYY-MM-DD HH:mm:ss'),
                  duration: item.duration,
                  author: item.author
                })
              })
          this.noMoreData = data.result?.length < 40
        }
      } catch (err) {
        console.log(err)
      }
      return list
    }
  }
}
