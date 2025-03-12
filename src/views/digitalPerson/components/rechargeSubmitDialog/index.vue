<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="45%"
    append-to-body
    title="充值"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
  >
    <div>
      <div v-if="!isDetail && !cancelPay" class="pay-time">
        <div class="pay-time-title">订单已生成，待支付</div>
        <div class="pay-time-msg">
          剩余支付时间<span class="pay-time-msg-num">60</span>天
        </div>
        <el-button
          size="small"
          class="pay-time-btn"
          type="primary"
          plain
          @click="handleCancelPay"
        >
          取消支付
        </el-button>
      </div>
      <div class="recharge-content">
        <div class="title">套餐包含内容</div>
        <div class="content-item">
          <div v-if="orderInfo.trainingTimes" class="content-item-value">
            声音训练{{ orderInfo.trainingTimes }}次
          </div>
          <div v-if="orderInfo.trainingDuration" class="content-item-value">
            声音训练采购{{ orderInfo.trainingDuration }}分钟
          </div>
          <div v-if="orderInfo.purchaseTimes" class="content-item-value">
            形象训练采购{{ orderInfo.purchaseTimes }}次
          </div>
          <div v-if="orderInfo.videoDuration" class="content-item-value">
            视频生成时长{{ orderInfo.videoDuration }}分钟
          </div>
        </div>
        <div class="period">
          有效期：<span class="period-time">1年</span>
          <span class="period-msg">以实际支付时间为起始时间</span>
        </div>
        <div class="price">
          价格：<span class="icon-span">¥ </span>
          <span class="price-time">{{ orderInfo.packagePrice }}</span>
        </div>
      </div>
      <div class="pay-method">
        <div v-if="!isDetail && !cancelPay" class="pay-method-title">
          <div class="pay-method-title-text">付款方式</div>
          <div class="pay-method-title-radio">
            <el-radio v-model="radio" label="1">对公转账</el-radio>
          </div>
        </div>
        <div class="pay-method-content">
          <div class="pay-method-content-item">
            <div class="pay-method-content-item-title">收款户名：</div>
            <div class="pay-method-content-item-value">
              {{ paymentInfo.paymentCompany }}
            </div>
            <el-button
              class="copy-btn"
              type="primary"
              plain
              @click="handleCopy()"
            >
              复制
            </el-button>
          </div>
          <div class="pay-method-content-item">
            <div class="pay-method-content-item-title">收款银行：</div>
            <div class="pay-method-content-item-value">
              {{ paymentInfo.paymentChannel }}
            </div>
          </div>
          <div class="pay-method-content-item">
            <div class="pay-method-content-item-title">收款账号：</div>
            <div class="pay-method-content-item-value">
              {{ paymentInfo.paymentAccount }}
            </div>
          </div>
          <div class="pay-method-content-item">
            <div class="pay-method-content-item-title">识别码：</div>
            <div class="pay-method-content-item-value">
              {{ orderInfo.identifier }}
            </div>
          </div>
          <div class="msg">
            付款时，请务必将此识别码填写至 “用途 / 备注 / 摘要”
            区域，否则订单无法生效
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import {
  getOrderDetail,
  getPaymentInfo,
  cancelPayment
} from '@/api/aiVideoManage/setMealModule'
import { filterPrice } from '@/utils/index'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'changeSubmit'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      radio: '1',
      orderInfo: {},
      paymentInfo: {},
      cancelPay: false,
      cancelLoading: false
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('changeSubmit', val)
      }
    }
  },
  watch: {
    getDialogVisible: {
      handler(val) {
        if (val) {
          this.cancelPay = false
          this.getOrderDetail()
          this.getPaymentInfo()
        }
      },
      deep: true
    }
  },
  methods: {
    filterPrice,
    getPaymentInfo() {
      getPaymentInfo().then(res => {
        this.paymentInfo = res.data || {}
      })
    },
    handleCancelPay() {
      this.cancelLoading = true
      cancelPayment({ orderNo: this.info.orderId })
        .then(res => {
          this.cancelLoading = false
          this.$message.success('取消成功')
          this.cancelPay = true
        })
        .catch(() => {
          this.cancelLoading = false
        })
    },
    handleCopy() {
      const text = `收款户名：${this.paymentInfo.paymentCompany}\n收款银行：${this.paymentInfo.paymentChannel}\n收款账号：${this.paymentInfo.paymentAccount}\n识别码：${this.orderInfo.identifier}`
      // 复制到剪切板
      navigator.clipboard.writeText(text)
      this.$message.success('复制成功')
    },
    getOrderDetail() {
      this.loading = true
      getOrderDetail({ orderNo: this.info.orderId })
        .then(res => {
          this.loading = false
          this.orderInfo = res.data || {}
        })
        .catch(() => {
          this.loading = false
        })
    },
    dialogBeforeClose() {
      this.$emit('changeSubmit', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.pay-time {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  background: #e7ebfd;
  .pay-time-title {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
  }
  .pay-time-msg {
    color: #ff7d00;
    font-family: 'Microsoft YaHei';
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    margin-left: 14px;
    display: flex;
    align-items: center;
    .pay-time-msg-num {
      font-size: 24px;
    }
  }
  .pay-time-btn {
    position: absolute;
    right: 24px;
    top: 18px;
  }
}

.pay-method {
  margin-top: 18px;
  width: 100%;
  .pay-method-title {
    .pay-method-title-text {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  .pay-method-content {
    width: 100%;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #d8d8d8;
    margin-top: 24px;
    .pay-method-content-item {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .pay-method-content-item-title {
        color: #777777;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }
      .pay-method-content-item-value {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        margin-left: 10px;
      }

      .copy-btn {
        position: absolute;
        right: 16px;
        top: 13px;
      }
    }
    .msg {
      width: 100%;
      padding: 13px 16px;
      border-radius: 10px;
      background: #f1f1f1;
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      background: #f1f1f1;
    }
  }
}
.recharge-content {
  background: #f4feff;
  padding: 18px;
  border-radius: 8px;
  margin-bottom: 14px;
  .title {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .content-item {
    margin-bottom: 20px;
    border: 1px solid #d8d8d8;
    border-bottom: none;
    .content-item-value {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      padding: 13px 11px;
      border-bottom: 1px solid #d8d8d8;
    }
  }
  .period {
    color: #777777;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    margin-top: 16px;
    margin-bottom: 10px;
    .period-time {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
    }
    .period-msg {
      font-size: 12px;
      margin-left: 10px;
    }
  }
  .price {
    color: #777777;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    .icon-span {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 14px;
    }
    .price-time {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 30px;
      font-style: normal;
      font-weight: 600;
    }
  }
}
::v-deep {
  .el-drawer__header {
    padding-bottom: 20px !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #eff2f6;
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      font-family: 'Microsoft YaHei';
      letter-spacing: 1px;
    }
  }
  .el-drawer__body {
    padding: 20px 23px 68px 23px;
  }
  .add-form-dialog {
    .el-form-item__label {
      font-weight: 600;
      color: #000;
      font-family: 'Microsoft YaHei';
      padding-left: 0 !important;
      padding-right: 20px !important;
    }
  }

  .text-left {
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .custom-label {
    .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
