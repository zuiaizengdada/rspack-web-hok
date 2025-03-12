<template>
  <div
    class="formTitle"
    :style="{
      'text-align': textAlign || 'center'
    }"
  >
    <span
      :style="{
        'font-weight': (fontWeight || 700),
        'font-size': (fontSize || 32) + 'px',
        'color': fontColor || '#000',

      }"
    >{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'FormTitle',
  components: {},
  props: {
    // eslint-disable-next-line vue/require-prop-types
    fontSize: {
      default: 32
    },
    // eslint-disable-next-line vue/require-prop-types
    fontWeight: {
      default: 700
    },
    // eslint-disable-next-line vue/require-prop-types
    fontColor: {
      default: '#000'
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: '请输入标题'
    },
    // eslint-disable-next-line vue/require-prop-types
    textAlign: {
      default: 'center'
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.formTitle {
  text-align: center;
}
</style>
