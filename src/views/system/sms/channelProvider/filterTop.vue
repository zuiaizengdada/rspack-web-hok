<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="状态" label-width="40px">
        <el-select v-model="search.activeFlag" placeholder="请选择" clearable @clear="onSearch" @change="onSearch">
          <el-option v-for="(item, key) in statusOption" :key="key" :label="item" :value="Number(key)" />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道商名称">
        <el-select v-model.trim="search.name" placeholder="请输入" class="w-200" filterable clearable @clear="onSearch" @change="onSearch">
          <el-option v-for="(item) in ChannelOption" :key="item.dictCode" :value="item.dictLabel" :label="item.dictLabel" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
      <el-button type="primary" icon="el-icon-plus" size="small" class="fr" @click="onhandleAdd">新增渠道</el-button>
    </el-form>
  </div>
</template>

<script>
import { statusOption } from './columns.js'
import { getDict } from '@/utils/index'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          activeFlag: '',
          name: ''
        }
      }
    }
  },
  data() {
    return {
      ChannelOption: [],
      statusOption
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 获取数据
    init() {
      getDict('sys_sms_channel').then(res => {
        this.ChannelOption = res
      })
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    },
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
  margin-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
}
</style>
