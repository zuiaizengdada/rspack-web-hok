<template>
  <base-dialog
    v-bind="$attrs"
    title="新增"
    :append-to-body="true"
    :visible-footer="true"
    width="900px"
    top="8vh"
    v-on="$listeners"
  >
    <form-assets
      slot="content"
      ref="addFormAssets"
      @cancel="cancelDialog"
      @submit="submitAssetAdd"
    />
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
import FormAssets from './FormAssets.vue'
import { assetAdd } from '../../../api/assets.js'
export default {
  components: {
    BaseDialog,
    FormAssets
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submitAssetAdd({ form, success }) {
      this.$uweb?.setAction('Event_oa_fixedAsset_add')
      const params = { ...form }
      assetAdd(params)
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
