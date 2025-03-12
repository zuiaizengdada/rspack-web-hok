<template>
  <base-drawer
    v-bind="$attrs"
    title="编辑"
    :append-to-body="true"
    :wrapper-closable="false"
    :size="450"
    v-on="$listeners"
    @cancel="cancelDrawer"
    @confirm="confirmDrawer"
  >
    <form-position slot="content" ref="form" :data="row" />
  </base-drawer>
</template>

<script>
import FormPosition from './FormPosition.vue'
import BaseDrawer from './BaseDrawer.vue'
import { jobUpdate } from '../api/job.js'
export default {
  components: {
    FormPosition,
    BaseDrawer
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    async confirmDrawer() {
      const params = this.$refs.form.form
      await this.$refs.form.validate()
      params.jobId = this.row.jobId
      await jobUpdate(params)
      this.$message.success('编辑成功')
      this.$emit('success')
      this.$emit('update:visible', false)
    },
    cancelDrawer() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
