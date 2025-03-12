<!-- 驳回 -->
<template>
  <el-dialog
    title="银行卡识别"
    :visible.sync="visible"
    width="566px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="content">
      <img :src="dialogInfo.url" class="content-img" />
      <div>
        <div>识别结果</div>
        <div class="content-cardNo">
          银行卡卡号<el-input
            readonly
            :value="dialogInfo.cardNo ? dialogInfo.cardNo : '识别失败'"
            style="width: 211px; margin-left: 10px"
            :class="{
              'content-cardNoFail': !dialogInfo.cardNo
            }"
          />
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
      <!-- <el-button type="primary" @click="submit" v-if="dialogInfo.cardNo"
        >确 定</el-button
      >
      <el-button type="primary" @click="aginUpload" v-else>重新上传</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
import { arrivalAjax } from '@/api/businessAdmin/talentFile'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    dialogInfo: {
      type: Object,
      default: () => {
        return {
          url: ''
        }
      }
    }
  },
  data() {
    return {}
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
  created() {},
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$emit('success')
    },
    aginUpload() {
      this.$emit('aginUploadCad')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  font-size: 14px;
  display: flex;
  .content-img {
    width: 214px;
    height: 128px;
    border-radius: 4px;
    margin-right: 20px;
    object-fit: contain;
    background-color: #fafafa;
  }
  .content-cardNo {
    margin-top: 28px;
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
.content-cardNoFail ::v-deep .el-input__inner {
  color: #ff2020;
}
</style>
