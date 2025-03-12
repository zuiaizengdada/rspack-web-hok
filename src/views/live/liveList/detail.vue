<template>
  <div class="page_wrap">
    <div class="page_header">
      <div class="page_header_title">
        <span class="pointer" @click="$router.replace({ path: '/live/liveRoom' })">直播列表</span>
        /
        <span>直播详情</span>
      </div>

      <div v-loading="loading" class="page_header_detail">
        <div class="page_header_detail_img">
          <el-image style="width: 100%; height: 100%; background: #f5f7fa" :src="detail.imgUrl" fit="contain" />
        </div>
        <div class="page_header_detail_content">
          <div class="liveRoomName m-b-16">
            {{ detail.name }}
            <span v-if="!loading" class="liveRoomNameTips m-r-10">(直播间ID：{{ detail.code }})</span>
            <el-button size="mini" type="primary" @click="onhandleInvite(detail)">邀课链接</el-button>
            <el-tooltip :disabled="canShowGotoLiveRoom()" effect="dark" content="您不是该场直播助教，无权限访问。" placement="top-start">
              <el-button size="mini" type="primary" @click="onhandleGotoLiveRoom()">进入直播</el-button>
            </el-tooltip>
          </div>
          <el-row class="m-b-16" :gutter="20">
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">直播模式:</div>
              <div class="formValue">
                {{ detail.liveModel | getOptionsValue(liveModeOption) }}
              </div></el-col>
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">{{ detail.liveModel === 'PERSON_LIVE' ? '直播讲师' : '视频讲师' }}:</div>
              <div class="formValue">
                <textShowMore ref="textShowMore" :text="renderTearch(detail)" :line-clamp="1" />
              </div>
            </el-col>
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">运营助教:</div>
              <div class="formValue">
                <textShowMore ref="textShowMore" :text="renderAssistantTearch(detail.teacherInfoList)" :line-clamp="1" />
              </div>
            </el-col>
          </el-row>
          <el-row class="m-b-16" :gutter="20">
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">开播时间:</div>
              <div class="formValue">
                {{ detail.startTime? moment(detail.startTime).format('YYYY-MM-DD HH:mm:ss'): '' }}
              </div>
            </el-col>
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">直播人数:</div>
              <div class="formValue">{{ detail.isShow ? '显示' : '隐藏' }}</div>
            </el-col>
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">回放设置:</div>
              <div class="formValue">
                {{ { 0: '无回放', 1: '云端录制' }[detail.playbackSet] }}
              </div>
            </el-col>
          </el-row>
          <el-row class="m-b-16" :gutter="20">
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">创建时间:</div>
              <div class="formValue">
                {{ detail.createTime? moment(detail.createTime).format('YYYY-MM-DD HH:mm:ss'): '' }}
              </div>
            </el-col>
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">创建人员:</div>
              <div class="formValue">{{ detail.createUserName }}</div>
            </el-col>
          </el-row>
          <el-row v-if="detail.liveModel === 'AI_LIVE'" class="m-b-16" :gutter="20">
            <el-col :span="8" class="liveRoomInfo">
              <div class="formLabel">视频名称:</div>
              <div class="formValue a_link" @click="gotoVideo(detail.liveRoomIntelligentInfo)">
                {{ detail.liveRoomIntelligentInfo.videoName }}
              </div>
            </el-col>
            <el-col :span="12" class="liveRoomInfo">
              <div class="formLabel">课件名称:</div>
              <div class="formValue">
                <template v-if="detail.liveRoomIntelligentInfo.scriptId">
                  <span class="a_link" @click="gotoScript(detail.liveRoomIntelligentInfo)">
                    {{ detail.liveRoomIntelligentInfo.scriptName }}
                  </span>
                </template>
                <template v-else> 未使用课件 </template>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div v-loading="loading" class="page_content">
      <el-tabs v-model="activeName" class="tabSign" @tab-click="tabsChange">
        <el-tab-pane v-for="(item) in tabList" :key="item.name" :label="item.label" :name="item.name" />
        <!-- <el-tab-pane v-if="permsList.includes('web:liveDetail:liveRoomSettings')" label="直播间设置" name="liveRoomSettings" />
        <el-tab-pane label="报名设置" name="registerSettings" />
        <el-tab-pane label="报名列表" name="registerList" />
        <el-tab-pane label="直播带货" name="sellGoods" />
        <el-tab-pane label="互动设置" name="interactiveSettings" />
        <el-tab-pane label="用户记录" name="userRecords" />
        <el-tab-pane label="购买记录" name="purchaseRecord" />
        <el-tab-pane label="回放记录" name="playbackRecord" />
        <el-tab-pane label="聊天记录" name="chatRecords" />
        <el-tab-pane v-if="permsList.includes('web:liveDetail:dataStatistics')" label="数据统计" name="dataStatistics" /> -->
        <div v-if="activeName !== 'dataStatistics'" style="margin-top: 15px">
          <components
            :is="activeName || 'lecturerSettings'"
            :live-room-person-info="detail.liveRoomPersonInfo"
            :detail="detail"
            :enter-live-room="enterLiveRoom"
            @lecturerSettingsChange="lecturerSettingsChange"
          />
        </div>
      </el-tabs>
    </div>
    <dataStatistics
      v-if="activeName === 'dataStatistics' && permsList.includes('web:liveDetail:dataStatistics')"
      :live-room-person-info="detail.liveRoomPersonInfo"
      :detail="detail"
    />

    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
