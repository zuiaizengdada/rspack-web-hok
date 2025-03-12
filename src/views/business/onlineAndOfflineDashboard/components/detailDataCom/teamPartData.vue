<template>
  <div class="wrapper-online-depart-data">
    <div class="revenue-performance">
      <span :class="active === 1?'active':''" @click="changeActive(1)">个人</span>
      <span :class="active === 2?'active':''" @click="changeActive(2)">达人</span>
    </div>
    <div v-if="active === 1" class="gmv-block">
      <span>{{ title }} <em>￥{{ filterPrice(amount) }}</em></span>
      <span>对比{{ contrastString }}
        <em v-if="amountLinkRatio > 0" class="green-xl">{{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}<img src="../../../../../assets/image/business/icn_green_up.png" /></em>
        <em v-else-if="amountLinkRatio < 0" class="red-xl">{{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}<img src="../../../../../assets/image/business/icn_red_up.png" /></em>
        <em v-else>{{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}</em>
      </span>
    </div>
    <div class="gmv-table-data">
      <dataChart ref="dataChart" @changeDeptMent="changeDeptMent" />
      <div class="gmv-table-line" />
      <MTitle>详情数据</MTitle>
      <data-table ref="dataTable" />
    </div>

  </div>
</template>

<script>
import dataChart from './dataChart.vue'
import dataTable from './dataTable.vue'
import { filterPrice } from '@/utils'
import { revenueGroupByBizType } from '@/api/business/onlineAndOffline'
export default {
  components: {
    dataChart,
    dataTable
  },
  data() {
    return {
      active: 1,
      amount: 0,
      amountLinkRatio: 0,
      contrastString: '',
      title: '',
      form: {}
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    changeDeptMent(obj) {
      this.$emit('changeDeptMent', obj)
    },
    filterPrice,
    changeActive(type) {
      this.active = type
      this.$nextTick(() => {
        this.$refs.dataChart.init(this.form, this.active)
        this.$refs.dataTable.init(this.form, this.active)
      })
    },
    init(item) {
      this.form = item
      if (item.time.active === 0) {
        this.contrastString = '前日'
      } else if (item.time.active === 1) {
        this.contrastString = '昨日'
      } else if (item.time.active === 2) {
        this.contrastString = '同期'
      } else if (item.time.active === 3) {
        this.contrastString = '上月'
      } else if (item.time.active === 4) {
        this.contrastString = '去年'
      }
      this.$nextTick(() => {
        this.$refs.dataChart.init(item, this.active)
        this.$refs.dataTable.init(item, this.active)
        this.loadBizTypeData(item)
      })
    },
    loadBizTypeData(item) {
      const params = {}
      params.bizTypes = []
      params.bizTypes.push(item.bizTypeActive)
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
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]

      revenueGroupByBizType(params).then(res => {
        if (res.code === 1 && res.data) {
          this.amount = res.data[0].amount
          this.amountLinkRatio = res.data[0].amountLinkRatio
          this.title = res.data[0].bizTypeName
        }
      })
    }
  }
}
</script>

    <style lang="scss" scoped>
    .wrapper-online-depart-data {
        width: 100%;
        .revenue-performance {
          margin-top: 20px;
          width: 162px;
          height: 28px;
          background: #F7F7F7;
          padding: 1px;
          span {
            float: left;
            text-align: center;
            width: 80px;
            height: 26px;
            line-height: 26px;
            color: #666666;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            cursor: pointer;
            .yj-right {
              margin-left: 2px;
            }
          }
          span.active {
            background: #fff;
            color: #000;
          }
        }
        .gmv-block {
          margin-top: 20px;
          width: 430px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 6px;
          padding-left: 20px;
          background: #E8F1FF;
          span {
            color: #333333;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 32px;
            margin-right: 50px;
            em {
              margin-left: 8px;
              font-style: normal;
              font-size: 14px;
              color: #666;
              img {
                display: inline-block;
                width: 16px;
                margin-left: 4px;
                margin-top: -5px;
              }
            }
            em.red-xl {
              color: #D43030;
            }
            em.green-xl {
              color: #43CF7C;
            }
          }
        }
        .gmv-table-data {
          margin-top: 20px;
        }
        .gmv-table-line {
          width: 100%;
          height: 1px;
          margin-top: 10px;
          background: #D9D9D94d;
          margin-bottom: 20px;
        }
    }
    </style>
