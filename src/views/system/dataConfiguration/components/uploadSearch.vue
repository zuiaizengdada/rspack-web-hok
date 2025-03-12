<template>
  <div class="update-config-cls">
    <div class="coupon-data-row">
      <div class="data-row-btn">
        <span :class="couponType === 0?'active':''" @click="changeType(0)">刷单订单</span>
        <span :class="couponType === 1?'active':''" @click="changeType(1)">投放花费</span>
        <span :class="couponType === 2?'active':''" @click="changeType(2)">线下退款</span>
      </div>
    </div>
    <el-form :inline="true" :model="updateConfigForm" class="demo-form-inline update-form-cls">
      <el-form-item v-if="couponType === 1" label="投放账号">
        <el-input v-model="updateConfigForm.account" maxlength="50" clearable placeholder="请输入投放账号" @change="search" />
      </el-form-item>
      <el-form-item v-else label="订单号">
        <el-input v-model="updateConfigForm.orderNo" maxlength="50" clearable placeholder="请输入第三方订单号" @change="search" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button type="primary" size="small" @click="uploadForData">上传</el-button>
      </el-form-item>
    </el-form>
    <uploadForData ref="uploadForDataDialog" :coupon-type="couponType" />
  </div>
</template>

<script>
import uploadForData from '@/views/system/dataConfiguration/components/uploadForData'
export default {
  name: 'UploadSearch',
  components: {
    uploadForData
  },
  data() {
    return {
      couponType: 0,
      updateConfigForm: {
        orderNo: '',
        account: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    changeType(type) {
      this.couponType = type
      this.updateConfigForm.orderNo = ''
      this.$emit('changeOrdersType', type)
      this.$emit('searchFor', this.updateConfigForm)
    },
    uploadForData() {
      this.$refs.uploadForDataDialog.visible = true
    },
    search() {
      this.$emit('searchFor', this.updateConfigForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.update-config-cls {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
}
.update-form-cls {
    margin-top: 10px;
}
.coupon-data-row {
    width: 100%;
    height: 40px;
    .data-row-btn {
        float: left;
        padding: 3px;
        height: 36px;
        background: #F3F3F3;
        border-radius: 4px;
        span {
            width: 90px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            color: #333;
            display: inline-block;
            cursor: pointer;
            font-size: 14px;
        }
        span.active {
            background: #fff;
            color: #0C6FFF;
        }
    }
    .data-row-tool {
        float: right;
    }
}
</style>

