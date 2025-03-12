<template>
  <div class="wrapper">
    <div class="wrapper-content" style="padding-bottom: 0">
      <div class="wrapper-title">
        <div class="wrapper-title-left">
          <div class="wrapper-title-left-icon" />
          <span>数据概括</span>
        </div>
      </div>
      <DataRow
        v-loading="isDataLoadingOne"
        class="dataRowOne"
        :list="dataRowListOne"
        element-loading-spinner="el-icon-loading"
      />
    </div>
    <div class="wrapper-content" style="padding-bottom: 0">
      <div class="wrapper-title">
        <div class="wrapper-title-left">
          <div class="wrapper-title-left-icon" />
          <span>费用情况</span>
        </div>
        <div class="wrapper-title-right">
          <div class="wrapper-title-right-date">
            <div
              :class="[
                'wrapper-title-right-date-item',
                timeType === '1' ? 'wrapper-title-right-date-item-active' : ''
              ]"
              @click="handleTimeType('1')"
            >
              上月
            </div>
            <div
              :class="[
                'wrapper-title-right-date-item',
                timeType === '2' ? 'wrapper-title-right-date-item-active' : ''
              ]"
              @click="handleTimeType('2')"
            >
              本月
            </div>
          </div>
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </div>
      <DataRow
        v-loading="isDataLoading"
        :list="dataRowList"
        element-loading-spinner="el-icon-loading"
      />
    </div>

    <div class="wrapper-content">
      <div class="wrapper-title" style="margin-bottom: 16px">
        <div class="wrapper-title-left">
          <div class="wrapper-title-left-icon" />
          <span>充值明细</span>
        </div>
        <div class="wrapper-title-right">
          <el-button type="primary" @click="recharge">充值</el-button>
        </div>
      </div>
      <CustomTable
        ref="customTableRef"
        height="400px"
        :columns="columns"
        :get-list="getList"
        @handleSizeChangeEmit="handleSizeChangeEmit"
        @handleCurrentChangeEmit="handleCurrentChangeEmit"
      >
        <template v-slot:orderStatus="{ scope }">
          <div v-if="scope.row.orderStatus === 1" class="status-treatPay">
            <img
              src="@/assets/image/aigc/digitalVideoManage/time@3x.png"
              alt=""
            />
            待支付
          </div>
          <div v-if="scope.row.orderStatus === 2" class="status-treatPay-text">
            <img
              src="@/assets/image/aigc/digitalVideoManage/check-circle-filled@3x.png"
              alt=""
            />
            支付完成
          </div>
          <div
            v-if="scope.row.orderStatus === 3"
            class="status-treatPay-text-cancel"
          >
            <img
              src="@/assets/image/aigc/digitalVideoManage/close-circle-filledv.png"
              alt=""
            />
            取消支付
          </div>
        </template>
        <template v-slot:operate="{ scope }">
          <el-button type="text" @click="rechargeRecord(scope.row)">
            详情
          </el-button>
        </template>
      </CustomTable>
    </div>

    <div class="wrapper-content">
      <div class="wrapper-title" style="margin-bottom: 16px">
        <div class="wrapper-title-left">
          <div class="wrapper-title-left-icon" />
          <span>消费明细</span>
        </div>
        <div class="wrapper-title-right" />
      </div>
      <CustomTable
        ref="customTableRef2"
        height="400px"
        :columns="columns2"
        :get-list="getList2"
        @handleSizeChangeEmit="handleSizeChangeEmit2"
        @handleCurrentChangeEmit="handleCurrentChangeEmit2"
      />
    </div>
    <RechargeDialog
      v-model="rechargeDialogVisible"
      @handleSubmit="handleRechargeDialogSubmit"
    />
    <RechargeSubmitDialog
      v-model="rechargeSubmitDialogVisible"
      :is-detail="isDetail"
      :info="rowData"
    />
  </div>
