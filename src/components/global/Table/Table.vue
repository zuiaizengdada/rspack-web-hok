<template>
  <div class="my-table">
    <div class="customHeader">
      <CustomTabelHeader
        v-if="keys"
        ref="customTabelHeaderRef"
        :keys="keys"
        :columns="initColumns"
        @change="handleBanChange"
      />
    </div>
    <el-table
      ref="myTable"
      v-loading="loading"
      :data="tableData"
      :border="border"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :row-key="rowKey"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :default-sort="defaultSort"
      :row-class-name="rowClassName"
      :span-method="spanMethod"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @sort-change="handleSortChange"
      @select-all="handleSelectionAllChange"
    >
      <template #empty >
        <!-- 判断插槽是否有内容 -->
        <template v-if="slotArr.includes('empty')">
          <slot name="empty" />
        </template>
        <div v-else>{{ emptyText || '暂无数据' }}</div>
      </template>
      <el-table-column
        v-if="checkbox"
        type="selection"
        width="55"
        :reserve-selection="reserveSelection"
        align="center"
        :selectable="selectable"
      />
      <el-table-column
        v-if="ifIndex"
        type="index"
        :width="tableIndexWidth"
        label="序号"
        :fixed="indexLocation"
      />
      <el-table-column
        v-if="treeMode"
        :width="155"
        :label="rowKey"
        :prop="rowKey"
      />
      <template v-for="(item, index) in initColumns">
        <template v-if="item.visible === true || item.visible === undefined">
          <el-table-column
            v-if="item.type === 'slot'"
            :key="index"
            v-bind="item"
            :render-header="renderHeade"
          >
            <template v-if="item.headerSlot" #header>
              <slot :name="`${item.prop + '-header'}`" :row="item" />
            </template>
            <template slot-scope="scope">
              <slot :name="item.prop" :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.isPhone"
            :key="index"
            :render-header="renderHeade"
            v-bind="item"
          >
            <template slot-scope="{ row }">
              <tablePhoneItem
                v-model="row[item.prop]"
                :phone-area-code="
                  row.areaCodeKey ? row[row.areaCodeKey] : row.phoneAreaCode
                "
                :copy="item.copy"
                :row-data="row"
                :set-phone="item.setPhone"
                :type="item.phoneType"
                :phone-authority="item.phoneAuthority"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.isEmail"
            :key="index"
            :render-header="renderHeade"
            v-bind="item"
          >
            <template slot-scope="{ row }">
              <tableEmailItem
                v-model="row[item.prop]"
                :copy="item.copy"
                :row-data="row"
                :user-key="item.userKey"
                :set-email="item.setEmail"
                :type="item.emailType"
                :email-authority="item.emailAuthority"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item.slotFn"
            :key="index"
            :render-header="renderHeade"
            v-bind="item"
          >
            <template slot-scope="{ row }">
              {{ item.slotFn(row) }}
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="item['show-overflow-tooltip']"
            :key="index"
            :render-header="renderHeade"
            v-bind="item"
          />
          <el-table-column
            v-else
            :key="index"
            v-bind="item"
            :render-header="renderHeade"
            :sortable="item.sortable || false"
          >
            <template slot-scope="scope">
              <MBaseTableItem :item="item" :render-data="scope.row" />
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
  </div>
</template>

