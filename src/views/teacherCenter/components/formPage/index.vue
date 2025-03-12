<template>
  <MCard>
    <div class="detail_page_wrap">
      <div class="header">
        <span class="crumbs" @click="$emit('click')">{{ title }}</span>
        <i class="el-icon-arrow-right" />
        <span class="crumbsActive">{{ subTitle }}</span>
      </div>
      <slot />
    </div>
  </MCard>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.detail_page_wrap {
  padding-left: 20px;
  padding-right: 20px;
  min-width: 1200px;
  .header {
    padding-bottom: 20px;
    border-bottom: 1px solid #eff2f6;
    .crumbs {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #777777;
      line-height: 24px;
      cursor: pointer;
    }
    .crumbsActive {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
    }
    .el-icon-arrow-right {
      margin-left: 8px;
      margin-right: 8px;
      font-size: 12px;
      color: #a9a9a9;
    }
  }
}
</style>
