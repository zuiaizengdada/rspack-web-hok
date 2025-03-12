<template>
  <div class="userInfo">
    <MLoading :visible="loading" />
    <div class="userInfoLeft">
      <!-- 用户头像 -->
      <div class="userAvatar">
        <AppAvatar :avatar="userInfo.traineePicUrl" :name="userInfo.traineeName" :width="50" :no-name="true" />

        <!-- vip标识 -->
        <div v-if="userInfo.inviteTeacherName" class="tips_vip">
          <img src="~@/assets/image/liveRoom/vip_icon.png" alt="" class="tips_vip_img" />
        </div>
      </div>
    </div>
    <div class="userInfoRight">
      <div class="userInfoRightHeader">
        <div class="user_tips">
          <div class="user_name">{{ userInfo.traineeName }}</div>
          <div class="user_Inviter">邀请人：{{ userInfo.inviteTeacherName || '暂无' }}</div>
          <div v-if="userInfo.wechatTag" class="user_tags">
            <textShowMore :line-clamp="1" :text="`标签：${ userInfo.wechatTag }`" style="max-width: 367px;" />
          </div>
        </div>
      </div>
      <div class="userInfoUserInfo">
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
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapState } from 'vuex'
import moment from 'moment'
import { getUserInfo } from '@/api/liveRoom/im.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
import textShowMore from '@/components/textShowMore/index2.vue'
export default {
  filters: {
    renderTime(val) {
      if (!val) {
        return '--'
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {
    AppAvatar,
    watchPhoneNumber,
    textShowMore
  },
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      userInfo: {
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
    }
  },
  computed: {
    ...mapState({
      AVliveRoomConversationList: state => state.im.AVliveRoomConversationList,
      chatUser: state => state.im.chatUser,
      liveRoomDetail: state => state.im.liveRoomDetail,
      leftList: state => state.im.leftList,
      liveGroupDetail: state => state.im.liveGroupDetail,
      ifReadStudent: state => state.im.ifReadStudent
    })
  },
  mounted() {
    this.getUserInfo(this.userId)
  },
  methods: {
    filtersTextPhone,
    getUserInfo(traineeId) {
      this.loading = true
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
        this.loading = false
      }).catch(() => {
        this.loading = false
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
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomDetail?.liveRoomId,
        userId: params.traineeId,
        queryType: 2,
        email: params.email,
        phoneNum: params.phoneNumber,
        operationType: liveOperationType.type1
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.userInfo {
  position: relative;
  background: linear-gradient(90deg, #EBFFFB 0%, #FFF6FD 100%);
  border: 1px solid #C7E3DF;
  z-index: 2;
  display: flex;
  border-radius: 5px;
  margin-right: 15px;
  .userInfoLeft {
    width: 76px;
    max-width: 76px;
    min-width: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    .userAvatar {
      width: 52px;
      height: 52px;
      flex-shrink: 0;
      border-radius: 50%;
      border: 2px solid #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .tips_vip {
        position: absolute;
        bottom: 0;
        right: 0;
        > .tips_vip_img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .userInfoRight {
    flex: 1 0 0;
    padding: 0 11px;
    .userInfoRightHeader {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .user_tips {
        flex: 1 0 0;
        display: flex;
        flex-wrap: wrap;
        .user_name {
          color: #000000ff;
          font-family: "Microsoft YaHei";
          font-size: 20px;
          font-style: normal;
          font-weight: bolder;
          line-height: 23px;
          margin-right: 11px;
        }
        .user_Inviter {
          margin-right: 7px;
          height: 23px;
          flex-shrink: 0;
          border-radius: 5px;
          border: 1px solid #56919133;
          background: #5691910d;
          color: #569191ff;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-weight: 400;
          line-height: 23px;
          padding: 0 7px;
        }
        .user_tags {
          margin-right: 7px;
          height: 23px;
          flex-shrink: 0;
          border-radius: 5px;
          border: 1px solid #56919133;
          background: #5691910d;
          color: #569191ff;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-weight: 400;
          line-height: 23px;
          padding: 0 7px;
        }
      }
      .backRoom {
        // width: 0;
        padding: 0 9px;
        height: 28px;
        display: flex;
        border-radius: 10px;
        border: 1px solid #C7E3DF;
        background: #FFF;
        align-items: center;
        justify-content: center;
        color: #000000ff;
        font-family: "Microsoft YaHei";
        font-size: 12px;
        font-weight: 600;
        line-height: 28px;
        cursor: pointer;
        .backRoomImg {
          width: 16px;
          margin-right: 4px;
          height: 16px;
        }
      }
    }
    .userInfoUserInfo {
      border-top: 1px solid #DCDEE1;
      display: flex;
      flex-wrap: wrap;
      padding: 11px 0 0;
      .formItem {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-right: 14px;
        margin-bottom: 11px;
        .formLabel {
          color: #000000ff;
          font-family: "Microsoft YaHei";
          font-size: 12px;
          font-weight: bolder;
          line-height: 12px;
          margin-right: 5px;
        }
        .formValue {
          color: #333333ff;
          font-family: "Microsoft YaHei";
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
        }
      }
    }
  }
}
</style>
