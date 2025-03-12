<template>
  <el-select ref="myselect" v-model="check" multiple :placeholder="placeholder" v-bind="$attrs" @change="onhandleChange" @click.native="onhandleClick">
    <el-option v-for="(item, index) in option" :key="index" :value="item.goodsId" :label="item.contentName" />
  </el-select>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    option: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      check: []
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log(val, '111')
        this.check = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    onhandleClick() {
      this.$refs.myselect && this.$refs.myselect.blur()
      this.$emit('onClick')
    },
    onhandleChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
    .el-select__caret {
        display: none;
    }
}
</style>
