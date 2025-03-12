<template>
  <el-dialog :visible.sync="visibleDialog" width="614px" title="快捷键设置" :close-on-click-modal="false" :modal-append-to-body="true" :append-to-body="true" :destroy-on-close="true">
    <form-custom @cancel="cancelForm" @submit="submitForm" />
  </el-dialog>
</template>
<script>
import FormCustom from './FormCustom.vue'
export default {
  components: {
    FormCustom
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    cancelForm() {
      this.visibleDialog = false
    },
    submitForm() {
      this.visibleDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog{
    background:#232324;
    border-radius: 10px;;
}
::v-deep .el-dialog__header{
    padding-bottom:20px;
    border-bottom:1px solid #000;
}
::v-deep .el-dialog__title{
    color:#DEDEDE;
    font-size:16px;
    font-weight: bold;
}
::v-deep .el-dialog__body{
    padding:0 20px;
}
</style>
