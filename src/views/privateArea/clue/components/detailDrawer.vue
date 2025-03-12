<template>
  <!-- 学员详情弹框 -->
  <el-drawer
    :size="868"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
    @close="close"
  >
    <div v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">
          <span>学员详情</span>
          <div v-if="hasPrevious" class="title-btn" @click="onhandlePrevious">
            <i class="el-icon-caret-top" />上一个
          </div>
          <div v-if="hasNext && total > 1" class="title-btn" @click="onhandleNext">
            <i class="el-icon-caret-bottom" />下一个
          </div>
        </div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="detailContent">
          <img :src="userInfo.avatar || initTitleImg" alt="" />
          <div class="userInfo">
            <div class="userDetail">
              <div class="m-r-10 username">
                {{ userTableData.length > 0 ? userTableData[0].userName : '' }}
              </div>
              <div class="userSex">
                {{ { 0: '未知', 1: '男', 2: '女' }[userInfo.gender] }}
              </div>
            </div>
            <div class="userPhone">
              <tablePhoneItem
                v-if="phone"
                v-model="phone"
                :phone-area-code="userInfo.phoneAreaCode"
                :row-data="{ id: clueId }"
                type="clue"
              />
              <tableEmailItem
                v-if="!phone&&userInfo.email"
                v-model="userInfo.email"
                :row-data="{ userId: userInfo.uid }"
                type="user"
              />
            </div>
          </div>
          <el-button
            class="userInfoBtn"
            type="primary"
            size="small"
            @click="openUser"
          >学员跟进</el-button>
          <el-button
            v-if="isMyCluePage"
            class="callBtn"
            type="primary"
            size="small"
            @click="openCallNumber"
          >
            <img src="@/assets/image/outboundSeats/call-icon-bd.png" alt="" />
            拨打
          </el-button>
        </div>
        <div v-if="!loading" class="tabView">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="baseInfo" />
            <el-tab-pane label="学员动态" name="studentDynamics" />
            <el-tab-pane label="企微会话" name="weChatConversation" />
            <el-tab-pane label="所在群聊" name="groupChat" />
            <el-tab-pane label="订单" name="orderList" />
            <el-tab-pane label="直播" name="liveStreamingList" />
            <el-tab-pane label="操作日志" name="operationLog" />
          </el-tabs>
          <components
            :is="activeName"
            v-if="visibleDialog"
            :ref="activeName"
            :user-info="userInfo"
            :data="userTableData"
            :platform-user-id="row.platformUserId"
            user-id="userId"
            :clue-id="clueId"
            @success="getList"
          />
        </div>
      </div>
    </div>
    <!-- <callPhone
      ref="callPhoneRef"
      v-model="visibleCallPhone"
      :phone-number="row.phone || ''"
      :clue-id="row.id || ''"
    /> -->
  </el-drawer>
</template>

