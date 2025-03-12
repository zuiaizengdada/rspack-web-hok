<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="审批模版名称">
        <el-input v-model="search.name" placeholder="" clearable @clear="onSearch" @change="onSearch" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="search.time"
          class="w-220"
          type="datetimerange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :unlink-panels="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: '1'
    },
    search: {
      type: Object,
      default: () => {
        return {
          name: '',
          time: ''
        }
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {
      this.$emit('onSearch')
    },
    onClear() {
      this.$emit('onClear')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  margin-top: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  .w-220{
    width: 220px;
  }
}
</style>
