<template>
  <div class="publish-container">
    <div class="publish-header flex justify-between items-center">
      <div class="bread-nav flex items-center">
        <p class="nav-01" @click="goFinishedProduct">
          <span>成品视频</span>
        </p>
        <b class="el-icon-arrow-right" />
        <p class="nav-02">
          <span>视频一键发布</span>
        </p>
      </div>
      <div class="mr-20">
        <!-- <el-button type="primary" size="mini" class="mr-20" @click="visibleDialogDataSync=true">手动同步数据</el-button> -->
        <el-button
          type="primary"
          size="mini"
          class="mr-20"
          @click="handleClickGroup"
        >
          选择分组账号
        </el-button>
        <el-button size="mini" @click="handleClickMemory">选择记忆项</el-button>
      </div>
    </div>
    <div class="publish-content flex">
      <video-common
        class="video-common"
        @click="checkVideo"
        @getVideoOver="getVideoOver"
      />
      <video-detail class="video-detail" />
    </div>
    <div class="publish-bottom flex justify-center items-center">
      <el-button @click="handleClickVideoSaveSubmit">保存视频</el-button>
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="handleClickCheck"
      >
        一键发布
      </el-button>
    </div>
    <dialog-publish-eslint :visible.sync="visibleDialogPublishEslint" />
    <AccountGrouping
      :active-index="activeIndex"
      :group-list="groupList"
      :account-list="accountList"
      :visible="agFlag"
      @selectActive="selectActive"
      @close="agFlag = false"
      @succese="resetAccount"
    />
    <AppMemoryitem
      :visible="amFlag"
      :memory="radio"
      @close="amFlag = false"
      @success="saveMemory"
    />
    <video-check
      :visible.sync="visibleVideoCheck"
      @sumitVideoCheck="sumitVideoCheck"
    />
    <DownloadModal ref="DownloadModal" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import VideoCommon from './components/VideoCommon/index.vue'
