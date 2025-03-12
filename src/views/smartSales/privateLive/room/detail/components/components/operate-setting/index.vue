<template>
  <!-- 运营设置 -->
  <div class="operate-wrapper">
    <div class="change-type">
      <div
        v-for="item in tabs"
        :key="item.type"
        :class="{ active: type === item.type }"
        @click="changeType(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <component :is="type" />
  </div>
</template>

<script>
const components = require.context('./components', true, /\.vue$/)
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
  components: { ...componentList },
  data() {
    return {
      type: 'commerce',
      tabs: [
        {
          name: '直播带货',
          type: 'commerce'
        },
        {
          name: '优惠券设置',
          type: 'couponSetting'
        },
        {
          name: '抽奖设置',
          type: 'prizeDrawSetting'
        },
        {
          name: '签到设置',
          type: 'signinSetting'
        },
        {
          name: '下一场直播预告',
          type: 'nextEstimate'
        },
        {
          name: '敏感词设置',
          type: 'sensitiveSetting'
        }
      ]
    }
  },
  methods: {
    changeType(val) {
      if (val === this.type) return
      this.type = val
    }
  }
}
</script>

<style lang="scss" scoped>
.operate-wrapper {
  position: relative;

  .change-type {
    width: 710px;
    border-radius: 4px;
    background: #f0f0f0;
    padding: 3px;
    cursor: pointer;
    user-select: none;
    div {
      display: inline-block;
      min-width: 117px;
      text-align: center;
      color: #000;
      font-size: 14px !important;
    }
    .active {
      padding-top: 2px;
      height: 26px;
      border-radius: 4px;
      color: #0c6fff;
      background: #fff;
    }
  }
}
</style>
