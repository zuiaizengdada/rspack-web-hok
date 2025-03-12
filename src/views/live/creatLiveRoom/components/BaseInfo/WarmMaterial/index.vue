<template>
  <div class="container">
    <div class="relative header">
      <el-radio v-model="type" label="1" @input="handleInput">暖场图</el-radio>
      <el-radio
        v-model="type"
        label="2"
        @input="handleInput"
      >暖场视频</el-radio>
      <el-tooltip
        effect="dark"
        placement="right"
        style="position: absolute; top: -2px; left: 180px"
      >
        <div slot="content" style="line-height: 1.4">
          暖场素材可用于在未开播前进行循环播放。
        </div>
        <span style="padding: 2px"><i class="el-icon-question" /></span>
      </el-tooltip>
    </div>
    <div class="content" style="margin-top: 10px">
      <uploadView
        v-show="type == 1"
        key="MUploadImg"
        ref="MUploadImg"
        upload-text="上传素材库"
        :width="160"
        :height="120"
        accept=".jpg,.jpeg,.png"
        :before-upload="beforeUploadImg"
        :max-length="1"
        :on-check-mdk5="onCheckMdk5"
        :get-oss-c-onfig-api="getLiveOssCConfig"
        oss-teacher-folder="hok_liveRoom"
        @onClick="onImgClick"
        @change="res => fileWarmChange(res, 'warmImg')"
      >
        <template slot="tips">
          <div class="relative tipsBtn">
            <el-button type="primary" class="btn" size="small" @click="onhandleOpenMaterial(1)">暖场素材库选择</el-button>
          </div>
        </template>
      </uploadView>
      <div v-show="type== 1" class="formTips" style="margin-left: 0px;margin-top:4px;">建议图片比例16:9，支持 jpg、png 、jpeg格式，大小不超过2M，最佳分辨率750*420px。</div>
      <uploadView
        v-show="type == 2"
        key="MUploadVideo"
        ref="MUploadVideo"
        upload-text="上传素材库"
        :width="160"
        :height="120"
        accept=".mp4"
        :before-upload="beforeUploadVideo"
        :max-length="1"
        :on-check-mdk5="onCheckMdk5"
        :get-oss-c-onfig-api="getLiveOssCConfig"
        oss-teacher-folder="hok_liveRoom"
        @onClick="onVideoClick"
        @change="res => fileWarmChangeVideo(res, 'warmVideo')"
      >
        <template slot="tips">
          <div class="relative tipsBtn">
            <el-button type="primary" size="small" class="btn" @click="onhandleOpenMaterial(2)">暖场素材库选择</el-button>
          </div>
        </template>
      </uploadView>
      <div v-show="type == 2" class="formTips" style="margin-left: 0px">
        视频文件格式为MP4, 大小限5G以内，分辨率为1080P像素以下。
      </div>
    </div>
  </div>
</template>
<script>
import { getFileType } from '@/utils/index'
import { checkExistence, getLiveOssCConfig } from '@/api/liveRoom/index'
import Dialog from '@/views/live/Dialog'
import uploadView from '@/components/AppUploadView/upload'
export default {
  components: {
    uploadView
  },
  data() {
    return {
      cropper: {
        // 裁剪设置
        fixed: true, // 是否开启截图框宽高固定比例
        infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: false, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true, // 截图框能否拖动	true	true | false
        fixedNumber: [750, 1334], // 截图框的宽高比例 [宽度, 高度]
        original: false,
        autoCropWidth: 750
      },
      type: '2',
      getLiveOssCConfig
    }
  },
  mounted() {
    if (this.$store.state.creatLiveRoom.historyAddLiveForm) {
      if (this.$store.state.creatLiveRoom.historyAddLiveForm?.warmUp) {
        this.type = this.$store.state.creatLiveRoom.historyAddLiveForm.warmUp + ''
      }
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('change', val)
    },
    beforeUploadImg(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      }
      // else if (!isLt2M) {
      //   this.$message.error('上传文件大小不能超过 2M!')
      // }
      return isIMAGE
      // return isIMAGE && isLt2M
    },
    beforeUploadVideo(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['mp4', 'MP4'].includes(type)
      // const isIMAGE = file.type === 'video/mp4'
      const isLt5GB = file.size / 1024 / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持mp4格式文件!`)
      } else if (!isLt5GB) {
        this.$message.error('上传文件大小不能超过 5GB!')
      }
      return isIMAGE && isLt5GB
    },
    onCheckMdk5(md5) {
      // this.form[this.form.warmUp === 1 ? 'warmImg' : 'warmVideo'].md5 = md5
      return new Promise((resolve, reject) => {
        return checkExistence({ md5: md5, type: this.type })
          .then(res => {
            if (res.data) {
              return reject('该文件已在素材库中存在。')
            } else {
              return resolve(!res.data)
            }
          })
          .catch(() => {
            reject('文件校验失败')
          })
      })
    },

    onImgClick() {
      // this.form.warmImg = {
      //   md5: '', // 文件md5
      //   url: '', // 文件url
      //   warmUpMaterialName: '' // 素材名称
      // }
      this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([])
      // this.$refs.form && this.$refs.form.validateField('warmUp')
    },
    onVideoClick() {
      // this.form.warmVideo = {
      //   md5: '', // 文件md5
      //   url: '', // 文件url
      //   warmUpMaterialName: '' // 素材名称
      // }
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
      this.$refs.form && this.$refs.form.validateField('warmUp')
    },
    fileWarmChange(res, key) {
      console.log(res, '上传文件改变触发')
      // this.form.warmUpMaterialName = getFileType(res[0].file.name).fileName
      if (res.length > 0) {
        const url = res[0].url
        const name = res[0].name

        this.$emit('upload', { url, name, isWarmUpMaterial: 1 })
        // this.$refs.form && this.$refs.form.validateField('warmUp')
      }
    },
    fileWarmChangeVideo(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        const url = res[0].url
        const name = res[0].name

        this.$emit('upload', { url, name, isWarmUpMaterial: 1 })
        // this.$refs.form && this.$refs.form.validateField('warmUp')
      }
    },
    // 点击打开选择暖场素材库弹框
    onhandleOpenMaterial(type) {
      Dialog.open({
        type: 'SelectMaterial',
        fileType: type,
        visible: true,
        success: row => {
          Dialog.close()
          // this.form.warmUpMaterialName = row.name
          // this.form.warmUp = row.type
          // this.form.warmImg = {
          //   md5: '', // 文件md5
          //   url: row.type === 1 ? row.url : '', // 文件url
          //   warmUpMaterialName: row.type === 1 ? row.name : '' // 素材名称
          // }
          // this.form.warmVideo = {
          //   md5: '', // 文件md5
          //   url: row.type === 2 ? row.url : '', // 文件url
          //   warmUpMaterialName: row.type === 2 ? row.name : '' // 素材名称 // 素材名称
          // }
          if (this.type === '1') {
            this.$refs.MUploadImg.setFileList([
              {
                status: 3,
                url: row.url
              }
            ])
          } else {
            this.$refs.MUploadVideo.setFileList([
              {
                status: 3,
                url: row.url
              }
            ])
          }
          this.$emit('upload', {
            name: row.name,
            url: row.url,
            isWarmUpMaterial: 0
          })
          // this.$refs.form && this.$refs.form.validateField('warmUp')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formTips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #999999;
  line-height: 20px;
}
.tipsBtn {
  .btn {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
::v-deep .el-upload-dragger {
  border: 1px dashed #0c6fff;
}
</style>
