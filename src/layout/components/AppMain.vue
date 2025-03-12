<template>
  <section class="app-main" :style="{ marginLeft: false ? '94px' : '200px' }">
    <!-- !sidebar.opened -->
    <hoc-history-nav />
    <!-- <HappyScroll :key="key" resize size="6" hide-horizontal class="min_w-1200"> -->
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <!-- <router-view :key="key" /> -->
    <!-- <keep-alive :include="cachedViews">z
      <router-view :key="key" />
    </keep-alive> -->
    <router-view v-if="noCache" :key="key" />
    <keep-alive max="15">
      <router-view v-if="!noCache" :key="key" />
    </keep-alive>
    <!-- </transition> -->
    <!-- </HappyScroll> -->
    <BackToTop />
  </section>
</template>

<script>
import BackToTop from '@/components/BackToTop'
import HocHistoryNav from './history/index.vue'
// import { HappyScroll } from 'vue-happy-scroll'
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  components: { BackToTop, HocHistoryNav },
  computed: {
    ...mapGetters(['cachedViews', 'sidebar']),
    // cachedViews() {
    //   console.log(this.$store.state.tagsView.cachedViews, 'this.$store.state.tagsView.cachedViews')
    //   return this.$store.state.tagsView.cachedViews
    // },
    key() {
      return this.$route.path
    },
    noCache() {
      return this.$route.meta.noCache
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.app-main {
  min-height: calc(100vh - #{$headHeight} - #{$historyHeight});
  background: #f6faff;
  padding: 0 20px 20px 0;
  width: 100%;
  min-width: 1400px;
  position: relative;
  overflow: hidden;
  transition: padding 0.3s;
  background: #f6faff;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    min-height: calc(100vh - 90px);
    overflow-y: auto;
  }

  .fixed-header + .app-main {
    padding-top: 20px;
    margin-top: 50px;
    overflow: auto;
  }
}
.min_w-1200 {
  min-width: 1200px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
