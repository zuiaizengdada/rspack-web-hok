<template>
  <el-select v-model="value" :value="value" value-key="label" v-bind="$attrs" filterable clearable @change="handleChange">
    <el-option v-for="item in list" :key="item.userId" :label="item.nickName" :value="item.userId">
      <span style="float: left">{{ item.nickName }}</span>
      <span
        v-if="item.status === 1"
        style="float: right; color: #f53f3f; font-size: 13px"
      >已离职</span>
    </el-option>
  </el-select>
</template>
<script>
import { userNoPage } from '@/api/addressBookApi'
import { mapGetters } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: '',
      defaultValue: '',
      defaultList: [],
      list: [],
      deptId: '',
      isInit: true
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDeptId'])
  },
  watch: {
    id: {
      handler(val) {
        this.list = []
        this.value = ''
        if (val.length && val && val !== 'undefined') {
          this.deptId = val
          this.initPostList()
        }
      },
      deep: true
    }
  },
  methods: {
    async initPostList() {
      const res = await userNoPage({ deptId: this.deptId })
      this.list = res.data
      if (this.isInit) {
        this.init()
        this.isInit = false
      }
    },
    handleChange() {
      this.$emit('change', this.value)
    },
    reset() {
      setTimeout(() => {
        this.list = this.defaultList
        this.value = this.userInfo.userId
      }, 20)
    },
    init() {
      this.value = this.userInfo.userId
      this.defaultList = this.list
    },
    empty() {
      this.list = []
      this.value = ''
    }
  }
}
</script>
