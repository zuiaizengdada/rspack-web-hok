<template>
  <div>
    <el-checkbox v-model="checked" @change="allChange">选中本页</el-checkbox>

    <template v-for="(item, index) in tools">
      <el-button :key="`item_${index}`" class="m-l-10" @click="btn(index)">{{ item }}</el-button>
    </template>
    <!-- <el-button type="primary"  >更多设置</el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    tools: {
      type: Array,
      default: () => {
        return ['上架', '下架', '删除']
      }
    }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
    allChange(e) {
      this.$emit('onAllChange', e)
    },
    btn(index) {
      this.$emit('onClick', index)
    },
    handleChangeType(res) {
      this.checked = res
    }
  }
}
</script>

<style>

</style>
