<template>
  <div>
    作业列表
    <el-button>添加作业</el-button>
    <el-table :data="list" border class="m-t-10">
      <el-table-column prop="img" label="学员" />
      <el-table-column prop="name" label="作业名称" />
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
