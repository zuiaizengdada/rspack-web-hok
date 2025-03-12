<template>
  <div class="allocation-manage-wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane label="通用配置" name="first">
        <generalityConfig />
      </el-tab-pane>
      <el-tab-pane label="独立配置" name="second">
        <individuationConfig />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import generalityConfig from './components/generalityConfig'
import individuationConfig from './components/individuationConfig'
export default {
  components: {
    generalityConfig,
    individuationConfig
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.allocation-manage-wrapper {
  position: relative;
  background-color: #fff;
  padding: 20px;
}
</style>
