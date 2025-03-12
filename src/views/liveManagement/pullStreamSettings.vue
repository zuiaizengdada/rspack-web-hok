<template>
  <div>
    <!-- 拉流设置 -->
    <div>
      <el-button type="primary">添加IP/助教</el-button>
      <el-tooltip class="item" effect="dark" content="最多添加10个B端IP/助教,只能有1个主控人" placement="right">
        <i class="el-icon-info m-l-10" />
      </el-tooltip>
    </div>
    <el-table border :data="listTable" class="m-t-20">
      <el-table-column prop="date" label="IP/助教" />
      <el-table-column prop="date" label="角色" />
      <el-table-column prop="date" label="C端显示" />
      <el-table-column prop="date" label="接受打赏" />
      <el-table-column label="操作" />
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      listTable: []
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
