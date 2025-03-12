<template>
  <el-select
    v-model="val"
    filterable
    :multiple="multiple"
    remote
    clearable
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    v-bind="$attrs"
    v-on="$listeners"
    @clear="handleClear"
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
import { getTeacherList } from '@/api/shop'
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
      default: '请输入IP'
    },
    attribute: {
      type: String,
      default: 'lecturerId'
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
        nameKey: 'lecturerName',
        label: 'lecturerName',
        value: 'lecturerId',
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
        [this.setConfig.nameKey]: queryString
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data.map((v) => {
            return {
              ...v,
              label: v[this.setConfig.label],
              value: v[this.setConfig.value]
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.options = []
          this.loading = false
        })
    },
    handleClear() {
      this.remoteMethod()
    },
    setDefaultValue(queryString) {
      const params = {
        [this.setConfig.nameKey]: queryString
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data.map((v) => {
            return {
              ...v,
              label: v[this.setConfig.label],
              value: v[this.setConfig.value]
            }
          })
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
