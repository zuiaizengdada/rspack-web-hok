<!-- @author zhengjie -->
<template>
  <el-popover
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
        placeholder="请输入老师名称"
        @clear="clear"
        @keyup.enter.native="searchFn"
        @input="searchFn"
      />
      <div v-infinite-scroll="getTeacherList" class="icon-list overflowOuto" infinite-scroll-disabled="disabled">
        <el-radio-group v-model="teacherId" class="radioGroup">
          <el-radio
            v-for="(item, index) in teachList"
            :key="index"
            :class="{ active: item.teacherId === teacherId }"
            class="radio"
            :label="item.teacherId"
            @change="selectedIcon(item)"
          >
            <span>{{ item.teacherName }}</span>
          </el-radio>
        </el-radio-group>
      </div>
      <div v-if="addTearch" class="footer">
        <svg-icon icon-class="add" />
        <span class="m-l-10" @click="gotoAddTeacher">添加老师</span>
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
  </el-popover>
</template>

<script>
import { getTeacherList, teacherQueryByName } from '@/api/tearchCenter/index'
export default {
  name: 'TeacherSelect',
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
      teachList: [],
      teacherId: '',
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
      this.teacherId = this.defaultTearchId
      this.currentPage = 1
      this.teachList = []
      this.getTeacherList()
    },
    // 查询
    searchFn() {
      this.teacherId = this.defaultTearchId
      this.currentPage = 1
      this.teachList = []
      this.teacherQueryByName()
      // this.getTeacherList()
    },
    // 点击选择
    selectedIcon(item) {
      this.$emit('selected', item)
      document.body.click()
    },
    // 点击添加老师
    gotoAddTeacher() {
      const routeUrl = this.$router.resolve({
        path: `/teacherCenter/teachFile/add`
      })
      window.open(routeUrl.href, '_blank')
      document.body.click()
    },
    // 获取列表数据
    getTeacherList() {
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.size,
        teacherName: this.name,
        serviceEnterprise: '',
        domainCode: '',
        cooperateStatus: '',
        assessStatus: ''
      }
      getTeacherList(params)
        .then((res) => {
          res.data.items.map((v) => {
            this.teachList.push({
              teacherId: v.teacherId,
              teacherName: v.teacherName
            })
          })
          this.currentPage += 1
          this.noMore = this.teachList.length >= res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击input框
    inputClick() {
      this.teacherId = this.defaultTearchId
      this.name = ''
      this.currentPage = 1
      this.teachList = []
      this.getTeacherList()
    },
    // 通过老师模糊搜索
    teacherQueryByName() {
      const params = {
        name: this.name
      }
      this.noMore = true
      this.loading = true
      teacherQueryByName(params)
        .then((res) => {
          this.loading = false
          this.teachList = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    mouseenter() {
      if (this.value.length > 0) {
        this.clearStatus = true
      }
    },
    mouseleave() {
      this.clearStatus = false
    },
    clearFn(e) {
      e.stopPropagation()
      const obj = {
        teacherId: '',
        teacherName: ''
      }
      this.selectedIcon(obj)
      this.clearStatus = false
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
