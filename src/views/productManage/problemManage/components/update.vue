
<template>
  <el-dialog v-if="visible" class="dialog-container" :close-on-click-modal="false" title="一键导入" width="600px" :visible.sync="visible">
    <el-form ref="form" :inline="true" :model="form" :rules="rules">
      <el-form-item label="来源部门" prop="deptId">
        <el-cascader
          v-model="form.deptId"
          style="width: 160px"
          placeholder="请选择来源部门"
          :options="deptOptions"
          :props="{ checkStrictly: true, emitPath: false }"
          clearable
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="来源渠道" prop="channelSource">
        <el-select v-model="form.channelSource" style="width: 180px" placeholder="请选择来源渠道">
          <el-option v-for="item in channelSourceList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-upload
      ref="upload"
      class="upload-container"
      drag
      action="#"
      :http-request="fileRequest"
      :auto-upload="false"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">支持扩展名：.xlsx</div>
    </el-upload>
    <el-button type="text" @click="downloadFile">下载问题导入模板</el-button>
    <div v-if="errorMsg" class="error-msg">
      上传失败！点击下载
      <el-link type="danger" @click="openLink">错误文件</el-link>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提 交</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { questionDownload, questionImport } from '@/api/product/question'
import { getDeptData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
export default {
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + '/question/import',
      visible: false,
      deptOptions: [],
      channelSourceList: [],
      form: {
        channelSource: '',
        deptId: '',
        deptName: ''
      },
      errorMsg: false,
      link: '',
      rules: {
        deptId: [{ required: true, message: '请选择来源部门', trigger: 'change' }],
        channelSource: [{ required: true, message: '请选择来源渠道', trigger: 'change' }]
      }
    }
  },
  methods: {
    async open() {
      this.visible = true
      this.reset()
      const dept = await getDeptData()
      const channelSource = await getDict('sys_source_channel')
      this.channelSourceList = channelSource.map((i) => {
        return {
          value: i.dictLabel,
          label: i.dictLabel
        }
      })
      this.deptOptions = dept
    },
    reset() {
      this.form = {
        channelSource: '',
        deptId: '',
        deptName: ''
      }
      this.errorMsg = false
      this.link = ''
    },
    handleChange(data) {
      if (!data) return
      this.getTreeLabelById(this.deptOptions, data)
    },
    async downloadFile() {
      const { code, data } = await questionDownload()
      if (code === 1) {
        window.open(data)
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    getTreeLabelById(data, id) {
      data.forEach((i) => {
        if (i.value === id) {
          this.form.deptName = i.label
        }
        if (i.children && i.children.length) {
          this.getTreeLabelById(i.children, id)
        }
      })
    },
    async fileRequest(e) {
      const selectFile = e.file
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      const params = {
        channelSource: this.form.channelSource,
        deptId: this.form.deptId,
        deptName: this.form.deptName
      }
      const { data } = await questionImport({ data: formData, params })
      if (data) {
        this.errorMsg = true
        this.link = data
        return
      }
      this.errorMsg = false
      this.visible = false
      this.$notify.success('上传成功')
    },
    openLink() {
      window.open(this.link)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-container {
    .el-upload-dragger {
      width: 100%;
    }
  }
  .error-msg {
    display: flex;
    color: #ff4949;
    .el-link {
      margin-left: 15px;
    }
  }
  .el-link.is-underline:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    bottom: 0;
    border-bottom: 1px solid #ff4949;
  }
}
</style>
