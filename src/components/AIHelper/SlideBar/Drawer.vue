<template>
  <!-- 底部弹窗 -->
  <transition name="popup">
    <div
      v-show="visibleDrawer"
      class="popupBox"
      :class="{
        'pop-up': true
      }"
    >
      <div class="pop-up-content" @mousedown="allowTextSelection">
        <Sell
          v-show="type === 1"
          ref="sellRef"
          @selectItem="selectItem"
          @close="handleClose"
        />
        <Collect
          v-show="type === 2"
          ref="collectRef"
          @selectItem="selectItem"
          @close="handleClose"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import Sell from '../components/TopicList/Sell/index.vue'
import Collect from '../components/TopicList/Collect/index.vue'
export default {
  components: {
    Sell,
    Collect
  },
  model: {
    prop: 'visible',
    event: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  computed: {
    visibleDrawer: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDrawer(val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    init() {
      this.$nextTick(() => {
        this.$refs.sellRef.changeCueWord()
        this.$refs.collectRef.changeCollect()
      })
    },
    selectItem(item) {
      this.$emit('selectItem', item)
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.pop-up {
  width: 432px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  bottom: 0;
  z-index: 1024;
  display: flex;
  align-items: flex-end;
  border-radius: 10px;
  .pop-up-content {
    width: 100%;
    height: 729px;
    background: #f7f7f7;

    cursor: default;
    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
    border-radius: 12px 12px 10px 10px;
  }
}
</style>
