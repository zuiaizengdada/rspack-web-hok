<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <el-form :inline="true" :model="wordsFrom" class="demo-form-inline">
      <el-form-item label="分词名称">
        <el-input v-model="wordsFrom.participleName" placeholder="请输入分词" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sureSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item class="right-float">
        <p v-permission="['web:wordsManage:import', permsList]" class="right-tools" @click="openUpdate">
          <i class="el-icon-plus" />
          导入</p>
        <p v-permission="['web:wordsManage:add', permsList]" style="margin-right: 10px;" class="right-tools" @click="insertWords">
          <i class="el-icon-plus" />
          新增</p>
      </el-form-item>
    </el-form>
    <el-dialog title="新增" :visible.sync="wordsDialogFlag" :before-close="handleDialogClose">
      <el-form ref="insertForm" :model="insertForm" :rules="rules" class="insert-form">
        <el-form-item label="分词名称" prop="participleName" :label-width="formLabelWidth">
          <el-input
            v-model="insertForm.participleName"
            class="m300-cls"
            autocomplete="off"
            maxlength="20"
            show-word-limit
          />
          <span class="block-span">名称不能重复，限20个字以内。</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('insertForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('insertForm')">确 定</el-button>
      </div>
    </el-dialog>
    <update ref="update" @searchd="sureSearch" />
  </div>
</template>

<script>
import { insertWords } from '@/api/product/setting'
import update from './update'
export default {
  name: 'WordsSearch',
  components: {
    update
  },
  // eslint-disable-next-line vue/require-prop-types
  props: [],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      fileList: [],
      wordsImportDialogFlag: false,
      wordsDialogFlag: false,
      formLabelWidth: '150px',
      insertForm: {
        participleName: ''
      },
      wordsFrom: {
        participleName: '',
        currentPage: 1,
        pageSize: 10
      },
      rules: {
        participleName: [{ required: true, message: '请输入分词名称', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    openUpdate() {
      this.$refs.update.open()
    },
    uploadExcel(file, fileList) {
      console.log(',,,,,,:', file)
      console.log('PPPPPPPPPPPPPP:', fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      console.log(files)
      console.log(fileList)
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    cancelImport() {
      this.wordsImportDialogFlag = false
    },
    importWords() {
      console.log('@@@@@@@@:@@@@@@@@@@@')
      this.wordsImportDialogFlag = true
    },
    handleDialogClose() {
      this.$refs.insertForm.resetFields()
      this.wordsDialogFlag = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.wordsDialogFlag = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            participleName: this.insertForm.participleName
          }
          insertWords(params).then((res) => {
            console.log(res)
            if (res.success) {
              this.$message.success('分词添加成功！')
              this.wordsDialogFlag = false
              this.$refs[formName].resetFields()
              this.$emit('search', this.wordsFrom)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    insertWords() {
      this.wordsDialogFlag = true
    },
    sureSearch() {
      this.wordsFrom.currentPage = 1
      this.$emit('search', this.wordsFrom)
    },
    clear() {
      const res = {
        participleName: '',
        pageIndex: 1,
        pageSize: 10
      }
      console.log(res)
      this.wordsFrom.participleName = ''
      this.$emit('search', res)
    },
    insertCourse() {
      console.log('add')
      this.$router.push(`/pmanager/courseInsert`)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  position: relative;
  padding: 15px;
}
.tools-block {
  width: 100%;
  height: 40px;
}
.tools-search {
  float: right;
}
.m300-cls {
  width: 300px;
}
.block-span {
  width: 100%;
  display: inline-block;
}

.right-float {
  float: right;
}
.right-tools {
  float: right;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #0C6FFF;
  color: #0C6FFF;
  background: none!important;
}

.insert-form {
  ::v-deep .el-input--medium .el-input__inner {
    padding-right: 50px;
  }
}
</style>
