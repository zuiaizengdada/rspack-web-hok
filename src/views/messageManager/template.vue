<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
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
      <div slot="headerLeft">
        <!--工具栏-->
        <div class="head-container">
          <div class="header-box">
            <!-- 搜索 -->
            <div class="header-item">
              <el-select
                v-model="query.channelId"
                placeholder="请选择通道"
                clearable
              >
                <el-option label="短信" :value="1" />
                <el-option label="手机推送" :value="2" />
                <el-option label="站内信" :value="3" />
                <el-option label="语音消息" :value="4" />
              </el-select>
            </div>
            <div class="header-item">
              <el-select
                v-model="selectVal"
                placeholder="请选择模板名称"
                @change="getSelectTpl($event)"
              >
                <el-option label="模板名称" value="name" />
                <el-option label="模板内容" value="content" />
              </el-select>
            </div>
            <div class="header-item">
              <el-input
                v-model="searchVal"
                clearable
                placeholder="请输入搜索关键词"
                style="width: 200px"
                class="filter-item"
                @keyup.enter.native="onClickSearch"
                @clear="onClickClearIn"
              />
            </div>
            <el-button type="primary" @click="onClickSearch">搜索</el-button>
            <el-button-group class="m-l-20">
              <!-- <el-button type="primary" @click="onClickSearch">搜索</el-button> -->
              <!-- <el-button size="small" plain icon="el-icon-refresh" @click="clear()">重置</el-button> -->
              <el-popover placement="bottom-end" width="150" trigger="click">
                <!-- <el-button slot="reference" plain size="small" icon="el-icon-s-grid">表头</el-button> -->

                <el-checkbox
                  v-model="allColumnsSelected"
                  :indeterminate="allColumnsSelectedIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  v-for="item in config.tableColumns"
                  :key="item.label"
                  v-model="item.visible"
                  v-dragging="{
                    item: item,
                    list: config.tableColumns,
                    group: 'item'
                  }"
                  @change="handleCheckedTableColumnsChange(item)"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-popover>
            </el-button-group>
          </div>
        </div>
      </div>
      <div slot="action" slot-scope="scope">
        <el-button
          type="text"
          @click="openModel('测试', scope)"
        >测试</el-button>
      </div>
      <div slot="footer">
        <el-button
          v-permission="['system:template:add', permsList]"
          @click="openModel('新增', '')"
        >新增</el-button>
        <el-button
          v-if="delStatus"
          v-permission="['system:template:remove', permsList]"
          @click="onClickDel"
        >删除</el-button>
      </div>
    </MPageLayout>
    <!-- 弹框层 -->
    <!-- 新建标签弹框层 -->
    <div v-if="modal.visible">
      <AppDialog
        v-model="modal.visible"
        :title="modal.title"
        width="700px"
        height="100%"
        :btn-footer="false"
      >
        <div v-loading="modal.loading" class="choose_resource m-t-20 p-10">
          <el-form ref="form" :model="form" label-width="130px" :rules="rules">
            <template v-if="modal.title === '新增'">
              <el-form-item label="模版名称" prop="name">
                <el-input v-model="form.name" class="input-width" />
              </el-form-item>
              <el-form-item label="通道" prop="channelId">
                <el-select v-model="form.channelId" placeholder="请选择">
                  <el-option label="短信" :value="1" />
                  <el-option label="手机推送" :value="2" />
                  <el-option label="站内信" :value="3" />
                  <el-option label="语音消息" :value="4" />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.channelId == 1"
                label="渠道"
                prop="channelProvider"
              >
                <el-select
                  v-model="form.channelProvider"
                  placeholder="请选择渠道"
                >
                  <el-option label="阿里云" :value="1" />
                  <el-option label="客窗" :value="2" />
                </el-select>
              </el-form-item>
              <el-form-item label="第三方ID或编码">
                <el-input v-model="form.id" class="input-width" />
              </el-form-item>
              <el-form-item label="基础内容" prop="content">
                <el-input v-model="form.content" class="input-width" />
                <span class="toast-txt">根据内容生成语音</span>
              </el-form-item>
              <el-form-item label="场景">
                <el-input v-model="form.usageDes" class="input-width" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" class="input-width" />
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="手机号/账号" prop="phone">
                <el-input v-model="form.phone" class="input-width" />
              </el-form-item>
              <el-form-item label="模板参数填写" />
              <el-form-item
                v-for="(e, index) in strArr"
                :key="index"
                :label="'${' + e + '}'"
                :prop="e"
              >
                <el-input v-model="form[e]" class="input-width" />
              </el-form-item>
            </template>
          </el-form>
        </div>

        <div slot="footer" class="p-20 choose_footer">
          <el-button type="primary" @click="sendSuccess()">提交</el-button>
          <el-button @click="closeModal()">取消</el-button>
        </div>
      </AppDialog>
    </div>
  </div>
