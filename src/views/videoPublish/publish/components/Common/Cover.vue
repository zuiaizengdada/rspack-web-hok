<template>
  <div class="cover-container flex w-full">
    <div class="cover-content flex justify-between w-full">
      <div class="flex items-center content-left">
        <div class="img-box">
          <el-image fit="contain " :src="coverSrc" class="cover-img" />
        </div>
        <div class="cover-txt">
          <p class="coverFont">支持从视频中截图或上传</p>
          <p>默认使用视频第一帧作为封面</p>
        </div>
      </div>
      <div class="flex items-center">
        <el-button type="primary" size="mini" @click="editCover">编辑封面</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      coverSrc: ''
    }
  },
  watch: {
    src(val) {
      this.coverSrc = val
    }
  },
  methods: {
    editCover() {
      this.$emit('editCover')
    }
  }
}
</script>
<style lang="scss" scoped>
.publish-title{
  flex:none;
  font-size:16px;
  line-height: 24px;
  color:#333;
  margin-right:16px;
  padding-top:4px
}
.coverFont{
  color: #777777;
}
.cover-content{
  background: #FAFAFA;
  border-radius: 4px;
  padding:10px;
  .content-left{
    .img-box{
      margin-right:10px;
      .cover-img{
        width: 120px;
        height: 90px;
        background: rgba(51, 51, 51, 1);
        border-radius: 4px;
        flex:none;
      }
    }
    .cover-txt{
      color:#999999;
      p{
        font-size:14px;
        line-height: 22px;
        &:last-child{
          padding-top:4px;
          font-size:12px;
        }
      }
    }
  }
}
</style>
