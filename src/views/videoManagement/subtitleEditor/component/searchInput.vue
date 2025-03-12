<template>
  <div class="searchInput">
    <el-input
      v-model="myValue"
      type="text"
      class="myInput"
      v-bind="$attrs"
      :disabled="loading"
      @input="inputChange"
    />
    <i v-if="loading" class="el-icon-loading m-r-10" />
    <template v-else>
      <span class="input__count-inner">{{ muCurrent }}/{{ total }}</span>
      <i v-if="value.length > 0" class="el-icon-error input__clear" @click="clear" />
      <div class="action">
        <i class="btn el-icon-arrow-up" :class="{disable: current === 0 || total === 1}" @click="clickPrevious" />
        <i class="btn el-icon-arrow-down" :class="{disable: current === 0 || total === 0 || total === 1}" @click="clickNext" />
      </div>
    </template></div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    current: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    muCurrent: {
      get() {
        return this.current
      },
      set(val) {
        this.$emit('update:current', val)
      }
    },
    myValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
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
        return this.$emit('change')
      }
      this.muCurrent--
      this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_positioning')
      this.$emit('change')
    },
    // 点击下一个
    clickNext() {
      if (this.muCurrent === 0 || this.total === 0 || this.total === 1) {
        return
      }
      if (this.muCurrent === this.total) {
        this.muCurrent = 1
        return this.$emit('change')
      }
      this.muCurrent++
      this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_positioning')
      this.$emit('change')
    },
    inputChange(e) {
      console.log(e, '输入时候的e')
      const v = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
      console.log(v, 'v')
      this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_keyword')
      this.$emit('input', v)
    },
    // 清空
    clear() {
      this.$emit('input', '')
      this.$emit('clear')
    }
  }
}
</script>

<style lang='scss' scoped>
.searchInput {
    width: 320px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    display: flex;
    align-items: center;
    overflow: hidden;
    .myInput {
        height: 36px;
        flex: 1 0 0;
        font-size: 14px;
        color: #333333;
        line-height: 36px;
        background:none;
        outline:none;
        border:none;
    }
    // 去掉el-input默认样式
    ::v-deep .el-input__inner {
        border: none;
        background: none;
        outline: none;
        box-shadow: none;
    }
    ::v-deep .el-input__inner::-webkit-input-placeholder {
        color: #999999;
    }
    .input__count-inner {
        margin-left: 4px;
        margin-right: 4px;
        color: #999999;
    }
    .input__clear {
        color: rgba(0,0,0,0.4);
        font-size: 16px;
        margin-left: 4px;
        margin-right: 4px;
        cursor: pointer;
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
.m-r-10 {
  margin-right: 10px;
}
</style>
