<template>
  <div class="container">
    <div class="header flex items-center" style="margin-bottom:10px;">
      <el-button type="primary" size="mini" @click="handleClickAdd">选择</el-button>
      <div class="flex">
        <span style="color:#333;margin:0 10px;">优惠券样式</span>
        <p>
          <span style="margin-right:20px;">
            <el-radio v-model="couponStyle" label="1" @input="handleInput">居中展示</el-radio>
            <!-- <em>示例</em> -->
          </span>
          <span>
            <el-radio v-model="couponStyle" label="2" @input="handleInput">右下角展示</el-radio>
            <!-- <em>示例</em> -->
          </span>

        </p>
      </div>
    </div>
    <div v-show="couponList.length" class="coupon-list">
      <div v-for="item in couponList" :key="item.couponNo" class="flex items-center justify-between coupon-item">
        <p>
          <span>{{ item.couponName }}</span>
          <span>{{ getDiscountName(item.discountMethod) }}</span>
          <span>{{ item.couponContent }}</span>
        </p>
        <el-button type="danger" @click="handleClickDelete(index)">删除</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import Dialog from '../../Dialog/index.js'
export default {
  data() {
    return {
      couponStyle: '1',
      couponList: []
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('change', val)
    },
    handleClickAdd() {
      Dialog.open({
        type: 'AddCoupon',
        visible: true,
        defaultCheck: this.couponList,
        liveRoomId: '1',
        successFn: (res) => {
          this.couponList = res
          this.$emit('select', this.couponList)
          Dialog.close()
          // this.getList()
        }
      })
    },
    handleClickDelete(index) {
      this.couponList.splice(index, 1)
      this.$emit('select', this.couponList)
    },
    getDiscountName(type) {
      const obj = {
        1: '满减券',
        2: '直减券',
        3: '折扣券'
      }
      return obj[type]
    }
  }
}
</script>
<style lang="scss" scoped>
.coupon-list{
  width:600px;
  border:1px solid #DCDFE5;
  border-radius: 6px;
  .coupon-item{
    border-bottom:1px solid rgba(217, 217, 217, 0.3);
    height:52px;
    padding:0 6px;
    &:last-child{
      border-bottom:none;
    }
    p{
      span{
        margin-right:20px;
      }
    }
  }
}

</style>
