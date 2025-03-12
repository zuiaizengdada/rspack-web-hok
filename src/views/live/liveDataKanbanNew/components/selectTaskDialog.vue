<template>
  <el-dialog
    class="select-task-dialog"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
    :show-close="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-click-modal="false"
  >
    <div slot="title" class="ss-material-box-header">
      <div class="ss-material-box-header-title">选择任务</div>
      <i class="el-icon-close close" @click="handleClose" />
    </div>

    <div class="select-task-dialog-content">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <el-row style="width: 100%">
          <el-col :span="8">
            <div class="select-task-dialog-content-header-search-box-wrapper">
              <span
                class="select-task-dialog-content-header-search-box-wrapper-title"
              >任务名称</span>
              <el-input
                v-model="searchForm.taskName"
                class="select-task-dialog-content-header-search-box-wrapper-input"
                placeholder="请输入任务名称"
              />
            </div>
          </el-col>
          <el-col :span="8">
            <div class="select-task-dialog-content-header-search-box-wrapper">
              <span
                class="select-task-dialog-content-header-search-box-wrapper-title"
              >任务状态</span>
              <el-select
                v-model="searchForm.taskStatus"
                class="select-task-dialog-content-header-search-box-wrapper-input"
                placeholder="请选择任务状态"
              >
                <el-option
                  v-for="item in channelOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="select-task-dialog-content-header-search-box-wrapper">
              <span
                class="select-task-dialog-content-header-search-box-wrapper-title"
              >任务开始时间</span>
              <el-date-picker
                v-model="searchForm.createTime"
                type="daterange"
                range-separator="至"
                style="width: 70%"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </div>
          </el-col>
        </el-row>
        <div style="display: flex; align-items: center">
          <el-button type="primary" size="mini" @click="handleSubmit">
            查询
          </el-button>
          <el-button type="default" size="mini" @click="handleReset">
            重置
          </el-button>
        </div>
      </div>

      <el-table
        ref="table"
        :data="tableData"
        :height="500"
        style="width: 100%; margin-top: 20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="taskName" label="任务名称" />
        <el-table-column prop="taskStatus" label="任务状态">
          <template slot-scope="{ row }">
            <MIconStatus
              :background="
                getOptionsValueByKey(
                  'value',
                  'background',
                  row.taskStatus,
                  statusOption
                )
              "
              :color="
                getOptionsValueByKey(
                  'value',
                  'color',
                  row.taskStatus,
                  statusOption
                )
              "
              :icon-class="
                getOptionsValueByKey(
                  'value',
                  'icon',
                  row.taskStatus,
                  statusOption
                )
              "
              :title="
                getOptionsValueByKey(
                  'value',
                  'label',
                  row.taskStatus,
                  statusOption
                )
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="任务开始时间" />
        <el-table-column prop="endTime" label="任务结束时间" />
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSave">
        保存
      </el-button>
      <el-button size="mini" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getSaleTaskPage } from '@/api/privateArea/CRM'
import { getOptionsValueByKey } from '@/filters/index'

