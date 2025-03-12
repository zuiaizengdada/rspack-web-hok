<template>
  <MCard class="pageWrap">
    <div class="navHeader">
      <div
        v-for="(item, index) in permsList"
        :key="index"
        class="navItem"
        :class="{ active: $route.name === item.name }"
        @click="$router.push({ name: item.name })"
      >
        {{ item.meta.title }}
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </MCard>
</template>

<script>
import { getRoutesPermsList } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      permsList: []
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    }
  },
  watch: {
    currentPath(routerPath) {
      if (routerPath === '/privateArea/toolbox') {
        // 判断是否是走如到销售设置
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const child = getRoutesPermsList('toolbox')
      this.permsList = child?.filter(item => !item.hidden) || []
      if (this.$route.path === '/privateArea/toolbox') {
        if (this.permsList.length > 0) {
          this.$router.replace({ name: this.permsList[0].name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  min-width: 1300px;
  position: relative;
  height: auto;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-left: 20px;
  .navItem {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
    border-bottom: 2px solid #fff;
    padding-bottom: 9px;
    margin-right: 20px;
    cursor: pointer;
  }
  .active {
    color: #0c6fff;
    border-color: #0c6fff;
  }
}
.content {
  height: calc(100% - 290px);
}
</style>
