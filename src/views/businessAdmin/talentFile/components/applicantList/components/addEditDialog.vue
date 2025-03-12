<!-- 新增面试 -->
<template>
  <el-drawer
    :title="row.personnelBaseInfoId ? '修改' : '新增'"
    :visible.sync="visible"
    direction="rtl"
    :wrapper-closable="false"
    @close="handleClose"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="100px">
      <el-form-item label="姓名" class="form-item" prop="name">
        <!-- 姓名 -->
        <el-input v-model="post.name" placeholder="请输入姓名" class="name-s" />
      </el-form-item>
      <el-form-item label="手机号" class="form-item" prop="phone">
        <!-- 手机 -->
        <el-input
          v-model="post.phone"
          placeholder="请输入手机号"
          class="name-s"
        />
      </el-form-item>
      <el-form-item label="来源" class="form-item" prop="source">
        <!-- 来源 -->
        <el-select
          v-model="post.source"
          style="width: 100% !important"
          size="small"
          class="w-200 m-r-10"
          placeholder="请选择来源"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="post.source === 6"
        class="form-item"
        prop="internalReferrer"
      >
        <!-- 内推人 -->
        <el-select
          key="internalReferrer"
          v-model="post.internalReferrer"
          clearable
          filterable
          placeholder="请选择内推人"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="post.source === 8"
        key="sourceRemark"
        class="form-item"
        prop="sourceRemark"
      >
        <!-- 文本域 -->
        <el-input
          v-model="post.sourceRemark"
          type="textarea"
          resize="none"
          placeholder="
            请输入其他来源
          "
          show-word-limit
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="岗位" class="form-item" prop="positionId">
        <!-- 岗位 -->
        <el-select
          v-model="post.positionId"
          clearable
          filterable
          placeholder="请选择岗位"
          style="width: 100%"
        >
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="面试时间" class="form-item" prop="interviewTime">
        <!-- 手机 -->
        <el-date-picker
          v-model="post.interviewTime"
          value-format="timestamp"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 100% !important"
        />
      </el-form-item>
      <el-form-item label="HRBP" class="form-item" prop="hrbp">
        <!-- hrbp -->
        <el-select
          v-model="post.hrbp"
          clearable
          filterable
          placeholder="请选择HRBP"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="简历" class="form-item" prop="resumeUrl">
        <el-upload
          ref="uploadFile"
          class="upload-demo"
          action="#"
          :before-upload="beforeUpload"
          :limit="1"
          :multiple="false"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="onChangeFile"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传xls,cvs,xlsx,txt,doc,docx,pdf,png,jpg格式文件,大小不能超过10M,过多数据请分批上传。
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item
        v-if="!row.personnelBaseInfoId"
        label="选择面试官"
        class="form-item"
        prop="interviewerList"
      >
        <!-- interviewerList -->
        <el-select
          v-model="post.interviewerList"
          filterable
          clearable
          placeholder="请选择面试官"
          remote
          multiple
          style="width: 100%"
          :multiple-limit="5"
          :remote-method="remoteMethodInterviewer"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
        <!-- <el-select
          v-model="post.interviewerList"
          clearable
          filterable
          multiple
          :multiple-limit="5"
          placeholder="请选择面试官"
          style="width: 100%"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </el-select> -->
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button v-if="!row.personnelBaseInfoId" type="primary" @click="submit"
        >保 存</el-button
      >
      <el-button v-if="row.personnelBaseInfoId" type="primary" @click="submit"
        >确 定</el-button
      >
      <el-button
        v-if="!row.personnelBaseInfoId"
        type="primary"
        @click="submit('new')"
        >保存并新增下一位</el-button
      >
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import { userNoPage } from '@/api/addressBookApi'
import { uploadFile } from '@/api/file'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      post: {},
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          { min: 1, max: 10, message: '限制最多输入10个字符', trigger: 'blur' }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              // 手机号码
              const phoneRegExp =
                /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
              if (!value.match(phoneRegExp)) {
                callback(new Error('请输入正确的手机号码'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        internalReferrer: [
          {
            required: true,
            message: '请输入内推人',
            trigger: 'blur'
          }
        ],
        sourceRemark: [
          {
            required: true,
            message: '请输入其他来源',
            trigger: 'blur'
          },
          { min: 1, max: 30, message: '限制最多输入30个字符', trigger: 'blur' }
        ],
        hrbp: [
          {
            required: true,
            message: '请选择hrbp',
            trigger: 'change'
          }
        ],
        source: [
          {
            required: true,
            message: '请选择来源',
            trigger: 'change'
          }
        ],
        positionId: [
          {
            required: true,
            message: '请选择岗位',
            trigger: 'change'
          }
        ],
        interviewTime: [
          {
            required: true,
            message: '请选择面试时间',
            trigger: 'change'
          },
          {
            validator: (rule, value, callback) => {
              const todayTimestamp = new Date().setHours(0, 0, 0, 0)

              if (value < todayTimestamp) {
                callback(new Error('只能选中大于今天的日期'))
              }
              callback()
            }
          }
        ],
        resumeUrl: [
          {
            required: true,
            message: '请上传简历',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.fileList.length) {
                callback(new Error('请上传简历'))
              } else {
                callback()
              }
            }
          }
        ],
        interviewerList: [
          {
            required: true,
            message: '请选择面试官',
            trigger: 'change'
          }
        ]
      },
      fileList: [],
      options: [
        { label: 'BOSS直聘', value: 1 },
        { label: '智联招聘', value: 2 },
        { label: '前程无忧', value: 3 },
        { label: '拉勾', value: 4 },
        { label: '猎聘', value: 5 },
        { label: '内推', value: 6 },
        {
          label: '公众号/朋友圈',
          value: 7
        },
        {
          label: '其他',
          value: 8
        }
      ],
      jobList: [],
      userList: [],
      fileUrl: ''
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  async mounted() {
    const res = await this.getJobList()

    if (res.some(item => item.jobId === +this.row.positionId)) {
      if (this.row.personnelBaseInfoId) {
        this.post = { ...this.row, positionId: +this.row.positionId }
        this.fileUrl = this.row.resumeUrl
        this.fileList = this.row.fileList
      }
    } else {
      if (this.row.personnelBaseInfoId) {
        this.post = { ...this.row, positionId: '' }
        this.fileUrl = this.row.resumeUrl
        this.fileList = this.row.fileList
      }
    }

    // if (this.row.personnelBaseInfoId) {
    //   this.post = { ...this.row, positionId: +this.row.positionId }
    //   this.fileUrl = this.row.resumeUrl
    //   this.fileList = this.row.fileList
    // }
    // this.getJobList()
    this.getUserList()
    this.setAllUserList()
    this.$nextTick(() => {
      this.clearError()
    })
  },
  methods: {
    async remoteMethodInterviewer(query) {
      // status 0 查在职人员
      const res = await userNoPage({ nickName: query, status: 0 })

      this.userList = res.data
    },
    setAllUserList() {
      // 在职的
      userNoPage({ status: 0 }).then(res => {
        if (res.code === 1) {
          this.interviewerList = res.data
        }
      })
    },
    clearError(filed) {
      if (filed) {
        // 清空错误消息
        this.$refs.post.clearValidate([filed])
      } else {
        // 清空错误消息
        this.$refs.post.clearValidate()
      }
    },
    async getUserList() {
      const res = await userNoPage()

      this.userList = res.data.flat()
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data
      return this.jobList
    },
    handleClose() {
      this.$emit('close')
    },
    submit(type) {
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', type, {
            ...this.post,
            resumeUrl: this.fileUrl,
            resumeUrlFileList: JSON.stringify(this.fileList)
          })
        }
      })
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(xls|csv|xlsx|txt|doc|docx|pdf|png|jpg)$/i.test(
        file.name
      )

      if (!isTypeAllowed) {
        this.$message.error(
          '只能上传 xls,csv,xlsx,txt,doc,docx,pdf,png,jpg 格式的文件！'
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
    handleRemove() {
      this.fileList.splice(0)
      this.fileUrl = ''
    },
    onChangeFile(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.beforeUpload(file)

      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            this.fileUrl = res.data.url
            this.fileList = fileList
            this.$refs.uploadFile.clearFiles()
          })
          .catch(() => {
            console.log(file.name + '上传失败')
          })
      } else {
        this.handleRemove()
        this.$refs.uploadFile.clearFiles()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
::v-deep .el-drawer__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
  padding-bottom: 20px;
}
.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
