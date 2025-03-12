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
    transform: translateY(10px);
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
  border-radius: 8px;
  border: 1px solid #ff5722;
}
</style>
