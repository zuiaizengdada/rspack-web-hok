<template>
  <div v-if="['add','edit'].includes(origin)" class="silen-rule-container">
    <base-title title="静音标记规则">
      <span v-if="origin==='edit'" slot="right" class="title-tips">一旦修改静音标记规则，新脱敏的视频将默认读取最新规则，不影响自动脱敏中和自动脱敏已完成的视频</span>
    </base-title>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <div class="flex">
        <el-form-item label="时长阈值" prop="duration" class="width460" style="margin-right:110px">
          <div><el-input-number v-model="form.duration" controls-position="right" class="mr-2 width300" :min=".4" :step=".1" :max="10000" /> 秒</div>
          <p class="tips">连续满足静音的时长片段【即没有产生字幕判断】，将纳入剪辑标记。可根据各自剪辑习惯进行设置，不要设置过长或过短。默认值 = 10000秒。</p>
        </el-form-item>
        <el-form-item label="预留间隙" prop="reserveInterval" class="width460">
          <div><el-input-number v-model="form.reserveInterval" controls-position="right" class="mr-2 width300" :min=".05" :step=".01" /> 秒</div>
          <p class="tips">如果有设置，将会基于满足要求的连续时长阈值上，两端各预留一半指定的间隙时长，为手动剪辑预留可操作空间。默认值=0.1秒。</p>
        </el-form-item>
      </div>
    </el-form>
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
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        duration: 10000,
        reserveInterval: 0.1
      },
      rules: {
        duration: [{ required: true, message: '请输入时长阀值', trigger: 'blur' }],
        reserveInterval: [{ required: true, message: '请输入预留间隙', trigger: 'change' }]
      },
      isDataChangeCount: 0
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.form = val
      }
    },
    form: {
      handler(val) {
        this.isDataChangeCount++
      },
      deep: true
    }
  },
  methods: {
    validateForm() {
      let isValid = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          isValid = true
        }
      })
      const { reserveInterval, duration } = this.form
      if (reserveInterval * 2 >= duration) {
        this.$message.error('时长阀值需大于2倍预留间隙')
        return false
      }
      return isValid
    }
  }
}
</script>
<style lang="scss" scoped>
.silen-rule-container{
    .tips{
        padding-top:10px;
        line-height: 1.4!important;
        color:#999;
    }
    .title-tips{
      color:#F53F3F;
      font-size:12px;
      margin-left:8px;
    }
}
</style>
