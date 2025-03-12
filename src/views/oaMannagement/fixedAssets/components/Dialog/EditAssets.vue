<template>
  <base-dialog
    v-bind="$attrs"
    title="编辑"
    :append-to-body="true"
    top="8vh"
    :visible-footer="true"
    width="900px"
    v-on="$listeners"
  >
    <form-assets
      slot="content"
      :form="form"
      @cancel="cancelDialog"
      @submit="submitAssetUpdate"
    />
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
import FormAssets from './FormAssets.vue'
import { assetUpdate } from '../../../api/assets.js'
export default {
  components: {
    BaseDialog,
    FormAssets
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
    submitAssetUpdate({ form, success }) {
      this.$uweb?.setAction('Event_oa_fixedAsset_update')
      const params = {
        ...form
      }
      assetUpdate(params)
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
