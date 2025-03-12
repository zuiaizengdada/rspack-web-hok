<!-- 新增面试 -->
<template>
  <el-dialog
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="content">
      <div style="display: flex; gap: 16px">
        <img
          style="width: 26px; height: 26px"
          mode="scaleToFill"
          src="../../../../../../assets/image/icon/icon_zhuyi.png"
        />
        <h3 class="title">移出黑名单</h3>
      </div>
      <p>确认要将{{ result.names.join('、') }}从黑名单移入简历库吗？</p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button class="del" @click="submit">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      post: [],
      result: {}
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
    this.post = [...this.row]
    this.result = {
      names: this.post.map(item => item.name),
      idList: this.post.map(item => item.id)
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$emit('submit', this.result.idList)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  text-align: right !important;
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
