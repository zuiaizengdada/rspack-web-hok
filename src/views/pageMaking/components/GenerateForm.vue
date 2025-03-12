<template>
  <div class="fm-style">
    <genetate-form-item
      v-for="item in data.list"
      :key="item.key"
      :widget="item"
    />
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'
export default {
  name: 'FmGenerateForm',
  components: {
    GenetateFormItem
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      models: {}
    }
  },
  methods: {

  }
}
</script>
