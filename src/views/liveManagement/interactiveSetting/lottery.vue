<template>
  <div>
    <el-button>添加抽奖</el-button>
    <el-table :data="list" border class="m-t-10">
      <el-table-column prop="img" label="抽奖名称" width="180" />
      <el-table-column prop="name" label="参与方式" width="180" />
      <el-table-column prop="type" label="创建时间" width="180" />
      <el-table-column prop="type" label="状态" width="180" />
      <el-table-column prop="type" label="奖品数量" width="100" />
      <el-table-column prop="type" label="操作" />
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      list: []
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
