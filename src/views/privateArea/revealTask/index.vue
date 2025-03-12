<template>
  <div class="revealTaskWarp">
    <div class="title">
      <span @click="handleGoBack">全部任务</span> <i class="el-icon-arrow-right" /> <span>兜底任务设置</span>
    </div>
    <div class="tabsList">
      <div
        v-for="item in tabsList"
        :key="item.value"
        :class="{ active: item.value === active }"
        @click="active = item.value"
      >
        {{ item.label }}
      </div>
    </div>
    <interiorTask v-if="active === 0" />
    <externalTask v-else />
  </div>
</template>
<script>
import externalTask from './components/externalTask'
import interiorTask from './components/interiorTask'
export default {
  components: {
    externalTask,
    interiorTask
  },
  data: () => ({
    active: 0,
    tabsList: [
      {
        label: '机构内兜底',
        value: 0
      },
      {
        label: '外部兜底',
        value: 1
      }
    ]
  }),
  methods: {
    handleGoBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.revealTaskWarp {
  width: 100%;
  min-height: calc(100% - 80px);
  background: #ffffff;
  border-radius: 10px;
  > .title {
    border-bottom: 1px solid #e4e7ed;
    padding: 20px;
    font-weight: 400;
    font-size: 16px;
    color: #777777;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    >span:nth-of-type(1){
      cursor: pointer;
    }
    > span {
      color: #333333;
    }
  }
  .warpBox {
    width: 800px;
  }
  .tabsList {
    display: flex;
    width:240px;
    align-items: center;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    text-align: right;
    font-style: normal;
    padding: 2px;
    margin-top: 20px;
    margin-left: 20px;
    > div {
      border-radius: 4px;
      padding: 4px 27px;
      cursor: pointer;
    }
    .active{
      background:#ffffff;
      color:#0C6FFF;
    }
  }
}
</style>
