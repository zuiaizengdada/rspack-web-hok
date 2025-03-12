<template>
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
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-input v-model.trim="search.text.value" clearable placeholder="请输入" class="input-with-select" size="small" @clear="init()">
            <el-select slot="prepend" v-model="search.text.label" class="w-120" placeholder="请选择">
              <el-option label="corpid" value="corpId" />
              <el-option label="企业名称" value="corpName" />
            </el-select>
          </el-input>
          <el-button class="m-l-10" size="small" type="primary" @click="getList">搜索</el-button>
        </div>
      </div>
      <div slot="headerRight">
        <el-button type="primary" size="small" @click="clickAddCorp">添加企业</el-button>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="table_edit(row)">编辑</el-button>
      </div>
      <div slot="createTime" slot-scope="{ row }">
        {{ row.createTime | filterDate }}
      </div>
      <div slot="updateTime" slot-scope="{ row }">
        {{ row.updateTime | filterDate }}
      </div>
      <div slot="corpSecret" slot-scope="{ row }">
        {{ row.corpSecret.replace(/^(\S{5})\S*(\S{5})$/, '$1...$2') }}
      </div>
      <div slot="footer" />
    </MPageLayout>

    <!-- 新增企业/编辑企业弹框 -->
    <AppDialog
      v-model="dialogVisble.visible"
      :title="dialogVisble.title"
      width="700px"
      height="450px"
      @beforeClose="beforeClose"
      @success="send"
    >
      <div v-loading="dialogVisble.loading" style="height: 450px" class="dialogVisble overflowOuto">
        <el-form ref="ruleForm" :model="dialogVisble.form" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="企业名称" prop="corpName">
            <el-input v-model="dialogVisble.form.corpName" maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="corpId" prop="corpId">
            <el-input v-model="dialogVisble.form.corpId" maxlength="30" show-word-limit />
            <div class="tips">此为企业id，企业微信管理员登录，企业信息中查找企业id</div>
          </el-form-item>
          <el-form-item label="agentId" prop="agentId">
            <el-input v-model.number="dialogVisble.form.agentId" maxlength="10" show-word-limit @input="delNoNumber" />
            <div class="tips">此为应用id，需要在应用管理，自建应用创建应用</div>
          </el-form-item>
          <el-form-item label="corpSecret" prop="corpSecret">
            <el-input v-model="dialogVisble.form.corpSecret" :autosize="{ minRows: 3 }" type="textarea" maxlength="80" show-word-limit />
            <div class="tips">此为应用密匙，需要在应用管理，自建应用创建应用</div>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  GetCorpList,
  addCorp,
  updateCorp
} from '@/api/privateArea/CWChat'
export default {
  name: 'CWChat',
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      search: {
        text: { label: 'corpId', value: '' }
      },
      slotArr: ['headerRight', 'headerLeft', 'action', 'createTime', 'updateTime', 'footer', 'corpSecret'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'slot', visible: true },
          { prop: 'corpId', label: '企业(corpid)', type: 'text', visible: true },
          { prop: 'corpName', label: '企业名称', type: 'text', visible: true },
          { prop: 'corpSecret', label: 'corpSecret', type: 'slot', visible: true },
          { prop: 'createTime', label: '创建时间', type: 'slot', visible: true },
          { prop: 'updateTime', label: '更新时间', type: 'slot', visible: true },
          { prop: 'updateName', label: '更新人', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      dialogVisble: {
        visible: false,
        title: '添加企业',
        type: 1, // 1: 新增 2: 编辑
        loading: false,
        form: {
          agentId: '',
          corpId: '',
          corpName: '',
          corpSecret: ''
        }
      },
      rules: {
        corpName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        corpId: [
          { required: true, message: '请输入corpId', trigger: 'blur' }
        ],
        agentId: [
          { required: true, message: '请输入agentId', trigger: 'blur' }
        ],
        corpSecret: [
          { required: true, message: '请输入corpSecret', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    delNoNumber(e) {
      this.dialogVisble.form.agentId = e.replace(/\D/g, '')
    },
    init() {
      this.currentPage = 1
      this.config.total = 0
      this.config.tableData = []
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const param = {
        [this.search.text.label]: this.search.text.value,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      GetCorpList(param).then(res => {
        console.log(res, '获取的列表数据')
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击新增企业
    clickAddCorp() {
      console.log('新增企业')
      this.dialogVisble = {
        visible: true,
        title: '新增企业',
        type: 1,
        loading: false,
        form: {
          agentId: '',
          corpId: '',
          corpName: '',
          corpSecret: ''
        }
      }
    },
    // 点击编辑企业
    table_edit(row) {
      console.log(row, 'row')
      this.dialogVisble = {
        visible: true,
        title: '编辑企业',
        type: 2,
        loading: false,
        form: {
          agentId: row.agentId,
          corpId: row.corpId,
          corpName: row.corpName,
          corpSecret: row.corpSecret,
          id: row.id
        }
      }
    },
    beforeClose() {
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
    },
    // 点击弹框提交
    send() {
      console.log('点击提交')
      // this.dialogVisble.visible = false
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dialogVisble.type === 1) {
            this.addCorp()
          } else {
            this.editCorp()
          }
        } else {
          return false
        }
      })
    },
    // 新增
    addCorp() {
      this.dialogVisble.loading = true
      const params = {
        ...this.dialogVisble.form
      }
      addCorp(params).then(res => {
        this.beforeClose()
        this.dialogVisble.loading = false
        this.dialogVisble.visible = false
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.init()
      }).catch(() => {
        this.dialogVisble.loading = false
      })
    },
    // 编辑
    editCorp() {
      this.dialogVisble.loading = true
      const data = {
        ...this.dialogVisble.form
      }
      console.log(data, 'data')
      updateCorp(data).then(res => {
        this.beforeClose()
        this.dialogVisble.loading = false
        this.dialogVisble.visible = false
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.init()
      }).catch(() => {
        this.dialogVisble.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.table_wrap {
  height: 100%;
  background: #fff;
}
.dialogVisble {
  padding: 20px;
}
.tips {
  margin-top: 8px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
