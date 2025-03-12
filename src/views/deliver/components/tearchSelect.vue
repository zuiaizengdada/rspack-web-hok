<!-- @author zhengjie -->
<template>
  <!-- <el-popover
    placement="bottom-start"
    width="200"
    popper-class="p-0"
    trigger="click"
  >
    <div v-loading="loading" class="icon-body">
      <el-input
        v-model="name"
        size="small"
        style="position: relative; padding: 10px"
        clearable
        placeholder="请输入关键词搜索讲师"
        @clear="clear"
        @keyup.enter.native="searchFn"
        @input="searchFn"
      />
      <div v-infinite-scroll="getTeacherList" class="icon-list overflowOuto" infinite-scroll-disabled="disabled">
        <el-radio-group v-model="lecturerId" class="radioGroup">
          <el-radio
            v-for="(item, index) in teachList"
            :key="index"
            :class="{ active: item.lecturerId === lecturerId }"
            class="radio"
            :label="item.lecturerId"
            @change="selectedIcon(item)"
          >
            <span>{{ item.lecturerName }}</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-input
      slot="reference"
      ref="tearchInput"
      v-model="value"
      disabled
      size="small"
      class="tearchInput"
      :placeholder="placeholder"
      clearable
      @click.native="inputClick"
      @mouseenter.native="mouseenter"
      @mouseleave.native="mouseleave"
    >
      <i v-if="clearStatus" slot="suffix" class="el-input__icon el-icon-circle-close" @click="clearFn" />
    </el-input>
  </el-popover> -->
  <AppSelect
    :get-api-fn="getPage"
    search-key="lecturerName"
    :value="defaultTearchId"
    :label="value"
    :props="props"
    :placeholder="placeholder"
    @selected="selected"
  />
</template>

<script>
import { getTeacherPage } from '@/api/shop.js'
import AppSelect from '@/components/AppSelect'
export default {
  name: 'TeacherSelect',
  components: {
    AppSelect
  },
  props: {
    defaultTearchId: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    addTearch: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      props: {
        label: 'lecturerName',
        value: 'lecturerId'
      }
      // teachList: [],
      // lecturerId: '',
      // name: '',
      // loading: false,
      // currentPage: 1,
      // size: 10,
      // total: 0,
      // noMore: false,
      // clearStatus: false
    }
  },
  computed: {
    // disabled() {
    //   return this.loading || this.noMore
    // }
  },
  methods: {
    selected(e) {
      console.log(e)
      this.$emit('selected', e)
    },
    getPage(params) {
      return getTeacherPage(params).then(res => {
        console.log(res, 'res')
        return {
          items: res.data.records,
          total: res.data.total
        }
      })
    }
    // 清空搜索条件
    // clear() {
    //   this.lecturerId = this.defaultTearchId
    //   this.currentPage = 1
    //   this.teachList = []
    //   this.getTeacherList()
    // },
    // // 查询
    // searchFn() {
    //   this.lecturerId = this.defaultTearchId
    //   this.currentPage = 1
    //   this.teachList = []
    //   this.teacherQueryByName()
    //   // this.getTeacherList()
    // },
    // // 点击选择
    // selectedIcon(item) {
    //   console.log(item)
    //   this.$emit('selected', item)
    //   document.body.click()
    // },
    // // 获取列表数据
    // getTeacherList() {
    //   console.log('加载')
    //   this.loading = true
    //   const params = {
    //     size: this.size,
    //     lecturerName: this.name,
    //     current: this.currentPage,
    //     startTime: '',
    //     endTime: ''
    //   }
    //   getTeacherPage(params)
    //     .then((res) => {
    //       console.log(res, 'res')
    //       res.data.records.map((v) => {
    //         this.teachList.push({
    //           lecturerId: v.lecturerId,
    //           lecturerName: v.lecturerName
    //         })
    //       })
    //       this.currentPage += 1
    //       this.noMore = this.teachList.length >= res.data.total
    //       console.log(this.noMore, 'noMore')
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // },
    // // 点击input框
    // inputClick() {
    //   this.lecturerId = this.defaultTearchId
    //   this.name = ''
    //   this.currentPage = 1
    //   this.teachList = []
    //   this.getTeacherList()
    // },
    // // 通过老师模糊搜索
    // teacherQueryByName() {
    //   this.currentPage = 1
    //   this.teachList = []
    //   this.getTeacherList()
    // },
    // mouseenter() {
    //   if (this.value.length > 0) {
    //     this.clearStatus = true
    //   }
    // },
    // mouseleave() {
    //   this.clearStatus = false
    // },
    // clearFn(e) {
    //   e.stopPropagation()
    //   const obj = {
    //     lecturerId: '',
    //     lecturerName: ''
    //   }
    //   this.selectedIcon(obj)
    //   this.clearStatus = false
    // }
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
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
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
        height: 40px;
        border-radius: 3px;
        padding: 9px 8px;
        background: #ffffff;
        border-radius: 3px;
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
  .tearchInput {
    width: 200px;
    .el-input__inner {
      cursor: pointer;
      background-color: #fff;
      color: #000;
    }
  }
}
.el-icon-circle-close {
  cursor: pointer!important;
}
</style>
