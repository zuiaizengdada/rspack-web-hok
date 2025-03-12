<template>
  <!-- 发货弹框  -->
  <AppDialog
    v-model="config.visible"
    title="发货"
    width="696px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="sendGoods overflowOuto">
      <div class="m-b-20 form_row">
        <div class="form_view" style="width: 377px">
          <div class="form_label m-l-16">用户昵称：</div><div class="form_value">{{ filtersTextPhone(detail.winnerUserName) }}</div>
        </div>
        <div class="form_view">
          <div class="form_label">手机号码：</div><div class="form_value">
            <watchPhoneNumber :default-value="detail.winnerUserPhone" :params="detail" :user-id="detail.winnerUserId" :get-api="operationLogsWrite" />
          </div>
        </div>
      </div>

      <div class="recipient">
        <div class="form_row">
          <div class="form_view m-b-10" style="width: 357px">
            <div class="form_label">收件人：</div><div class="form_value">{{ detail.addressee }}</div>
          </div>
          <div class="form_view">
            <div class="form_label">收件人电话：</div><div class="form_value">
              {{ Decrypt(detail.addresseePhone) }}
              <!-- <watchPhoneNumber :web-filter="true" :default-value="Decrypt(detail.addresseePhone)" @success="watchPhoneNumberSuccess(detail)" /> -->
            </div>
          </div>
        </div>
        <div class="form_row">
          <div class="form_view">
            <div class="form_label">收件地址：</div><div class="form_value">{{ detail.recipientAddress }}</div>
          </div>
        </div>
      </div>

      <div v-if="config.type === 1" style="margin-top: 15px">
        <el-form ref="form" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
          <el-form-item label="快递公司" prop="expressCompany">
            <el-select v-model="form.expressCompany" clearable placeholder="请选择" style="width: 245px">
              <el-option label="顺丰快递" :value="1" />
              <el-option label="圆通快递" :value="2" />
              <el-option label="中通快递" :value="3" />
              <el-option label="韵达快递" :value="4" />
              <el-option label="申通快递" :value="5" />
              <el-option label="百世汇通" :value="6" />
              <el-option label="中国邮政" :value="7" />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号" prop="trackingNumber">
            <el-input v-model.trim="form.trackingNumber" style="width: 245px" clearable maxlength="50" />
            <div class="errorTips">仔细核对快递单号，请勿出错！</div>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="config.type === 2" style="margin-top: 16px">
        <div class="form_row">
          <div class="form_view m-b-10" style="width: 377px">
            <div class="form_label m-l-16 f-s-14">快递公司：</div><div class="form_value f-s-14">{{ {1: '顺丰快递', 2: '圆通快递', 3: '中通快递', 4: '韵达快递', 5: '申通快递', 6: '百世汇通',7: '中国邮政'}[detail.expressCompany] }}</div>
          </div>
          <div class="form_view">
            <div class="form_label f-s-14">快递单号：</div><div class="form_value f-s-14">{{ detail.trackingNumber }}</div>
          </div>
        </div>
        <div class="form_row">
          <div class="form_view" style="width: 377px">
            <div class="form_label m-l-16 f-s-14">操作人：</div><div class="form_value f-s-14">{{ detail.operateName }}</div>
          </div>
          <div class="form_view">
            <div class="form_label f-s-14">操作时间：</div><div class="form_value f-s-14">{{ detail.operateTime | filterTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getPrizeLogisticDetail, updatePrizeLogistic } from '@/api/liveRoom/index'
import moment from 'moment'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import { Decrypt } from '@/views/live/utils/secrt.js'
import { filtersTextPhone } from '@/utils/index'

export default {
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      } else {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  components: { AppDialog,
    watchPhoneNumber },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          winId: '',
          type: 1,
          visible: false,
          liveRoomId: ''
        }
      }
    }
  },
  data() {
    return {
      top: '114px',
      loading: false,
      form: {
        expressCompany: '',
        trackingNumber: ''
      },
      detail: {
        addressee: '',
        addresseePhone: '',
        expressCompany: '',
        id: '',
        operateName: '',
        operateTime: '',
        recipientAddress: '',
        status: '',
        trackingNumber: '',
        winnerUserName: '',
        winnerUserPhone: ''
      },
      rules: {
        expressCompany: [
          { required: true, message: '请选择快递公司', trigger: 'change' }
        ],
        trackingNumber: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getDetail()
        this.form = {
          expressCompany: '',
          trackingNumber: ''
        }
        this.detail = {
          addressee: '',
          addresseePhone: '',
          expressCompany: '',
          id: '',
          operateName: '',
          operateTime: '',
          recipientAddress: '',
          status: '',
          trackingNumber: '',
          winnerUserName: '',
          winnerUserPhone: ''
        }
        this.$refs.form && this.$refs.form.clearValidate()
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 595) / 2 + 'px'
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    Decrypt,
    sure() {
      if (this.config.type === 2) {
        this.config.visible = false
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.update()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getDetail() {
      this.loading = true
      const data = {
        winId: this.config.winId
      }
      getPrizeLogisticDetail(data).then(res => {
        this.detail = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 更新物流信息
    update() {
      if (!this.detail.id) {
        return this.$message.error('用户未填写收货信息!')
      }
      this.loading = true
      const data = {
        expressCompany: this.form.expressCompany,
        trackingNumber: this.form.trackingNumber,
        logisticsId: this.detail.id,
        winnerId: this.config.winId
      }
      updatePrizeLogistic(data).then(res => {
        this.loading = false
        this.detail = res.data
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },

    watchPhoneNumberSuccess(detail) {
      // 埋点
      const phoneNum = Decrypt(detail.addresseePhone)?.replace(/([\w]{3})[\w\W]+([\w]{4})$/, '$1xxxx$2')
      const params = {
        liveRoomId: this.config.liveRoomId,
        operationType: liveOperationType.type103,
        phoneNum,
        userId: detail.winnerUserId
      }
      this.$store.dispatch('im/operationLogsWrite', params)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.config.liveRoomId,
        userId: params.winnerUserId,
        phoneNum: params.winnerUserPhone,
        operationType: liveOperationType.type8
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.sendGoods {
    height: 293px;
    padding: 20px 34px;
    .form_row {
      display: flex;
    }
    .form_view {
        display: flex;
        .form_label {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
        }
        .form_value {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 22px;
        }
    }
    .recipient {
      background: #EDF0F2;
      border-radius: 4px;
      padding: 16px 20px;
    }
}
.m-l-16 {
  margin-left: 16px;
}
.errorTips {
  margin-top: 10px;
  margin-left: 8px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ED1B24;
  line-height: 17px;
}
.f-s-14 {
  font-size: 14px!important;
}
</style>
