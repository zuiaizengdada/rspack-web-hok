<template>
  <div v-loading="loading" class="groupDrawer">
    <el-form
      ref="Form"
      class="form"
      size="mini"
      :model="form"
      label-width="140px"
      :rules="rules"
    >
      <h2>基本信息</h2>
      <el-form-item label="节点名称" prop="nodeName">
        <el-input
          v-model="form.nodeName"
          class="w-350"
          maxlength="20"
          :show-word-limit="true"
        />
      </el-form-item>
      <h2>{{ form.nodeType === 1 ? '审批过程' : '抄送过程' }}</h2>
      <el-form-item
        :label="form.nodeType === 1 ? '审批人类型' : '抄送人类型'"
        prop="approvalType"
      >
        <el-select
          v-model="form.approvalType"
          placeholder="请选择审批人类型"
          clearable
          class="w-350"
          @change="handleChangeApprovalType"
        >
          <el-option
            v-for="item in approvalTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="form.nodeType === 1 ? '审批人' : '抄送人'" prop="approvalUserType">
        <el-select
          v-if="[3, 4].includes(form.approvalType)"
          v-model="form.approvalUserType"
          class="w-350"
          :placeholder="form.nodeType === 1 ? '请选择审批人' : '请选择抄送人'"
          clearable
          @change="handleChangeApprovalUserName"
        >
          <el-option
            v-for="item in userTypeOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        <m-select
          v-else-if="form.approvalType === 2"
          v-model="nodeApproveObjectList"
          style="width: 350px"
          filterable
          placeholder="请选择角色"
          multiple
          :multiple-limit="3"
          :dict-list="roleList"
          :param="{ value: 'roleId', label: 'roleName' }"
          @change="selectRole"
        />
        <el-select
          v-else-if="form.approvalType === 1"
          v-model="nodeApproveObjectList"
          filterable
          placeholder="请选择员工"
          clearable
          multiple
          class="w-350"
          :multiple-limit="5"
          @change="handleChangeUser"
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
        <el-select
          v-else
          v-model="nodeApproveObjectList"
          class="w-350"
          :placeholder="form.nodeType === 1 ? '请选择审批人' : '请选择抄送人'"
        >
          <el-option
            v-for="item in []"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-if="form.nodeType === 1">
        <el-form-item v-if="(nodeApproveObjectList.length>1 && form.approvalType===1) || [2,4].includes(form.approvalType)" label="审批方式" prop="approvalMethod">
          <el-radio-group v-model="form.approvalMethod">
            <el-radio :label="1">或签</el-radio>
            <el-radio :label="2">会签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电子签名" prop="electronicSign">
          <el-radio-group v-model="form.electronicSign">
            <el-radio :label="1">无需签名</el-radio>
            <el-radio :label="2">文件签名</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="nodeAttachmentList">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            action="#"
            :before-upload="beforeUpload"
            :limit="3"
            :multiple="false"
            :file-list="fileList"
            accept=".doc,.docx,.xls,.xlsx,.txt,.csv"
            :auto-upload="false"
            :on-change="onChangeFile"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传xls,cvs,xlsx,txt,doc,docx格式文件,大小不能超过10M<br />过多数据请分批上传,最多添加三份。
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="审批意见是否必填" prop="approvalOpinionRequired">
          <el-radio-group v-model="form.approvalOpinionRequired">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <h2>{{ form.nodeType === 1 ? '审批' : '抄送' }}附件</h2>
      <el-form-item label="发送内容">
        <el-checkbox-group v-model="form.sendContentList">
          <el-checkbox
            v-for="item in sendContentListOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <template v-if="form.nodeType === 1">
        <el-form-item
          label="客户资产转移确认"
          prop="customerAssetsTransferConfirm"
        >
          <el-radio-group v-model="form.customerAssetsTransferConfirm">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店铺账号关闭提醒" prop="shopCloseRemind">
          <el-radio-group v-model="form.shopCloseRemind">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item></template>
    </el-form>
    <div class="drawer__footer">
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
      <el-button size="small" @click="$emit('close')">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoleOptions } from '@/api/role'
