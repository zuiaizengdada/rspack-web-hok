<template>
  <div class="form-container">
    <p class="form-title flex justify-between">若要更改快捷键，请选择并按下新的快捷键。 <span class="cursor-pointer" @click="handleClickReset">恢复默认</span></p>
    <el-form ref="form" :model="form" size="mini" class="flex justify-between flex-wrap" label-width="80px" :rules="rules">
      <!-- <el-form-item label="内容标记" prop="contentMark" class="form-item relative">
        <el-input ref="contentMark" v-model="form.contentMark" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'contentMark')" @keyup.native="keyupInput($event,'contentMark')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('contentMark')" />
      </el-form-item> -->
      <el-form-item label="视频切割" prop="videoCut" class="form-item relative">
        <el-input ref="videoCut" v-model="form.videoCut" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'contentMark')" @keyup.native="keyupInput($event,'videoCut')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('videoCut')" />
      </el-form-item>
      <el-form-item label="轨道缩小" prop="trackSmall" class="form-item relative">
        <el-input ref="trackSmall" v-model="form.trackSmall" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'contentMark')" @keyup.native="keyupInput($event,'trackSmall')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('trackSmall')" />
      </el-form-item>
      <el-form-item label="轨道放大" prop="trackLarge" class="form-item relative">
        <el-input ref="trackLarge" v-model="form.trackLarge" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'contentMark')" @keyup.native="keyupInput($event,'trackLarge')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('trackLarge')" />
      </el-form-item>
      <el-form-item label="倍速切换" prop="multiplyPlay" class="form-item relative">
        <el-input ref="multiplyPlay" v-model="form.multiplyPlay" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'multiplyPlay')" @keyup.native="keyupInput($event,'multiplyPlay')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('multiplyPlay')" />
      </el-form-item>
      <!-- <el-form-item label="自动吸附" prop="adsorbent">
        <el-input v-model="form.adsorbent" class="width200" clearable @keydown.native="keydownInput($event,'adsorbent')" />
      </el-form-item> -->
      <!-- <el-form-item label="预览轴" prop="preview" class="form-item relative">
        <el-input ref="preview" v-model="form.preview" class="width200" :clearable="true" :readonly="true" @keydown.native="keydownInput($event,'preview')" @keyup.native="keyupInput($event,'preview')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('preview')" />
      </el-form-item> -->
      <!-- <el-form-item label="快速导出" prop="videoExport" class="form-item relative">
        <el-input ref="videoExport" v-model="form.videoExport" class="width200" :readonly="true" :clearable="true" @keydown.native="keydownInput($event,'videoExport')" @keyup.native="keyupInput($event,'videoExport')" />
        <i class="el-icon-close cursor-pointer" @click="handleClickClear('videoExport')" />
      </el-form-item> -->
      <el-form-item style="width:100%">
        <div class="buttons flex justify-end">
          <el-button type="primary" style="margin-right:10px;" @click="handleClickSubmit">保存</el-button>
          <el-button @click="handleClickCancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { updateShortcutKey, qryShortcutKey, delShortcutKey } from '../../api/keyboard'
import { mixinFormRule } from './mixinFormRule.js'
export default {
  mixins: [mixinFormRule],
  inject: ['updateActiveKeyBoard'],
  data() {
    return {
      form: {
        contentMark: '',
        videoCut: '',
        trackSmall: '',
        trackLarge: '',
        multiplyPlay: '',
        // adsorbent: '',
        preview: '',
        videoExport: ''
      },
      initForm: {}
    }
  },
  created() {
    this.qryShortcutKeyApi()
  },
  methods: {
    async qryShortcutKeyApi() {
      const res = await qryShortcutKey()
      this.form = res.data
      this.initForm = JSON.parse(JSON.stringify(this.form))
    },
    async handleClickReset() {
      await delShortcutKey()
      this.$message.success('重置成功')
      this.qryShortcutKeyApi()
    },
    async updateShortcutKeyApi() {
      await updateShortcutKey(this.form)
      this.$message.success('提交成功')
      const arr = []
      this.changeForm.forEach(i => {
        arr.push(this.initForm[i])
      })
      this.updateActiveKeyBoard(arr)

      this.changeForm = []
      setTimeout(() => {
        this.$emit('submit')
      }, 1000)
    },
    handleClickCancel() {
      this.$emit('cancel')
    },
    handleClickSubmit() {
      console.log(this.form, '提交数据。。。。')
      const isValid = this.validSubmit()
      if (isValid) {
        this.updateShortcutKeyApi()
      }
    },
    handleClickClear(name) {
      this.form[name] = ''
      this.$refs[name].focus()
    }

  }
}
</script>
<style lang="scss" scoped>
.form-title{
    padding-top:20px;
    color:#D9D9D9;
    font-size:14px;
    margin-bottom:20px;
    span{
        width: 64px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid #A6A6A6;
        font-size:12px;
        color:#999999;
        text-align: center;
        line-height: 22px;
    }
}
.form-item{
  .el-icon-close{
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    right:10px;
    color:#999;
    font-size:14px;
  }
}
.width200{
    width: 190px;;
}
::v-deep .el-form-item__label{
    color:#999999;
}
::v-deep .el-form-item--mini.el-form-item{
    margin-bottom:20px;
    margin-right:0;
}
::v-deep .el-input--mini{
    border-radius: 4px;

}
::v-deep .el-input--mini .el-input__inner{
    height: 32px;
    line-height: 32px;
    background: none;
    border: 1px solid #4D4D4D;
    color:#D9D9D9;
}
::v-deep .el-input--mini .el-input__inner:focus{
  border:1px solid #fff
}
::v-deep .el-input__suffix{
    line-height: 32px;
}

::v-deep .el-button--mini{
    width:82px;
    height: 32px;;
}
</style>
