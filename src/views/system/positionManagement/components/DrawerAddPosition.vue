<template>
  <base-drawer
    v-bind="$attrs"
    title="新增"
    :append-to-body="true"
    :wrapper-closable="false"
    :size="450"
    v-on="$listeners"
    @cancel="cancelDrawer"
    @confirm="confirmDrawer"
  >
    <form-position slot="content" ref="form" />
  </base-drawer>
</template>

<script>
import FormPosition from './FormPosition.vue'
import BaseDrawer from '../../../../components/BaseDrawer.vue'
import { jobAdd } from '../api/job.js'
export default {
  components: {
    FormPosition,
    BaseDrawer
  },
  methods: {
    async confirmDrawer() {
      await this.$refs.form.validate()
      const form = this.$refs.form.form
      await jobAdd(form)
      this.$message.success('新增成功')
      this.$emit('success')
      this.$emit('update:visible', false)
    },
    cancelDrawer() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
