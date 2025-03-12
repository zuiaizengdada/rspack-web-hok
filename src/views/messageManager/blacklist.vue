<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <el-input
          v-model="query.value"
          clearable
          size="small"
          style="width: 300px"
          placeholder="请输入"
          class="filter-input"
          @clear="getList"
          @keyup.enter.native="getList"
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
        >搜索</el-button>
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
        <el-button v-permission="['system:blackwhite:add', permsList]" type="primary" @click="showAddDialog">新增</el-button>
        <el-button v-permission="['system:blackwhite:remove', permsList]" @click="handleDel">批量删除</el-button>
      </div>
    </MPageLayout>
    <modal v-if="formDialog.visible" width="500px" :type="2" :visible.sync="formDialog.visible">
      <el-form ref="form" :model="form" label-width="120px" label-position="left" :rules="rules">
        <el-form-item label="手机号码/账号" prop="account">
          <el-input v-model.trim="form.account" type="text" placeholder="请输入手机号码/账号" />
        </el-form-item>
        <el-form-item label="通道" prop="channelId">
          <el-select v-model="form.channelId" style="width: 100%" placeholder="请选择通道">
            <el-option v-for="(item, index) in channelIdType" :key="index" :label="item" :value="+index" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 100%" placeholder="请选择类型">
            <el-option v-for="(item, index) in type" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注内容" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" placeholder="请选择备注内容" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="formDialog.visible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </modal>
  </div>
</template>

<script>
import { blackwhiteQuery, blackwhiteSave, blackwhiteDel } from '@/api/msg/msg'
import { parseTime } from '@/utils/index'
import modal from '@/components/Modal/index'
const channelIdType = {
  1: '短信',
  2: '微信'
}
const type = {
  1: '黑名单',
  2: '白名单'
}
const options = {
  account: '手机号/账号'
}
export default {
  name: 'MessageLog',
  components: {
    modal
  },
  data() {
    var validateSale = (rule, value, callback) => {
      if (value.length !== 11) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }
    return {
      channelIdType,
      type,
      options,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      active: 'account',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      multipleSelection: [],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'id', label: 'ID', type: 'text', visible: true },
          {
            prop: 'account',
            label: '手机号码/账号',
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
          {
            prop: 'type',
            label: '类型',
            type: 'text',
            visible: true,
            slotFn: (row) => type[row.type]
          },
          { prop: 'remark', label: '备注内容', type: 'text', visible: true },
          {
            prop: 'createTime',
            label: '操作时间',
            visible: true,
            width: '200',
            slotFn: (row) => parseTime(row.createTime)
          },
          {
            prop: 'createName',
            label: '操作人',
            type: 'text',
            visible: true,
            width: '200'
          }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      query: {
        // 搜索对象
        value: '', // 通道
        account: ''
      },
      crud: {
        loading: false,
        data: []
      },
      formDialog: {
        title: '新增',
        visible: false
      },
      form: {
        account: '',
        channelId: null,
        type: null,
        remark: ''
      },
      rules: {
        account: [{ required: true, validator: validateSale, trigger: 'blur' }],
        channelId: [{ required: true, message: '请选择通道', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注内容', trigger: 'blur' }]
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
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { code } = await blackwhiteSave(this.form)
          if (code === 1) {
            this.$notify.success({
              title: '提示',
              message: '新增成功'
            })
          }
          this.formDialog.visible = false
          this.getList()
        }
      })
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
        tips: `确定删除这${this.multipleSelection.length}条数据吗？`,
        success: () => {
          this.loading = true
          const ids = this.multipleSelection.map((i) => i.id)
          blackwhiteDel({ ids })
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
      const { data } = await blackwhiteQuery(params)
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
          prop: 'account',
          label: '手机号码/账号',
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
        {
          prop: 'type',
          label: '类型',
          type: 'text',
          visible: true,
          slotFn: (row) => type[row.type]
        },
        { prop: 'remark', label: '备注内容', type: 'text', visible: true },
        {
          prop: 'createTime',
          label: '操作时间',
          visible: true,
          width: '200',
          slotFn: (row) => parseTime(row.createTime)
        },
        { prop: 'createBy', label: '操作人', visible: true, width: '200' }
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
.head-container {
  padding: 20px 20px 0;
}
.el-input.filter-input .el-select {
  width: 120px;
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
