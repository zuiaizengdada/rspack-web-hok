<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- scrollTop -->
    <SiderAvatar />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menuRef"
        :class="['hok-menu']"
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <el-menu-item index="/home" class="submenu-home" @click="changeHome">
          <svg-icon class="svg-icon" icon-class="sy" size="24" />首页
        </el-menu-item>
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>

    <!-- <div class="sidebar-footer">
      <span v-show="sidebar.opened" class="version">v{{ version }}</span>
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// import Hamburger from '@/components/Hamburger'
import SiderAvatar from './avatar.vue'

import variables from '@/styles/variables.scss'
export default {
  components: { SidebarItem, SiderAvatar },
  data() {
    return {
      version: localStorage.getItem('vueVersion') || '',
      showShadow: false,
      scrollTop: 0
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar', 'sidebarRouters']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    const menuElement = this.$refs.menuRef.$el.closest('.el-scrollbar__wrap')
    menuElement.addEventListener('scroll', this.throttledHandleScroll)
  },
  beforeDestroy() {
    const menuElement = this.$refs.menuRef.$el.closest('.el-scrollbar__wrap')
    menuElement.removeEventListener('scroll', this.throttledHandleScroll)
  },
  methods: {
    throttledHandleScroll(event) {
      clearTimeout(this.scrollThrottleTimeout)
      this.scrollThrottleTimeout = setTimeout(() => {
        this.scrollTop = event.target.scrollTop
        const menuElement = this.$refs.menuRef.$el.closest('.el-scrollbar')
        if (!menuElement) return
        if (event.target.scrollTop === 0) {
          menuElement.classList.remove('shadow-menu')
        } else {
          menuElement.classList.add('shadow-menu')
        }
      }, 10)
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changeHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
.version {
  color: #000;
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  padding-left: 20px;
  flex: 1;
}
.submenu-home {
  padding-left: 16px !important;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  &.is-active {
    margin: 0;
    position: relative;
    background: rgba(255, 255, 255, 0.1) !important;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 29px;
      width: 2px;
      background: linear-gradient(0deg, #0c6fff 0%, #1cf6ff 100%);
    }
  }
  svg {
    margin-top: -2px;
  }
}
.shadow-menu {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 11px;
    background: linear-gradient(180deg, #0000002e 0%, #00000000 100%);
    z-index: 1; /* 确保伪元素位于 div 内容的下方 */
    border-radius: inherit; /* 如果 div 有圆角，伪元素也应该有 */
  }
}
</style>
