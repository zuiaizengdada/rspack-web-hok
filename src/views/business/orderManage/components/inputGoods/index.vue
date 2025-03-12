<!-- @author zhengjie -->
<template>
  <el-popover placement="bottom-start" width="290" popper-class="p-0" trigger="click">
    <div v-loading="loading" class="icon-body">
      <el-input
        v-model="name"
        size="small"
        style="position: relative; padding: 10px"
        clearable
        placeholder="请输入"
        @keyup.enter.native="searchFn"
        @input="searchFn"
      />
      <div v-infinite-scroll="getMaterialGoodsByNameList" class="icon-list overflowOuto" infinite-scroll-disabled="disabled">
        <el-radio-group v-model="teacherId" class="radioGroup">
          <el-radio
            v-for="(item, index) in teachList"
            :key="index"
            :class="{ active: item.teacherId === teacherId }"
            class="radio"
            :label="item.teacherId"
            :disabled="item.disabled"
            @change="selectedIcon(item)"
          >
            <span>{{ item.teacherName }}</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <el-input
      slot="reference"
      v-model="value"
      disabled
      size="small"
      class="tearchInput"
      style="width: 200px"
      placeholder="请选择"
      clearable
      @click.native="inputClick"
    />
  </el-popover>
</template>

<script>
import {
  getMaterialGoodsByNameList
} from '@/api/business'
import { seeRelationAllTeacher } from '@/api/shop'
// import { getTeacherList, teacherQueryByName } from '@/api/tearchCenter/index'
import { getTeacherList } from '@/api/tearchCenter/index'
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
      seeAllTeacher: []
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {
    // this.getSeeRelationAllTeacher()
  },
  methods: {
    // 清空搜索条件
    clear() {
      this.teacherId = this.defaultTearchId
      this.currentPage = 1
      this.teachList = []
      // this.getTeacherList()
      this.getMaterialGoodsByNameList()
    },
    // 查询
    searchFn() {
      this.teacherId = this.defaultTearchId
      this.currentPage = 1
      this.teachList = []
      this.teacherQueryByName()
      // this.getTeacherList()
      // this.getMaterialGoodsByNameList()
    },
    // 点击选择
    selectedIcon(item) {
      console.log(item)
      this.$emit('selectedGoods', item)
      document.body.click()
    },
    // 获取列表数据
    getTeacherList() {
      console.log('加载')
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
          console.log(res, 'res')
          res.data.items.map((v) => {
            this.teachList.push({
              teacherId: v.teacherId,
              teacherName: v.teacherName,
              disabled: false
            })
          })
          if (this.seeAllTeacher.length) {
            this.seeAllTeacher.map(v => {
              this.teachList.map(e => {
                if (v === e.teacherId) {
                  e.disabled = true
                }
              })
            })
          }
          this.currentPage += 1
          this.noMore = this.teachList.length >= res.data.total
          console.log(this.noMore, 'noMore')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取列表数据
    getMaterialGoodsByNameList() {
      console.log('加载')
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.size,
        contentName: ''
      }
      getMaterialGoodsByNameList(params)
        .then((res) => {
          console.log('res', res)
          console.log('res.data', res.data)
          res.data.map((v) => {
            console.log(v)
            this.teachList.push({
              teacherId: v.goodsId,
              teacherName: v.contentName,
              content: v,
              disabled: false
            })
          })
          if (this.seeAllTeacher.length) {
            this.seeAllTeacher.map(v => {
              this.teachList.map(e => {
                if (v === e.teacherId) {
                  e.disabled = true
                }
              })
            })
          }
          this.currentPage += 1
          this.noMore = this.teachList.length >= res.data.total
          console.log(this.noMore, 'noMore')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询所有已关联师资中心的讲师
    getSeeRelationAllTeacher() {
      seeRelationAllTeacher()
        .then((res) => {
          console.log(res, '查询所有已关联师资中心的讲师')
          this.seeAllTeacher = res.data
        })
        .catch(() => {
        })
    },
    // 点击input框
    inputClick() {
      this.teacherId = this.defaultTearchId
      this.name = ''
      this.currentPage = 1
      this.teachList = []
      // this.getTeacherList()
      this.getMaterialGoodsByNameList()
    },
    // 通过老师模糊搜索
    teacherQueryByName() {
      const params = {
        contentName: this.name
      }
      this.noMore = true
      this.loading = true
      getMaterialGoodsByNameList(params)
        .then((res) => {
          this.loading = false
          // console.log('查询结果0----res', res)
          const teachList = []
          res.data.map((v) => {
            teachList.push({
              teacherId: v.goodsId,
              teacherName: v.contentName,
              content: v,
              disabled: false
            })
            // v.cooperateStatus === 2 ? teachList.push({
            //   teacherId: v.teacherId,
            //   teacherName: v.teacherName,
            //   disabled: false
            // }) : ''
          })

          if (this.seeAllTeacher.length) {
            this.seeAllTeacher.map(v => {
              teachList.map(e => {
                v === e.teacherId ? e.disabled = true : ''
              })
            })
          }
          this.teachList = teachList
        })
        .catch(() => {
          this.loading = false
        })
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
      .el-input__inner {
        cursor: pointer;
        background-color: #fff;
        color: #000;
      }
    }
  }
  ::v-deep .el-input__validateIcon {
    display: none !important;
  }
  </style>

