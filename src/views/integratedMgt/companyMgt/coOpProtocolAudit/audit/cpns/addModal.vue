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
      :loading="loadingSubmit"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="审批人" prop="approverUserId">
        <el-select
          v-model="form.approverUserId"
          style="width: 100%"
          filterable
          :popper-append-to-body="false"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in approverArray"
            :key="item.approverUserId"
            :label="item.approverUserName"
            :value="item.approverUserId"
          >
            <span style="float: left">{{ item.approverUserName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批范围" prop="approveDeptIds">
        <!-- <el-input v-model="form.deptName" style="width: 87%" :disabled="true" />
          <el-button @click="selectDept">选择</el-button> -->
        <el-cascader
          ref="cascader1"
          v-model="form.approveDeptIds"
          style="width: 100%"
          :options="deptTreeArray"
          :props="{ multiple: true, emitPath: false, checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item label="抄送人员" prop="noticePersonnel">
        <el-select
          v-model="form.noticePersonnel"
          style="width: 100%"
          multiple
          filterable
          :popper-append-to-body="false"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
            <span style="float: left">{{ item.nickName }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="`抄送${types[loginType]}群`">
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag.chat_id"
          closable
          :disable-transitions="false"
          class="hok-tag"
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
          :popper-append-to-body="false"
          :remote-method="querySearch"
          :loading="loading"
          class="input-new-tag"
          size="mini"
          @blur="blurInputValue"
          @change="handleInputConfirm"
        >
          <el-option
            v-for="item in options"
            :key="item.chat_id"
            :label="item.name"
            :value="item.chat_id"
          >
            <div class="show-icn-label">
              <AppAvatar
                class="avatar"
                :name="item.name"
                width="24"
                :avatar="item.avatar"
                :no-name="true"
              />
              <!-- <img :src="item.avatar" /> -->
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
        <el-button size="mini" @click="close">取消</el-button>
        <el-button
          :loading="loadingSubmit"
          type="primary"
          size="mini"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deptTree, userNoPage } from '@/api/addressBookApi'
import moment from 'moment'
import { getApproverList } from '@/api/aiVideoManage'
import { saveOrUpdateApi } from '@/api/coOpProtocol'
import {
  getComplementRemindListGroup,
  getbizWechatGroupChatGroup
} from '@/api/deliver/baseSeeting'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: { AppAvatar },
  data() {
    return {
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      },
      title: '新增审批人',
      visible: false,
      deptTreeArray: [],
      approverArray: [],
      userArray: [],
      pickerOptions: {
        disabledDate(time) {
          return moment(time).add(1, 'days') < Date.now()
        }
      },
      inputValue: '',
      inputVisible: false,
      dynamicTags: [],
      userList: [],
      form: {
        deptName: '',
        approverUserId: '',
        approveDeptIds: [],
        noticePersonnel: []
      },
      loading: false,
      selectCase: [],
      type: 'add',
      teacherName: '',
      teacherList: [],
      options: [],
      rules: {
        approverUserId: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ],
        approveDeptIds: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ]
      },
      checkDepts: [],
      loadingSubmit: false
    }
  },
  methods: {
    selectDept() {
      const _this = this
      this.$AddressBook({
        type: [0],
        visible: true,
        multiple: true,
        checkDept: this.checkDepts,
        checkUserIds: [],
        success: res => {
          if (res.dept.length > 0) {
            _this.$set(
              this.form,
              'deptName',
              res.dept.map(m => m.name).join(',')
            )
            _this.$set(
              this.form,
              'approveDeptIds',
              res.dept.map(m => m.id)
            )
          }
        }
      })
    },
    blurInputValue() {},
    handleClose(record) {
      this.dynamicTags = this.dynamicTags.filter(
        item => item.chat_id !== record.chat_id
      )
    },
    getApproverList(val) {
      getApproverList({ nickName: val }).then(res => {
        this.approverArray = res.data
      })
    },
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
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        const info = this.options.find(item => item.chat_id === inputValue)
        // 判断是否已经存在
        const isExist = this.dynamicTags.find(
          item => item.chat_id === info.chat_id
        )
        if (!isExist) {
          this.dynamicTags.push(info)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      this.inputVisible = true
    },
    loadUserNoPage(val) {
      const params = {
        deptId: '',
        nickName: val
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
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
    open(type, row) {
      this.visible = true
      this.ignoreId = undefined
      this.loginType = row.loginType
      if (row) {
        this.ignoreId = row.id
      }
      this.loadTreeData()
      this.getApproverList()
      this.loadUserNoPage()
      this.reset()
      this.dynamicTags = []
      this.options = []
      this.type = type
      if (type === 'edit') {
        this.checkDepts = row.approveDepts.map(m => ({
          name: m.deptName,
          deptId: m.deptId
        }))
        this.form = {
          id: row.id,
          approverUserId: row.approverUserId,
          deptName: row.approveDepts
            ? row.approveDepts.map(m => m.deptName).join(',')
            : '',
          approveDeptIds: row.approveDepts
            ? row.approveDepts.map(m => m.deptId)
            : [],
          noticePersonnel: row.noticePersonnel
            ? row.noticePersonnel.map(m => m.userId)
            : []
        }
        // this.ignoreId = row.approverUserId
        if (row.noticeCrowd && row.noticeCrowd.length) {
          row.noticeCrowd.forEach(e => {
            this.dynamicTags.push(e)
          })
        }
      }
      const isAdd = type === 'add'
      this.title = isAdd ? '新增审批人' : '编辑审批人'
    },
    reset() {
      this.form = {
        approverUserId: '',
        approveDeptIds: [],
        noticePersonnel: []
      }
    },
    close() {
      this.visible = false
      this.$emit('close')
      this.reset()
    },
    handleSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.loadingSubmit = true
          try {
            const params = {
              ...this.form,
              noticeCrowd: this.dynamicTags.map(item => ({
                chatId: item.chatId || item.chat_id,
                name: item.name
              }))
            }
            const { success } = await saveOrUpdateApi(params)
            if (success) {
              this.$message.success('操作成功')
              this.close()
              this.$emit('refresh')
            }
          } catch (error) {
            console.log('error----saveOrUpdateApi', error)
          }
          this.loadingSubmit = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .hok-tag {
    margin: 0 10px 0 0;
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
  .button-new-tag {
    /* margin-left: 10px; */
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 100px;
    /* margin-left: 10px; */
    vertical-align: bottom;
  }
  .show-icn-label {
    width: 100%;
    padding: 5px;
    .avatar {
      float: left;
      width: 24px;
      height: 24px;
    }
    span {
      float: left;
      margin-left: 5px;
      line-height: 24px;
    }
  }
  </style>
