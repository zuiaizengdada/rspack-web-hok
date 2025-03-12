<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      title="上传"
      width="560px"
      :loading="submitLoading"
      height="auto"
      @success="sure"
      @close="handleClose"
    >
      <div class="addDialog overflowOuto">
        <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules">
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="form.name" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="文件类型" prop="type">
            <el-radio-group v-model="form.type" :disabled="config.dialogType === 'EDIT'">
              <el-radio :label="1">图片</el-radio>
              <el-radio :label="2">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择文件" prop="url">
            <template v-if="form.type === 1">
              <upload
                key="MUploadImg"
                ref="MUploadImg"
                :width="160"
                :height="120"
                accept=".jpg,.jpeg,.png"
                :before-upload="beforeUploadImg"
                :max-length="1"
                oss-teacher-folder="hok_liveRoom"
                :disabled="(config.dialogType !== 'ADD')"
                :on-check-mdk5="onCheckMdk5"
                :get-oss-c-onfig-api="getLiveOssCConfig"
                @onClick="onImgClick"
                @change="(res) => fileChange(res, 'img')"
              />
              <div class="formTips" style="margin-left: 0px">建议图片比例16:9，支持 jpg、png 、jpeg格式，大小不超过2M，最佳分辨率750*420px。</div>
            </template>
            <template v-else-if="form.type === 2">
              <upload
                key="MUploadVideo"
                ref="MUploadVideo"
                :width="160"
                :height="120"
                accept=".mp4"
                :before-upload="beforeUploadVideo"
                :max-length="1"
                oss-teacher-folder="hok_liveRoom"
                :disabled="(config.dialogType !== 'ADD')"
                :on-check-mdk5="onCheckMdk5"
                :get-oss-c-onfig-api="getLiveOssCConfig"
                @onClick="onVideoClick"
                @change="(res) => fileChange(res, 'video')"
              />
              <div class="formTips" style="margin-left: 0px">视频文件格式为MP4, 大小限5G以内，分辨率为1080P像素以下。</div>
            </template>
          </el-form-item>
          <el-form-item label="标签">
            <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              @change="handleChange"
            >
              <el-option
                v-for="item in labelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />

            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppUploadView/upload'
