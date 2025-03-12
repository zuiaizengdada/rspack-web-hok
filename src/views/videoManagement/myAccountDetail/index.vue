<template>
  <div class="account-detail-pages">
    <div class="details-container-account">
      <div class="flex flex-middle flex-between container-top">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="form-breadcrumb">
          <el-breadcrumb-item :to="{ path: breadcrumbData.path }">{{ breadcrumbData.name }}</el-breadcrumb-item>
          <el-breadcrumb-item>账号详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div v-if="detailMessage.operatorId === userInfo.userId">
          <span class="m-r-8 pickerName">设置数据同步时间</span>
          <el-date-picker
            v-model="value"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            :clearable="false"
            end-placeholder="结束日期"
            align="right"
            size="mini"
            class="m-r-8"
            @change="handleChange"
          />
          <el-button type="primary" size="mini" class="syncData" :loading="syncLoading" @click="syncData">{{ syncLoading?'同步中...':'同步数据' }}</el-button>
        </div>
      </div>
      <div class="account-search">
        <span class="account-search-span">
          <em>账号详情</em>
          <i>数据同步时间： {{ detailObj.updateTime }}</i>
        </span>
        <div class="account-detail-search">
          <el-form v-if="!filterPath.includes(path)" :inline="true" size="mini" :model="form" class="demo-form-inline">
            <el-form-item label="平台">
              <el-select v-model="form.platformId" filterable placeholder="请选择" clearable @change="choosePlatform">
                <el-option
                  v-for="item in platformArray"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="账号">
              <el-select v-model="form.platformAccountId" filterable placeholder="请选择账号" clearable>
                <el-option
                  v-for="item in accountArray"
                  :key="item.platformAccountId"
                  :label="item.name"
                  :value="item.platformAccountId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="form.platformAccountId === ''" @click="changeAccountPlatform">切换账号</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="account-header-mess">
        <div class="left-img">
          <img :src="detailMessage.avatar" />
        </div>
        <div class="right-mess">
          <div class="right-mess-line flex flex-middle">
            <span class="title-span">{{ detailMessage.name }}</span>
            <em class="title-em">{{ detailMessage.platformName }}</em>
            <div v-if="logList.length">
              <el-popover
                placement="bottom-start"
                trigger="hover"
                popper-class="my-popover"
              >
                <div class="flex flex-column">
                  <div class="flex flex-middle record_title">
                    <span class="title_name">账号变更记录</span>
                    <!-- <span class="title_time">2023-10-12～2023-11-10</span> -->
                  </div>
                  <div class="record_details overflowOuto">
                    <div class="user_info flex flex-middle">
                      <span class="user_info_platformImg">
                        <img :src="detailMessage.avatar" />
                      </span>
                      <span class="user_info_platformName">{{ detailMessage.name }}</span>
                      <span class="user_info_channel">{{ detailMessage.platformName }}</span>
                    </div>
                    <div>
                      <el-timeline>
                        <el-timeline-item
                          v-for="(activity, index) in logList"
                          :key="index"
                          color="#0C6FFF"
                          :timestamp="activity.time"
                          placement="top"
                        >
                          <div class="timeLine_content flex flex-middle">
                            <span class="timeLine_content_title1 m-r-20"> {{ typeMap[activity.type] }} </span>
                            <span class="timeLine_content_title2 m-r-20">{{ activity.content }}</span>
                          </div>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </div>
                </div>
                <span slot="reference" class="m-l-10">
                  <svg-icon icon-class="change_record" class="m-r-8" />
                  <span class="changeRecord">账号变更记录</span>
                </span>
              </el-popover>
            </div>
          </div>
          <div class="right-mess-line">
            <span class="hasimg-span">
              <img src="../../../assets/image/account/icn_fans.png" />
              <em>{{ detailObj.fans }}</em>
            </span>
            <!-- <span class="hasimg-span">
              <img src="../../../assets/image/account/icn_play.png">
              <em>{{ detailObj.videoView }}</em>
            </span>
            <span class="hasimg-span">
              <img src="../../../assets/image/account/icn_bofang.png">
              <em>{{ detailObj.contents }}</em>
            </span> -->
          </div>
          <div class="right-mess-line-form">
            <el-row>

              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span>账号UID：</span>
                  <p>{{ detailMessage.authorId }}</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span>电话号码：</span>
                  <p>{{ detailMessage.phone }}</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span>部门：</span>
                  <el-tooltip v-if="detailMessage.deptFlag" class="item" effect="light" :content="detailMessage.deptName" placement="bottom">
                    <p>{{ detailMessage.deptName }}</p>
                  </el-tooltip>
                  <p v-else>{{ detailMessage.deptName }}</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span style="text-align: left;">运营者：</span>
                  <el-tooltip v-if="detailMessage.operatorFlag" class="item" effect="light" :content="detailMessage.operatorName" placement="bottom">
                    <p>{{ detailMessage.operatorName }}</p>
                  </el-tooltip>
                  <p v-else>{{ detailMessage.operatorName }}</p>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span>IP：</span>
                  <el-tooltip v-if="detailMessage.teacherFlag" class="item" effect="light" :content="detailMessage.teacherName" placement="bottom">
                    <p>{{ detailMessage.teacherName || '--' }}</p>
                  </el-tooltip>
                  <p v-else>{{ detailMessage.teacherName || '--' }}</p>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="right-mess-form-line">
                  <span>分组：</span>
                  <el-tooltip v-if="detailMessage.groupFlag" class="item" effect="light" :content="detailMessage.group" placement="bottom">
                    <p>{{ detailMessage.group }}</p>
                  </el-tooltip>
                  <p v-else>{{ detailMessage.group }}</p>
                </div>
              </el-col>
              <!-- 是抖音平台则展示抖音号 -->
              <el-col v-if="detailMessage.platformId == 19" :span="6">
                <div class="right-mess-form-line">
                  <span>抖音号：</span>
                  <el-tooltip v-if="detailMessage.uniqueId" class="item" effect="light" :content="detailMessage.uniqueId" placement="bottom">
                    <p>{{ detailMessage.uniqueId }}</p>
                  </el-tooltip>
                  <p v-else>{{ detailMessage.uniqueId }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="account-detail-show">
        <dataShowBlock ref="dataShowBlock" :platform-account-id="platformAccountId" @loadTableData="loadTableData" />
      </div>
      <div class="account-detail-show">
        <showWorks ref="showWorks" :platform-id="detailMessage.platformId" :platform-account-id="platformAccountId" @downloadUrl="downloadUrl" />
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="20%"
      :before-close="handleClose"
    >
      <div slot="title">
        <p class="p-title">提示</p>
      </div>
      <div>
        当前账号未授权，无法将最新数据同步
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">暂不授权</el-button>
        <el-button type="primary" size="mini" @click="goAccountPage">去授权</el-button>
      </span>
    </el-dialog>
    <DownloadModal ref="DownloadModal" />
  </div>
</template>

<script>
import { qryAccountPlatform, getLoginInfo, getMyAccountList, getMyPlatform, getPlatformLogin, insertSyncStatus } from '@/api/videoManagement/accountManage'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getLogList } from '@/api/videoManagement/accountManage'
import showWorks from '@/views/videoManagement/myAccountDetail/components/showWorks'
import { getAccountWeMediaData, getAccountDetailMessage, getAllAccountIds, querySyncInfoById } from '@/api/videoManagement/dataApi'
import DownloadModal from '@/components/DownloadModal/index.vue'
import { updateUnLogin, updateLoginStatus } from '@/api/videoManagement/accountManage'
import { isUseNewClient } from '@/utils'
import dataShowBlock from './components/dataShowBlock.vue'
export default {
  components: {
    dataShowBlock,
    showWorks,
    DownloadModal
  },
  data() {
    return {
      form: {
        platformId: '',
        platformAccountId: ''
      },
      cuttentTime: '',
      value: [moment().subtract(30 - 1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.cuttentTime = minDate.getTime()
          if (maxDate) {
            this.cuttentTime = ''
          }
        },
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate(time) {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
          const today = new Date()
          today.setHours(23, 59, 59, 999)
          return time.getTime() < oneYearAgo.getTime() || time.getTime() > today.getTime()
        }
      },
      activities: [],
      typeMap: {
        1: '停更',
        2: '恢复更新',
        3: '转号',
        4: '变更运营',
        5: '移交老师',
        6: '注销',
        7: '恢复账号'
      },
      platformAccountId: '',
      detailObj: {
        updateTime: '',
        fans: 0
      },
      accountArray: [],
      detailMessage: {
        authorId: '',
        authorityUrl: '',
        avatar: '',
        cookie: '',
        deptName: '',
        empowerTime: '',
        group: '',
        groupIds: [],
        loginStatus: 0,
        name: '',
        operatorId: '',
        operatorName: '',
        roleObject: null,
        phone: '',
        platformAccountId: '',
        platformId: 0,
        platformName: '',
        platformavatar: '',
        stopDays: 0,
        teacherIds: [],
        teacherName: ''
      },
      dialogVisible: false,
      syncLoading: false,
      logList: [],
      envList: {
        'development': 'https://dev.cloud.hokkj.cn',
        'staging': 'https://dev.cloud.hokkj.cn',
        'test': 'https://test.cloud.hokkj.cn',
        'beta': 'https://beta.cloud.hokkj.cn',
        'production': 'https://cloud.hokkj.cn'
      },
      platformArray: [],
      merchantData: null,
      userInfo: null,
      fromType: '',
      filterPath: ['/videoManagement/accountApproval', '/videoManagement/operationalRank'],
      path: '',
      breadcrumbData: {
        path: '/videoManagement/dataScreening',
        name: '数据概览'
      }
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'fuxiVersion', 'isNewSocketVideoPublish'])
  },
  created() {
    this.fromType = this.$route.query.fromType
    this.path = this.$route.query.path || ''
    console.log(this.path, '当前path')
    this.platformAccountId = this.$route.query.accountId
    this.userInfo = this.$store.getters.userInfo
    console.log(this.userInfo, '当前用户信息')
  },
  mounted() {
    this.loadUserLoginInfo()
    this.initBreadcrumbData()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleChange() {

    },
    goAccountPage() {
      this.dialogVisible = false
      this.$router.push({
        path: '/videoManagement/accountManage'
      })
    },
    // 同步数据流程
    async syncData() {
      const isSocket = this.isNewSocketVideoPublish
      if (!isSocket) {
        this.$refs.DownloadModal.show()
        return
      }
      this.syncLoading = true
      const res1 = await querySyncInfoById({ platformAccountId: this.platformAccountId })
      res1.data[0].newVersion = this.allChannelSwitch[res1.data[0].platformId]
      isUseNewClient(res1.data[0].platformId, 'check-account-login-status', res1.data[0].platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify(res1.data), (response) => {
        const checkAccountLoginStatusRes = JSON.parse(response)
        const res = checkAccountLoginStatusRes[0]
        console.log(res, '当前检测账号')
        if (res.Code === 200) {
          updateLoginStatus({
            platformAccountId: res1.data[0].platformAccountId,
            name: res.AuthorName,
            avatar: res.AuthorLogo,
            cookie: res1.data[0].cookie,
            remark: '检测登录自媒体账号',
            type: 1,
            loginStatus: 2
          })
          getPlatformLogin().then(async (obj) => {
            this.merchantData = obj.data
            const syncAccountInfo = []
            syncAccountInfo.push({
              accountId: `${res1.data[0].platformAccountId}`,
              time: new Date().getTime(),
              platformId: res1.data[0].platformId,
              cookie: res1.data[0].cookie,
              syncAction: [
                'SyncAccountReportListData',
                'SyncAccountData',
                'SyncAccountNotificationList',
                'SyncAccountContentList'
              ],
              token: this.merchantData.merchantToken,
              callbackUrl: this.envList[process.env.NODE_ENV] + '/cloud/edata-wemedia/callBack/syncData',
              startTime: moment(this.value[0]).format('YYYY-MM-DD'),
              endTime: moment(this.value[1]).format('YYYY-MM-DD'),
              newVersion: this.allChannelSwitch[res1.data[0].platformId]
            })
            await insertSyncStatus({ platformAccountIds: [res1.data[0].platformAccountId], version: this.fuxiVersion })
            isUseNewClient(res1.data[0].platformId, 'platforms-data-sync', res1.data[0].platformAccountId, '数据同步').emit('platforms-data-sync', JSON.stringify(syncAccountInfo), (response) => {
              console.log(response, '1111111111')
              this.$message.success('数据同步成功')
              this.syncLoading = false
              this.loadDetailData()
            })
            isUseNewClient(res1.data[0].platformId, 'sync-data-complete', res1.data[0].platformAccountId, '数据同步监听返回').on('sync-data-complete', (data) => {
              console.log(data, '同步数据返回')
              this.$message.success('数据同步成功')
              this.syncLoading = false
              this.loadDetailData()
              // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'sync-data-complete', 'remark': '监听数据同步回调' })
            })
          })
        } else {
          if (res?.PlatformAccountInfo.Code === -1) {
            updateUnLogin({
              loginStatus: 1,
              platformAccountId: res1.data[0].platformAccountId,
              cookie: res1.data[0].cookie,
              version: this.fuxiVersion
            })
          }
          this.$store.dispatch('videoManage/saveErrorInfo', {
            platformAccountId: res1.data[0].platformAccountId,
            requestParam: res1.data[0].cookie,
            planId: res1.data[0].platformId,
            apiUrl: 'check-account-login-status',
            errorInfo: res?.PlatformAccountInfo.Message
          })
          // this.$message({
          //   message: '账号未登录',
          //   type: 'error'
          // })
          this.dialogVisible = true
          this.syncLoading = false
        }
      })
    },
    loadUserLoginInfo() {
      getLoginInfo().then(res => {
        if (res.success) {
          this.roleObject = res.data
          this.loadPlatformData()
          this.loadDetailData()
          this.getLogList()
          console.log(this.roleObject)
        }
      })
    },
    async getLogList() {
      const params = {
        platformAccountId: this.platformAccountId,
        pageIndex: 1,
        type: 1,
        pageSize: 1000
      }
      const res = await getLogList(params)
      this.logList = res.data.items
      console.log(res, '日志记录')
    },
    // 初始化面包屑信息
    initBreadcrumbData() {
      const query = this.$route.query
      console.log(query, 22222222)
      const { name, path } = query
      if (name && path) {
        this.breadcrumbData.path = path
        this.breadcrumbData.name = name
      }
    },
    downloadUrl(url) {
      window.open(url)
    },
    changeAccountPlatform() {
      this.platformAccountId = this.form.platformAccountId
      this.loadDetailData()
      this.$nextTick(() => {
        this.$refs.dataShowBlock.loadData(this.platformAccountId)
        // const timeObj = this.$refs.dataShowBlock.searchForDetail
        // this.$refs.showWorks.loadData({
        //   startTime: timeObj.time[0],
        //   endTime: timeObj.time[1]
        // })
        this.getLogList()
      })
    },
    loadTableData(data) {
      this.$refs.showWorks.config.currentPage = 1
      this.$refs.showWorks.loadData(data)
    },
    loadDetailData() {
      const params = {
        platformAccountId: this.platformAccountId
      }
      getAccountWeMediaData(params).then(res => {
        if (res.success && res.data) {
          this.detailObj = res.data
        }
      })
      getAccountDetailMessage(params).then(res => {
        console.log('ssssssssssssssss:', res)
        if (res.success && res.data) {
          this.detailMessage = { ...res.data }
          if (this.detailMessage.deptName && this.detailMessage.deptName.length > 18) {
            this.detailMessage.deptFlag = true
          }
          if (this.detailMessage.teacherName && this.detailMessage.teacherName.length > 18) {
            this.detailMessage.teacherFlag = true
          }
          if (this.detailMessage.operatorName && this.detailMessage.operatorName.length > 18) {
            this.detailMessage.operatorFlag = true
          }
          if (this.detailMessage.group && this.detailMessage.group.length > 18) {
            this.detailMessage.groupFlag = true
          }
        }
      })
    },
    loadPlatformData() {
      console.log(this.roleObject, 'juese')
      const obj = {
        type: ''
      }
      if (this.path === '/videoManagement/abnormalManage') {
        obj.type = 1
      }
      if ((this.path !== '/videoManagement/myData') || this.path === '') {
        getMyPlatform(obj).then(res => {
          if (res.success) {
            this.platformArray = res.data
          }
        })
      } else {
        // 我的数据进来的
        qryAccountPlatform().then(res => {
          if (res.success) {
            this.platformArray = res.data
          }
        })
      }
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
    },
    choosePlatform(val) {
      this.form.platformAccountId = ''
      const params = {
        type: '',
        platformId: val
      }
      if (this.path === '/videoManagement/abnormalManage') {
        params.type = 1
      }
      if ((this.path !== '/videoManagement/myData') || this.path === '') {
        getMyAccountList(params).then(res => {
          if (res.success) {
            this.accountArray = res.data
          }
        })
      } else {
        // 我的数据进来的
        getAllAccountIds(params).then(res => {
          if (res.success && res) {
            this.accountArray = res.data
            if (this.accountArray?.length > 0) {
              this.form.platformAccountId = this.accountArray[0].platformAccountId
            }
          }
        })
      }
      //
      // if (this.fromType === 'all') {
      //   getAllAccountIds(params).then(res => {
      //     if (res.success && res) {
      //       this.accountArray = res.data
      //       if (this.accountArray?.length > 0) {
      //         this.form.platformAccountId = this.accountArray[0].platformAccountId
      //       }
      //     }
      //   })
      // } else {

      // }
    }

  }
}
</script>
<style>
.my-popover {
  padding: 0px !important; /* replace with your desired padding */
  box-sizing: border-box;
  width: 624px;
}
</style>
<style lang="scss" scoped>
.record_title{
  border-bottom: 1px solid #E7E7E7;
  padding: 24px;
  box-sizing: border-box;
  .title_name{
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
  .title_time{
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    margin-left: 8px;
  }
}
.record_details{
  padding: 16px 24px;
  box-sizing: border-box;
  max-height: 500px;
  .timeLine_content{
    width: 100%;
    padding: 6px;
    box-sizing: border-box;
    background: #F4F8FF;
    .timeLine_content_title1{
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
    .timeLine_content_title2{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
    .timeLine_content_old{
      font-size: 14px;
      font-weight: 400;
      color: #777777;
    }
    // .timeLine_content_new{
    //   font-size: 14px;
    //   font-weight: 400;
    //   color: #777777;
    // }
  }
  .user_info{
    margin-bottom: 16px;
    .user_info_platformImg{
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #F5F5F5;
      margin-right: 8px;
      img{
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }
    .user_info_platformName{
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      margin-right: 8px;
    }
    .user_info_channel{
      background: #F2F9FF;
      border-radius: 4px;
      border: 1px solid #0C6FFF;
      font-size: 14px;
      font-weight: 400;
      color: #0C6FFF;
      padding: 4px 18px;
      box-sizing: border-box;
    }
  }
}
.account-detail-pages {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  background: #fff;
  border-radius: 10px;
}
::v-deep .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
}
.details-container-account ::v-deep {
    padding: 20px;
    padding-bottom: 0px;
    .container-top{
      padding-bottom: 20px;
      border-bottom: 1px solid #EFF2F6;
    }
    .pickerName{
      font-size: 14px;
      color: #606266;
    }
    .tool-block {
      padding: 20px 0;
      .plus-btn {
        margin-right: 5px;
        font-weight: bold;
      }
    }
}
.account-search {
  width: 100%;
  height: 32px;
  margin-top: 15px;
  .account-search-span {
    float: left;
    width: 400px;
    height: 32px;
    line-height: 32px;
    em {
      font-size: 16px;
      color: #333;
      font-style: normal;
    }
    i {
      margin-left: 10px;
      font-size: 14px;
      color: #777;
      font-style: normal;
      height: 32px;
      line-height: 32px;
    }
  }
  .syncData{
    margin-right: 12px;
  }
  .account-detail-search {
    float: right;
    display: flex;
    align-items: flex-start;
  }
}
.account-header-mess {
  width: 100%;
  margin-top: 20px;
  display: flex;
  .left-img {
    float: left;
    width: 120px;
    height: 120px;
    img {
      width: 120px;
      height: 120px;
      border-radius: 100%;
    }
  }
  .right-mess {
    flex: 1;
    margin-left: 20px;
    height: 120px;
    .right-mess-line {
      width: 100%;
      height: 30px;

    .changeRecord{
      font-size: 14px;
      font-weight: 500;
      color: #0C6FFF;
      cursor: pointer;
    }
      .title-span {
        font-size: 20px;
        color: #333;
        font-weight: bold;
        float: left;
      }
      .title-em {
        float: left;
        margin-left: 10px;
        padding: 1px 7px;
        font-size: 12px;
        border-radius: 4px;
        color: #0C6FFF;
        background: #F2F9FF;
        font-style: normal;
        border: 1px solid #0C6FFF;
      }
      .hasimg-span {
        float: left;
        margin-right: 20px;
        line-height: 30px;
        img {
          float: left;
          width: 17px;
          height: 16px;
          margin-top: 7px;
          margin-right: 5px;
        }
        em {
          font-style: normal;
          font-size: 14px;
          color: #333;
          font-weight: bold;
          float: left;
          line-height: 30px;
        }
      }
    }
    .right-mess-line-form {
      width: 100%;
      height: 60px;
      .right-mess-form-line {
        float: left;
        width: 100%;
        padding-right: 10px;
        display: flex;
        color: #777777;
        font-size: 14px;
        span {
          height: 30px;
          line-height: 30px;
          width: 70px;
          text-align: right;
        }
        p {
          height: 30px;
          line-height: 30px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #555;
        }
      }
    }
  }
}

.account-detail-show {
  width: 100%;
  display: inline-block;
  margin-top: 30px;
}

</style>

