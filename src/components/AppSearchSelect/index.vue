<template>
  <div slot="reference" style="position: relative">
    <div class="hiddenView" @click="inputClick" @mouseenter.stop="mouseenter" @mouseleave.stop="mouseleave">
      <i v-if="clearStatus" class="el-input__icon el-icon-circle-close hiddenViewClose" @click="clearFn" />
    </div>
    <el-input
      ref="courseSelect"
      v-model="value"
      disabled
      size="small"
      class="courseSelect"
      :placeholder="placeholder"
      clearable
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchSelect',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      loading: false,
      clearStatus: false
    }
  },
  methods: {
    // 清空搜索条件
    clear() {
      // this.lecturerId = this.defaultTearchId
      this.$emit('onClear')
    },
    // 点击input框
    inputClick() {
      this.$emit('onClick')
    },
    clearFn(e) {
      e.stopPropagation()
      this.$emit('onClear')
      this.clearStatus = false
    },
    mouseenter() {
      if (this.value.length > 0) {
        this.clearStatus = true
      }
    },
    mouseleave() {
      this.clearStatus = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .el-input__inner {
      cursor: pointer!important;
      background-color: #fff!important;
      color: #000!important;
    }
    .el-icon-circle-close {
        cursor: pointer!important;
    }
}
.hiddenView {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: pointer;
}
.hiddenViewClose {
  position: absolute;
  right: 5px;
  color: #C0C4CC;
  line-height: 32px;
}
</style>
