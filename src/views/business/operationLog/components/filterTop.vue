<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="关键词">
        <el-input v-model="search.content" placeholder="请输入关键词" class="w-200" />
      </el-form-item>
      <el-form-item label="操作人员">
        <el-input v-model="search.operator" class="w-200" />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select v-model="search.operateType" placeholder="请选择" class="w-200" clearable>
          <el-option label="全部" :value="''" />
          <el-option label="新增" :value="1" />
          <el-option label="修改" :value="2" />
          <el-option label="删除" :value="3" />
          <el-option label="手机号查看" :value="4" />
          <el-option label="认领订单" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作模块">
        <el-select v-model="search.operateModule" placeholder="请选择" class="w-200" clearable>
          <el-option label="全部" :value="''" />
          <el-option label="评估维度管理" :value="1" />
          <el-option label="自媒体账号管理" :value="2" />
          <el-option label="达人管理" :value="11" />
          <el-option label="直播排班管理" :value="12" />
          <el-option label="业绩分成管理" :value="13" />
          <el-option label="员工管理" :value="3" />
          <el-option label="角色管理" :value="4" />
          <el-option label="订单详情" :value="21" />
          <el-option label="线索管理" :value="22" />
          <el-option label="商品学员信息" :value="23" />
          <el-option label="认领订单" :value="24" />
          <el-option label="资产管理" :value="31" />
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          content: '',
          operator: '',
          operateType: '',
          operateModule: ''
        }
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 点击查询按钮
    onSearch() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    }

  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
