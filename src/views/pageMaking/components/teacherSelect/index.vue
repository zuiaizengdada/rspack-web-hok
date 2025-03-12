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
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :disabled="ids.includes(item.value)"
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
      default: '请输入IP姓名'
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
    },
    ids: {
      type: Array,
      default: () => []
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
              label: v.lecturerName,
              value: v.lecturerId
            }
          })
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
          this.options = res.data.map((v) => {
            return {
              ...v,
              label: v.lecturerName,
              value: v.lecturerId
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
