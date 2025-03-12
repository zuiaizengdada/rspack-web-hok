<template>
  <!-- 顶部筛选栏 -->
  <div class="table-data">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      border
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="action" slot-scope="{ row }">
        <el-button v-permission="['web:casePlatform:edit', permsList]" type="text" @click="addOrEdit(2, row)">编辑</el-button>
        <el-button v-permission="['web:casePlatform:delete', permsList]" class="delete-cls" type="text" @click="deleteDeliver(row)">删除</el-button>
      </div>
    </MPageLayout>
    <el-dialog
      :title="addOrEditFlag === 1 ? '新增选题平台' : '编辑选题平台'"
      :visible.sync="insertOrEditDialogFlag"
      :before-close="handleDialogClose"
    >
      <el-form ref="deliverysForm" :model="deliverysForm" :rules="rules">
        <el-form-item label="平台类型和名称：" prop="ptOrName" :label-width="formLabelWidth">
          <el-cascader
            ref="ptOrName"
            :key="modalKey"
            v-model="deliverysForm.ptOrName"
            :options="ptOrNameOption"
            :props="{ checkStrictly: true }"
            clearable
            @visible-change="choosept"
          />
        </el-form-item>
        <el-form-item label="网站/账号名称：" prop="accountName" :label-width="formLabelWidth">
          <el-input v-model="deliverysForm.accountName" maxlength="20" autocomplete="off" />
          <span>名称限20个字以内</span>
        </el-form-item>
        <el-form-item
          v-if="deliverysForm.ptOrName.length > 1 && deliverysForm.ptOrName[0] === 'news'"
          label="网站地址："
          :label-width="formLabelWidth"
        >
          <el-input v-model="deliverysForm.linkAddress" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelInsertOrEdit('deliverysForm')">取 消</el-button>
        <el-button type="primary" @click="submitForInsertOrEdit('deliverysForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccount } from '@/api/product/setting'
