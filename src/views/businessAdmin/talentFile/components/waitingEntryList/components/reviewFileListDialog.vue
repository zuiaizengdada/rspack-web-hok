<!-- 驳回 -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="415px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="content">
      <div
        class="cursor-pointer"
        v-for="(item, index) in list"
        :key="index"
        @click="browse(item.fileUrl)"
      >
        {{ item.fileName }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      post: {},
      rules: {
        moveType: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        moveReason: [
          {
            required: true,
            message: '请输入移入原因',
            trigger: 'blur'
          },
          { min: 1, max: 50, message: '限制最多输入50个字符', trigger: 'blur' }
        ]
      },
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
    },
    nameList() {
      return this.selectList.map(item => item.name).join('、')
    }
  },
  created() {
    if (this.row.id) {
      this.post = { ...this.row }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$emit('success')
    },
    browse(url) {
      if (!url) {
        return
      }
      if (['txt', 'TXT'].includes(this.$getFileType(url).suffix)) {
        Dialog.open({
          type: 'TxtPreview',
          visible: true,
          src: url
        })
        return
      }
      if (
        ['pdf', 'PDF', 'png', 'PNG', 'jpg', 'JPG'].includes(
          this.$getFileType(url).suffix
        )
      ) {
        window.open(url)
        return
      }
      const url2 = 'https://view.officeapps.live.com/op/view.aspx?src=' + url
      window.open(url2)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
  color: #0c6fff;
  font-size: 14px;
  font-weight: 常规体;
  font-family: '苹方-简';
  height: 140px;
  overflow: auto;
  > div {
    margin-bottom: 8px;
  }
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
