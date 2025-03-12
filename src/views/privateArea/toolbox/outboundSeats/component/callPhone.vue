<!-- 弹窗 -->
<template>
  <div v-DragDialog @DragDialog="() => {}">
    <div
      v-show="visible"
      v-loading="loading"
      class="dialogCallPhone el-dialog"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @click="dialogVisibleClick"
    >
      <div class="drag-callPhone-header el-dialog__header" />
      <div class="icon">
        <img
          v-if="status < 3"
          src="@/assets/image/outboundSeats/callpending.png"
          alt=""
        />
        <img
          v-if="status === 3"
          src="@/assets/image/outboundSeats/call.png"
          alt=""
        />
      </div>
      <!-- eslint-disable-next-line vue/no-parsing-error -->
      <div class="callTextStatus">{{ status < 3 ? '呼叫中' : '通话中' }}</div>
      <div class="callPhoneNumber">
        被叫：{{ mapEncryptionPhone(phoneTmp || phoneNumber) }}
      </div>
      <div class="callBtn" @click="callClick">
        <img src="@/assets/image/outboundSeats/canceCall.png" alt="" />
        <!-- eslint-disable-next-line vue/no-parsing-error -->
        {{ status < 3 ? '取消呼叫' : '挂断' }}
      </div>
      <div class="flex flex-middle flex-center">
        <el-checkbox v-if="isAutoCall" v-model="checked">
          本页自动呼叫下一个
        </el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import {
  callAgentTestCall,
  call,
  cancelCall,
  closeCall,
  callAgentStatus,
  getCallRecord,
  customStudentCall
} from '@/api/privateArea/outboundSeats'
import DragDialog from './directives/drag-dialog'
import { clueGetPhone } from '@/api/phoneEncrypt'
import eventBus from '@/utils/eventBus'
export default {
  directives: {
    DragDialog
  },
  data() {
    return {
      loading: false,
      checked: false,
      // 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
      status: 1,
      callNo: undefined,
      // 临时
      phoneTmp: undefined,
      isEnd: false,
      listIndex: 0,
      isAutoCall: false,
      list: [],
      phoneNumber: undefined,
      clueId: undefined,
      agentId: undefined,
      visible: false
    }
  },
  watch: {
    visible(val) {
      if (!val) {
        this.checked = false
        this.status = 1
        this.listIndex = 0
        this.phoneTmp = undefined
        this.callNo = undefined
        this.isAutoCall = false
        if (!this.callNo) return
        if (this.status === 1) {
          cancelCall({
            callNo: this.callNo
          })
        }
        if (this.status === 2) {
          closeCall({
            callNo: this.callNo
          })
        }
      } else {
        this.isEnd = false
      }
    }
  },
  created() {
    eventBus.$on('handleCall', this.handleCall)
    eventBus.$on('handleTestCall', this.handleTestCall)
    eventBus.$on('handleCallAllStudent', this.handleCallAllStudent)
    eventBus.$on('handleCallCustomAllStudent', this.handleCallCustomAllStudent)
  },
  beforeDestroy() {
    eventBus.$off('handleCall', this.handleCall)
    eventBus.$off('handleTestCall', this.handleTestCall)
    eventBus.$off('handleCallAllStudent', this.handleCallAllStudent)
    eventBus.$off('handleCallCustomAllStudent', this.handleCallCustomAllStudent)
  },
  methods: {
    vaildCallStatus() {
      if (this.visible) {
        this.$message.error('请等待当前通话结束,再进行下一次呼叫')
        return false
      }
      return true
    },
    handleCallCustomAllStudent(record) {
      if (!this.vaildCallStatus()) return
      this.phoneNumber = record.phone
      this.$nextTick(async () => {
        const isNext = await this.callCustomAllStudent()
        if (!isNext) return
        this.$uweb && this.$uweb.setAction('Event_manage_manual_call')
        this.visible = true
      })
    },
    handleCallAllStudent(record) {
      if (!this.vaildCallStatus()) return
      this.clueId = record.id
      this.phoneNumber = record.callPhone
      this.$nextTick(async () => {
        const isNext = await this.callAllStudent()
        if (!isNext) return
        this.$uweb && this.$uweb.setAction('Event_manage_manual_call')
        this.visible = true
      })
    },
    handleTestCall(record) {
      if (!this.vaildCallStatus()) return
      this.agentId = record.id
      this.phoneNumber = record.phone
      this.testCall()
      this.$nextTick(() => {
        this.visible = true
      })
    },
    async handleCall(record) {
      if (!this.vaildCallStatus()) return
      const res = await clueGetPhone(record.id)
      this.phoneNumber = res.data
      this.clueId = record.id
      this.isAutoCall = record.isAutoCall
      this.list = []
      if (record.list.length > 0) {
        const i = record.list.findIndex(f => f.id === record.id)
        record.list.forEach((r, ii) => {
          if (ii > i) {
            this.list.push(r)
          }
        })
      }
      this.$nextTick(async () => {
        const isNext = await this.call()
        if (!isNext) return
        this.$uweb && this.$uweb.setAction('Event_manage_manual_call')
        this.visible = true
      })
    },
    dialogVisibleClick(e) {
      e.stopPropagation()
    },
    // 加密手机号码中间四位
    mapEncryptionPhone(val) {
      if (!val) return ''
      return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    // 循环获取呼叫状态
    foreachCallStatus() {
      callAgentStatus({
        callNo: this.callNo
      })
        .then(res => {
          this.status = res.data
          if (res.data !== 4 && !this.isEnd) {
            this.foreachCallStatus()
          } else {
            if (this.isAutoCall && this.checked && !this.isEnd) {
              if (this.listIndex >= this.list.length) {
                this.$message.success('呼叫结束')
                this.handleClose()
                return
              }
              const info = this.list[this.listIndex]
              this.phoneTmp = info.phone
              this.call(info.id)
              this.listIndex++
              return
            }
            this.$message.success('呼叫结束')
            this.handleClose()
          }
        })
        .catch(() => {
          // this.$message.error('获取呼叫状态失败')
          this.handleClose()
        })
    },
    // 学生管理列表自定义手机号点击呼叫
    async callCustomAllStudent() {
      const res = await customStudentCall({
        calledPhone: this.phoneNumber
      }).catch(() => {
        this.handleClose()
      })
      if (!res) {
        return false
      }
      this.callNo = res.data
      this.foreachCallStatus()
      this.status = 2
      return true
    },
    // 学生管理列表点击呼叫
    async callAllStudent() {
      const res = await getCallRecord({
        deliveryInfoId: this.clueId
      }).catch(() => {
        this.handleClose()
      })
      if (!res) {
        return false
      }
      this.callNo = res.data.callNo
      this.foreachCallStatus()
      this.status = 2
      return true
    },
    // 业务操作呼叫
    async call(clueId) {
      const res = await call({
        clueId: clueId || this.clueId
      }).catch(() => {
        if (this.isAutoCall && this.checked) {
          if (this.listIndex >= this.list.length) {
            this.$message.success('呼叫结束')
            this.handleClose()
            return
          }
          const info = this.list[this.listIndex]
          this.phoneTmp = info.phone
          this.call(info.id)
          this.listIndex++
          return
        }
        this.handleClose()
      })
      if (!res) {
        return false
      }
      this.callNo = res.data.callNo
      this.foreachCallStatus()
      this.status = 2
      return true
    },
    // 测试呼叫
    async testCall() {
      const res = await callAgentTestCall({
        callAgentId: this.agentId,
        calledPhone: this.phoneNumber
      }).catch(() => {
        this.handleClose()
      })
      if (!res) {
        return false
      }
      this.callNo = res.data
      this.foreachCallStatus()
      this.status = 2
      return true
    },
    async callClick() {
      this.loading = true
      this.isEnd = true
      if (this.status < 3) {
        await cancelCall({
          callNo: this.callNo
        }).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.status = 1
      }
      if (this.status === 3) {
        await closeCall({
          callNo: this.callNo
        }).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.status = 1
      }
      this.handleClose()
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-callPhone-header {
  width: 100%;
  height: 40px;
}
.dialogCallPhone {
  width: 312px !important;
  height: auto;
  position: fixed;
  padding-bottom: 22px;
  top: 20%;
  left: 45%;
  z-index: 9999;
}
.icon {
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  img {
    width: 120px;
    height: 120px;
  }
}
.callTextStatus {
  width: 100%;
  margin-top: 24px;
  text-align: center;
  font-size: 28px;
  color: #333333;
  font-weight: 500;
  user-select: none;
}
.callPhoneNumber {
  width: 100%;
  margin-top: 12px;
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
}
.callBtn {
  width: 248px !important;
  height: 48px !important;
  background: #f53f3f;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 74px 0px 16px 32px !important;
  font-weight: 500;
  font-size: 18px;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
  img {
    width: 30px;
    height: 13px;
    margin-right: 12px;
  }
}
</style>
