<template>
  <div class="page_wrap_promoter">
    <div class="table_wrap">
      <!--表格渲染-->
      <MPageLayout
        ref="MPageLayout"
        border
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        checkbox
        @size-change="handleListSizeChange"
        @current-change="handleListCurrentChange"
        @handleSelectionChange="handleListSelectionChange"
      >
        <div slot="headerLeft">
          <div class="fl">
            <el-input v-model="search.text.value" placeholder="请输入" class="input-with-select" size="small">
              <el-select slot="prepend" v-model="search.text.label" class="w-120" placeholder="请选择">
                <el-option label="推广员姓名" :value="1" />
                <el-option label="推广员昵称" :value="2" />
                <el-option label="推广员码" :value="3" />
                <el-option label="推广员手机号" :value="4" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <!-- <el-input v-model="search" placeholder="请输入商品名称" clearable size="small" @keyup.enter.native="getList" @clear="getList" /> -->
            <el-button class="m-l-10" size="small" @click="getList">搜索</el-button>
          </div>
        </div>
        <div slot="headerRight">
          <el-popover
            placement="bottom-end"
            width="150"
            trigger="click"
          >
            <el-button slot="reference" type="text" size="small">自定义表头</el-button>

            <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in config.tableColumns"
              :key="item.label"
              v-model="item.visible"
              v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
              @change="handleCheckedTableColumnsChange(item)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
          <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button>
          <el-button type="primary" size="small">添加商品</el-button>
        </div>
        <div slot="action" slot-scope="{ row }">
          <el-button v-if="!row.isEdit" type="text" @click="table_edit(row)">编辑</el-button>
          <el-button v-if="row.isEdit" type="text" @click="table_save(row)">保存</el-button>
          <el-button v-if="row.isEdit" type="text" @click="table_cancel(row)">取消</el-button>
          <el-button v-if="!row.isEdit" type="text">移除</el-button>
        </div>
        <div slot="goodsName" slot-scope="{ row }">
          <span>{{ row.goodsName }}</span>
        </div>
        <div slot="price">
          商品价格
        </div>
        <div slot="type">
          商品类型
        </div>
        <div slot="sort" slot-scope="{ row }">
          <el-input-number v-if="row.isEdit" v-model="row._sort" :step="1" step-strictly :min="0" />
          <span v-else>{{ row.sort }}</span>
        </div>
        <div slot="commission" slot-scope="{ row }">
          <template v-if="row.isEdit">
            <el-input-number v-model="row._commission" :max="100" :min="0" />
            <span>%</span>
          </template>
          <span v-else>{{ row.commission }}%</span>
        </div>
        <div slot="footer">
          <el-dropdown type="primary" size="small" :disabled="multipleSelection.length === 0">
            <el-button type="primary" size="small">
              批量审核<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>审核通过</el-dropdown-item>
              <el-dropdown-item>审核失败</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="danger" size="small" :disabled="multipleSelection.length === 0">批量审核</el-button> -->
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
export default {
  nmae: 'Promoter',
  components: {
  },
  data() {
    return {
      loading: false,
      search: {
        text: { label: 1, value: '' },
        time: ''
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'goodsName', 'price', 'type', 'sort', 'commission'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'text', visible: true },
          { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
          { prop: 'price', label: '推广员', type: 'text', visible: true },
          { prop: 'type', label: '审核状态', type: 'text', visible: true },
          { prop: 'sort', label: '姓名', type: 'text', visible: true },
          { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
          { prop: 'sort', label: '累计用户', type: 'text', visible: true },
          { prop: 'sort', label: '状态', type: 'text', visible: true },
          { prop: 'commission', label: '加入时间', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: []
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log(res)
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  methods: {
    // 获取列表数据
    getList() {

    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'text', visible: true },
        { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
        { prop: 'price', label: '推广员', type: 'text', visible: true },
        { prop: 'type', label: '审核状态', type: 'text', visible: true },
        { prop: 'sort', label: '姓名', type: 'text', visible: true },
        { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
        { prop: 'sort', label: '累计用户', type: 'text', visible: true },
        { prop: 'sort', label: '状态', type: 'text', visible: true },
        { prop: 'commission', label: '加入时间', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('promoter_tableColumns', JSON.stringify(tableColumns))
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
    },
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap_promoter {
  height: 100%;
  min-width: 1000px;
  // background: #fff;
  .dataOverView {
    height: 200px;
    background: #fff;
  }
  .table_wrap {
    margin-top: 10px;
    height: calc(100% - 210px);
    background: #fff;
  }
}
</style>
