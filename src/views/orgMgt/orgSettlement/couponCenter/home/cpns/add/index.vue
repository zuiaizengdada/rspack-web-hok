<template>
  <div class="coupon-center-add">
    <div class="operation flex align-center">
      <template v-for="(item, index) in addCouponOperation">
        <div :key="index" class="operation-item" @click="handleCreate">
          <div class="title">{{ item.title }}</div>
          <div class="desc">{{ item.desc }}</div>
          <div class="btn-group flex flex-right">
            <span class="btn"> 立即新建 </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCouponOperation: [
        {
          title: '机构费用优惠券',
          desc: '对单个机构发放的费用直减券'
        }
      ]
    }
  },
  methods: {
    handleCreate() {
      this.$router.push({
        name: 'CouponCenterAdd',
        query: {
          prevPath: this.$route.path,
          couponType: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-center-add {
  padding: 20px;
  box-sizing: border-box;
  .operation {
    .operation-item {
      width: 262px;
      height: 120px;
      padding: 15px 18px;
      box-sizing: border-box;
      border-radius: 8px;
      border: 1px solid #fff;
      background: #fff;
      box-shadow: 0 3px 11px 0 rgba(49, 66, 82, 0.2);
      cursor: pointer;
      &:hover {
        border: 1px solid #0c6fff;
        background: #f4fbff;
      }
      .title {
        color: #333333;
        font-family: 'PingFang SC';
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        margin-bottom: 4px;
      }
      .desc {
        color: #333333;
        font-size: 14px;
        font-style: normal;
        font-weight: 300;
        line-height: normal;
        margin-bottom: 12px;
      }
      .btn {
        display: inline-block;
        height: 24px;
        line-height: 22px;
        width: 80px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #0c6fff;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        color: #0C6FFF;
      }
    }
  }
}
</style>
