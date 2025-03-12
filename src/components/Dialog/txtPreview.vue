<template>
  <div v-if="visible" class="modal-bg amap-sug-result">
    <AppDialog
      v-model="visible"
      title="文件预览"
      :append-to-body="false"
      :loading="loading"
      height="auto"
      width="100vw"
      :top="top"
    >
      <div v-loading="loading" class="txtPreview overflowOuto">
        <template v-if="fileType === 'txt'">
          {{ value }}
        </template>
        <template v-else>
          <iframe :src="src" width="100%" height="100%" style="border:none;" />
        </template>
      </div>
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      top: '0px',
      src: '',
      value: '',
      fileType: ''
    }
  },
  watch: {
    visible: {
      handler(val) {
        // val && this.getTxt(this.src)
        if (val) {
          if (this.fileType === 'txt') {
            this.getTxt(this.src)
          }
        } else {
          this.src = ''
          this.fileType = ''
          this.value = ''
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.top = '0px'
  },
  methods: {
    // 读取txt内容
    getTxt(src) {
      this.loading = true
      const that = this
      const xhr = new XMLHttpRequest()
      xhr.open('get', src, true)
      xhr.responseType = 'blob'
      xhr.onload = (e) => {
        if (e.currentTarget.status === 200) {
          const reader = new FileReader()
          reader.readAsText(e.currentTarget.response)// 非常重要
          reader.onload = () => {
            that.value = reader.result
            console.log('文档', that.value)
            this.loading = false
          }
        }
      }
      xhr.send()
    }
  }
}
</script>

<style lang='scss' scoped>
.modal-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 999999999999999999;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
.txtPreview {
  width: 100vw;
  height: calc(100vh - 52px) ;
}
::v-deep {
  .dialog-body {
    border-radius: 0!important;
  }
  .el-dialog {
    border-radius: 0!important;
  }
}
</style>
