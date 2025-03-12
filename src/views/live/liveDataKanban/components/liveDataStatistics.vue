<template>
  <div class="liveDataStatistics">
    <div class="searchTop">
      <div class="searchTopTitle">直播数据统计</div>
    </div>
    <div class="search">
      <label class="searchLabel">
        <span class="p-t-5">直播间名称</span>
        <el-input v-model.trim="search.name" class="w-200 m-r-10 m-l-10" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
      </label>
      <label class="searchLabel">
        <span class="p-t-5">使用素材名称</span>
        <el-input v-model.trim="search.videoName" class="w-200 m-r-10 m-l-10" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">直播模式</span>
        <el-select v-model="search.liveModel" size="small" clearable placeholder="请选择" class="m-r-10 m-l-10 input-with-select select-width-200 w-200" @change="searchFn" @clear="searchFn">
          <el-option v-for="item in liveModeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </label>
      <label class="searchLabel m-r-10">
        <span class="m-r-10 p-t-5">邀请人</span>
        <el-select v-model="search.userIds" size="small" filterable placeholder="请选择" clearable @change="searchFn">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </label>
    </div>
    <div class="search" style="margin-top: 0px">
      <label class="searchLabel m-r-10">
        <span class="m-r-10 p-t-5">IP</span>
        <el-select v-model="search.ipType" size="small" placeholder="请选择" class="input-with-select input-with-select-chang" @change="onhandleTearchChange">
          <el-option label="真人IP" :value="1" />
          <el-option label="视频IP" :value="2" />
        </el-select>
        <el-select v-if="search.ipType === 1" v-model="search.realityTeacherUserId" size="small" class="w-200 filter_teacherSelect" filterable placeholder="请选择IP" clearable @change="searchFn">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
        <AppSelect
          v-else-if="search.ipType === 2"
          class="filter_teacherSelect"
          :get-api-fn="getTeacherList"
          search-key="teacherName"
          :value="search.teacherId"
          :label="search.teacherName"
          :props="{
            label: 'teacherName',
            value: 'teacherId'
          }"
          @selected="selectedTeacher"
        />
      </label>
      <label class="searchLabel m-r-10">
        <span class="p-t-5">类型</span>
        <el-select v-model="search.feesType" size="small" clearable placeholder="请选择" class="m-r-10 m-l-10 input-with-select select-width-200 w-200" @change="searchFn" @clear="searchFn">
          <el-option label="免费" :value="1" />
          <el-option label="付费" :value="2" />
        </el-select>
      </label>
      <!-- <label class="searchLabel">
        <span class="m-r-10 p-t-5">跟进人部门</span>
        <el-cascader
          v-model="search.deptId"
          class="m-r-10 m-l-10"
          size="small"
          :show-all-levels="false"
          filterable
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
          @change="searchFn"
        />
      </label> -->
      <div class="searchLabel">
        <el-button style="margin-left: 20px" type="primary" size="small" @click="searchFn">查询</el-button>
        <el-button size="small" @click="clear()">重置</el-button>
      </div>
    </div>
    <MPageLayout
      v-if="attendClassTime !== ''"
      ref="table"
      v-loading="loading"
      row-key="id"
      :slot-arr="slotArr"
      :table-columns="config.columns"
      :table-data="config.tableData"
      class="table_wrap"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      show-summary
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
      :summary-method="getSummaries"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template v-for="(item) in config.columns" :slot="item.prop + '-header'">
        <MTips :key="item.prop" :text="item.label" :tips="item.tipsFn ? item.tipsFn(attendClassTime) : item.tips" align="center" />
      </template>
      <template v-for="(item) in config.columns" :slot="item.prop" slot-scope="{ row }">
        <div :key="item.prop">
          <template v-if="item.dataType === 'Rate'">{{ row[item.prop] | renderRate }}%</template>
          <template v-else-if="item.dataType === 'Number'">{{ row[item.prop] || 0 }}</template>
          <template v-else-if="item.dataType === 'Money'">{{ row[item.prop] | filtersMoneyByZero }}</template>
          <template v-else-if="item.prop === 'startTime'">{{ row['startTime'] | parseTime('{y}-{m}-{d}') }}</template>
          <template v-else-if="item.prop === 'startTime2'">{{ row['startTime'] | parseTime('{h}:{i}:{s}') }}</template>
          <template v-else-if="item.prop === 'name'">
            <textShowMore :line-clamp="1" :text="row.name" @click.native="gotoLiveDetailData(row)" />
            <!-- <span class="a_link" @click.stop="gotoLiveDetailData(row)">{{ row.name }}</span> -->
          </template>
          <template v-else-if="item.prop === 'teachers'">
            <div class="text_hidden_1" style="display: inline-block;max-width: 100px;">
              {{ row[item.prop] | renderTearch }}
            </div>
          </template>
          <template v-else-if="item.prop === 'liveModel'">
            {{ row[item.prop] | getOptionsValue(liveModeOption) }}
          </template>
          <template v-else-if="item.prop === 'feesType'">
            {{ {1: '免费', 2: '付费'}[row[item.prop]] }}
          </template>
          <template v-else>{{ row[item.prop] || '' }}</template>
        </div>
      </template>
    </MPageLayout>
    <!-- <mytable ref="myData" v-loading="loading" :table-data="tableData" :data-count="dataCount" /> -->
    <!-- <el-pagination
      class="m-t-20 pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import { deptTree } from '@/api/addressBookApi'
