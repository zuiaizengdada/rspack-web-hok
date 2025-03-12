<template>
  <div class="w-full">
    <el-form v-show="platformId===15" ref="form" :model="formTitle" class="w-full">
      <el-form-item prop="value" :rules="[{required:true,message:'请输入标题'}]">
        <el-input v-model="formTitle.value" class="w-full" placeholder="填写标题,可能会有更多赞哦" show-word-limit :maxlength="max" @input="handleChangeTitle" @blur="validInputTile" />
      </el-form-item>
    </el-form>
    <el-input v-show="platformId!==15" v-model="formTitle.value" class="w-full" placeholder="填写标题,可能会有更多赞哦" show-word-limit :maxlength="max" @input="handleChangeTitle" @blur="validInputTile" />
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      formTitle: {
        value: ''
      },
      platformId: ''
    }
  },
  watch: {
    title(val) {
      console.log(this.max, '最多限制标题。。')
      if (this.max === 200) {
        this.formTitle.value = val
      } else {
        this.formTitle.value = val.substring(0, this.max)
      }
    }
  },
  inject: ['updataErrList', 'channel', 'publishChannelData', 'updataPublishActiveData'],
  created() {

  },
  mounted() {
    const activeData = this.publishChannelData?.activeData
    if (Object.keys(activeData).length) {
      this.validInputTile()
    }
    setTimeout(() => {
      console.log(this.max, '最多限制标题2。。')
      if (this.max === 200) {
        this.formTitle.value = this.title
      } else {
        this.formTitle.value = this.title.substring(0, this.max)
      }
    }, 100)
  },
  methods: {
    handleChangeTitle(val) {
      this.validInputTile()
      this.$emit('change', val)
    },
    validInputTile() {
      const activeData = this.publishChannelData?.activeData
      const platformId = activeData?.account?.platformId
      this.platformId = platformId
      if (platformId === 15) {
        this.$refs.form.validate(valid => {
          const isValidTitle = valid
          this.updataErrList({ platformId, contentError: !isValidTitle }, '标题检测。。。')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item{
  margin-bottom:0
}
</style>
