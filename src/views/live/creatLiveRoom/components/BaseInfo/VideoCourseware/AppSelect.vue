<!-- @author liuhui -->
<template>
  <el-popover
    v-model="visble"
    placement="bottom-start"
    :width="popoverWidth"
    popper-class="p-0"
    trigger="manual"
  >
    <div v-loading="loading" class="icon-body">
      <div v-infinite-scroll="getList" class="icon-list overflowOuto" infinite-scroll-disabled="disabled" infinite-scroll-distance="200">
        <div v-if="dataList.length === 0" class="noData">
          暂无数据
        </div>
        <el-radio-group v-model="selectId" class="radioGroup">
          <el-radio
            v-for="(item, index) in dataList"
            :key="index"
            :class="{ active: item[props.value] === selectId,solidLine: line }"
            class="radio"
            :label="item[props.value]"
            @change="selectedIcon(item)"
          >
            <slot :row="item">
              <span class="myLabel" :title="item[props.label || 'label']">{{ item[props.label || 'label'] }}</span>
            </slot>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-input
      slot="reference"
      ref="tearchInput"
      v-model.trim="mySearch"
      v-bind="$attrs"
      size="small"
      :style="`width:${inputWidth}px`"
      class="tearchInput"
      :placeholder="placeholder"
      clearable
      v-on="$listeners"
      @focus="inputClick"
      @keyup.enter.native="searchFn"
      @input="searchFn"
      @clear="clearFn"
      @blur="blur"
    />
  </el-popover>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TeacherSelect',
  props: {
    size: {
      type: Number,
      default: 10
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    getApiFn: {
      type: Function,
      default: () => {}
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    },
    searchKey: {
      type: String,
      default: 'keyWord'
    },
    params: {
      type: Object,
      default: () => {}
    },
    popoverWidth: {
      type: Number,
      default: 200
    },
    inputWidth: {
      type: Number,
      default: 200
    },
    line: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      source: null,
      loading: false,
      currentPage: 1,
      // size: 10,
      total: 0,
      dataList: [],
      selectId: '',
      noMore: false,
      mySearch: '',
      clearStatus: false,
      visble: false,
      CancelToken: axios.CancelToken
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    label: {
      handler(val) {
        this.mySearch = val
      },
      deep: true,
      immediate: true
    },
    mySearch() {
      this.searchFn()
    }
  },
  methods: {
    // 清空搜索条件
    clear() {
      this.selectId = this.value
      this.currentPage = 1
      this.dataList = []
      this.getList()
    },
    // 查询
    searchFn(e) {
      if (typeof e !== 'undefined') {
        this.selectId = this.value
        this.currentPage = 1
        this.dataList = []
        this.getList()
      }
    },
    // 点击选择
    selectedIcon(item) {
      console.log(item)
      this.visble = false
      this.$emit('selected', item)
      // document.body.click()
    },
    // 获取列表数据
    getList() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
      }
      this.source = this.CancelToken.source()
      this.loading = true
      const params = {
        size: this.size,
        current: this.currentPage,
        [this.searchKey]: this.mySearch,
        ...this.params
      }
      return this.getApiFn(params).then(res => {
        console.log(res, 'res')
        if (params.current === 1) {
          this.dataList = []
        }
        this.dataList.push(...res.items)
        this.total = res.total
        this.currentPage += 1
        this.noMore = this.dataList.length >= res.total
        this.loading = false
        console.log(this.loading, this.noMore, 'loading,noMore', this.dataList.length, res.total)
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击input框
    inputClick() {
      console.log('获取焦点触发')
      this.visble = true
      // this.selectId = this.value
      this.currentPage = 1
      this.dataList = []
      this.getList()
    },
    mouseenter() {
      if (this.label.length > 0) {
        this.clearStatus = true
      }
    },
    mouseleave() {
      this.clearStatus = false
    },
    clearFn(e) {
      console.log(44444444444)
      this.visble = false
      const obj = {
        [this.props.label]: '',
        [this.props.value]: ''
      }
      this.selectedIcon(obj)
      this.clearStatus = false
      this.visble = false
      this.$refs.tearchInput && this.$refs.tearchInput.blur()
      this.selectId = ''
      this.dataList = []
      console.log(this.value, 555555555)
      this.$emit('clear')
    },
    blur() {
      this.mySearch = this.label
      this.visble = false
    }
  }
}
</script>

  <style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    // padding: 10px;
    .icon-list {
      padding: 10px;
      box-sizing: border-box;
      height: 178px;
      position: relative;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
      }
      .noData {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        margin: 0;
        text-align: center;
        color: #999;
        font-size: 14px;
      }
      span {
        display: inline-block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
      .radioGroup {
        width: 100%;
        display: flex;
        flex-direction: column;
        .radio {
          width: 100%;
          // height: 40px;
          border-radius: 3px;
          padding: 9px 8px;
          background: #ffffff;
          border-radius: 3px;
          &:hover {
            background: #cee2ff;
          }
        }
        .active {
          background: #cee2ff;
        }
      }
    }
    .footer {
      width: 100%;
      height: 38px;
      display: flex;
      align-items: center;
      padding-left: 17px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      margin-top: 1px;
      box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-radio {
      display: flex;
      align-items: center;
      // justify-content: center;
    }
    .el-radio__label {
      width: 100%;
    }
  }
  .solidLine + .solidLine {
    border-top: 1px dashed #333;
  }
  .myLabel {
    width: 100%;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  // .el-icon-circle-close {
  //   cursor: pointer!important;
  // }
  </style>
