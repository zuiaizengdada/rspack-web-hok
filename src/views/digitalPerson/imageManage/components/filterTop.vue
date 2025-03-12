<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="auto"
      size="small"
      :inline="true"
    >
      <el-form-item label="IP">
        <el-select
          v-model="search.teacherId"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
          @clear="onSearch"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="item in teacherList"
            :key="item.teacherId"
            :label="item.teacherName"
            :value="item.teacherId"
          >
            {{ item.teacherName }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道">
        <el-select
          v-model="search.thirdType"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
          @clear="onSearch"
        >
          <el-option :label="'华为'" :value="1"> 华为 </el-option>
          <el-option :label="'火山'" :value="2"> 火山 </el-option>
          <el-option :label="'硅基'" :value="3"> 硅基 </el-option>
 <el-option :label="'火山大模型'" :value="5"> 火山大模型 </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="search.status"
          :filterable="true"
          placeholder="请选择"
          class="w-200"
          clearable
          @change="onSearch"
          @clear="onSearch"
        >
          <el-option :label="'启用'" :value="1"> 启用 </el-option>
          <el-option :label="'禁用'" :value="2"> 禁用 </el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        size="small"
        @click="onSearch"
      >
        查询
      </el-button>
      <el-button size="small" @click="onClear">重置</el-button>

      <el-row>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="onhandleAdd"
        >
          关联数字人形象
        </el-button>
      </el-row>
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
          teacherId: '', // 讲师姓名
          status: undefined // 状态
        }
      }
    },
    teacherList: {
      type: Array,
      default: () => {
        return []
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
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
