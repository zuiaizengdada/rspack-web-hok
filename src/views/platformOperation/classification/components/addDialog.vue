<template>
  <AppDialog
    v-model="config.visible"
    :title="config.type !== 1 ? '新增' : '编辑'"
    width="700px"
    height="auto"
    :loading="loading"
    @success="handleSave"
  >
    <div class="addDialog">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="98px"
      >
        <el-form-item v-if="form.parentName" label="上级分类">
          <el-input v-model="form.parentName" disabled style="width: 160px" />
        </el-form-item>
        <el-form-item label="分类编码">
          <el-input
            v-model="form.catalogueId"
            disabled
            placeholder="系统自动生成"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item
          v-if="!form.parentName"
          label="分类图标"
          prop="catalogueUrl"
        >
          <Upload
            ref="MUpload"
            width="160"
            height="120"
            accept=".jpg,.jpeg,.png"
            :before-upload="beforeUpload"
            :max-length="1"
            oss-teacher-folder="platform_class"
            @onClick="onClick"
            @change="fileChange"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="catalogueName">
          <el-input
            v-model="form.catalogueName"
            maxlength="30"
            show-word-limit
            size="small"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="排序" prop="catalogueSort">
          <el-input-number
            v-model.number="form.catalogueSort"
            :min="1"
            :max="9999"
            :precision="0"
            controls-position="right"
            style="width: 160px"
          />
          <div class="tips">值越小，越靠前，排序值范围1-9999</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import Upload from '@/components/AppUploadView/upload.vue'
import AppDialog from '@/components/AppDialog'
import { getFileType } from '@/utils/index'
import { catalogueAdd, catalogueUpdate } from '@/api/platform/classification.js'
export default {
  components: {
    AppDialog,
    Upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          type: 0,
          row: {}
        }
      }
    }
  },
  data() {
    return {
      form: {
        catalogueSort: '',
        catalogueName: '',
        parentId: 0,
        catalogueId: '',
        id: 0
      },
      loading: false,
      rules: {
        catalogueSort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        catalogueName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        catalogueUrl: [
          { required: true, message: '请选择分类图标', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    config: {
      handler(val) {
        if (val) {
          if (val.type) {
            this.form = val.row
          } else {
            this.form = {
              catalogueSort: '',
              catalogueName: '',
              catalogueUrl: '',
              parentId: 0
            }
          }
          this.$nextTick(() => {
            this.$refs.form && this.$refs.form.clearValidate()
            if (this.$refs.MUpload && this.form.catalogueUrl) {
              this.$refs.MUpload.setFileList([
                {
                  status: 3,
                  url: this.form.catalogueUrl
                }
              ])
            }
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            ...this.form
          }
          const apiFn = this.config.type !== 1 ? catalogueAdd : catalogueUpdate
          this.loading = true
          apiFn(data)
            .then(() => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },

    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    onClick(res) {
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.form.catalogueUrl = ''
    },
    fileChange(arr) {
      this.form.catalogueUrl = arr[0].url
    }
  }
}
</script>

<style lang='scss' scoped>
.addDialog {
  padding: 16px;
}

.tips {
  margin-top: 8px;
  font-size: 12px;
  color: #777777;
  line-height: 20px;
}
</style>
