<template>
  <div class="uploadItem">
    <div class="uploadItemIcon">
      <svg-icon :icon-class="renderIcon()" class="upload-icon" />
    </div>
    <div class="uploadItemContent">
      <div class="upload-file-name text_hidden_ellipsis" :class="`upload-file-name-${status}`" @click="openFile">{{ name }}</div>
      <el-progress v-if="status !== 3" class="upload-file-progress" define-back-color="rgba(0,0,0,0.04)" :percentage="authProgress" :format="format" />
      <div v-if="status !== 3" class="upload-file-status" :class="`status${status}`">
        <span>{{ {0: '等待中...', 1: '文件上传中', 2: '上传失败',3: '文件上传成功', 4: '暂停中'}[status] }}</span>
        <span> {{ authProgress }}%</span>
      </div>
    </div>
    <div class="uploadItemBtn">
      <div v-if="status === 4" class="uploadItemBtnText" @click="$emit('again')">开始上传</div>
      <div v-if="status === 4 || status === 2" class="uploadItemBtnText" @click="$emit('again')">重新上传</div>
      <div v-if="status === 1 || status === 0" class="uploadItemBtnText" @click="$emit('del')">取消上传</div>
      <div v-if="status === 1" class="uploadItemBtnText" @click="$emit('pause')">暂停上传</div>
      <div v-if="status === 3" class="uploadItemBtnText" @click="$emit('del')">删除</div>
    </div>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="url" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
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
    // 0: 未开始上传/等待上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4:暂停上传
    status: {
      type: Number,
      default: 1
    },
    authProgress: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
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
    format() {
      return ''
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
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadItem {
    display: flex;
    width: 872px;
    // height: 98px;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    .uploadItemIcon {
        width: 72px;
        padding-top: 16px;
        padding-left: 24px;
        .upload-icon {
            width: 34px;
            height: 40px;
        }
    }
    .uploadItemContent {
        width: 620px;
        padding-bottom: 16px;
        .upload-file-name {
            margin-top: 14px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #333333;
            line-height: 22px;
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
        width: 184px;
        padding-right: 18px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .uploadItemBtnText {
            font-size: 14px;
            font-weight: 400;
            color: #0C6FFF;
            line-height: 22px;
            margin-left: 8px;
            cursor: pointer;
        }
    }
}
</style>
