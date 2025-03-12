<template>
  <!-- 步骤条 -->
  <div class="step-wrapper">
    <div
      v-for="(item, index) in list"
      :key="item.id"
      :class="{
        'step-chunk': true,
        'step-chunk-active': getIsActive(item.id)
      }"
    >
      <div class="step-id">{{ item.id }}</div>
      <span class="step-label">{{ item.label }}</span>
      <div v-if="index !== list.length - 1" class="step-point">
        <img
          v-if="value === item.id"
          src="@/assets/image/aigc/digitalVideoManage/step-default.png"
          alt=""
        >
        <img
          v-else
          src="@/assets/image/aigc/digitalVideoManage/step-next.png"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'getValue'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      /**
       * @description: 步骤条数据
       * @param {String} id 步骤id
       * @param {String} label 步骤名称
       */
      default: () => []
    }
  },
  watch: {
    list: {
      handler(val) {
        if (val.length > 0) {
          // this.$emit('getValue', '2')
          this.$emit('getValue', this.list[0].id)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getIsActive(id) {
      if (!this.value) return false
      return Number(this.value) >= Number(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.step-wrapper {
  display: flex;
  align-items: center;
  .step-chunk {
    display: flex;
    align-items: center;
    user-select: none;
    .step-id {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      background: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 400;
      color: #777777;
    }
    .step-label {
      font-size: 16px;
      font-weight: 400;
      color: #999999;
      margin-left: 8px;
    }
    .step-point {
      width: 108px;
      height: 100%;
      color: #979797;
      margin: 0 12px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .step-chunk-active {
    .step-id {
      background: #1778ff;
      color: #ffffff;
    }
    .step-label {
      color: #1778ff;
    }
  }
}
</style>
