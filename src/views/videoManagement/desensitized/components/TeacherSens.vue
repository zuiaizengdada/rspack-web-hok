<template>
  <div v-if="['add','edit'].includes(origin)" class="teacher-sens-container">
    <base-title title="老师专属敏感词" class="title items-center">
      <span v-if="teacherId.length" slot="right" class="to cursor-pointer" @click="handleClickTo">前往更新敏感词</span>
    </base-title>
    <div class="wapper">
      <p>系统将直接读取老师专属敏感词，并用于脱敏环节中自动识别标记字幕中的敏感词，以及成品敏感词风控检测。</p>
      <p>老师专属敏感词后期可随时进行更新，新脱敏的视频将默认读取最新规则，不影响自动脱敏中和自动脱敏已完成的视频。</p>
    </div>
  </div>
</template>
<script>
import BaseTitle from './Common/BaseTitle.vue'
export default {
  components: {
    BaseTitle
  },
  props: {
    origin: {
      type: String,
      default: 'add'
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      teacherId: ''
    }
  },
  watch: {
    id(val) {
      this.teacherId = val
    }
  },
  methods: {
    handleClickTo() {
      this.$router.push('/oaManagement/sensitiveManage?activeName=sharevideo&teacherId=' + this.teacherId)
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher-sens-container{
    line-height: 1;
    margin-bottom:20px;
    .title{
        margin-bottom:20px;
        .to{
            color:#0C6FFF;
            margin-left:20px;
        }
    }
    .wapper{
        padding-left:20px;
        p{
           margin-bottom:16px;
           color: #999;
        }
    }
}
</style>
