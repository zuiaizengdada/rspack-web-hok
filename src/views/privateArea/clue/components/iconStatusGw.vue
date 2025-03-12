<template>
  <div
    class="IconStatus"
    :style="{ background: state.background, color: state.color }"
  >
    <i class="el-icon-chat-dot-round IconStatusicon" />
    <span class="IconStatusTitle">{{ state.label }}</span>
  </div>
</template>

<script>
const dataMap = {
  0: { label: '未加', value: 0, background: 'transparent', color: '#777777', icon: '个微未加' },
  1: { label: '已加', value: 1, background: 'transparent', color: '#00B42A', icon: '个微已加' }
}
export default {
  components: {},
  props: {
    type: {
      type: Number,
      default: 0
    },
    className: {
      type: String,
      default: 'IconStatusicon'
    }
  },
  data() {
    return {}
  },
  computed: {
    state() {
      return dataMap[this.type]
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
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
