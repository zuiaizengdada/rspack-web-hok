<!-- @author zhengjie -->
<template>
  <div style="position: relative">
    <!-- 多选 -->
    <div
      class="hiddenView"
      @click="inputClick"
      @mouseenter.stop="mouseenter"
      @mouseleave.stop="mouseleave"
    >
      <i
        v-if="clearStatus"
        class="el-input__icon el-icon-circle-close hiddenViewClose"
        @click="clearFn"
      />
    </div>
    <div
      v-if="multiple && Array.isArray(value)"
      class="inputBox"
      @click="inputClick"
    >
      <el-tag
        v-for="(item, index) in value"
        :key="index"
        size="mini"
        type="info"
      >
        {{ item }}
      </el-tag>
    </div>
    <!-- 单选 -->
    <el-input
      v-else
      slot="reference"
      ref="courseSelect"
      v-model="value"
      disabled
      size="small"
      class="courseSelect"
      :placeholder="placeholder"
      clearable
    />
  </div>
</template>

<script>
export default {
  name: 'TeacherSelect',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    submitRequest: {
      type: Function,
      default: undefined
    },
    closeRequest: {
      type: Function,
      default: undefined
    },
    initSearch: {
      type: Object,
      default: undefined
    },
    defaultId: {
      type: [String, Array],
      default: ''
    },
    value: {
      type: [String, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    tearchSearch: {
      type: Boolean,
      default: false
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
    defaultList: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: String,
      default: '5'
    },
    materialIdList: {
      type: Array,
      default: () => []
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
      this.$emit('selected', [], [])
    },
    // 点击删除tag
    async handleCloseTag(index, item) {
      const goods = this.value?.reduce((preValue, curValue, ind) => {
        return item === curValue
          ? [...preValue]
          : [
              ...preValue,
              { goodsId: this.defaultId[ind], contentName: curValue }
            ]
      }, [])
      const goodskey = goods?.map(item => item.goodsId) || []
      if (this.closeRequest) {
        const { code } = await this.closeRequest({ goodsIdList: goodskey })
        if (code !== 1) return
      }
      this.$emit('selected', goods, goodskey)
    },

    // 点击input框
    inputClick() {
      const _this = this
      if (this.tearch) {
        this.$SelectOffineCource({
          visible: true,
          multiple: _this.multiple,
          submitRequest: _this.submitRequest,
          initSearch: this.initSearch,
          defaultValue: _this.defaultId,
          success: (res, keyList) => {
            _this.$emit('selected', res, keyList)
          }
        })
      } else {
        this.$SelectGoods({
          visible: true,
          multiple: this.multiple,
          tabList: this.tabList,
          initSearch: this.initSearch,
          tearchSearch: this.tearchSearch,
          currentId: this.currentId,
          disabledFn: this.disabledFn,
          defaultValue: _this.defaultId,
          params: {
            lecturerId: this.lecturerId,
            ...this.params
          },
          success: (res, keyList, selected) => {
            console.log(res, keyList, selected, 'res, keyList, selected')
            let list = []
            if (this.defaultList.length) {
              list = this.defaultList.map(item => ({
                contentName: item.goodsName,
                goodsId: item.goodsId
              }))
            }
            const valueList =
              keyList?.map(item => ({
                goodsId: item,
                contentName:
                res?.find(items => items.goodsId === item)?.contentName ||
                selected?.find(items => items.goodsId === item)?.contentName ||
                  list?.find(items => items.goodsId === item)?.contentName
              })) || []
            console.log(4444444, res, valueList)
            _this.$emit('handleSelected', valueList)
            _this.$emit('selected', selected, keyList)
          }
        })
      }
    },
    clearFn(e) {
      e.stopPropagation()
      const value = this.multiple ? [] : [{ goodsId: '', contentName: '' }]
      this.$emit('handleSelected', value, 'clear')
      this.$emit('selected', value, value, 'clear')
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
.inputBox {
  background-color: #ffffff;
  border-radius: 4px;
  min-height: 32px;
  max-height: 80px;
  overflow-y: scroll;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  flex-wrap: wrap;
  align-content: center;
  outline: none;
  padding: 0 15px;
  &::-webkit-scrollbar {
    display: none;
  }
}
::v-deep {
  .el-input__inner {
    cursor: pointer !important;
    background-color: #fff !important;
    color: #000 !important;
  }
  .el-icon-circle-close {
    cursor: pointer !important;
  }
  .el-tag {
    max-width: 140px;
    overflow: hidden;
    padding-right: 15px;
    margin: 5px 0;
    margin-right: 5px;
    float: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    .el-tag__close {
      position: absolute;
      right: 0;
      top: 2px;
    }
  }
}

.hiddenView {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  cursor: pointer;
}
.hiddenViewClose {
  position: absolute;
  right: 5px;
  color: #c0c4cc;
  line-height: 32px;
}
</style>