<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import CustomTabelHeader from '@/components/CustomTabelHeader'
import { setColumns } from '@/utils/tableUtils'
import store from '@/store/index'
export default {
  name: 'MyTable',
  components: {
    tablePhoneItem,
    tableEmailItem,
    CustomTabelHeader
  },
  props: {
    keys: {
      type: String,
      default: ''
    },
    slotArr: {
      type: Array,
      default: () => []
    },
    config: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableColumns: {
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
    indexLocation: {
      type: String,
      default: 'left'
    },
    loading: {
      type: Boolean,
      default: false
    },
    border: {
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
    treeMode: {
      type: Boolean,
      default: false
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    emptyText: {
      type: String,
      default: ''
    },
    defaultSort: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectable: {
      type: Function,
      default: () => {
        return true
      }
    },
    spanMethod: {
      type: Function,
      default: null
    },
    summaryMethod: {
      type: Function,
      default: null
    },
    rowClassName: {
      type: Function,
      default: null
    },
    tableIndexWidth: {
      type: String,
      default: '50px'
    },
    headerCellStyle: {
      type: [String, Object],
      default: () => {
        return { background: '#f5f5f5' }
      }
    },
    cellStyle: {
      type: [String, Object],
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      initColumns: []
    }
  },
  computed: {
    tableBtnList() {
      return this.config.tableBtnList
    }
  },
  watch: {
    tableColumns: {
      handler: function () {
        if (!this.tableColumns?.length) return
        const tableColumnsMap = store.getters['table/tableColumnsMap']
        this.setColumns(this.tableColumns, tableColumnsMap[this.keys])
        this.$nextTick(() => {
          this.$refs.customTabelHeaderRef?.init()
        })
      },
      immediate: true,
      deep: true
    }
  },
  // created() {
  //   this.setColumns(this.tableColumns, this.tableColumnsMap[this.keys])
  // },
  // activated() {
  //   this.setColumns(this.tableColumns, this.tableColumnsMap[this.keys])
  // },
  mounted() {},
  destroyed() {},
  methods: {
    renderHeade(h, { column, $index }) {
      return h('div', [
        h('span', column.label + '  ', {
          align: 'center',
          marginTop: '10px'
        }),
        h(
          'el-popover',
          {
            props: {
              placement: 'top-start', // 一般 icon 处可添加浮层说明，浮层位置等属性
              trigger: 'hover'
            },
            style: `display:${
              this.initColumns[$index]?.headTip ? 'inline-block' : 'none'
            }`
          },
          [
            h('p', `${this.initColumns[$index]?.headTip}`, {
              class: 'text-align: center; margin: 0;'
            }),
            h('i', {
              // 生成 i 标签 ，添加icon 设置 样式，slot 必填
              class: 'el-icon-question',
              style: 'color:#ccc,margin:18px,padding-top:10px',
              slot: 'reference'
            })
          ]
        )
      ])
    },
    handleBanChange(dataList) {
      this.setColumns(this.tableColumns, dataList)
    },
    setColumns(colum, list) {
      if (!this.keys) {
        if (!colum.length) return
        this.initColumns = colum
        return
      }
      const columns = setColumns(colum, list)
      this.initColumns = columns
      const columnsMap = columns.map(item => ({
        label: item.label,
        visible: item.visible !== false,
        disable: item?.disable ?? false
      }))
      this.$store.dispatch('table/setTableColumns', { [this.keys]: columnsMap })
      setTimeout(() => {
        this.doLayout()
      })
    },
    handleSelectionChange(val) {
      this.$listeners.handleSelectionChange(val)
      // this.$emit('handleSelectionChange');
    },
    handleSelectionAllChange(val) {
      this.$listeners.handleSelectionAllChange &&
        this.$listeners.handleSelectionAllChange(val)
    },
    handleDetail(index, row) {
      this.$listeners.handleDetail(index, row)
      // this.$emit('handleDetail',index,row);
    },
    handleEdit(index, row) {
      this.$listeners.handleEdit(index, row)
      // this.$emit('handleEdit',index,row);
    },
    handleDelete(index, row) {
      this.$listeners.handleDelete(index, row)
      // this.$emit('handleDelete',index,row);
    },
    handleChangeStatus(row, status) {
      this.$listeners.handleChangeStatus(row, status)
      // this.$emit('handleChangeStatus',row,status);
    },
    codeHandleDelete(index, row) {
      this.$listeners.codeHandleDelete(index, row)
    },
    handleChange(index, row) {
      this.$listeners.handleChange(index, row)
    },
    exportExcel(row) {
      this.$listeners.exportExcel(row)
    },
    handleUserRule(index, row) {
      this.$listeners.handleUserRule(index, row)
    },
    handleRuleUser(index, row) {
      this.$listeners.handleRuleUser(index, row)
    },
    handlehistory(index, row) {
      this.$listeners.handlehistory(index, row)
    },
    // 表格选中
    handletoggleSelectionAll() {
      this.$refs.myTable.clearSelection()
      this.$refs.myTable.toggleAllSelection()
    },
    // 表格取消选中
    clearSelection() {
      this.$refs.myTable.clearSelection()
    },
    // 表格清空排序
    clearSort() {
      this.$refs.myTable.clearSort()
    },
    // 对表格重新布局
    doLayout() {
      this.$refs.myTable?.doLayout()
    },
    handleCellMouseEnter(row, column, cell, event) {
      this.$listeners['cell-mouse-enter'] &&
        this.$listeners['cell-mouse-enter'](row, column, cell, event)
    },
    handleCellMouseLeave(row, column, cell, event) {
      this.$listeners['cell-mouse-leave'] &&
        this.$listeners['cell-mouse-leave'](row, column, cell, event)
    },
    handleSortChange(obj) {
      const arrElm = document.getElementsByClassName(
        'el-table__cell descending'
      )
      arrElm.forEach(element => {
        element.classList.remove('descending')
      })
      const arrElm2 = document.getElementsByClassName(
        'el-table__cell ascending'
      )
      arrElm2.forEach(element => {
        element.classList.remove('ascending')
      })
      const { column, order } = obj
      this.$nextTick(() => {
        if (!order) {
          document
            .getElementsByClassName(column.id)[0]
            .classList.remove('ascending', 'descending')
        } else {
          document
            .getElementsByClassName(column.id)[0]
            .classList.remove('ascending', 'descending')
          document.getElementsByClassName(column.id)[0].classList.add(order)
        }
        this.$listeners['sort-change'] && this.$listeners['sort-change'](obj)
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.my-table {
  // margin: 10px;
  margin: 0 20px;
  height: 100%;
  position: relative;
  .customHeader {
    position: absolute;
    top: 3px;
    right: 0;
    z-index: 33;
    height: 20px;
    justify-content: space-between;
  }
  .element-table-list {
    height: 100%;
  }
}

.pagination-container {
  margin-top: 0;
  padding: 32px 10px 10px;
  background-color: #fff;
  border-radius: 0 0 4px 4px;
  text-align: right;
}

::v-deep {
  // .el-table td {
  //   border-bottom: 1px solid #f8f8f8;
  // }
  .el-table__empty-block {
    .el-table__empty-text {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
    }
  }

  .el-table__fixed-body-wrapper {
    height: calc(100% - 49px) !important;
  }

  .el-table__fixed,
  .el-table__fixed-right {
    border-bottom: 1px solid transparent;
  }
  tr > th > div {
    display: flex !important;
    align-items: center !important;
  }
}
</style>
