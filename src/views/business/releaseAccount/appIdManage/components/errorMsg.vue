<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="30%"
    :show-close="false"
  >
    <span>删除失败，当前AppID存在授权的广告账号，请删除该广告账号后再尝试删除</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ErrorMsg',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>

</style>
