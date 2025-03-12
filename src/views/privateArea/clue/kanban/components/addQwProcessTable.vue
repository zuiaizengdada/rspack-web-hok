<template>
  <div class="table-container">
    <div class="headerTop">
      <MTitle>数据概况</MTitle>
      <span>更新时间：{{ statDate || '0000-00-00 00:00:00' }}</span>
    </div>
    <el-form :inline="true" size="small" :model="form" class="search-form">
      <el-form-item label="员工姓名：">
        <el-input v-model="form.name" clearable placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item label="加微类型：">
        <el-select v-model="form.aaa" clearable placeholder="请选择">
          <el-option label="企微" value="1" />
          <el-option label="个微" value="2" />
          <el-option label="企微或个微" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="线索有效性：">
        <el-select v-model="form.isAvailable" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" size="small" @click="handleOk">查询</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
    </el-form>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { taskStatFollowerDetail } from '@/api/privateArea/clue'
export default {
  name: 'AddQwProcessTable',
  components: {
    dynamicTable
  },
  data() {
    return {
      form: {
        name: '',
        type: ''
      },
      options: [
        {
          label: '有效',
          value: 0
        },
        {
          label: '无效',
          value: 1
        }
      ],
      tableData: [],
      columns: [
        {
          prop: 'userName',
          label: '用户姓名',
          type: 'text',
          visible: true
        }
      ],
      statDate: ''
    }
  },
  methods: {
    getList() {
      return taskStatFollowerDetail
    },
    handleReset() {
      this.form = {
        name: '',
        type: ''
      }
    },
    handleOk() {
      this.$refs.table.onRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.headerTop {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  > div {
    font-weight: bold;
  }
  > span {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
    margin-left: 10px;
  }
}
</style>
