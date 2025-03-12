<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
  >
    <el-table-column
      prop="createUserName"
      label="转让人"
      width="120"
    />
    <el-table-column
      prop="transferFromOrgName"
      label="转出公司"
      width="180"
    />
    <el-table-column
      prop="transferToOrgName"
      label="转到公司"
      width="180"
    />
    <el-table-column
      prop="createTime"
      label="转让时间"
      width="180"
    >
      <template slot-scope="{row}">
        <span>{{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="transferReason"
      label="转让原因"
    />
  </el-table>
</template>

<script>
import moment from 'moment'
import { teacherTransferList } from '@/api/tearchCenter/index'
export default {
  model: {
    prop: 'tableData',
    event: 'change'
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
    moment,
    async getList(params) {
      const { data } = await teacherTransferList(params)
      this.innerVisible = true
      this.$emit('change', data)
    }
  }
}
</script>

  <style>

  </style>
