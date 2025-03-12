<!-- 驳回 -->
<template>
  <el-dialog
    title="提示"
    :visible.sync="visible"
    width="415px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="content">
      <p>请确认操作 {{ nameList }} 已到岗吗？</p>
      <p>操作后将不能撤回，请谨慎操作！</p>
      <p class="tip">注：已到岗人员可进行线上签约</p>
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
import { arrivalAjax } from '@/api/businessAdmin/talentFile'

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
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      post: {},
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
      console.log(this.selectList)
      const personnelEntryInfoIds = this.selectList.map(item => item.id)
      this.loading = true
      arrivalAjax(personnelEntryInfoIds)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  font-size: 14px;
  padding: 0 20px;
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }
  .tip {
    color: #fa360a;
    font-size: 14px;
    font-weight: 常规体;
    font-family: '苹方-简';
    margin-top: 10px;
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
