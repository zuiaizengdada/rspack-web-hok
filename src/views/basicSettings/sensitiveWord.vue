<template>
  <div class="sensitive-wrapper">
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :checkbox="true"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @handleSelectionChange="handleSelectionChange"
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-form :inline="true" :model="sensitiveForm" size="small" class="demo-form-inline">
            <el-form-item label="IP">
              <el-select
                v-model="sensitiveForm.teacherId"
                filterable
                clearable
                placeholder="请选择"
                class="w-200"
                @change="searchList"
              >
                <el-option
                  v-for="item in teacherArray"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="敏感词">
              <el-input v-model="sensitiveForm.content" clearable placeholder="请输入" @change="searchList" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchList">查询</el-button>
              <el-button @click="clearForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="headerRight" style="margin-top: -18px;">
        <el-button type="primary" size="small" @click="addCaseWords"><i class="el-icon-plus" />  新增敏感词</el-button>
        <el-button size="small" @click="toImportCaseWords">导入</el-button>
      </div>
      <!-- 操作 -->
      <div slot="action" slot-scope="scope">
        <el-button type="text" @click="toEdit(scope.row)">编辑</el-button>
        <el-button class="red-cls" type="text" @click="toDelete(scope.row)">删除</el-button>
      </div>
      <div slot="footer">
        <el-button
          type="danger"
          size="mini"
          :disabled="multipleSelection.length === 0"
          @click="batchDel"
        >批量删除</el-button>
      </div>
    </MPageLayout>
    <el-dialog class="insert-sen-word" :title="insertOrEdit" :visible.sync="dialogFormVisible" :close-on-click-modal="false" append-to-body>
      <el-form ref="caseWordForm" :rules="rules" label-width="80px" :model="caseWordForm">
        <el-form-item label="选择IP" prop="teacherId">
          <el-select
            v-model="caseWordForm.teacherId"
            filterable
            clearable
            placeholder="请选择"
            class="w-200"
          >
            <el-option
              v-for="item in teacherArray"
              :key="item.teacherId"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="insertOrEdit === '新增敏感词'" label="敏感词" prop="content">
          <el-input
            v-model="caseWordForm.caseKeyword"
            class="w-350"
            maxlength="20"
            :rows="2"
            type="textarea"
            show-word-limit
            placeholder="请输入敏感词"
            @change="addKeyWord"
            @keyup.enter.native="jtkey($event)"
          />
          <p class="tips-sp">注：输入一个敏感词后，按回车生成标签</p>
          <div v-if="caseWordForm.content.length > 0" class="tips-posi">
            <div class="bq-row">
              <span v-for="(item, index) in caseWordForm.content" :key="index" class="bq-row-span">
                {{ item }}
                <i class="el-icon-close" @click="deleteKeyword(item)" />
              </span>
            </div>
            <p class="show-nums"><em>{{ caseWordForm.content.length }}</em> /100</p>
          </div>
        </el-form-item>
        <el-form-item v-if="insertOrEdit === '编辑敏感词'" label="敏感词" prop="contentEdit">
          <el-input
            v-model="caseWordForm.contentEdit"
            class="w-350"
            maxlength="20"
            show-word-limit
            @change="addKeyWord"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('caseWordForm')">确定</el-button>
          <el-button @click="resetForm('caseWordForm')">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
    <uploadCaseWords ref="update" @loadDataUploadSuccess="searchList" />
  </div>
</template>

