<template>
  <div class="box" :loading="loading">
    <el-form
      ref="Form"
      class="form"
      size="mini"
      :model="form"
      label-width="80px"
      :rules="rules"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="form.name" class="w-200" maxlength="20" />
      </el-form-item>
      <el-form-item label="模板图标" prop="icon">
        <div>
          <Upload
            ref="Upload"
            width="160"
            height="120"
            accept=".jpg,.jpeg,.png"
            :before-upload="beforeUpload"
            :max-length="1"
            @onClick="onClick"
            @change="fileChange"
          />
          <div class="tips">仅支持上传小于800kb的png、jpg格式文件</div>
        </div>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model.number="form.sort"
          :min="1"
          :max="99"
          :precision="0"
          controls-position="right"
          style="width: 160px"
        />
        <div class="tips">仅支持输入整数，排序越小，应用越靠前</div>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-switch
          v-model="form.isShow"
          :active-value="1"
          :inactive-value="2"
        />
        <div class="tips">开启则会在审批应用中显示该审批流程发起入口</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import Upload from '@/components/AppUploadView/upload'
import { updateBasicData } from '../../api/approval'
export default {
  components: { Upload },
  props: {
    info: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      loading: false,
      form: { name: '', icon: '', id: '', sort: '', isShow: '' },
      rules: {
        name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入模版图标', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }]
      }
    }
  },
  watch: {
    info: {
      handler(v) {
        Object.assign(this.form, {
          name: v.name,
          icon: v.icon,
          sort: v.sort,
          isShow: v.isShow,
          id: v.id
        })
        this.$nextTick(() => {
          if (this.$refs.Upload && v.icon) {
            this.$refs.Upload.setFileList([
              {
                status: 3,
                url: v.icon
              }
            ])
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt20M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt20M
    },
    fileChange(res) {
      if (res.length > 0) {
        this.form.icon = res[0].url
        this.$refs.Upload && this.$refs.Form.validateField('icon')
      }
    },

    onClick() {
      this.$refs.Upload && this.$refs.Upload.setFileList([])
      this.form.icon = ''
    },
    submit() {
      return new Promise((resolve, reject) => {
        this.$refs.Form.validate(async(valid) => {
          if (valid) {
            this.loading = true
            try {
              await updateBasicData({
                ...this.form
              })
              this.loading = false
              resolve()
            } catch (err) {
              this.loading = false
            }
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 20px 0;
}
.tips {
  color: #606266;
  font-size: 12px;
}
::v-deep .el-form-item__label{
  text-align: left;
}
</style>
