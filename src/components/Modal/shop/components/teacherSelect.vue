<template>
  <el-select
    v-model="val"
    filterable
    :multiple="multiple"
    remote
    clearable
    :disabled="disabled"
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
import { getTeacherList } from '@/api/tearchCenter'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入IP姓名'
    },
    attribute: {
      type: String,
      default: 'lecturerId'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {}
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      loading: false
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
        if (val) {
          const data = this.options.find(i => i.value === val)
          this.$emit('getDetail', data)
        }
      }
    },
    setConfig() {
      return {
        api: getTeacherList,
        nameKey: 'teacherName',
        ...this.config
      }
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(queryString = '') {
      this.loading = true
      const params = {
        [this.setConfig.nameKey]: queryString,
        pageIndex: 1,
        pageSize: 999
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data?.items?.map((v) => {
            return {
              ...v,
              label: v.teacherName,
              value: v.teacherId
            }
          }) ?? []
          this.loading = false
        })
        .catch(() => {
          this.options = []
          this.loading = false
        })
    },
    setDefaultValue(queryString) {
      console.log(queryString)
      const params = {
        [this.setConfig.nameKey]: queryString
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data?.items?.map((v) => {
            return {
              ...v,
              label: v.teacherName,
              value: v.teacherId
            }
          }) ?? []
          this.$emit('change', this.options[0].value)
          this.$emit('getDetail', this.options[0])
        })
        .catch(() => {
          this.options = []
        })
    }
  }
}
</script>

<style>

</style>
