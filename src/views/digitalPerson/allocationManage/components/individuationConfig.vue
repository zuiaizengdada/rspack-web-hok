<template>
  <div>
    <search @onSearch="queryList" @onClear="queryList" @onAdd="add" />
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column prop="teacherName" label="IP老师" />
      <el-table-column prop="userName" label="员工姓名" />
      <el-table-column prop="periodicalCount" label="分配量">
        <template slot-scope="scope">
          <span>{{
            scope.row.periodical === 1
              ? '每天'
              : scope.row.periodical === 2
                ? '每周'
                : '每月'
          }}{{ scope.row.periodicalCount }}次</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" />
      <el-table-column prop="operatorTime" label="操作时间">
        <template slot-scope="scope">
          <span>{{ scope.row.operatorTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            style="color: red"
            @click="del(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-empty :image-size="300" description="暂无数据">
          <img
            slot="image"
            src="@/assets/image/aigc/digitalVideoManage/icn_nodata.png"
            alt=""
          />
        </el-empty>
      </template>
    </el-table>
    <el-row type="flex" justify="end" style="margin-top: 10px">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <createOrEdit v-model="dialogVisible" :row="row" @success="queryList" />
  </div>
</template>

<script>
import search from './search'
import createOrEdit from './createOrEdit'
import {
  getGenerateFrequencyConfigList,
  deleteGenerateFrequencyConfig
} from '@/api/aiVideoManage/generate'
export default {
  components: {
    search,
    createOrEdit
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      row: {}
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList(params) {
      this.currentPage = 1
      this.getList(params)
    },
    getList(params = {}) {
      this.loading = true
      getGenerateFrequencyConfigList({
        ...params,
        type: 2,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      })
        .then(res => {
          this.loading = false
          this.tableData = res.data.items
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    add() {
      this.row = { type: 2 }
      this.dialogVisible = true
    },
    edit(row) {
      this.row = { ...row, type: 2 }
      this.dialogVisible = true
    },
    del(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认删除【${row.teacherName}】老师配置？
删除后，该老师使用为不限次数。</div>`,
        success: () => {
          this.loading = true
          const data = {
            id: row.id
          }
          deleteGenerateFrequencyConfig(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.queryList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
