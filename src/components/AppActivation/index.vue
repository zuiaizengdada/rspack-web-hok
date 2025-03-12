<template>
  <el-dialog
    width="900px"
    :title="title"
    :visible.sync="visible"
    append-to-body
    custom-class="dialog-body"
    :show-close="false"
    :close-on-click-modal="false"
    :press-escape="false"
    top="10vh"
  >
    <div slot="title" class="ss-material-box-header">
      <div>{{ title }}</div>
      <i class="el-icon-close close" @click="visible = false" />
    </div>
    <div :style="{ width: '900px', height: '500px' }">
      <div class="choose_resource">
        <div>
          <span class="m-r-10">激活链接: </span>
          <el-input v-model.trim="src" placeholder="请输入" style="width: 600px; max-width: 100%" disabled class="m-r-10" />
          <el-button v-clipboard:copy="src" v-clipboard:success="clipboardSuccess" type="primary" icon="el-icon-document"> 复制 </el-button>
        </div>
        <div class="m-t-20 fl">
          <span class="m-r-10">二维码: </span>
          <AppQrcode :src="src" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// import QRCode from 'qrcodejs2'
import AppQrcode from '@/components/AppQrcode'
export default {
  name: 'AppClipboard',
  components: {
    AppQrcode
  },
  directives: {
    clipboard
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '激活'
    },
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qrcode: null
    }
  },
  mounted() {},
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    successFn() {
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
.choose_resource {
  padding: 20px;
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1020;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      background: #fafbfc;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #f2f2f2;
      color: #353535;
      font-size: 16px;
      font-weight: 500;
    }
    .close {
      color: #b2b2b2;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 66px;
      background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
    }
  }
}
</style>
