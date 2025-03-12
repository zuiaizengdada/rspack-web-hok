<template>
  <!-- ai总结 生成摘要内容 -->
  <AppDialog
    v-model="visible"
    subtitle-v-step="1"
    class="abstract-dialog"
    title=" "
    width="650px"
    height="auto"
    top="10vh"
    @close="close"
  >
    <div class="abstract-cnt">
      <div class="title mb4">全文摘要</div>
      <div class="txt">{{ abstract }}</div>
      <div class="copy" @click="copyBtn">
        <i v-clipboard:copy="abstract" class="el-icon-document-copy" /> 复制
      </div>
      <div class="title">章节概述</div>
      <div class="txt" v-html="outline" />
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button class="sum-btn" size="mini" plain @click.stop="resetFn">
        <div class="flex flex-middle">
          <img src="@/assets/image/aiIcon.gif" alt="" />
          重新生成
        </div>
      </el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import clipboard from '@/directive/clipboard/index.js'
import { copy } from '@/utils'
export default {
  directives: {
    clipboard
  },
  components: {
    AppDialog
  },
  props: {
    success: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      abstract: '',
      outline: ''
    }
  },
  methods: {
    open(info) {
      this.visible = true
      this.abstract = info.fullTextAbstract
      this.outline = info.outline
    },
    close() {
      this.abstract = ''
      this.outline = ''
      this.visible = false
    },
    resetFn() {
      this.$emit('reset')
      this.close()
    },
    copyBtn() {
      copy(this.abstract)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.abstract-dialog {
  .abstract-cnt {
    min-height: 200px;
    max-height: 400px;
    width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 16px 20px;
    border-bottom: 1px solid #d8d8d8;
    .title {
      color: #333333;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
    }
    .mb4 {
      margin-bottom: 14px;
    }
    .txt {
      color: #333333;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
    }
    .copy {
      color: #979797;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      padding: 20px 0;
      margin-bottom: 14px;
      border-bottom: 1px solid #d9d9d9;
      cursor: pointer;
    }
    .cell {
      margin: 14px 0;
      width: 100%;
      display: flex;
      align-items: center;
      .num {
        width: 32px;
        height: 32px;
        background: #ff7d00;
        color: #ffffff;
        font-size: 20px;
        font-weight: 700;
        line-height: 32px;
        text-align: center;
        z-index: 1;
        border-radius: 50%;
      }
      .cell-txt {
        width: 100%;
        padding: 12px 12px 12px 30px;
        border-radius: 10px;
        background: #fffbf1;
        margin-left: -16px;
      }
    }
  }
  .sum-btn {
    background: linear-gradient(270deg, #293efe 0%, #aa20ff 100%);
    color: #fff;
    border: none;
    margin-left: 8px;
    padding: 4px 14px 4px 8px;
    vertical-align: middle;
    &:hover,
    &:focus {
      background: linear-gradient(270deg, #293efe 0%, #aa20ff 100%);
      color: #fff;
      opacity: 0.9;
    }
    img {
      height: 20px;
      width: 20px;
      margin-right: 4px;
    }
  }
}
</style>
