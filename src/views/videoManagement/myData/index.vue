<template>
  <div class="mydata-page">
    <div class="top_search">
      <div class="search_title">
        <span class="title_span">
          <em />
          <p>我的数据</p>
          <el-tooltip
            class="item"
            effect="dark"
            placement="bottom"
            style="float: left; margin-top: 4px;"
          >
            <div slot="content" class="content-cls">
              <p>1、当你选择指定日期范围，数据为指定日期内的增量数据</p>
              <span>作品：指定日期内所有账号发布的总作品数，包含已删除作品</span>
              <span>净增粉丝数：指定日期内所有账号的净增粉丝数，等于关注粉丝数-取消关注粉丝数</span>
              <span>播放：指定日期内所有账号发布的所有视频的播放次数</span>
              <span>点赞：指定日期内所有账号发布的所有视频的点赞次数，包含已取消的点赞</span>
              <span>评论：指定日期内所有账号发布的所有视频的评论次数，包含已删除的评论</span>
              <span>分享：指定日期内所有账号发布的所有视频成功分享的次数。小红书无分享数据</span>
              <p>2、当时间范围选择累计，作品、净增粉丝数、播放、点赞、评论、分享为账号所有作品历史累计数据</p>
              <p>3、数据按天更新，官方平台预计每日12点(各平台可能略有差异)完成截止到昨日的数据更新，数据统计时间为自然日0点到24点。伏羲云系统在每日12点后，登录系统可同步官方平台数据到伏羲云系统</p>
            </div>
            <img :src="wenhaoImg" style="float: left; margin-left: 5px; margin-top: 4px; cursor: pointer;" />
          </el-tooltip>
        </span>
        <span class="count_nums">
          <span class="count-bg" @click="toAccountList">
            <em />
            <p>账号总数</p>
            <i>{{ accountData.accountCount }}</i>
            <p class="toleft">已同步</p>
            <i>{{ accountData.syncCount }}</i>
            <p class="toleft">未同步</p>
            <i>{{ accountData.noSyncCount }}</i>
            <img src="../../../assets/image/account/icn_right_tb.png" />
          </span>
          <span class="m-l-8" style="display: inline-block;" @click="handleClickSyncData">
            <el-button size="mini" type="primary" plain :loading="visibleDialogDataSync">{{ visibleDialogDataSync?'数据同步中':'数据一键同步' }}</el-button>
          </span>
          <p>更新时间：{{ accountData.syncTime }}</p>
          <!-- <el-button type="primary" plain :loading="visibleDialogDataSync" @click="handleClickSyncData">{{ visibleDialogDataSync?'数据同步中':'数据一键同步' }}</el-button> -->
        </span>
        <div class="right_time_choose">
          <AppDatepicker
            :show="[1, 7,14,30]"
            :default="defaultTime"
            :size="search.size"
            :search="search"
            :picker-options="pickerOptions"
            @change="timeChange"
          />
        </div>
      </div>
    </div>
    <div class="top_search">
      <div class="form_search">
        <el-form :inline="true" size="mini" :model="form" class="demo-form-inline flex flex-between flex-middle">
          <div>
            <el-form-item label="平台">
              <el-select v-model="form.platformId" filterable placeholder="请选择" clearable @change="changePt">
                <el-option
                  v-for="item in platformArray"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="账号">
              <el-select v-model="form.platformAccountId" filterable placeholder="请选择账号" clearable @change="loadData">
                <el-option
                  v-for="item in accountListArray"
                  :key="item.platformAccountId"
                  :label="item.name"
                  :value="item.platformAccountId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="IP">
              <el-select v-model="form.teacherId" remote :remote-method="tearchFilter" clearable filterable placeholder="请选择IP" @blur="()=>tearchFilter('')" @change="handleChangeTeacher">
                <el-option-group
                  v-for="group in filteredGroups(tearchArray)"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadData">查询</el-button>
              <el-button @click="clear">重置</el-button>
            </el-form-item>
          </div>
          <!-- <div>
            <el-form-item>
              <svg-icon icon-class="change_record" class="m-r-8" />
              <span class="changeRecord">账号变更记录</span>
            </el-form-item>
          </div> -->
        </el-form>
      </div>
    </div>
    <data-show ref="dataShowComment" :data-obj="dataObj" :share-data-obj="shareDataObj" :search="form" />
    <dialog-data-sync :is-full="isFull" :visible.sync="visibleDialogDataSync" @handleMinimize="handleMinimize" @closeSync="closeSync" />
    <DownloadModal ref="DownloadModal" />

    <!-- <AppMemoryitem /> -->
    <!-- <DownloadModal /> -->
  </div>
</template>

