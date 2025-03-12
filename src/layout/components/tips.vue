<template>
  <div class="tips">
    检测到您未绑定飞书，请前往绑定
    <div x-arrow class="popper__arrow" style="left: 146.5px;" />
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
.tips {
  width: 210px;
  margin-top: 12px;
  padding: 18px 20px;
  position: absolute;
  background: #fff;
  min-width: 150px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  background: #303133;
  color: #fff;
  line-height: 1.4;
  text-align: justify;
  font-size: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  word-break: break-all;
  .popper__arrow {
    width: 0;
    height: 0;
    border: 20px solid;
    border-color: transparent transparent #303133 transparent;
    position: absolute;
    width: 0;
    top: -15px;
    height: 0;
    border: 8px solid;
    border-color: transparent transparent #303133 transparent;
  }
}
</style>
