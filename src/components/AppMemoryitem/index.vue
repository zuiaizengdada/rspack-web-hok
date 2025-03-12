<template>
  <AppDialog :height="'150px'" :width="'500px'" :value="visible" :title="'设置发布记忆项'" @success="submit()" @close="close()">
    <div class="content">
      <el-radio-group v-model="radio">
        <el-radio :label="1">上次发布账号记忆项</el-radio>
        <el-radio :label="2">取消记忆项</el-radio>
      </el-radio-group>
      <div class="memoryTips">
        <p>打开记忆项，会记录以下内容：</p>
        <div class="memoryContent">
          1.上次发布时选择的平台和账号；
        </div>
        <div class="memoryContent">
          2.账号内特殊的字段记忆保存，包括：a.B站的分类；b.快手的所属领域。
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'

export default {
  name: 'Index',
  components: {
    AppDialog
  },
  props: {
    memory: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      radio: 1
    }
  },
  watch: {
    memory(val) {
      this.radio = val
    }
  },
  created() {
    this.radio = this.memory
  },
  methods: {
    submit() {
      this.$emit('success', this.radio)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding: 16px;

  .memoryTips{
    padding: 10px 12px;
    border-radius: 4px;
    background: #F0F5FF;
    margin-top: 16px;
    p{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
    .memoryContent{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin-top: 6px;
    }
  }
  .tips{
    font-size: 12px;
    font-weight: 400;
    color: #777777;
    margin-left: 10px;
  }
}
// ::v-deep .el-radio{
// display: block;
//   margin:10px 0;
//   color: #777777;
// }
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #777777 !important;
}
</style>