<script>
import moment from 'moment'
import AppDatepicker from './components/datePicker/datepick.vue'
import dataShow from './components/dataShow.vue'
// import accountList from './components/accountList.vue'
import { mapGetters } from 'vuex'
import DialogDataSync from '../../videoPublish/components/DialogDataSync/index.vue'
import { userNoPage } from '@/api/addressBookApi'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'
import { getLoginInfo, getPlatform, getMyAccountList } from '@/api/videoManagement/accountManage'
import { getMyData, getAccountData, getOrderData } from '@/api/videoManagement/dataApi'
import wenhaoImg from '@/assets/image/account/icn_wenhao.svg'
import DownloadModal from '@/components/DownloadModal/index.vue'
// import AppMemoryitem from '@/components/AppMemoryitem'
// import DownloadModal from '@/components/DownloadModal'
export default {
  name: 'Index',
  components: {
    AppDatepicker,
    dataShow,
    // accountList,
    DialogDataSync,
    DownloadModal
  },
  data() {
    return {
      wenhaoImg,
      filteredGroups,
      accountListArray: [],
      defaultTime: 7,
      dataObj: {
        addComment: 0,
        addCommentLinkRatio: 0,
        addContent: 0,
        addContentLinkRatio: 0,
        addFans: 0,
        addFansLinkRatio: 0,
        addGreats: 0,
        addGreatsLinkRatio: 0,
        addShared: 0,
        addSharedRatio: 0,
        addVideoView: 0,
        addVideoViewLinkRatio: 0
      },
      deptTreeArray: [],
      userArray: [],
      platformArray: [],
      tearchArray: [],
      roleObject: {},
      active: 1,
      form: {
        platformId: '',
        teacherId: '',
        startTime: '',
        endTime: '',
        platformAccountId: ''
      },
      shareDataObj: {
        addFreeGmv: 0,
        addFreeGmvLinkRatio: 0,
        addFreeOrder: 0,
        addFreeOrderLinkRatio: 0,
        addGmv: 0,
        addGmvLinkRatio: 0,
        addOrder: 0,
        addOrderLinkRatio: 0,
        addPayGmv: 0,
        addPayGmvLinkRatio: 0,
        addPayOrder: 0,
        addPayOrderLinkRatio: 0
      },
      visibleDialogDataSync: false,
      isFull: true,
      titleArray: ['', '新增作品', '新增粉丝', '新增播放', '新增点赞', '新增评论', '新增分享', '新增订单', '新增免费订单', '新增付费订单', '新增GMV', '新增免费GMV', '新增付费GMV'],
      activeName: 'first',
      search: {
        size: 'mini',
        active: 7,
        time: ['', '']
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      accountData: {},
      userInfo: this.$store.getters.userInfo
    }
  },
  computed: {
    ...mapGetters([
      'isNewSocketVideoPublish'
    ])
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_videoPublish_myDataPage')
  },
  created() {
    this.userInfo = this.$store.getters.userInfo
    this.initSearch()
    this.loadPlatformData()
    this.loadTeacherData()
    this.loadAccountData()
  },
  methods: {
    loadTheAccountList() {
      getMyAccountList({ platformId: this.form.platformId, type: 2 }).then(res => {
        if (res.success) {
          this.accountListArray = res.data
        }
      })
    },
    // 初始化筛选
    initSearch() {
      let searchForm = localStorage.getItem('myDataForm')
      if (searchForm) {
        searchForm = JSON.parse(searchForm)
        console.log(searchForm, '我的数据缓存')
        this.form.platformId = searchForm.platformId
        this.loadTheAccountList()
        this.form.teacherId = searchForm.teacherId
        this.form.platformAccountId = searchForm.platformAccountId
        this.defaultTime = searchForm.active
        this.$set(this.search, 'active', searchForm.active)
        this.$set(this.search, 'time', [searchForm.startTime, searchForm.endTime])
      }
    },
    // 开始数据同步
    handleClickSyncData() {
      const isSocket = this.isNewSocketVideoPublish
      if (this.accountData.accountCount === 0) {
        this.$message.error('请先添加账号!')
        return
      }
      console.log(isSocket, this.visibleDialogDataSync, 'isSocket')
      if (isSocket) {
        if (this.visibleDialogDataSync) {
          this.isFull = true
        } else {
          this.visibleDialogDataSync = true
        }
      } else {
        this.$refs.DownloadModal.show()
      }

      // this.$openYixiaoer()
    },
    // 最小化窗口
    handleMinimize() {
      this.isFull = false
    },
    // 关闭弹窗
    closeSync() {
      this.visibleDialogDataSync = false
    },
    changePt() {
      this.form.platformAccountId = ''
      this.loadTheAccountList()
      this.loadData()
    },
    loadAccountData() {
      getAccountData().then(res => {
        console.log('dddddddddddd:', res)
        if (res.success) {
          this.accountData = res.data
        }
      })
    },
    timeChange(val) {
      console.log('vaaal:', val)
      this.search = val
      this.loadData()
    },
    loadData() {
      this.form.startTime = this.search.time[0]
      this.form.endTime = this.search.time[1]
      delete this.form.paramType
      localStorage.setItem('myDataForm', JSON.stringify({ ...{ active: this.search.active }, ...this.form }))
      getMyData(this.form).then(res => {
        if (res.success) {
          this.dataObj = res.data.weMedia
          this.$nextTick(() => {
            this.$refs.dataShowComment.showThisData()
          })
        }
      })
      this.form.operatorId = this.$store.state.user.userInfo.userId
      getOrderData(this.form).then(res => {
        if (res.success) {
          if (res.data != null) {
            this.shareDataObj = res.data
          } else {
            this.shareDataObj = {
              addFreeGmv: 0,
              addFreeGmvLinkRatio: 0,
              addFreeOrder: 0,
              addFreeOrderLinkRatio: 0,
              addGmv: 0,
              addGmvLinkRatio: 0,
              addOrder: 0,
              addOrderLinkRatio: 0,
              addPayGmv: 0,
              addPayGmvLinkRatio: 0,
              addPayOrder: 0,
              addPayOrderLinkRatio: 0
            }
          }
        }
      })
      this.$nextTick(() => {
        this.$refs.dataShowComment.getTableList()
      })
    },
    loadUserLoginInfo() {
      getLoginInfo().then(res => {
        if (res.success) {
          this.roleObject = res.data
          // this.roleObject.role = 1
          if (this.roleObject.role === 1) {
            this.encapsulateData(this.roleObject.deptInfo)
            this.deptTreeArray = this.roleObject.deptInfo
          }
        }
      })
    },
    clear() {
      this.search = {
        size: 'mini',
        active: 7,
        time: [moment().subtract(7, 'day').format('YYYY-MM-DD'), moment().subtract(7, 'day').format('YYYY-MM-DD')]
      }
      this.form = {
        platformId: '',
        teacherId: '',
        startTime: moment().subtract(7, 'day').format('YYYY-MM-DD'),
        endTime: moment().subtract(7, 'day').format('YYYY-MM-DD')
      }

      this.loadData()
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    visibleChangeD(events) {
      console.log('events: ', events)
      if (!events) {
        this.loadUserNoPage()
        console.log(this.form)
        this.loadData()
      } else {
        this.loadData()
      }
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('dataCommonUse1', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async tearchFilter(query = '') {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList, this.form.teacherId)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    // 检测是否有常用
    async handleChangeTeacher() {
      if (this.form.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'dataCommonUse1', this.form.teacherId)
        this.tearchArray = res
      }
      this.loadData()
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    handleClick() {
      console.log(1)
    },
    toAccountList() {
      this.$router.push({ path: 'accountManage' })
    }
  }
}
</script>

<style scoped lang="scss">
.mydata-page {
  width: 100%;
  height: 100%;
  min-width: 1400px;
  background: #fff;
  border-radius: 10px;
  padding: 15px 20px;
}
.top_search {
  width: 100%;
  height: 45px;
  .changeRecord{
    font-size: 14px;
    font-weight: 500;
    color: #0C6FFF;
    cursor: pointer;
  }
  .search_title {
    width: 100%;
    height: 32px;
    .title_span {
        color: #333;
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        margin-right: 10px;
        p {
            float: left;
            line-height: 24px;
            font-weight: bold;
        }
        em {
            float: left;
            width: 4px;
            height: 24px;
            border-radius: 6px;
            background: #0c6fff;
            margin-right: 8px;
        }
    }
    .count_nums {
        display: inline-block;
        width: 600px;
        line-height: 24px;
        .count-bg {
          float: left;
          padding-left: 8px;
          margin-right: 10px;
          border-radius: 2px;
          cursor: pointer;
          background: #F2F9FF;
        }
        em {
            float: left;
            width: 18px;
            height: 18px;
            margin-top: 3px;
            background-image: url(../../../assets/image/video/icn_user.png);
            background-size: 100%;
            margin-right: 4px;
        }
        p {
            float: left;
            color: #777;
            font-size: 14px;
        }
        .toleft {
          margin-left: 10px;
        }
        i {
            float: left;
            font-style: normal;
            margin-left: 4px;
            font-size: 16px;
            color: #333;
            font-weight: bold;
        }
        img {
          float: left;
          width: 5px;
          height: 8px;
          margin-left: 8px;
          margin-right: 8px;
          margin-top: 8px;
        }
    }
    .right_time_choose {
        float: right;
        height: 32px;
    }
  }
}
.mydata-table-data {
  margin-top: 30px;
}

.content-cls {
  width: 350px;
  padding-bottom: 5px;
  padding-left: 10px;
  p {
    width: 335px;
    font-size: 12px;
    line-height: 20px;
    margin-top: 2px;
  }
  span {
    width: 100%;
    display: block;
    line-height: 18px;
  }
}
</style>
