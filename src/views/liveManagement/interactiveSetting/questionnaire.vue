<template>
  <div>
    <el-button @click="addQuestionnaire">添加问卷</el-button>
    <el-table :data="list" border class="m-t-10">
      <el-table-column prop="img" label="问卷名称" />
      <el-table-column prop="name" label="参与人员" />
      <el-table-column prop="type" label="状态" />
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
  methods: {
    addQuestionnaire() {
      this.$router.push({ name: 'formGenerator' })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
