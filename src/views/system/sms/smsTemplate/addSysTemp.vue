<template>
  <MCard class="addSysTemp">
    <MBreadRow :title="['短信模板', '新增模板']" @onClick="onHeaderClick" />
    <sysTempFrom type="1" />
  </MCard>
</template>

<script>
import sysTempFrom from './sysTempForm.vue'
export default {
  components: {
    sysTempFrom
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onHeaderClick(index) {
      index === 0 && (this.$router.replace('smsTemplate'))
    }
  }
}
</script>

<style lang='scss' scoped>
.addSysTemp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
