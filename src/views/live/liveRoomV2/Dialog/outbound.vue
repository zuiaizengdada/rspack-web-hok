<template>
  <el-dialog
    :top="top"
    :show-close="false"
    :title="title"
    :visible.sync="visible"
    :width="width"
    :modal="false"
    :close-on-click-modal="true"
  >
    <div slot="title" class="ss-material-box-header" />
    <div class="outboundBox">
      <div class="outbound">
        <template v-if="padingLoading">
          <div class="userImg">
            <el-skeleton-item
              variant="image"
              style="width: 92px; height: 92px; border-radius: 50%"
            />
          </div>
          <div class="content">
            <MLoading :visible="true" />
          </div>
        </template>
        <template v-else>
          <div class="userImg">
            <!-- <el-image :src="userInfo.traineePicUrl" alt="" class="memberPic" /> -->
            <AppAvatar
              :avatar="userInfo.traineePicUrl"
              :name="userInfo.traineeName || phone"
              width="92"
              :no-name="true"
              class="memberPic"
            />
            <div v-if="[2, 3, 4, 6].includes(active)" class="img_mask">
              <!-- 呼叫中 -->
              <img
                v-if="[2, 7].includes(active)"
                class="img_mask_img"
                src="~@/assets/image/liveRoom/bigCalling.png"
                alt=""
              />
              <!-- 呼叫失败 -->
              <img
                v-else-if="[3, 6].includes(active)"
                class="img_mask_img"
                src="~@/assets/image/liveRoom/big_call_failed.png"
                alt=""
              />
              <!-- 通话中 -->
              <img
                v-else-if="[4].includes(active)"
                src="~@/assets/image/liveRoom/callIng.png"
                alt=""
                class="img_mask_img"
              />
            </div>
          </div>
          <div class="content">
            <div class="outbound_title">{{ tipTitle }}</div>
            <div class="userInfo">
              <span
                v-if="[2, 3, 4, 6].includes(active)"
                style="font-weight: 400; font-size: 16px"
              >
                被叫
                <span
                  v-if="userInfo.phoneAreaCode"
                  class="m-r-10"
                >+{{ userInfo.phoneAreaCode }}</span>
                {{ phone }}
              </span>
              <span
                v-else
              ><span
                v-if="userInfo.phoneAreaCode"
                class="m-r-10"
              >+{{ userInfo.phoneAreaCode }}</span>{{ phone }}</span>
            </div>
            <div class="footer">
              <div
                v-if="active === 1"
                class="footerBtn dial"
                @click="onhandleDial"
              >
                <img
                  src="~@/assets/image/liveRoom/dial_white.png"
                  alt=""
                  class="dialIcon"
                />
                外呼拨打
              </div>
              <div
                v-if="active === 2"
                v-loading="loading"
                class="footerBtn cancel"
                @click="onhandleCancel"
              >
                <img
                  src="~@/assets/image/liveRoom/callinging.png"
                  alt=""
                  class="dialIcon"
                />
                取消呼叫
              </div>
              <div
                v-if="active === 4"
                v-loading="loading"
                class="footerBtn cancel"
                @click="onhandleHangUp"
              >
                <img
                  src="~@/assets/image/liveRoom/hangUp.png"
                  alt=""
                  class="dialIcon"
                />
                挂断
              </div>
              <div v-if="active === 3" class="footerBtn" @click="onhandleDial">
                重试
              </div>
              <div
                v-if="active === 1 || active === 3"
                class="footerBtn"
                @click="onhandleCancel"
              >
                取消
              </div>
              <div v-if="active === 5 || active === 6">
                <div class="errMsgTip">{{ errMsgTip }}</div>
                <div class="footerBtn" @click="onhandleCancel">我知道了</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { countPhoneCnable, callAgentTestCall, callAgentStatus } from '@/api/privateArea/outboundSeats'