<script>
import uploadCaseWords from './components/uploadCaseWords.vue'
import { getSensitiveList, deleteCaseWord, batchDeleteCaseWord, insertCaseWords, editCaseWords } from '@/api/product/videoManager'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  components: {
    uploadCaseWords
  },
  data() {
    return {
      teacherArray: [],
      caseWordForm: {
        teacherId: '',
        content: [],
        contentEdit: '',
        caseKeyword: '',
        id: ''
      },
      dialogFormVisible: false,
      insertOrEdit: '新增敏感词',
      sensitiveForm: {
        teacherId: '',
        content: ''
      },
      loading: false,
      slotArr: ['headerLeft', 'headerRight', 'action', 'footer'],
      config: {
        tableData: [
        ],
        tableColumns: [
          { prop: 'teacherName', label: 'IP名称', type: 'text' },
          { prop: 'content', label: '敏感词', type: 'text' },
          { prop: 'createBy', label: '上传者', type: 'text' },
          { prop: 'createTime', label: '上传时间', width: 180, type: 'text' },
          { prop: 'action', label: '操作', width: 130, type: 'slot', disable: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: '',
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      rules: {
        teacherId: [
          { required: true, message: '请选择IP', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请填写符合格式的敏感词', trigger: 'blur' }
        ],
        contentEdit: [
          { required: true, message: '请填写符合格式的敏感词', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.teacherId !== undefined && this.$route.query.teacherId !== '' && this.$route.query.teacherId !== null) {
      this.sensitiveForm.teacherId = this.$route.query.teacherId
    }
    this.loadTearchList()
    this.getList()
  },
  activated() {
    if (this.$route.query.teacherId !== undefined && this.$route.query.teacherId !== '' && this.$route.query.teacherId !== null) {
      this.sensitiveForm.teacherId = this.$route.query.teacherId
    }
    this.loadTearchList()
    this.getList()
  },
  created() {
  },
  methods: {
    jtkey(e) {
      e.preventDefault()
      if (e.keyCode === 13) {
        this.caseWordForm.caseKeyword = this.caseWordForm.caseKeyword.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, '')
        this.addKeyWord()
      }
    },
    toImportCaseWords() {
      this.$refs.update.open()
    },
    addKeyWord() {
      console.log('dfsafsdfds:', this.caseWordForm.caseKeyword)
      const FloatRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (this.insertOrEdit === '新增敏感词') {
        if (!FloatRegex.test(this.caseWordForm.caseKeyword)) {
          this.$message.error('敏感词只能输入数字、字母和中文，不能包含空格和特殊字符串！')
          return
        }
        // this.caseWordForm.caseKeyword = this.caseWordForm.caseKeyword.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, '')
        if (this.caseWordForm.content.length < 100) {
          let isCf = false
          this.caseWordForm.content.some(item => {
            if (item === this.caseWordForm.caseKeyword.trim()) {
              isCf = true
            }
          })
          if (isCf) {
            this.$message.error('敏感词不能重复')
            return
          }
          this.caseWordForm.content.push(this.caseWordForm.caseKeyword.trim())
          this.caseWordForm.caseKeyword = ''
        } else {
          this.$message.error('敏感词添加不能超过100个')
          return false
        }
      } else if (this.insertOrEdit === '编辑敏感词') {
        if (!FloatRegex.test(this.caseWordForm.contentEdit)) {
          // this.$message.error('敏感词只能输入数字、字母和中文，不能包含空格和特殊字符串！')
        }
        // this.caseWordForm.contentEdit = this.caseWordForm.contentEdit.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, '')
      }
    },
    deleteKeyword(item) {
      var index = this.caseWordForm.content.indexOf(item)
      if (index !== -1) {
        this.caseWordForm.content.splice(index, 1)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.insertOrEdit === '新增敏感词') {
            const param = {
              teacherId: this.caseWordForm.teacherId,
              contents: this.caseWordForm.content
            }
            insertCaseWords(param).then(res => {
              if (res.success) {
                this.$message.success('新增敏感词成功!')
                this.dialogFormVisible = false
                this.getList()
                this.clearCaseWordForm()
              }
            })
          } else if (this.insertOrEdit === '编辑敏感词') {
            const FloatRegex = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
            if (!FloatRegex.test(this.caseWordForm.contentEdit)) {
              this.$message.error('敏感词只能输入数字、字母和中文，不能包含空格和特殊字符串！')
              return
            }
            const param = {
              teacherId: this.caseWordForm.teacherId,
              content: this.caseWordForm.contentEdit,
              id: this.caseWordForm.id
            }
            editCaseWords(param).then(res => {
              if (res.success) {
                this.$message.success('编辑敏感词成功!')
                this.dialogFormVisible = false
                this.getList()
                this.clearCaseWordForm()
              }
            })
          }
        } else {
          return false
        }
      })
    },
    clearCaseWordForm() {
      const that = this
      setTimeout(function() {
        that.caseWordForm.teacherId = ''
        that.caseWordForm.content = []
        that.caseWordForm.contentEdit = ''
        that.caseWordForm.caseKeyword = ''
        that.caseWordForm.id = ''
      }, 500)
    },
    resetForm(formName) {
      this.clearCaseWordForm()
      console.log('AAAAAAA:', this.caseWordForm)
      this.dialogFormVisible = false
    },
    loadTearchList() {
      const params = {
        name: ''
      }
      teacherQueryByName(params).then((res) => {
        if (res.success) {
          this.teacherArray = res.data
        }
      })
    },
    clearForm() {
      this.sensitiveForm.teacherId = ''
      this.sensitiveForm.content = ''
      this.config.currentPage = 1
      this.getList()
    },
    searchList() {
      this.config.currentPage = 1
      this.getList()
    },
    addCaseWords() {
      console.log('insert: ', this.caseWordForm)
      this.insertOrEdit = '新增敏感词'
      this.$nextTick(() => {
        if (this.$refs.caseWordForm) {
          this.$refs.caseWordForm.clearValidate()
        }
      })
      this.dialogFormVisible = true
    },
    toEdit(row) {
      this.insertOrEdit = '编辑敏感词'
      this.dialogFormVisible = true
      this.caseWordForm.teacherId = row.teacherId
      this.caseWordForm.contentEdit = row.content
      this.caseWordForm.content = []
      this.caseWordForm.id = row.id
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // 批量删除
    batchDel() {
      this.toDelete(this.multipleSelection)
    },
    // 判断是对象还是数组
    isObject(obj) {
      return Object.prototype.toString.call(obj) === '[object Object]'
    },
    toDelete(row) {
      let string = ''
      if (this.isObject(row)) {
        string = '确定要删除【' + row.content + '】关键词?'
      } else {
        string = '确定要删除【'
        row.forEach((item, index) => {
          if (index === row.length - 1) {
            string += item.content + '】'
          } else {
            string += item.content + '、'
          }
        })
        string += '关键词?'
      }
      this.$confirm(string, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async() => {
        let res = null
        if (this.isObject(row)) {
          res = await deleteCaseWord(row.id)
        } else {
          const ids = []
          row.forEach(item => {
            ids.push(item.id)
          })
          res = await batchDeleteCaseWord(ids)
        }
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        teacherId: this.sensitiveForm.teacherId,
        content: this.sensitiveForm.content,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      getSensitiveList(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.currentPage = res.data.pageIndex
          this.config.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.roleUserModel.size = val
      this.getRoleUserList()
    },
    handleCurrentChange(val) {
      this.roleUserModel.current = val
      this.getRoleUserList()
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.sensitive-wrapper {
  width: 100%;
  height: 100%;
  margin-top: 11px;
  border-radius: 10px;
  background: #fff;
  ::v-deep .my-table {
    margin: 0
  }
  .right-tools {
    float: right;
    margin-right: 0px;
  }
  .w-200 {
    width: 300px;
  }
  .w-350 {
    width: 350px;
  }

}

.tips-posi {
    position: relative;
    width: 500px;
    height: 250px;
    .bq-row {
      width: 500px;
      height: 250px;
      overflow-y: auto;
      padding: 10px 5px;
      padding-bottom: 15px;
      margin-top: 10px;
      border: 1px dashed #9f9f9f;
      .bq-row-span {
        padding: 5px 10px;
        background: #dae9ff;
        margin-left: 10px;
        border-radius: 3px;
        color: #0c6fff;
        i {
          cursor: pointer;
        }
      }
    }
    .show-nums {
      position: absolute;
      bottom: -5px;
      right: 20px;
      margin: 0;
      font-size: 12px;
      color: #9f9f9f;
      em {
        font-style: normal;
      }
    }
  }

  .tips-sp {
    font-size: 12px;
    color: #999;
  }
  .red-cls {
    color: #F53F3F;
  }
  .insert-sen-word {
    ::v-deep .el-dialog {
      border-radius: 10px;
      width: 660px;
    }
    ::v-deep .el-dialog__header {
      border-bottom: 1px solid #E7E7E7;
      font-weight: bold;
    }
    ::v-deep .el-form-item--medium .el-form-item__label {
      font-weight: normal;
    }
  }
</style>
