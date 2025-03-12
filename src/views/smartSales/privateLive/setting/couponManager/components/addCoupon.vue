<template>
  <div class="add-coupon">
    <div
      v-show="visibleCouponShop"
      class="coupon-type-row"
      @click="linkToAddCoupon(1)"
    >
      <span>
        <p>商品优惠券</p>
        <em>对单个商品进行优惠的券种</em>
      </span>
      <p class="btn-cls">立即创建</p>
    </div>
    <div class="coupon-type-row" @click="linkToAddCoupon(3)">
      <span>
        <p>直播专享优惠券</p>
        <em class="zhibo-em">仅限直播间领取的券种</em>
      </span>
      <p class="btn-cls">立即创建</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddCoupon',
  components: {},
  data() {
    return {
      visibleCouponShop: true
    }
  },
  watch: {},
  created() {},
  mounted() {
    const path = this.$route.path
    if (
      path.includes('live/liveSetting/couponManager') ||
      path.includes('privateLive/setting/couponMg')
    ) {
      this.visibleCouponShop = false
    }
  },
  activated() {},
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    linkToAddCoupon(type) {
      // this.$router.push({
      //   name: 'AddCouponIndex',
      //   query: { type: type, prevPath: this.$route.path }
      // })
      console.log(this.$router)
      this.$router.push({ path: `/privateLive/setting/addCoupon?type=${type}&prevPath=${this.$route.path}`})
    }
  }
}
</script>

<style lang="scss" scoped>
.add-coupon {
  width: 100%;
  height: 100%;
  display: inline-block;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: #fff;
  margin-top: 20px;
}
.coupon-type-row {
  float: left;
  margin-right: 25px;
  padding: 24px 10px;
  border-radius: 14px;
  width: 323px;
  height: 166px;
  cursor: pointer;
  /* border: 1px solid #fff; */
  /* box-shadow: 0px 0px 5px 2px rgba(220,220,220,0.4); */
  background: url('https://dev.oss.hokkj.cn/hok_admin/img/0c763ceecd864c7599ff7491c333a125.png')
    no-repeat;
  background-size: 100% 100%;
  img {
    width: 68px;
    height: 68px;
    float: left;
  }
  span {
    float: left;
    width: 260px;
    margin-left: 10px;
    p {
      color: #000;
      font-size: 20px;
      font-family: 'Microsoft YaHei';
      font-weight: 600;
      line-height: 28px;
    }
    em {
      margin-top: 10px;
      display: inline-block;
      color: #777777;
      font-size: 14px;
      font-style: normal;
      font-family: 'Microsoft YaHei';
      line-height: 20px;
      border-radius: 10px;
      // 文本换行
      word-break: break-all;
      word-wrap: break-word;
    }
  }
  .btn-cls {
    float: right;
    color: #0c6fff;
    padding: 9px 16px;
    background: #065cff;
    border-radius: 10px;
    margin-right: 20px;
    margin-top: 15px;
    font-size: 12px;
    color: #fff;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
  }
}
.coupon-type-row:hover {
  box-shadow: 0px 0px 5px 2px rgba(220, 220, 220, 0.4);
  /* border: 1px solid #00A3FF; */
  /* background: #F4FBFF; */
}
.goods-type {
  background: linear-gradient(45deg, #ffcfd9 0%, #fff1f4 100%);
}
.zhibo-type {
  background: linear-gradient(46deg, #fdf5d1 0%, #fff3e7 100%);
}
</style>

