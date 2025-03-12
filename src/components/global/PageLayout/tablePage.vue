<template>
  <div class="tablePage">
    <!-- 头部,搜索区,按钮区 -->
    <div class="page_header">
      <div class="page_header_search">
        <slot name="search" />
      </div>
      <div class="page_header_action">
        <slot name="headerLeft" />
        <slot name="headerRight" />
      </div>
    </div>
    <!-- 内容区,表格区 -->
    <div id="page_content" class="page_content">
      <MTable
        ref="mTable"
        :table-data="tableData"
        :checkbox="checkbox"
        :selectable="selectable"
        :border="border"
        :if-index="ifIndex"
        :loading="loading"
        :table-columns="tableColumns"
        :row-key="rowKey"
        :tree-mode="treeMode"
        :slot-arr="slotArr"
        :keys="keys"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :default-sort="defaultSort"
        :row-class-name="rowClassName"
        :empty-text="
          emptySlot && tableData.length === 0 ? emptySlotText : '暂无数据'
        "
        :reserve-selection="reserveSelection"
        :table-index-width="tableIndexWidth"
        v-bind="$attrs"
        @selection-change="handleSelectionChange"
        @select-all="handleSelectionAllChange"
        v-on="$listeners"
      >
        <!-- <slot name='action'></slot> -->
        <!-- <template slot='action' slot-scope="scope">
            <slot name="action" :row="scope.row"></slot>
        </template> -->
        <template
          v-for="(item, i) in slotArr"
          :slot="item"
          slot-scope="text, record, index"
        >
          <span :key="`${item}-${i}`">
            <slot
              :name="item"
              :row="text.row"
              :record="record"
              :index="index"
            />
          </span>
        </template>
      </MTable>
    </div>

    <!-- 底部,操作区,分页区 -->
    <div v-if="!hidePagination" class="page_footer">
      <slot name="footer" />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <slot name="footerRight" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePage',
  props: [
    'keys',
    // eslint-disable-next-line vue/require-prop-types
    'emptySlot',
    // eslint-disable-next-line vue/require-prop-types
    'emptySlotText',
    // eslint-disable-next-line vue/require-prop-types
    'currentPage',
    // eslint-disable-next-line vue/require-prop-types
    'pageSizes',
    // eslint-disable-next-line vue/require-prop-types
    'pageSize',
    // eslint-disable-next-line vue/require-prop-types
    'total',
    // eslint-disable-next-line vue/require-prop-types
    'slotArr',
    // eslint-disable-next-line vue/require-prop-types
    'layout',
    // eslint-disable-next-line vue/require-prop-types
    'tableData',
    // eslint-disable-next-line vue/require-prop-types
    'tableColumns',
    // eslint-disable-next-line vue/require-prop-types
    'loading',
    // eslint-disable-next-line vue/require-prop-types
    'checkbox',
    // eslint-disable-next-line vue/require-prop-types
    'selectable',
    // eslint-disable-next-line vue/require-prop-types
    'ifIndex',
    // eslint-disable-next-line vue/require-prop-types
    'border',
    // eslint-disable-next-line vue/require-prop-types
    'rowKey',
    // eslint-disable-next-line vue/require-prop-types
    'treeMode',
    // eslint-disable-next-line vue/require-prop-types
    'hidePagination',
    // eslint-disable-next-line vue/require-prop-types
    'reserveSelection',
    // eslint-disable-next-line vue/require-prop-types
    'pagerCount',
    // eslint-disable-next-line vue/require-prop-types
    'showSummary',
    // eslint-disable-next-line vue/require-prop-types
    'summaryMethod',
    // eslint-disable-next-line vue/require-prop-types
    'rowClassName',
    // eslint-disable-next-line vue/require-prop-types
    'defaultSort',
    // eslint-disable-next-line vue/require-prop-types
    'tableIndexWidth'
  ],
  methods: {
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    },
    handleSelectionChange(val) {
      this.$listeners.handleSelectionChange(val)
    },
    handleSelectionAllChange(val) {
      this.$listeners.handleSelectionAllChange(val)
    },
    // 表格选中
    handletoggleSelectionAll() {
      this.$refs.mTable.handletoggleSelectionAll()
    },
    // 表格取消选中
    clearSelection() {
      this.$refs.mTable.clearSelection()
    },
    doLayout() {
      this.$refs.mTable.doLayout()
    },
    clearSort() {
      this.$refs.mTable.clearSort()
    }
  }
}
</script>

<style lang="scss" scoped>
.tablePage {
  display: flex;
  flex-direction: column;
  flex: 1;

  .page_header {
    padding: 10px 20px;
    min-height: 20px;
    // height: 40px;
    // background: pink;
    .page_header_action {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .page_content {
    flex: 1;
    padding-bottom: 10px;
    overflow: auto;
    // background: LightBlue;
  }
  .page_footer {
    padding: 0 20px;
    height: 50px;
    // background: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border-bottom: 1px solid #d8dce5;
  }
}
.table-empty-text {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 16px;
  text-align: center;
  color: #5e7382;
}
</style>