</template>
<script>
import DataRow from '@/views/digitalPerson/components/dataRow/index.vue'
import { columns, columns2 } from './columns'
import CustomTable from '@/components/baseCpns/table'
import RechargeDialog from '@/views/digitalPerson/components/rechargeDialog/index.vue'
import RechargeSubmitDialog from '@/views/digitalPerson/components/rechargeSubmitDialog/index.vue'
import {
  getDataBoardCostInfo,
  getDataBoardPayRecordPage,
  getDataBoardConsumeRecordPage,
  getDataOverview
} from '@/api/aiVideoManage/setMealModule'
import moment from 'moment'
export default {
  name: 'DataBoard',
  components: {
    DataRow,
    CustomTable,
    RechargeDialog,
    RechargeSubmitDialog
  },
  data() {
    return {
      rechargeDialogVisible: false,
      rechargeSubmitDialogVisible: false,
      dataRowList: [
        {
          title: '充值总金额',
          isPrefix: true,
          number: '0'
        },
        {
          title: '形象克隆总数',
          isRight: true,
          number: '0',
          number2: '0',
          number3: '0',
          isDataBoard: true
        },
        {
          title: '声音克隆总数',
          isRight: true,
          number: '0',
          number2: '0',
          number3: '0',
          isDataBoard: true
        },
        {
          title: '视频生成时长（分钟）',
          isRight: true,
          number: '0',
          number2: '0',
          number3: '0',
          isDataBoard: true
        },
        {
          title: '训练形象次数',
          number: '0'
        },
        {
          title: '训练声音次数',
          number: '0'
        },
        {
          title: '生成视频个数',
          number: '0'
        },
        {
          title: '形象训练声音时长（分钟）',
          isRight: true,
          number: '0',
          number2: '0',
          number3: '0',
          isDataBoard: true
        }
      ],
      dataRowListOne: [
        {
          title: '总充值',
          isPrefix: true,
          number: '0'
        },
        {
          title: '形象克隆总数余额',
          number: '0'
        },
        {
          title: '声音克隆总数余额',
          number: '0'
        },
        {
          title: '视频生成时长余额',
          number: '0'
        },
        {
          title: '形象训练声音时长余额',
          number: '0'
        }
      ],
      isDataLoadingOne: false,
      timeType: undefined,
      times: '',
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      tableConfig2: {
        pageIndex: 1,
        pageSize: 10
      },
      columns,
      columns2,
      isDataLoading: false,
      rowData: {},
      isDetail: false
    }
  },
  watch: {
    timeType(val) {
      if (val === '1') {
        // 上个月
        const date = moment().subtract(1, 'month').format('YYYY-MM-01')
        const lastDate = moment(moment().format('YYYY-MM-01'))
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
        this.times = [date, lastDate]
      } else if (val === '2') {
        // 本月
        const date = moment().format('YYYY-MM')
        const lastDate = moment(moment().add(1, 'month').format('YYYY-MM-01'))
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
        this.times = [`${date}-01`, lastDate]
      }
    },
    times: {
      handler(val) {
        this.getCostInfo()
        this.searchFn()
        this.searchFn2()
      },
      deep: true
    }
  },
  created() {
    this.timeType = '2'
    if (this.timeType === '2') {
      // 本月
      const date = moment().format('YYYY-MM')
      const lastDate = moment(moment().add(1, 'month').format('YYYY-MM-01'))
        .subtract(1, 'days')
        .format('YYYY-MM-DD')
      this.times = [`${date}-01`, lastDate]
    }
  },
  mounted() {
    this.getDataOverviewInfo()
    this.getCostInfo()
    this.searchFn()
    this.searchFn2()
  },
  methods: {
    getDataOverviewInfo() {
      this.isDataLoadingOne = true
      getDataOverview().then(res => {
        this.isDataLoadingOne = false
        const { data } = res
        this.dataRowListOne[0].number = data.payTotal || 0
        this.dataRowListOne[1].number = data.characterPurchaseBalance || 0
        this.dataRowListOne[2].number = data.voiceTrainingBalance || 0
        this.dataRowListOne[3].number = data.videoDurationBalance || 0
        this.dataRowListOne[4].number = data.trainingDurationBalance || 0
      })
    },
    handleRechargeDialogSubmit(val) {
      this.isDetail = false
      this.rowData = { ...val }
      this.rechargeSubmitDialogVisible = true
      this.rechargeDialogVisible = false
    },
    getCostInfo() {
      const params = {}
      if (this.times && this.times.length > 0) {
        params.startTime = this.times[0]
        params.endTime = this.times[1]
      }
      this.isDataLoading = true
      getDataBoardCostInfo(params)
        .then(res => {
          this.isDataLoading = false
          const { data } = res
          this.dataRowList[0].number = data.payTotal || 0
          if (data.characterPurchaseSum) {
            const spt = data.characterPurchaseSum.split(',')
            this.dataRowList[1].number = spt[0]
            this.dataRowList[1].number2 = spt[1]
            this.dataRowList[1].number3 = spt[2]
          } else {
            this.dataRowList[1].number = '0'
            this.dataRowList[1].number2 = '0'
            this.dataRowList[1].number3 = '0'
          }
          if (data.voiceTrainingSum) {
            const spt = data.voiceTrainingSum.split(',')
            this.dataRowList[2].number = spt[0]
            this.dataRowList[2].number2 = spt[1]
            this.dataRowList[2].number3 = spt[2]
          } else {
            this.dataRowList[2].number = '0'
            this.dataRowList[2].number2 = '0'
            this.dataRowList[2].number3 = '0'
          }
          if (data.videoDurationSum) {
            const spt = data.videoDurationSum.split(',')
            this.dataRowList[3].number = spt[0]
            this.dataRowList[3].number2 = spt[1]
            this.dataRowList[3].number3 = spt[2]
          } else {
            this.dataRowList[3].number = '0'
            this.dataRowList[3].number2 = '0'
            this.dataRowList[3].number3 = '0'
          }
          this.dataRowList[4].number = data.characterTrainingCount || 0
          this.dataRowList[5].number = data.voiceTrainingCount || 0
          this.dataRowList[6].number = data.generateVideoCount || 0

          if (data.trainingDurationSum) {
            const spt = data.trainingDurationSum.split(',')
            this.dataRowList[7].number = spt[0]
            this.dataRowList[7].number2 = spt[1]
            this.dataRowList[7].number3 = spt[2]
          } else {
            this.dataRowList[7].number = '0'
            this.dataRowList[7].number2 = '0'
            this.dataRowList[7].number3 = '0'
          }
        })
        .catch(() => {
          this.isDataLoading = false
        })
    },
    rechargeRecord(row) {
      this.isDetail = row.orderStatus !== 1
      this.rowData = { orderId: row.orderNo }
      this.rechargeSubmitDialogVisible = true
    },
    recharge() {
      this.rechargeDialogVisible = true
    },
    handleCurrentChangeEmit2(val) {
      this.tableConfig2.pageIndex = val
      this.searchFn2(false, false)
    },
    handleSizeChangeEmit2(val) {
      this.tableConfig2.pageSize = val
      this.searchFn2()
    },
    searchFn2(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig2.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig2.pageSize = 10
      }
      this.$refs.customTableRef2.init(isResetPageIndex)
    },
    getList2() {
      const params = {
        ...this.tableConfig2
      }
      if (this.times && this.times.length) {
        params.startTime = this.times[0]
        params.endTime = this.times[1]
      }
      return new Promise((resolve, reject) => {
        getDataBoardConsumeRecordPage(params)
          .then(res => {
            // 消费类型 1、采购形象克隆 2、声音克隆 3、视频生成 4、形象训练声音时长
            res.data.items.forEach(item => {
              item.consumeTime = item.consumeTime
                ? moment(item.consumeTime).format('YYYY-MM-DD HH:mm:ss')
                : undefined
              item.consumeTypeName =
                item.consumeType === 1
                  ? '采购形象克隆'
                  : item.consumeType === 2
                    ? '声音克隆'
                    : item.consumeType === 3
                      ? '视频生成'
                      : '形象训练声音时长'
              const dw =
                item.consumeType === 1 || item.consumeType === 2 ? '次' : '分钟'
              item.consumeCount = item.consumeCount + dw
            })
            resolve(res)
          })
          .catch(() => {
            reject({
              data: {
                items: [],
                total: 0
              }
            })
          })
      })
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
      }
      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig
      }
      if (this.times && this.times.length) {
        params.startTime = this.times[0]
        params.endTime = this.times[1]
      }
      return new Promise((resolve, reject) => {
        getDataBoardPayRecordPage(params)
          .then(res => {
            res.data.items.forEach(item => {
              item.orderTypeName = item.orderType === 1 ? '购买' : '赠送'
            })
            resolve(res)
          })
          .catch(() => {
            reject({
              data: {
                items: [],
                total: 0
              }
            })
          })
      })
    },
    handleTimeType(type) {
      this.timeType = type
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  .wrapper-content {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .wrapper-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .wrapper-title-left {
      display: flex;
      align-items: center;
      .wrapper-title-left-icon {
        width: 3px;
        height: 14px;
        border-radius: 6px;
        background: #065cff;
        margin-right: 8px;
      }
      span {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
      }
    }
    .wrapper-title-right {
      display: flex;
      align-items: center;
      .wrapper-title-right-date {
        display: flex;
        align-items: center;
        margin-left: 16px;
        .wrapper-title-right-date-item {
          width: 60px;
          height: 32px;
          background: #fff;
          border: 1px solid #cbcfd3;
          border-radius: 4px;
          color: #000000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          cursor: pointer;
        }
        .wrapper-title-right-date-item-active {
          background: #065cff;
          color: #fff;
          border: 1px solid #065cff;
        }
      }
    }
  }
  .status-treatPay {
    color: #ff7d00;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    display: flex;
    align-items: center;
    border-radius: 12px;
    width: 74px;
    height: 24px;
    padding: 0 8px;
    background: #fff2e6;
    display: flex;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
  .status-treatPay-text {
    color: #00b42a;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    border-radius: 12px;
    background: #e6f7ea;
    width: 86px;
    height: 24px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
  .status-treatPay-text-cancel {
    color: #ff0000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    border-radius: 12px;
    background: #feecec;
    width: 86px;
    height: 24px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
  }
}
::v-deep {
  .dataRowOne {
    .row-col {
      width: 19%;
    }
  }
}
</style>
