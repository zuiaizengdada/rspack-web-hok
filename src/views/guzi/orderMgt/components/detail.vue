<template>
  <div v-loading="loading" class="detail-page">
    <div class="status" :class="{status1:info.status ===1}"><span class="line" />{{ info.status ===1 ? '未支付':'已支付' }}</div>
    <div class="title"><span />基本信息</div>
    <div class="border">
      <el-row>
        <el-col class="text-l" :span="3">订单号：</el-col>
        <el-col class="text-r" :span="8">{{ info.orderNo }}</el-col>
        <el-col class="text-l" :span="3">创建时间：</el-col>
        <el-col class="text-r" :span="8">{{ info.createTime }}</el-col>
      </el-row>
      <el-row>
        <el-col class="text-l" :span="3">商品名称：</el-col>
        <el-col class="text-r" :span="8">{{ info.productName }}</el-col>
        <el-col class="text-l" :span="3">邀约用户：</el-col>
        <el-col
          v-if="info.shareUser"
          class="text-r"
          :span="8"
        >{{ info.shareUser.userName }}</el-col>
      </el-row>
    </div>
    <div class="title"><span />买家信息</div>
    <el-row>
      <el-col class="text-l" :span="3">用户昵称：</el-col>
      <el-col class="text-r" :span="8">{{ info.userName }}</el-col>
      <el-col class="text-l" :span="3">手机号：</el-col> <el-col
        class="text-r"
        :span="8"
      ><Phone
        :default-value="info.user.userPhone"
      /></el-col>
    </el-row>
    <div class="title"><span />支付信息</div>
    <el-row>
      <el-col class="text-l" :span="3">支付金额：</el-col>
      <el-col class="text-r" :span="8">￥{{ getPricePair(info.payerTotal) }}</el-col>
      <el-col class="text-l" :span="3">支付时间：</el-col>
      <el-col class="text-r" :span="8">{{ info.payTime }}</el-col>
    </el-row>
    <el-row>
      <el-col class="text-l" :span="3">支付方式：</el-col>
      <el-col class="text-r" :span="8">{{ info.paymentType ===1 ?'微信' :'支付宝' }}</el-col>
      <el-col class="text-l" :span="3">支付单号：</el-col>
      <el-col class="text-r" :span="8">{{ info.paymentNo }}</el-col>
    </el-row>
  </div>
</template>
<script>
import { guziOrderDetail
} from '@/api/guzi/order.js'
import Phone from '@/components/watchPhoneNumber/index.vue'
export default {
  components: {
    Phone
  },
  props: {
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {},
      loading: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getPricePair(price) {
      if (price === null || price === undefined) {
        return ''
      }
      const pricePair = (+price / 100).toFixed(2).split('.')
      const decimal = `.${pricePair[1]}`
      return pricePair[0] + decimal
    },
    async getDetail() {
      this.loading = true
      const { data } = await guziOrderDetail({ orderNo: this.orderNo }).finally(() => {
        this.loading = false
      })
      this.info = data
    }
  }
}
</script>
  <style lang="scss" scoped>
.detail-page {
  width: 100%;
  padding: 18px;
}
.status {
  height: 44px;
  border-radius: 6px;
  background: #34c7590d;
  color: #34C759;
  font-size: 16px;
  font-weight: bold;
  line-height: 44px;
  .line {
    display: inline-block;
    width: 8px;
    height:8px;
    background: #34C759;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
  &.status1{
  color: #ff2e00;
  background: #ff2e000d;
  .line{

    background: #ff2e00;
  }
  }
}
.border {
  border-radius: 6px;
  border: 1px solid #f1f1f1;
}
.title {
  line-height: 28px;
  position: relative;
  font-weight: 600;
  font-size: 16px;
  color: #000;
  margin: 10px 0;
  font-weight: bold;
  span {
    display: inline-block;
    width: 2px;
    height: 16px;
    background: #065cff;
    margin-right: 9px;
    vertical-align: middle;
  }
}

.el-row {
  > div {
    padding: 5px 0;
  }
}

.text-l {
  font-size: 14px;
  color: #666666;
  line-height: 28px;
  text-align: right;
}

.text-r {
  font-size: 14px;
  color: #000;
  line-height: 28px;
  font-weight: bold;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: left;
}
</style>