import { getColumns, slotArr } from './columns'
// import CustomTabelHeader from './CustomTabelHeader.vue'
import { filtersMoneyByZero } from '@/filters'
// import mytable from './mytable.vue'
import { liveModeOption } from '@/views/live/columns.js'
import { getTeacherList } from '@/api/tearchCenter/index'
import { getOptionsValueByKey } from '@/filters/index.js'
// import AppSelectMultiple from '@/components/AppSelect/index3'
import { userNoPage } from '@/api/addressBookApi'
import AppSelect from '@/components/AppSelect/index'
import textShowMore from '@/components/textShowMore/index2'
import {
  liveRoomTeachers,
  allLiveRoomStatisticsSum,
  allLiveRoomStatistics // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
  filters: {
    renderTearch(val) {
      if (!val || val.length === 0) return ''
      return val.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.userName}`)
        return pre
      }, '')
    },
    renderRate(val) {
      if (!val) return 0
      return val.toFixed(2).toString().replace(/(\.00)$/, '')
    }
  },
  components: {
    AppSelect,
    textShowMore
    // CustomTabelHeader,
    // mytable,
    // AppSelectMultiple
  },
  props: {
    searchObj: {
      type: Object,
      default: () => {
        return {
          time: { active: 1, time: ['', ''] }, // 时间
          active: 1, // 筛选项1:成交订单数 2:成交金额 3:待付款金额 4: 退款金额 5: 营收 6: 转化人数 7 - 完课人数; 8 - 到课人数; 9 - 报名人数; 10 - 邀约人数;
          title: '成交金额排行榜',
          navActive: '' // PERSON_LIVE 真人直播；AI_LIVE 智能直播；DIGITAL_PERSON_LIVE 数字人直播，不传默认查所有
        }
      }
    }
  },
  data() {
    return {
      userArray: [],
      deptTreeArray: [],
      headerCellStyle: {
        background: '#E9EFF7',
        fontSize: '12px',
        fontFamily: 'PingFangSC-Medium, PingFang SC',
        fontWeight: 'bolder',
        color: '#2C3242',
        lineHeight: '17px',
        borderLeft: '1px solid #fff'
      },
      cellStyle: {
        fontSize: '12px',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: '400',
        color: '#2C3242'
      },
      slotArr: slotArr,
      liveModeOption,
      search: {
        name: '',
        videoName: '',
        liveModel: '',
        ipType: 1,
        // deptId: [],
        feesType: '',
        userIds: '',
        realityTeacherUserId: '',
        teacherId: '',
        teacherName: ''
      },
      config: {
        columns: getColumns.call(this),
        tableData: []
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dataCount: {
        attendPeopleNumSum: 0,
        attendTransRateSum: 0,
        clueAttendRateSum: 0,
        clueSum: 0,
        clueTransRateSum: 0,
        gmvSum: 0,
        priceSum: 0,
        signUpPeopleNumSum: 0,
        totalRplCount: 0,
        transformOrderCountSum: 0
      },
      enterLiveRoom: false,
      loading: false
    }
  },
  computed: {
    ...mapState({
      attendClassTime: state => state.liveSetting.attendClassTime
    })
  },
  created() {
    // const res = localStorage.getItem('tableColumns_liveDataStatistics_liveDataKanban')
    // if (res) {
    //   this.config.columns = JSON.parse(res)
    // }
    this.loadUserNoPage()
  },
  mounted() {
    this.loadTreeData()
    this.canEnterLiveRoom()
  },
  methods: {
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    selectedTeacher(res) {
      console.log(res)
      this.search.teacherId = res.teacherId
      this.search.teacherName = res.teacherName
      this.searchFn()
    },
    getTeacherList(params) {
      console.log(params)
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    onhandleTearchChange() {
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.search.realityTeacherUserId = ''
      // this.searchFn()
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    // 点击直播间名称跳转直播间数据
    gotoLiveDetailData(row) {
      if (!this.canShowGotoLiveRoom(row)) {
        return this.$message.error('你暂无权限访问。')
      }
      const { href } = this.$router.resolve({
        path: `/live/liveDetail/${row.liveRoomId}?type=dataStatistics`
      })
      window.open(href, '_blank')
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teachers || row.teachers.length === 0) {
        return false
      }
      const obj = row.teachers.find(v => v.userId === this.userInfo.userId)
      return Boolean(obj)
    },
    clear() {
      this.search = {
        name: '',
        videoName: '',
        liveModel: '',
        // deptId: [],
        ipType: 1,
        userIds: '',
        realityTeacherUserId: '',
        teacherId: '',
        teacherName: ''
      }
      this.$refs.AppSelectMultiple && this.$refs.AppSelectMultiple.clear()
      this.init()
    },
    searchFn() {
      this.currentPage = 1
      this.getData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    getList(data) {
      return allLiveRoomStatistics(data).then((res) => {
        console.log(res, 'res直播数据统计')
        // this.$refs.myData && this.$refs.myData.setTableData(res.data.items)
        this.config.tableData = res.data.items
        this.total = res.data.total
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.doLayout()
        })
      })
    },
    // 获取合计数据
    getSum(data) {
      const params = {
        ...data
      }
      delete params.pageIndex
      delete params.pageSize
      return allLiveRoomStatisticsSum(params).then(res => {
        this.dataCount = res.data
      })
    },
    getData() {
      this.loading = true
      // const userIds = this.search.userIds.reduce((pre, next) => {
      //   pre.push(next.userId)
      //   return pre
      // }, [])
      const userIds = []
      // let deptId = ''
      // if (this.search.deptId.length > 0) {
      //   deptId = this.search.deptId[this.search.deptId.length - 1]
      // }
      this.search.userIds && userIds.push(this.search.userIds)
      const data = {
        // deptId: deptId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        startTime: this.searchObj.time.time[0], // 开始时间
        endTime: this.searchObj.time.time[1], // 结束时间
        liveModel: this.search.liveModel, // 直播模式
        name: this.search.name, // 直播间名称
        ipType: this.search.ipType,
        ipTeacherId: '',
        feesType: this.search.feesType,
        userIds, // 助教用户id列表
        videoName: this.search.videoName // 使用素材名称
      }
      if (this.search.ipType && this.search.ipType === 1) {
        data.ipTeacherId = this.search.realityTeacherUserId
      } else if (this.search.ipType === 2) {
        data.ipTeacherId = this.search.teacherId
      }
      axios.all([this.getList(data), this.getSum(data)]).then(() => {
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    init() {
      this.config.tableData = []
      this.searchFn()
    },
    // 获取助教列表
    getTeachers(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName
      }
      return liveRoomTeachers(data).then(res => {
        res.data.items.map(v => {
          v.goodsId = v.userId
          v.contentName = v.userName
        })
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectTeachers(row) {
      console.log(row)
      this.search.userIds = row
      this.searchFn()
    },
    handleCheckedTableColumnsChange(res) {
      this.loading = true
      this.config.columns = res
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.table && this.$refs.table.doLayout()
          this.loading = false
        })
      }, 200)
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === 1) {
          sums[index] = ''
          return
        } else {
          const dataType = getOptionsValueByKey('prop', 'dataType', column.property, this.config.columns)
          const sumProp = getOptionsValueByKey('prop', 'sumProp', column.property, this.config.columns)
          if (dataType === 'Number') {
            sums[index] = this.dataCount[sumProp] || 0
          } else if (dataType === 'Rate') {
            sums[index] = this.dataCount[sumProp] ? this.dataCount[sumProp] + '%' : '0%'
          } else if (dataType === 'Money') {
            sums[index] = filtersMoneyByZero(this.dataCount[sumProp]) || 0
          } else {
            sums[index] = ''
          }
        }
        // console.log(column, 'column')
        // if ([3, 9, 17, 13, 14].includes(index)) {
        //   sums[index] = this.dataRowCount[obj[index]] ? (this.dataRowCount[obj[index]] || 0) + '%' : 0
        //   return
        // }
        // if ([16, 15, 18].includes(index)) {
        //   sums[index] = this.dataRowCount[obj[index]] ? filtersMoneyByZero(this.dataRowCount[obj[index]]) : 0
        //   return
        // }
        // if (index > 0) {
        //   sums[index] = this.dataRowCount[obj[index]] ? this.dataRowCount[obj[index]] : 0
        //   return
        // }
        // sums[index] = obj[index]
        // return
      })
      return sums
    }
  }
}
</script>

<style lang='scss' scoped>
.liveDataStatistics {
  background: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .searchTopTitle {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2C3242;
      line-height: 22px;
    }
  }
  .search {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .searchLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-bottom: 20px;
      display: flex;
    }

    .searchBtn {
      flex: 1 0 0;
      display: flex;
      justify-content: flex-end;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
  }
  .table_wrap {
    max-height: 600px;
  }
}
.p-t-5 {
  padding-top: 5px;
}
::v-deep {
  .tablePage .page_header {
    padding: 0;
    min-height: 0;
  }
  .my-table {
    margin: 0;
    padding: 0;
  }
  .el-table__body-wrapper.is-scrolling-none {
    height: auto!important;
    max-height: 430px;
  }
  .el-table__body-wrapper.is-scrolling-left {
    height: auto!important;
    max-height: 430px;
  }
  .el-table__body-wrapper.is-scrolling-right {
    height: auto!important;
    max-height: 430px;
  }
}

::v-deep {
  .tips {
    .tipsText {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bolder;
      color: #2C3242;
      // line-height: 12px;
    }
    .iconText {
      margin-left: 2px;
      width: 12px;
      height: 12px;
    }
  }
  .el-table th.el-table__cell > .cell {
    padding-left: 8px;
  }
  .el-table__footer-wrapper .el-table__cell{
    background: #E9EFF7;
    font-size: 12px;
    font-weight: bolder;
    color: #2C3242;
    // line-height: 17px;
    border-left: 1px solid #fff;
  }
  .el-table__expanded-cell {
    padding: 0!important;
  }
  .el-input__inner {
    background: transparent;
  }
  .el-pager li {
    background: transparent;
  }
  .el-pagination button {
    background: transparent;
  }
  .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 0px;
  }
  .el-table__footer-wrapper td.el-table__cell {
    border-top: 0px;
  }
}
::v-deep {
  .expandTable .el-table__footer-wrapper .el-table__cell{
    background: #fff;
    font-size: 12px;
    font-weight: bolder;
    color: #2C3242;
    // line-height: 17px;
  }
}
.input-with-select {
    width: 108px;
    height: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    border-radius: 3px 0px 0px 3px;
  }
  .input-with-select-chang {
    ::v-deep  .el-input__inner {
      border: none;
      border-radius: 3px 0px 0px 3px;
      border: 1px solid #D8DCE6;
      border-right: none;
    }
  }
::v-deep .el-input__inner{
  height: 32px;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
.input-with-time {
  width: 228px;
  border: none;
  border-radius: 0px 3px 3px 0px;
  border: 1px solid #D8DCE6;
}
.filter_teacherSelect {
  ::v-deep {
    .el-input__inner {
      border-radius: 0px 3px 3px 0px;
    }
  }
}
::v-deep {
  .textShowMore .showMore {
    cursor: pointer;
    color: #1890ff !important;
    font-size: 12px;
    font-family: PingFangSC-Regular, "PingFang SC";
    font-weight: 400;
  }
}
</style>