// import AppSelectMultiple from '@/components/AppSelect/index3'
import { findLabelByValue } from '@/utils'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import { uploadFile } from '@/api/file'
import { userNoPage } from '@/api/addressBookApi'
import {
  approvalTypeOptions,
  sendContentListOptions,
  userTypeOptions1,
  userTypeOptions2
} from './columns'
export default {
  components: {
    // AppSelectMultiple
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const validFile = (rule, value, callback) => {
      if (this.form.electronicSign === 2) {
        if (value.length === 0) {
          callback(new Error('请选择要签名的文件'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      loading: false,
      nodeApproveObjectList: [],
      form: {
        id: undefined,
        nodeName: '',
        nodeType: '',
        approvalType: undefined,
        nodeApproveObjectList: [],
        approvalMethod: 2,
        approvalOpinionRequired: 1,
        sendContentList: [],
        customerAssetsTransferConfirm: 2,
        shopCloseRemind: 2,
        electronicSign: 2,
        approvalUserType: undefined,
        nodeAttachmentList: [],
        approvalUserName: ''
      },
      getLiveOssCConfig,
      rules: {
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        approvalType: [
          { required: true, message: '请选择审批人类型', trigger: 'change' }
        ],
        approvalUserType: [
          { required: true, message: '请选择审批人', trigger: 'change' }
        ],
        nodeApproveObjectList: [
          { required: true, message: '请选择审批人', trigger: 'blur' }
        ],
        approvalMethod: [
          { required: true, message: '请选择审批方式', trigger: 'blur' }
        ],
        electronicSign: [
          { required: true, message: '请选择电子签名', trigger: 'blur' }
        ],
        approvalOpinionRequired: [
          { required: true, message: '请选择审批意见', trigger: 'blur' }
        ],
        sendContentList: [
          { required: true, message: '请选择发送内容', trigger: 'blur' }
        ],
        customerAssetsTransferConfirm: [
          { required: true, message: '请选择客户资产转移确认', trigger: 'blur' }
        ],
        shopCloseRemind: [
          { required: true, message: '请选择店铺账号关闭提醒', trigger: 'blur' }
        ],
        nodeAttachmentList: [
          { validator: validFile, trigger: 'blur', type: 'Array' }
        ]
      },
      approvalTypeOptions,
      sendContentListOptions,
      fileList: [],
      roleList: [],
      userArray: []
    }
  },
  computed: {
    userTypeOptions() {
      if (this.form.approvalType === 3) {
        return userTypeOptions2
      }
      return userTypeOptions1
    }
  },
  watch: {
    info: {
      handler(val) {
        this.loading = true
        Object.assign(this.form, {
          ...val,
          sendContentList: val.sendContentList || [],
          nodeAttachmentList: val.nodeAttachmentList || []
        })
        if (val.nodeApproveObjectList) {
          this.nodeApproveObjectList = val.nodeApproveObjectList.map(
            i => val.approvalType === 1 ? i.approveId : +i.approveId
          )
        }
        if (val.nodeAttachmentList) {
          this.fileList = val.nodeAttachmentList.map(i => ({
            url: i.filePath,
            name: i.fileName
          }))
        }
        this.$nextTick(() => {
          this.loading = false
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getRole()
    this.loadUserNoPage()
  },
  methods: {
    loadUserNoPage(nickName = '') {
      userNoPage({ nickName })
        .then(res => {
          this.userArray = res.data
            .filter(i => i.status === 0)
        })
        .catch(() => {})
    },
    remoteMethod(query) {
      this.loadUserNoPage(query)
    },
    // 勾选员工
    handleChangeUser(v) {
      this.form.nodeApproveObjectList = v.map(i => ({
        approveId: i,
        approveName: this.userArray.find(item => item.userId === i)?.nickName,
        id: this.form.templateId,
        nodeId: this.form.id,
        type: 1
      }))
      this.form.approvalUserName = this.form.nodeApproveObjectList
        .map(i => i.approveName)
        .join(',')
    },
    handleChangeApprovalType() {
      this.form.approvalUserName = ''
      this.nodeApproveObjectList = []
      this.form.nodeApproveObjectList = []
      this.form.approvalUserType = this.form.approvalType
      this.handleChangeApprovalUserName()
    },
    getRole() {
      return getRoleOptions().then(res => {
        this.roleList = res.data
      })
    },
    // 勾选角色
    selectRole(row) {
      this.form.nodeApproveObjectList = this.roleList
        .filter(i => row.includes(i.roleId))
        .map(i => ({
          approveId: `${i.roleId}`,
          approveName: i.roleName,
          id: this.form.templateId,
          nodeId: this.form.id,
          type: 2
        }))
      this.form.approvalUserName = this.form.nodeApproveObjectList
        .map(i => `${i.approveName}(角色)`)
        .join(',')
    },

    handleChangeApprovalUserName() {
      this.form.approvalUserName = findLabelByValue(
        this.form.approvalUserType,
        this.userTypeOptions
      )
    },

    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(xls|csv|xlsx|txt|doc|docx)$/i.test(
        file.name
      )
      if (!isTypeAllowed) {
        this.$message.error(
          '只能上传 xls,csv,xlsx,txt,doc,docx格式的文件！'
        )
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！')
        return false
      }
      return isLt10M && isTypeAllowed
    },
    handlePreview(file) {
      console.log('文件预览:', file)
    },
    handleRemove(v) {
      if (this.fileList.length === 0) return
      const currentIndex = this.fileList.findIndex(i => i.uid === v.uid)
      if (currentIndex === -1) return
      this.fileList.splice(currentIndex, 1)
      this.form.nodeAttachmentList.splice(currentIndex, 1)
    },
    onChangeFile(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.beforeUpload(file)
      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            this.form.nodeAttachmentList.push({
              filePath: res.data.url,
              fileName: file.name,
              nodeId: this.form.id,
              id: this.form.templateId,
              purpose: 1
            })
            this.fileList = fileList
            this.$refs.uploadFile.clearFiles()
          })
          .catch(() => {
            console.log(file.name + '上传失败')
          })
      } else {
        this.handleRemove(file)
        // this.$refs.uploadFile.clearFiles()
        const idx = this.$refs.uploadFile.uploadFiles.findIndex(item => item.uid === file.uid)
        this.$refs.uploadFile.uploadFiles.splice(idx, 1)
      }
    },
    submit() {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.loading = true
          try {
            this.loading = false
            this.$emit('success', this.form)
          } catch (err) {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>
  <style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;

  h2 {
    line-height: 30px;
    font-weight: 700;
  }

  .form {
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;

    .upload-item {
      ::v-deep .el-form-item__content {
        margin-bottom: 20px;
      }
    }

    ::v-deep .el-form-item__label {
      font-weight: normal;
    }
  }

  .drawer__footer {
    text-align: right;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .tips {
    color: #606266;
    font-size: 12px;
  }
}
</style>
