<template>
  <el-dialog :title="config.title" :visible.sync="config.visible" width="30%">
    <span v-html="config.content" />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="handleOk">{{
        config.okText
      }}</el-button>
      <el-button @click="handleClose">{{ config.closeText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  setEvaluateRecommend,
  setEvaluateProcess
} from '@/api/messageManagement/message'
export default {
  components: {},
  props: {
    config: {
      type: Object,
      default: () => ({
        type: 'recommend',
        visible: false,
        okText: '确认',
        closeText: '取消',
        title: '提示',
        content: ''
      })
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    loading: false
  }),
  created() {},
  methods: {
    async query() {
      this.loading = true
      const { type } = this.config
      const ids = this.multipleSelection?.map(item => item.id)
      if (type === 'recommend') {
        await setEvaluateRecommend({ ids, recommendState: 1 })
      }
      if (type === 'stopRecommend') {
        await setEvaluateRecommend({ ids, recommendState: 0 })
      }
      if (type === 'process') {
        await setEvaluateProcess({ ids, recommendState: 2 })
      }
      if (type === 'stopProcess') {
        await setEvaluateProcess({ ids, recommendState: 3 })
      }
      this.$emit('handleOk')
      this.loading = false
    },
    async handleOk() {
      await this.query()
      this.$emit('update:config', { ...this.config, visible: false })
    },
    handleClose() {
      this.$emit('update:config', { ...this.config, visible: false })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
