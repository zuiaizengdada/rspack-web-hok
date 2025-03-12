<template>
  <div class="p4">
    <liveLoading :visible="loading" />
    <p4header :tab-list="tabList" :active="active" @onChange="onTabChange" />
    <!-- 数据概览 -->
    <overviewData v-if="active === 'overviewData'" />
    <!-- 团队数据 -->
    <teamData v-if="active === 'teamData'" @onBack="onTabChange('overviewData')" />
    <!-- 个人数据 -->
    <personData v-if="active === 'personData'" @onBack="onTabChange('overviewData')" />
  </div>
</template>

<script>
import liveLoading from '../components/loading/index.vue'
import p4header from './p4header.vue'
import teamData from './teamData.vue'
import personData from './personData.vue'
import overviewData from './overviewData.vue'
import { queryUserDeptChain } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    liveLoading,
    overviewData,
    p4header,
    teamData,
    personData
  },
  inject: ['isHead'],
  data() {
    return {
      tabList: [
        { key: 'overviewData', label: '概览' },
        { key: 'teamData', label: '团队' },
        { key: 'personData', label: '个人' }
      ],
      loading: false,
      active: 'overviewData'
    }
  },
  mounted() {
    this.getDeptId()
  },
  methods: {
    onTabChange(res) {
      this.active = res
    },
    // 获取当前登录人部门链
    getDeptId() {
      this.loading = true
      queryUserDeptChain().then(res => {
        console.log(res, '获取当前登录人部门链res')
        const depts = res.data.split('-').filter(v => v && v !== '0').map(v => { return Number(v) })
        this.$store.commit('im/SET_imUserInfo', { data: depts, key: 'deptId' })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.p4 {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  // border-bottom: 1px solid #DCDEE1;
  height: 100%;
  position: relative;
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
