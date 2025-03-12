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
        :border="border"
        :if-index="ifIndex"
        :loading="loading"
        :table-columns="tableColumns"
        v-bind="$attrs"
        @selection-change="handleSelectionChange"
        v-on="$listeners"
      >
        <!-- <slot name='action'></slot> -->
        <!-- <template slot='action' slot-scope="scope">
            <slot name="action" :row="scope.row"></slot>
        </template> -->
        <template v-for="(item, i) in slotArr" :slot="item" slot-scope="text, record, index">
          <span :key="`${item}-${i}`">
            <slot :name="item" :row="text.row" :record="record" :index="index" />
          </span>
        </template>
      </MTable>
    </div>

    <!-- 底部,操作区,分页区 -->
    <div class="page_footer">
      <slot name="footer" />
      <el-pagination
        v-if="!hidePagination"
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
  name: 'TablePage2',
  props: [
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
    'ifIndex',
    // eslint-disable-next-line vue/require-prop-types
    'border',
    // eslint-disable-next-line vue/require-prop-types
    'hidePagination'
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
    }
  }
}
</script>

<style lang="scss" scoped>
.tablePage {
  display: flex;
  flex-direction: column;
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
    // flex: 1;
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
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}
</style>
