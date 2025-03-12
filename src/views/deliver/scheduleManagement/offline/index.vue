<template>
  <!-- 物流设置页面容器 -->
  <div class="financial-instrument">
    <!-- 导航切换区域 -->
    <div class="change-type">
      <div
        v-for="item in configList"
        :key="item.approveStatus"
        :class="{ active: type === item.approveStatus }"
        @click="changeType(item.approveStatus)"
      >
        {{ item.name }}
      </div>
    </div>
    <!-- 路由视图区域 -->
    <router-view></router-view>
  </div>
</template>
    
  <script>
// 引入路由权限列表获取方法
import { getRoutesPermsList } from '@/utils'

export default {
  // 组件名称
  name: 'LogisticsSetting',

  data() {
    return {
      // 当前选中的导航类型
      type: this.$route.name,
      // 导航配置列表
      configList: [
        {
          name: '全部班期',
          approveStatus: 'ScheduleManagementAllSchedule'
        },
        {
          name: '我的班期',
          approveStatus: 'ScheduleManagementMySchedule'
        }
      ]
    }
  },

  // 组件创建时初始化
  created() {
    this.initRouter()
  },

  methods: {
    /**
     * 切换导航类型
     * @param {string} approveStatus - 目标路由名称
     */
    changeType(approveStatus) {
      this.type = approveStatus
      this.$router.replace({ name: approveStatus })
    },

    /**
     * 初始化路由配置
     * 1. 获取路由权限列表
     * 2. 转换为导航配置
     * 3. 处理默认路由跳转
     */
    initRouter() {
      try {
        // 获取路由权限列表
        let routerList = getRoutesPermsList('scheduleOffline')
        if (!routerList?.length) {
          console.warn('未获取到路由列表')
          return
        }
        // routerList = routerList.filter(item => !item?.hidden)
        // 转换路由列表为导航配置
        this.configList = routerList.map(item => ({
          name: item?.meta?.title,
          approveStatus: item?.name
        }))

        // 处理默认路由跳转逻辑
        if (this.$route.name === 'scheduleOffline') {
          const defaultRoute = this.configList[0]?.approveStatus
          if (defaultRoute) {
            this.type = defaultRoute
            console.log(2222222,defaultRoute)
            this.$router.replace({ name: defaultRoute })
          }
        }
      } catch (error) {
        console.error('初始化路由失败:', error)
      }
    }
  }
}
</script>
    
  <style lang="scss" scoped>
// 物流设置页面样式
.financial-instrument {
  width: 100%;
  padding: 20px 20px 0;
  border-radius: 10px;
  background-color: #fff;

  // 导航切换区域样式
  .change-type {
    display: inline-block;
    padding: 3px;
    border-radius: 4px;
    background: #f0f0f0;
    cursor: pointer;
    user-select: none;

    // 导航项样式
    div {
      display: inline-block;
      min-width: 117px;
      text-align: center;
      color: #000;
      font-size: 14px !important;
    }

    // 激活状态样式
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
    