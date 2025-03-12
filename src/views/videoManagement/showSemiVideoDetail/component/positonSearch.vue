<template>
  <div class="positonSearch">
    <el-select :disabled="loading" :value="value" placeholder="请选择" size="small" class="mySelcet" clearable @change="onHandleChange">
      <el-option label="脱敏字幕" value="1" />
      <el-option label="敏感词" value="2" />
      <el-option label="爆款标记" value="3" />
    </el-select>
    <i v-if="loading" class="el-icon-loading m-r-10" />
    <template v-else>
      <span class="input__count-inner">{{ muCurrent }}/{{ total }}</span>
      <div class="action">
        <i class="btn el-icon-arrow-up" :class="{disable: current === 0 || total === 1}" @click="clickPrevious" />
        <i class="btn el-icon-arrow-down" :class="{disable: current === 0 || total === 0 || total === 1}" @click="clickNext" />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      select: ''
    }
  },
  computed: {
    muCurrent: {
      get() {
        return this.current
      },
      set(val) {
        this.$emit('update:current', val)
      }
    }
  },
  mounted() {},
  methods: {
    // 点击上一个
    clickPrevious() {
      if (this.muCurrent === 0 || this.total === 1) {
        return
      }
      if (this.muCurrent === 1) {
        this.muCurrent = this.total
        return this.$emit('clickNext')
      }
      this.muCurrent--
      this.$emit('clickNext')
    },
    // 点击下一个
    clickNext() {
      if (this.muCurrent === 0 || this.total === 0 || this.total === 1) {
        return
      }
      if (this.muCurrent === this.total) {
        this.muCurrent = 1
        return this.$emit('clickNext')
      }
      this.muCurrent++
      this.$emit('clickNext')
    },
    // 清空
    clear() {
      this.$emit('input', '')
      this.$emit('clear')
    },
    onHandleChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.positonSearch {
    // width: 197px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    display: flex;
    align-items: center;
    overflow: hidden;
    .mySelcet {
        flex: 1 0 0;
        max-width: 120px;
    }
    .input__count-inner {
        margin-left: 4px;
        margin-right: 4px;
        color: #999999;
    }
    .action {
        margin-left: 4px;
        height: 32px;
        width: 60px;
        border-left: 1px solid #D8DCE6;
        background-color: #D8DCE6;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
          width: 30px;
          height: 30px;
          text-align: center;
          color: #606266;
          cursor: pointer;
          background: #F5F7FA;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn + .btn {
          border-left: 1px solid #DCDFE6;
        }
        .disable {
            cursor: not-allowed;
            color: #C0C4CC;
        }
    }
}
::v-deep {
    .el-input__inner {
        border: none;
    }
    .el-select .el-input.is-focus .el-input__inner {
        border-color: #fff;
    }
    .el-input--small .el-input__icon {
        line-height: 42px;
    }
}
</style>
