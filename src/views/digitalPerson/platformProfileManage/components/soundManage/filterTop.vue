<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      size="small"
      :inline="true"
      class="form"
    >
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="名称">
            <el-input
              v-model="search.name"
              placeholder="请输入名称"
              clearable
              @clear="onSearch"
              @keyup.enter.native="onSearch"
            />
          </el-form-item>
          <el-form-item label="所属机构">
            <el-cascader
              ref="cascader1"
              v-model="search.orgId"
              class="select"
              clearable
              :options="deptList"
              :props="{ checkStrictly: true, multiple: false, emitPath: false }"
              :show-all-levels="false"
              @change="deptChange"
            />
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
              <el-option :label="'火山大模型'" :value="5">
                火山大模型
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建方">
            <el-select
              v-model="search.createType"
              :filterable="true"
              placeholder="请选择"
              class="w-200"
              clearable
              @change="onSearch"
              @clear="onSearch"
            >
              <el-option label="平台创建" :value="1"> 平台创建 </el-option>
              <el-option label="机构创建" :value="2"> 机构创建 </el-option>
            </el-select>
          </el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="onSearch"
          >
            查询
          </el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>

        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="onhandleAdd"
        >
          新增声音
        </el-button>
      </el-row>
      <el-divider class="divider" />
    </el-form>
  </div>
</template>

<script>
import { getConfiguredOrgList } from '@/api/aiVideoManage'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          orgId: ''
        }
      }
    }
  },
  data() {
    return {
      deptList: [],
      loading: false
    }
  },
  created() {
    this.getDept()
  },
  methods: {
    deptChange() {
      this.$nextTick(() => {
        this.$refs.cascader1.dropDownVisible = false
      })
      this.onSearch()
    },
    async getDept() {
      const res = await getConfiguredOrgList()
      this.deptList = res.data.map(item => {
        return {
          value: item.orgId,
          label: item.orgName
        }
      })
    },
    // 点击查询按钮
    onSearch() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
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
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
  .form .el-form-item {
    margin-bottom: 0;
  }
  .divider {
    margin: 20px 0;
    background-color: #e7e7e7;
  }
}
.addBtn {
  margin-bottom: 20px;
}
</style>
