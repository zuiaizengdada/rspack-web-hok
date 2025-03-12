<template>
  <div class="IconStatus" :style="{background: background, color: color}">
    <svg-icon :class-name="className" :icon-class="iconClass" />
    <span class="IconStatusTitle">{{ title }}</span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    background: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'IconStatusicon'
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
.IconStatus {
  display: inline-block;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  display: inline-flex;
  align-items: center;
  .IconStatusicon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
  .IconStatusTitle {
    height: 13px;
    line-height: 13px;
    float: right;
  }
}
</style>
