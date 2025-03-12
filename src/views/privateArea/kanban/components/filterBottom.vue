<template>
  <div class="allHeader">
    <div class="headerTopBox">
      <div class="headerTop">
        <div class="headerTopLeft">
          <span>过程数据</span>
          <div class="headerTopLeftBtn">
            <div
              v-for="item in tabsList"
              :key="item.value"
              :class="{ activeClass: item.value === active }"
              @click="handleTable(item)"
            >
              {{ item.label }}
            </div>
          </div>
          <el-select
            v-if="type!=='my'"
            v-model="search.searchUserId"
            filterable
            remote
            clearable
            reserve-keyword
            style="font-weight: 400"
            placeholder="请输入姓名"
            :remote-method="getSelectListTeacher"
            :loading="selectLoading"
          >
            <el-option
              v-for="item in options"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
          <el-button
            v-if="type!=='my'"
            style="margin-left: 10px"
            type="primary"
            @click="handleSumit"
          >查询</el-button>
        </div>
        <AppDatepicker
          ref="AppDatepicker"
          style="width: 558px"
          :show="[0, 1, 'week']"
          :default="0"
          :is-whole="true"
          :search="search.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
    </div>

    <div v-if="active === 1" class="trendList" :gutter="16">
      <template v-for="(item, index) in cardList">
        <list
          :key="index"
          :loading="loading"
          :item="item"
          :icon="item.icon"
          @onClick="onClick(item)"
        />
      </template>
    </div>
    <div v-else class="trendList" :gutter="16">
      <template v-for="(item, index) in cardListOne">
        <list
          :key="index"
          :loading="loading"
          :item="item"
          :icon="item.icon"
          @onClick="onClick(item)"
        />
      </template>
    </div>
    <div v-if="type!=='my'" style="margin-top: 20px">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :immediate-check="true"
        style="height:400px"
        :columns="columns"
        :get-list-api="getList"
      />
    </div>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import dynamicTable from '@/components/DynamicTable/table'
