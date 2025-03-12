<template>
  <el-dialog
    v-if="visible"
    class="create-plan"
    :close-on-click-modal="false"
    :title="title"
    width="700px"
    :visible.sync="visible"
    @close="close"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="审批人" prop="userId">
        <el-select
          v-model="form.userId"
          style="width: 100%"
          filterable
          placeholder="请选择"
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
      <el-form-item label="部门" prop="deptIds">
        <el-cascader
          ref="deptRef"
          v-model="form.deptIds"
          :props="{ multiple: true, emitPath: false, checkStrictly: true }"
          style="width: 100%"
          :options="deptTreeArray"
          clearable
        />
      </el-form-item>
      <el-form-item label="抄送人员">
        <el-select
          v-model="form.remindUserIds"
          style="width: 100%"
          multiple
          filterable
          placeholder="请选择"
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
      <el-form-item :label="`通知${types[loginType]}群`">
        <el-tag
          v-for="tag in form.noticeCrowd"
          :key="tag.chat_id"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.name }}
        </el-tag>

        <el-select
          v-if="inputVisible"
          v-model="inputValue"
          filterable
          remote
          reserve-keyword
          placeholder=""
          :remote-method="querySearch"
          :loading="loading"
          class="input-new-tag"
          size="mini"
          @change="handleInputConfirm"
        >
          <el-option
            v-for="item in options"
            :key="item.chat_id"
            :label="item.name"
            :value="item"
          >
            <div class="show-icn-label">
              <AppAvatar
                class="avatar"
                :name="item.name"
                width="24"
                :avatar="item.avatar"
                :no-name="true"
              />
              <span>{{ item.name }}</span>
            </div>
          </el-option>
        </el-select>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          添加
        </el-button>
      </el-form-item>
      <el-form-item style="text-align: right; padding-bottom: 15px">
        <el-button type="primary" size="mini" @click="handleSubmit">
          保存
        </el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <select-case-modal ref="modal" append-to-body @submit="onSubmit" />
  </el-dialog>
</template>

<script>
import { deptTree, userNoPage } from '@/api/addressBookApi'
import selectCaseModal from '@/components/SelectCaseModal/index'
import {
  getComplementRemindListGroup,
  getSendMsgTypeConfigApi,
  getbizWechatGroupChatGroup
} from '@/api/deliver/baseSeeting'
import { DateFormat } from '@/utils/index'
import {
  addExamineAccount,
  editExamineAccount,
  addDesensitizedExamineAccount,
  editDesensitizedExamineAccount
} from '@/api/system/approvalSettings'
import { getItem } from '@/utils/localStorage'

import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: { selectCaseModal, AppAvatar },
  props: {
    pageInfo: {
      type: Object,
      default: () => {
        return {
          type: 1,
          name: '账号审批列表',
          path: '/videoManagement/accountApproval'
        }
      }
    }
  },
  data() {
    return {
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      },
      guoqiFlag: false,
      title: '新增审批人',
      groupList: [],
      visible: false,
      deptTreeArray: [],
      options: [],
      userArray: [],
      inputVisible: false,
      inputValue: '',
      form: {
        deptIds: [],
        noticeCrowd: [],
        userId: '',
        examineId: '',
        remindUserIds: []
      },
      loading: false,
      type: 'add',
      rules: {
        userId: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ],
        deptIds: [{ required: true, message: '请选择部门', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getSendMsgTypeConfig()
  },
  created() {},
  methods: {
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
        }
      } catch (error) {
        console.log(error)
      }
    },
    DateFormat,
    async querySearch(query) {
      if (query === '') return
      let res = {}
      console.log('this.loginType2---------', this.loginType)
      if (this.loginType === 'feishu') {
        res = await getComplementRemindListGroup({ query })
      } else {
        res = await getbizWechatGroupChatGroup({ chatName: query })
      }
      this.options = res.data
    },
    handleClose(record) {
      this.form.noticeCrowd = this.form.noticeCrowd.filter(
        item => item.chat_id !== record.chat_id
      )
    },
    showInput() {
      this.inputVisible = true
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      console.log(inputValue, 'inputValue')
      if (inputValue) {
        // 判断是否已经存在
        const flag = this.form.noticeCrowd.some(
          item => item.chat_id === inputValue.chat_id
        )
        if (flag) {
          this.$message.error('请勿重复添加！')
        } else {
          this.form.noticeCrowd.push({
            chat_id: inputValue.chat_id,
            name: inputValue.name
          })
        }
      }
      console.log(this.form.noticeCrowd, 'this.form.noticeCrowd')
      this.inputVisible = false
      this.inputValue = ''
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
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    open(type, row, id) {
      this.guoqiFlag = false
      this.visible = true
      this.options = []
      this.loadTreeData()
      this.loadUserNoPage()
      this.reset()
      this.type = type
      if (type === 'edit') {
        this.form.deptIds = row.deptIds
        this.form.userId = row.examineUserId
        this.form.remindUserIds = row.remindUserIds
        this.form.noticeCrowd = row.noticeCrowd ? [...row.noticeCrowd] : []
        this.form.examineId = row.examineId
        this.form.setUpId = id
      }
      const isAdd = type === 'add'
      this.title = isAdd ? '新增审批人' : '编辑审批人'
    },
    reset() {
      this.form = {
        deptIds: [],
        noticeCrowd: [],
        userId: '',
        remindUserIds: []
      }
    },
    close() {
      this.visible = false
      this.$emit('close')
      this.reset()
    },
    success() {
      this.visible = false
      this.$emit('success')
      this.reset()
    },
    async add() {
      const arr = this.$refs.deptRef.getCheckedNodes()
      // 拿arr的value值
      const deptIds = arr.map(item => item.value)
      const params = { ...this.form }
      params.deptIds = deptIds
      let res = null
      if (this.pageInfo.type === 1) {
        res = await addExamineAccount(params)
      } else {
        res = await addDesensitizedExamineAccount(params)
      }
      if (res.code === 1) {
        this.$notify.success('新增成功')
        this.success()
      }
    },
    async edit() {
      const arr = this.$refs.deptRef.getCheckedNodes()
      // 拿arr的value值
      const deptIds = arr.map(item => item.value)
      const params = { ...this.form }
      params.deptIds = deptIds
      let res = null
      if (this.pageInfo.type === 1) {
        res = await editExamineAccount(params)
      } else {
        res = await editDesensitizedExamineAccount(params)
      }
      if (res.code === 1) {
        this.$notify.success('保存成功')
        this.success()
      }
    },
    onSubmit(data) {
      this.$set(this.form, 'selectCase', data)
      this.selectCase = data
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container ::v-deep {
  height: 500px;
  .table_wrap {
    height: 100%;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.assessBox {
  width: 503px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .assessUsersView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}

.show-icn-label {
  width: 100%;
  padding: 5px 10px;
  .avatar {
    float: left;
    width: 24px;
    height: 24px;
  }
  span {
    float: left;
    margin-left: 10px;
    line-height: 24px;
  }
}
.create-plan {
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
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #f53f3f;
  line-height: 20px;
}
</style>
