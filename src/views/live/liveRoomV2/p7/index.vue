<template>
  <!-- 竖屏直播间样式 -->
  <div ref="p7View" class="p7_wrap">
    <div class="page_top">
      <resizablePane
        :initial-ratio="0.5"
        :min-width-left="320"
        :min-width-right="375"
        storage-key="liveRoom_resizePane_ratio"
      >
        <template v-slot:one>
          <div class="page_left">
            <p3Header />
            <div class="charRoom">
              <toppingMsg v-if="chatUser.type === 2" />
              <charRoom @dblclick="dblclick" />
            </div>

            <template v-if="chatUser.type === 1">
              <privateCharRoom @onfocus="onfocus"><span /></privateCharRoom>
            </template>
          </div>
        </template>
        <template v-slot:two>
          <div class="page_right"><p2 /></div>
        </template>
      </resizablePane>
    </div>
    <div class="page_bottom">
      <template v-if="chatUser.type">
        <groupChatInput v-if="chatUser.type === 2" ref="groupChatInput" />
        <privateChatInput v-if="chatUser.type === 1" ref="privateChatInput" />
      </template>
    </div>
    <!-- <div class="page_top">
      <div class="page_left">
        <p3Header />
        <div class="charRoom">
          <toppingMsg v-if="chatUser.type === 2" />
          <charRoom @dblclick="dblclick" />
        </div>

        <template v-if="chatUser.type === 1">
          <privateCharRoom @onfocus="onfocus"><span /></privateCharRoom>
        </template>
      </div>
      <div class="page_right"><p2 /></div>
    </div>
    <div class="page_bottom">
      <template v-if="chatUser.type">
        <groupChatInput v-if="chatUser.type === 2" ref="groupChatInput" />
        <privateChatInput v-if="chatUser.type === 1" ref="privateChatInput" />
      </template>
    </div> -->

    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="urlList"
    />
  </div>
</template>

<script>
import privateChatInput from '@/views/live/liveRoomV2/p3/privateChatRoom/privateChatInput.vue'
import p3Header from '@/views/live/liveRoomV2/p3/groupChatRoom/p3Header.vue'
import charRoom from '@/views/live/liveRoomV2/p3/chatRoom'
import privateCharRoom from '@/views/live/liveRoomV2/p3/privateChatRoom/index.vue'
import p2 from '@/views/live/liveRoomV2/p2'
import toppingMsg from '@/views/live/liveRoomV2/p3/groupChatRoom/toppingMsg'
import groupChatInput from '@/views/live/liveRoomV2/p3/groupChatRoom/groupChatInput'
import resizablePane from './cpns/resizablePane.vue'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer' // 导入组件
import { mapState } from 'vuex'
export default {
  components: {
    p2,
    ElImageViewer,
    privateChatInput,
    groupChatInput,
    toppingMsg,
    charRoom,
    privateCharRoom,
    p3Header,
    resizablePane
  },
  data() {
    return {
      urlList: [],
      showViewer: false
    }
  },
  inject: ['onhandleDblclick'],
  provide() {
    return {
      onfocus: () => this.onfocus()
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.p7View.addEventListener('click', event => {
        if (event.target && event.target.className === 'hok_editor_img') {
          console.log('子元素被点击了！', event.target.src)
          this.urlList = [event.target.src]
          this.showViewer = true
        }
      })
    })
  },
  methods: {
    dblclick(item) {
      this.onhandleDblclick({ item: item.item, message: item.message, type: 1 })
    },
    closeViewer() {
      this.urlList = []
      this.showViewer = false
    },
    onfocus() {
      console.log('2222')
      if (this.chatUser.type === 2) {
        this.$refs.groupChatInput && this.$refs.groupChatInput.onfocus()
      } else if (this.chatUser.type === 1) {
        this.$refs.privateChatInput && this.$refs.privateChatInput.onfocus()
      }
      console.log('失去焦点触发')
    }
  }
}
</script>

<style lang="scss" scoped>
.p7_wrap {
  min-width: 684px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .page_top {
    height: 100%;
    width: 100%;
    flex: 1 0 0;
    display: flex;
    overflow: hidden;
    padding-bottom: 16px;
    .page_left {
      flex: 1 0 0;
      height: 100%;
      border-radius: 10px;
      overflow: hidden;
      background: #f7f7f7;
      border: 1px solid #dcdee1;
      position: relative;
      .charRoom {
        height: 100%;
        overflow: hidden;
        position: relative;
      }
    }
    .page_right {
      height: 100%;
      width: 100%;
      /* margin-left: 10px; */
      /* min-width: 375px; */
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #dcdee1;
    }
  }
  .page_bottom {
    /* height: 100%; */
    background: #fff;
    min-height: 144px;
    border-radius: 10px;
    // border: 1px solid #DCDEE1;
    // overflow: hidden;
    position: relative;
  }
}
.p7_wrap {
  ::v-deep {
    .inputArea {
      height: 100%;
      max-height: 100% !important;
      border-radius: 10px;
      border: 1px solid #dcdee1;
    }
    .tool_box {
      border-top: 0px;
      border-radius: 10px 10px 0 0;
      .rightTools {
        border-top: 0px;
      }
      .tools {
        border-top: 0px;
      }
    }
    .page_top .page_left .charRoom {
      height: calc(100% - 50px);
    }
  }
}
</style>