import VideoCheck from './components/VideoCheck/index.vue'
import VideoDetail from './components/VideoDetail/index.vue'
import AccountGrouping from '@/components/AccountGrouping'
import AppMemoryitem from '@/components/AppMemoryitem'
import DialogPublishEslint from './components/DialogPublishEslint/index.vue'
import { getHasAccountAndList } from '@/api/videoManagement/accountManage'
import { queryWeMediaVideoInfo } from '@/api/videoManagement/vedioSetting'
import { mixinsPublishForm } from './mixinsPublishForm'
import {
  qryLoginMerchant,
  accountPublish,
  querySettingContent,
  publishAccounts
} from './api/index'
import {
  getGroupList,
  getQryLoginMerchant,
  queryRemember,
  settingRemember
} from '@/api/videoManagement/videoPublish'
import { tamplateDataList } from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/constant'
import { updateUnLogin } from '@/api/videoManagement/accountManage'
import DownloadModal from '@/components/DownloadModal/index.vue'
import { isUseNewClient } from '@/utils'
import moment from 'moment'
export default {
  components: {
    VideoCommon,
    VideoDetail,
    AccountGrouping,
    AppMemoryitem,
    DialogPublishEslint,
    VideoCheck,
    DownloadModal
  },
  mixins: [mixinsPublishForm],
  inject: ['reload'],
  data() {
    return {
      visibleDialogDataSync: false,
      visibleDialogPublishEslint: false,
      visibleVideoCheck: false,
      isNext: true,
      timer: null,
      tokenData: {}
    }
  },
  computed: {
    ...mapGetters([
      'isNewSocketVideoPublish',
      'allChannelSwitch',
      'fuxiVersion'
    ])
  },
  watch: {
    '$route.query.finishVideoId'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reload()
      }
    },
    '$route.query.taskId'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.reload()
      }
    }
  },
  provide() {
    return {
      tokenData: this.tokenData
    }
  },
  created() {
    // 检测是否有finishVideoId 如果没有就回到上一个页面
    if (!this.$route.query.finishVideoId) {
      this.$router.go(-1)
      this.isNext = false
      return
    }
    this.getLoginToken()
    this.getLoginMerchant()
    this.queryRemember()
    this.getGroupList()
  },
  mounted() {
    if (!this.isNext) {
      return
    }
    this.getPublishAccounts()
    this.clearVideoPublishLocalStorage()
    // 十秒钟自动保存一次视频
    this.timer = setInterval(() => {
      this.handleAutoVideoSaveSubmit(true)
    }, 10000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    // 视频数据获取完成
    getVideoOver() {
      this.$nextTick(() => {
        this.getSettingContent()
      })
    },
    checkVideo() {
      this.visibleVideoCheck = true
    },
    // 切换视频
    sumitVideoCheck(row) {
      console.log('选择的视频', row)
      getHasAccountAndList().then(async res => {
        if (res.success) {
          if (res.data.length <= 0) {
            this.$message.error('暂无账号，请先添加账号')
            return
          } else {
            if (row.sensitiveWordStatus === '3') {
              let mgcStr = ''
              row.sensitives.some(item => {
                mgcStr += item + '，'
              })
              mgcStr = mgcStr.substring(0, mgcStr.length - 1)
              const strMgc =
                '成品视频包含敏感词：{' +
                mgcStr +
                '}，可能会触及发布平台风控规则，是否继续发布？'
              this.$confirm(strMgc, '敏感词提醒', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(async () => {
                  const res = await queryWeMediaVideoInfo({
                    finishVideoId: row.finishVideoId
                  })
                  const { width } = res.data
                  if (width) {
                    this.handleClickVideoSave(row.finishVideoId)
                  } else {
                    this.$message.error('视频正在处理中，请稍等。。。。')
                  }
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
            } else {
              const res = await queryWeMediaVideoInfo({
                finishVideoId: row.finishVideoId
              })
              const { width } = res.data
              if (width) {
                this.handleClickVideoSave(row.finishVideoId)
              } else {
                this.$message.error('视频正在处理中，请稍等...')
              }
            }
          }
        }
      })
    },
    // 获取所有分组
    async getGroupList() {
      const { data } = await getGroupList({ type: 2 })
      const arr = data.items.filter(item => item.list != null)
      this.groupList = arr
      this.accountList = arr.length > 0 ? arr[0].list : []
    },
    selectActive(index) {
      this.activeIndex = index
      this.accountList = this.groupList?.[index]?.list
    },
    async getLoginMerchant() {
      // 用户的token
      const { data } = await getQryLoginMerchant({})
      this.merchantToken = data.merchantToken
    },
    // 返回成品视频
    goFinishedProduct() {
      // // 因为成品视频在多个目录下存在，取path拼接
      // const path = this.$route.path.split('/')
      // path.pop()
      // path.push('finishedProduct')
      // this.$router.push({
      //   path: path.join('/')
      // })
      const prevPath = this.$route.query?.prevPath
      if (prevPath) {
        this.$router.replace({
          path: prevPath
        })
      } else {
        this.$router.go(-1)
      }
    },
    async getLoginToken() {
      const res = await qryLoginMerchant()
      this.tokenData = res.data
    },
    async queryRemember() {
      const { data } = await queryRemember()
      this.radio = data.isRemember
    },
    resetAccount(list) {
      console.log(list, '需要重置的')
      let template = null
      const _list = []
      list.forEach(item => {
        template = JSON.parse(
          JSON.stringify(tamplateDataList.get(item.platformId))
        )
        const data = { ...template, ...this.publishForm }
        const copyData = JSON.parse(JSON.stringify(data))
        copyData.account = item
        _list.push(copyData)
      })
      this.resetPublishChanelData(_list)
      this.agFlag = false
    },
    // 选择分组账号
    addGroup(list) {
      console.log(list, '需要添加的')
      const template = JSON.parse(
        JSON.stringify(tamplateDataList.get(this.channel.id))
      )
      const data = { ...template, ...this.publishForm }
      const _list = []
      list.forEach(item => {
        const copyData = JSON.parse(JSON.stringify(data))
        copyData.account = item
        _list.push(copyData)
      })
      this.updatePublishChanelData(_list)
      this.agFlag = false
    },
    // 记忆项
    async saveMemory(e) {
      this.radio = e
      await settingRemember({ isRemember: this.radio })
      this.queryRemember()
      this.amFlag = false
    },
    handleClickVideoSaveSubmit() {
      this.handleClickVideoSave()
    },
    handleAutoVideoSaveSubmit(flag) {
      this.handleClickVideoSave('', flag)
    },
    // 保存视频
    async handleClickVideoSave(id, flag) {
      const { finishVideoId, taskId } = this.$route.query
      const { list } = this.publishChannelData
      if (id) {
        this.publishForm.cover = ''
      }
      console.log(id, finishVideoId, taskId, '保存视频')
      const data = {
        finishVideoId: id || finishVideoId,
        taskId,
        settingContent: JSON.stringify(this.publishForm)
      }
      if (list.length > 0) {
        const publishAccounts = []
        list.forEach(item => {
          console.log(item, '上传之前的数据')
          // 更换视频不需要更换封面
          if (id) {
            item.cover = ''
          }
          const obj = {
            accountId: item.account.accountId,
            platformId: item.account.platformId,
            publishContent: JSON.stringify(item)
          }
          publishAccounts.push(obj)
        })
        data.publishAccounts = publishAccounts
      }
      const res = await accountPublish(data)
      if (id) {
        this.$router.push({
          path: '/videoManagement/videoPublish?finishVideoId=' + id,
          replace: true,
          query: {
            prevPath: this.$route.path
          }
        })
      } else {
        if (!flag) {
          this.$message.success('保存成功')
        }
        this.updateFinishVideoData(res.data)
        this.$uweb && this.$uweb.setAction('Event_videoPublish_save')
      }
      localStorage.setItem(
        'videoPublishChannelData',
        JSON.stringify(this.publishChannelData)
      )
    },
    // 先检测文件是否存在
    handleClickCheck() {
      const filePathOrUrl = this.video.filePathOrUrl
      if (!filePathOrUrl) {
        this.$message.error('视频正在下载中，请稍后重试。')
        return
      }
      // 判断视频是否完成本地下载 必须我们客户端才可以检测
      if (this.isNewSocketVideoPublish) {
        window.videoPublishNewSocket.emit(
          'check-local-video',
          JSON.stringify({ filePathOrUrl: this.video.filePathOrUrl }),
          response => {
            const res = JSON.parse(response)
            if (res.code !== 200) {
              this.$message.error('文件不存在，重新加载中...')
              // 重新加载视频
              this.reload()
              return
            } else {
              this.handleClickPublish()
            }
          }
        )
      } else {
        this.handleClickPublish()
      }
    },
    // 激活一键发布弹窗
    handleClickPublish() {
      const { title, intro } = this.publishForm
      if (!title) {
        this.$message.error('请填写一键设置作品标题')
        return
      }
      if (!intro) {
        this.$message.error('请填写一键设置作品简介')
        return
      }
      const isSocket = this.isNewSocketVideoPublish
      if (isSocket) {
        let isValid = true
        this.channel.errList.forEach(item => {
          if (item.contentError) {
            const msgType = {
              19: '抖音',
              32: '视频号',
              24: '快手',
              31: '小红书',
              15: 'B站'
            }
            const msg = msgType[item.platformId] + '校验信息有错误,请查看'
            this.$notify({
              title: '提示',
              message: msg,
              type: 'error'
            })
            isValid = false
          }
        })

        if (isValid) {
          this.validBilibiliCategorySelected()
          this.validPublishTime()
          const list = this.publishChannelData.list
          if (list.length > 0) {
            this.handleClickVideoSave()
            this.visibleDialogPublishEslint = true
          } else {
            this.$message.error('请添加账号后，发布视频')
          }
        }
      } else {
        this.$refs.DownloadModal.show()
      }
      this.$uweb && this.$uweb.setAction('Event_videoPublish_submit')
    },
    // 校验定时发布规则
    validPublishTime() {
      const { list } = this.publishChannelData
      const currentMm = moment(new Date()).format('x')
      const platformTimeRequirements = {
        19: { time: 2 * 60 * 60 * 1000, name: '抖音' },
        32: { time: 10 * 60 * 1000, name: '视频号' },
        24: { time: 1 * 60 * 60 * 1000, name: '快手' },
        31: { time: 1 * 60 * 60 * 1000, name: '小红书' },
        15: { time: 2 * 60 * 60 * 1000, name: 'B站' },
        20: { time: 2 * 60 * 60 * 1000, name: 'tiktok' }
      }

      list.forEach(item => {
        if (item.publishTimed.type === 1) {
          const publishMm = moment(item.publishTimed.value).format('x')
          const platformId = item.account.platformId
          const platformName = platformTimeRequirements[platformId]?.name
          const requiredTime = platformTimeRequirements[platformId]?.time
          // 视频号提示10分钟之后
          if (requiredTime && (publishMm - currentMm < requiredTime)) {
            let messageTips = ''
            if (platformId === 32) {
              messageTips = `${platformName} ${item.account.name}定时发布时间需要大于10分钟`
            } else {
              messageTips = `${platformName} ${item.account.name}定时发布时间需要大于${requiredTime / (60 * 60 * 1000)}小时`
            }
            this.$notify({
              title: '提示',
              message: messageTips,
              type: 'error'
            })
            throw new Error('error')
          }
        }
      })
    },
    // 单独校验B站分类信息是否有选择
    validBilibiliCategorySelected() {
      const { list } = this.publishChannelData
      list.forEach(item => {
        if (item.account.platformId === 15) {
          // 或者标题全部空格
          if (!item.title || item.title.trim() === '') {
            this.$notify({
              title: '提示',
              message: '请填写B站' + item.account.name + '作品标题',
              type: 'error'
            })
            throw new Error('error')
          }
          if (
            !item.classifyList ||
            (item.classifyList && item.classifyList.length < 1)
          ) {
            this.$notify({
              title: '提示',
              message: '请完善B站' + item.account.name + '分类信息',
              type: 'error'
            })
            throw new Error('error')
          } else if (item.topic.length < 1) {
            this.$notify({
              title: '提示',
              message: '请完善B站' + item.account.name + '话题信息',
              type: 'error'
            })
            throw new Error('error')
          }
        }
      })
    },
    // 获取一键设置信息
    async getSettingContent() {
      const { finishVideoId, type, taskId } = this.$route.query
      const { data } = await querySettingContent({
        id: taskId || finishVideoId,
        type: type && type === 'record' ? 2 : 1
      })
      if (data) {
        const obj = JSON.parse(data)
        console.log(obj, '获取一键设置保存信息。。。')
        // 更换视频的时候会没有封面
        if (!obj.cover) {
          obj.cover = this.publishForm.cover
        }
        this.updataPublishForm(obj)
      }
    },
    // 获取账号信息
    async getPublishAccounts() {
      const { finishVideoId, type, taskId } = this.$route.query
      const { data } = await publishAccounts({
        id: taskId || finishVideoId,
        type: type && type === 'record' ? 2 : 1
      })
      data.forEach(item => {
        if (item.publishContent === null && item.accountContent === null) {
          this.addGroup([item])
        } else {
          console.log(item, '新的item')
          let obj = null
          if (item.publishContent === null) {
            obj = JSON.parse(item.accountContent)
            obj.intro = this.publishForm.intro
            obj.title = this.publishForm.title
            obj.cover = this.publishForm.cover
          } else {
            obj = JSON.parse(item.publishContent)
            // 更换视频的时候会没有封面
            if (!obj.cover) {
              obj.cover = this.publishForm.cover
            }
          }
          this.$set(obj, 'cookie', item.cookie)
          obj.account.cookie = item.cookie
          obj.account.avatar = item.avatar
          obj.account.name = item.name
          obj.account.platformAccountId = item.platformAccountId
          obj.account.status = ''
          obj.isModify = false
          console.log(obj, '更新了的cookie')
          this.publishChannelData.list.push(JSON.parse(JSON.stringify(obj)))
        }
      })
      this.verificationAccount()
    },
    // 校验账号信息 过期展示错误
    verificationAccount() {
      const arr = this.publishChannelData.list
        .map(e => e.account)
        .reduce((pre, next) => {
          pre.push({
            platformId: next.platformId,
            platformAccountId: next.platformAccountId,
            cookie: next.cookie,
            token: this.merchantToken
          })
          return pre
        }, [])
      arr.forEach(item => {
        item.newVersion = this.allChannelSwitch[item.platformId]
        isUseNewClient(
          item.platformId,
          'check-account-login-status',
          item.platformAccountId,
          '检测登录自媒体账号'
        ).emit(
          'check-account-login-status',
          JSON.stringify([item]),
          response => {
            const res = JSON.parse(response)[0]
            // 检测未登录 更改状态
            if (res.Code !== 200) {
              if (res?.PlatformAccountInfo.Code === -1) {
                updateUnLogin({
                  loginStatus: 1,
                  platformAccountId: item.platformAccountId,
                  cookie: item.cookie,
                  version: this.fuxiVersion
                })
              }
              this.$store.dispatch('videoManage/saveErrorInfo', {
                platformAccountId: item.platformAccountId,
                requestParam: item.cookie,
                planId: item.platformId,
                apiUrl: 'check-account-login-status',
                errorInfo: res?.PlatformAccountInfo.Message
              })
              this.updataErrList(
                {
                  platformId: item.platformId,
                  accountError: true
                },
                '账号检测1'
              )
            } else {
              this.updataErrList(
                {
                  platformId: item.PlatformId,
                  accountError: false
                },
                '账号检测2'
              )
            }
          }
        )
      })
    },
    handleClickGroup() {
      this.agFlag = true
      this.$uweb && this.$uweb.setAction('Event_videoPublish_accoutGroupAd')
    },
    handleClickMemory() {
      this.amFlag = true
      this.$uweb && this.$uweb.setAction('Event_videoPublish_memoryButton')
    },
    clearVideoPublishLocalStorage() {
      localStorage.removeItem('publishVideoData')
      localStorage.removeItem('videoPublishChannelData')
      localStorage.removeItem('videoPublishMerchantData')
    }
  }
}
</script>
<style lang="scss" scoped>
.publish-container {
  background: #fff;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  .publish-header {
    height: 64px;
    border: 1px solid #eff2f6;
    border-radius: 10px 10px 0px 0px;
    .bread-nav {
      font-size: 16px;
      padding-left: 22px;
      .nav-01 {
        cursor: pointer;
        span {
          color: #777;
        }
        margin-right: 12px;
      }
      .el-icon-arrow-right {
        font-size: 20px;
        color: #333;
      }
      .nav-02 {
        color: #333;
        margin-left: 12px;
      }
    }
  }
  .publish-bottom {
    height: 64px;
    box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.05);
    position: fixed;
    bottom: 0px;
    width: 100%;
    z-index: 999;
    background: #fff;
  }
}

.publish-content {
  width: 100%;
  height: calc(100vh - 220px);
  .video-common {
    flex: 1;
    height: 100%;
    z-index: 1;
  }
  .video-detail {
    width: 688px;
    height: 100%;
    z-index: 99;
    border-left: 20px solid #eee;
  }
}

.mr-20 {
  margin-right: 20px;
}
</style>
