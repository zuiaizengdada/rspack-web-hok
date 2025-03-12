<template>
  <div class="logo-cnt">
    <!-- :class="{ collapse }" -->
    <!-- <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link sidebar-logo2"
        to="/"
      >
        <img :src="logoUrls[1]" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img :src="logoUrls[2]" class="sidebar-logo" />
      </router-link>
    </transition> -->
    <img :src="logo" class="logo" alt="" />
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
export default {
  name: 'HocLogo',
  props: {
    collapse: {
      type: Boolean,
      // required: true,
      default: () => false
    }
  },
  data() {
    return {
      title: '伏羲云系统',
      logo: '',
      logoUrls: []
    }
  },
  mounted() {
    const data = getItem('orgInfo')
    this.logoUrls = data?.mediaDtoList || []
    if (this.logoUrls.length) {
      const cur = this.logoUrls.find(
        item => item.scope === '2' && item.terminal === 1
      )
      this.logo = cur?.url
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-cnt {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 35px;
  .logo {
    /* height: 31px; */
    max-height: 48px;
    max-width: 155px;
  }
}
</style>
