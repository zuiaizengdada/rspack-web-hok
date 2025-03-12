<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="795px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="show overflowOuto overflowOutoStop" @scroll="scrollEvent">
        <pdf v-for="i in numPages" ref="pdf" :key="i" :src="pdfUrl" :page="i" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRejectAudt" :loading="loading"
          >驳 回</el-button
        >
        <el-button
          @click="handleSuccssAudt"
          type="primary"
          :loading="loading"
          v-if="index === signFileList.length - 1"
          >通 过</el-button
        >
        <el-button
          @click="handleSuccssNextAudt"
          type="primary"
          v-else
          :loading="loading"
          >通过并审核下一份</el-button
        >
        <el-button @click="handleClose" :loading="loading">关 闭</el-button>
      </div>
    </el-dialog>
    <reviewRejectDialog
      v-if="rejectAudtVisible"
      :row="form"
      :visible.sync="rejectAudtVisible"
      @close="rejectAudtVisible = false"
      @success="rejectAudtSuccess"
    />
  </div>
</template>
<script>
import { signAuditAjax } from '../../../../api/staff.js'

import reviewRejectDialog from './reviewRejectDialog.vue'
import vuePdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
const pdf = { ...vuePdf, destroyed: undefined }
export default {
  components: { reviewRejectDialog, pdf },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    signFileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      rejectAudtVisible: false,
      isReadOver: false,
      numPages: null, // pdf 总页数
      pdfUrl: '',
      index: 0,
      loading: false
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
    this.form = { ...this.signFileList[this.index] }
  },
  mounted() {
    this.pdfUrl = this.form.signedContractUrl
    this.getNumPages(this.pdfUrl)
  },
  methods: {
    getNumPages(url) {
      if (!url) {
        this.$message.warning('pdf 加载失败')
      }
      let loadingTask = pdf.createLoadingTask({
        url: url,
        CMapReaderFactory
      })
      loadingTask.promise
        .then(pdf => {
          this.numPages = pdf.numPages
        })
        .catch(err => {
          console.error('pdf 加载失败', err)
        })
      this.$forceUpdate()
    },
    handleClose() {
      this.$emit('close')
    },
    submit() {},
    handleRejectAudt() {
      this.rejectAudtVisible = true
    },
    closerejectAudtDialog() {},
    submitRejectAudtDialog() {},
    scrollEvent(event) {
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight
      if (scrollBottom < 5) {
        this.isReadOver = true
      }
    },
    //处理下一份
    handleNext() {
      if (this.index < this.signFileList.length - 1) {
        this.index++
        this.form = { ...this.signFileList[this.index] }
        this.pdfUrl = this.form.signedContractUrl
      }
    },
    handleSuccssNextAudt() {
      const params = {
        reviewStatus: 1,
        contractRelationId: this.form.contractRelationId
      }
      this.loading = true
      signAuditAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('search')
            this.handleNext()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSuccssAudt() {
      const params = {
        reviewStatus: 1,
        contractRelationId: this.form.contractRelationId
      }
      this.loading = true
      signAuditAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    rejectAudtSuccess() {
      this.rejectAudtVisible = false
      if (this.index === this.signFileList.length - 1) {
        //最后一个
        this.$emit('success')
      } else {
        this.$emit('search')
        this.handleNext()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// 禁止滚动条穿透
.overflowOutoStop {
  overscroll-behavior: contain;
}
.show {
  border-radius: 4px;
  border: 2px solid #eff2f6;
  overflow: auto;
  margin: auto;
  width: 755px;
  height: 524px;
  margin-top: 20px;
}
.content {
  padding: 0 20px;
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }

  .title {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
.del {
  background-color: #f53f3f;
  color: #ffffff;
}
.dialog-footer {
  text-align: right;
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
