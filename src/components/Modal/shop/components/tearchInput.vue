
<template>
  <el-autocomplete
    ref="autocomplete"
    :value="value"
    :fetch-suggestions="querySearchAsync"
    clearable
    :placeholder="placeholder"
    v-bind="$attrs"
    @input="(res) => $emit('input', res)"
    v-on="$listeners"
    @clear="clear"
  />
</template>

<script>
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入IP姓名'
    }
  },
  data() {
    return {
      mockData: []
    }
  },
  mounted() {},
  methods: {
    // 搜索讲师输入框远程搜索触发
    querySearchAsync(queryString, cb) {
      const results = []
      const params = {
        name: queryString
      }
      teacherQueryByName(params)
        .then((res) => {
          res.data.map((v) => {
            results.push({ value: v.teacherName })
          })
          cb(results)
        })
        .catch(() => {
          cb(results)
        })
    },
    clear() {
      this.$refs.autocomplete.activated = true
      this.$emit('clear')
    }
  }
}
</script>

<style lang="scss" scoped></style>
