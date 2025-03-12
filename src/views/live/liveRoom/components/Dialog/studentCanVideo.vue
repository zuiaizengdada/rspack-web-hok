<template>
  <AppDialog
    v-model="visible"
    title="查询并开通观看权限"
    width="490px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 学员无法观看视频弹框 -->
    <div class="studentCanVideo overflowOuto">
      <div class="searchTop">
        <!-- <span class="m-r-10">学员手机号</span>
        <el-input v-model.trim="search.phone" clearable style="width: 180px" size="small" maxlength="11" @input="delNoNumber" @keyup.enter.native="getList()" @clear="getList" /> -->
        <selectTelEmail v-model="search.userInfo" @onChange="getList()" />
        <el-button type="primary" size="small" class="m-l-20" @click="getList">查询</el-button>
      </div>
      <div v-if="showTips" class="errorTips">
        {{ tips }}
      </div>
      <div v-if="userInfo.list.length > 0" v-loading="loading" class="listContent">
        <div class="listContentHeader">
          <label>学员昵称：<span class="username">{{ userInfo.userName }}</span></label>
        </div>
        <div class="listContentBox">
          <div v-for="(item, index) in userInfo.list" :key="index" class="listView">
            <div class="listForm">
              <span class="formLabel">首次进入时间：</span>
              <span class="formValue">{{ item.firstEntryTime | renderTime('yyyy-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="listForm">
              <span class="formLabel">总听课时长：</span>
              <span class="formValue">{{ item.listenClassTime | filterTime }}</span>
            </div>
            <div class="listForm">
              <span class="formLabel">直播间ID：</span>
              <span class="formValue">{{ item.liveRoomId }}</span>
            </div>
            <div class="listForm">
              <span class="formLabel">直播间名称：</span>
              <span class="formValue">{{ item.liveRoomName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <div class="m-r-10"><el-checkbox v-if="userInfo.studentId && liveModel === 'AI_LIVE'" v-model="watchPermissConfig.canWatch">允许该学员进入直播间</el-checkbox></div>
      <div>
        <el-button size="small" :loading="watchPermissConfig.loading" type="primary" @click="watchPermissConfigSuccess">确定</el-button>
        <el-button size="small" :loading="watchPermissConfig.loading" @click="close()">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { queryStudentVideoWatchRecord, getWhiteListInfo, editWhiteListInfo } from '@/api/liveRoom/im'
import { mapState } from 'vuex'
import moment from 'moment'
import selectTelEmail from '@/views/live/component/selectTelEmail'
export default {
  filters: {
    renderTime(val, str) {
      if (!val) {
        return ''
      }
      return moment(val).format(str)
    },
    filterTime(value) {
      if (!value) {
        return 0
      }
      if (value < 60000) {
        return Math.floor(value / 1000) + '秒'
      }
      return Math.floor(value / 1000 / 60) + '分钟'
    }
  },
  components: {
    AppDialog,
    selectTelEmail
  },
  data() {
    return {
      loading: false,
      visible: false,
      top: '114px',
      search: {
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        }
      },
      liveRoomId: '',
      userInfo: {
        userName: '',
        studentId: '',
        list: []
      },
      liveModel: '',
      watchPermissConfig: {
        visible: false,
        loading: false,
        canWatch: false,
        userPhone: '',
        userName: '',
        studentId: ''
      },
      showTips: false,
      tips: '提示：该手机号已看过本节课相关的视频课件。请确定是否允许观看。'
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 549) / 2 + 'px'
  },
  methods: {
    sure() {},
    delNoNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    },
    getList() {
      console.log('点击查询')
      this.showTips = false
      this.userInfo.list = []
      this.tips = ''
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        // userPhone: this.search.phone,
        userPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        videoId: this.liveRoomDetail.liveRoomIntelligentInfo.videoId
      }
      if (!this.search.userInfo.value.tel && !this.search.userInfo.value.Email) {
        this.userInfo.userName = ''
        this.userInfo.studentId = ''
        this.userInfo.list = []
        this.loading = false
        return
      }
      queryStudentVideoWatchRecord(data).then(res => {
        if (res.data.length > 0) {
          this.userInfo.userName = res.data[0].studentName
          this.userInfo.studentId = res.data[0].studentId
          this.onhandleWatchPermiss()
          this.showTips = true
          this.tips = `提示：该${{ 'tel': '手机号', 'Email': '邮箱' }[this.search.userInfo.label]}已看过本节课相关的视频课件。请确定是否允许观看。`
        } else {
          this.showTips = true
          this.tips = '提示：该学员暂无观看记录。'
        }
        this.userInfo.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    close() {
      this.visible = false
    },
    // 点击观看权限
    onhandleWatchPermiss() {
      this.watchPermissConfig = {
        visible: true,
        loading: false,
        canWatch: false,
        userPhone: this.search.phone,
        studentId: this.userInfo.studentId,
        userName: this.userInfo.userName
      }
      const data = {
        liveRoomId: this.liveRoomId,
        studentId: this.watchPermissConfig.studentId
      }
      getWhiteListInfo(data).then((res) => {
        this.watchPermissConfig.canWatch = res.data.whiteList
        this.watchPermissConfig.loading = false
      }).catch(() => {
        this.watchPermissConfig.loading = false
      })
    },
    watchPermissConfigSuccess() {
      this.watchPermissConfig.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        studentId: this.watchPermissConfig.studentId,
        whiteList: this.watchPermissConfig.canWatch
      }
      editWhiteListInfo(data).then(res => {
        this.visible = false
        this.watchPermissConfig.loading = false
        this.watchPermissConfig.visible = false
      }).catch(() => {
        this.watchPermissConfig.canWatch = !this.watchPermissConfig.canWatch
        this.watchPermissConfig.loading = false
      })
      // watchPermissConfig.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.studentCanVideo {
  max-height: 518px;
  padding: 20px;
  .searchTop {
    display: flex;
    align-items: center;
  }
  .errorTips {
    width: 100%;
    padding: 10px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    line-height: 17px;
    background: #FEECEC;
    border-radius: 4px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .listContent {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #D8DCE6;
    .listContentHeader {
      display: flex;
      align-items: center;
      padding-left: 20px;
      height: 36px;
      background: #E7F0FF;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 22px;
      .username {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 22px;
      }
    }
    .listContentBox {
      padding: 0 20px 6px;
      .listView {
        padding-top: 16px;
        .listForm {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .formLabel {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #777777;
            line-height: 22px;
          }
          .formValue {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
          }
        }
      }
      .listView + .listView {
        border-top: 1px solid #E1E6ED;
      }
    }
  }
}
.watchPermiss {
  padding: 16px 20px;
  .formView {
    display: flex;
    margin-bottom: 17px;
  }
  .formLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777;
    line-height: 22px;
  }
  .formValue {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 22px;
  }
}
.m-l-24 {
  margin-left: 24px;
}
.dialog-body .ss-material-box-bottom{
  justify-content: space-between
}
</style>
