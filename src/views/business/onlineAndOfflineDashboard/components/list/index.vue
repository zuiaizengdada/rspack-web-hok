<template>
  <div class="AppDatePicker">
    <el-drawer
      title="榜单"
      :visible.sync="drawerFlag"
      :size="1200"
      :before-close="handleClose"
    >
      <div class="tfzh-content">
        <div class="tfzh-header-content">
          <MTitle class="tfzh-title" :title="title" />
          <div v-if="tearcherObj && tearcherObj.teacherName " class="tearch-cls">
            <span @click="clearTearcher">{{ tearcherObj.teacherName }}<i class="el-icon-error" /></span>
          </div>
          <AppDatepicker
            ref="HeadDatePickerRefForList"
            style="width: 636px; float: right;"
            :show="[0,1, 2, 3, 4]"
            :search="search.time"
            :default="3"
            :picker-options="pickerOptions"
            @change="timeChange"
          />
        </div>
        <div class="center-block">
          <div class="choose-channel-block-list">
            <span :class="chooseType === 1?'active':''" @click="changeChooseType(1)">员工</span>
            <span v-if="formForList.offlineFlag === 0" :class="chooseType === 2?'active':''" @click="changeChooseType(2)">达人</span>
            <span :class="chooseType === 3?'active':''" @click="changeChooseType(3)">部门</span>
            <span :class="chooseType === 4?'active':''" @click="changeChooseType(4)">商品</span>
          </div>
          <el-button class="right-daochu-cls" size="small" type="primary" @click="downloadForData">导出</el-button>
        </div>
        <div class="table-data-block">
          <listTable
            ref="listTableRefs"
            :columns="chooseType === 1?employeeColumns:(chooseType === 2?darenColumns:(chooseType === 3?deparmentColumns:(chooseType === 4?goodsColumns:[])))"
            :get-list="getList"
            :choose-type="chooseType"
            :hb-line="6"
            :form-for-list="chooseItem"
            :is-pages="false"
          >
            <template v-slot:employeeDeptName="{scope}">
              {{ scope.row.employeeDeptName }}
            </template>
            <template v-slot:gmvAmount="{scope}">
              <div :class="(chooseItem.bizTypeActive === 3)?'blue-cls':''">
                <span>{{ filterPrice(scope.row.gmvAmount) }}</span>
                <em class="dl-em">（{{ scope.row.gmvOrderCount }}单）</em>
              </div>
            </template>
            <template v-slot:expertName="{scope}">
              <span>{{ scope.row.expertName }}</span>
            </template>
            <template v-slot:employeeDeptIdChainName="{scope}">
              <span>{{ scope.row.employeeDeptIdChainName?scope.row.employeeDeptIdChainName:'-' }}</span>
            </template>
            <template v-slot:revenueAmount="{scope}">
              <div :class="(chooseItem.bizTypeActive !== 2 && chooseItem.bizTypeActive !== 3)?'blue-cls':''">
                <span>{{ filterPrice(scope.row.revenueAmount) }}</span>
                <em class="dl-em">（{{ scope.row.revenueOrderCount }}单）</em>
              </div>
            </template>
            <template v-slot:refundAmount="{scope}">
              <div :class="(chooseItem.bizTypeActive === 2)?'blue-cls':''">
                <span>{{ filterPrice(scope.row.refundAmount) }}</span>
                <em class="dl-em">（{{ scope.row.refundOrderCount }}单）</em>
              </div>
            </template>
            <template v-slot:refundPercent="{scope}">
              <span>{{ scope.row.refundPercent>1000?'1000%+':scope.row.refundPercent+'%' }}</span>
            </template>
            <template v-slot:contemporaneousAmount="{scope}">
              <span>{{ filterPrice(scope.row.contemporaneousAmount) }}</span>
            </template>
            <template v-slot:increaseRate="{scope}">
              <span>{{ scope.row.increaseRate>1000?'1000%+':scope.row.increaseRate+'%' }}</span>
            </template>

          </listTable>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import moment from 'moment'
