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
    <router-view class="content" />
  </MCard>
</template>

<script>
import { getRoutesPermsList } from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      activeName: 'channelProvider',
      permsList: []
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init() {
      const child = getRoutesPermsList('systemSms')
      this.permsList = child
      if (this.$route.path === '/system/systemSms') {
        if (this.permsList.length > 0) {
          this.$router.replace({ name: this.permsList[0].name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.pageWrap {
  @include responsive-height(20px);
  min-width: 1400px;
  position: relative;
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
  height: calc(100% - 36px);
}
</style>
