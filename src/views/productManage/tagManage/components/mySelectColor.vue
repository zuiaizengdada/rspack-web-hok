<template>
  <div>
    <el-popover
      placement="bottom"
      popper-class="myselectColorPopover"
      trigger="hover"
    >
      <div class="myselectColor flex flex-middle flex-wrap">
        <span
          v-for="(item, index) in predefineColors"
          :key="index"
          class="flex flex-middle flex-center"
          :style="{
            background: getPrColor(item),
            marginRight: index === 3 ? 0 : '8px',
            marginBottom: index < 4 ? '8px' : 0
          }"
          @click="selectColor(item)"
        >
          <i v-if="color === item" style="color: #fff" class="el-icon-check" />
        </span>
      </div>
      <div
        slot="reference"
        :style="`background:${getPrColor(color)}`"
        class="defColor"
        size="mini"
      >
        <!-- <i class="el-icon-arrow-down" /> -->
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'MySelectColor',
  props: {
    // Your component props here
    color: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 1
    },
    predefineColors: {
      type: Array,
      default: () => []
    }
  },
  // Your component options here
  methods: {
    // Your component methods here
    selectColor(color) {
      this.$emit('selectColor', color, this.type)
    }
  }
}
</script>
<style lang="scss" scoped>
/* Your component styles here */
.defColor {
  width: 28px;
  height: 28px;
  border-radius: 4px 0 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 1px solid #d8dce6;
  // border-right: none;
  // box-sizing: border-box;
  cursor: pointer;
  i {
    font-size: 14px;
    color: #fff;
  }
}

.myselectColor {
  border-radius: 4px;
  width: 120px;
  span {
    width: 24px;
    height: 24px;
    border-radius: 2px;
  }
}
</style>
