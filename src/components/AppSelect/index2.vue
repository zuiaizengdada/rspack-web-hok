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
      <div v-infinite-scroll="getList" class="icon-list overflowOuto" infinite-scroll-disabled="scrollDisabled" infinite-scroll-distance="200">
        <div v-if="dataList.length === 0" class="noData">
          暂无数据
        </div>
        <el-checkbox-group v-model="selectId" class="radioGroup">
          <el-checkbox
            v-for="(item, index) in dataList"
            :key="index"
            class="radio"
            :label="item[props.value]"
            :disabled="disabledFn(item)"
            @change="selectedIcon(item)"
          >
            <slot :row="item">
              <span class="myLabel" :title="item[props.label || 'label']">{{ item[props.label || 'label'] }}</span>
            </slot>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <div class="footer">
        <el-button type="text" style="color: #999" @click="onhandeCancel">取消</el-button>
        <el-button type="text" @click="selectFn">确定</el-button>
      </div> -->
    </div>
    <el-input
      slot="reference"
      ref="tearchInput"
      v-model.trim="mySearch"
      v-bind="$attrs"
      size="small"
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
      type: Array,
      default: () => { return [] }
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
    maxLength: {
      type: Number,
      default: 0
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
      selectArr: [],
      selectId: [],
      noMore: false,
      mySearch: '',
      clearStatus: false,
      visble: false,
      CancelToken: axios.CancelToken
    }
  },
  computed: {
    scrollDisabled() {
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
    },
    selectArr: {
      handler(val) {
        this.selectId = val.reduce((pre, next) => {
          pre.push(next[[this.props.value]])
          return pre
        }, [])
      },
      deep: true,
      immediate: true
    }
    // visble(val) {
    //   if (!val) {
    //     // document.removeEventListener('click')
    //   } else {
    //     // this.closeShow()
    //   }
    // }
  },
  mounted() {
    this.closeShow()
  },
  methods: {
    // 清空搜索条件
    clear() {
      this.selectId = []
      this.currentPage = 1
      this.dataList = []
      this.getList()
    },
    // 查询
    searchFn(e) {
      if (typeof e !== 'undefined') {
        // this.selectId = []
        this.currentPage = 1
        this.dataList = []
        this.getList()
      }
    },
    // 点击选择
    selectedIcon(item) {
      // console.log(item, item[this.props.value])
      const index = this.selectArr.findIndex(v => v[this.props.value] === item[this.props.value])
      if (index === -1) {
        this.selectArr.push(item)
      } else {
        this.selectArr.splice(index, 1)
      }
      this.$emit('selected', this.selectArr)
      // this.visble = false
      // this.$emit('selected', item)
      // document.body.click()
    },
    closeShow() {
      const _this = this
      document.addEventListener('click', (e) => {
        // console.log(e)
        if (e.target?.parentNode?._prevClass && e.target?.parentNode?._prevClass.includes('tearchInput')) {
          return
        }
        if (e.target?._prevClass === 'el-input__icon el-icon-circle-close el-input__clear') {
          return
        }
        _this.visble = false
        document.removeEventListener('click', () => {})
      })
    },
    // 点击确定
    selectFn() {
      // console.log(this.selectId, this.selectArr)
      this.$emit('selected', this.selectArr)
      this.visble = false
      document.removeEventListener('click', () => {})
    },
    // 点击取消
    onhandeCancel() {
      this.selectId = []
      this.visble = false
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
        console.log(this.loading, this.noMore, 'loading,noMore')
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击input框
    inputClick() {
      // console.log('获取焦点触发')
      this.visble = true
      this.selectArr = JSON.parse(JSON.stringify(this.value))
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
      // const obj = {
      //   [this.props.label]: '',
      //   [this.props.value]: ''
      // }
      // this.selectedIcon(obj)
      // this.clearStatus = false
      // this.visble = false
      this.$refs.tearchInput && this.$refs.tearchInput.focus()
      // this.visble = true
      // this.inputClick()
      // this.closeShow()
    },
    blur() {
      // this.mySearch = this.label
      // this.visble = false
    },
    disabledFn(item) {
      if (this.maxLength > 0 && this.selectId.length >= this.maxLength) {
        return !this.selectId.includes(item[this.props.value])
      } else {
        return false
      }
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
    justify-content: flex-end;
    padding: 0 17px;
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
  .tearchInput {
    width: 200px;
  }
  .el-checkbox {
    display: flex;
    align-items: center;
    // justify-content: center;
  }
  .el-checkbox__label {
    width: 100%;
  }
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