import {
  getClueFollowStatSelectData,
  getSelectTeacherList,
  getSelectDataDetail,
  getManualSelectDataDetail,
  getManualCallStatSelectData
} from '@/api/privateArea/kanban'
import list from './list.vue'
import moment from 'moment'
const searchTypeMap = {
  all: 3,
  my: 1,
  department: 2
}
const tabsList = [
  { label: '跟进数据', value: 1 },
  { label: '外呼数据', value: 2 }
]
export default {
  components: {
    AppDatepicker,
    dynamicTable,
    list
  },
  props: {
    type: {
      type: String,
      default: 'my'
    }
  },
  data() {
    return {
      selectLoading: false,
      options: [],
      tableData: [],
      search: {
        time: { active: 0, time: ['', ''] },
        searchUserId: ''
      },
      tabsList,
      loading: false,
      currentTime: '',
      cardList: [
        {
          paramType: 1,
          text: '分配线索数',
          tips: '选择时间段内分配的新线索数',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '已跟进线索数',
          tips: '人工外呼客服接通或者企业微信已跟进或者手动填写跟进记录',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '未跟进线索数',
          tips: '分配线索数-已跟进线索数',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '已跟进比例',
          tips: '已跟进线索数/分配线索数*100%',
          value: '0',
          basisRatio: undefined,
          previousValue: undefined
        },
        {
          paramType: 1,
          text: '12小时跟进率',
          tips: '分配线索时间后的12小时内跟进线索数/分配线索数*100%',
          value: '0',
          basisRatio: undefined,
          previousValue: undefined
        }
      ],
      cardListOne: [
        {
          paramType: 1,
          text: '外呼次数',
          tips: '选择时间内外呼总次数',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '客服接通次数',
          tips: '选择时间内外呼中客服接通的次数',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '呼叫成功率',
          tips: '客服接通次数/外呼次数*100%',
          value: '0',
          basisRatio: undefined,
          previousValue: undefined
        },
        {
          paramType: 1,
          text: '双方接通次数',
          tips: '选择时间内客户接通的次数',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '客户接通率',
          tips: '客户接通次数/客服接通次数*100%',
          value: '0',
          basisRatio: undefined,
          previousValue: undefined
        },
        {
          paramType: 1,
          text: '双方接通时长(分钟)',
          tips: '客户接通时长',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        },
        {
          paramType: 1,
          text: '总通话时长(分钟)',
          tips: '包含客服接通时长和客户接通时长',
          value: '0',
          basisRatio: 0,
          previousValue: 0
        }
      ],
      active: 1,
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  computed: {
    columns() {
      if (this.active === 1) {
        return [
          { prop: 'deptName', label: '部门', type: 'text' },
          { prop: 'userName', label: '姓名', type: 'text' },
          { prop: 'clueNum', label: '分配线索数', type: 'text' },
          { prop: 'followClueNum', label: '已跟进线索数', type: 'text' },
          { prop: 'followClueRatio', label: '已跟进比例', type: 'text', slotFn: (row) => `${row.followClueRatio}%` },
          { prop: 'unfollowClueNum', label: '未跟进线索数', type: 'text' },
          { prop: 'unfollowClueRatio', label: '未跟进比例', type: 'text', slotFn: (row) => `${row.unfollowClueRatio}%` },
          { prop: 'twelveHourFollowClueRatio', label: '12小时跟进率', type: 'text', slotFn: (row) => `${row.twelveHourFollowClueRatio}%` }
        ]
      }
      return [
        { prop: 'deptName', label: '部门', type: 'text' },
        { prop: 'userName', label: '姓名', type: 'text' },
        { prop: 'manualCallNum', label: '外呼次数', type: 'text' },
        { prop: 'servicesCallNum', label: '客服接通次数', type: 'text' },
        { prop: 'servicesCallRate', label: '呼叫成功率', type: 'text', slotFn: (row) => `${row.servicesCallRate}%` },
        { prop: 'clientCallNum', label: '双方接通次数', type: 'text' },
        { prop: 'clientCallRate', label: '客户接通率', type: 'text', slotFn: (row) => `${row.clientCallRate}%` },
        { prop: 'oneWayCallDuration', label: '双方接通时长(分钟)', type: 'text', slotFn: (row) => Math.ceil(row.oneWayCallDuration / 60) },
        { prop: 'twoWayCallDuration', label: '总接通时长(分钟)', type: 'text', slotFn: (row) => row.twoWayCallDuration },
        { prop: 'blackListNum', label: '客户黑名单数', type: 'text' },
        { prop: 'blackListRate', label: '黑名单率', type: 'text', slotFn: (row) => `${row.blackListRate}%` }
      ]
    }
  },
  methods: {
    async getSelectListTeacher(name) {
      this.selectLoading = true
      try {
        const res = await getSelectTeacherList({
          name,
          searchType: searchTypeMap[this.type]
        })
        this.options = res?.data || []
        this.selectLoading = false
      } catch {
        this.selectLoading = false
      }
    },
    async getList(params) {
      const queyr =
        this.active === 1 ? getSelectDataDetail : getManualSelectDataDetail
      return queyr({
        ...params,
        searchType: searchTypeMap[this.type],
        startDate: this.search.time?.time[0],
        endDate: this.search.time?.time[1],
        type: this.search.time?.type,
        searchUserId: this.search.searchUserId
      }).then(res => {
        return res
      })
    },
    // 查询
    handleSumit() {
      this.getClueFollowStatSelectData()
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.config.pageIndex = 1
        this.$refs?.table?.onRefresh()
      })
    },
    handleTable(item) {
      this.active = item.value
      this.init()
    },
    teacherSelect(val) {
      this.search.teacherId = val.lecturerId
      this.search.teacherName = val.lecturerName
    },
    // 时间改变触发
    timeChange(val) {
      this.search.time = val
      this.getClueFollowStatSelectData()
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.config.pageIndex = 1
        this.$refs?.table?.onRefresh()
      })
    },
    // 获取数据
    async init() {
      this.getClueFollowStatSelectData()
      this.$nextTick(() => {
        if (this.$refs.table) this.$refs.table.config.pageIndex = 1
        this.$refs?.table?.onRefresh()
      })
    },
    initNum(num = 0) {
      if (num % 1 === 0) {
        return num
      } else {
        return `${(num || 0).toFixed(2)}`
      }
    },
    async getClueFollowStatSelectData() {
      const dataParma = {
        searchType: searchTypeMap[this.type],
        startDate: this.search.time?.time[0],
        endDate: this.search.time?.time[1],
        type: this.search.time?.type,
        searchUserId: this.search.searchUserId
      }
      const query =
        this.active === 1
          ? getClueFollowStatSelectData
          : getManualCallStatSelectData
      const { code, data } = await query(dataParma)
      if (code === 1 && data) {
        // value: '0',
        // basisRatio: 0,
        // previousValue: 0
        if (this.active === 1) {
          const {
            clueNum,
            clueNumMoM,
            diffInPreviousClueNum,
            followClueNum,
            followClueNumMoM,
            diffInPreviousFollowClueNum,
            unfollowClueNum,
            unfollowClueNumMoM,
            diffInPreviousUnfollowClueNum,
            followClueRatio,
            // followClueRatioMoM,
            twelveHourFollowClueRatio
            // twelveHourFollowClueRatioMoM
          } = data
          this.cardList[0].value = clueNum
          this.cardList[0].basisRatio = this.initNum(clueNumMoM)
          this.cardList[0].previousValue = Math.abs(diffInPreviousClueNum)
          this.cardList[1].value = followClueNum
          this.cardList[1].basisRatio = this.initNum(followClueNumMoM)
          this.cardList[1].previousValue = Math.abs(diffInPreviousFollowClueNum)

          this.cardList[2].value = unfollowClueNum
          this.cardList[2].basisRatio = this.initNum(unfollowClueNumMoM)
          this.cardList[2].previousValue = Math.abs(diffInPreviousUnfollowClueNum)

          this.cardList[3].value = `${followClueRatio}%`
          // this.cardList[3].basisRatio = this.initNum(followClueRatioMoM)

          this.cardList[4].value = `${twelveHourFollowClueRatio}%`
          // this.cardList[4].basisRatio = this.initNum(
          //   twelveHourFollowClueRatioMoM
          // )
        }
        if (this.active === 2) {
          const {
            manualCallNum,
            manualCallNumMoM,
            diffInPreviousManualCallNum,
            servicesCallNum,
            servicesCallNumMoM,
            diffInPreviousServicesCallNum,
            servicesCallRate,
            // servicesCallRateMoM,
            // diffInPreviousServicesCallRate,
            clientCallNum,
            clientCallNumMoM,
            diffInPreviousClientCallNum,
            clientCallRate,
            // clientCallRateMoM,
            // diffInPreviousClientCallRate,
            twoWayCallDuration,
            twoWayCallDurationMoM,
            diffInPreviousTwoWayCallDuration,
            oneWayCallDuration,
            oneWayCallDurationMoM,
            diffInPreviousOneWayCallDuration
          } = data
          this.cardListOne[0].value = manualCallNum
          this.cardListOne[0].basisRatio = this.initNum(manualCallNumMoM)
          this.cardListOne[0].previousValue = Math.abs(diffInPreviousManualCallNum)

          this.cardListOne[1].value = servicesCallNum
          this.cardListOne[1].basisRatio = this.initNum(servicesCallNumMoM)
          this.cardListOne[1].previousValue = Math.abs(diffInPreviousServicesCallNum)

          this.cardListOne[2].value = `${servicesCallRate}%`
          // this.cardListOne[2].basisRatio = this.initNum(servicesCallRateMoM)
          // this.cardListOne[2].previousValue = undefined

          this.cardListOne[3].value = clientCallNum
          this.cardListOne[3].basisRatio = this.initNum(clientCallNumMoM)
          this.cardListOne[3].previousValue = Math.abs(diffInPreviousClientCallNum)

          this.cardListOne[4].value = `${clientCallRate}%`
          // this.cardListOne[4].basisRatio = this.initNum(clientCallRateMoM)
          // this.cardListOne[4].previousValue = undefined

          this.cardListOne[5].value = Math.ceil(oneWayCallDuration / 60)
          this.cardListOne[5].basisRatio = this.initNum(oneWayCallDurationMoM)
          this.cardListOne[5].previousValue = diffInPreviousOneWayCallDuration

          this.cardListOne[6].value = twoWayCallDuration
          this.cardListOne[6].basisRatio = this.initNum(twoWayCallDurationMoM)
          this.cardListOne[6].previousValue = diffInPreviousTwoWayCallDuration
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.allHeader {
  margin-top: 20px;
  .updateTime {
    font-size: 14px;
    color: #999999;
    line-height: 19px;
    margin-left: 8px;
  }
  .headerTopBox {
    background: #ffffff;
    padding: 15px 20px;
    border-radius: 12px;
  }
  .headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    > div:nth-of-type(1) {
      color: #333333;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
    }
    .headerTopLeft {
      display: flex;
      align-items: center;
      .headerTopLeftBtn {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-left: 19px;
        margin-right: 15px;
        cursor: pointer;
        > .activeClass {
          color: #0c6fff;
          border-color: #0c6fff;
        }
        > div:nth-of-type(1) {
          border-radius: 4px 0 0 4px;
        }
        > div {
          width: 128px;
          font-weight: 400;
          border-radius: 0 4px 4px 0;
          text-align: center;
          padding: 4px 0;
          border: 1px solid #cbcfd3;
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
  .trendList {
    display: flex;
    flex-wrap: wrap;
    .kanbanlist {
      margin-right: 1.2%;
      margin-top: 20px;
    }
    > div:nth-of-type(6n) {
      margin-right: 0;
    }
  }
}
</style>
