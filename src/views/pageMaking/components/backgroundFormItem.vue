<template>
  <div class="bg-form">
    <el-form-item
      :label="label"
      prop="backgroundType"
      class="flex form-content"
    >
      <el-radio-group
        v-model="current.backgroundType"
        class="flex flex-middle"
      >
        <el-radio :label="1" style="margin-right:20px">无背景</el-radio>
        <el-radio :label="2" style="margin-right:20px">颜色</el-radio>
        <el-radio :label="3" style="margin-right:20px">图片</el-radio>
      </el-radio-group>
    </el-form-item>
    <div v-if="current.backgroundType === 2" class="background-content">
      <span>自定义颜色</span>
      <div class="flex flex-middle">
        <el-button
          type="text"
          style="margin-right:10px"
          @click="current.backgroundVal = ''"
        >重置</el-button>
        <el-color-picker v-model="current.backgroundVal" show-alpha />
      </div>
    </div>
    <div
      v-else-if="current.backgroundType === 3 && !current.imageUrl.length"
      class="image-content"
    >
      <imageUpload hide-item @change="handleUploadChange">
        <div class="image-content-btn">
          <i class="el-icon-plus" style="font-weight: 600;" />
          <span>选择图片</span>
        </div>
      </imageUpload>
    </div>
    <div
      v-else-if="current.backgroundType === 3 && current.imageUrl.length"
      class="image-list"
    >
      <div class="image-box">
        <ImagePreviewer
          v-for="item in current.imageUrl"
          :key="item"
          style="width: 100px; height: 100px;"
          :src="item"
          fit="contain"
          :preview-src-list="[item]"
        />
        <i class="del el-icon-error" @click="handleDel" />
      </div>
    </div>
  </div>

</template>

<script>
import imageUpload from './imageUpload/index'
export default {
  name: 'BackgroundFormItem',
  components: {
    imageUpload
  },
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      default: '页面背景'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    current: {
      get() {
        return this.form
      },
      set(val) {
        console.log(val)
        this.$emit('update:form', val)
      }
    }
  },
  methods: {
    handleUploadChange(fileList) {
      this.current = {
        ...this.form,
        imageUrl: fileList.map(i => i.url)
      }
    },
    handleDel() {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.current = {
            ...this.form,
            imageUrl: []
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-form  ::v-deep{
    border-bottom:  1px solid #F5F5F5;
    margin-bottom: 20px;
    .form-content {
        border-bottom: 0px !important;
        padding-bottom: 0px !important;
        margin-bottom: 0px;
        .el-form-item__content{
            flex: 1;
            display: flex;
            justify-content: flex-end;
        }
        .el-radio{
            margin-right: 0px;
            .el-radio__label{
                padding-left: 8px
            }
        }
    }
    .background-content{
        padding: 10px;
        background: #F5F5F5;
        border-radius: 4px;
        display: flex;
        font-size: 14px;
        color: #777777;
        justify-content: space-between;
        align-items: center;
    }
    .image-list{
        background: #F5F5F5;
        height: 124px;
        border-radius: 4px;
        padding: 12px;
    }
    .image-box{
        position: relative;
        width: 100px;
        height: 100px;
        .del{
            position: absolute;
            right: -6px;
            top: -6px;
            color: #686664;
            cursor: pointer;
            font-size: 16px;
            z-index: 2;
        }
    }
    .image-content{
        width: 100%;
        .image-content-btn{
            height: 40px;
            width: 490px;
            background: #F5F9FF;
            border-radius: 4px;
            border: 1px dashed #66A4FF;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #0C6FFF;
            font-size: 14px;
        }
    }
}
</style>
