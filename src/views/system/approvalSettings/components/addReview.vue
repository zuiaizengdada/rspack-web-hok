<template>
  <el-dialog
    class="addReview"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    title="审核设置"
    width="320px"
  >
    <el-form ref="form" label-position="left" :model="form" label-width="100px">
      <el-form-item label="审核类型" class="form-top">
        <div>复审人员</div>
      </el-form-item>
      <div v-for="(ele, index) in formList" :key="index">
        <el-form-item :label="ele.label">
          <el-select
            v-model="ele.id"
            style="width: 100%"
            filterable
            placeholder="请选择"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              :disabled="item.status === 1"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span
                v-if="item.status === 1"
                style="float: right; color: #f53f3f; font-size: 13px"
              >
                已离职
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="saveForm">确认</el-button>
      <el-button size="mini" @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { userNoPage } from '@/api/addressBookApi'
import { reexaminationList, addOrUpdateReexamination } from '@/api/system/approvalSettings'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      userArray: [],
      // 1-停更 2-转号 3-变更运营 4-移交老师 5-注销 6-恢复更新
      typeMap: {
        1: '停更',
        2: '转号',
        3: '变更运营',
        4: '移交IP',
        5: '注销',
        6: '恢复更新'
      },
      formList: []
    }
  },
  methods: {
    async saveForm() {
      // this.dialogVisible = false
      console.log(this.formList)
      const arr = this.formList.map(item => {
        return {
          type: item.type,
          userId: item.id || 0
        }
      })
      const res = await addOrUpdateReexamination(arr)
      if (res.code === 1) {
        this.$message.success('保存成功')
        this.dialogVisible = false
      }
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
          // 过滤离职人员
          this.userArray = this.userArray.filter(item => item.status === 0)
        })
        .catch(() => {})
    },
    open() {
      this.loadUserNoPage()
      this.getReexaminationList()
      this.dialogVisible = true
    },
    async getReexaminationList() {
      try {
        const { data } = await reexaminationList()
        if (data) {
          console.log(data.reexaminationInfoList, '555')
          this.formList = data.reexaminationInfoList.map(item => {
            return {
              label: this.typeMap[item.type],
              type: item.type,
              id: item.reexaminationUserId === '0' ? '' : item.reexaminationUserId
            }
          })
          // type 审批类型 1-停更 2-转号 3-变更运营 4-移交老师 5-注销 6-恢复更新'
          // reexaminationUserId	审批人员id
          // this.formList[1].id = data.stop
          // this.formList[2].id = data.transfer
          // this.formList[3].id = data.change
          // this.formList[4].id = data.transferIp
          // this.formList[5].id = data.cancel
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
/* Add your custom styles here */
.addReview {
  border-radius: 10px;
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  ::v-deep .el-dialog__title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
  }
  ::v-deep .el-dialog__body {
    padding-bottom: 0px;
  }
  ::v-deep .el-form-item{
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
}
.form-top{
  border-radius: 4px;
  background: #F3F3F3;
}
</style>
