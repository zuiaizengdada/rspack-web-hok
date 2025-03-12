<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">{{ title }}</p>
      </div>
      <div class="add-group-center">
        <p>分组信息用于“一键发布”-“快捷添加分组”；可按分类/领域、归属主体、平台、特殊权益等方式组合命名。（参考命名：管理类-抖音-自营）</p>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="50px" class="demo-ruleForm account-group-block">
          <el-form-item label="分组" prop="name">
            <el-input v-model="ruleForm.name" class="w-300" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="账号">
            <div v-for="item in accountArr" :key="item.platformId" class="account-block">
              <div class="account-block-img">
                <img class="img-logo" :src="item.avatar" />
                <img class="pt-logo" :src="item.ptAvator" />
              </div>
              <span class="ip-span">{{ item.name }}</span>
              <i class="el-icon-error close-img" @click="deleteAccount(item)" />
            </div>
            <el-button type="primary" plain class="btn-add" @click="addAccountComBtn">
              <i class="el-icon-plus" />
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addGrounpBtn('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <addAccountCom ref="addAccountComponent" :account-arr="accountArr" @returnAccountData="returnAccountData" />
  </div>
</template>
<script>
import addAccountCom from '@/views/videoManagement/accountGroup/components/addAccountCom'
import { addAccountGroup, editForGroup } from '@/api/videoManagement/accountManage'
export default {
  name: 'AddAccount',
  components: {
    addAccountCom
  },
  props: {
  },
  data() {
    return {
      accountArr: [],
      title: '创建分组（账号可存在多个分组内）',
      addAccountFlag: false,
      type: 'add',
      groundId: '',
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    returnAccountData(arr) {
      this.accountArr = arr
      console.log('this.accountArr：', this.accountArr)
    },
    deleteAccount(obj) {
      console.log('oooooooo:', obj)
      this.accountArr.some((item, index) => {
        if (obj.accountId === item.accountId) {
          this.accountArr.splice(index, 1)
        }
      })
    },
    show() {
      this.addAccountFlag = true
      this.groupId = ''
      this.type = 'add'
      this.title = '创建分组（账号可存在多个分组内）'
    },
    editShow(obj) {
      this.addAccountFlag = true
      if (obj.type === 'edit') {
        this.title = '编辑分组'
        this.accountArr = obj.list
        this.ruleForm.name = obj.name
        this.groupId = obj.groupId
        this.type = obj.type
      }
    },
    handleClose() {
      this.addAccountFlag = false
      this.ruleForm.name = ''
      this.accountArr = []
    },
    addAccountComBtn() {
      this.$refs.addAccountComponent.show()
      if (this.accountArr.length > 0) {
        this.$refs.addAccountComponent.pjData()
      }
    },

    addGrounpBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            const arrId = []
            this.accountArr?.some(item => {
              arrId.push(item.platformAccountId)
            })
            const params = {
              groupId: this.groupId,
              name: this.ruleForm.name,
              platformAccountIds: arrId
            }
            console.log('sssss:', params)
            editForGroup(params).then(res => {
              if (res.success) {
                this.$message.success('分组修改成功！')
                this.addAccountFlag = false
                this.$emit('loadGroupList')
                this.ruleForm.name = ''
                this.accountArr = []
              }
            })
          } else {
            const arrId = []
            this.accountArr.some(item => {
              arrId.push(item.platformAccountId)
            })
            const params = {
              name: this.ruleForm.name,
              platformAccountIds: arrId
            }
            addAccountGroup(params).then(res => {
              if (res.success) {
                this.$message.success('分组添加成功！')
                this.addAccountFlag = false
                this.$emit('loadGroupList')
                this.ruleForm.name = ''
                this.accountArr = []
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

  <style scoped lang='scss'>
  .add_account_page {
      width: 100%;
      height: 100%;
      position: absolute;
      ::v-deep .el-dialog {
          border-radius: 10px;
      }
      ::v-deep .el-dialog__header {
          border-bottom: 1px solid #e7e7e7;
      }
      .p-title {
          font-size: 16px;
      }
      .plat_array_content {
          width: 100%;
          height: 280px;
          .plat_content {
              float: left;
              margin-right: 54px;
              width: 64px;
              height: 64px;
              cursor: pointer;
              img {
                  width: 64px;
                  height: 64px;
              }
              p {
                  font-size: 16px;
                  line-height: 30px;
                  height: 30px;
                  width: 100%;
                  text-align: center;
                  color: #333;
                  float: left;
                  margin-top: 5px;
              }
          }
      }
  }
  .add-group-center {
    p {
      font-size: 14px;
      color: #777;
    }
    .demo-ruleForm {
        margin-top: 20px;
    }
    .w-300 {
        width: 300px;
    }
    .w-100 {
        width: 100px;
    }
  }
  .account-block {
    float: left;
    width: 136px;
    height: 48px;
    padding: 5px 5px;
    background: #FAFAFA;
    margin-right: 16px;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    .close-img {
      position: absolute;
      font-size: 18px;
      right: -5px;
      top: -5px;
      display: none;
    }
    .account-block-img {
      float: left;
      width: 36px;
      height: 36px;
      position: relative;
      .img-logo {
        width: 35px;
        height: 35px;
        border-radius: 100%;
      }
      .pt-logo {
        position: absolute;
        width: 16px;
        height: 16px;
        bottom: 0;
        right: 0;
        border-radius: 100%;
      }
    }
    .ip-span {
      float: left;
      margin-left: 6px;
      width: 84px;
      height: 36px;
      line-height: 36px;
      color: #333;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .account-block:hover {
    background: #E7F0FF;
    .close-img {
      display: block;
    }
  }
  .btn-add {
    width: 136px;
    height: 48px;
    font-size: 22px;
  }

  .account-group-block {
    ::v-deep .el-input__inner {
      padding-right: 50px;
    }

  }
  </style>

