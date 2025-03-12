<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <el-form :inline="true" :model="wordsFrom" class="demo-form-inline">
      <el-form-item label="交付场景名称">
        <el-input v-model="wordsFrom.sceneName" class="w-200" placeholder="请输入交付场景名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sureSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item class="right-float">
        <p v-if="['web:deliveryScenario:add', permsList]" class="right-tools" @click="addDelivery">
          <i class="el-icon-plus" />
          新增</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'WordsSearch',
  // eslint-disable-next-line vue/require-prop-types
  props: [],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      wordsFrom: {
        sceneName: '',
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    sureSearch() {
      this.wordsFrom.pageIndex = 1
      this.$emit('search', this.wordsFrom)
    },
    addDelivery() {
      this.$emit('addDelivery')
    },
    clear() {
      const res = {
        sceneName: '',
        pageIndex: 1,
        pageSize: 10
      }
      console.log(res)
      this.wordsFrom.sceneName = ''
      this.$emit('search', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  position: relative;
  padding: 15px;
}
.tools-block {
  width: 100%;
  height: 40px;
}
.tools-search {
  float: right;
}
.right-float {
  float: right;
  margin-right: 0px;
}
.right-tools {
  float: right;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #0C6FFF;
  color: #0C6FFF;
  background: none!important;
}
</style>
