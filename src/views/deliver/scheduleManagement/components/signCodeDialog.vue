<template>
  <!-- 签到码弹框 -->
  <AppDialog
    v-model="config.visible"
    title="签到码"
    :footer-text="['重新生成二维码','取消']"
    width="694px"
    top="100px"
    :loading="loading"
    class="dialog-container"
    height="100%"
    @success="handleSuccess"
  >
    <div v-loading="loading" class="signCodeDialog overflowOuto">
      <div class="formDetail">
        <el-row>
          <el-col :span="24" class="formDetailView">
            <div class="formLabel">IP：</div>
            <div class="formValue">{{ form.lecturerNameList | filterslecturer }}</div>
          </el-col>
          <el-col :span="24" class="formDetailView">
            <div class="formLabel">课程名称：</div>
            <div class="formValue">
              <el-tag v-for="(item,index) in form.goodsNameList" :key="index" class="tagType" type="info">{{ item }}</el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="formDetailView">
            <div class="formLabel">班期：</div>
            <div class="formValue">{{ form.scheduleNum }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="formDetailView">
            <div class="formLabel">交付系统登录码：</div>
            <AppQrcode
              ref="qrCode"
              :size="400"
              style="width:80px;height:80px"
              :correct-level="3"
              :logo-src="logoSrc"
              :src="qrcodeUrl"
              :logo-scale="0.3"
            />
            <!-- <img style="width:80px;height:80px" src="@/assets/image/deliver_qrcode.png"> -->
            <div class="flex flex-center flex-middle" style="width:180px">
              <el-button type="text" @click="handleClickPreview({qrcodeUrl:$refs.qrCode.$el.src,isLogin:true})">预览</el-button>
              <el-button type="text" :loading="downLoading" @click="downDeliverUrl">下载二维码</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-table max-height="380" :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="sessionDate" label="交付场次">
          <template slot-scope="{ row }">
            <span class="sessionDate">{{ row.sessionDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="qrcodeUrl" label="签到二维码" center>
          <template slot-scope="{ row }">
            <el-image style="width: 64px; height: 64px" :src="row.qrcodeUrl" fit="contain" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleClickPreview(row)">预览</el-button>
            <el-button type="text" :loading="row.downLoading" @click="downImgUrl(row)">下载二维码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="dialog-logo">
        <div class="dialog-upload">
          <div class="title">上传LOGO自定义签到二维码样式</div>
          <el-upload
            ref="upload"
            :class="{upload:fileList.length === 1}"
            drag
            :before-upload="beforeUpload"
            :http-request="upload"
            :limit="2"
            action="#"
            accept=".jpg,.png"
            list-type="picture"
            :file-list="fileList"
            :show-file-list="false"
          >
            <template v-if="fileList.length > 0">
              <div
                v-for="item in fileList"
                :key="item.url"
                class="file-container"
                @mouseleave="show = false"
                @mouseenter="show = true"
              >
                <img
                  class="file-img"
                  :src="item.url || item.file.url"
                />
                <transition name="el-zoom-in-bottom">
                  <div v-show="show" class="file-mock">重新上传</div>
                </transition>
              </div>
            </template>
            <template v-else>
              <svg-icon icon-class="add" />
              <div class="el-upload__text"><em>点击/拖拽上传</em></div>
              <div class="el-upload__tip">
                上传图片格式为jpg,png，单张图片不大于30K，建议尺寸比例1:1
              </div>
            </template>

          </el-upload>
        </div>
        <div v-if="logoUrl" class="dialog-qrcode">
          <div class="title">预览二维码</div>
          <div class="dialog-qrcode_box">
            <el-image
              :src="logoUrl"
              fit="contain"
            />
            <span>签到页LOGO会同步更新，扫码直接体验</span>
          </div>
        </div>
      </div>
    </div>
    <previewCode :config="previewCodeConfig" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import previewCode from './previewCode'
import { downLink } from '@/utils/index'
import { getFileType } from '@/utils/index'
import { getOssConfig } from '@/api/file'
import AppQrcode from '@/components/AppQrcode'
import logo from '@/assets/image/loginLogo.png'
const OSS = require('ali-oss')
import { getDeliveryScheduleSignQrcodeList, deliveryScheduleLogo, deliveryScheduleLogoView } from '@/api/deliver/scheduleManagement'
export default {
  components: {
    AppDialog,
    previewCode,
    AppQrcode
  },
  filters: {
    filterslecturer(val) {
      if (!val) {
        return ''
      } else {
        return val.join(',')
      }
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          scheduleId: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        lecturerNameList: '',
        goodsName: '',
        scheduleNum: '',
        goodsNameList: []
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
      logoSrc: logo,
      show: false,
      tableData: [],
      previewCodeConfig: {
        visible: false,
        title: '',
        url: '',
        previewTitle: ''
      },
      downLoading: false,
      loading: false,
      fileList: [],
      logoUrl: '',
      contentType: {
        'jpg': 'image/jpeg',
        'png': 'image/png'
      },
      qrcodeUrl: `${process.env.VUE_APP_TEMPLATE_URL}/deliver/login`
    }
  },
  watch: {
    'config.visible'(val) {
      val && this.getSignQrcodeList()
    }
  },
  created() {
    this.getOssConfig()
  },
  methods: {
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
          // eslint-disable-next-line no-undef
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    // 点击预览
    handleClickPreview(row) {
      let title = `【${this.form.goodsName}】${this.form.scheduleNum} ${row.sessionDate}场`
      if (row.isLogin) {
        title = `${this.form.scheduleNum} 交付系统登录码`
      }
      console.log(row.isLogin)
      this.previewCodeConfig = {
        visible: true,
        title,
        url: row.qrcodeUrl,
        previewTitle: row.isLogin ? '登录码' : '签到码'
      }
    },
    submit() {
      this.$refs.upload.submit()
    },
    async handleSuccess() {
      if (!this.fileList.length) {
        return
      }
      await deliveryScheduleLogo({
        scheduleId: this.config.scheduleId,
        logo: this.fileList[0].url
      })
      this.fileList = []
      this.logoUrl = ''
      this.getSignQrcodeList()
    },
    // 查询签到码列表
    getSignQrcodeList() {
      this.loading = true
      this.qrcodeUrl = `${process.env.VUE_APP_TEMPLATE_URL}/deliver/login`
      getDeliveryScheduleSignQrcodeList(this.config.scheduleId).then(res => {
        console.log(res, 'res')
        this.tableData = res.data || []
        this.loading = false
        res.data.sessionQrcodeVoList.map(v => {
          v.downLoading = false
        })
        this.tableData = res.data.sessionQrcodeVoList
        this.form = {
          lecturerNameList: res.data.lecturerNameList,
          goodsName: res.data.goodsName,
          goodsNameList: res.data.goodsNameList,
          scheduleNum: res.data.scheduleNum
        }
      }).catch(() => {
        this.loading = false
      })
    },
    beforeUpload(file) {
      const isLt30K = file.size / 1024 < 30
      console.log(isLt30K)
      !isLt30K && this.$message.error('上传文件大小不能超过 30K!')
      return isLt30K
    },
    async upload(e) {
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
        status: 0, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_deliver/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        creatTime: new Date().getTime(),
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.fileList = [obj]
      this.uploadTask()
    },
    // 更新任务队列
    uploadTask() {
      const arrStatus = {
        'wait': 0,
        'uploading': 0,
        'fail': 0,
        'success': 0,
        'pause': 0
      }
      const arrStatusObj = { 0: 'wait', 1: 'uploading', 2: 'fail', 3: 'success', 4: 'pause' }
      this.fileList.map(v => {
        arrStatus[arrStatusObj[v.status]]++
      })

      if (arrStatus.uploading < 3) {
        // 更新上传队列
        if (arrStatus.wait > 0) {
          const index = this.fileList.findIndex(v => v.status === 0)
          index > -1 && this.canUpload(this.fileList[index])
        }
      }
      this.fileList.map(v => {
        v.ranking = {
          1: 1,
          4: 2,
          0: 3,
          2: 4,
          3: 5,
          5: 6
        }[v.status]
      })
      this.$forceUpdate()
      if ((arrStatus.wait > 0 && arrStatus.uploading < 3)) {
        this.uploadTask()
      }
    },
    async getLogoView(fileList) {
      await deliveryScheduleLogoView({
        logo: fileList.url,
        scheduleId: this.config.scheduleId
      }).then(({ data }) => {
        this.logoUrl = data
      })
    },
    canUpload(obj) {
      if (obj.status !== 0 && obj.status !== 1) {
        return
      }
      const arrStatus = {
        'wait': 0,
        'uploading': 0,
        'fail': 0,
        'success': 0,
        'pause': 0
      }
      const arrStatusObj = { 0: 'wait', 1: 'uploading', 2: 'fail', 3: 'success', 4: 'pause' }
      this.fileList.map(v => {
        arrStatus[arrStatusObj[v.status]]++
      })
      if (arrStatus.uploading < 3) {
        obj.status = 1
        obj.creatTime = new Date().getTime()
        if (obj.abortCheckpoint) {
          this.resumeUpload(obj)
        } else {
          this.startUpload(obj)
        }
      } else {
        obj.status = 0
      }
    },
    // 上传重试
    async resumeUpload(self) {
      const fileType = getFileType(self.name)
      self.status = 1
      // 设置重试次数为五次。
      try {
        const headers = {
          'Content-Type': this.contentType[fileType.suffix]
        }
        const result = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          checkpoint: self.abortCheckpoint,
          headers,
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
        // this.$emit('change', this.fileList)
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
    async startUpload(self) {
      const fileType = getFileType(self.name)
      try {
        const headers = {
          'Content-Type': this.contentType[fileType.suffix]
        }
        console.log(headers, 'headers')
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
          headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + self.name, self.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        this.getLogoView(self)
        // this.$emit('change', this.fileList)
        this.uploadTask()
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
          this.uploadTask()
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
          this.uploadTask()
        }
      }
    },
    async downDeliverUrl() {
      const title = `${this.form.scheduleNum} 交付系统登录码.jpg`
      const iconUrl = this.$refs.qrCode.$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = title
      a.href = iconUrl
      a.dispatchEvent(event)
      this.downLoading = false
    },
    // 下载二维码
    downImgUrl(row) {
      if (!row.qrcodeUrl) {
        return this.$message.error('下载失败')
      }
      console.log(row)
      row.downLoading = true
      downLink(row.qrcodeUrl, `【${this.form.goodsName}】${this.form.scheduleNum} ${row.sessionDate}场.jpg`).then(res => {
        row.downLoading = false
      }).catch(() => {
        row.downLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.signCodeDialog {
  padding: 20px;
  box-sizing: border-box;

  .formDetail {
    .formDetailView {
      margin-bottom: 20px;
      display: flex;
    }
    .formLabel {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
    }
    .formValue {
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
}
.dialog-container ::v-deep{
  .dialog-logo{
    display: flex;
    width: 640px;
    margin-top: 20px;
    .title{
      margin-bottom: 16px;
    }
    .dialog-upload{
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #333333;
      font-weight: 400;
      font-size: 16px;
      .el-upload-dragger{
        width: 310px;
        height: 136px;
        padding: 20px;
        svg{
          margin:5px 0 13px 0;
        }
        .el-upload__tip{
          color: #999999;
        }
      }
    }
    .dialog-qrcode{
      flex: 1;
      color: #777777;
      font-size: 16px;
      .dialog-qrcode_box{
        width: 317px;
        height: 136px;
        background: #FAFAFA;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 7px;
        font-size: 12px;
        color: #999999;
        img{
          width: 100px;
          height: 100px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .upload{
    .el-upload-dragger{
      padding: 0px !important;
      width: 136px !important;
      height: 136px !important;
    }
  }
  .file-container{
    position: relative;
    width: 136px;
    height: 136px;
    border-radius: 4px;
    .file-img{
      height: 100%;
      width: 100%;
    }
    .file-mock{
      position: absolute;
      bottom: 0px;
      text-align: center;
      height: 24px;
      width: 100%;
      opacity: 0.8;
      background: #333333;
      font-size: 12px;
      color: #FFFFFF;
      cursor: pointer;
    }
  }
}

.sessionDate {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.tagType{
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
