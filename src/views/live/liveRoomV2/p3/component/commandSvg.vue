<template>
  <div class="commandSvg">
    <div class="g-gradient" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 199deg;
}
@property --angle2 {
  syntax: '<angle>';
  inherits: false;
  initial-value: 71deg;
}
.commandSvg {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
    padding: 0 10px;
    width: calc(100% - 98px);
    .border {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
}

.g-gradient {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  // border: 1px solid #ff5722;
  border: 1px solid #0C6FFF;
  background: #F0F6FF;
  box-shadow: 1.2px 1.2px 4.8px 0 #0066ff14;
}
</style>
