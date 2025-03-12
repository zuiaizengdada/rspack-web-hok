<template>
  <!-- 签到码弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="config.previewTitle"
    width="694px"
    height="auto"
  >
    <div class="previewCode overflowOuto">
      <el-image style="width: 326px;" :src="config.url" fit="fill" />
      <el-button size="small" class="m-t-36" type="primary" :loading="loading" @click="downUrl(config.url)">下载二维码</el-button>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '',
          url: '',
          previewTitle: '签到码'
        }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {},
  methods: {
    downUrl(url) {
      if (!url) {
        return this.$message.error('下载失败')
      }
      const _this = this
      _this.loading = true
      const xmlhttp = new XMLHttpRequest()
      xmlhttp.open('GET', url, true)
      xmlhttp.responseType = 'blob'
      xmlhttp.onload = function () {
        if (this.status === 200) {
          const blob = this.response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = _this.config.title + '.jpg'

          // 此写法兼容可火狐浏览器
          document.body.appendChild(link)

          const evt = document.createEvent('MouseEvents')
          evt.initEvent('click', false, false)
          link.dispatchEvent(evt)
          window.URL.revokeObjectURL(link.href)
          document.body.removeChild(link)
        }
        _this.loading = false
      }
      xmlhttp.send()
    }
  }
}
</script>

<style lang='scss' scoped>
.previewCode {
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.m-t-36 {
    margin-top: 36px;
}
</style>
