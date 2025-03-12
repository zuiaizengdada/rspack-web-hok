<template>
  <div class="page-wrap">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-button-group class="m-l-20">
          <el-button type="info" plain size="small" icon="el-icon-search">搜索</el-button>
          <el-button size="small" plain icon="el-icon-refresh" @click="clear()">重置</el-button>
          <el-popover
            placement="bottom-end"
            width="150"
            trigger="click"
          >
            <el-button slot="reference" plain size="small" icon="el-icon-s-grid">表头</el-button>

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
        </el-button-group>
      </div>
    </div>

    <!--表格渲染-->
    <MPageLayout2
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
      if-index
    >
      <div slot="footer">
        <el-button @click="showAddDialog">新增</el-button>
      </div>
    </MPageLayout2>
  </div>
</template>

<script>

const defaultForm = { id: null, title: null, menuSort: 999, path: null, component: null, componentName: null, iFrame: false, roles: [], pid: null, icon: null, cache: false, hidden: false, type: 0, permission: null }
export default {
  name: 'Menu',
  components: {
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,

      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'title', label: '菜单标题', type: 'text', visible: true },
          { prop: 'iconName', label: '图标', type: 'text', visible: true },
          { prop: 'sort', label: '排序', type: 'text', visible: true },
          { prop: 'labelNum', label: '权限标识', type: 'text', visible: true },
          { prop: 'labelNum', label: '组件路劲', type: 'text', visible: true },
          { prop: 'labelNum', label: '外链', type: 'text', visible: true },
          { prop: 'labelNum', label: '缓存', type: 'text', visible: true },
          { prop: 'labelNum', label: '可见', type: 'text', visible: true },
          { prop: 'labelNum', label: '创建日期', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      rules: {},
      query: {
        blurry: '',
        createTime: ''
      },
      crud: {
        loading: false,
        data: []
      },
      formDialog: {
        title: '新增',
        visible: false
      },
      form: { id: null, title: null, menuSort: 999, path: null, component: null, componentName: null, iFrame: false, roles: [], pid: null, icon: null, cache: false, hidden: false, type: 0, permission: null }
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log(res)
      localStorage.setItem('menu_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    const tableColumns = localStorage.getItem('menu_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
  },
  methods: {
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('menu_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('menu_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击新增按钮打开新增弹框
    showAddDialog() {
      this.form = defaultForm
      this.formDialog = {
        title: '新增',
        visible: true
      }
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'title', label: '直播名称', type: 'text', width: '300', visible: true },
        { prop: 'type', label: '直播模式', type: 'text', visible: true },
        { prop: 'sum', label: '订阅量', type: 'text', visible: true },
        { prop: 'prince', label: '打赏金额', type: 'text', visible: true },
        { prop: 'state', label: '上架状态', type: 'text', visible: true },
        { prop: 'startTime', label: '直播开始时间', type: 'text', visible: true },
        { prop: 'linkGoods', label: '关联商品', type: 'text', visible: true },
        { prop: 'status', label: '直播状态', type: 'text', visible: true },
        { prop: 'createTime', label: '创建日期', type: 'text', visible: true },
        { prop: 'action', label: '操作', type: 'slot', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('menu_tableColumns', JSON.stringify(tableColumns))
    }
  }
}
</script>

<style lang='scss' scoped>
 ::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.head-container {
  padding: 20px 20px 0;
}
.page-wrap {
  background: #fff;
}
</style>