import { filterPrice } from '@/utils'
import listTable from './table.vue'
import AppDatepicker from '../appDatePicker'
import { employeeColumns, darenColumns, deparmentColumns, goodsColumns } from './list.js'
import {
  uploadDeptRevenueRankList, // 部门导出
  uploadEmployeeRevenueRankList, // 员工导出
  uploadExportRevenueRankList, // 达人导出
  uploadProductRevenueRankList, // 商品导出
  getEmployeeRevenueRankList, // 营收排行榜数据 员工接口
  getRankDeptRevenueRankList, // 营收排行榜 部门数据
  getRankProductRevenueRankList, // 营收排行榜 商品数据
  getRankExeprtRevenueRankList // 营收排行榜 达人数据
} from '@/api/business/onlineAndOffline.js'
export default {
  components: {
    AppDatepicker,
    listTable
  },
  data() {
    return {
      windowHeight: 0,
      employeeColumns,
      darenColumns,
      deparmentColumns,
      goodsColumns,
      chooseType: 1,
      search: {
        time: {
          active: 1,
          time: [],
          type: ''
        }
      },
      title: '榜单',
      drawerFlag: false,
      formForList: {
      },
      chooseItem: {},
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 2个月以内
            const minTime = moment(this.currentTime).subtract(12, 'month').valueOf()
            const maxTime = moment(this.currentTime).add(12, 'month').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      tearcherObj: {}
    }
  },
  watch: {
  },
  mounted() {
    // this.windowHeight = window.innerHeight - 230
  },
  methods: {
    clearTearcher() {
      this.tearcherObj = {}
      this.$nextTick(() => {
        this.$refs.HeadDatePickerRefForList.changeMorenTime(this.formForList.time)
        this.$refs.listTableRefs.init()
      })
    },
    downloadForData() {
      const params = this.returnParams()
      if (this.chooseType === 1) {
        uploadEmployeeRevenueRankList(params).then(res => {
          if (res.code === 1 && res.data) {
            setTimeout(() => {
              window.open(res.data, 'blank')
              this.$message.success('导出成功！')
            }, 2000)
          }
        })
      }
      if (this.chooseType === 2) {
        uploadExportRevenueRankList(params).then(res => {
          if (res.code === 1 && res.data) {
            window.open(res.data, 'blank')
            this.$message.success('导出成功！')
          }
        })
      }
      if (this.chooseType === 3) {
        uploadDeptRevenueRankList(params).then(res => {
          if (res.code === 1 && res.data) {
            window.open(res.data, 'blank')
            this.$message.success('导出成功！')
          }
        })
      }
      if (this.chooseType === 4) {
        uploadProductRevenueRankList(params).then(res => {
          if (res.code === 1 && res.data) {
            window.open(res.data, 'blank')
            this.$message.success('导出成功！')
          }
        })
      }
    },
    filterPrice,
    init(item, obj) {
      this.title = obj.bizTypeName
      this.title += '榜单'
      this.formForList = item
      this.chooseItem = obj
      this.$nextTick(() => {
        this.$refs.HeadDatePickerRefForList.changeAndFillDate(item.time)
        setTimeout(() => {
          this.$refs.listTableRefs.init()
        }, 500)
      })
    },
    changeDataHasTearcher(item, bizType, tearcherObj) {
      this.formForList = item
      this.chooseItem = {
        bizType: bizType
      }
      this.tearcherObj = tearcherObj
      this.$nextTick(() => {
        this.$refs.HeadDatePickerRefForList.changeAndFillDate(item.time)
        setTimeout(() => {
          this.$refs.listTableRefs.init()
        }, 500)
      })
    },
    getList() {
      const params = this.returnParams()
      if (this.chooseType === 1) {
        return getEmployeeRevenueRankList(params)
      } else if (this.chooseType === 2) {
        return getRankExeprtRevenueRankList(params)
      } else if (this.chooseType === 3) {
        return getRankDeptRevenueRankList(params)
      } else if (this.chooseType === 4) {
        return getRankProductRevenueRankList(params)
      }
    },
    returnParams() {
      const item = this.formForList
      const params = {}
      params.pageIndex = 1
      params.pageSize = 1000
      /* if (item.bizTypeActive === 3) {
        params.orderBy = 1
      } else if (item.bizTypeActive === 2) {
        params.orderBy = 3
      } else {
        params.orderBy = 2
      } */
      params.orderBy = 2
      params.bizType = this.chooseItem.bizType
      params.descType = 1
      if (item.employeeDeptId) {
        params.employeeDeptId = item.employeeDeptId
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (item.itemIdList && item.itemIdList.length > 0) {
        params.itemIdList = item.itemIdList
      }
      if (item.orderChannel && item.orderChannel.length > 0) {
        params.orderChannel = item.orderChannel[0]
      }
      if (item.orderChannel && item.orderChannel.length > 1) {
        params.shopId = item.orderChannel[1]
      }
      if ((item.productCategory && item.productCategory !== 999) || item.productCategory === 0) {
        params.productCategory = item.productCategory
      }
      if (item.teacherIdList && item.teacherIdList.length > 0) {
        params.teacherIdList = item.teacherIdList
      }
      if (this.tearcherObj && this.tearcherObj.teacherId) {
        params.teacherIdList = []
        // if (this.tearcherObj.teacherId !== 'otherTeacher') {
        params.teacherIdList.push(this.tearcherObj.teacherId)
        // } */
      }
      if (this.search.time.active || this.search.time.time[0]) {
        params.timeType = this.search.time.active
        params.startTime = this.search.time.time[0]
        params.endTime = this.search.time.time[1]
      }
      return params
    },
    changeChooseType(type) {
      this.chooseType = type
      this.$nextTick(() => {
        this.$refs.listTableRefs.init()
      })
    },
    handleClose() {
      this.drawerFlag = false
      this.$nextTick(() => {
        this.$refs.listTableRefs.clearSort()
      })
    },
    timeChange(val) {
      this.search.time = val
      this.$nextTick(() => {
        this.$refs.listTableRefs.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header{
    padding-bottom: 15px;
    margin-bottom: 15px!important;
    border-bottom: 1px solid #ececec!important;
}

.tfzh-content {
    padding: 0px 15px;
    .tfzh-header-content {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #F2F2F2;
        .tfzh-title {
            float: left;
        }
    }
}

.choose-channel-block-list {
    float: left;
    height: 28px;
    padding-right: 2px;
    margin-top: 20px;
    background: #F7F7F7;
    span {
        margin-top: 1px;
        margin-left: 1px;
        width: 80px;
        height: 26px;
        color: #666666;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 26px;
        cursor: pointer;
        display: inline-block;
    }
    span.active {
        font-weight: 600;
        color: #000;
        background: #fff;
    }
}
.right-daochu-cls {
    float: right;
    margin-top: 10px;
}

.table-data-block {
    width: 100%;
    margin-top: 20px;
    float: left;
}

.dl-em {
  font-style: normal;
}

.tearch-cls {
  float: left;
  width: 200px;
  height: 30px;
  padding-left: 30px;
  span {
    cursor: pointer;
    padding: 0 20px;
    margin-top: 1px;
    text-align: center;
    line-height: 20px;
    height: 20px;
    border-radius: 5px;
    color: #333;
    font-size: 12px;
    display: inline-block;
    position: relative;
    background: linear-gradient(90deg, #CEE2FF 0%, #BCC9FF 100%);
    i {
      position: absolute;
      width: 16px;
      height: 16px;
      right: -5px;
      top: -2px;
    }
  }
}
.blue-cls {
    color: #0091FF;
  }
</style>

