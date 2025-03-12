<template>
  <MCard class="pageWrap">
    <div style="padding: 0 20px">
      <div
        v-for="item in permsList"
        :key="item.key"
        :class="{ 'tabs-item': true, 'tabs-active': $route.name === item.name }"
        @click="$router.push({ name: item.name })"
      >
        <span>{{ item.meta.title }}</span>
      </div>
      <el-divider class="divider-zb" />
    </div>
    <router-view />
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
      const child = getRoutesPermsList('setting')
      this.permsList = child.filter(item => !item.hidden)

      if (this.$route.path === '/privateLive/setting') {
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
  height: auto;
}
.tabs-item {
  width: 120px;
  display: inline-block;
  text-align: center;
  padding: 9px 0;
  border-radius: 5px;
  background: #f7f7f7;
  margin-right: 5px;
  user-select: none;
  cursor: pointer;
  span {
    color: #000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
  }
}
.tabs-active {
  background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
}
::v-deep {
  .el-divider {
    background-color: #d9d9d94d;
    margin: 20px 0;
  }
}
</style>
