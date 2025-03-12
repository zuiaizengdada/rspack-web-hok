<template>
  <div class="wrapper">
    <div class="info-row">
      <div class="header-item">
        <span class="pointer" @click="goLiveList"> 直播列表 </span>
        <span class="guide">></span>
        <span class="title">直播详情</span>
      </div>
      <headInfo ref="headInfo" />
    </div>

    <!-- 模块信息 -->
    <div class="module-row">
      <tabs
        @change="
          item => {
            componentKey = item.key
          }
        "
      />
      <el-divider class="divider-zb" />
      <component
        :is="componentKey"
        v-if="componentKey"
        @enrollSettingcoverImgUrl="enrollSettingcoverImgUrl"
      />
    </div>
  </div>
</template>

<script>
import headInfo from './components/headInfo/index.vue'
import tabs from './components/tabs/index.vue'
const components = require.context('./components/components', true, /\.vue$/)
const componentList = {}
// 注册目前下为index的组件
components.keys().map(fileName => {
  // 判断是否为第一层目录下并且后缀为index.vue
  if (fileName.split('/').length === 3 && fileName.endsWith('index.vue')) {
    const componentConfig = components(fileName)
    const componentName = fileName.replace('./', '').replace('/index.vue', '') // 获取组件名
    componentList[componentName] = componentConfig.default || componentConfig
  }
})
export default {
  components: {
    headInfo,
    tabs,
    ...componentList
  },
  data() {
    return { componentKey: '' }
  },
  methods: {
    enrollSettingcoverImgUrl() {
      this.$refs.headInfo.getDetail()
    },
    goLiveList() {
      this.$router.replace({
        path: this.$route?.query?.backPath || '/privateLive/liveNewRoom/newRoom'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.module-row {
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 22px;
}
.wrapper {
  width: 100%;
  .info-row {
    width: 100%;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 18px 0;
    .header-item {
      padding: 0 20px 18px 20px;
      font-size: 14px;
      border-bottom: 1px solid #eff2f6;
      .pointer {
        color: #777;
      }
      .guide {
        color: #777;
        padding: 0 10px;
      }
      .title {
        color: #333;
      }
    }
  }
}
::v-deep {
  .el-divider {
    background-color: #d9d9d94d;
    margin: 20px 0;
  }
}
</style>
