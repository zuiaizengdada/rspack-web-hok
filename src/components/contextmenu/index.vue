<template>
  <div v-show="visible" class="e_mask" @click="closeMenu">
    <div ref="contextmenu" :style="{left:left+'px',top:getTop(top)}" class="contextmenu" />
  </div>
</template>

<!-- render function -->
<script>
export default {
  data() {
    return {
      visible: false,
      left: 0,
      top: 0,
      timer: null,
      markHeight: 310,
      viewComponent: null,
      position: ''
    }
  },
  methods: {
    closeMenu(e) {
      console.log(e, 'e')
      this.visible = false
      console.log('2222', this.visible)
    },
    getTop(top) {
      if (this.position && this.position === 'center') {
        return document.body.clientHeight / 2 + 'px'
      }
      const windHeight = document.body.clientHeight
      const markHeight = this.markHeight
      if (Number(markHeight + top) >= windHeight) {
        return Number(top - markHeight) + 'px'
      } else {
        return top + 'px'
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.e_mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  // background: rgba($color: #000000, $alpha:0.5);
  z-index: 20;
  .contextmenu {
    position: absolute;
    margin: 0;
    background: transparent;
    list-style-type: none;
  }
}
</style>
