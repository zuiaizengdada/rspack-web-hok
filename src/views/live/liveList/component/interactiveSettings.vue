<template>
  <div>
    <div class="tabList m-b-20">
      <div
        v-for="(item) in tabList"
        :key="item.name"
        class="tabItem"
        :class="{active: item.name === activeName}"
        @click="activeName = item.name"
      >
        {{ item.title }}
      </div>
    </div>
    <components :is="activeName || 'signInSettings'" />
  </div>
</template>

<script>
import signInSettings from './signInSettings.vue'
import lotterySettings from './lotterySettings.vue'
import couponSettings from './couponSettings.vue'
export default {
  components: {
    signInSettings,
    lotterySettings,
    couponSettings
  },
  data() {
    return {
      activeName: 'signInSettings',
      tabList: [
        { title: '签到设置', name: 'signInSettings' },
        { title: '优惠券设置', name: 'couponSettings' },
        { title: '抽奖设置', name: 'lotterySettings' }
      ]
    }
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.tabList {
    display: flex;
    border-radius: 4px;
    border: 1px solid #DDE1E6;
    width: max-content;
    .tabItem {
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        background: #fff;
        cursor: pointer;
    }
    .tabItem + .tabItem {
        border-left: 1px solid #DDE1E6;
    }
    .active {
        color: #333333;
        background: #EBEBEB;
    }
}
</style>
