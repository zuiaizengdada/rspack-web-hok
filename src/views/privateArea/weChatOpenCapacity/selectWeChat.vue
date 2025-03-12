<!-- @author zhengjie -->
<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    width="200"
    popper-class="p-0"
    trigger="manual"
  >
    <el-input
      slot="reference"
      v-model="name"
      class="w-200"
      size="small"
      style="position: relative;"
      clearable
      placeholder="请输入"
      @clear="clear"
      @keyup.enter.native="searchFn"
      @input="searchFn"
      @focus="inputClick"
    />

    <div v-loading="loading" class="icon-body">
      <div v-infinite-scroll="getList" class="icon-list overflowOuto" infinite-scroll-disabled="disabled">
        <div class="radioGroup">
          <el-checkbox
            v-for="(item, index) in list"
            :key="index"
            :class="{ active: selectIds.includes(item.id) }"
            class="radio"
            :value="selectIds.includes(item.id)"
            :label="item.id"
            @change="selectedIcon(item)"
          >
            <span class="userName">{{ item.name }}</span>
            <span class="userOnline">在线</span>
          </el-checkbox>
        </div>
      </div>
      <div class="footer">
        <el-button size="mini" type="primary" @click="sure">确定</el-button>
        <el-button size="mini" @click="cancel">取消</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { corpUsertPage } from '@/api/privateArea/CWCorpUser'
export default {
  name: 'TeacherSelect',
  props: {
    defaultUser: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      list: [],
      selectUser: [], // 选择的用户数据
      selectIds: [], // 选择的用户数据id集合
      name: '',
      loading: false,
      currentPage: 1,
      size: 10,
      total: 0,
      noMore: false,
      clearStatus: false,
      visible: false
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
      this.currentPage = 1
      this.list = []
    },
    // 查询
    searchFn() {
      this.selectUser = JSON.parse(JSON.stringify(this.defaultUser))
      this.currentPage = 1
      this.list = []
      this.getList()
    },
    // 点击选择
    selectedIcon(item) {
      console.log(item, 'item')

      if (this.selectIds.includes(item.id)) {
        const i = this.selectIds.findIndex(v => v === item.id)
        i > -1 && (this.selectIds.splice(i, 1))
        const index = this.selectUser.findIndex(v => v.userId === item.id)
        console.log(index, 'index')
        index > -1 && (this.selectUser.splice(index, 1))
      } else {
        this.selectUser.push({
          userId: item.id,
          userName: item.name,
          onlineFlag: item.wxRobotStatus
        })
        this.selectIds.push(item.id)
      }

      console.log(this.selectIds, this.selectUser)
    },
    // 获取列表数据
    getList() {
      console.log('加载')
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.size,
        userName: this.name,
        linkHokUserFlag: '',
        headTeacherFlag: 2,
        headTeacherType: 2,
        customServiceFlag: '',
        wxRobotStatus: 3,
        wxInServiceFlag: '',
        hokInServiceFlag: ''
      }
      corpUsertPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.list = this.list.concat(res.data.records)
          this.currentPage += 1
          this.noMore = this.list.length >= res.data.total
          console.log(this.noMore, 'noMore')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击input框
    inputClick() {
      if (this.visible) {
        return
      }
      this.visible = true
      this.selectUser = JSON.parse(JSON.stringify(this.defaultUser))
      this.selectIds = []
      this.defaultUser.forEach(e => {
        this.selectIds.push(e.userId)
      })
      this.currentPage = 1
      this.list = []
      this.getList()
      console.log(this.selectUser, this.selectIds, '123')
    },
    // 通过模糊搜索
    teacherQueryByName() {
      this.currentPage = 1
      this.list = []
      this.getList()
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
      //   const obj = {
      //     id: '',
      //     userName: ''
      //   }
      //   this.selectedIcon(obj)
      this.clearStatus = false
    },
    sure() {
      this.name = ''
      this.$emit('selected', this.selectUser)
      this.visible = false
    },
    cancel() {
      this.visible = false
      // document.body.click()
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
    height: 200px;
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
        display: flex;
        align-items: center;
        margin-bottom: 1px;
        .userName {
            width: 100px;
        }
        .userOnline {
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #777777;
            line-height: 20px;
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
    justify-content: center;
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
