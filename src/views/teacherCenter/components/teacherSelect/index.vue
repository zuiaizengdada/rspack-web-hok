<template>
  <el-select
    v-model="val"
    filterable
    remote
    clearable
    reserve-keyword
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
import { teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入IP姓名'
    },
    attribute: {
      type: String,
      default: 'teacherId'
    },
    config: {
      type: Object,
      default: () => {}
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
        this.$nextTick(() => {
          if (val) {
            const data = this.options.find(i => i.value === val)
            this.$emit('select', data)
          }
          this.$emit('change', val)
        })
      }
    },
    setConfig() {
      return {
        api: teacherQueryByName,
        nameKey: 'name',
        ...this.config
      }
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    remoteMethod(queryString) {
      const params = {
        [this.setConfig.nameKey]: queryString,
        isOrgTransferDraft: this.setConfig.isOrgTransferDraft ? true : undefined
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data.map((v) => {
            return { label: v.teacherName, value: v[this.attribute] }
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    setDefaultValue(queryString) {
      const params = {
        [this.setConfig.nameKey]: queryString,
        isOrgTransferDraft: this.setConfig.isOrgTransferDraft ? true : undefined
      }
      this.setConfig.api(params)
        .then((res) => {
          this.options = res.data.map((v) => {
            return { label: v.teacherName, value: v[this.attribute] }
          })
          this.$emit('change', this.options[0].value)
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