// import streamingSettings from './component/streamingSettings.vue'
import sellGoods from './component/sellGoods.vue'
import userRecords from './component/userRecords.vue'
import purchaseRecord from './component/purchaseRecord.vue'
import playbackRecord from './component/playbackRecord.vue'
import chatRecords from './component/chatRecords.vue'
import registerSettings from './component/registerSettings.vue'
import lecturerSettings from './component/lecturerSettings/index.vue'
import registerList from './component/registerList.vue'
import interactiveSettings from './component/interactiveSettings.vue'
import { liveModeOption } from '../columns.js'
import { getLiveRoomInfo, canEnterLiveRoom } from '@/api/liveRoom/index'
import textShowMore from '@/components/textShowMore/index2.vue'
import InviteDialog from './component/InviteDialog.vue'
import dataStatistics from './component/dataStatistics.vue'
import liveRoomSettings from './component/liveRoomSettings.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Sortable from 'sortablejs'
import { liveOperationType } from '@/views/live/columns.js'
export default {
  name: 'AudioDetail',
  components: {
    InviteDialog,
    // streamingSettings,
    sellGoods,
    userRecords,
    purchaseRecord,
    playbackRecord,
    chatRecords,
    textShowMore,
    registerSettings,
    lecturerSettings,
    registerList,
    interactiveSettings,
    dataStatistics,
    liveRoomSettings
  },
  filters: {},
  data() {
    return {
      liveModeOption,
      loading: false,
      current: 1,
      size: 10,
      detail: {
        code: '', // 直播间ID
        createTime: '', // 创建时间
        createUserName: '', // 创建人
        liveModel: '', // 直播模式：PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播
        broadcastStreamAddr: '', // 播流地址
        broadcastStreamSecretKey: '', // 播流秘钥
        liveRoomPersonInfo: {
          // 真人直播信息
          groupId: '' // 直播群Id
        },
        isAllowSendPic: 0, // 是否允许学员发图片
        isShowNotice: 0, // 是否显示系统消息
        isShutUp: 0, // 是否禁言
        playbackSet: 0, // 回放设置：0无回放，1云端录制
        pushFlowAddr: '', // 推流地址
        pushFlowSecretKey: '', // 推流秘钥
        name: '', // 直播间名称
        realityTeacherUserName: '', // 讲师
        startTime: '', // 直播时间
        status: '' // 直播状态：0-未开始，1-直播中，2-？？？，9-直播结束
      },
      enterLiveRoom: false,
      activeName: 'lecturerSettings',
      inviteConfig: {
        visible: false,
        row: {}
      },
      tableData: [],
      id: '',
      tabList: [
        { label: '讲师设置', name: 'lecturerSettings' },
        { label: '直播间设置', name: 'liveRoomSettings', render: () => { return this.permsList.includes('web:liveDetail:liveRoomSettings') } },
        { label: '报名设置', name: 'registerSettings' },
        { label: '报名列表', name: 'registerList' },
        { label: '直播带货', name: 'sellGoods' },
        { label: '互动设置', name: 'interactiveSettings' },
        { label: '用户记录', name: 'userRecords' },
        { label: '购买记录', name: 'purchaseRecord' },
        { label: '回放记录', name: 'playbackRecord' },
        { label: '聊天记录', name: 'chatRecords' },
        { label: '数据统计', name: 'dataStatistics', render: () => { return this.permsList.includes('web:liveDetail:dataStatistics') } }
      ],
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    // $route: {
    //   handler(val) {
    //     console.log(val, 'val')
    //     this.activeName = val.query.type || 'recommend'
    //   },
    //   deep: true
    // }
  },
  async created() {
    await this.$store.dispatch('user/viewingFlag', 'liveRoomDetail')
    console.log(this.$route.meta.permsList, 'this.$route.meta.permsList')
    this.activeName = this.$route.query.type || 'lecturerSettings'
    this.id = this.$route.params.id
    // 埋点
    const params = {
      liveRoomId: this.id,
      operationType: liveOperationType.type101
    }
    this.$store.dispatch('im/operationLogsWrite', params)
    this.canEnterLiveRoom().then(() => {
      this.init()
    })
  },
  mounted() {
    this.rowDrop()
  },
  methods: {
    // 拖拽方法
    rowDrop() {
      const el = document.querySelector('.tabSign .el-tabs__nav') // 找到想要拖拽的那一列
      const _this = this
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex, _this.tabList)
          const arr = JSON.parse(JSON.stringify(_this.tabList))
          // oldIIndex拖放前的位置， newIndex拖放后的位置  //tabOptionList为遍历的tab签
          const currRow = arr.splice(oldIndex - 1, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          arr.splice(newIndex - 1, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
          _this.tabList = arr
        }
      })
    },
    onhandleInvite(row) {
      console.log(row)
      this.inviteConfig = {
        visible: true,
        row: {
          id: this.$route.params.id,
          ...row
        }
      }
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    renderTearch(row) {
      if (row.liveModel === 'PERSON_LIVE') {
        const arr = row.teacherInfoList
        if (!arr) {
          return ''
        }
        const value = arr
          .filter(v => v.teacherRole === 0)
          .reduce((pre, next) => {
            next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
            return pre
          }, '')
        return value
      } else if (row.liveModel === 'AI_LIVE') {
        return row.liveRoomIntelligentInfo.videoTeacherName || '——'
      } else {
        return ''
      }
      // if (!arr) {
      //   return ''
      // }
      // const value = arr.filter(v => v.teacherRole === 0).reduce((pre, next) => {
      //   next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
      //   return pre
      // }, '')
      // return value
    },
    renderAssistantTearch(arr) {
      if (!arr) {
        return ''
      }
      const value = arr
        .filter(v => v.teacherRole === 1)
        .reduce((pre, next) => {
          next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
          return pre
        }, '')
      return value
    },
    moment,
    // 初始化
    init() {
      this.loading = true
      this.getDetail()
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        liveRoomId: this.id
      }
      getLiveRoomInfo(params)
        .then(res => {
          this.loading = false
          if (res.data.liveModel === 'PERSON_LIVE') {
            res.data.liveRoomPersonInfo.pushFlowAdder = `rtmp://${res.data.liveRoomPersonInfo.pushInfo.url}/${res.data.liveRoomPersonInfo.pushInfo.appName}` // 服务器rtmp://181573.push.tlivecloud.com/live
            res.data.liveRoomPersonInfo.broadcastStreamSecretKey = `${res.data.liveRoomPersonInfo.pushInfo.streamName}?txSecret=${res.data.liveRoomPersonInfo.pushInfo.txSecret}&txTime=${res.data.liveRoomPersonInfo.pushInfo.txTime}` // 串流密匙LR718828?txSecret=24fac9906a9757a2c7bb84ef85797c2a&txTime=645B08B0
          }
          this.detail = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    tabsChange() {
      if (this.activeName === 'dataStatistics' && this.detail.status !== 9) {
        this.init()
      }
      this.$router.push({
        query: { ...this.$route.query, type: this.activeName }
      })
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    // 点击进入直播间
    onhandleGotoLiveRoom() {
      if (!this.canShowGotoLiveRoom()) {
        return this.$message.error('你暂无权限访问。')
      }
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/liveRoom/${this.id}`
      })
      window.open(href, '_blank')
    },
    canShowGotoLiveRoom() {
      const row = this.detail
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teacherInfoList || row.teacherInfoList.length === 0) {
        return false
      }
      const obj = row.teacherInfoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    gotoVideo(row) {
      // this.$store.commit('liveScript/set_linkQuery', { videoId: row.videoId, videoName: row.videoName })
      // this.$store.commit('liveScript/set_linkQuery', { key: 'videoId', value: row.videoId })
      // this.$store.commit('liveScript/set_linkQuery', { key: 'videoName', value: row.videoName })
      // this.$router.push(`/live/liveVideo`)
      const { href } = this.$router.resolve({
        path: `/live/liveVideo?videoId=${row.videoId}&videoName=${row.videoName}`
      })
      window.open(href, '_blank')
    },
    gotoScript(row) {
      // this.$store.commit('liveScript/set_linkQuery', { key: 'scriptName', value: row.scriptName })
      // this.$router.push(`/live/script`)
      const { href } = this.$router.resolve({
        path: `/live/script?coursewareName=${row.scriptName}`
      })
      window.open(href, '_blank')
    },
    // 讲师设置新增删除成功
    lecturerSettingsChange() {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  min-width: 1000px;
}
.page_header {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 21px;
  .pointer {
    color: #777777;
  }
  .page_header_detail {
    display: flex;
    width: 100%;
    padding: 20px 0 0;
    background-color: #ffffff;
    position: relative;
    box-sizing: border-box;
    .page_header_detail_img {
      min-width: 200px;
      max-width: 200px;
      width: 200px;
      height: 150px;
      border-radius: 4px;
      overflow: hidden;
    }
    .page_header_detail_content {
      flex: 1;
      padding-left: 20px;
      .liveRoomName {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #333333;
        line-height: 28px;
        .liveRoomNameTips {
          font-size: 14px;
          color: #777777;
        }
      }
      .liveRoomInfo {
        display: flex;
        .formLabel {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 24px;
          min-width: 76px;
        }
        .formValue {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
          line-height: 24px;
          margin-left: 5px;
        }
      }
    }
  }
}

.page_content {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 21px;
}
::v-deep {
  // .el-tabs__nav-wrap::after {
  //   background-color: none;
  // }
  .el-tabs__header {
    margin: 0;
  }
}

.noData {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  > img {
    width: 250px;
  }
  .noDataText {
    margin-top: 16px;
    margin-bottom: 100px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
}
</style>
