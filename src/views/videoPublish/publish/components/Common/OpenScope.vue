<template>
  <el-radio-group v-model="openScopeType" @input="handleInputScopeType">
    <el-radio v-for="item in openScopeList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>
<script>
export default {
  props: {
    scopeType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      openScopeType: 0,
      openScopeList: [{
        label: '公开',
        value: 0
      },
      {
        label: '好友可见',
        value: 2
      },
      {
        label: '仅自己可见',
        value: 1
      }
      ]
    }
  },
  watch: {
    scopeType(val) {
      this.openScopeType = val
    }
  },
  mounted() {
    this.openScopeType = this.scopeType
  },
  methods: {
    handleInputScopeType(val) {
      this.$emit('change', val)
    }
  }
}
</script>
