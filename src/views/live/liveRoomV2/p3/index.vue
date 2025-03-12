<template>
  <!-- 互动区域 -->
  <div ref="p3View" class="p3">
    <groupChatRoom />
    <privateChatRoom v-if="chatUser.type === 1" />
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="urlList" />
  </div>
</template>

<script>
import groupChatRoom from './groupChatRoom'
import privateChatRoom from './privateChatRoom'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'// 导入组件
import { mapState } from 'vuex'
export default {
  components: {
    groupChatRoom,
    privateChatRoom,
    ElImageViewer
  },
  data() {
    return {
      urlList: [],
      showViewer: false
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.p3View.addEventListener('click', (event) => {
        if (event.target && event.target.className === 'hok_editor_img') {
          console.log('子元素被点击了！', event.target.src)
          this.urlList = [event.target.src]
          this.showViewer = true
        }
      })
    })
  },
  methods: {
    closeViewer() {
      this.urlList = []
      this.showViewer = false
    }
  }
}
</script>

<style lang='scss' scoped>
.p3 {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
