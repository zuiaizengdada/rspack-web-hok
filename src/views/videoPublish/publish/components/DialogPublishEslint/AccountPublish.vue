<template>
  <div class="account-publish-container">
    <p
      v-if="successNum + failNums != accountPublishList.length"
      class="title text-center"
      style="color: red"
    >
      视频发布中...<span style="font-size: 12px; color: #999999">（关闭窗口不影响发布结果）</span>
    </p>
    <div v-else class="status_box">
      <!--      成功-->
      <img v-if="successNum === accountPublishList.length" :src="status2" />
      <!--      失败-->
      <img v-else-if="failNums === accountPublishList.length" :src="status3" />
      <!--      部分成功-->
      <img v-else :src="status1" />
      <p class="title text-center m-t-12">
        视频发布已完成，成功<span style="color: #00b42a">{{ successNum }}</span>个，失败<span style="color: #f53f3f">{{ failNums }}</span>个！<span
          v-if="successNum === accountPublishList.length"
        >{{ countdownNums }}s后返回~</span>
      </p>
    </div>
    <ul class="account-publish-list">
      <li
        v-for="item in accountPublishList"
        :key="item.account.accountId"
        class="flex items-center justify-between"
      >
        <account-info :account="item.account" class="account-info" />
        <div class="right" style="width: 350px">
          <div class="flex items-center">
            <i
              v-if="loadingVideo"
              class="el-icon-loading"
              style="margin-right: 4px"
            />
            <el-progress
              :percentage="item.progress"
              style="width: 350px"
              :color="item.isError ? 'red' : ''"
            />
          </div>
          <div class="flex" style="margin-top: 4px;">
            <span class="flex-1" :style="item.isError?'color:#F53F3F':''">{{ item.progressDesc }}</span>
            <div v-if="item.isError401" class="continue_publish" @click="continuePublish(item)"><svg-icon icon-class="continuePublish" /><span style="margin-left: 6px;">授权继续发布</span></div>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-if="successNum + failNums != accountPublishList.length"
      class="showInternetStatus"
    >
      <span>当前网络状态：<span
        :class="networkStatus ? 'networkStatus1' : 'networkStatus2'"
      >{{
        networkStatus ? '网络良好' : '已离线，请联系伏羲云IT团队解决'
      }}</span><el-button
        class="m-l-10"
        type="text"
        @click="networkDetection"
      >网络检测<i class="el-icon-d-arrow-right" /></el-button></span>
      <el-button
        v-if="publishStart"
        type="text"
        @click="goReleaseRecord"
      >发布记录<i
        class="el-icon-d-arrow-right"
      /></el-button>
    </div>
    <div
      v-if="successNum + failNums == accountPublishList.length && failNums"
      class="haveFail"
    >
      <el-button type="primary" @click="rePublish">重新发布失败任务</el-button>
      <el-button
        class="goReleaseRecord"
        type="text"
        @click="goReleaseRecord"
      >发布记录<i
        class="el-icon-d-arrow-right"
      /></el-button>
    </div>
  </div>
