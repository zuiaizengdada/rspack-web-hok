<template>
  <div
    v-loading="loadding"
    element-loading-spinner="el-icon-loading"
  >
    <!-- 表格通用组件 -->
    <el-table
      ref="hokzbTableRef"
      :header-cell-style="{
        background: '#EFF2F6',
        padding: '9px 0',
        color: '#333',
        'font-weight': 700,
        'letter-spacing': '1px'
      }"
      :class="{ 'zb-table': true, 'el-table-null': !tableData.length }"
      v-bind="$attrs"
      :data="tableData"
      v-on="$listeners"
    >
      <template v-for="(item) in columns">
        <!-- :width="item.width" -->
        <el-table-column
          v-if="item.type !== 'slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :render-header="item.renderHeader"
          :fixed="item.fixed"
          v-bind="item.attrs"
        />
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :render-header="item.renderHeader"
          :fixed="item.fixed"
          v-bind="item.attrs"
        >
          <template slot-scope="scope">
            <slot :name="item.prop" :scope="scope" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-row
      type="flex"
      :justify="isLeftBottomSlot ? 'space-between' : 'end'"
      style="margin-top: 10px"
    >
      <slot name="footer" />
      <el-pagination
        v-if="isPages"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="jumper, prev, pager, next, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    getList: {
      type: Function,
      default: () => {
        return []
      }
    },
    dataKey: {
      type: String,
      default: 'items'
    },
    // 是否显示分页
    isPages: {
      type: Boolean,
      default: true
    },
    // 分页左下角插槽
    isLeftBottomSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      loadding: false,
      currentPage: 1, 
      pageSize: 10
    }
  },
  activated() {
    this.init(false)
  },
  methods: {
    init(isResetPageIndex = true) {
      this.loadding = true
      if (isResetPageIndex) {
        this.currentPage = 1
      }
      this.getList()
        .then(res => {
          this.loadding = false
          this.tableData = this.isPages ? res.data[this.dataKey] : res.data
          this.total = +res.data.total || 0 
          this.$nextTick(() => {
            this.$refs.hokzbTableRef.doLayout()
          })
        })
        .catch(() => {
          this.activateShow = true
          this.loadding = false
        })
    },
    handleSizeChange(val) {
      console.log('handleSizeChange----触发')
      this.pageSize = val
      this.currentPage = 1
      this.$emit('handleSizeChangeEmit', this.pageSize)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('handleCurrentChangeEmit', this.currentPage)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .zb-table {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  table-layout: fixed;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        border-bottom: 1px solid #eff2f6;
        .cell {
          color: #333;
        }
      }
    }
  }
}
</style>
