<template>
  <div v-loading="loading" class="table_container">
    <div class="table_wrap">
      <MPageLayout
        ref="MPageLayout"
        class="content"
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="tableData"
        :table-columns="tableColumns"
        :row-key="rowKey"
        :hide-pagination="hidePagination"
        :layout="config.layout"
        :checkbox="checkbox"
        :if-index="ifIndex"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :row-class-name="rowClassName"
        reserve-selection
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <template v-for="item in slotArr" :slot="item" slot-scope="scope">
          <div :key="item">
            <template v-if="item === 'search'">
              <filter-top
                :reset-refresh-fn="resetRefreshFn"
                :columns="tableColumns"
                :task-id="taskId"
                :data-list="dataList"
                @submit="onSubmit"
              >
                <template #headerBtn>
                  <slot name="headerBtn" />
                </template>
                <template #submitBtn>
                  <slot name="submitBtn" />
                </template>
              </filter-top>
            </template>
            <slot v-else :name="item" :row="scope.row" />
          </div>
        </template>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import filterTop from './components/filterTop'
export default {
  name: 'DynamicTable',
  components: {
    filterTop
  },
  model: {
    prop: 'tableData',
    event: 'dataChange'
  },
  props: {
    getListApi: {
      type: Function,
      default: () => {}
    },
    listKey: {
      type: String,
      default: 'items'
    },
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    ifIndex: {
      type: Boolean,
      default: false
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    configProps: {
      type: Object,
      default: () => {}
    },
    immediateCheck: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: [String, Number],
      default: ''
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function,
      default: () => {}
    },
    resetRefreshFn: {
      type: Function,
      default: null
    },
    rowClassName: {
      type: Function,
      default: () => {}
    },
    taskId: {
      type: [String, Number],
      default: ''
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      config: {
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        layout: 'total, sizes, prev, pager, next, jumper',
        ...this.configProps
      },
      loading: false,
      query: {},
      tempTableData: []
    }
  },
  computed: {
    slotArr() {
      return this.columns
        .filter(i => i.type === 'slot')
        .map(i => i.prop)
        .concat(['footer', 'search'])
    },
    tableColumns() {
      this.columns?.forEach(i => {
        if (!i.type) {
          i.type = 'text'
        }
      })
      return this.columns || []
    }
  },
  watch: {
    tableData: {
      handler(newVal) {
        console.log(newVal, 'newVal')
        this.$emit('table-data-change', newVal)
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    if (!this.immediateCheck) {
      this.$nextTick(() => {
        this.getList()
      })
    }
  },
  activated() {
    if (!this.immediateCheck) {
      this.$nextTick(() => {
        this.getList()
      })
    }
  },
  methods: {
    async getList() {
      this.loading = true
      try {
        const { data } = await this.getListApi({
          ...this.query,
          pageIndex: this.config.pageIndex,
          pageSize: this.config.pageSize
        })
        const items = data[this.listKey]?.map((item, i) => {
          return {
            ...item,
            index: (this.config.pageIndex - 1) * 10 + (i + 1)
          }
        })
        this.tempTableData = items
        this.$nextTick(() => {
          this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs?.myTable?.doLayout()
        })
        this.$emit('dataChange', items)
        this.config.total = +data.total
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleSortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    // 改变选中状态
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs?.myTable?.toggleRowSelection(
            row
          )
        })
      } else {
        this.$refs?.MPageLayout?.$refs?.pageLayout?.$refs?.mTable?.$refs?.myTable?.clearSelection()
      }
    },
    onRefresh(query) {
      if (query) {
        this.query = query
        if (query?.pageIndex) this.config.pageIndex = query.pageIndex
      }
      // this.config.pageIndex = 1
      this.getList()
    },
    onSubmit(query) {
      this.config.pageIndex = 1
      this.query = query
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.pageIndex = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.pageIndex = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.$emit('selectionChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.table_container ::v-deep {
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  .el-form-item {
    margin: 8px 0;
  }
  .table_wrap {
    // flex: 1;
    height: 100%;
  }
  .page_header {
    padding: 0;
    min-height: 0px;
  }
  //合计不显示时
  .el-table {
    overflow: visible !important;
  }
}
</style>
