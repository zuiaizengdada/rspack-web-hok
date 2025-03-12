<template>
  <!-- 学员信息弹框 -->
  <div v-show="visible" ref="userInfoDialog" :style="{left:left+'px',top:getTop(top)}" class="userInfoDialog" @click.stop>
    <div v-loading="loading" class="userInfo">
      <div class="userInfoHeader">
        <AppAvatar :avatar="avatar" :name="nick" width="60" :no-name="true" />
        <div class="userInfoU">
          <div class="userInfoUName text_hidden_ellipsis">{{ filtersTextPhone(nick) }}</div>
          <div class="userInfoURemake">
            <span class="remake">备注</span>
            <el-input v-if="ifEdit" v-model="remarks" style="width: 196px;height: 24px;" @keyup.native.enter="sendRemake" />
            <span v-if="!ifEdit && userInfo.remarks" class="remakeText text_hidden_ellipsis">{{ userInfo.remarks }}</span>
            <i v-if="!ifEdit" class="el-icon-edit-outline" @click="onhandleEdit" />
          </div>
        </div>
      </div>
      <div class="userInfoBody">
        <div class="userInfoBView">
          <div class="formLabel">手机号</div>
          <div class="formValue">
            <watchPhoneNumber v-if="userInfo.phoneNumber" :phone-area-code="userInfo.phoneAreaCode" :default-value="userInfo.phoneNumber" :params="userInfo" :user-id="userInfo.traineeId" :get-api="operationLogsWrite" />
            <span v-else>--</span>
          </div>
        </div>
        <div class="userInfoBView">
          <div class="formLabel">邮箱</div>
          <div class="formValue">
            <watchPhoneNumber v-if="userInfo.email" :default-value="userInfo.phoneNumber" :params="userInfo" :user-id="userInfo.traineeId" :get-api="operationLogsWriteEmail" />
            <span v-else>--</span>
          </div>
        </div>
        <div class="userInfoBView"><div class="formLabel">微信号</div><div class="formValue text_hidden_ellipsis">{{ userInfo.wechatId || '--' }}</div></div>
        <div class="userInfoBView"><div class="formLabel">注册日期</div><div class="formValue">{{ userInfo.registerTime | filterTime }}</div></div>
        <div class="userInfoBView"><div class="formLabel">最近购买日期</div><div class="formValue">{{ userInfo.recentPurchaseTime | filterTime }}</div></div>
      </div>
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { getUserInfo } from '@/api/liveRoom/im'
import moment from 'moment'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import { mapState } from 'vuex'
import { filtersTextPhone } from '@/utils/index'

export default {
  filters: {
    filterTime(val) {
      if (!val) { return '--' }
      return moment(val).format('yyyy-MM-DD')
    }
  },
  components: {
    AppAvatar,
    watchPhoneNumber
  },
  data() {
    return {
      visible: false,
      left: 0,
      top: 0,
      avatar: '',
      nick: '',
      userInfo: {
        // avatar: '',
        // userName: '大白',
        // remake: '',
        // phone: '15927745625',
        // wChat: '你不懂蛋蛋的悲伤你不懂蛋蛋的悲伤你不懂蛋蛋的悲伤你不懂蛋蛋的悲伤你不懂蛋蛋的悲伤',
        // zhucetime: '2023-02-02',
        // lastTime: '2023-02-23'
        liveRoomId: '',
        liveRoomName: '',
        markType: '',
        phoneNumber: '',
        recentPurchaseTime: '',
        registerTime: '',
        remarks: '',
        traineeName: '',
        traineePicUrl: '',
        wechatId: ''
      },
      remarks: '',
      loading: false,
      ifEdit: false,
      traineeId: ''
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    visible(value) {
      if (value) {
        setTimeout(() => {
          document.body.addEventListener('click', this.closeMenu)
        }, 200)
        this.getUserInfo()
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    closeMenu() {
      console.log('关闭弹框')
      this.visible = false
    },
    getTop(top) {
      const windHeight = document.body.clientHeight
      const markHeight = 310
      console.log(windHeight, markHeight, top)
      if (Number(markHeight + top) >= windHeight) {
        return Number(top - markHeight) + 'px'
      } else {
        return top + 'px'
      }
    },
    sendRemake() {
      this.$store.dispatch('im/updateUserRemarks', { remarksInfo: this.remarks, traineeId: this.traineeId })
      this.getUserInfo()
      this.ifEdit = false
    },
    // 获取学员信息
    getUserInfo() {
      this.loading = true
      const params = {
        traineeId: this.traineeId
      }
      getUserInfo(params).then(res => {
        console.log(res)
        this.traineeId = res.data.traineeId
        this.userInfo = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleEdit() {
      this.remarks = this.userInfo.remarks || ''
      this.ifEdit = true
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
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type1
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.userInfoDialog {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  width: 500px;
  height: 268px;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: url('../../../../../../assets/image/liveRoomUserinfoBg.png') no-repeat;
  background-size: 100% 100%;
  .userInfo {
    padding: 32px 20px;
    width: 100%;
    height: 248px;
    .userInfoHeader {
      display: flex;
      height: 60px;
      .userInfoU {
        margin-left: 20px;
        flex: 1 0 0;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        max-width: 200px;
        .userInfoUName {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 28px;
        }
        .userInfoURemake {
          margin-top: 14px;
          display: flex;
          align-items: center;
          .remake {
            margin-right: 10px;
          }
          .remakeText {
            max-width: 160px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
            margin-right: 10px;
          }
          .el-icon-edit-outline {
            font-size: 16px;
            color: #777;
            cursor: pointer;
          }
        }
      }
    }
    .userInfoBody {
      display: flex;
      flex-wrap: wrap;
      .userInfoBView {
        flex: 33.33%;
        margin-top: 20px;
        .formLabel {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 22px;
        }
        .formValue {
          max-width: 159px;
          margin-top: 8px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
      }
    }
  }
}
::v-deep {
  .el-input--medium .el-input__inner {
    height: 24px;
    line-height: 24px;
  }
}
</style>
