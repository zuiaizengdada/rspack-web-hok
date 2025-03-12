<template>
  <Vcode :show="isShow" @success="onSuccess" @close="close">
    1231
  </Vcode>
</template>

<script>
import Vcode from 'vue-puzzle-vcode'
export default {
  components: {
    Vcode
  },
  data() {
    return {
      visible: false,
      isShow: false,
      msg: '',
      text: '',
      success: () => {},
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 5
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.isShow = true
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {

  },
  methods: {
    // 验证成功，触发该方法
    onSuccess(times) {
      this.isShow = false
      this.success && this.success()
    //   const ms = (times / 1000).toFixed(1)
    //   this.msg = 'login success, 耗时 ' + ms + 's'
    },
    close() {
      this.isShow = false
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
