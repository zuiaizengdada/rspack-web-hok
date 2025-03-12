<template>
  <!-- <VueDragResize
    :is-draggable="draggable"
    :is-active="true"
    :x="initialX"
    :y="initialY"
    w="auto"
    h="auto"
    :sticks="['bl']"
    :aspect-ratio="true"
    class="drag-resize-container"
  >
    <div class="aiIconBox">
      <img src="@/assets/image/aiIcon.gif" alt="" />
      <div class="text">
        <div>{{ userInfo.nickName || userInfo.userName || '您' }}</div>
        <div>AI助手</div>
      </div>
    </div>
  </VueDragResize> -->
  <MyDrag id="drag-icon" key="2" class="drag-resize-container" :x="initialX" :y="initialY" :w="90" :h="100">
    <template slot="default">
      <div class="aiIconBox">
        <img src="@/assets/image/aiIcon.gif" alt="" />
        <div class="text">
          <!-- <div>{{ userInfo.nickName || userInfo.userName || '您' }}</div> -->
          <div>我的</div>
          <div>AI管家</div>
        </div>

        <div class="closeBtnBox" @mouseover="showClose = true" @mouseleave="showClose = false">
          <i v-if="showClose" class="el-icon-error closeBtn" @mouseup.stop="onhandleClose" />
        </div>
      </div>
    </template>
  </MyDrag>
</template>

<script>
// import VueDragResize from 'vue-drag-resize'
import { mapGetters } from 'vuex'
import MyDrag from '@/components/MyDrag'
export default {
  components: {
    // VueDragResize,
    MyDrag
  },
  data: () => ({
    initialX: 0,
    initialY: 0,
    draggable: true,
    showClose: false
  }),
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.calculateInitialX()
  },
  methods: {
    handleClick() {
      console.log(22222222)
    },
    calculateInitialX() {
      // 获取屏幕宽度
      const screenWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      const screenHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      // 设置初始 Y坐标为屏幕宽度减去组件宽度
      this.initialY = screenHeight - 300
      // 设置初始 x 坐标为屏幕宽度减去组件宽度
      this.initialX = screenWidth - 110
    },
    onhandleClose() {
      console.log('关闭')
      this.$store.commit('ai/SET_IFCLOSE', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.drag-resize-container::v-deep {
  &:before {
    display: none !important;
  }
  .vdr-stick {
    display: none;
  }
}
.aiIconBox {
  width: 90px;
  height: 100px;
  position: relative;
  z-index: 6000;
  cursor: pointer;
  .closeBtnBox {
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    bottom: 0;
    .closeBtn {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 24px;
      color: rgba(51,51,51,0.35);
      &:hover{
        color: #F56C6C !important;
      }
    }
  }
  > img {
    position: absolute;
    top: -20px;
    z-index: 5999;
    pointer-events: none;
  }
  &:hover {
    .text {
      height: 120px;
    }
  }
  .text {
    width: 70px;
    height: 20px;
    position: absolute;
    overflow: hidden;
    pointer-events: none;
    top: 17px;
    left: 10px;
    color: #ffffff;
    font-size: 12px;
    > div:nth-of-type(1) {
      font-weight: 500;
      padding-top: 50px;
      font-size: 14px;
    }
    text-align: center;
    background: linear-gradient(
      144deg,
      #ff64fc 0%,
      #2a53ff 58%,
      #149ff8 82%,
      #00e6f2 100%
    );
    box-shadow: 0px 4px 6px 0px #b9b9b9;
    border-radius: 33px;
    transition: all 0.5s ease;
  }
}
</style>
