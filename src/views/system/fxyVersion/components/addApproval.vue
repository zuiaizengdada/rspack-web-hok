<template>
  <el-dialog
    v-if="visible"
    class="create-plan"
    :close-on-click-modal="false"
    :title="title"
    width="467px"
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
      <el-form-item label="版本号" prop="version">
        <el-input v-model="form.version" />
      </el-form-item>
      <el-form-item label="抖音" prop="dyIsOpen">
        <el-radio-group v-model="form.dyIsOpen">
          <el-radio :label="1">新API</el-radio>
          <el-radio :label="2">老API</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="快手" prop="ksIsOpen">
        <el-radio-group v-model="form.ksIsOpen">
          <el-radio :label="1">新API</el-radio>
          <el-radio :label="2">老API</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="小红书" prop="xhsIsOpen">
        <el-radio-group v-model="form.xhsIsOpen">
          <el-radio :label="1">新API</el-radio>
          <el-radio :label="2">老API</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频号" prop="sphIsOpen">
        <el-radio-group v-model="form.sphIsOpen">
          <el-radio :label="1">新API</el-radio>
          <el-radio :label="2">老API</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="B站" prop="bzIsOpen">
        <el-radio-group v-model="form.bzIsOpen">
          <el-radio :label="1">新API</el-radio>
          <el-radio :label="2">老API</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="text-align: right; padding-bottom: 15px">
        <el-button
          type="primary"
          size="mini"
          @click="handleSubmit"
        >保存</el-button>
        <el-button size="mini" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <select-case-modal ref="modal" append-to-body @submit="onSubmit" />
  </el-dialog>
</template>

<script>
import selectCaseModal from '@/components/SelectCaseModal/index'

import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import {
  getComplementRemindListGroup,
  getbizWechatGroupChatGroup
} from '@/api/deliver/baseSeeting'
import { DateFormat } from '@/utils/index'
import { fxyVersionAdd, fxyVersionEdit } from '@/api/system/fxyVersion'
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
      guoqiFlag: false,
      title: '',
      groupList: [],
      visible: false,
      deptTreeArray: [],
      options: [],
      userArray: [],
      inputVisible: false,
      dyIsOpen: 2,
      inputValue: '',
      form: {
        version: '',
        dyIsOpen: 2,
        ksIsOpen: 2,
        xhsIsOpen: 2,
        sphIsOpen: 2,
        bzIsOpen: 2
      },
      loading: false,
      type: 'add',
      rules: {
        version: [
          { required: true, message: '请输入版本号', trigger: 'change' }
        ],
        dyIsOpen: [
          { required: true, message: '请选择抖音', trigger: 'change' }
        ],
        ksIsOpen: [
          { required: true, message: '请选择快手', trigger: 'change' }
        ],
        xhsIsOpen: [
          { required: true, message: '请选择小红书', trigger: 'change' }
        ],
        sphIsOpen: [
          { required: true, message: '请选择视频号', trigger: 'change' }
        ],
        bzIsOpen: [{ required: true, message: '请选择B站', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    DateFormat,
    async querySearch(query) {
      if (query === '') return
      let res = {}
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
    open(type, row, id) {
      this.visible = true
      this.reset()
      this.type = type
      if (type === 'edit') {
        const {
          version,
          dyIsOpen,
          ksIsOpen,
          xhsIsOpen,
          sphIsOpen,
          bzIsOpen,
          id
        } = row
        this.form = {
          version,
          dyIsOpen,
          ksIsOpen,
          xhsIsOpen,
          sphIsOpen,
          bzIsOpen,
          id
        }
      }
      const isAdd = type === 'add'
      this.title = isAdd ? '新增版本' : '编辑版本'
    },
    reset() {
      this.form = {
        version: '',
        dyIsOpen: 2,
        ksIsOpen: 2,
        xhsIsOpen: 2,
        sphIsOpen: 2,
        bzIsOpen: 2
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
      const params = { ...this.form }
      const res = await fxyVersionAdd(params)
      if (res.code === 1) {
        this.$notify.success('新增成功')
        this.success()
      }
    },
    async edit() {
      const params = { ...this.form }
      const res = await fxyVersionEdit(params)
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
  img {
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
