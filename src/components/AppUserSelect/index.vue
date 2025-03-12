<template>
  <el-select
    v-model.trim="value"
    clearable
    filterable
    remote
    reserve-keyword
    :placeholder="placeholderString"
    :remote-method="remoteMethod"
    class="user-select"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="item.nickName"
      :value="item.userId"
    />
  </el-select>
</template>

<script>
import { userNoPage } from '@/api/addressBookApi'
export default {
  props: {
    placeholderString: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      options: [],
      loading: false,
      value: ''
    }
  },
  methods: {
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          const { data } = await userNoPage({ nickName: query })
          this.loading = false
          this.options = data ?? []
        } catch (e) {
          this.loading = false
        }
      } else {
        this.options = []
      }
    },
    handleChange(val) {
      const info = this.options.find(item => item.userId === val)
      this.$emit('change', val, info)
    },
    handleClear() {
      this.$emit('change', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-select ::v-deep {
  .el-input__inner {
    cursor: text;
  }
}
</style>
