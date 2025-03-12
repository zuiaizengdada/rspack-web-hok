<template>
  <div class="wrapper">
    <div
      v-for="(item,index) in list"
      :key="index"
      :class="{ 'tabs-item': true, 'tabs-active': activeIndex=== index}"
      @click="handleClick(index)"
    >
      <span>{{ item.title }}</span>
    </div>
    <el-divider class="divider-zb" />
    <component :is="list[activeIndex].name" />
  </div>
</template>
<script>
import costOverview from './components/costOverview/index.vue'
import setting from './components/setting/index.vue'
export default {
  name: 'SetMealModule',
  components: {
    costOverview,
    setting
  },
  data() {
    return {
      list: [
        {
          name: 'costOverview',
          title: '费用概览'
        },
        {
          name: 'setting',
          title: '套餐设置'
        }
      ],
      activeIndex: 0
    }
  },
  methods: {
    handleClick(index) {
      this.activeIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  position: relative;
  padding: 20px;
  // height: calc(100vh - 160px);
  background-color: #fff;
}
.tabs-item {
  width: 120px;
  display: inline-block;
  text-align: center;
  padding: 9px 0;
  border-radius: 5px;
  background: #f7f7f7;
  margin-right: 10px;
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
