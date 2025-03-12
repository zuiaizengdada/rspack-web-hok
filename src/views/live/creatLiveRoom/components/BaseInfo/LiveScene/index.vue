<template>
  <div class="relative">
    <el-radio-group v-model="type" @input="handleInput">
      <el-radio label="1">正式</el-radio>
      <el-radio label="2">测试</el-radio>
    </el-radio-group>
    <el-tooltip effect="dark" placement="right" style="position: absolute;top:-2px;left:140px">
      <div slot="content" style="line-height: 1.4;">测试直播间创建后可以删除，测试数据不纳入数据看板统计<br />测试直播间如果是真人直播可随时开播<br />正式直播间开播后不可以删除</div>
      <span style="padding:2px;"><i class="el-icon-question" /></span>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: '1'
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('change', val)
    }
  }
}
</script>
