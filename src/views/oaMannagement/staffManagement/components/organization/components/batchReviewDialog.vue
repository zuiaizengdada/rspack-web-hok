<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="795px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="show overflowOuto overflowOutoStop" @scroll="scrollEvent">
        <vue-pdf-embed :source="pdfUrl" />
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
import VuePdfEmbed from 'vue-pdf-embed'

export default {
  components: { reviewRejectDialog, VuePdfEmbed },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => ({})
    },
    signFileList: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {},
      loading: false,
      rejectAudtVisible: false,
      pdfUrl: ''
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
    this.pdfUrl = this.row.url
  },
  methods: {
    handleClose() {
      this.getVisible = false
    },
    scrollEvent() {
      // 实现滚动逻辑
    },
    handleRejectAudt() {
      this.rejectAudtVisible = true
    },
    async handleSuccssAudt() {
      try {
        this.loading = true
        await signAuditAjax({
          id: this.row.id,
          status: 1
        })
        this.$message.success('审核成功')
        this.$emit('success')
        this.handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async handleSuccssNextAudt() {
      try {
        this.loading = true
        await signAuditAjax({
          id: this.row.id,
          status: 1
        })
        this.$message.success('审核成功')
        this.$emit('success', true)
        this.handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async rejectAudtSuccess() {
      this.$emit('success')
      this.handleClose()
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
