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
    >
      <div slot="status" slot-scope="{ row }">
        <p v-if="row.status === 1">已启用</p>
        <p v-else class="delete-cls">禁用</p>
      </div>
      <div slot="createTime" slot-scope="{ row }">
        <p>{{ DateFormat(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss') }}</p>
      </div>
      <div slot="updateTime" slot-scope="{ row }">
        <p>{{ DateFormat(new Date(row.updateTime), 'yyyy-MM-dd hh:mm:ss') }}</p>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button v-permission="['web:deliveryScenario:edit', permsList]" type="text" @click="addOrEdit(2, row)">编辑</el-button>
        <el-button v-permission="['web:deliveryScenario:delete', permsList]" class="delete-cls" type="text" @click="deleteDeliver(row)">删除</el-button>
      </div>
    </MPageLayout>
    <el-dialog :title="addOrEditFlag === 1 ? '新增场景' : '编辑场景'" :visible.sync="insertOrEditDialogFlag">
      <el-form ref="deliverysForm" :model="deliverysForm" :rules="rules" class="deliverys-form">
        <el-form-item label="交付场景名称：" prop="sceneName" :label-width="formLabelWidth">
          <el-input
            v-model="deliverysForm.sceneName"
            autocomplete="off"
            minlength="2"
            maxlength="20"
            show-word-limit
            class="width-cls"
          />
        </el-form-item>
        <el-form-item label="启用禁用：" :label-width="formLabelWidth">
          <el-switch v-model="deliverysForm.status" active-color="#13ce66" inactive-color="#9c9c9c" />
          <span> {{ deliverysForm.status ? '启用' : '禁用' }} </span>
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
import { searchDeliveryData, insertDelivery, editDelivery } from '@/api/product/setting'
import { deleteDeliveryScenario } from '@/api/product/setting'
export default {
  name: 'PageData',
  // eslint-disable-next-line vue/require-prop-types
  props: ['deliverys'],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      deliverysForm: {
        sceneName: '',
        status: true,
        id: ''
      },
      addOrEditFlag: 1,
      insertOrEditDialogFlag: false,
      formLabelWidth: '150px',
      loading: false,
      slotArr: ['createTime', 'updateTime', 'status', 'action'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'index', label: '序号', type: 'text' },
          { prop: 'sceneName', label: '交付场景名称', type: 'text' },
          { prop: 'status', label: '状态', type: 'slot' },
          { prop: 'createBy', label: '创建者', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'slot' },
          { prop: 'updateTime', label: '更新时间', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      rules: {
        sceneName: [
          { required: true, message: '请输入交付场景名称', trigger: 'blur' },
          { min: 2, max: 20, message: '输入的内容长度在 2 到 20 个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {},
  methods: {
    DateFormat(date, fmt) {
      // author: meizz
      if (date === '') {
        return ''
      }
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return fmt
    },
    submitForInsertOrEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            sceneName: this.deliverysForm.sceneName,
            status: this.deliverysForm.status ? 1 : 0
          }
          if (this.addOrEditFlag === 1) {
            insertDelivery(params).then((res) => {
              if (res.success) {
                this.$message.success('交付场景新增成功！')
                this.insertOrEditDialogFlag = false
                this.deliverys.pageIndex = 1
                this.getDataList(this.deliverys)
              }
            })
          } else if (this.addOrEditFlag === 2) {
            params.id = this.deliverysForm.id
            editDelivery(params).then((res) => {
              if (res.success) {
                this.$message.success('交付场景编辑成功！')
                this.insertOrEditDialogFlag = false
                this.deliverys.pageIndex = 1
                this.getDataList(this.deliverys)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelInsertOrEdit(formName) {
      this.insertOrEditDialogFlag = false
      this.$refs[formName].resetFields()
    },
    addOrEdit(type, obj) {
      this.addOrEditFlag = type
      this.insertOrEditDialogFlag = true
      if (type === 1) {
        this.deliverysForm.id = ''
        this.deliverysForm.sceneName = ''
        this.deliverysForm.status = true
      } else if (type === 2) {
        this.deliverysForm.sceneName = obj.sceneName
        this.deliverysForm.status = obj.status === 1
        this.deliverysForm.id = obj.id
      }
      console.log(obj)
    },
    getDataList(res) {
      console.log(res)
      // 调用查询数据接口
      searchDeliveryData(res).then((res) => {
        console.log(res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.tableData.forEach((value, index) => {
            value.index = (this.config.pageIndex - 1) * this.config.pageSize + index + 1
          })
          this.config.total = res.data.total
          this.config.pageIndex = res.data.pageIndex
        }
      })
    },
    deleteDeliver(row) {
      console.log(row)
      this.$confirm('你确定要删除该交付场景吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
        .then(() => {
          deleteDeliveryScenario(row.id).then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.deliverys.pageIndex = 1
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.table-data {
  @include responsive-height(190px);
  border-radius: 4px;
  overflow: auto;
  padding: 0 15px;
  ::v-deep .my-table {
    margin: 0;
  }
  ::v-deep .page_footer {
    padding: 0;
    justify-content: flex-end;
  }
  ::v-deep .page_header {
    padding: 0;
    min-height: 0!important;
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

.width-cls {
  width: 300px;
}

.deliverys-form {
  ::v-deep .el-input--medium .el-input__inner {
    padding-right: 50px;
  }
}
</style>
