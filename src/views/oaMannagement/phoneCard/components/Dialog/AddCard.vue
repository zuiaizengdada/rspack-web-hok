<template>
  <base-dialog
    v-bind="$attrs"
    title="新增"
    :append-to-body="true"
    :visible-footer="true"
    width="900px"
    v-on="$listeners"
  >
    <form-card slot="content" @cancel="cancelDialog" @submit="submitCardAdd" />
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog'
import FormCard from './FormCard.vue'
import { cardAdd } from '../../../api/card.js'
export default {
  components: {
    BaseDialog,
    FormCard
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submitCardAdd({ form, success }) {
      this.$uweb?.setAction('Event_oa_phoneCard_add')
      const params = { ...form }
      cardAdd(params)
        .then(res => {
          if (res.code === 1) {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.$emit('success')
          }
        })
        .finally(() => {
          success()
        })
    }
  }
}
</script>
