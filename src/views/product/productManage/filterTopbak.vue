<template>
  <div class="filterHeader">
    <span class="formLabel">产品名称</span>
    <el-input
      v-model.trim="search.productName"
      size="small"
      placeholder="请输入产品名称"
      class="w-200 m-r-10"
      clearable
      maxlength="30"
      @keyup.enter.native="searchFn"
      @clear="searchFn"
    />
    <span class="formLabel">讲师名称</span>
    <el-input
      v-model.trim="search.teacherName"
      size="small"
      placeholder="请输入讲师名称"
      class="w-200 m-r-10"
      clearable
      maxlength="30"
      @keyup.enter.native="searchFn"
      @clear="searchFn"
    />
    <span class="formLabel">产品类别</span>
    <el-select
      v-model="search.researchProgress"
      size="small"
      clearable
      placeholder="请选择"
      class="w-200 m-r-20 m-l-8"
      @change="searchFn"
    >
      <el-option
        v-for="item in researchProgressOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span class="formLabel">商品ID</span>
    <el-input
      v-model.trim="search.teacherName"
      size="small"
      placeholder="请输入讲师名称"
      class="w-200 m-r-10"
      clearable
      maxlength="30"
      @keyup.enter.native="searchFn"
      @clear="searchFn"
    />
    <span class="formLabel">研发进度</span>
    <el-select
      v-model="search.researchProgress"
      size="small"
      clearable
      placeholder="请选择"
      class="w-200 m-r-20 m-l-8"
      @change="searchFn"
    >
      <el-option
        v-for="item in researchProgressOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <span class="formLabel">课研人员</span>
    <el-select
      v-model="search.researchProgress"
      size="small"
      clearable
      placeholder="请选择"
      class="w-200 m-r-20 m-l-8"
      @change="searchFn"
    >
      <el-option
        v-for="item in researchProgressOption"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button size="small" type="primary" @click="searchFn">查询</el-button>
    <el-button
      size="small"
      style="margin-left: 16px"
      @click="clearFn"
    >重置</el-button>
    <div class="btn_add">
      <el-button
        size="small"
        type="primary"
        @click="onhandleAdd"
      >新增</el-button>
    </div>
  </div>
</template>

<script>
import { researchProgressOption } from '@/views/product/columns.js'

export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      researchProgressOption
    }
  },
  mounted() {},
  methods: {
    searchFn() {
      this.$emit('onSearch')
    },
    clearFn() {
      this.$emit('onClear')
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterHeader {
  padding: 20px 0;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  display: flex;
  align-items: center;
  .formLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 32px;
    margin-right: 8px;
    white-space: nowrap;
  }
}
.btn_add {
  flex: 1 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
