<!-- 新增面试 -->
<template>
  <el-drawer
    :wrapper-closable="false"
    :title="row.ifEdit ? '修改' : '新增'"
    :visible.sync="visible"
    direction="rtl"
    @close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-form-item label="印章名称" class="form-item" prop="sealName">
        <el-input
          v-model="form.sealName"
          placeholder="请输入印章名称"
          class="sealName"
        />
      </el-form-item>
      <el-form-item label="印章类型" class="form-item" prop="sealType">
        <el-select
          v-model="form.sealType"
          style="width: 100%"
          size="small"
          placeholder="请选择印章类型"
          clearable
        >
          <el-option
            v-for="item in sealTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属公司" class="form-item" prop="companyId">
        <el-select
          v-model="form.companyId"
          clearable
          filterable
          placeholder="请选择所属公司"
          style="width: 100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="印章图片" class="form-item" prop="sealUrl">
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
          <div slot="tip" class="el-upload__tip">支持格式：jpg\jpeg\png</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="印章规格" class="form-item" prop="sealSpec">
        <el-select
          v-model="form.sealSpec"
          style="width: 100%"
          placeholder="请选择印章规格"
          clearable
        >
          <el-option
            v-for="item in sealSpecOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item" prop="sealDesc" label="说明">
        <el-input
          v-model="form.sealDesc"
          type="textarea"
          placeholder="请输入说明"
          show-word-limit
          :row="4"
          maxlength="240"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
      <el-button @click="handleClose" :loading="loading">取 消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { uploadFile } from '@/api/file'
import { sealTypeOption, sealSpecOption } from '../../../options'
import { getCompanyListAjax } from '@/api/businessAdmin/talentFile'
import {
  electronicUpdateAjax,
  electronicSealAddAjax
} from '../../../../api/badge'
import { hasValue } from '@/utils/index'

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
      form: {},
      rules: {
        sealName: [
          {
            required: true,
            message: '请输入印章名称',
            trigger: 'blur'
          },
          { min: 1, max: 40, message: '限制最多输入40个字符', trigger: 'blur' }
        ],
        sealType: [
          {
            required: true,
            message: '请选择印章类型',
            trigger: 'change'
          }
        ],
        companyId: [
          {
            required: true,
            message: '请选择所属公司',
            trigger: 'change'
          }
        ],
        sealUrl: [
          {
            required: true,
            message: '请上传印章图片',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.fileList.length) {
                callback(new Error('请上传印章图片'))
              } else {
                callback()
              }
            }
          }
        ],
        sealSpec: [
          {
            required: true,
            message: '请选择印章规格',
            trigger: 'change'
          }
        ]
      },
      fileList: [],
      companyList: [],
      fileUrl: '',
      sealTypeOption,
      sealSpecOption,
      loading: false,
      orgData: {} //原始数据
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
    if (this.row.ifEdit) {
      this.initEdit()
    } else {
      this.initAdd()
    }
    this.getCompanyPageList()
  },
  methods: {
    getCompanyPageList() {
      getCompanyListAjax().then(res => {
        if (res.code === 1) {
          console.log(res.data, '34333333')
          this.companyList = res.data.filter(item => item.status === 0)
        }
      })
    },
    beforeUpload(file) {
      // const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(jpeg|png|jpg)$/i.test(file.name)
      if (!isTypeAllowed) {
        this.$message.error('只能上传 jpg/jpeg/png 格式的文件！')

        return false
      }
      // if (!isLt10M) {
      //   this.$message.error('上传文件大小不能超过 10MB！')
      //   return false
      // }
      // return isLt10M && isTypeAllowed
      return isTypeAllowed
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
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = new FormData()
          const sealDesc = hasValue(this.form.sealDesc)
            ? this.form.sealDesc
            : ''
          if (this.row.ifEdit && !this.fileUrl) {
            this.fileUrl = this.form.sealUrl
          } else {
            params.append('file', this.fileList[0].raw)
          }
          params.append('companyId', this.form.companyId)
          params.append('sealDesc', sealDesc)
          params.append('sealName', this.form.sealName)
          params.append('sealSpec', this.form.sealSpec)
          params.append('sealType', this.form.sealType)
          params.append('sealUrl', this.fileUrl)
          params.append('fileUrlList', JSON.stringify(this.fileList))
          this.row.ifEdit && params.append('id', this.form.id)
          this.loading = true
          const ajax = this.row.ifEdit
            ? electronicUpdateAjax
            : electronicSealAddAjax
          ajax(params)
            .then(res => {
              if (res.code === 1) {
                this.$emit('success')
              }
            })
            .catch(() => {
              if (this.row.ifEdit) {
                this.fileUrl = ''
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    initAdd() {
      this.form = {}
      this.fileList = []
    },
    initEdit() {
      //回显文件
      this.form = { ...this.row }
      this.orgData = JSON.parse(JSON.stringify({ ...this.row }))
      this.fileList = this.form.fileUrlList && JSON.parse(this.form.fileUrlList)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 20px;
  padding-bottom: 20px;
}

.dialog-footer {
  text-align: right;
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
