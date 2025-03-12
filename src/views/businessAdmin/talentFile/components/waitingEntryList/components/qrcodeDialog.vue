<!-- 新增面试 -->
<template>
  <el-dialog
    title="入职二维码"
    :visible.sync="visible"
    width="576px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div id="qrCode" class="content">
      <AppQrcode :src="src" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">下载二维码</el-button>
    </div>
  </el-dialog>
</template>
<script>
import AppQrcode from '@/components/AppQrcode'
import html2canvas from 'html2canvas'
import { downloadQrCodeAjax } from '@/api/businessAdmin/talentFile'
export default {
  components: {
    AppQrcode
  },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      post: {},
      src: ''
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {
    if (this.row.id) {
      this.post = { ...this.row }
    }
    this.getQRCode()
  },
  methods: {
    async getQRCode() {
      const res = await downloadQrCodeAjax()

      if (res) {
        this.src = res.data
      }
    },
    handleClose() {
      this.$emit('close')
    },
    capture() {
      // 获取要转换的 HTML 元素
      const element = document.getElementById('qrCode')

      // 使用 html2canvas 将元素转换为 canvas
      html2canvas(element).then(canvas => {
        // 创建一个图片对象并设置图片数据为 canvas 的数据
        const imgData = canvas.toDataURL('image/png')

        // 创建一个链接元素并设置下载属性，将图片数据链接赋值给 href
        const link = document.createElement('a')
        link.download = '下载二维码.png'
        link.href = imgData

        // 将链接元素插入到文档中并触发点击
        document.body.appendChild(link)
        link.click()

        // 删除链接元素
        document.body.removeChild(link)
      })
    },
    submit() {
      this.capture()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0px !important;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('../../../../../../assets/image/qrbg.png') no-repeat center;
  height: 600px;
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }
}
.dialog-footer {
  text-align: center;
}
.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
