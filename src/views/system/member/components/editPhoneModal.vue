<template>
  <!-- 新建标签弹框层 -->
  <AppDialog
    v-model="visible"
    title="修改手机"
    width="600px"
    height="auto"
    :loading="loading"
    :before-close="(done) => beforeClose(done)"
    @success="formSuccess"
  >
    <div class="p-10 choose_resource m-t-20 overflowOuto">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model.trim="form.phone"
            placeholder="请输入手机号码"
            class="w-300"
            clearable
          />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model.trim="form.code"
            placeholder="请输入验证码"
            class="w-200"
            clearable
          />
          <div class="w-90 btnColor" @click="handleCode">{{ codeText }}</div>
        </el-form-item>
        <el-form-item label="变更原因" prop="remark">
          <el-input
            v-model.trim="form.remark"
            placeholder="请输入变更原因"
            class="w-300"
            type="textarea"
            clearable
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图片证据" prop="url">
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

          <div class="tips">最多上传1张jpg,png,bmp格式的图片，单张图片不能大于5M</div>
          <div class="tips_red">截图必须包含用户沟通记录，确保是用户自己主动发起的修改申请</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userModifyUserPhone } from '@/api/user/member'
import { getOssConfig } from '@/api/file'
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import { sendCode } from '@/api/user/member'
export default {
  components: {
    AppDialog,
    uploadItem
  },
  data() {
    const reg = /^(?:(?:\+|00)86)?[0-9]\d{10}$/
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
        phone: '',
        code: '',
        remark: '',
        uid: '',
        url: ''
      },
      codeText: '发送验证码',
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
        phone: [
          { required: true, validator: validate, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入变更原因', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请上传图片证据', trigger: 'blur' }
        ]
      },
      phone: '',
      visible: false
    }
  },
  created() {
    this.getOssConfig()
  },
  methods: {
    updateTime() {
      let time = 60
      this.codeText = `${time}s后重新发送`
      const interval = setInterval(() => {
        if (time === 0) {
          clearInterval(interval)
          this.codeText = '发送验证码'
        } else {
          this.codeText = `${time}s后重新发送`
          time--
        }
      }, 1000)
    },
    async handleCode() {
      if (this.codeText !== '发送验证码') return
      this.codeText = '发送中...'
      if (this.form.phone === '') return this.$message.warning('请输入手机号码')

      const res = await sendCode({ phone: this.form.phone })
      if (res.code !== 1) {
        this.codeText = '发送验证码'
      } else {
        // 发送验证码
        this.updateTime()
      }
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
      this.fileList = []
      this.$refs.form && this.$refs.form.resetFields()

      const { phone, id } = JSON.parse(JSON.stringify(row))
      this.form = {
        phone: '',
        platformUserId: id,
        remark: '',
        url: ''
      }
      this.phone = phone
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
          if (this.phone === this.form.phone) {
            this.$notify.warning('手机号码不能与原号码一致')
            return
          }
          try {
            const { code } = await userModifyUserPhone(this.form)
            if (code === 1) {
              this.$notify.success('修改成功')
              this.visible = false
              this.$emit('success')
            }
          } catch (e) {
            console.log(e)
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
      this.form.url = ''
      this.$refs.MyUpload.clearFiles()
      this.$refs.form.clearValidate('url')
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
        ossTeacherFolder: `hok_memberDetail/${fileType.fileType}/`,
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
        this.form.url = self.url
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
        this.form.url = self.url
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
      this.form.url = ''
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
.tips_red{
  color:red;
}
.el-icon-plus {
    font-weight: 700;
    font-size: 14px;
    color: #333333;
}
.w-90{
  display: inline-block;
  width:90px;
  text-align: center;
  margin-left: 10px;
  cursor: pointer;
  border-radius:5px;
  font-size: 12px;
  color:#999999;
  background: #0C6FFF;
  color:#fff;
  &:active{
    font-size: 13px;
  }
  &:hover{
    opacity: 0.8;
  }
}
</style>
