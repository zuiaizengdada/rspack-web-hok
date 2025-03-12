<template>
  <div class="uploadItem">
    <div class="uploadItemIcon">
      <svg-icon :icon-class="renderIcon()" class="upload-icon" />
    </div>
    <div class="uploadItemContent">
      <div class="upload-file-name text_hidden_ellipsis" :class="`upload-file-name-${status}`" @click="openFile">{{ name }}</div>
    </div>
    <div class="uploadItemBtn">
      <div class="uploadItemBtnText" @click="openFile">查看</div>
      <div class="uploadItemBtnText" @click="downFile">
        <i v-if="downloading" class="el-icon-loading" />
        <span v-else>下载</span>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="url" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getFileType, downLink } from '@/utils/index'
export default {
  components: {},
  filters: {
    // 获取文件大小
    getFileSize(size) {
      if (typeof size !== 'number') {
        return '未知'
      }
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      return size
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      downloading: false,
      dialogVisible: false
    }
  },
  mounted() {},
  methods: {
    renderIcon() {
      const suffix = getFileType(this.name).suffix
      const iconObj = {
        'jpg': 'jpg',
        'png': 'png',
        'bmp': 'bmp',
        'pdf': 'pdfwenjian',
        'doc': 'doc',
        'docx': 'docx',
        'xls': 'xls',
        'xlsx': 'xlsx'
      }
      console.log('suffix', suffix)
      return iconObj[suffix]
    },
    openFile() {
      if (this.url) {
        console.log(this.url)
        const fileType = getFileType(this.name)
        if (fileType.fileType === 'file') {
          if (fileType.suffix === 'pdf') {
            window.open(this.url)
          } else {
            const url = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.url
            window.open(url)
          }
        } else if (fileType.fileType === 'img') {
          this.dialogVisible = true
        }
      }
    },
    downFile() {
      this.downloading = true
      downLink(this.url, this.name).then(() => {
        this.downloading = false
      }).catch(() => {
        this.downloading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadItem {
    display: flex;
    width: 336px;
    height: 74px;
    // height: 98px;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    .uploadItemIcon {
      padding-top: 16px;
      padding-left: 24px;
      padding-bottom: 18px;
      .upload-icon {
        width: 34px;
        height: 40px;
      }
    }
    .uploadItemContent {
        width: 147px;
        margin-left: 15px;
        .upload-file-name {
          height: 74px;
          line-height: 74px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #333333;
          cursor: pointer;
        }
        .upload-file-name-3 {
          &:hover {
            color: #0C6FFF;
          }
        }
        .upload-file-progress {
            width: 620px;
        }
        .upload-file-status {
            font-size: 14px;
            font-family: AppleSystemUIFont;
            color: #777777;
            line-height: 22px;
            margin-top: 8px;
        }
        .upload-file-size {
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #999999;
            line-height: 20px;
        }
        .status0 {
           color: #FF7D00;
        }
        .status1{
            color: #777777;
        }
        .status2 {
            color: #F53F3F;
        }
        .status4 {
            color: #333333;
        }
    }
    .uploadItemBtn {
        width: 117px;
        display: flex;
        align-items: center;
        justify-content: center;
        .uploadItemBtnText {
          margin-left: 10px;
          margin-right: 10px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #0C6FFF;
          line-height: 22px;
          cursor: pointer;
        }
    }
}
</style>
