<template>
  <el-tabs v-model="activeName" class="hok-tabs" v-on="$listeners">
    <el-tab-pane
      v-for="item in navTabs"
      :key="item.label"
      :label="labelCpt(item)"
      :name="nameCpt(item)"
      lazy
    >
      <template v-if="item.slot" v-slot:label>
        <slot :name="item.slot" />
      </template>
      <template v-else v-slot:label>
        {{ labelCpt(item) }}
      </template>
      <!-- 添加插槽以支持自定义内容 -->
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  props: {
    navTabs: {
      type: Array,
      default() {
        return []
      }
    },
    active: {
      type: [String, Number, Boolean],
      default() {
        return ''
      }
    },
    labelKey: {
      type: [String, Function],
      default() {
        return 'label'
      }
    },
    valueKey: {
      type: [String, Function],
      default() {
        return 'value'
      }
    }
  },
  data() {
    return {
      activeName: this.active
    }
  },
  computed: {
    labelCpt() {
      return item => {
        if (typeof this.labelKey === 'function') {
          return this.labelKey(item)
        } else {
          return item[this.labelKey]
        }
      }
    },
    nameCpt() {
      return item => {
        if (typeof this.valueKey === 'function') {
          return this.valueKey(item)
        } else {
          return item[this.valueKey]
        }
      }
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      console.log('activeName', newValue, newValue !== oldValue)
      if (newValue !== oldValue) {
        this.$emit('update:active', this.activeName)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap {
    padding: 0 20px;
    .el-tabs__item {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      line-height: 48px;
      height: 48px;
      &.is-active {
        color: var(--subMenuActive);
      }
    }
  }
}
</style>