import { checkExistence, addWarmUpMaterial, editWarmUpMaterial, getLiveOssCConfig } from '@/api/liveRoom/index.js'
import { getFileType } from '@/utils/index'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          data: {},
          dialogType: 'ADD'
        }
      }
    }
  },
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.form.type === 1 && !this.form.img.url) {
        return callback(new Error('请上传文件'))
      } else if (this.form.type === 2 && !this.form.video.url) {
        return callback(new Error('请上传文件'))
      } else {
        return callback()
      }
    }
    return {
      getLiveOssCConfig,
      loading: false,
      submitLoading: false,
      form: {
        name: '', // 文件名称
        url: '', // 文件url
        img: {
          url: '',
          md5: '',
          file: {}
        },
        video: {
          url: '',
          md5: '',
          file: {}
        },
        type: 1,
        tags: []
      },
      rules: {
        name: [
          { required: true, message: '请输入文件名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择文件类型', trigger: 'blur' }
        ],
        url: [
          { required: true, validator: validateUrl, message: '请上传文件', trigger: 'blur' }
        ]
      },
      progressConfig: {
        visible: false
      },
      labelOptions: [],
      newOption: '',
      maxOptions: 10,
      createdOptions: []
    }
  },
  computed: {
    canCreate() {
      // 当前选项数小于最大值时才允许创建新项
      return this.createdOptions.length < this.maxOptions
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (!val) return this.init()
        // 是否编辑
        if (val && this.config.dialogType === 'EDIT') this.getVideoDetail()
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    async getVideoDetail() {
      this.loading = true
      this.form = {
        name: this.config.data.name, // 文件名称
        tags: this.config.data.tags,
        url: '', // 文件url
        img: {
          url: this.config.data.type === 1 ? this.config.data.url : '',
          md5: this.config.data.type === 1 ? this.config.data.md5 : '',
          file: {}
        },
        video: {
          url: this.config.data.type === 2 ? this.config.data.url : '',
          md5: this.config.data.type === 2 ? this.config.data.md5 : '',
          file: {}
        },
        type: this.config.data.type
      }
      this.$nextTick(() => {
        this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([{
          status: 3,
          url: this.form.video.url
        }])
        this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([{
          status: 3,
          url: this.form.img.url
        }])
        this.loading = false
      })
    },
    handleOk() {
      this.$emit('handleOk')
    },
    init() {
      this.form = {
        name: this.config.data.name, // 文件名称
        img: {
          url: this.config.data.url === 1 ? this.config.data.url : '',
          md5: this.config.data.url === 1 ? this.config.data.md5 : '',
          file: {}
        },
        video: {
          url: this.config.data.url === 2 ? this.config.data.url : '',
          md5: this.config.data.url === 2 ? this.config.data.md5 : '',
          file: {}
        },
        tags: [],
        type: 1
      }
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
      this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
    },
    handleClose() {
      if (this.config.dialogType === 'ADD') this.$emit('handleOk')
    },
    // 确认框
    async sure() {
      console.log(this.form)
      if (this.form.type === 1 && this.$refs.MUploadImg && this.$refs.MUploadImg.getUploadFile()) {
        return this.$message.error('正在上传图片')
      }
      if (this.form.type === 2 && this.$refs.MUploadVideo && this.$refs.MUploadVideo.getUploadFile()) {
        return this.$message.error('正在上传视频')
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.config.dialogType === 'ADD' ? this.add() : this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    add() {
      this.loading = true
      const data = {
        md5: this.form.type === 1 ? this.form.img.md5 : this.form.video.md5,
        name: this.form.name,
        type: this.form.type,
        tags: this.form.tags || [],
        url: this.form.type === 1 ? this.form.img.url : this.form.video.url
      }
      addWarmUpMaterial(data).then(res => {
        this.loading = false
        this.handleOk()
      }).catch(() => {
        this.loading = false
      })
    },
    edit() {
      const data = {
        materialId: this.config.data.materialId,
        name: this.form.name,
        tags: this.form.tags || []
      }
      editWarmUpMaterial(data).then(res => {
        this.loading = false
        this.handleOk()
      }).catch(() => {
        this.loading = false
      })
    },
    beforeUploadImg(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    beforeUploadVideo(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['mp4', 'MP4'].includes(type)
      const isLt5GB = file.size / 1024 / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持mp4格式文件!`)
      } else if (!isLt5GB) {
        this.$message.error('上传文件大小不能超过 5GB!')
      }
      return isIMAGE && isLt5GB
    },
    onImgClick() {
      this.form.img = {
        url: '',
        md5: '',
        file: {}
      }
      this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
      // this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([{}])
    },
    onVideoClick() {
      this.form.videoUrl = {
        url: '',
        md5: '',
        file: {}
      }
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
      // this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
    },
    fileChange(res, type) {
      if (res.length > 0) {
        this.form[type].url = res[0].url
      }
    },
    onCheckMdk5(md5) {
      this.form[this.form.type === 1 ? 'img' : 'video'].md5 = md5
      return new Promise((resolve, reject) => {
        return checkExistence({ md5: md5, type: this.form.type }).then(res => {
          // return reject('该文件已在素材库中存在。')
          if (res.data) {
            return reject('该文件已在素材库中存在。')
          } else {
            return resolve(!res.data)
          }
        }).catch(() => {
          reject('文件校验失败')
        })
      })
    },
    handleChange(value) {
      console.log(value, 'value')
      this.form.tags = [...this.form.tags, ...value]
      this.form.tags = [...new Set(this.form.tags)]
      console.log(this.form.tags, 'tags')
      // const existingOptions = this.form.tags.filter(option => option === value[0])
      // console.log(existingOptions, 'existingOptions')
      // if (existingOptions.length > 0) {
      //   // 删除所有重复的选项
      //   this.form.tags = this.form.tags.filter(option => option !== value)
      // } else if (value.length > 10) {
      //   this.form.tags = value.slice(0, 10)
      //   this.$message.error('最多只能添加 10 个标签')
      // } else {
      //   // 添加新选项
      //   this.form.tags.push(value)
      // }
      // if (value.length > 10) {
      //   // 如果超过最大数量限制，还原为之前的值
      //   this.form.tags = value.slice(0, 10)
      //   this.$message.error('最多只能添加 10 个标签')
      //   // alert('')
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FBFCFE;
      width: 160px;
      height: 120px;
    }
  }
}
.addDialog {
  height: 396px;
  padding: 20px;
  .errorTips {
    width: 100%;
    padding: 8px 20px;
    background: rgba(254, 236, 236, 0.4);
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f53f3f;
    line-height: 22px;
  }
}
.tagText{
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
.formTips {
  margin-top: 12px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
}
</style>
