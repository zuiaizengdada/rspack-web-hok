<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <el-select v-model="query.channelId" placeholder="请选择通道" clearable size="small">
          <el-option v-for="(item, index) in channelIdType" :key="index" :label="item" :value="+index" />
        </el-select>
        <el-input
          v-model="query.value"
          clearable
          size="small"
          style="width: 300px"
          placeholder="请输入"
          class="filter-input"
          @keyup.enter.native="getList"
          @clear="getList"
        >
          <el-select slot="prepend" v-model="active" size="small">
            <el-option v-for="(item, index) in options" :key="index" :label="item" :value="index" />
          </el-select>
        </el-input>
        <el-button
          type="primary"
          class="filter-input"
          size="small"
          icon="el-icon-search"
          @click="getList"
        >搜索
        </el-button>
      </div>
    </div>

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
      if-index
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="footer">
        <el-button v-permission="['system:msg:remove', permsList]" @click="handleDel">批量删除</el-button>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
const defaultForm = {
  id: null,
  title: null,
  menuSort: 999,
  path: null,
  component: null,
  componentName: null,
  iFrame: false,
  roles: [],
  pid: null,
  icon: null,
  cache: false,
  hidden: false,
  type: 0,
  permission: null
}
import { msgQuery, msgDel } from '@/api/msg/msg'
import { parseTime } from '@/utils/index'
const channelIdType = {
  1: '短信',
  2: '手机推送',
  3: '站内信',
  4: '语音消息'
}
const options = {
  name: '消息名称',
  content: '消息内容'
}
export default {
  name: 'MessageLog',
  components: {},
  data() {
    return {
      channelIdType,
      options,
      active: 'name',
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'id', label: 'ID', type: 'text', visible: true },
          {
            prop: 'content',
            label: '消息内容',
            type: 'text',
            width: '500',
            visible: true
          },
          {
            prop: 'channelId',
            label: '通道',
            type: 'text',
            visible: true,
            slotFn: (row) => channelIdType[row.channelId]
          },
          { prop: 'phone', label: '发送用户', type: 'text', visible: true },
          { prop: 'phone', label: '接收手机', type: 'text', visible: true },
          {
            prop: 'sendTime',
            label: '发送时间',
            visible: true,
            width: '200',
            slotFn: (row) => parseTime(row.sendTime)
          }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      rules: {},
      query: {
        // 搜索对象
        channelId: '', // 通道
        value: '',
        name: '',
        content: ''
      },
      multipleSelection: [],
      crud: {
        loading: false,
        data: []
      },
      formDialog: {
        title: '新增',
        visible: false
      },
      form: {
        id: null,
        title: null,
        menuSort: 999,
        path: null,
        component: null,
        componentName: null,
        iFrame: false,
        roles: [],
        pid: null,
        icon: null,
        cache: false,
        hidden: false,
        type: 0,
        permission: null
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter((v) => v.visible)
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
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    handleDel() {
      if (!this.multipleSelection.length) {
        this.$notify.warning({
          title: '提示',
          message: '请勾选后再进行操作'
        })
        return
      }
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}条消息记录吗？`,
        success: () => {
          this.loading = true
          const ids = this.multipleSelection.map((i) => i.id)
          msgDel({ ids })
            .then((res) => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    async getList() {
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        ...this.query
      }
      params[this.active] = this.query.value
      params.value = undefined
      const { data } = await msgQuery(params)
      this.config.tableData = data.records
      this.config.total = data.total
      this.loading = false
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
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('msg_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map((v) => {
        v.visible = true
      })
      localStorage.setItem('msg_tableColumns', JSON.stringify(this.config.tableColumns))
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
        { prop: 'id', label: 'ID', type: 'text', visible: true },
        {
          prop: 'content',
          label: '消息内容',
          type: 'text',
          width: '500',
          visible: true
        },
        {
          prop: 'channelId',
          label: '通道',
          type: 'text',
          visible: true,
          slotFn: (row) => channelIdType[row.channelId]
        },
        { prop: 'phone', label: '发送用户', type: 'text', visible: true },
        { prop: 'phone', label: '接收手机', type: 'text', visible: true },
        {
          prop: 'sendTime',
          label: '发送时间',
          visible: true,
          width: '220',
          slotFn: (row) => parseTime(row.sendTime)
        }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('msg_tableColumns', JSON.stringify(tableColumns))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.el-input.filter-input .el-select {
  width: 100px;
}
.head-container {
  padding: 20px 20px 0;
}
.filter-input {
  margin-left: 10px;
}
.page-wrap {
  background: #fff;
  height: calc(100vh - 160px);
  .PageLayout {
    background: #fff;
  }
}
</style>
