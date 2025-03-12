<template>
  <header>
    <div :class="{ 'fixed-header': fixedHeader, 'hok-header': true }">
      <hok-logo />
      <hok-top-menu />
      <hok-notice />
      <hok-navbar />
      <hok-operate v-if="needTagsView" />
    </div>
  </header>
</template>

<script>
import HokNavbar from './cpns/nav/index.vue'
import HokLogo from './cpns/Logo.vue'
import HokOperate from './cpns/operate/index.vue'
import HokNotice from './cpns/notice/index.vue'
import HokTopMenu from './cpns/topMenu/index.vue'
import ResizeMixin from '../../mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Header',
  components: {
    HokNavbar,
    HokLogo,
    HokNotice,
    HokOperate,
    HokTopMenu
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
      console.log(1)
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

header {
  height: $headHeight;
  min-width: 1000px;
  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1001;
    width: 100vw;
    transition: width 0.28s;
    &.hok-header {
      height: $headHeight;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.05);
    }
  }
}
.mobile .fixed-header {
  width: 100%;
}
</style>
