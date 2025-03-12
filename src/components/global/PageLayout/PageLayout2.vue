
// 页面布局
// 属性: type; 取值 tablePage: 表格列表页面布局 formPage: 表单页面布局
<template>
  <component :is="type" ref="pageLayout" v-bind="$attrs" class="PageLayout" :slot-arr="slotArr" v-on="$listeners">
    <template v-for="(item, i) in slotArr" :slot="item" slot-scope="text, record, index">
      <div :key="`table-${i}`">
        <slot :name="item" :row="text.row" :record="record" :index="index" />
      </div>
    </template>
  </component>
</template>

<script>
import tablePage from './tablePage2.vue'
export default {
  name: 'PageLayout2',
  components: {
    tablePage
  },
  props: {
    slotArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      type: 'tablePage'
    }
  },
  methods: {
    // 改变表格选中状态
    handletoggleSelectionAll() {
      this.$refs.pageLayout.handletoggleSelectionAll()
    },
    // 表格取消选中
    clearSelection() {
      this.$refs.pageLayout.clearSelection()
    },
    // 对表格重新布局
    doLayout() {
      this.$refs.pageLayout.doLayout()
    }
  }
}
</script>

<style lang='scss' scoped>
.PageLayout {
  height: 100%;
}
</style>
