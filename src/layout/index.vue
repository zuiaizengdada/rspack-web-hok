<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <HocHeader />

    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <sidebar class="sidebar-container" />
      <!-- <div :class="{ 'fixed-header': fixedHeader }">
        <Logo />
        <navbar />
        <tags-view v-if="needTagsView" />
      </div> -->
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Settings, Sidebar, HocHeader } from './components'
// Navbar TagsView
// import { Logo } from './components/Sidebar/Logo'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    RightPanel,
    Settings,
    Sidebar,
    // Navbar,
    // TagsView,
    // Logo,
    HocHeader
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        // !this.sidebar.opened
        hideSidebar: false,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    $route(route) {
      const path = route.path
      const domMain = document.querySelector('.main-container')
      if (domMain) {
        domMain.style.minWidth = path.includes('originalVideo')
          ? '1400px'
          : '1000px'
      }
    }
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  // overflow: auto;
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  /* 单独处理图标转向 */
  ::v-deep .el-submenu__title i {
    -webkit-transform: rotateZ(-90deg);
    transform: rotateZ(-90deg);
    margin-top: -4px;
  }
  ::v-deep .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(0deg);
    transform: rotateZ(0deg);
  }
  /* 单独处理选中子集 父级需要title样式 */
  ::v-deep .sidebarItem .submenu.is-active {
    > .el-submenu__title {
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
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1001;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
