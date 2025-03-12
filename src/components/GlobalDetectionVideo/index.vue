<template>
  <AppDialog
    v-model="visible"
    width="500px"
    height="auto"
    top="10vh"
    title=""
    @success="sure()"
  >
    <!-- <template slot="title">
      <span class="video-name">{{ videoName }}</span>
    </template> -->
    <div class="detectionVideo_content">
      <div class="item1">
        系统检测到您有
        <span style="color: #f53f3f; font-size: 24px">{{ nums }}</span>
        个账号数据未同步
      </div>
      <div class="item1" style="margin-top: 15px">
        需要点击"数据一键同步"完成数据同步后才能继续使用该功能
      </div>
      <!-- <img class="item1_img" :src="goSnycDataImg" alt=""> -->
    </div>
    <div slot="footer" class="footer_btn">
      <el-button size="small" @click="close()">{{ btnText }}</el-button>
      <el-button
        type="primary"
        size="small"
        @click="sure()"
      >立即去同步</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import goSnycDataImg from '@/assets/image/video/goSnycData.png'
export default {
  components: {
    AppDialog
  },
  props: {
    btnText: {
      type: String,
      default: '我不使用了'
    },
    visible: {
      type: Boolean,
      default: false
    },
    success: {
      type: Function,
      default: () => {}
    },
    nums: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      goSnycDataImg
    }
  },
  mounted() {},
  methods: {
    close() {
      if (this.btnText === '继续使用') {
        this.continue()
      }
      this.visible = false
    },
    sure() {
      this.visible = false
      this.success()
    }
  }
}
</script>

<style lang="scss" scoped>
.detectionVideo_content {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
}
.item1 {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}
.item1_img {
  width: 100%;
  margin-top: 20px;
}
.footer_btn {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
}
</style>
