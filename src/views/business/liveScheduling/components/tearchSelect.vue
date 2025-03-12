<template>
  <AppSelect
    :get-api-fn="getPage"
    search-key="lecturerName"
    :value="defaultId"
    :label="value"
    :props="props"
    :placeholder="placeholder"
    v-bind="$attrs"
    @selected="selected"
    v-on="$listeners"
  />
</template>

<script>
import { getTeacherPage } from '@/api/shop.js'
import AppSelect from './AppSelect'
export default {
  name: 'TeacherSelect',
  components: {
    AppSelect
  },
  props: {
    defaultId: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      props: {
        label: 'lecturerName',
        value: 'lecturerId'
      }
    }
  },
  computed: {},
  methods: {
    selected(e) {
      this.$emit('selected', e)
    },
    getPage(params) {
      return getTeacherPage(params).then(res => {
        return {
          items: res.data.records,
          total: res.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tearchInput {
    width: 100%!important;
  }
}
</style>
