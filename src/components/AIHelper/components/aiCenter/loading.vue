<template>
  <div class="canvasBox">
    <div class="spinnerSexBox p1" />
    <div class="spinnerSexBox p2" />
    <div class="spinnerSexBox p3" />
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
.canvasBox {
    position: relative;
    display: flex;
}
.spinnerSexBox {
    background: #FF7D00;
    border-radius: 50%;
    height: 4px;
    width: 4px;
    margin-left: 2px;
}
.p1 {
    animation: fall 1s linear 0.2s infinite;
}
.p2 {
    animation: fall 1s linear 0.1s infinite;
}
.p3 {
    animation: fall 1s linear infinite;
}
@keyframes fall {
    0% {
        transform: translateY(-4px);
    }
    75% {
        transform: translateY(0);
    }
    100% {
        transform: translateY(-4px);
    }
}
</style>
