<template>
  <el-dialog
    title="信息内容"
    :visible.sync="msgConfig.visible"
    width="30%"
    :before-close="handleClose"
  >
    <el-radio-group v-model="smsId" class="radioBox">
      <el-radio v-for="item in msgDataList" :key="item.id" :label="item.id">
        <div class="content">
          <div>{{ item.smsContent }}</div>
          <el-button
            v-clipboard:copy="item.smsContent"
            v-clipboard:success="clipboardSuccess"
            icon="el-icon-document"
            class="btn"
          >
            复制内容
          </el-button>
        </div>
      </el-radio>
    </el-radio-group>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :loading="loading"
        @click="handleOk"
      >发 送</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { sendMsg, getMsgTemplateList } from '@/api/privateArea/clue'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  components: {},
  directives: {
    clipboard
  },
  props: {
    msgConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {
        visible: false,
        data: {}
      }
    }
  },
  data: () => ({
    smsId: '',
    msgDataList: [],
    loading: false
  }),
  watch: {
    'msgConfig.visible': {
      handler() {
        if (this.msgConfig.visible) {
          this.smsId = ''
          this.handleGetMsg()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleClose() {
      this.$emit('update:msgConfig', {
        visible: false,
        data: {}
      })
    },
    async handleOk() {
      if (!this.smsId) return this.$message.warning('请选择需要发送的短信模板！')
      this.loading = true
      try {
        const res = await sendMsg({ clueId: this.msgConfig.data.id, smsId: this.smsId })
        if (res.code === 1) {
          this.$message.success('发送成功')
          this.handleClose()
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    async handleGetMsg() {
      const res = await getMsgTemplateList({ clueId: this.msgConfig.data.id })
      if (res.code === 1) this.msgDataList = res?.data
    }
  }
}
</script>
<style lang="scss" scoped>
.radioBox::v-deep {
  label {
    display: flex;
    align-items: center;
    margin: 0;
  }
}
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
  > div {
    width: 80%;
    white-space: normal;
  }
  > .btn {
    border: none;
    &:hover {
      background: #ffffff;
    }
    &:active {
      background: #ffffff;
    }
  }
}
</style>
