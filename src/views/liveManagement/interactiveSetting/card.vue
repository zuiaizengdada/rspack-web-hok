<template>
  <div>
    <el-button>添加卡片</el-button>
    <el-table :data="list" border style="width: 601px" class="m-t-10">
      <el-table-column prop="img" label="图片" width="180" />
      <el-table-column prop="name" label="卡片名称" width="240" show-overflow-tooltip />
      <el-table-column prop="type" label="卡片类型" width="180" />
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
