<template>
  <div class="cascader">
    <area-cascader
      v-if="isBol"
      ref="cascader"
      type="text"
      :data="dataList"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <i
      v-show="$attrs.value.length"
      class="el-icon-error closeIcon"
      @click="handleClose"
    />
  </div>
</template>

<script>
import { pcaa } from 'area-data-vue'
import 'vue-area-linkage/dist/index.css'
export default {
  data: () => ({
    dataList: {},
    isBol: true
  }),
  created() {
    this.dataList = Object.freeze(pcaa)
  },
  methods: {
    handleClose() {
      this.setInit()
      this.$emit('handleClose')
    },
    setInit() {
      this.isBol = false
      setTimeout(() => {
        this.isBol = true
      }, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
.cascader {
  line-height: 1;
  position: relative;
  .closeIcon {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    color: #999999;
  }
}
</style>
