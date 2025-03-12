<template>
  <div class="tablePage" @wheel.ctrl="onWheelZoom">
    <slot name="search" />
    <div class="tableBoxWarp" v-loading="loading">
      <!-- 自定义顶部区域 -->
      <div class="customHeader">
        <CustomTabelHeader on-type="dragend" :keys="keys" :columns="initColumns" @change="handleBanChange" />
      </div>
      <vxe-table ref="tableRef" :data="tableData" :table-columns="initColumns" round class="tableBox"
        :height="height || heightSize" show-overflow :row-config="{ isHover: true }" :scroll-y="{ enabled: true }"
        :tooltip-config="tooltipConfig" v-bind="$attrs" @checkbox-all="selectChangeEvent" v-on="$listeners"
        @checkbox-change="selectChangeEvent">
        <vxe-column type="checkbox" width="45" fixed="left" />
        <vxe-column v-if="isSeq" type="seq" width="60" title="排序" fixed="left" />
        <template v-for="(item, index) in initColumns">
          <template v-if="item.visible === true || item.visible === undefined">
            <vxe-column v-if="item.type === 'slot'" :key="item.prop + index" :min-width="item.minWidth"
              :title="item.label" v-bind="item">
              <template v-if="item.headerSlot" #header>
                <slot :name="`${item.prop + '-header'}`" />
              </template>
              <template slot-scope="scope">
                <slot :name="item.prop" :row="scope.row" />
              </template>
            </vxe-column>
            <vxe-column v-else-if="item.isPhone" :key="item.prop + index" :min-width="item.minWidth" :title="item.label"
              v-bind="item">
              <template slot-scope="{ row }">
                <tablePhoneItem
                  ref="tablePhoneRef"
                  v-model="row[item.prop]"
                  :phone-area-code="row.areaCodeKey? row[row.areaCodeKey] : row.phoneAreaCode"
                  :copy="item.copy"
                  :row-data="row"
                  :get-phone-query="item.getPhoneQuery"
                  :set-phone="item.setPhone"
                  :type="item.phoneType"
                  :phone-authority="item.phoneAuthority"
                />
              </template>
            </vxe-column>
            <vxe-column v-else-if="item.isEmail" :key="index" v-bind="item" :title="item.label">
              <template slot-scope="{ row }">
                <tableEmailItem v-model="row[item.prop]" :copy="item.copy" :row-data="row" :user-key="item.userKey"
                  :set-email="item.setEmail" :type="item.emailType" :email-authority="item.emailAuthority" />
              </template>
            </vxe-column>
            <vxe-column v-else-if="item.slotFn" :key="item.prop + index" :title="item.label" v-bind="item"
              :min-width="item.minWidth">
              <template slot-scope="{ row }">
                {{ item.slotFn(row) }}
              </template>
            </vxe-column>
            <vxe-column v-else-if="item['show-overflow-tooltip']" :key="item.prop + index" :title="item.label"
              v-bind="item" :min-width="item.minWidth" />
            <vxe-column v-else :key="item.prop + index" v-bind="item" :min-width="item.minWidth" :title="item.label"
              :field="item.prop" :sortable="item.sortable || false">
              <template slot-scope="scope">
                <MBaseTableItem :item="item" :render-data="scope.row" />
              </template>
            </vxe-column>
          </template>
        </template>
      </vxe-table>
    </div>
    <!-- 底部,操作区,分页区 -->
    <div class="page_footer">
      <slot name="footer" />
      <el-pagination v-if="!hidePagination" :current-page="currentPage" :page-sizes="pageSizes" :page-size="pageSize"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
      <slot name="footerRight" />
    </div>
  </div>
</template>
<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import CustomTabelHeader from '@/components/CustomTabelHeader'
import { setColumns } from '@/utils/tableUtils'
import { mapGetters } from 'vuex'
export default {
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
    loading: {
      type: Boolean,
      default: false
    },
    isSeq: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 0
    },
    tooltipConfig: {
      type: Object,
      default: () => { }
    },
    hidePagination: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    }
  },
  data: () => ({
    heightSize: 400,
    initColumns: [],
    observer: null
  }),
  computed: {
    ...mapGetters(['tableColumnsMap'])
  },
  created() {
    this.setColumns(this.tableColumns, this.tableColumnsMap[this.keys])
  },
  activated() {
    this.setColumns(this.tableColumns, this.tableColumnsMap[this.keys])
  },
  mounted() {
    this.initTableHeight()
    this.onWheelZoom()
  },
  methods: {
    handleBanChange(dataList) {
      this.setColumns(this.tableColumns, dataList)
    },
    setColumns(colum, list) {
      if (!this.keys) {
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
      this.refreshColumn()
    },
    onWheelZoom() {
      // 监听filterTop变化
      this.$nextTick(() => {
        if (this.height) return
        const searChDom = document.querySelector('.filterTop')
        const observer = new ResizeObserver(() => {
          const offsetHeight = searChDom.offsetHeight + 290
          const innerHeight = window.innerHeight
          this.heightSize = innerHeight - offsetHeight
        })
        observer.observe(searChDom)
      })
    },
    initTableHeight() {
      this.$nextTick(() => {
        if (this.height) return
        const searChDom = document.querySelector('.filterTop')
        const offsetHeight = searChDom.offsetHeight + 310
        const innerHeight = window.innerHeight
        this.heightSize = innerHeight - offsetHeight
      })
    },
    // 对表格重新布局
    doLayout() {
      // this.$refs.tableRef.resetColumn()
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    refreshColumn() {
      this.$nextTick(() => {
        this.$refs.tableRef && this.$refs.tableRef.refreshColumn()
        // if (this.$refs.tablePhoneRef?.length) {
        //   this.$refs.tablePhoneRef.forEach(item => {
        //     item.refreshData()
        //   })
        // }
      })
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    selectChangeEvent({ checked }) {
      const $table = this.$refs.tableRef
      if ($table) {
        const records = $table.getCheckboxRecords()
        this.$emit('handleSelectionChange', records || [])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tablePage::v-deep {
  height: 100%;
  display: flex;
  flex-direction: column;

  .vxe-table--body-wrapper::-webkit-scrollbar {
    height: 10px;
  }

  .page_footer {
    padding: 0 20px;
    height: 50px;
    // background: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 1px solid #d8dce5;
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}

.tableBoxWarp {
  position: relative;

  .customHeader {
    position: absolute;
    top: 3px;
    right: 0;
    z-index: 33;
    height: 20px;
    justify-content: space-between;
  }
}
</style>
