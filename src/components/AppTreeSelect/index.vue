<template>
  <div>
    <el-select
      ref="selectUpResId"
      v-model="value"
    >
      <el-option key="upResId" hidden :value="value" :label="value" />
      <el-tree
        :data="data"
        :props="defaultProps"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        @node-click="handleNodeClick"
      >
        <span slot-scope="{ node }" class="custom-tree-node">
          <span :title="node.label" class="treeLabel" :class="{active: node.label === value}">
            {{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ''
    }
  },
  data() {
    return {
      upResName: '',
      defaultProps: {
        children: 'children',
        label: 'dirName'
      }
    }
  },
  methods: {
    // 函数部分
    // 节点点击事件
    handleNodeClick(data) {
      // 这里主要配置树形组件点击节点后，设置选择器的值；自己配置的数据，仅供参考
      this.upResName = data.dirName
      //   this.saveForm.upResId = data.resId
      this.$emit('input', data.dirName)
      this.$emit('change', data.id)
      // 选择器执行完成后，使其失去焦点隐藏下拉框的效果
      this.$refs.selectUpResId.blur()
    }
  }
}
</script>

<style  lang="scss" scoped>
::v-deep .custom-tree-node {
  width: 200px!important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
  .treeLabel {
    width: 200px!important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .active {
    color: #105cfb;
    font-weight: 700;
  }
</style>
