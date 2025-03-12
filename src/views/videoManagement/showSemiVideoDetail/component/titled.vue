<template>
  <div class="hok-nav">
    <div class="back">
      <!-- @click="goBack()"  <i class="el-icon-arrow-left m-r-2" />
      <span>返回</span> -->
    </div>
    <div class="title">{{ title }}</div>
    <div>
      <!--  <el-button size="small" :loading="loading" :disabled="disabled" type="primary" @click="$emit('onClick')">生成视频</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '--'
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    goBack() {
      // if (window.history.length <= 1) {
      //   this.$router.push(`/videoManagement/desensitized`)
      // } else {
      //   }
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.hok-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 67px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 10;
  color: #333333;
  border-bottom: 1px solid #CBCFD3;
  .logo {
    width: 160px;
    height: 40px;
    .logoImage {
      width: 100%;
      height: 100%;
    }
  }
  .back {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    cursor: pointer;
    .m-r-2 {
        margin-right: 2px;
    }
  }
  .title {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 26px;
  }
}
</style>