</template>

<script>
import {
  messageTplList,
  addTpl,
  deleteTpl,
  testTpl
} from '@/api/messageManagement/messageTpl'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'MessageTemplate',
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      delStatus: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'id', label: 'ID', type: 'text', visible: true },
          { prop: 'name', label: '模板名称', type: 'text', visible: true },
          { prop: 'channelId_txt', label: '通道', type: 'text', visible: true },
          { prop: 'content', label: '基础内容', type: 'text', visible: true },
          { prop: 'usageDes', label: '场景', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      rules: {
        name: [
          { required: true, message: '模板名称不能为空', trigger: 'blur' }
        ],
        channelId: [{ required: true, message: '请选择通道', trigger: 'blur' }],
        content: [
          { required: true, message: '基础内容不能为空', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        channelProvider: [
          { required: true, message: '渠道不能为空', trigger: 'change' }
        ]
      },
      query: {
        // 搜索对象
        channelId: '', // 通道'
        name: '',
        id: '',
        content: '',
        baseInfo: '',
        remarks: '',
        usageDes: '',
        url: ''
      },
      crud: {
        loading: false,
        data: []
      },
      formDialog: {
        title: '新增',
        visible: false
      },
      selectVal: 'name',
      searchVal: '',
      form: {
        channelId: '',
        id: '',
        channelProvider: '',
        content: '',
        baseInfo: '',
        remark: '',
        usageDes: '',
        url: '',
        phone: ''
      },
      // 弹框属性
      modal: {
        title: '答复',
        visible: false,
        loading: false
      },
      ids: [],
      selectId: '',
      strArr: '',
      permsList: this.$route.meta.permsList || []
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
    },
    ids(newValue, oldValue) {
      console.log(newValue)
      newValue.length ? (this.delStatus = true) : (this.delStatus = false)
    },
    modal(newValue, oldValue) {
      console.log(newValue)
    },
    searchVal(newValue, oldValue) {
      console.log(newValue)
    }
  },
  mounted() {
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('msg_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
  },
  created() {
    this.getList()
    // const tableColumns = localStorage.getItem('msg_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
  },
  methods: {
    // 获取列表
    getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      const obj = this.query
      for (const i in obj) {
        params[i] = obj[i]
      }
      messageTplList(params)
        .then(res => {
          // console.log('列表请求--->:',res)
          this.loading = false
          res.data.records.map(v => {
            if (v.channelId === 1) {
              v['channelId_txt'] = '短信'
            } else if (v.channelId === 2) {
              v['channelId_txt'] = '手机推送'
            } else if (v.channelId === 3) {
              v['channelId_txt'] = '站内信'
            } else if (v.channelId === 4) {
              v['channelId_txt'] = '语音信息'
            } else {
              v['channelId_txt'] = '未知'
            }
            // v.messageImages ? (v.messageImages = v.messageImages.split(',')) : (v.messageImages = [])
          })
          this.config.tableData = res.data.records
          // console.log(this.config.tableData)
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 选择下拉
    getSelectTpl(e) {
      this.selectVal = e
    },
    onClickClearIn() {
      console.log('searchVal', this.searchVal)
      this.searchVal = ''
    },
    // 搜索
    onClickSearch() {
      const selectVal = this.selectVal
      const searchVal = this.searchVal
      const channelId = this.query.channelId
      console.log('searchVal', searchVal)
      if (selectVal === 'name') {
        this.query = {
          // 搜索对象
          channelId, // 通道'
          name: searchVal
        }
      } else {
        this.query = {
          // 搜索对象
          channelId, // 通道'
          content: searchVal
        }
      }
      // 搜索逻辑 回到一页
      this.getList()
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'msg_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'msg_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        {
          prop: 'title',
          label: '直播名称',
          type: 'text',
          width: '300',
          visible: true
        },
        { prop: 'type', label: '直播模式', type: 'text', visible: true },
        { prop: 'sum', label: '订阅量', type: 'text', visible: true },
        { prop: 'prince', label: '打赏金额', type: 'text', visible: true },
        { prop: 'state', label: '上架状态', type: 'text', visible: true },
        {
          prop: 'startTime',
          label: '直播开始时间',
          type: 'text',
          visible: true
        },
        { prop: 'linkGoods', label: '关联商品', type: 'text', visible: true },
        { prop: 'status', label: '直播状态', type: 'text', visible: true },
        { prop: 'createTime', label: '创建日期', type: 'text', visible: true },
        { prop: 'action', label: '操作', type: 'slot', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('msg_tableColumns', JSON.stringify(tableColumns))
    },
    // 列表组件
    handleSizeChange(e) {
      this.config.pageSize = e
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(e) {
      this.config.currentPage = e
      this.getList()
    },
    handleSelectionChange(e) {
      console.log(e)
      const ids = []
      e.map(item => {
        ids.push(item.id)
      })
      this.ids = ids
    },
    onClickDel() {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          this.deleteTplApi({ ids: this.ids })
        }
      })
    },
    // 批量删除
    deleteTplApi(params) {
      this.loading = true
      deleteTpl(params)
        .then(res => {
          this.loading = false
          this.$message.success('删除成功')
          this.ids = []
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 打开新增
    openModel(title, item) {
      console.log('title', title)
      const that = this
      this.modal = {
        title,
        visible: false
      }
      this.initForm() // 初始化form
      if (title !== '新增') {
        if (item) {
          this.selectId = item.row.id
          const strArr = this.autoTestConten(item.row.content)
          this.strArr = strArr
          strArr.forEach(e => {
            that.$set(that.form, e, '')
            that.$set(that.rules, e, [
              { required: true, message: `${e}参数不能为空`, trigger: 'blur' }
            ])
          })
        }
      }
      this.modal = {
        title,
        visible: true
      }
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      // this.$refs.form.resetField()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
        this.modal.visible = false
      })
    },
    // 点击答复弹框提交按钮
    sendSuccess() {
      const that = this
      const strArr = this.strArr
      if (this.modal.title === '新增') {
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = {
              thirdPartyCode: that.form.id,
              channelId: that.form.channelId,
              channelProvider: that.form.channelProvider,
              content: that.form.content,
              name: that.form.name,
              remark: that.form.remark,
              usageDes: that.form.usageDes,
              title: ''
            }
            that.addTplApi(data)
          } else {
            return false
          }
        })
        // if (this.form.channelId && this.form.content && this.form.name) {

        // } else {
        //   this.$message.error('必填不能为空')
        // }
      } else {
        console.log('this.form', this.form)
        if (this.objectValueAllEmpty(this.form)) {
          const paramsMap = {}
          strArr.forEach(e => {
            console.log('e', e)
            paramsMap[e] = that.form[e]
          })
          const data = {
            templateId: that.selectId,
            phoneNumbers: that.form.phone,
            paramsMap
          }
          this.testTplApi(data)
        } else {
          this.$message.error('必填不能为空')
        }
      }
    },
    // 新增消息模板
    addTplApi(params) {
      this.loading = true
      addTpl(params)
        .then(res => {
          this.loading = false
          this.$message.success('添加成功')
          this.$refs.form.clearValidate()
          this.modal.visible = false
          this.getList()
          this.form = {
            channelId: '',
            id: '',
            content: '',
            baseInfo: '',
            remark: '',
            usageDes: '',
            url: '',
            phone: '',
            platformName: '',
            m_name: ''
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 测试接口
    testTplApi(params) {
      this.loading = true
      testTpl(params)
        .then(res => {
          this.loading = false
          this.$message.success('发送成功')
          this.$refs.form.clearValidate()
          this.modal.visible = false
          this.getList()
          this.formTest = {
            phone: ''
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取${}内容
    autoTestConten(str) {
      const reg = /\$\{(.+?)\}/
      const reg_g = /\$\{(.+?)\}/g
      const result = str.match(reg_g)
      if (result) {
        const list = result.reduce((pre, item) => {
          pre.push(item.match(reg)[1])
          return pre
        }, [])
        return list
      }
      return []
    },
    /**
     * 判断对象的值是不是全为空
     */
    objectValueAllEmpty(obj) {
      for (const key in obj) {
        if (obj[key] !== null && obj[key] === '') return false
      }
      return true
    },
    initForm() {
      console.log('this.modal.title', this.modal.title)
      if (this.modal.title === '新增') {
        console.log('执行')
        this.rules = {
          name: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          channelId: [
            { required: true, message: '请选择通道', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '基础内容不能为空', trigger: 'blur' }
          ],
          channelProvider: [
            { required: true, message: '渠道不能为空', trigger: 'change' }
          ]
        }
        this.form = {
          channelId: '',
          id: '',
          channelProvider: '',
          content: '',
          baseInfo: '',
          remark: '',
          usageDes: '',
          url: ''
        }
      } else {
        this.rules = {
          phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
        }
        this.form = {
          phone: ''
        }
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
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
  .header-box {
    display: flex;
    .header-item {
      margin-right: 10px;
    }
  }
}
.page-wrap {
  @include responsive-height(20px);
  background: #fff;
}
::v-deep .el-form-item__label {
  width: 130px !important;
}
.input-width {
  width: 400px;
}
.choose_footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast-txt {
  white-space: nowrap;
  color: #909399;
  font-weight: 400;
  margin-left: 10px;
}
</style>
