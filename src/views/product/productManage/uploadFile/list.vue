<template>
  <div class="fileListView" @click.stop="openFile">
    <img
      v-if="['xls', 'xlsx', 'cvs', 'xlsm'].includes(imgType)"
      src="@/assets/image/pdf.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else-if="['ppt', 'pptx'].includes(imgType)"
      src="@/assets/image/ppt.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else-if="['doc', 'docx', 'pdf'].includes(imgType)"
      src="@/assets/image/ppt2.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else-if="['word'].includes(imgType)"
      src="@/assets/image/word.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else-if="['txt'].includes(imgType)"
      src="@/assets/image/txt.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else-if="['jpg'].includes(imgType)"
      src="@/assets/image/tupian.png"
      fit="contain"
      class="size-icon"
    />
    <img
      v-else
      src="@/assets/image/weizhigeshi.png"
      fit="contain"
      class="size-icon"
    />
    <div class="fileName">
      <textShowMore :line-clamp="1" :text="fileName" />
    </div>
    <div class="fileBtn">
      <!-- <div v-if="status === 3" class="fileBtnIcon" @click="openFile()" @mouseenter="alignUploadShow = true" @mouseleave="alignUploadShow = false">
        <img v-if="alignUploadShow" src="@/assets/image/aigc/filePreview_c.png">
        <img v-else src="@/assets/image/aigc/filePreview.png">
        <div v-if="alignUploadShow" class="preview">预览</div>
      </div> -->
      <div v-if="!isReview" class="fileBtnIcon">
        <div v-if="alignUploadShow2" class="preview">删除</div>
        <img
          src="@/assets/image/aigc/aiDel.png"
          @click.stop="$emit('del')"
          @mouseenter="alignUploadShow2 = true"
          @mouseleave="alignUploadShow2 = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getOssConfig } from '@/api/file'
import textShowMore from '@/components/textShowMore/index2.vue'
import Dialog from '@/components/Dialog/index.js'
export default {
  components: {
    textShowMore
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    status: {
      type: [Number, String],
      default: ''
    },
    isReview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      alignUploadShow: false,
      alignUploadShow2: false
    }
  },
  computed: {
    imgType() {
      return this.url.split('.').pop().toLowerCase()
    },
    fileName() {
      const arr = this.url.split('/')
      if (arr.length > 0) {
        const length = arr.length
        return arr[length - 1]
      } else {
        return ''
      }
    }
  },
  mounted() {},
  methods: {
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then(res => {
          this.config = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
          // eslint-disable-next-line no-undef
          // this.client = new OSS(this.config)
        })
        .catch(err => {
          console.log(err)
          this.$message.error({
            message: '获取oss配置失败',
            customClass: 'amap-sug-result'
          })
          this.loading = false
        })
    },
    // 文件预览
    openFile() {
      if (!this.url) {
        return
      }
      if (['txt', 'TXT'].includes(this.$getFileType(this.url).suffix)) {
        Dialog.open({
          type: 'TxtPreview',
          visible: true,
          fileType: 'txt',
          src: this.url
        })
        return
      }
      if (['pdf', 'PDF'].includes(this.$getFileType(this.url).suffix)) {
        // window.open(this.url)
        Dialog.open({
          type: 'TxtPreview',
          visible: true,
          fileType: 'pdf',
          src: this.url
        })
        return
      }
      // 判断是否是图片
      if (
        ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG'].includes(
          this.$getFileType(this.url).suffix
        )
      ) {
        window.open(this.url, '_blank')
        return
      }
      const url =
        'https://view.officeapps.live.com/op/view.aspx?src=' + this.url
      Dialog.open({
        type: 'TxtPreview',
        visible: true,
        fileType: 'word',
        src: url
      })
      // window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.fileListView {
  width: 100%;
  display: flex;
  padding-left: 8px;
  padding-right: 17px;
  .size-icon {
    width: 32px;
    height: 32px;
  }
  .fileName {
    width: 166px;
    line-height: 32px;
    color: #313233;
  }
  .fileBtn {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .fileBtnIcon {
      width: 24px;
      height: 24px;
      margin-left: 3px;
      cursor: pointer;
      position: relative;
      .preview {
        position: absolute;
        top: -29px;
        left: -8px;
        width: 40px;
        height: 25px;
        background: #f7f7f7;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #67686b;
        line-height: 25px;
        text-align: center;
      }
    }
  }
}
</style>
