<template>
  <div class="container flex items-center">
    <div style="margin-right:40px;">
      <el-radio v-model="displayMode" :disabled="disable" label="1" @input="handleInput">横屏</el-radio>
      <el-popover
        placement="top"
        trigger="hover"
      >
        <el-image :src="modeImg2" style="width:144px" />
        <span slot="reference" style="color:#0C6FFF">示例</span>
      </el-popover>
    </div>
    <div>
      <el-radio v-model="displayMode" :disabled="disable" label="2" @input="handleInput">竖屏</el-radio>
      <el-popover
        placement="top"
        trigger="hover"
      >
        <el-image :src="modeImg1" style="width:144px" />
        <span slot="reference" style="color:#0C6FFF">示例</span>
      </el-popover>
    </div>

  </div>
</template>
<script>
import modeImg1 from '../../../image/1.png'
import modeImg2 from '../../../image/2.png'
export default {
  props: {
    disable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      modeImg1,
      modeImg2,
      displayMode: '1'
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-radio{
  margin-right:10px!important;
}
</style>