<script>
import baseInfo from './baseInfo.vue'
import studentDynamics from './studentDynamics.vue'
import { setTime } from '../utils.js'
import weChatConversation from './weChatConversation.vue'
import groupChat from './groupChat.vue'
import orderList from './orderList.vue'
import liveStreamingList from './liveStreamingList/index.vue'
import operationLog from './operationLog.vue'
import Dialog from '../Dialog/index.js'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
// import callPhone from '@/views/privateArea/toolbox/outboundSeats/component/callPhone.vue'
import {
  getCluePageList,
  getFollowExternalUserInfo,
  addClueFollowRecord
} from '@/api/privateArea/clue'
// import { clueGetPhone } from '@/api/phoneEncrypt'
export default {
  components: {
    baseInfo,
    studentDynamics,
    weChatConversation,
    groupChat,
    orderList,
    operationLog,
    tablePhoneItem,
    tableEmailItem,
    liveStreamingList
    // callPhone
  },
  filters: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    configTableData: {
      type: Array,
      default: () => []
    },
    configTotal: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    rowIndex: {
      type: Number,
      default: 0
    },
    search: {
      type: Object,
      default: () => {
        return {}
      }
    },
    searchType: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      initTitleImg: require('@/assets/image/imgloadError.png'),
      loading: false,
      config: {
        currentPage: 1,
        pageSize: 1
      },
      index: 0,
      hasPrevious: false,
      hasNext: false,
      tableData: [],
      phone: '',
      userInfo: {
        age: '',
        avatar: '',
        corpAddress: '',
        corpName: '',
        description: '',
        externalUserId: '',
        followQwUserId: '',
        followWbUserId: '',
        gender: '',
        industries: '',
        mainBusiness: '',
        name: '',
        phone: '',
        cluePersonTags: [],
        position: '',
        relStatus: 0,
        remark: '',
        sparePhone: '',
        tags: [],
        wbExternalUserId: '',
        yearlyTurnover: '',
        tagList: [],
        tagName: '',
        livePhone: '',
        watchLivePhoneAreaCode: ''
      },
      clueId: '',
      userTableData: [],
      ifFirst: false,
      activeName: 'baseInfo',
      visibleCallPhone: false
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    isMyCluePage() {
      return (
        this.userInfo.phone &&
        this.userInfo.phoneAreaCode === '86' &&
        this.userTableData.find(
          v => v.followUserId === this.$store.state.user.userInfo.userId
        )
      )
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.index = this.rowIndex
        this.config.currentPage = this.currentPage
        this.config.pageSize = this.pageSize
        this.ifFirst = true
        this.init()
      } else {
        this.visibleCallPhone = false
        this.clueId = ''
        this.userInfo = {
          age: '',
          avatar: '',
          corpAddress: '',
          corpName: '',
          description: '',
          externalUserId: '',
          followQwUserId: '',
          followWbUserId: '',
          gender: '',
          industries: '',
          mainBusiness: '',
          name: '',
          cluePersonTags: [],
          phone: '',
          position: '',
          relStatus: 0,
          remark: '',
          sparePhone: '',
          tags: [],
          wbExternalUserId: '',
          yearlyTurnover: '',
          tagList: [],
          tagName: '',
          livePhone: '',
          watchLivePhoneAreaCode: ''
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
      this.$emit('success')
    },
    async init() {
      this.activeName = 'baseInfo'
      this.hasPrevious = false
      this.hasNext = false
      this.userTableData = []
      await this.getList()
      this.getDetail()
    },
    handleClick() {
      console.log('tab栏点击')
    },
    async openCallNumber() {
      this.$uweb && this.$uweb.setAction('Event_detail_manual_call')
      this.$emit('callPhoneEmit', { ...this.row })
      // const res = await clueGetPhone(this.row.id)
      // this.row.phone = res.data

      // this.$nextTick(async () => {
      //   const isNext = await this.$refs.callPhoneRef.call()
      //   if (!isNext) {
      //     return
      //   }
      //   this.$uweb && this.$uweb.setAction('Event_detail_manual_call')
      //   this.visibleCallPhone = true
      // })
    },
    // 点击打开学员跟进弹框
    openUser() {
      Dialog.open({
        type: 'FollowUser',
        form: {
          content: this.tableData[this.index].lastFollowRecordContent,
          type: !this.tableData[this.index].lastFollowRecordType
            ? ''
            : this.tableData[this.index].lastFollowRecordType,
          clueId: this.clueId
        },
        success: res => {
          this.loading = true
          const data = {
            clueId: res.clueId,
            content: res.content,
            type: !res.type ? 0 : res.type
          }
          addClueFollowRecord(data)
            .then(res => {
              Dialog.close()
              this.getList()
              this.loading = false
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 获取详情
    getDetail() {
      if (this.tableData[this.index] && this.tableData[this.index].id) {
        this.loading = true
        const data = {
          clueId: this.tableData[this.index].id
        }
        getFollowExternalUserInfo(data)
          .then(res => {
            console.log(res, '详情')
            this.userInfo = res.data
            this.userInfo.livePhone = this.tableData.length
              ? this.tableData[this.index].livePhone
              : this.row.livePhone
            this.userInfo.watchLivePhoneAreaCode = this.tableData.length
              ? this.tableData[this.index].watchLivePhoneAreaCode
              : this.row.watchLivePhoneAreaCode
            this.phone = this.userInfo.phone
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 获取列表数据判断是否上一个，下一个
    async getList() {
      this.tableData = []
      const params = {
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        orderStatus: this.search.orderStatus,
        channelId: this.search.channelId,
        isAvailable: this.search.isAvailable,
        ...setTime(this.search.time),
        productCategory: this.search.productCategory,
        [this.search.user.label]: this.search.user.value,
        [this.search.wxKey.label]: this.search.wxKey.value,
        isAddQwAndGw:this.search.isAddQwAndGw,
        clueType: this.search.clueType || 0,
        startCreateTime:
          this.search.createTime && this.search?.createTime[0]
            ? this.search?.createTime[0] + ' 00:00:00'
            : '',
        endCreateTime:
          this.search.createTime && this.search?.createTime[1]
            ? this.search?.createTime[1] + ' 23:59:59'
            : '',
        startLastFollowTime: this.search.lastFollowTime
          ? this.search?.lastFollowTime[0]
          : '',
        endLastFollowTime: this.search.lastFollowTime
          ? this.search?.lastFollowTime[1]
          : '',
        wechatNickName: this.search.wechatNickName,
        refundStatus: this.search.refundStatus,
        tags: this.search.tags,
        followRecordTypes: this.search.followRecordTypes || [],
        deptIdList:this.search.deptIdList || [],
        followUserId: this.search.followUserId,
        repeatBuy:this.search.repeatBuy,
        hasReceiverAddress:this.search.hasReceiverAddress,
        orderNo: this.search.orderNo,
        remark: this.search.remark,
        goodsId: this.search.goodsId,
        taskIdList: this.search.taskIdList,
        teacherId: this.search.teacherId,
        classStatus: this.search.classStatus,
        searchType: this.searchType,
        tagName: this.search.tagName,
        intentIdList: this.search.intentIdList || []
      }
      let pageIndex
      let totalPages
      if (!this.ifFirst) {
        this.loading = true
        try {
          const res = await getCluePageList(params)
          this.loading = false
          this.tableData = res?.data.items
          pageIndex = res?.data.pageIndex
          totalPages = res?.data.totalPages
        } catch {
          this.loading = false
        }
      }
      if (this.ifFirst) {
        // 详情打开用列表的数据,不调接口
        this.tableData = this.configTableData
        pageIndex = this.currentPage
        totalPages = this.configTotalPages
        this.index = this.tableData.findIndex(v => {
          return v.id === this.row.id
        })
      }
      this.ifFirst = false
      this.hasPrevious = !(this.index === 0 && pageIndex === 1)
      this.hasNext = !(
        totalPages === this.currentPage &&
        this.index === this.tableData.length - 1
      )
      this.userTableData = []
      if (this.tableData[this.index]) {
        const row = this.tableData[this.index]
        this.userTableData.push(row)
        this.clueId = row.id
      }
    },
    // 点击上一个
    onhandlePrevious() {
      if (this.index === 0) {
        // 获取上一页数据
        this.config.currentPage = this.config.currentPage - 1
        this.index = this.config.pageSize - 1
      } else {
        this.index = this.index - 1
      }
      this.init()
    },
    // 点击下一个
    onhandleNext() {
      if (this.index === this.tableData.length - 1) {
        // 获取下一页数据
        this.config.currentPage = this.config.currentPage + 1
        this.index = 0
      } else {
        this.index = this.index + 1
      }
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      display: flex;
      align-items: center;
      justify-content: center;
      .title-btn {
        width: 68px;
        height: 20px;
        background: #e7f0ff;
        border-radius: 2px;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #0c6fff;
        line-height: 17px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding: 20px;
    box-sizing: border-box;
    .detailContent {
      padding-top: 12px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      > img {
        width: 80px;
        height: 80px;
        border-radius: 6px;
        border: 1px solid #cbcfd3;
        margin-right: 20px;
      }
      .userInfo {
        flex: 1 0 0;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        .userDetail {
          display: flex;
          align-items: center;
          .username {
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
          }
          .userSex {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 24px;
          }
        }
        .userPhone {
          margin-top: 12px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
        }
      }
      .userInfoBtn {
        margin-top: 6px;
        width: 104px;
      }
    }
    .tabView {
      margin-top: 20px;
    }
  }
}
::v-deep {
  .callBtn {
    width: 104px;
    margin-top: 6px;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
    }
  }
}
</style>
