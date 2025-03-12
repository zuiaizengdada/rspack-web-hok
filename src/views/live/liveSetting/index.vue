<template>
  <MCard class="pageWrap">
    <div class="navHeader">
      <div v-for="(item, index) in permsList" :key="index" class="navItem" :class="{active: $route.name === item.name}" @click="$router.push({name: item.name})">
        {{ item.meta.title }}
      </div>
    </div>
    <router-view class="pageWrap_content" />
  </MCard>
</template>

<script>
import { getRoutesPermsList } from '@/utils/index'
export default {
  data() {
    return {
      permsList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const child = getRoutesPermsList('liveSetting')
      this.permsList = child

      console.log(this.permsList, 'permsList')
      if (this.$route.path === '/live/liveSetting') {
        if (this.permsList.length > 0) {
          this.$router.replace({ name: this.permsList[0].name })
        }
      }
    }
  }

}
</script>
<style lang='scss' scoped>
.pageWrap {
  min-width: 1000px;
  position: relative;
  height: calc(100vh - 163px);
}
.navHeader {
  display: flex;
  border-bottom:1px solid #EFF2F6;
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
    color: #0C6FFF;
    border-color: #0C6FFF;
  }
}
.pageWrap_content {
  height: calc(100vh - 224px) !important;
  // height: calc(100% - 36px);
}
</style>