import {
  callPhone,
  callEnable,
  getCallStatus,
  cancelCall,
  callHungUp,
  callByPhone
} from '@/api/liveRoom/liveRoom.js'
import { getUserInfo } from '@/api/liveRoom/im.js'
import { liveOperationType } from '@/views/live/columns.js'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: {
    AppAvatar
  },
  data() {
    return {
      visible: false,
      width: '500px',
      title: '',
      top: '10vh',
      phoneAreaCode: '', // 手机号区号
      userName: '', // 传入的用户姓名
      userInfo: {
        traineePicUrl: '', // 用户头像
        phoneAreaCode: '', // 手机号区号
        traineeName: '' // 用户名称
      },
      loading: false,
      padingLoading: false, // 详情的加载
      userId: '',
      phone: '',
      liveRoomDetail: {},
      ifByUserId: false, // 是否通过userId拨打
      // 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
      status: 1,
      liveCallRecordId: '',
      // 呼叫失败回调
      fail: () => {},
      // 通话结束回调
      success: () => {},
      // 通话挂断回调
      hangUp: () => {},
      // 通话取消回调
      cancelCall: () => {},
      errTips: '呼叫失败',
      // 拨打状态1:未拨打 2：拨打中(已发送拨打请求) 3：拨打失败 4: 通话中  5: 无权限 6:当前学员已超过呼叫次数 7: 拨打中(未发送拨打请求，权限处理状态) 8: 通过结束
      active: 1,
      errMsgTip: ''
    }
  },
  computed: {
    tipTitle() {
      if (this.active === 1) {
        return `拨打 ${this.userInfo.traineeName || ''}`
      } else if (this.active === 2) {
        return '呼叫中...'
      } else if (this.active === 6) {
        return '当前学员已超过呼叫次数'
      } else if (this.active === 5) {
        return `${this.userInfo.traineeName || ''}`
      } else if (this.active === 3) {
        return this.errTips || '呼叫失败'
      } else if (this.active === 7) {
        return '呼叫中...'
      } else if (this.active === 8) {
        return '通话结束'
      } else if (this.active === 4) {
        return '通话中'
      }
      return ''
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getUserInfoDetail()
          this.handleCallEnable()
        } else {
          this.phoneAreaCode = ''
          this.userName = ''
          this.userInfo = {
            traineePicUrl: '', // 用户头像
            phoneAreaCode: '', // 手机号区号
            traineeName: '' // 用户名称
          }
          this.cancelCall && this.cancelCall()
          this.visible = false
          this.loading = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 383) / 2 + 'px'
  },
  methods: {
    // 点击外呼拨打
    onhandleDial() {
      if (this.loading) return
      this.active = 2
      this.call()
      this.success && this.success(this.active)
    },
    // 点击取消按钮
    onhandleCancel() {
      if (this.loading) return
      // 如果未发送拨打请求，则直接关闭，否则调用取消拨打的接口
      if (!this.liveCallRecordId) {
        this.visible = false
        this.cancelCall && this.cancelCall()
        return
      }
      this.loading = true
      const data = { liveCallRecordId: this.liveCallRecordId }
      cancelCall(data)
        .then(res => {
          this.cancelCall && this.cancelCall()
          this.visible = false
          this.loading = false
        })
        .catch(() => {
          this.cancelCall && this.cancelCall()
          this.visible = false
          this.loading = false
        })
    },
    // 点击拨打
    async call() {
      this.errTips = ''
      // 查询是否具备拨打权限
      this.active === 7
      this.success && this.success(1)
      callEnable()
        .then(res => {
          if (res.code === 1 && res.data?.isCall) {
            this.testCall()
          } else {
            this.errMsgTip = res.data?.message
            // 不具备拨打权限
            this.active = 5
          }
        })
        .catch(err => {
          console.log(err)
          this.handleError()
        })
    },
    // 测试呼叫
    testCall() {
      this.active = 2
      console.log(this.userInfo, this.liveRoomDetail)
      const apiFn = !this.ifByUserId ? callByPhone : callPhone
      apiFn({
        liveRoomId: this.liveRoomDetail.liveRoomId,
        studentId: this.userId,
        studentPhoneNumber: this.phone
      })
        .then(res => {
          console.log(res, 'res')
          this.liveCallRecordId = res.data.liveCallRecordId
          this.foreachCallStatus()
          return true
        })
        .catch(err => {
          // console.log(err, '拨打失败')
          if (err.code && err.code === 800033) {
            this.$message.error(err.errorMsg || err.message || '呼叫失败')
            this.active = 6
            return this.fail()
          } else {
            this.active = 3
            this.errTips = err.errorMsg || err.message || '呼叫失败'
            this.handleError()
          }
        })
    },
    // 循环获取呼叫状态
    foreachCallStatus() {
      getCallStatus(this.liveCallRecordId)
        .then(res => {
          console.log('循环获取呼叫状态')
          this.status = res.data
          if (res.data !== 4 && this.visible) {
            res.data === 3 && (this.active = 4) // 通话中
            // 延迟0.5秒去获取，不然太频繁的发起请求了
            setTimeout(() => {
              this.foreachCallStatus()
            }, 500)
          } else {
            this.success && this.success(res.data)
            res.data === 4 && this.handleClose()
          }
        })
        .catch(() => {
          // this.$message.error('获取呼叫状态失败')
          console.log('获取呼叫状态失败')
          this.handleError()
        })
    },
    // 呼叫失败
    handleError() {
      this.active = 3
      return this.fail()
    },
    // 通话结束
    handleClose() {
      this.active = 8
      this.visible = false
      console.log('通话结束')
    },
    // 点击挂断
    onhandleHangUp() {
      if (this.loading) return
      this.loading = true
      const data = {
        liveCallRecordId: this.liveCallRecordId
      }
      callHungUp(data)
        .then(() => {
          this.visible = false
          this.hangUp && this.hangUp()
          this.loading = false
        })
        .catch(() => {
          this.hangUp && this.hangUp()
          this.loading = false
        })
    },
    // 获取用户详情和用户手机号
    getUserInfoDetail() {
      if (this.phone) {
        this.ifByUserId = false
        // 有手机号传入则不用通过接口去获取
        this.userInfo = {
          traineePicUrl: '', // 用户头像
          phoneAreaCode: this.phoneAreaCode, // 手机号区号
          traineeName: this.userName // 用户名称
        }

        if (!(this.phoneAreaCode === '86' || this.userInfo.phoneAreaCode === '86')) {
          console.log(this.phoneAreaCode, this.userInfo.phoneAreaCode, '1111')
          this.errMsgTip = '暂不支持国外号码'
          // 不具备拨打权限
          this.active = 5
          return
        }
      } else {
        this.ifByUserId = true
        // 无手机号传入，则先通过userId去获取用户详情
        this.padingLoading = true
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
        getUserInfo({
          traineeId: this.userId,
          liveRoomId: this.liveRoomDetail.liveRoomId
        })
          .then(res => {
          this.traineeId = res.data.traineeId
            this.userInfo = res.data
            if (this.userInfo.phoneNumber) {
              return this.operationLogsWrite(this.userInfo)
            } else {
              this.handleError()
            }
            this.padingLoading = false
          })
          .catch(() => {
            this.padingLoading = false
          })
      }
    },
    handleCallEnable() {
      callEnable()
        .then(res => {
          if (!(res.code === 1 && res.data?.isCall)) {
            // 不具备拨打权限
            this.errMsgTip = res.data?.message
            this.active = 5
          }
        })
        .catch(err => {
          console.log(err)
          this.handleError()
        })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomDetail?.liveRoomId,
        userId: this.userId,
        phoneNum: params.phoneNumber,
        operationType: liveOperationType.type1
      }
      return this.$store.dispatch('im/operationLogsWrite', data).then(res => {
        this.phone = res.data
        this.padingLoading = false

        console.log(this.phoneAreaCode, this.userInfo.phoneAreaCode, '1111')
        if (!(this.phoneAreaCode === '86' || this.userInfo.phoneAreaCode === '86')) {
          this.errMsgTip = '暂不支持国外号码'
          // 不具备拨打权限
          this.active = 5
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.outboundBox {
  width: 500px;
  height: 500px;
}
.outbound {
  margin: 0 auto;
  width: 284px;
  position: relative;
  .userImg {
    width: 92px;
    height: 92px;
    border-radius: 50%;
    transform: translateY(50%);
    border: 2px solid #fff;
    margin: auto;
    border: 2px solid #fff;
    position: relative;
    overflow: hidden;
    z-index: 2;
    > .memberPic {
      width: 100%;
      height: 100%;
    }
    .img_mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgb(0 0 0 / 50%);
      display: flex;
      border-radius: 50%;
      align-items: center;
      overflow: hidden;
      justify-content: center;
      > .img_mask_img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .content {
    position: relative;
    min-height: 276px;
    flex-shrink: 0;
    border-radius: 15px;
    border: 1px solid #c7e3df;
    background: linear-gradient(90deg, #ebfffb 0%, #fff6fd 100%);
    box-shadow: 0 0 10px 0 #0000001a;
    padding-left: 26px;
    padding-right: 23px;
    padding-bottom: 30px;
    .outbound_title {
      padding-top: 74px;
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 16px;
      line-height: 16px;
      text-align: center;
      font-weight: bolder;
      margin-bottom: 18px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .userInfo {
      margin-bottom: 27px;
      text-align: center;
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 20px;
      font-weight: bolder;
      line-height: 20px;
    }
    .footer {
      .errMsgTip {
        margin-bottom: 20px;
        text-align: center;
        color: #f74a4a;
      }
      .footerBtn {
        width: 235px;
        height: 42px;
        border-radius: 10px;
        border: 1px solid #f3f3f3;
        background: #fff;
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        line-height: 42px;
        text-align: center;
        font-weight: bolder;
        cursor: pointer;
        margin-bottom: 10px;
      }
      .dial {
        background: #20cb37;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        .dialIcon {
          width: 13px;
          height: 13px;
          margin-right: 5px;
        }
      }
      .cancel {
        background: #f74a4a;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        .dialIcon {
          width: 13px;
          height: 13px;
          margin-right: 5px;
        }
      }
    }
  }
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
  }
  .el-dialog__header {
    padding: 0;
    padding-bottom: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .ss-material-box-bottom {
    display: flex;
    padding-right: 20px;
    padding-left: 20px;
    justify-content: flex-end;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 66px;
    // background-color: #fafbfc;
    border-radius: 2px 2px 0 0;
  }
  .ss-material-box-header {
    height: 0;
    padding: 0;
  }
  .el-dialog {
    overflow: hidden;
    pointer-events: auto;
    background: transparent;
    box-shadow: none;
    border-radius: 15px;
  }
}
</style>
