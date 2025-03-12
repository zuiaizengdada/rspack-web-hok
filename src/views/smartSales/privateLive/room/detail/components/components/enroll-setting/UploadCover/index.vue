<template>
  <div>
    <AppUploadViewCropper
      key="MUploadImg"
      ref="MUploadImg"
      upload-text="上传图片"

      accept=".jpg,.jpeg,.png"
      :max-length="1"
      :cropper-option="cropper"
      @change="onSelectImg"
    />
  </div>
</template>
<script>
import AppUploadViewCropper from '@/components/AppUploadViewCropper/upload'
import { getFileType } from '@/utils/index'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
export default {
  components: {
    AppUploadViewCropper
  },
  data() {
    return {
      getLiveOssCConfig,
      cropper: {
        fixed: true, // 是否开启截图框宽高固定比例
        infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: true, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true, // 截图框能否拖动	true	true | false
        fixedNumber: [16, 9], // 截图框的宽高比例 [宽度, 高度]
        original: false,
        autoCropWidth: 8000
      }
    }
  },
  mounted() {
    this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([
      { status: 3, url: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg' }
    ])
    // // this.form.coverImgUrl = ''
    // this.$refs.MUpload.setFileList([{
    //   status: 3,
    //   url: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg'
    // }])
  },
  methods: {
    onSelectImg(res) {
      this.$emit('upload', res[0].url)
      console.log(res, 'ressss')
    },
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
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
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.$emit('upload', res[0].url)
        // this.form.imgUrl = res[0].url
      }
    }
  }
}
</script>
<style lang="scss" scoped>
 .formTips {
    margin-top: 8px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    line-height: 20px;
  }
</style>