export default {
  name: 'SelectTaskDialog',
  data() {
    return {
      dialogVisible: false,
      searchForm: {
        taskName: '',
        taskStatus: '',
        createTime: []
      },
      statusOption: [
        {
          label: '未开始',
          value: '1',
          background: '#FEECEC',
          color: '#F53F3F',
          icon: 'icon_taskStatus0'
        },
        {
          label: '进行中',
          value: '2',
          background: '#E7F0FF',
          color: '#0C6FFF',
          icon: 'icon_taskStatus1'
        },
        {
          label: '已关闭',
          value: '4',
          background: '#F5F5F5',
          color: '#777777',
          icon: 'icon_taskStatus3'
        },
        {
          label: '暂停中',
          value: '3',
          background: '#FEF1EC',
          color: '#FF7D00',
          icon: 'icon_taskStatus4'
        }
      ],
      channelOption: [
        {
          label: '未开始',
          value: '1',
          background: '#FEECEC',
          color: '#F53F3F',
          icon: 'audit_fail'
        },
        {
          label: '进行中',
          value: '2',
          background: '#E7F0FF',
          color: '#0C6FFF',
          icon: 'jinxingzhong'
        },
        {
          label: '暂停中',
          value: '3',
          background: '#FEF1EC',
          color: '#FF7D00',
          icon: 'liveSuspend'
        },
        {
          label: '已关闭',
          value: '4',
          background: '#F5F5F5',
          color: '#777777',
          icon: 'audit_info'
        }
      ],
      tableData: [],
      selectedTasks: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      selectedTaskIds: []
    }
  },
  watch: {
    tableData: {
      handler(newData) {
        this.$nextTick(() => {
          newData.forEach(row => {
            if (this.selectedTaskIds.includes(Number(row.id))) {
              this.$refs.table.toggleRowSelection(row, true)
            }
          })
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getOptionsValueByKey,
    // 打开弹窗
    open(selectedTaskIds = []) {
      this.dialogVisible = true
      this.selectedTaskIds = selectedTaskIds.map(id => Number(id))
      this.getTableData()
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.handleReset()
    },

    // 重置表单
    resetForm() {
      this.searchForm = {
        taskName: '',
        taskStatus: '',
        createTime: []
      }
      this.selectedTasks = []
      this.$refs.table?.clearSelection()
    },

    // 获取表格数据
    async getTableData() {
      try {
        const params = {
          taskName: this.searchForm.taskName,
          taskStatus: this.searchForm.taskStatus,
          startTime: this.searchForm.createTime?.[0],
          endTime: this.searchForm.createTime?.[1],
          pageIndex: this.currentPage,
          pageSize: this.pageSize,
          isDepTask: 0
        }
        const res = await getSaleTaskPage(params)
        this.tableData = res.data.items
        this.total = res.data.total
      } catch (error) {
        console.error(error)
      }
    },

    // 选择改变
    handleSelectionChange(val) {
      this.selectedTasks = val
    },

    // 改变每页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1 // 切换每页条数时重置为第一页
      this.getTableData()
    },

    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
    },

    // 重置
    handleReset() {
      this.searchForm = {
        taskName: '',
        taskStatus: '',
        createTime: []
      }
      this.currentPage = 1
      this.pageSize = 10
      this.selectedTaskIds = []
      this.$refs.table?.clearSelection()
      this.selectedTasks = []
      this.getTableData()
    },

    // 查询
    handleSubmit() {
      this.currentPage = 1 // 搜索时重置为第一页
      this.selectedTasks = []
      this.$refs.table?.clearSelection()
      this.getTableData()
    },

    // 保存
    handleSave() {
      if (this.selectedTasks.length === 0) {
        this.$message.warning('请至少选择一个任务')
        return
      }
      this.$emit('confirm', this.selectedTasks)
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    padding: 0 !important;
    border: none;
  }

  .el-dialog__header {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding: 20px 20px !important;
  }

  .hide-expand .el-table__expand-column .cell {
    visibility: hidden;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer; /* 修改鼠标样式 */
  }

  .el-select .el-input {
    display: flex;
    align-items: center;
  }

  .el-select .el-input__suffix {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .el-table {
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #dcdfe6;

    th {
      background: #eff2f6 !important;
      font-weight: bold;
    }

    // 移除内部竖线
    td,
    th {
      border-right: none;
    }

    // 确保表头和内容之间有横线
    thead th {
      border-bottom: 1px solid #dcdfe6;
    }

    // 移除表格体的所有横线
    tbody td {
      border-bottom: none;
    }

    // 给每行（除最后一行）添加底部边框
    tbody tr:not(:last-child) td {
      border-bottom: 1px solid #dcdfe6;
    }

    // 修复多选框对齐问题
    .el-table-column--selection .cell {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  // 修复分页样式问题
  .el-pagination {
    .el-pagination__sizes {
      .el-input__inner {
        border: 1px solid #dcdfe6;
        padding: 0 8px !important;
      }
    }

    .el-pagination__jump {
      .el-input__inner {
        border: 1px solid #dcdfe6;
        padding: 0 8px !important;
      }
    }
  }
}

.select-task-dialog-content-header-search-box-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dcdee1;
  border-radius: 4px;
  padding-left: 10px;
  margin-right: 10px;

  .select-task-dialog-content-header-search-box-wrapper-title {
    margin-right: 10px;
    font-size: 14px;
    padding-bottom: 2px;
  }

  .select-task-dialog-content-header-search-box-wrapper-input {
    flex: 1;
    margin-right: 10px;
  }
}

.ss-material-box-header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 52px;
  padding: 15px 20px;
  background: #ffffff;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid #f2f2f2;
  color: #353535;
  font-size: 16px;
  font-weight: bold;
  .ss-material-box-header-title {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

.close {
  color: #b2b2b2;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
</style>
