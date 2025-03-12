<template>
  <!-- 新建标签弹框层 -->
  <AppDialog
    v-model="visible"
    title="完善手机号码"
    width="694px"
    height="auto"
    :loading="loading"
    :before-close="(done) => beforeClose(done)"
    @success="formSuccess"
  >
    <div class="p-10 choose_resource m-t-20 overflowOuto">
      <el-form ref="form" :model="form" label-width="90px" :rules="rules">
        <el-form-item label="手机号码:" prop="userPhone">
          <el-input
            v-model.trim="form.userPhone"
            placeholder="请输入"
            class="w-200"
            maxlength="11"
            clearable
            @input="(e) => delNoNumber(e)"
          />
        </el-form-item>
        <el-form-item label="完善备注:" prop="remark">
          <el-input
            v-model.trim="form.remark"
            placeholder="请输入完善备注"
            style="width: 527px"
            type="textarea"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传图片" prop="file">
          <el-upload
            v-if="fileList.length < 1"
            ref="MyUpload"
            class="uploadView"
            drag
            action="#"
            :limit="1"
            accept=".jpg,.png,.jpeg,.bmp"
            :before-upload="beforeUpload"
            :http-request="upload"
            :show-file-list="false"
          >
            <i class="el-icon-plus" />
            <div class="uploadViewText">点击/拖拽上传</div>
          </el-upload>

          <template v-for="(item, index) in fileList">
            <uploadItem
              :key="index"
              class="uploadItem m-r-16 m-b-16"
              :status="item.status"
              :url="item.url"
              :auth-progress="item.authProgress"
              @del="delFile(item, index)"
              @again="alignUpload(item, index)"
            />
          </template>

          <div class="tips">只能上传1张不大于5m的jpg，png，bmp格式的图片，上传客户提供的流水沟通记录</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { completeVisitorPhone } from '@/api/deliver/advertising'
import { getOssConfig } from '@/api/file'
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
export default {
  components: {
    AppDialog,
    uploadItem
  },
  data() {
    const reg = /^[1]\d{10}$/
    var validate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        if (!reg.test(value)) {
          callback('请输入正确的手机号码')
        } else {
          callback()
        }
      }
    }
    return {
      loading: false,
      form: {
        userPhone: '',
        visitorOrderId: '',
        remark: '',
        file: ''
      },
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      fileList: [],
      rules: {
        userPhone: [
          { required: true, validator: validate, trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入完善备注', trigger: 'blur' }
        ],
        file: [
          { required: true, message: '请上传图片证据', trigger: 'blur' }
        ]
      },
      visible: false
    }
  },
  created() {
    this.getOssConfig()
  },
  methods: {
    delNoNumber(e) {
      this.form.userPhone = e.replace(/[^0-9]/g, '')
    },
    beforeClose(done) {
      if (this.getUploadFile()) {
        return this.$confirm('当前还有文件正在上传, 是否确认关闭弹框?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      }
      done()
    },
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then((res) => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          this.loading = false
          // eslint-disable-next-line no-undef
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    open(row) {
      this.loading = false
      this.fileList = []
      this.$refs.form && this.$refs.form.resetFields()

      const { userPhone, visitorOrderId } = JSON.parse(JSON.stringify(row))
      this.form = {
        userPhone,
        visitorOrderId: visitorOrderId,
        remark: '',
        file: ''
      }
      console.log(row)
      this.visible = true
    },
    formSuccess() {
      console.log(this.form)
      if (this.getUploadFile()) {
        return this.$confirm('当前还有文件正在上传, 是否确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.send()
        })
      } else {
        this.send()
      }
    },
    send() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          try {
            this.loading = true
            console.log(this.form, 'form')
            const { code } = await completeVisitorPhone(this.form)
            if (code === 1) {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.visible = false
              this.$emit('success')
              this.loading = false
            }
          } catch (e) {
            console.log(e)
            this.loading = false
          }
        }
      })
    },
    beforeUpload(file) {
      console.log(file, 'file')
      const isLt5M = file.size / 1024 / 1024 < 5
      !isLt5M && this.$message.error('上传图片大小不能超过 5MB!')
      return isLt5M
    },
    // 点击视频
    async upload(e) {
      this.form.file = ''
      this.$refs.MyUpload.clearFiles()
      this.$refs.form.clearValidate('file')
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_advertising/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList.push(obj)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      console.log(self)
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        this.form.file = self.url
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      await this.resumeUpload(self)
    },
    // 上传重试
    async resumeUpload(self) {
      self.status = 1
      // 设置重试次数为五次。
      try {
        const result = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          checkpoint: self.abortCheckpoint,
          progress: (p, cpt, res) => {
            // 为了实现断点上传，您可以在上传过程中保存断点信息（checkpoint）。发生上传错误后，将已保存的checkpoint作为参数传递给multipartUpload，此时将从上次上传失败的地方继续上传。
            // 获取上传进度。
            self.authProgress = Number((p * 100).toFixed(2))
            self.abortCheckpoint = cpt
          }
        })
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        console.log(result)
        this.form.file = self.url
      } catch (e) {
        if (e.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', e)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      this.form.file = ''
      if (item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.fileList.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
    .el-upload {
        .el-upload-dragger {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #FBFCFE;
            width: 160px;
            height: 90px;
        }
    }
    .el-form-item__label {
      font-weight: normal;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
    }
}
.choose_resource {
  max-height: 400px;
}
.uploadView, .uploadItem {
    width: 160px;
    height: 90px;
    background: #FBFCFE;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
        margin-top: 12px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        line-height: 20px;
    }
}
.tips {
    margin-top: 5px;
    margin-left: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
}
.el-icon-plus {
    font-weight: 700;
    font-size: 14px;
    color: #333333;
}
</style>
