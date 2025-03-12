<template>
  <div class="warpBox">
    <div class="cardBox">
      <p>预警提醒设置</p>
      <div class="cardContent">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="CRMRemind.isRemind"
            :inactive-value="0"
            :active-value="1"
            @change="updateWechatCustomerStatus"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="CRMRemindLoading"
            btn-text="添加提醒人员"
            :data="CRMRemindList"
            @del="val => delWechatCustomer(val)"
            @add="val => addWechatCustomer(val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">提醒规则</span>
          <div class="boxText">
            <div v-loading="CRMLoading">
              智能销售计划任务开始前
              <el-input-number
                v-model="CRMBeforeEnd"
                class="m-r-8 m-l-8"
                size="mini"
                :min="0"
                :precision="0"
                :controls="false"
                style="width: 60px"
                @change="handleChangeCRM"
              />
              分钟{{ types[loginType] }}提醒创建人
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cardBox">
      <p>跟进人提醒设置</p>
      <div class="cardContent">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="followUp.isRemind"
            :inactive-value="0"
            :active-value="1"
            @change="handleChangeFollowUp"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">提醒规则</span>
          <div class="boxText">
            线索分配
            <el-input-number
              v-model="followUp.withClueDispatchHour"
              class="m-r-8 m-l-8"
              size="mini"
              :min="1"
              :precision="0"
              :max="72"
              :controls="false"
              style="width: 60px"
              @change="handleChangeFollowUp"
            />
            小时内(含),未加上客户企业微信/微信,每
            <el-input-number
              v-model="followUp.intervalMinute"
              class="m-r-8 m-l-8"
              size="mini"
              :min="1"
              :max="300"
              :precision="0"
              :controls="false"
              style="width: 60px"
              @change="handleChangeFollowUp"
            />
            分钟{{ types[loginType] }}提醒跟进人
          </div>
        </div>
      </div>
      <div v-loading="clueFollowRemindLoading" class="cardContent">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="clueFollowRemind.switchStatus"
            :inactive-value="0"
            :active-value="1"
            @change="handleChangeClueFollowRemind"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">提醒频率</span>
          <div class="boxText">
            <el-input-number
              v-model="clueFollowRemind.remindFrequency"
              size="mini"
              :min="0"
              :precision="0"
              :max="24"
              :controls="false"
              style="width: 60px"
              @change="handleChangeClueFollowRemind"
            />
            小时提醒一次
          </div>
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知时间</span>
          <el-time-picker
            v-model="clueFollowRemind.remindTime"
            format="HH:mm"
            value-format="HH:mm"
            selectable-range="00:00-23:59"
            is-range
            range-separator="至"
            size="mini"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            @change="handleChangeClueFollowRemind"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label" />
          <div class="boxText">
            通知时间段外不发信息，统计及时跟进率时，此配置时间需要过滤顺延
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import addUser from '../components/addUser.vue'
import { getItem } from '@/utils/localStorage'
import {
  getWechatCustomer,
  saleTaskRemindInfo,
  updateWechatCustomerStatus,
  updateWechatCustomer,
  editSaleTaskRemind,
  getFollowerRemind,
  setFollowerRemind,
  getClueFollowRemind,
  saveClueFollowRemind,
  getSendMsgTypeConfigApi
} from '@/api/deliver/baseSeeting'
export default {
  components: { addUser },
  data: () => ({
    loginType: 'wecom',
    types: {
      feishu: '飞书',
      wecom: '企微'
    },
    CRMRemindLoading: false,
    CRMLoading: false,
    CRMRemind: {
      isRemind: 0
    },
    clueFollowRemind: {
      switchStatus: 0
    },
    clueFollowRemindLoading: false,
    CRMBeforeEnd: 0,
    // 跟进人提醒
    followUp: {
      withClueDispatchHour: undefined,
      intervalMinute: undefined
    },
    value: ''
  }),
  mounted() {
    this.getCRMRemind()
    this.getSaleTaskRemindInfo()
    this.getFollowerRemind()
    this.getClueFollowRemind()
    this.getSendMsgTypeConfig()
  },
  methods: {
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getFollowerRemind() {
      const { code, data } = await getFollowerRemind()
      if (code === 1 && data) this.followUp = data
    },
    async getClueFollowRemind() {
      this.clueFollowRemindLoading = true
      try {
        const { code, data } = await getClueFollowRemind()
        if (code === 1 && data) {
          this.clueFollowRemind = {
            ...data,
            remindTime: [data.remindStartTime, data.remindEndTime]
          }
        }
        this.clueFollowRemindLoading = false
      } catch {
        this.clueFollowRemindLoading = false
      }
    },
    async handleChangeClueFollowRemind() {
      this.clueFollowRemindLoading = true
      try {
        if (this.clueFollowRemind.remindTime.length) {
          if (this.clueFollowRemind.remindTime[0]) {
            this.clueFollowRemind.remindStartTime =
              this.clueFollowRemind.remindTime[0]
          }
          if (this.clueFollowRemind.remindTime[1]) {
            this.clueFollowRemind.remindEndTime =
              this.clueFollowRemind.remindTime[1]
          }
        }
        const { code } = await saveClueFollowRemind(this.clueFollowRemind)
        if (code === 1) {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
        this.clueFollowRemindLoading = false
      } catch {
        this.clueFollowRemindLoading = false
      }
    },
    async handleChangeFollowUp() {
      if (this.followUp.isRemind) {
        if (
          !this.followUp.withClueDispatchHour ||
          !this.followUp.intervalMinute
        ) {
          return this.$notify.error({
            title: '保存失败',
            message: '请设置提醒规则，线索分配时间!'
          })
        }
      }
      const { code } = await setFollowerRemind(this.followUp)
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
      }
    },
    // 获取企业微信提醒
    async getCRMRemind() {
      this.CRMRemindLoading = true
      try {
        const { code, data } = await getWechatCustomer()
        if (code !== 1) {
          this.CRMRemindLoading = false
          return
        }
        if (data && data.customers.length) {
          data.customers.map(v => {
            v.nickName = v.userName
            v.userId = v.sysUserId
          })
          this.CRMRemindList = data.customers
        }
        this.CRMRemind.isRemind = data.isRemind
        this.CRMRemindLoading = false
      } catch {
        this.CRMRemindLoading = false
      }
    },
    // 获取销售任务提醒设置
    async getSaleTaskRemindInfo() {
      this.CRMLoading = true
      try {
        const { code, data } = await saleTaskRemindInfo()
        if (code === 1) {
          this.CRMBeforeEnd = data.remindMin
        }
        this.CRMLoading = false
      } catch {
        this.CRMLoading = false
      }
    },
    // 修改智能销售加微信工具提醒人员
    updateWechatCustomerStatus(val) {
      this.CRMRemindLoading = true
      const data = {
        isRemind: val ? 1 : 0
      }
      updateWechatCustomerStatus(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    },
    delWechatCustomer(index) {
      const users = JSON.parse(JSON.stringify(this.CRMRemindList))
      users.splice(index, 1)
      const sysUserIds = users.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = { sysUserIds }
      updateWechatCustomer(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    },
    addWechatCustomer(row) {
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const data = { sysUserIds }
      updateWechatCustomer(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getCRMRemind()
        })
        .catch(() => {
          this.getCRMRemind()
        })
    },
    handleChangeCRM() {
      this.CRMLoading = true
      const data = {
        remindMin: this.CRMBeforeEnd
      }
      editSaleTaskRemind(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.CRMLoading = false
          this.getSaleTaskRemindInfo()
        })
        .catch(() => {
          this.getSaleTaskRemindInfo()
          this.CRMLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.warpBox {
  padding: 20px;
  .cardBox {
    > p {
      font-size: 12px;
      margin-bottom: 12px;
    }
    > .cardContent {
      border: 1px dashed #979797;
      padding: 18px 16px;
      border-radius: 6px;
      margin-bottom: 12px;
      > div:nth-last-of-type(1) {
        margin-bottom: 0;
      }
      > .shop-line {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .boxText {
          font-size: 14px;
        }
        .shop-line-label {
          font-size: 12px;
          width: 100px;
          line-height: 28px;
          color: #333;
        }
      }
    }
  }
}
</style>
