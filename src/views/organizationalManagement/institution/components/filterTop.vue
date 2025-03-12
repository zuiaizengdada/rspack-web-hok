<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="auto"
      size="small"
      :inline="true"
    >
      <el-form-item label="机构名称">
        <el-input
          v-model="search.companyName"
          clearable
          placeholder="请选择"
          @clear="onSearch"
          @change="onSearch"
        />
      </el-form-item>
      <el-form-item v-if="type === '1'" label="机构状态">
        <el-select
          v-model.trim="search.status"
          placeholder="请选择"
          filterable
          clearable
          @clear="onSearch"
          @change="onSearch"
        >
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入驻类型">
        <el-select
          v-model.trim="search.type"
          filterable
          clearable
          placeholder="请选择"
          @clear="onSearch"
          @change="onSearch"
        >
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="type === '2'" label="是否签署合同">
        <el-select
          v-model.trim="search.signContractStatus"
          filterable
          clearable
          placeholder="请选择"
          @clear="onSearch"
          @change="onSearch"
        >
          <el-option
            v-for="item in signOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { statusOption, typeOption, signOption } from './columns.js'
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
          status: '',
          companyName: '',
          type: '',
          isSign: '',
          signContractStatus: ''
        }
      }
    }
  },
  data() {
    return {
      statusOption,
      typeOption,
      signOption
    }
  },
  mounted() {},
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

<style lang="scss" scoped>
.filterTop {
  margin-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
}
</style>