</template>
<script>
import AccountInfo from './AccountInfo.vue'
import { mapGetters } from 'vuex'
import { checkLogin, updateLoginStatus } from '@/api/videoManagement/accountManage'
import moment from 'moment'
import {
  addPublishTask,
  updatePublishTaskRecord,
  insertYixiaoerPublish
} from '../../api/index'
import { isNewClient, isUseNewClient } from '@/utils'
// import { getHuoshanPosterUrl } from '@/utils'
import status1 from '@/assets/svg/videoManga/status1.svg'
import status2 from '@/assets/svg/videoManga/status2.svg'
import status3 from '@/assets/svg/videoManga/status3.svg'
export default {
  components: {
    AccountInfo
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    sensitiveList: {
      type: Array,
      default: () => []
    },
    token: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      accountPublishList: [],
      taskId: '',
      envList: {
        development: 'https://dev.cloud.hokkj.cn',
        staging: 'https://test.cloud.hokkj.cn',
        test: 'https://test.cloud.hokkj.cn',
        beta: 'https://beta.cloud.hokkj.cn',
        production: 'https://cloud.hokkj.cn'
      },
      status1,
      status2,
      videoStatus: 1,
      networkStatus: true,
      publishStart: false,
      resetArr: [],
      timer: null,
      status3,
      finishVideoId: this.$route.query.finishVideoId,
      merchantData: {},
      successNum: 0,
      countdownNums: 3,
      failNums: 0,
      loadingVideo: true
    }
  },
  computed: {
    ...mapGetters([
      'isUploadVideoSuccess',
      'allChannelSwitch',
      'mediaImitateConfig',
      'fuxiVersion'
    ]),
    getIsUploadVideoSuccess() {
      return this.isUploadVideoSuccess
    }
  },
  watch: {
    list(_list) {
      if (_list.length > 0) {
        this.accountPublishList = []
        // const publishChannelData = JSON.parse(localStorage.getItem('videoPublishChannelData'))
        const publishList = this.publishChannelData.list
        publishList.forEach(item => {
          _list.forEach(_item => {
            if (item.account.accountId === _item) {
              const _obj = {
                ...{
                  progress: 0,
                  progressDesc: '',
                  isComplete: false,
                  publishId: ''
                },
                ...item
              }
              console.log(_obj, '新的数据。。')
              this.accountPublishList.push(_obj)
            }
          })
        })
        this.accountPublishApi()
      }
    },
    token(val) {
      this.merchantData = val
    },
    accountPublishList: {
      handler(list) {
        const isComplete = list.every(item => {
          return item.isComplete === true
        })
        if (isComplete) {
          setTimeout(() => {
            this.$emit('complete')
          }, 2000)
        }
      },
      deep: true
    },
    getIsUploadVideoSuccess: {
      handler(val) {
        if (val) {
          this.accountPublishApi()
        }
      }
    }
  },
  destroyed() {
    this.taskId = ''
  },
  created() {
    this.timer = setInterval(() => {
      this.networkStatus = navigator.onLine
    }, 1000)
    console.log(this.networkStatus, '网络状态。。。')
  },
  inject: ['publishChannelData', 'video', 'publishForm', 'getMerchantToken'],

  methods: {
    // 重新发布失败任务
    rePublish() {
      this.$router.push({
        path:
          '/videoManagement/videoPublish?type=record&finishVideoId=' +
          this.$route.query.finishVideoId +
          '&taskId=' +
          this.taskId,
        query: {
          prevPath: this.$route.path
        }
      })
    },
    // 网络检测
    networkDetection() {
      window.open('https://myplugin.speedtest.cn/#/')
    },
    goReleaseRecord() {
      this.$router.push({
        path: '/videoManagement/releaseRecord'
      })
    },
    isValidData(data) {
      if (data === null || data === undefined) {
        return false
      }
      if (typeof data === 'object' && Object.keys(data).length === 0) {
        return false
      }
      return true
    },
    // 添加发布记录
    async accountPublishApi() {
      const { filePathOrUrl, data } = this.video
      const width = data.width
      console.log(this.video, '视频信息。。。')
      if (filePathOrUrl) {
        const { finishVideoId } = this.$route.query
        const publishChannelData = this.publishChannelData
        const { finishData } = publishChannelData
        console.log(finishData, 'finishData')
        const { videoPublishId, videoPublishAccounts } = finishData
        const { title, cover } = this.publishForm
        const recordReqList = []
        let isWithGoods = 2
        let isWithApplet = 2
        this.taskId = ''
        this.accountPublishList.forEach(item => {
          console.log(item, '发布记录详情')
          videoPublishAccounts.forEach(_item => {
            if (item.account.accountId === _item.accountId) {
              // shoppingCarGoodList platformId=19 抖音
              // shoppingGoods platformId=32 微信视频号
              // goodsRelevanceList platformId=24 快手
              if (_item.platformId === 19) {
                console.log(item.miniApp, '是否有小程序')
                isWithGoods = item?.shoppingCarGoodList?.length > 0 ? 1 : 2
                isWithApplet = item?.miniApp && item?.miniApp !== null ? 1 : 2
              }
              if (_item.platformId === 32) {
                isWithGoods = this.isValidData(item.shoppingGoods) ? 1 : 2
              }
              if (_item.platformId === 24) {
                isWithGoods = this.isValidData(item.goodsRelevanceList) ? 1 : 2
              }
              const timingTime =
                item.publishTimed.type === 1 && item.publishTimed.value
                  ? moment(item.publishTimed.value).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                  : ''
              recordReqList.push({
                accountPublishId: String(_item.accountPublishId),
                accountId: _item.accountId,
                isWithGoods,
                isWithApplet,
                platformId: _item.platformId,
                timingTime,
                title,
                coverDirection: 1
              })
            }
          })
        })
        const data = {
          cover,
          coverDirection: width === 1920 ? 1 : 2,
          finishVideoId,
          recordReqList,
          ids: this.sensitiveList.map(item => item.id),
          title,
          videoPublishId: String(videoPublishId),
          taskId: this.$route.query?.taskId || ''
        }
        console.log(data, '添加发布记录')
        // return
        const publishTaskRes = await addPublishTask(data)
        if (data.ids && data.ids.length > 0) {
          this.$message.success('敏感词已记录')
        }
        this.taskId = publishTaskRes.data.taskId
        // 模拟用户行为
        console.log(
          this.mediaImitateConfig,
          this.accountPublishList,
          '配置信息'
        )
        // 版本小于1.3.2的版本
        if (this.isGreaterThan(this.fuxiVersion, '1.3.2')) {
          this.simulateBehavior()
          this.accountPublish()
          this.loadingVideo = false
        } else {
          console.log('版本小于1.3.0')
          this.accountPublish()
          this.loadingVideo = false
        }
        // return
        // this.accountPublish()
        // this.loadingVideo = false
      }
    },
    isGreaterThan(version1, version2) {
      const parts1 = version1.split('.').map(Number)
      const parts2 = version2.split('.').map(Number)
      for (let i = 0; i < parts1.length; i++) {
        if (parts1[i] > parts2[i]) {
          return true
        } else if (parts1[i] < parts2[i]) {
          return false
        }
      }

      return false
    },
    // 模拟用户行为
    simulateBehavior() {
      this.mediaImitateConfig.forEach(item => {
        this.accountPublishList.forEach(item1 => {
          if (item.platformId === item1.account.platformId) {
            item1.account.urls = item.urls
            item1.account.step = 0
          }
        })
      })
      console.log(this.accountPublishList, 'this.accountPublishList')
      // 轮流调用urls里面的接口 第一个有返回之后再调用第二个
      this.accountPublishList.forEach(item => {
        console.log(item, 'item555555555555555')
        if (!isNewClient(item.account.platformId)) {
          this.emitBehavior(item)
        }
      })
    },
    // 模拟点击
    async emitBehavior(data) {
      console.log(data, 'chufaleyici')
      const obj = {
        platformId: data.account.platformId,
        accountId: data.account.accountId,
        cookie: data.account.cookie,
        merchantToken: this.merchantData.merchantToken,
        // platformAccountId: data.account.platformAccountId,
        url: data.account.urls ? data.account.urls[data.account.step] : '',
        callbackUrl: isNewClient(data.platformId)
          ? this.envList[process.env.NODE_ENV] +
            '/cloud/edata-wemedia/open/callbackUpdateCookie'
          : ''
      }
      console.log(obj, '模拟用户行为参数。。。')
      isUseNewClient(
        obj.platformId,
        'keep-online-sync',
        obj.platformAccountId,
        '模拟用户行为'
      ).emit('keep-online-sync', JSON.stringify(obj), response => {
        const newData = response.data
        console.log(response, '模拟用户行为返回。。。')
        // 根据账号id找到对应的账号 把step+1
        this.accountPublishList.forEach(item => {
          if (item.account.accountId === String(newData.authorId)) {
            item.account.step++
            if (item?.account?.step <= item.account?.urls?.length - 1) {
              this.emitBehavior(item)
            }
          }
        })
        // 所有账号的步骤都走完了 继续下一步
        // const isComplete = this.accountPublishList.every(item => {
        //   console.log(item.account, '当前第几步')
        //   return item.account.step === item.account.urls.length
        // })
        // if (isComplete) {
        //   this.accountPublish()
        //   this.videoStatus = 2
        //   this.loadingVideo = false
        // }
      })
      // window.videoPublishSocket.on('keep-online-complete', async data => {
      //   console.log(JSON.parse(data), 'keep-online-complete')
      // })
    },
    accountPublish() {
      const { filePathOrUrl } = this.video
      const jPlatforms = []
      this.accountPublishList.forEach(item => {
        const publishTimedValue = item.publishTimed.value
          ? moment(item.publishTimed.value).format('YYYY-MM-DD HH:mm:ss')
          : null
        const prePubTime =
          item.publishTimed.type === 1 ? publishTimedValue : null
        //
        const cover = item.cover || this.publishForm.cover
        console.log(cover, '封面。。。')
        const commonJPlatforms = {
          platformAccountId: item.account.platformAccountId, // 平台对应的账号
          title: item.title, // 内容标题
          desc: item.intro, // 内容描述/简介
          // covers: [item.cover], // 内容封面 Array<string>
          covers: [cover], // 内容封面 Array<string>
          platformId: item.account.platformId, // 自媒体平台id
          cookie: item.account.cookie, // 发布作品的平台cookie了
          taskId: this.taskId, // 标识是那一次发文
          prePubTime, // 定时发布时间
          authorId: item.account.accountId,
          authorName: item.account.name,
          visibilityType: item.openScope
        }
        console.log(commonJPlatforms, 'commonJPlatforms')
        // 抖音
        if (item.account.platformId === 19) {
          console.log(item, '抖音渠道')
          const topics = []
          if (item.topic.length) {
            if (item.topic.length > 5) {
              item.topic = item.topic.slice(0, 5)
            }
            item.topic.forEach(item => {
              topics.push(item.value)
            })
          }
          // 购物车数据组装
          if (
            item?.shoppingCarGoodList &&
            item.shoppingCarGoodList.length > 0
          ) {
            console.log(item.shoppingCarGoodList, '购物车数据组装')
            item.shoppingCarGoodList.forEach(ele => {
              ele.text = ele?.yixiaoerName || ele.name
              ele.value = ele?.yixiaoerId || ele.id
              ele.logo =
                (ele?.yixiaoerImage && ele?.yixiaoerImage[0]) || ele.image[0]
              ele.price = ele?.yixiaoerPrice || ele.price
              ele.bonus = ele?.yixiaoerBonus || ele.bonus
              ele.platLogo = ele?.platImage || ele.platLogo
            })
          }
          const collection =
            item.collectionList && item.collectionList.length > 0
              ? item.collectionList[0]
              : []
          let obj = {
            ...commonJPlatforms,
            // collection: item.collectionList, // 合集
            collection, // 合集-第几集
            secondCollection:
              collection.child && collection?.child?.length >= 1
                ? collection?.child[0]
                : [],
            // miniApp: null, // 小程序
            mentionedUser: item.friends || [], // 好友
            topics,
            hotSentence:
              item.hotSentence && item.hotSentence?.name
                ? item.hotSentence?.name
                : '', // 需要关联的热点名称
            allownDownload: item.isOtherSave, // 是否允许他人保存 默认0  不允许 1 允许
            shouldSync: item.isSyncOtherPlatform ? 1 : 0 // 是否将视频同步到西瓜/头条，0 表示不同步，1表示同步到
          }
          // 1添加地址 2添加购物车
          if (item.tiktokLabel === 1) {
            // 地址
            const obj1 = {
              poiId: item.address.length > 0 && item.address[0].poi_id, // 地理位置id
              poiName: item.address.length > 0 && item.address[0].poi_name // 地理位置名称
            }
            obj = { ...obj1, ...obj }
          } else if (item.tiktokLabel === 2) {
            // 购物车
            const obj2 = {
              goods:
                item.shoppingCarGoodList.length > 0
                  ? item.shoppingCarGoodList
                  : [] // 购物车商品
            }
            obj = { ...obj2, ...obj }
          } else {
            // 小程序
            const obj3 = {
              miniApp: item.miniApp ? item.miniApp : null // 购物车商品
            }
            obj = { ...obj3, ...obj }
          }
          jPlatforms.push(obj)
        }
        // Tiktok
        if (item.account.platformId === 20) {
          console.log(item, 'Tiktok')
          const topics = []
          if (item.topic.length) {
            if (item.topic.length > 5) {
              item.topic = item.topic.slice(0, 5)
            }
            item.topic.forEach(item => {
              topics.push(item.value)
            })
          }
          const obj = {
            ...commonJPlatforms,
            mentionedUser: item.friends || [], // 好友
            topics
          }
          jPlatforms.push(obj)
        }
        // 快手
        if (item.account.platformId === 24) {
          let topics = []
          item.topic.length &&
            item.topic.forEach(item => {
              topics.push(item.value)
            })
          if (topics.length > 3) {
            topics = topics.slice(0, 3)
          }
          const arr = []
          item.friends.length &&
            item.friends.forEach(item => {
              arr.push(JSON.stringify(item))
            })
          const openScopeMap = new Map([
            [1, 2],
            [2, 4],
            [0, 1]
          ])
          jPlatforms.push({
            ...commonJPlatforms,
            mentionedUser: arr,
            topics,
            poiId: item.address.length > 0 ? item.address[0].poi_id : null, // 地址编号1
            latitude: item.address.length > 0 ? item.address[0].latitude : null, //   纬度
            longitude:
              item.address.length > 0 ? item.address[0].longitude : null, // 经度
            location: item.address.length > 0 ? item.address[0].poi_name : null,
            goods: [item.goodsRelevanceList],
            denyDownload:
              Number(
                item.personalizedSettingType &&
                  item.personalizedSettingType.includes('2')
              ) || 0, // 是否禁止他人下载视频 1禁止下载 0 允许下载
            allowSameFrame:
              Number(
                item.personalizedSettingType &&
                  item.personalizedSettingType.includes('1')
              ) || 0, // 是否允许拍同框 1允许 0不允许
            disableNearbyShow:
              Number(
                item.personalizedSettingType &&
                  item.personalizedSettingType.includes('3')
              ) || 0, // 是否在同城不显示视频  1 在同城不显示 0显示
            visibilityType: openScopeMap.get(item.openScope), // 1为公开，2为私密,4好友可见
            categoryName:
              item.classifyList &&
              item.classifyList.length > 0 &&
              item.classifyList[0]
                ? item.classifyList[0]?.nameValue
                : null, // 一级分类id
            subCategoryName:
              item.classifyList &&
              item.classifyList.length > 0 &&
              item.classifyList[1]
                ? item.classifyList[1].nameValue
                : null // 二级分类id
          })
        }
        // 小红书
        if (item.account.platformId === 31) {
          const topics = []
          item.topic.length &&
            item.topic.forEach(e => {
              // 没有id的时候去查
              if (!e.id) {
                const { platformId, cookie, platformAccountId } = item.account
                const params = {
                  platformId,
                  platformAccountCookie: cookie,
                  platformAccountToken: this.getMerchantToken,
                  platformAccountId,
                  newVersion: this.allChannelSwitch[platformId],
                  mediaTypeEnum: 'MiniVideo', // Video Article MiniVideo
                  dataType: 2, // 1好友 2话题 3热点
                  keyWord: e.value // 搜索关键词
                }
                isUseNewClient(platformId, 'get-mediaTopicInfo', platformAccountId, '获取好友/话题/热点').emit(
                  'get-mediaTopicInfo',
                  JSON.stringify(params),
                  response => {
                    const result = JSON.parse(response)
                    // this.$store.dispatch('settings/insertApiStat', {
                    //   apiUrl: 'get-mediaTopicInfo',
                    //   platformAccountId: platformAccountId,
                    //   remark: '获取好友/话题/热点'
                    // })
                    if (result.messageType === '0') {
                      // 查出来没有的值
                      if (
                        result.dataBody.filter(n => e.value === n.title)
                          .length < 1
                      ) {
                        this.$set(
                          commonJPlatforms,
                          'desc',
                          commonJPlatforms.desc + ` # ${e.value}`
                        )
                      }
                      result.dataBody.forEach(item => {
                        if (e.value === item.title) {
                          topics.push({
                            value: item.title,
                            name: item.title,
                            title: item.title,
                            id: item.id,
                            link: item.link
                          })
                        }
                      })
                    }
                  }
                )
              } else {
                topics.push(e)
              }
            })
          item.friends.forEach(item => {
            delete item.userName
            item.poi_id = item.id
            item.poi_name = item.name
            item.topicId = item.id
            item.topicName = item.name
          })
          setTimeout(() => {
            jPlatforms.push({
              ...commonJPlatforms,
              location: item.address[0] ? JSON.stringify(item.address[0]) : '',
              mentionedUser: item.friends,
              Topic: topics,
              visibilityType: item.openScope // 1为公开，2为私密
            })
          }, 500)
        }
        // 视频号
        if (item.account.platformId === 32) {
          const { width, height } = this.video.data
          const topics = []
          item?.topic?.forEach(item => {
            const topicValue = item.value.trim()
            const valueIndex = topicValue.indexOf('#')
            const value =
              valueIndex > -1
                ? topicValue.substring(1, topicValue.length)
                : topicValue
            topics.push(value)
          })
          const arr = []
          item?.wechartFriend?.forEach(item => {
            arr.push(item.name)
          })
          let location = null
          if (item.address) {
            location = item.address[0] || null
          }
          // 兼容活动字段自研客户端
          let joinActivit = null
          if (item.isJoinActivity && item.isJoinActivity.length >= 1) {
            if (isNewClient(item.account.platformId)) {
              item.isJoinActivity.forEach((item) => {
                item.hokId = item.yixiaoerId
                item.hokName = item.yixiaoerName
              })
            }
            joinActivit = item.isJoinActivity[0]
          }
          console.log(item.shoppingGoods, '商品')
          // 兼容商品字段自研客户端
          if (item.shoppingGoods) {
            if (isNewClient(item.account.platformId)) {
              item.shoppingGoods.hokId = item.shoppingGoods.yixiaoerId
              item.shoppingGoods.hokName = item.shoppingGoods.yixiaoerName
              item.shoppingGoods.hokImage = item.shoppingGoods.yixiaoerImage
            }
          }
          setTimeout(() => {
            jPlatforms.push({
              ...commonJPlatforms,
              location: location,
              openlinkurl: item.extendLink,
              isOriginal: item.isOriginal ? Number(item.isOriginal) : 0,
              mentionUserList: arr,
              activity: joinActivit,
              topics,
              goods: [item.shoppingGoods],
              height, //  微信视频号必填
              width //  微信视频号必填
              // duration: '' // 视频时长（秒）
            })
          }, 500)
          console.log(jPlatforms, 'jPlatforms')
        }
        // B站
        if (item.account.platformId === 15) {
          let tags = []
          // item.tags && item.tags.length && item.tags.forEach(_item => {
          //   tags.push(_item.name)
          // })
          item?.topic?.forEach(item => {
            tags.push(item.value.trim())
          })
          if (tags.length > 10) {
            tags = tags.slice(0, 10)
          }
          jPlatforms.push({
            ...commonJPlatforms,
            copcopyright: item.isSelfControl ? 1 : 0, // 声明自制(否时为转载)  1:开启 0:关闭
            outUrl: !item.isSelfControl ? item.isSelfUrl || null : null, // 当没有申明自制时，需要注明转载地址
            tags,
            activityName:
              item?.joinActivities?.length >= 1
                ? item.joinActivities[0].name
                : '',
            activityId:
              item?.joinActivities?.length >= 1
                ? item.joinActivities[0].id
                : '',
            categoryId:
              item.classifyList &&
              item.classifyList.length &&
              item.classifyList[0], // 一级分类id
            subCategoryId:
              item.classifyList &&
              item.classifyList.length &&
              item.classifyList[1] // 二级分类id
          })
        }
        // 新老版接口控制
        setTimeout(() => {
          jPlatforms.forEach(item => {
            console.log(item, 'xinlaojiekou')
            item.newVersion = this.allChannelSwitch[item.platformId]
          })
        }, 500)
      })
      setTimeout(() => {
        const { title, intro } = this.publishForm
        const { width, height } = this.video.data
        const newJPlatforms = []
        // const oldJPlatforms = []
        // 发布之前判断jPlatforms有没有
        jPlatforms.forEach(ele => {
          if (isNewClient(ele.platformId)) {
            newJPlatforms.push(ele)
            this.$store.dispatch('settings/insertApiStat', {
              apiUrl: 'publish',
              platformAccountId: ele.platformAccountId,
              remark: '平台发布',
              type: 2
            })
            this.$store.dispatch('settings/insertApiStat', {
              apiUrl: 'publish-status',
              platformAccountId: ele.platformAccountId,
              remark: '监听发布状态',
              type: 2
            })
          }
          //  else {
          //   oldJPlatforms.push(ele)
          //   this.$store.dispatch('settings/insertApiStat', {
          //     apiUrl: 'publish',
          //     platformAccountId: ele.platformAccountId,
          //     remark: '平台发布'
          //   })
          //   this.$store.dispatch('settings/insertApiStat', {
          //     apiUrl: 'publish-status',
          //     platformAccountId: ele.platformAccountId,
          //     remark: '监听发布状态'
          //   })
          // }
        })
        const publishData = {
          mediaContentType: height > width ? 'MiniVideo' : 'Video',
          title,
          content: intro,
          filePathOrUrl: filePathOrUrl,
          callbackUrl:
            this.envList[process.env.NODE_ENV] +
            '/cloud/edata-wemedia/open/callbackPublishResult',
          merchantToken: this.merchantData.merchantToken
        }
        const newPublishData = { ...publishData, jPlatforms: newJPlatforms }
        // const oldPublishData = { ...publishData, jPlatforms: oldJPlatforms }
        console.log(
          JSON.stringify(publishData),
          publishData,
          '提交参数。。。。'
        )
        try {
          insertYixiaoerPublish({
            taskId: this.taskId,
            content: JSON.stringify({ ...publishData, jPlatforms })
          })
        } catch (error) {
          console.log(error)
        }
        if (newPublishData.jPlatforms.length > 0) {
          console.log(newPublishData, '新版参数')
          window.videoPublishNewSocket.emit(
            'publish',
            JSON.stringify(newPublishData),
            response => {}
          )
          this.socketPublishProgress(window.videoPublishNewSocket)
          this.socketPublishStatus(window.videoPublishNewSocket)
        }
        // if (oldPublishData.jPlatforms.length > 0) {
        //   console.log(oldPublishData, '老版参数')
        //   window.videoPublishSocket.emit(
        //     'publish',
        //     JSON.stringify(oldPublishData),
        //     response => {}
        //   )
        //   this.socketPublishProgress(window.videoPublishSocket)
        //   this.socketPublishStatus(window.videoPublishSocket)
        // }
      }, 1000)
    },
    // 监听发布进度
    socketPublishProgress(mySocket) {
      mySocket.on('publish-progress', data => {
        const publishProgressRes = JSON.parse(data)
        if (publishProgressRes.code === 200) {
          this.publishStart = true
          this.accountPublishList.forEach(item => {
            console.log(item, publishProgressRes, '监听发进度。。。。')
            if (
              String(item.account.platformAccountId) ===
              String(publishProgressRes.platformAccountId)
            ) {
              if (this.taskId === publishProgressRes.taskId) {
                const str = publishProgressRes.data.msg
                let newProgress = 30
                // 是否有'/'
                if (str.includes('/')) {
                  const matches = str.match(/\d+/g)
                  const num1 = parseInt(matches[0])
                  const num2 = parseInt(matches[1])
                  const value = Math.max(
                    30,
                    Math.min(90, 30 + 60 * (num1 / num2))
                  )
                  newProgress = value.toFixed(0)
                }
                let progress
                if (
                  publishProgressRes.data.progress >= 30 &&
                  publishProgressRes.data.progress < 90
                ) {
                  progress =
                    Number(publishProgressRes.data.progress) !== 30
                      ? Number(publishProgressRes.data.progress.toFixed(0))
                      : Number(newProgress)
                } else {
                  progress = Number(publishProgressRes.data.progress.toFixed(0))
                }
                // const progressDesc = publishProgressRes.data.msg
                const progressDesc = '发布中...'
                // const recordData = {
                //   accountId: item.account.accountId,
                //   platformId: item.account.platformId,
                //   progress,
                //   progressDesc,
                //   status: -11,
                //   taskId: this.taskId
                // }
                this.$set(item, 'progress', progress)
                item.progress = progress
                item.progressDesc = progressDesc
                item.isError = false
                // this.updatePublishTaskRecordApi(recordData)
              }
            }
          })
        }
      })
    },
    // 监听发布状态
    socketPublishStatus(mySocket) {
      //  console.log(data, '发布状态参数。。。')
      console.log('监听发布状态111')
      mySocket.on('publish-status', data => {
        this.accountPublishList.forEach(item => {
          const publishStatusRes = JSON.parse(data)
          console.log(publishStatusRes, '监听发布状态.......')
          if (publishStatusRes.code === 200) {
            if (
              item.account.platformAccountId ===
              publishStatusRes.platformAccountId
            ) {
              if (this.taskId === publishStatusRes.taskId) {
                console.log('执行了1次')
                // const { publishId, resultInfo } = publishStatusRes.data
                const { publishId } = publishStatusRes.data
                item.publishId = publishId
                item.progressDesc = '发布成功'
                this.successNum++
                this.checkIsComplete(publishStatusRes.taskId)
                // this.updatePublishTaskRecordApi({
                //   accountId: item.account.accountId,
                //   platformId: item.account.platformId,
                //   publishId,
                //   resultDesc: resultInfo,
                //   status: 0,
                //   // publishTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                //   taskId: this.taskId
                // })
                this.$uweb &&
                  this.$uweb.setAction('Event_videoPublish_successNumber')
              }
            }
          } else {
            if (
              item.account.platformAccountId ===
              publishStatusRes.platformAccountId
            ) {
              if (this.taskId === publishStatusRes.taskId) {
                // 重新登录发布处理
                if (publishStatusRes.code === 401) {
                  const resetObj = {
                    id: publishStatusRes.id,
                    mainTaskId: publishStatusRes.mainTaskId,
                    taskId: publishStatusRes.taskId,
                    oldData: publishStatusRes.data.TaskHeaderInput,
                    data: item
                  }
                  // 返回401错误的时候把cookie重置
                  updateLoginStatus({
                    cookie: '[]',
                    loginStatus: 1,
                    platformAccountId: item.account.platformAccountId,
                    remark: '错误401时重置cookie',
                    type: 2
                  })
                  // this.resetArr里面有没有这条 有就替换  没有就push进去
                  const index = this.resetArr.findIndex(item => item.id === resetObj.id)
                  if (index > -1) {
                    this.resetArr.splice(index, 1, resetObj)
                  } else {
                    this.resetArr.push(resetObj)
                  }
                  item.isError401 = true
                }
                item.isError = true
                item.progressDesc = publishStatusRes.message
                item.taskId = publishStatusRes.taskId
                this.failNums++
                this.checkIsComplete()
                console.log(item, '发布失败当前账号信息。。。。')
              }
            }
          }
        })
        this.socketGetPublishStatus(mySocket)
      })
    },
    // 获取发布参数
    getResetPublishData(data) {
      const { title, intro } = this.publishForm
      const { width, height } = this.video.data
      const { filePathOrUrl } = this.video
      const publishData = {
        mediaContentType: height > width ? 'MiniVideo' : 'Video',
        title,
        content: intro,
        filePathOrUrl: filePathOrUrl,
        callbackUrl:
            this.envList[process.env.NODE_ENV] +
            '/cloud/edata-wemedia/open/callbackPublishResult',
        merchantToken: this.merchantData.merchantToken
      }
      return { ...publishData, jPlatforms: [data] }
    },
    // 重新登录继续发布
    continuePublish(item) {
      console.log(item, '点击的item')
      // 登录账号
      const params = {
        accountId: item.account.accountId,
        platformId: item.account.platformId,
        merchantToken: this.getMerchantToken,
        cookie: null,
        newVersion: this.allChannelSwitch[item.account.platformId],
        authorizationModel: true
      }
      console.log(params, '登录账号参数。。。')
      this.$store.dispatch('videoManage/saveErrorInfo', {
        platformAccountId: item.account.platformAccountId,
        requestParam: item.account.cookie,
        planId: item.account.platformId,
        apiUrl: 'account-login',
        errorInfo: '登录之前的日志记录'
      })
      isUseNewClient(item.account.platformId, 'account-login', '', '登录自媒体账号').emit('account-login', JSON.stringify(params), (response) => {
        console.log(JSON.parse(response), '账号登录返回参数。。。')
        const loginObj = JSON.parse(response)
        if (loginObj.code === 200) {
          this.$store.dispatch('videoManage/saveErrorInfo', {
            platformAccountId: item.account.platformAccountId,
            requestParam: loginObj.data.cookie,
            planId: item.account.platformId,
            apiUrl: 'account-login',
            errorInfo: '登录之后的日志记录'
          })
          //  登录返回的信息
          const paramsSecord = {
            authorId: loginObj.data.authorId,
            platformAccountId: item.account.platformAccountId
          }
          checkLogin(paramsSecord).then(res => {
            const obj = {
              cookie: loginObj.data.cookie,
              loginStatus: 2,
              platformAccountId: item.account.platformAccountId,
              name: loginObj.data.name,
              avatar: loginObj.data.avatar,
              remark: '登录自媒体账号',
              type: 2
            }
            updateLoginStatus(obj).then(res => {})
            // 重新发布
            const arr = this.resetArr.filter((ele) => ele.mainTaskId === `${item.taskId}-${item.account.platformAccountId}`)
            console.log(this.resetArr, arr, '重新发布列表')
            const filterData = arr[0]
            const resetObj = filterData.oldData
            resetObj.id = filterData.id
            resetObj.mainTaskId = filterData.mainTaskId
            resetObj.cookie = loginObj.data.cookie
            const publishData = this.getResetPublishData(resetObj)
            console.log(publishData, '发布参数')
            this.failNums--
            item.isError = false
            item.isError401 = false
            item.progressDesc = '发布中...'
            this.$store.dispatch('settings/insertApiStat', {
              apiUrl: 'publish',
              platformAccountId: item.account.platformAccountId,
              remark: '平台发布',
              type: 2
            })
            window.videoPublishNewSocket.emit(
              'publish',
              JSON.stringify(publishData),
              response => {}
            )
          })
        }
      })
    },
    // 检验是否完成了
    checkIsComplete(taskId) {
      window.onbeforeunload = null
      // 是否在当前页面
      if (
        this.successNum === this.accountPublishList.length &&
        this.$route.path === '/videoManagement/videoPublish' &&
        this.taskId &&
        taskId === this.taskId
      ) {
        // 完成之后开始倒计时
        const timer = setInterval(() => {
          this.countdownNums--
          if (this.countdownNums === 0) {
            clearInterval(timer)
            // const path = this.$route.path.split('/')
            // path.pop()
            // path.push('finishedProduct')
            // console.log('path-----', path.join('/'))
            // this.$router.push({
            //   path: path.join('/')
            // })
            // this.$router.push({
            //   path: '/clip/finishedProduct'
            // })
            const prevPath = this.$route.query?.prevPath
            if (prevPath) {
              this.$router.replace({
                path: prevPath
              })
            } else {
              this.$router.go(-1)
            }
            return
          }
        }, 1000)
      }
      if (this.successNum + this.failNums === this.accountPublishList.length) {
        clearInterval(this.timer)
      }
    },
    // 监听发布结果
    socketGetPublishStatus(mySocket) {
      this.accountPublishList.forEach(item => {
        const params = {
          platformId: item.account.platformId,
          cookie: item.account.cookie,
          accountId: item.account.accountId,
          mediaTypeEnum: 'MiniVideo',
          publishId: item.publishId,
          newVersion: this.allChannelSwitch[item.account.platformId],
          title: item.title
        }
        isUseNewClient(
          item.account.platformId,
          'get-publish-status',
          item.account.platformAccountId,
          '获取文章发布至平台后的状态'
        ).emit('get-publish-status', JSON.stringify(params), async response => {
          const getPublishStatusRes = JSON.parse(response)
          // let recordData
          // 发布成功
          if (String(getPublishStatusRes.messageType) === '0') {
            if (
              item.account.platformAccountId ===
              getPublishStatusRes.TaskHeaderInput.PlatformAccountId
            ) {
              // const { publishId, publishTime, status, openUrl, errorMsg } = getPublishStatusRes.dataBody
              const { errorMsg } = getPublishStatusRes.dataBody
              // recordData = {
              //   accountId: item.account.accountId,
              //   openUrl,
              //   platformId: item.account.platformId,
              //   publishId,
              //   publishTime,
              //   resultDesc: errorMsg,
              //   status,
              //   taskId: this.taskId
              // }
              item.progressDesc = errorMsg
              // this.updatePublishTaskRecordApi(recordData)
            }
          }
          item.isComplete = true
        })
      })
    },
    async updatePublishTaskRecordApi(data) {
      if (data && Object.keys(data).length) {
        await updatePublishTaskRecord(data)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-progress-bar {
  padding-right: 60px;
  margin-right: -65px;
}
.continue_publish{
  border-radius: 20px;
  background: #0c6fff;
  box-shadow: 0 2px 4px 0 #0059de33;
  color: #ffffff;
  font-size: 12px;
  padding:4px 6px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.showInternetStatus {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .networkStatus1 {
    color: #00b42a;
  }
  .networkStatus2 {
    color: #f53f3f;
  }
}
.haveFail {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .goReleaseRecord {
    position: absolute;
    right: 0;
  }
}
.status_box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.account-publish-container {
  padding: 0 20px;
  .title {
    margin-bottom: 20px;
    font-size: 16px;
    color: #777;
  }
  .account-publish-list {
    li {
      margin-bottom: 20px;
      .account-info {
        background: none;
        .right {
          .el-icon-loading {
            position: absolute;
            top: 0;
            left: -14px;
            font-size: 14px;
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
