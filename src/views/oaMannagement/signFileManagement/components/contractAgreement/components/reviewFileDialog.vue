<template>
    <el-dialog
      :visible.sync="visible"
      width="795px"
      :before-close="handleClose"
      :title="`预览${title}`"
      :close-on-click-modal="false"
      top="5vh"
    >
      <div class="show overflowOuto overflowOutoStop" @scroll="scrollEvent">
        <pdf v-for="i in numPages" ref="pdf" :key="i" :src="pdfUrl" :page="i" />
      </div>
    </el-dialog>
</template>
<script>
import vuePdf from 'vue-pdf'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
const pdf = { ...vuePdf, destroyed: undefined }
export default {
  components: { pdf },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
     row: {
      type: Object,
      default: () => {
        return {}
      },
    },
      title: {
        type: String,
        default: ""
      },
      url: {
        type: String,
        default: ""
      },
  },
  data() {
    return {
      form: {},
      isReadOver: false,
      numPages: null, // pdf 总页数
      pdfUrl: '',
      index: 0
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
  },
  mounted() {
    this.pdfUrl = this.url
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
    scrollEvent(event) {
      let scrollBottom =
        event.target.scrollHeight -
        event.target.scrollTop -
        event.target.clientHeight
      if (scrollBottom < 5) {
        this.isReadOver = true
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
  height: 704px;
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
