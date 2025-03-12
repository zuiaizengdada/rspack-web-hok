<template>
  <div class="container">
    <div class="relative">
      <el-radio v-model="liveModel" label="AI_LIVE" @input="handleInput">数字直播</el-radio>
      <el-radio v-model="liveModel" label="PERSON_LIVE" @input="handleInput">真人直播</el-radio>
    </div>
    <p class="tips" style="color:#F53F3F">注：请谨慎选择直播模式，一旦确定不可修改。</p>
  </div>
</template>
<script>
export default {

  data() {
    return {
      liveModel: 'AI_LIVE' // 直播模式 PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('change', val)
    }
  }
}
</script>