import { getCasePlatformList, addPlatform, editPlatform, deletePlatform } from '@/api/product/setting'
export default {
  name: 'PageData',
  // eslint-disable-next-line vue/require-prop-types
  props: ['deliverys'],
  data() {
    const ptOrNameValid = (rule, value, callback) => {
      console.log(rule)
      if (value.length < 2) {
        callback(new Error('请选择平台类型和名称'))
      } else {
        callback()
      }
    }
    return {
      permsList: this.$route.meta.permsList || [],
      modalKey: 0,
      ptStringData: [],
      ptOrNameOption: [],
      deliverysForm: {
        platformCode: '',
        platformTypeCode: '',
        accountName: '',
        linkAddress: '',
        casePlatformId: '',
        ptOrName: []
      },
      addOrEditFlag: 1,
      insertOrEditDialogFlag: false,
      formLabelWidth: '150px',
      loading: false,
      slotArr: ['action'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'index', label: '序号', type: 'text' },
          { prop: 'accountName', label: '网站/账号名称', type: 'text' },
          { prop: 'platformName', label: '平台名称', type: 'text' },
          { prop: 'platformTypeName', label: '平台类型', type: 'text' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      rules: {
        ptOrName: [
          { type: 'array', required: true, trigger: 'change', message: '请选择平台类型和名称' },
          { validator: ptOrNameValid, trigger: 'blur' }
        ],
        platformTypeCode: [{ required: true, message: '请选择平台名称', trigger: 'change' }],
        accountName: [{ required: true, message: '请输入网站/账号', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {
    this.loadAccountData()
  },
  methods: {
    loadAccountData() {
      getAccount().then((res) => {
        this.ptOrNameOption = []
        this.ptStringData = res.data
        res.data.forEach((element) => {
          element.value = element.catalogCode
          element.label = element.catalogName
          if (element.level === 1) {
            this.ptOrNameOption.push(element)
          }
        })
        this.ptOrNameOption.forEach((item) => {
          const childrens = []
          res.data.forEach((obj) => {
            if (item.id === obj.parentId) {
              childrens.push(obj)
            }
          })
          item.children = childrens
        })
      })
    },
    choosept(val) {
      console.log('fffffff', this.deliverysForm.ptOrName)
    },
    choosePlatFormCode() {
      console.log('@@@@@@@@@:--------:', this.deliverysForm.platformCode)
      this.$refs.deliverysForm.clearValidate('platformCode')
    },
    handleDialogClose() {
      this.$refs.deliverysForm.resetFields()
      this.insertOrEditDialogFlag = false
    },
    submitForInsertOrEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            accountName: this.deliverysForm.accountName,
            platformCode: this.deliverysForm.ptOrName[1],
            platformTypeCode: this.deliverysForm.ptOrName[0],
            platformName: '',
            platformTypeName: '',
            webUrl: this.deliverysForm.linkAddress
          }
          this.ptStringData.forEach(function (value) {
            if (value.value === params.platformCode) {
              params.platformName = value.label
            }
            if (value.value === params.platformTypeCode) {
              params.platformTypeName = value.label
            }
          })
          if (this.addOrEditFlag === 1) {
            addPlatform(params).then((res) => {
              console.log(res)
              if (res.success) {
                this.$message.success('选题平台新增成功！')
                this.insertOrEditDialogFlag = false
                this.$refs[formName].resetFields()
                this.deliverysForm.linkAddress = ''
                this.getDataList(this.deliverys)
                this.$emit('clearForm')
              }
            })
          } else if (this.addOrEditFlag === 2) {
            params.id = this.deliverysForm.casePlatformId
            editPlatform(params).then((res) => {
              if (res.success) {
                this.$message.success('选题平台编辑成功！')
                this.insertOrEditDialogFlag = false
                this.deliverysForm.linkAddress = ''
                this.$refs[formName].resetFields()
                this.getDataList(this.deliverys)
                this.$emit('clearForm')
              }
            })

            // this.getDataList()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelInsertOrEdit(formName) {
      this.insertOrEditDialogFlag = false
      this.deliverysForm.linkAddress = ''
      this.deliverysForm.accountName = ''
      this.$refs[formName].resetFields()
    },
    addOrEdit(type, obj) {
      console.log(obj)
      this.addOrEditFlag = type
      this.insertOrEditDialogFlag = true
      if (type === 1) {
        this.deliverysForm.casePlatformId = ''
        this.deliverysForm.accountName = ''
        this.deliverysForm.platformCode = ''
        this.deliverysForm.platformTypeCode = ''
        this.deliverysForm.platformTypeCode = ''
      } else if (type === 2) {
        this.deliverysForm.ptOrName = []
        this.deliverysForm.ptOrName[1] = obj.platformCode
        this.deliverysForm.ptOrName[0] = obj.platformTypeCode
        this.deliverysForm.accountName = obj.accountName
        this.deliverysForm.linkAddress = obj.webUrl
        this.deliverysForm.casePlatformId = obj.id
        this.modalKey++
      }
      console.log('!!!!!!!!!!!!!!!:', this.deliverysForm)
    },
    getDataList(res) {
      this.ptStringData.forEach(function (value) {
        if (value.value === res.platformCode) {
          res.platformName = value.label
        }
        if (value.value === res.platformTypeCode) {
          res.platformTypeName = value.label
        }
      })
      console.log('after:::::', res)
      // 调用查询数据接口
      getCasePlatformList(res).then((res) => {
        console.log(res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.tableData.forEach((item, index) => {
            item.index = (this.config.pageIndex - 1) * res.data.pageSize + index + 1
          })
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.total = res.data.total
        }
      })
    },
    deleteDeliver(row) {
      console.log(row)
      this.$confirm('你确定要删除该平台吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          const params = {
            casePlatformId: row.id
          }
          deletePlatform(params).then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.deliverys.pageIndex = 1
              this.deliverys.pageSize = 10
              this.getDataList(this.deliverys)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.pageIndex = 1
      this.deliverys.pageIndex = 1
      this.deliverys.pageSize = val
      this.getDataList(this.deliverys)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.pageIndex = val
      this.deliverys.pageIndex = val
      this.getDataList(this.deliverys)
    },
    handleSelectionChange(val) {
      this.$refs.tableTools && this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
.table-data {
  width: 100%;
  height: 710px;
  margin-top: -22px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  ::v-deep .page_footer {
    padding: 0;
    justify-content: flex-end;
  }
  ::v-deep .tablePage {
    margin-top: -13px;
  }
  ::v-deep .page_content {
    padding: 0;
  }
  ::v-deep .page_footer {
    padding: 0 15px;
    margin-top: 20px;
  }
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  text-align: right;
  box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
}
.delete-cls {
  color: red;
}
</style>
