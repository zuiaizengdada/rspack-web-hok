<!-- 弹框封装 -->
<template>
  <div>
    <el-drawer
      v-if="type === 1 || type === 3"
      class="drawer"
      :title="title"
      :visible="visible"
      :direction="direction"
      :size="size"
      :wrapper-closable="false"
      :destroy-on-close="true"
      :append-to-body="true"
      @close="close"
    >
      <slot />
    </el-drawer>
    <el-dialog
      v-if="type === 2"
      top="7vh"
      class="dialog"
      :title="title"
      :visible="visible"
      :direction="direction"
      :width="width"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :append-to-body="true"
      @close="close"
    >
      <slot />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number, // 1: 新增; 2查看; 3编辑;
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    title: {
      type: String,
      default: '新增'
    },
    width: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: '800px'
    },
    size: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: '50%'
    }
  },
  methods: {
    close() {
      // console.log('关闭触发')
      // this.visible = false
      // this.$emit('close')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
