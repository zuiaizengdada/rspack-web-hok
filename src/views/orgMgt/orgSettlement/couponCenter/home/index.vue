<template>
  <div class="coupon-center-home hoc-main-height">
    <HokTabs :active.sync="active" :nav-tabs="navTabs" />
    <template v-if="active === 'add'"> <couponAdd /> </template>
    <template v-if="active === 'mgt'"> <couponMgt /> </template>
    <template v-if="active === 'audit'"> <couponAudit /> </template>
  </div>
</template>

<script>
import HokTabs from '@/components/baseCpns/tabs/index.vue'
import couponAdd from './cpns/add/index.vue'
import couponMgt from './cpns/mgt/index.vue'
import couponAudit from './cpns/audit/index.vue'
export default {
  name: 'CouponCenterHome',
  components: { HokTabs, couponAdd, couponMgt, couponAudit },
  data() {
    return {
      navTabs: [
        { label: '新建优惠券', value: 'add' },
        { label: '管理优惠券', value: 'mgt' },
        { label: '优惠券审核', value: 'audit' }
      ],
      active: 'add'
    }
  },
  created() {
    this.active = this.$route.query.active || 'add'
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.coupon-center-home {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
}
</style>
