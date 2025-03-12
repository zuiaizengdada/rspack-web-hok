<template>
  <!-- 编辑班主任弹框 -->
  <AppDialog
    v-model="config.visible"
    title="跟进状态"
    width="400px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="inputBox">
      <p>跟进状态：</p>
      <el-input
        v-model="config.data.followTypeName"
        type="text"
        placeholder="请输入内容"
        maxlength="15"
        show-word-limit
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addFollowType, editFollowType } from '@/api/privateArea/clue'
const query = {
  ADD: addFollowType,
  EDIT: editFollowType
}
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          data: { followTypeName: '' },
          type: 'ADD'
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      text: ''
    }
  },
  watch: {},
  mounted() {},
  methods: {
    async sure() {
      if (!this.config.data.followTypeName) {
        return this.$message.error('请输入状态名称')
      }
      let data = { ...this.config.data }
      if (this.config.type === 'EDIT') {
        data = {
          followTypeName: this.config.data.followTypeName,
          id: this.config.data.id
        }
      }
      const { code } = await query[this.config.type](data)
      if (code === 1) {
        if (this.config.type === 'ADD') {
          this.$message.success('新增成功')
        } else {
          this.$message.success('编辑成功')
        }

        this.$emit('success')
      }
    }
  }
}
</script>

  <style lang='scss' scoped>
.inputBox {
  display: flex;
  align-items: center;
  padding: 20px;
  > p {
    width: 100px;
  }
}
</style>

