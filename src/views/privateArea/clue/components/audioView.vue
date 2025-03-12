<template>
  <div class="cricleplay" status="stop" no="1">
    <div class="small " />
    <div class="middle show2" :class="{stopanimate: !ifPlay}" />
    <div class="large show3" :class="{stopanimate: !ifPlay}" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    ifPlay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.small{
  border: solid .2em #0C6FFF;
  width: 10px;
  height: 10px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  vertical-align: middle;
  display: inline-block;
  color:#A2A2A2;
}

.middle{
  border: solid .2em #0C6FFF;
  width: 20px;
  height: 20px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  vertical-align: middle;
  display: inline-block;
  margin-left: -12px;
  animation: show2 3s ease-in-out infinite;
  opacity: 1;
  color:#A2A2A2;
}
@keyframes show2 {
  0% { opacity: 0;}
  30% { opacity: 1;}
  100% { opacity: 0;}
}
.cricleplay{
  width: 100%;
  // transform: translateX(-20px);
}
.large{
  border: solid .2em #0C6FFF;
  width: 30px;
  height: 30px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  box-sizing: border-box;
  vertical-align: middle;
  display: inline-block;
  margin-left: -22px;
  animation: show3 3s ease-in-out infinite;
  opacity: 1;
  color:#A2A2A2;
}
@keyframes show3 {
  0% { opacity: 0;}
  60% { opacity: 1;}
  100% { opacity: 0;}
}
.stopanimate{
    -moz-animation-name: none;
    -webkit-animation-name: none;
    -ms-animation-name: none;
    animation-name: none;
}
</style>
