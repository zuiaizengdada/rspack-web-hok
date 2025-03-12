<template>
  <div class="messageHeader">
    <div class="privateChat">
      <div class="privateChatHeader">
        <div class="userName">{{ userInfo.remarks || filtersTextPhone(userInfo.traineeName) || '--' }}</div>
        <!-- <div v-if="userInfo.liveRoomName" class="userLiveRoom">{{ userInfo.liveRoomName }}</div> -->
        <el-tag size="mini" effect="plain" type="success" class="m-l-10 Inviter">邀请人：{{ userInfo.inviteTeacherName || '暂无' }}</el-tag>

        <el-tag v-if="userInfo.wechatTag" size="mini" effect="plain" type="success" class="m-l-10 Inviter">标签：{{ userInfo.wechatTag }}</el-tag>
      </div>
      <div class="privateForm">
        <div class="formItem"><span class="formLabel">手机号</span>
          <span class="formValue">
            <watchPhoneNumber v-if="userInfo.phoneNumber" :phone-area-code="userInfo.phoneAreaCode" :default-value="userInfo.phoneNumber" :params="userInfo" :user-id="userInfo.traineeId" :get-api="operationLogsWrite" />
            <span v-else>--</span>
          </span>
        </div>
        <div class="formItem"><span class="formLabel">邮箱</span>
          <span class="formValue">
            <watchPhoneNumber v-if="userInfo.email" :default-value="userInfo.email" :params="userInfo" :user-id="userInfo.traineeId" :get-api="operationLogsWriteEmail" />
            <span v-else>--</span>
          </span>
        </div>
        <div class="formItem"><span class="formLabel">微信号</span><span class="formValue">{{ userInfo.wechatId || '--' }}</span></div>
        <div class="formItem"><span class="formLabel">注册日期</span><span class="formValue">{{ userInfo.registerTime | renderTime }}</span></div>
        <div class="formItem"><span class="formLabel">最近购买日期</span><span class="formValue">{{ userInfo.recentPurchaseTime | renderTime }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import Dialog from '../../Dialog/index.js'
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/liveRoom/im.js'
import moment from 'moment'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'

export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {
    watchPhoneNumber
  },
  props: {
    chatUserType: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      userInfo: {
        liveRoomId: null,
        liveRoomName: null,
        markType: '',
        phoneNumber: null,
        recentPurchaseTime: null,
        registerTime: null,
        remarks: '',
        phoneAreaCode: '',
        email: '',
        traineeName: null,
        traineePicUrl: null,
        wechatId: null
      }
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      leftList: state => state.im.leftList,
      liveGroupDetail: state => state.im.liveGroupDetail,
      ifReadStudent: state => state.im.ifReadStudent
    })
  },
  watch: {
    chatUser: {
      handler(val) {
        if (val.type === 1) {
          this.getUserInfo(val.userId)
        }
      },
      deep: true,
      immediate: true
    },
    // 会话更新时触发
    'leftList': {
      handler(val) {
        if (this.chatUser.type === 1 && this.chatUser.userId) {
          const arr = this.leftList.myTrainees.concat(this.leftList.generalTrainees)
          const obj = arr.find(v => v.memberId === this.chatUser.userId)
          if (obj) {
            this.userInfo.remarks = obj.traineeRemark
            this.userInfo.traineeName = obj.memberName
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    filtersTextPhone,
    // 点击人数调整
    onhandlePeopleEdit() {
      Dialog.open({
        visible: true,
        type: 'EditPeopleNumber',
        success: () => {
          Dialog.close()
        }
      })
    },
    getUserInfo(traineeId) {
      this.userInfo = {
        liveRoomId: null,
        liveRoomName: null,
        markType: '',
        phoneNumber: null,
        recentPurchaseTime: null,
        registerTime: null,
        remarks: '',
        traineeName: null,
        traineePicUrl: null,
        wechatId: null
      }
      getUserInfo({ traineeId, liveRoomId: this.liveRoomDetail.liveRoomId }).then(res => {
        res.data.traineeId = traineeId
        this.userInfo = res.data
      })
    },
    onhandleifReadStudent(res) {
      this.$store.commit('im/set_ifReadStudent', res)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomDetail?.liveRoomId,
        userId: params.traineeId,
        phoneNum: params.phoneNumber,
        operationType: liveOperationType.type1
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 邮箱埋点
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomDetail?.liveRoomId,
        userId: params.traineeId,
        email: params.email,
        queryType: 2,
        operationType: liveOperationType.type1
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.messageHeader {
  padding: 0 23px;
  background: #F5F5F5;
  border-bottom: 1px solid #E6E6E6;
  .publicLiveRoom {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .publicLiveRoomTitle {
      display: flex;
      align-items: center;
      .publicLiveRoomTitleName {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
      }
      .publicLiveRoomTitlePeople {
        margin-left: 10px;
        font-size: 14px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #333333;
        line-height: 16px;
        .liveRoomSum {
          font-size: 14px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 16px;
          margin-right: 8px;
        }
      }
    }
  }
  .privateChat {
    padding-top: 8px;
    padding-bottom: 8px;
    .privateChatHeader {
      display: flex;
      align-items: center;
      .userName {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 25px;
      }
      .userLiveRoom {
        margin-left: 6px;
        padding: 0 6px;
        height: 20px;
        background: #E7F0FF;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0C6FFF;
        line-height: 20px;
      }
      .Inviter {
        border-radius: 10px;
      }
    }
    .privateForm {
      margin-top: 6px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .formItem {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 20px;
        .formLabel {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 17px;
        }
        .formValue {
          margin-left: 4px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 17px;
        }
      }
    }
  }
}
.renshutiaozheng {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0C6FFF;
  line-height: 20px;
  cursor: pointer;
}
.renshutiaozhengIcon {
  font-size: 16px;
  line-height: 20px;
  margin-right: 2px;
}
</style>
