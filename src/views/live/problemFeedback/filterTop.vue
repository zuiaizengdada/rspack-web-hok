<template>
  <div class="filterTop">
    <!-- 筛选栏 -->
    <el-form ref="form" :model="search" label-width="70px" size="small" :inline="true">
      <el-form-item label="手机号码">
        <el-input v-model.trim="search.phone" clearable class="w-200" @clear="$emit('onSearch')" @input="delNumber" @keyup.enter.native="$emit('onSearch')" />
      </el-form-item>
      <el-form-item label="解决状态">
        <el-select v-model="search.status" placeholder="请选择" clearable @change="$emit('onSearch')">
          <el-option v-for="(item) in option" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('onSearch')">查询</el-button>
        <el-button @click="$emit('onClear')">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          phone: '',
          status: ''
        }
      }
    },
    option: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    // 限制只能输入数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  // padding-top: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
</style>
