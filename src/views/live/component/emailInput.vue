<template>
  <!-- 邮箱补全输入框 -->
  <div>
    <el-input v-model="myValue" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myValue: ''
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
</style>
