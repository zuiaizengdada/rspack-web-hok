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
import { userNoPage } from '@/api/addressBookApi'
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
    },
    // 查询类型，tearch查询老师 user查询员工
    type: {
      type: String,
      default: 'tearch'
    }
  },
  data() {
    return {
      mockData: []
    }
  },
  methods: {
    // 搜索讲师输入框远程搜索触发
    querySearchAsync(queryString, cb) {
      if (this.type === 'tearch') {
        this.getTearchPage(queryString, cb)
      } else if (this.type === 'user') {
        this.getUserNoPage(queryString, cb)
      }
      // const results = []
      // const params = {
      //   name: queryString
      // }
      // teacherQueryByName(params)
      //   .then((res) => {
      //     res.data.map((v) => {
      //       results.push({ value: v.teacherName })
      //     })
      //     cb(results)
      //   })
      //   .catch(() => {
      //     cb(results)
      //   })
    },
    // 查询用户列表
    getUserNoPage(queryString, cb) {
      const results = []
      const params = {
        deptId: '',
        nickName: queryString
      }
      userNoPage(params)
        .then((res) => {
          res.data.map((v) => {
            results.push({ value: v.nickName })
          })
          cb(results)
        })
        .catch(() => {
          cb(results)
        })
    },
    // 查询讲师列表
    getTearchPage(queryString, cb) {
      let results = []
      const params = {
        name: queryString
      }
      teacherQueryByName(params)
        .then((res) => {
          results = res.data.map((v) => {
            return { value: v.teacherName }
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
