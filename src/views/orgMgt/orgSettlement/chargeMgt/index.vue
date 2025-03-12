<template>
  <div class="coupon-center-home hoc-main-height">
    <HokTabs :active.sync="active" :nav-tabs="navTabs" />
    <template v-if="active === 'home'">
      <ChargeMgtHome />
    </template>
  </div>
</template>

<script>
import HokTabs from '@/components/baseCpns/tabs/index.vue'
import ChargeMgtHome from './cpns/home/index.vue'
export default {
  name: 'CouponCenterHome',
  components: { HokTabs, ChargeMgtHome },
  data() {
    return {
      navTabs: [{ label: '收费项管理', value: 'home' }],
      active: 'home'
    }
  },
  created() {
    this.active = this.$route.query.active || 'home'
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
