<template>
  <div class="coupon-center-home" v-if="show">
    <div class="change-type">
      <div
        v-for="item in navTabs"
        :key="item.type"
        :class="{ active: type === item.type }"
        v-permission="[item.authority, permsList]"
        @click="changeType(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <component :is="type" />
  </div>
</template>

<script>
import IpTp from './cpns/ip/index.vue'
import VideoTp from './cpns/video/index.vue'
import groupTp from './cpns/group/index.vue'
import { getRoutesPermsList } from '@/utils/index'
export default {
  name: 'CouponCenterHome',
  components: { IpTp, VideoTp, groupTp },
  data() {
    return {
      show: true,
      permsList: this.$route.meta.permsList || [],
      navTabs: [
        {
          name: 'IP敏感词',
          type: 'IpTp',
          authority: 'web:sensitive:IpTp'
        },
        {
          name: '视频敏感词',
          type: 'VideoTp',
          authority: 'web:sensitive:VideoTp'
        },
        {
          name: '分组敏感词',
          type: 'groupTp',
          authority: 'web:sensitive:groupTp'
        }
      ],
      type: 'IpTp'
    }
  },
  created() {
    this.type = this.$route.query.active || 'IpTp'
    this.initRouter()
  },
  provide() {
    return {
      changeType: this.changeType
    }
  },
  methods: {
    initRouter() {
      const permsList =
        getRoutesPermsList('setting').find(item => item.path === 'sensitive')
          ?.meta?.permsList || []
      if (permsList.includes('web:sensitive:IpTp')) {
        this.type = 'IpTp'
        return
      }
      if (permsList.includes('web:sensitive:VideoTp')) {
        this.type = 'VideoTp'
        return
      }
      if (permsList.includes('web:sensitive:groupTp')) {
        this.type = 'groupTp'
        return
      }
      this.show = false
    },
    changeType(val) {
      if (val === this.type) return
      this.type = val
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-center-home {
  width: 100%;
  background: #fff;
  padding: 0 20px;
  border-radius: 5px;
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
