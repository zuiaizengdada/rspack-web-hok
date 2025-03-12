<!-- @author zhengjie -->
<template>
  <el-input
    slot="reference"
    ref="courseSelect"
    v-model="value"
    disabled
    size="small"
    class="courseSelect"
    :placeholder="placeholder"
    clearable
    @click.native="inputClick"
    @mouseenter.native="mouseenter"
    @mouseleave.native="mouseleave"
  >
    <i v-if="clearStatus" slot="suffix" class="el-input__icon el-icon-circle-close" @click="clearFn" />
  </el-input>
</template>

<script>
export default {
  name: 'TeacherSelect',
  props: {
    defaultId: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    id: {
      type: String,
      default: ''
    },
    tearch: {
      type: Boolean,
      default: false
    },
    disabledFn: {
      type: Function,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => {}
    },
    lecturerId: {
      type: [Number, String],
      default: ''
    },
    tabList: {
      type: Array,
      default: () => {
        return [{ id: '5', name: '线下课', api: '' }]
      }
    },
    currentId: {
      type: String,
      default: '5'
    }
  },
  data() {
    return {
      teachList: [],
      name: '',
      loading: false,
      currentPage: 1,
      size: 10,
      total: 0,
      noMore: false,
      clearStatus: false
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    // 清空搜索条件
    clear() {
      // this.lecturerId = this.defaultTearchId
      this.$emit('selected', [{ goodsId: '', contentName: '' }])
    },
    // 点击input框
    inputClick() {
      const _this = this
      if (this.tearch) {
        this.$SelectOffineCource({
          visible: true,
          multiple: false,
          success: (res) => {
            _this.$emit('selected', res)
          }
        })
      } else {
        this.$SelectGoods({
          visible: true,
          multiple: false,
          tabList: this.tabList,
          currentId: this.currentId,
          disabledFn: this.disabledFn,
          params: {
            lecturerId: this.lecturerId,
            ...this.params
          },
          success: (res) => {
            _this.$emit('selected', res)
          }
        })
      }
    },
    clearFn(e) {
      e.stopPropagation()
      this.$emit('selected', [{ goodsId: '', contentName: '' }])
      this.clearStatus = false
    },
    mouseenter() {
      if (this.value.length > 0) {
        this.clearStatus = true
      }
    },
    mouseleave() {
      this.clearStatus = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .el-input__inner {
      cursor: pointer!important;
      background-color: #fff!important;
      color: #000!important;
    }
    .el-icon-circle-close {
        cursor: pointer!important;
    }
}
</style>
