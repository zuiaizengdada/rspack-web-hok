<template>
  <div v-if="tabList.length" class="p6_page_wrap">
    <div class="tabHeader">
      <el-tabs v-model="actionTabs">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <div slot="label" class="tabsHeader">
            {{ item.label }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="p6_page_wrap_content">
      <components :is="actionTabs" :user-array="userArray" />
    </div>
  </div>
</template>

<script>
import planWatchusers from './components/planWatchusers/index.vue'
import actualWatchusers from './components/actualWatchusers/index.vue'
import productRecord from './components/productRecord/index.vue'
import signRecord from './components/signRecord/index.vue'
import couponRecord from './components/couponRecord/index.vue'
import lotteryRecords from './components/lotteryRecords/index.vue'
import lianmaiRecord from './components/lianmaiRecord/index.vue'
import followUpNotes from './components/followUpNotes/index.vue'
import operationLog from './components/operationLog/index.vue'
import { liveRoomMenuOpts } from './data.js'
import { userNoPage } from '@/api/addressBookApi'
import { mapGetters } from 'vuex'
export default {
  components: {
    planWatchusers,
    actualWatchusers,
    productRecord,
    signRecord,
    couponRecord,
    lotteryRecords,
    lianmaiRecord,
    followUpNotes,
    operationLog
  },
  data() {
    return {
      actionTabs: '',
      tabList: [],
      userArray: []
    }
  },
  inject: ['permsList'],
  computed: {
    ...mapGetters(['permission_routes'])
  },
  watch: {
    tabList: {
      handler(val) {
        if (val.length > 0) {
          this.actionTabs = val[0].key
        }
      },
      deep: true,
      immediate: true
    },
    permsList: {
      handler(val) {
        if (val.length > 0) {
          this.initTab()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.loadUserNoPage()
  },
  methods: {
    initTab() {
      const baseArr = liveRoomMenuOpts()
      const arr = []
      baseArr.forEach(f => {
        if (this.permsList.includes(f.perms)) {
          arr.push(f)
        }
      })
      this.tabList = arr
    },
    // 获取中控台 配置权限
    getPermsList(key) {
      let permsList = []
      const obj = this.permission_routes.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoomV2')
        if (o) {
          permsList = o.meta.permsList
        }
      }
      return permsList
    },
    onhandleChange() {},
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
          // console.log(this.userArray, 'this.userArray')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.p6_page_wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .tabHeader {
    width: 100%;
    display: flex;
  }
  .p6_page_wrap_content {
    flex: 1 0 0;
  }
}
::v-deep {
  .el-tabs {
    width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-tabs__content {
    padding: 0;
    height: 100%;
  }
  .el-tab-pane {
    height: 100%;
  }
  .el-tabs__header {
    margin: 0;
    padding: 0 15px;
  }
  .el-tabs__nav-wrap::after {
    height: 0px;
    background-color: #f2f2f2;
  }
  .el-tabs__item {
    padding: 0 5px;
  }
  .tabsHeader {
    width: 100%;
    border-radius: 5px;
    background: #f7f7f7;
    height: 34px;
    float: left;
    width: 116px;
    text-align: center;
    line-height: 34px;
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: bolder;
    line-height: 34px;
    .tips {
      .tipsText {
        line-height: 34px;
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: bolder;
        line-height: 34px;
      }
    }
    &:hover {
      background: #deebff;
    }
  }
  .el-tabs__active-bar {
    opacity: 0;
  }
  .el-tabs__nav {
    height: 44px;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 34px;
  }
  .is-active {
    .tabsHeader {
      background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
    }
  }
}

::v-deep {
  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border,
  .custom-table.el-table--group {
    border: 1px solid #eff2f6 !important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border td,
  .custom-table.el-table--border th,
  .custom-table.el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #eff2f6 !important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
    border-bottom: 1px solid #eff2f6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table td,
  .custom-table.el-table th.is-leaf {
    border-bottom: 1px solid #eff2f6 !important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: 1px solid #eff2f6 !important;
  }
}
</style>
