<template>
  <div
    v-if="pageShow"
    class="financial-instrument"
    :style="{
      'padding-top':
        $route.path === '/privateLive/setting/couponMg' ? '0' : '20px'
    }"
  >
    <div class="change-type">
      <div
        v-for="item in configList"
        :key="item.approveStatus"
        v-permission="[item.authority, permsList]"
        :class="{ active: type === item.approveStatus }"
        @click="changeType(item.approveStatus)"
      >
        {{ item.name }}
      </div>
    </div>
    <component :is="type" />
  </div>
</template>

<script>
import addCoupon from '../components/addCoupon'
import couponManager from '../components/couponManager'
import couponExamine from '../components/couponExamine'
import { getRoutesPermsList } from '@/utils/index'

export default {
  name: 'CouponManager',
  components: {
    addCoupon,
    couponManager,
    couponExamine
  },
  data() {
    return {
      pageShow: true,
      permsList: this.$route.meta.permsList || [],
      configList: [
        {
          name: '新建优惠券',
          nums: 0,
          authority: 'web:couponManager:addCoupon',
          approveStatus: 'addCoupon'
        },
        {
          name: '优惠券管理',
          nums: 0,
          authority: 'web:couponManager:couponManager',
          approveStatus: 'couponManager'
        },
        {
          name: '优惠券审核',
          nums: 0,
          authority: 'web:couponManager:couponExamine',
          approveStatus: 'couponExamine'
        }
      ],
      permsList: this.$route.meta.permsList || [],
      type: 'addCoupon'
    }
  },
  async created() {
    this.initRouter()
    await this.$store.dispatch('user/viewingFlag', 'marketingToolsCoupon')
    // this.configList = this.configList.filter(item => {
    //   return this.permsList.includes(item.authority)
    // })
  },
  mounted() {
    if (this.$route.query.fromTab) {
      this.type = this.$route.query.fromTab
      return
    }
  },
  methods: {
    initRouter() {
      const permsList =
        getRoutesPermsList('setting').find(item => item.path === 'couponMg')
          ?.meta?.permsList || []

      if (permsList.includes('web:couponManager:addCoupon')) {
        this.type = 'addCoupon'
        return
      }
      if (permsList.includes('web:couponManager:couponManager')) {
        this.type = 'couponManager'
        return
      }
      if (permsList.includes('web:couponManager:couponExamine')) {
        this.type = 'couponExamine'
        return
      }
      this.pageShow = false
    },
    changeType(val) {
      if (val === this.type) return
      this.type = val
    }
  }
}
</script>
<style lang="scss" scoped>
.financial-instrument {
  width: 100%;
  padding: 20px 20px 0 20px;
  // margin-top: 20px;
  border-radius: 10px;
  background-color: #fff;
  .change-type {
    display: inline-block;
    padding: 0 4px;
    border-radius: 4px;
    background: #f0f0f0;
    padding: 3px;
    cursor: pointer;
    user-select: none;
    div {
      display: inline-block;
      min-width: 117px;
      text-align: center;
      color: #000;
      font-size: 14px !important;
    }
    .active {
      padding-top: 2px;
      height: 26px;
      border-radius: 4px;
      color: #0c6fff;
      background: #fff;
    }
  }
}
</style>

