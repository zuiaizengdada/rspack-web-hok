<template>
  <el-dialog
    class="associated-class-dialog-wrapper"
    :visible.sync="visible"
    width="860px"
    :before-close="handleCancel"
    :show-close="false"
    :destroy-on-close="true"
    :wrapper-closable="false"
    :close-on-click-modal="false"
    :modal="false"
    :append-to-body="true"
    top="50px"
  >
    <div slot="title" class="ss-material-box-header">
      <div class="ss-material-box-header-title">关联班级</div>
      <i class="el-icon-close close" @click="handleCancel" />
    </div>

    <div class="associated-class-dialog-content">
      <div class="associated-class-dialog-content-header">
        <div class="associated-class-dialog-content-header-search-box">
          <div
            class="associated-class-dialog-content-header-search-box-wrapper"
          >
            <span
              class="associated-class-dialog-content-header-search-box-wrapper-title"
            >
              班级名称
            </span>
            <el-input
              v-model="searchTitle"
              class="w-200"
              placeholder="请输入班级名称"
              :maxlength="10"
              :disabled="associatedClassType === 'edit'"
              @input="handleSearch(false, null, searchTitle)"
            />
          </div>

          <el-button
            type="primary"
            plain
            size="small"
            :disabled="associatedClassType === 'edit'"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button
            type="default"
            plain
            size="small"
            :disabled="associatedClassType === 'edit'"
            @click="handleReset"
          >
            重置
          </el-button>
        </div>
      </div>

      <div class="associated-class-dialog-content-body">
        <el-table
          :data="classTableData"
          :height="tableHeight"
          style="width: 100%"
          :show-header="false"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-radio
                v-model="selectedClassId"
                :label="scope.row.id"
                @change="handleSelectClass(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>

          <el-table-column>
            <template slot-scope="scope">
              <div class="class-info">
                <div class="class-detail">
                  <div class="class-name">{{ scope.row.name }}</div>
                  <div class="class-count">
                    章节数:{{ scope.row.chapterCount }}
                  </div>
                </div>
              </div>
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

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handleSubmit">
        保存
      </el-button>
      <el-button size="mini" @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getScheduleClassPage } from '@/api/deliver/scheduleManagement'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scheduleId: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    associatedClassType: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      searchTitle: '',
      classTableData: [],
      tableHeight: 500,
      currentPage: 1,
      pageSize: 10,
      total: 100,
      options: [],
      scheduleLoading: false,
      selectedClassId: '',
      selectedClass: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (this.associatedClassType === 'edit' && this.className) {
          this.searchTitle = this.className
          this.handleSearch(true, null, this.searchTitle)
          return
        }
        this.handleSearch()
      }
    }
  },
  mounted() {
    this.calculateTableHeight()
    window.addEventListener('resize', this.calculateTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateTableHeight)
  },
  methods: {
    calculateTableHeight() {
      const windowHeight = window.innerHeight
      this.tableHeight = windowHeight - 52 - 40 - 72 - 80 - 100
    },
    handleCancel() {
      this.handleReset()
      this.$emit('update:visible', false)
    },
    async handleSearch(flag = false, row, keyword = '') {
      const params = {
        current: flag ? 1 : this.currentPage,
        scheduleId: this.scheduleId ?? (this.searchTitle ? row.id : ''),
        size: flag ? 9999 : this.pageSize,
        type: 2,
        name: keyword || this.searchTitle
      }
      const res = await getScheduleClassPage(params)
      this.searchTitle = row ? row.scheduleNum : this.searchTitle
      this.classTableData = res.data.records
      this.total = +res.data.total
    },
    handleReset() {
      this.searchTitle = ''
      this.selectedClassId = ''
      this.selectedClass = null
      this.handleSearch()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleSearch()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.handleSearch()
    },
    handlePrevClick() {
      this.currentPage--
      this.handleSearch()
    },
    handleNextClick() {
      this.currentPage++
      this.handleSearch()
    },
    handleSubmit() {
      if (!this.selectedClass) {
        this.$message.warning('请选择班级')
        return
      }

      if (this.selectedClass.chapterCount === 0) {
        this.$message.warning('请先创建作业小节')
        return
      }

      this.$emit('confirm', this.selectedClass)
      this.handleCancel()
      this.handleReset()
    },
    handleSelectClass(row) {
      this.selectedClass = row
      this.$emit('select', row)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    padding: 0;
  }
  .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    padding: 0 !important;
    border: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}

.associated-class-dialog-wrapper {
  display: flex;
  flex-direction: column;

  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 20px 30px;
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
  .associated-class-dialog-content {
    padding: 20px;

    .associated-class-dialog-content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .associated-class-dialog-content-header-search-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .associated-class-dialog-content-header-search-box-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #dcdee1;
          border-radius: 4px;
          padding-left: 10px;
          margin-right: 10px;

          .associated-class-dialog-content-header-search-box-wrapper-title {
            margin-right: 10px;
            font-size: 14px;
            padding-bottom: 2px;
            color: #000000;
          }

          .associated-class-dialog-content-header-search-box-wrapper-input {
            width: 300px;
            margin-right: 10px;
          }
        }
      }
    }

    .associated-class-dialog-content-body {
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

  .dialog-footer {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px 20px 0;
    z-index: 10;
  }
}

.class-info {
  display: flex;
  align-items: center;
  padding: 10px 0;

  .class-img {
    width: 68px;
    height: 68px;
    margin-right: 15px;
    overflow: hidden;
    background-color: red;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .class-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .class-name {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      margin-bottom: 8px;
    }

    .class-count {
      font-size: 12px;
      color: #666;
    }
  }
}

::v-deep .el-radio__label {
  display: none;
}
</style>
