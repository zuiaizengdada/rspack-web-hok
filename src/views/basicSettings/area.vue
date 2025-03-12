<template>
  <div class="page_wrap">
    <MCard>
      <div class="page_wrap_header">
        <div class="header_wrap">
          <div>领域管理</div>
          <el-button size="small" type="primary" @click="openAddModel"><i class="el-icon-plus" /> 新增领域</el-button>
        </div>
      </div>
      <div class="page_table">
        <el-table
          v-loading="loading"
          border
          height="100%"
          :data="tableData"
          :header-cell-style="{ background: '#f5f5f5' }"
          style="width: 100%"
          tooltip-effect="dark"
        >
          <el-table-column prop="domainId" label="领域ID" width="120" />
          <el-table-column prop="domainName" label="领域名称" />
          <el-table-column prop="updateBy" label="操作人" />
          <el-table-column prop="updateTime" label="操作时间">
            <template slot-scope="{ row }">
              {{ row.updateTime | parseTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="openEditModel(row)">编辑</el-button>
              <el-button type="text" class="c_red" @click="del(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </MCard>
    <AppDialog
      v-model="dialogModel.visible"
      :title="dialogModel.title"
      width="518px"
      height="162px"
      :loading="dialogModel.loading"
      @success="send"
    >
      <div v-if="dialogModel.visible" v-loading="dialogModel.loading" class="dialogModel">
        <el-form ref="ruleForm" :model="dialogModel.form" :rules="rules" label-width="80px">
          <el-form-item label="领域名称" prop="domainName">
            <div>
              <el-input
                v-model="dialogModel.form.domainName"
                maxlength="10"
                size="small"
                style="width: 224px"
                placeholder="请输入领域名称"
              />
              <div class="tips">注：限制10个字内</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addDomain, getDomainList, editDomain, delDomain } from '@/api/tearchCenter'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      tableData: [],
      dialogModel: {
        visible: false,
        form: {
          domainName: ''
        },
        title: '新增领域',
        type: 1, // 1：新增 2:编辑
        loading: false
      },
      rules: {
        domainName: [
          { required: true, message: '请输入领域名称', trigger: 'blur' },
          { max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getDomainList()
        .then((res) => {
          this.loading = false
          this.tableData = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击删除
    del(row) {
      this.$delModal({
        tips: `确定要删除【${row.domainName}】?`,
        sureBtnBgColor: '#0C6FFF',
        success: () => {
          const data = {
            domainId: row.domainId
          }
          this.loading = true
          delDomain(data)
            .then((res) => {
              this.loading = false
              this.getList()
              this.$notify.success({ title: '提示', message: '操作成功' })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击新增领域打开领域弹框
    openAddModel() {
      this.dialogModel = {
        visible: true,
        title: '新增领域',
        form: {
          domainName: ''
        },
        type: 1,
        loading: false
      }
    },
    // 点击弹框确定按钮
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogModel.type === 1 ? this.add() : this.edit()
        } else {
          return false
        }
      })
    },
    // 新增
    add() {
      const data = {
        domainName: this.dialogModel.form.domainName
      }
      this.dialogModel.loading = true
      addDomain(data)
        .then((res) => {
          this.dialogModel.visible = false
          this.dialogModel.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        })
        .catch(() => {
          this.dialogModel.loading = false
        })
    },
    // 编辑
    edit() {
      const data = {
        domainId: this.dialogModel.form.domainId,
        domainName: this.dialogModel.form.domainName
      }
      this.dialogModel.loading = true
      editDomain(data)
        .then(() => {
          this.dialogModel.visible = false
          this.dialogModel.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        })
        .catch(() => {
          this.dialogModel.loading = false
        })
    },
    // 点击打开编辑领域弹框
    openEditModel(row) {
      this.dialogModel = {
        visible: true,
        title: '编辑领域',
        form: {
          domainId: row.domainId,
          domainName: row.domainName
        },
        type: 2,
        loading: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
    0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  .page_wrap_header {
    padding-left: 20px;
    padding-right: 20px;
    .header_wrap {
      padding-bottom: 20px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
  .page_table {
    height: calc(100% - 54px);
    padding: 16px 20px;
  }
}
.dialogModel {
  width: 518px;
  height: 162px;
  padding: 20px;
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
  margin-top: 8px;
}
</style>
