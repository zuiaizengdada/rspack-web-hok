<template>
  <el-dialog :title="title" :visible.sync="visible" width="800px" top="3%" :close-on-click-modal="false">
    <div v-loading="loading" class="select">
      <div class="select_book">
        <el-input
          v-if="!columnData[type].searchHidden"
          v-model="search"
          size="small"
          :placeholder="config.placeholder"
          class="m-l-10 m-r-10 w-200"
          @keyup.enter.native="handerSearch"
        />
        <el-button
          v-if="!columnData[type].searchHidden"
          size="small"
          icon="el-icon-search"
          @click="handerSearch()"
        />
        <!-- <el-button type="primary" icon="el-icon-plus" size="small" @click="add" /> -->
        <MPageLayout
          ref="mPageLayout"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          :loading="loading"
          :checkbox="multiple"
          layout="total, sizes, prev, pager, next, jumper"
          border
          if-radio
          max-height="325px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @handleSelectionChange="handleSelectionChange"
        >
          <div slot="action" slot-scope="scope">
            <el-radio v-if="!multiple" v-model="selection" :label="scope.row" :disabled="disabledFn(scope.row)"><span /></el-radio>
          </div>
          <div slot="footerRight">
            <el-button size="small" @click="cancel()">取 消</el-button>
            <el-button type="primary" size="small" @click="sure()">确 定</el-button>
          </div>
        </MPageLayout>
      </div>
      <!-- <div class="select_footer">
        <div class="footer_btn">

        </div>
      </div> -->
    </div>
  </el-dialog>
</template>

<script>
import tableData from './config'
import request from '@/utils/request'
export default {
  name: 'SelectBook',
  props: {
    title: {
      type: String,
      default: '选择'
    },
    defultCheck: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    success: {
      type: Function,
      default: () => {}
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 类型: 选择标签，选择群
    type: {
      type: String,
      default: 'label'
    },
    params: {
      type: Object,
      default: () => {}
    },
    addFn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      columnData: tableData,
      search: '',
      loading: false,
      slotArr: ['action', 'ifRadio', 'footerRight'],
      config: {
        tableData: [],
        tableColumns: [],
        pageSizes: [10, 20, 30, 40],
        pageSize: 20,
        currentPage: 1,
        total: 10,
        placeholder: '请输入'
      },
      disabledFn: () => false,
      multipleSelection: [], // 多选数据
      selection: {} // 单选数据
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.search = ''
        this.multipleSelection = []
        this.selection = {}
        this.config.currentPage = 1
        this.config.tableColumns = []
        this.config.placeholder = ''
        this.config.tableData = []
      } else {
        this.$set(this.config, 'placeholder', tableData[this.type].placeholder)
        if (this.multiple) {
          this.$set(this.config, 'tableColumns', tableData[this.type].tableColumns.slice(1))
          this.multipleSelection = this.defultCheck
        } else {
          this.$set(this.config, 'tableColumns', tableData[this.type].tableColumns)
          this.selection = this.defultCheck
        }

        this.getList().then(() => {
          if (this.multiple) {
            // console.log('数据请求完成', this.config.tableData)
            this.$nextTick(() => {
              this.toggleSelection(this.defultCheck)
            })
          }
        })
      }
    }
  },
  methods: {
    handerSearch() {
      console.log(this.search, 'search')
      this.config.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击确认
    sure() {
      this.visible = false
      if (this.multiple) {
        this.success && this.success(this.multipleSelection)
      } else {
        this.success && this.success(this.selection)
      }
    },
    // 点击取消
    cancel() {
      this.toggleSelection()
      this.toggleSelection(this.defultCheck)
      this.visible = false
    },
    // 改变选中状态
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          const a = this.config.tableData.find(v => v.id === row.id)
          this.$refs.mPageLayout.$refs.pageLayout.$refs.mTable.$refs.myTable.toggleRowSelection(a, true)
        })
      } else {
        this.$refs.mPageLayout.$refs.pageLayout.$refs.mTable.$refs.myTable.clearSelection()
      }
    },

    // 请求列表数据
    getList() {
      console.log(this.params, 'params')
      this.loading = true
      if (this.params && this.params.pageSize) {
        this.config.pageSize = this.params.pageSize
      } else {
        this.config.pageSize = 10
      }
      const params = {
        // keyWord: this.search,
        current: this.config.currentPage,
        size: this.config.pageSize,
        [tableData[this.type].searchKey]: this.search,
        ...this.params
      }

      return request({
        url: tableData[this.type].api,
        method: tableData[this.type].method,
        params
      }).then(res => {
        return tableData[this.type].success(res)
      }).then(res => {
        this.loading = false
        this.config.total = res.total
        this.config.tableData = res.tableData
        // this.$set(this.config, 'tableData', res.tableData)
        // this.toggleSelection(this.defultCheck)
      }).catch(() => {
        this.loading = false
      })
    },
    add() {
      this.addFn && this.addFn()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    padding: 30px 20px 1px;
  }
  .my-table {
    margin: 0;
  }
}
.select {
  .select_book {
    width: 100%;
    height: 450px;
    margin-bottom: 40px;
  }
  .select_footer {
      margin-top: 10px;
      display: flex;
      > div {
          flex: 1;
      }
      .footer_btn {
          display: flex;
          justify-content: flex-end;
      }
  }
}
</style>
