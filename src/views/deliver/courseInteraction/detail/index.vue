<template>
  <div class="app-container-warp">
    <div class="app-container-title">
      <span @click="handleBack">打卡</span>
      <i class="el-icon-arrow-left" />
      <div>打卡详情</div>
    </div>
    <div class="app-container-content">
      <div class="app-container-title">
        <div>{{ detailData.title }}</div>
        <div>
          <span
            style="margin-right: 15px"
          >{{ detailData.isPublish === 0 ? '未发布' : '已发布' }}
          </span>
          参与条件：任何人均可参与
        </div>
      </div>
      <div class="app-container-btn-list">
        <div
          v-for="item in tapList"
          :key="item.value"
          v-permission="[item.permission, permsList]"
          :class="{ isActive: item.value === active }"
          @click="active = item.value"
        >
          {{ item.label }}
        </div>
      </div>
      <task
        v-if="active === 1 && handlePermission(tapList[0].permission)"
        :detail-data="detailData" 
      />
      <taskManage
        v-if="active === 2 && handlePermission(tapList[1].permission)"
      />
    </div>
  </div>
</template>
<script>
import task from './task'
import taskManage from './taskManage'
import { getPunchDetail } from '@/api/deliver/punch'
const tapList = [
  { label: '打卡日记', value: 1, permission: 'homework-task-date' },
  { label: '任务管理', value: 2, permission: 'homework-task-tab' }
  // { label: '激励设置', value: 3 }
]
export default {
  components: { task, taskManage },
  data: () => ({
    tapList,
    active: 1,
    detailData: {}
  }),
  computed: {
    permsList() {
      return this.$route.meta.permsList || []
    }
  },
  created() {
    if (this.handlePermission(tapList[0].permission)) {
      this.active = 1
    } else if (this.handlePermission(tapList[1].permission)) {
      this.active = 2
    }
    this.getInit()
  },
  methods: {
    handlePermission(permission) {
      return this.permsList.includes(permission)
    },
    async getInit() {
      if (!this.$route.query?.id) return
      const { code, data } = await getPunchDetail(this.$route.query?.id)
      if (code === 1) this.detailData = data
    },
    handleBack() {
      this.$router.push({
        path: '/deliver/courseInteraction',
        query: { type: 'clockIn' }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container-warp {
  width: 100%;
  // height:  calc(100vh - 180px);
  min-height: calc(100vh - 180px);
  flex-shrink: 0;
  border-radius: 10px;
  // border: 1px solid #f2f2f2;
  background: #fff;
  overflow: hidden;
  > .app-container-content {
    padding: 20px;
    background: #fff;
    > .app-container-btn-list {
      display: inline-block;
      border-radius: 4px;
      background: #f0f0f0;
      font-size: 14px;
      padding: 3px;
      align-items: center;
      margin-top: 20px;

      > div {
        border-radius: 4px;
        padding: 6px 10px;
        display: inline-block;
        cursor: pointer;
      }
      .isActive {
        color: #0c6fff !important;
        background: #ffffff !important;
      }
    }
    > .app-container-title {
      padding: 20px 22px;
      border-radius: 5px;
      border: 1px solid #c7e3df;
      background: linear-gradient(90deg, #ebfffb 0%, #fff6fd 100%);
      > div:nth-of-type(1) {
        color: #000000;
        font-size: 20px;
        font-weight: 600;
      }
      > div:nth-of-type(2) {
        color: #333333;
        font-size: 14px;
        margin-top: 6px;
      }
    }
  }
  > .app-container-title {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    color: #000000;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    padding: 20px 0;
    padding-top: 10px;
    padding-left: 20px;
    > span:nth-of-type(1) {
      color: #777777;
      margin-right: 5px;
      cursor: pointer;
    }
    > span:nth-of-type(2) {
      margin-left: 5px;
    }
  }
}
</style>
