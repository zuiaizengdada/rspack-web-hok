<template>
  <base-dialog
    v-bind="$attrs"
    title="编辑"
    :append-to-body="true"
    :visible-footer="true"
    width="900px"
    v-on="$listeners"
  >
    <form-card
      slot="content"
      :edit-form="form"
      @cancel="cancelDialog"
      @submit="submitCardEdit"
    />
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog'
import FormCard from './FormCard.vue'
import { cardUpdate } from '../../../api/card.js'
export default {
  components: {
    BaseDialog,
    FormCard
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submitCardEdit({ form, success }) {
      this.$uweb?.setAction('Event_oa_phoneCard_update')
      const params = {
        ...form
      }
      cardUpdate(params)
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
