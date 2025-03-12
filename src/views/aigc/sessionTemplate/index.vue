<template>
  <div class="wrapper">
    <el-tabs v-model="activeName" class="" @tab-click="handleClick">
      <el-tab-pane label="AI助手" name="first">
        <frist v-if="activeName == 'first'" />
      </el-tab-pane>
      <el-tab-pane label="场景助手" name="second">
        <second v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import frist from './first/index.vue'
import second from './second/index.vue'
export default {
  components: {
    frist,
    second
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  background-color: #fff;
  padding: 20px;
}
</style>
