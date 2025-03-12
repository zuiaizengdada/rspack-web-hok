<template>
  <el-drawer
    title="选择作业打卡"
    size="80%"
    :visible.sync="visible"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal="false"
  >
    <div class="clock-in-drawer-wrapper">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">选择作业打卡</div>
        <i class="el-icon-close close" @click="handleClose" />
      </div>

      <div class="clock-in-drawer-content">
        <div class="clock-in-drawer-content-header">
          <div class="clock-in-drawer-content-header-search-box">
            <div class="clock-in-drawer-content-header-search-box-wrapper">
              <span
                class="clock-in-drawer-content-header-search-box-wrapper-title"
              >打卡标题</span>
              <el-input
                v-model="searchTitle"
                class="clock-in-drawer-content-header-search-box-wrapper-input"
                placeholder="请输入标题"
              />
            </div>

            <el-button
              type="primary"
              plain
              size="small"
              @click="handleSearch"
            >查询</el-button>
            <el-button
              type="default"
              plain
              size="small"
              @click="handleReset"
            >重置</el-button>
          </div>
          <el-button
            type="primary"
            plain
            size="small"
            @click="handleClockInManage"
          >打卡管理</el-button>
        </div>

        <div class="clock-in-drawer-content-body">
          <el-table
            ref="expandTable"
            :data="clockInTableData"
            :height="tableHeight"
            style="width: 100%"
            :row-class-name="getRowClassName"
            @expand-change="handleExpandChange"
            @row-click="handleRowClick"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class="checkbox-wrapper">
                  <el-checkbox-group
                    v-model="checkList"
                    :max="type === 'edit' ? 1 : Infinity"
                    class="checkbox-group"
                  >
                    <el-checkbox
                      v-for="task in props.row.taskList"
                      :key="task.id"
                      :label="task.id"
                    >
                      {{ task.title }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="打卡标题" />
            <el-table-column prop="punchType" label="打卡类型">
              <template slot-scope="scope">
                <span>
                  {{
                    +scope.row.taskCount === 0
                      ? '未创建任务'
                      : { 1: '日历', 2: '作业', 3: '闯关' }[scope.row.punchType]
                  }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <el-row type="flex" justify="end" style="margin-top: 10px">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @prev-click="handlePrevClick"
              @next-click="handleNextClick"
            />
          </el-row>
        </div>
      </div>
    </div>

    <div class="clock-in-drawer-footer">
      <el-button
        type="primary"
        size="small"
        @click="handleGenerateSection"
      >生成小节</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getPunchList, getPunchTaskList } from '@/api/punch'

export default {
  name: 'ClockInDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchTitle: '',
      clockInTableData: [],
      checkList: [],
      tableHeight: 500,
      currentPage: 1,
      pageSize: 10,
      total: 100
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.getList()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateTableHeight()
    })
  },
  methods: {
    calculateTableHeight() {
      const windowHeight = window.innerHeight
      this.tableHeight = windowHeight - 52 - 40 - 72 - 80
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.resetData()
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
    handleSearch() {
      this.getList()
    },
    handleReset() {
      this.currentPage = 1
      this.pageSize = 10
      this.searchTitle = ''
      this.getList()
    },
    handleClockInManage() {
      const baseUrl = process.env.VUE_APP_BASE_URL || window.location.origin
      window.open(`${baseUrl}#/deliver/courseInteraction`)
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getList()
    },
    handlePrevClick() {
      this.currentPage--
      this.getList()
    },
    handleNextClick() {
      this.currentPage++
      this.getList()
    },
    handleGenerateSection() {
      if (this.checkList.length === 0) {
        this.$message.warning('请选择打卡任务')
        return
      }

      const checkList = this.clockInTableData
        .map(item => {
          if (item.taskList) {
            return item.taskList.filter(task =>
              this.checkList.includes(task.id)
            )
          }
          return undefined
        })
        .filter(item => item !== undefined)
        .flat()

      this.$emit('confirm', this.type, checkList)
      this.handleClose()
    },
    getRowClassName({ row }) {
      let classname = 'autofix-table-row'
      if (+row.taskCount === 0) {
        classname += ' hide-expand'
      }
      return classname
    },
    async handleRowClick(row, isExpend) {
      if (+row.taskCount > 0) {
        if (row.taskList) {
          this.$refs.expandTable.toggleRowExpansion(row, isExpend)
          return
        }

        const params = {
          size: 10000,
          pages: 1,
          punchId: +row.id
        }
        const { code, data } = await getPunchTaskList(params)
        if (code === 1) {
          this.$set(row, 'taskList', data.records)
          this.$nextTick(() => {
            this.$refs.expandTable.toggleRowExpansion(row, isExpend)
          })
        }
      }
    },
    async handleExpandChange(row, expandedRows) {
      const isExpend = expandedRows.some(r => r.id === row.id)
      await this.handleRowClick(row, isExpend)
    },
    async getList() {
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        title: this.searchTitle,
        isPublish: 1
      }
      const { code, data } = await getPunchList(params)
      if (code === 1) {
        this.clockInTableData = data.records
        this.total = +data.total
      }
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

  .hide-expand .el-table__expand-column .cell {
    visibility: hidden;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer; /* 修改鼠标样式 */
  }
}

.clock-in-drawer-wrapper {
  display: flex;
  flex-direction: column;

  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
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
  .clock-in-drawer-content {
    padding: 20px;

    .clock-in-drawer-content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .clock-in-drawer-content-header-search-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .clock-in-drawer-content-header-search-box-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #dcdee1;
          border-radius: 4px;
          padding-left: 10px;
          margin-right: 10px;

          .clock-in-drawer-content-header-search-box-wrapper-title {
            margin-right: 10px;
            font-size: 14px;
            padding-bottom: 2px;
          }

          .clock-in-drawer-content-header-search-box-wrapper-input {
            width: 300px;
            margin-right: 10px;
          }
        }
      }
    }

    .clock-in-drawer-content-body {
      margin-top: 20px;

      .checkbox-wrapper {
        padding: 10px 0 10px 55px;

        .checkbox-group {
          display: flex;
          flex-direction: column;

          ::v-deep .el-checkbox {
            margin-left: 0;
            margin-bottom: 10px;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}

.clock-in-drawer-footer {
  width: 100%;
  position: fixed;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px 20px 0;
  z-index: 10;
}
</style>
