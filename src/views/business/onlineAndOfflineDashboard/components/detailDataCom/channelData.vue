<template>
  <div class="wrapper-online-channel-data">
    <div class="gmv-block">
      <span>{{ title }}  <em>￥{{ filterPrice(amount) }}</em></span>
      <span style="margin-left: 50px;">对比{{ contrastString }}
        <em v-if="amountLinkRatio > 0" class="green-xl">{{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}<img src="../../../../../assets/image/business/icn_green_up.png" /></em>
        <em v-else-if="amountLinkRatio < 0" class="red-xl">{{ amountLinkRatio }}%<img src="../../../../../assets/image/business/icn_red_up.png" /></em>
        <em v-else>{{ amountLinkRatio>1000?'1000%+':amountLinkRatio+'%' }}</em>
      </span>
    </div>
    <div class="ip-tearcher-row">
      <div class="item-row item-first-row">
        <channelTable
          ref="zbChannelData"
          :columns="formChannelData.offlineFlag === 0?channelColumnsOnline:channelColumnsOffline"
          :form-for-list="formChannelData"
          :get-list="getList"
          :hb-line="6"
          :is-pages="false"
        >
          <template v-slot:freeRevenue="{scope}">
            <span>{{ filterPrice(scope.row.freeRevenue) }}</span>
            <em class="dl-em">（{{ scope.row.freeOrderCount }}单）</em>
          </template>
          <template v-slot:directAmount="{scope}">
            <span>{{ filterPrice(scope.row.directAmount) }}</span>
            <em class="dl-em">（{{ scope.row.directOrderCount }}单）</em>
          </template>
          <template v-slot:indirectAmount="{scope}">
            <span>{{ filterPrice(scope.row.indirectAmount) }}</span>
            <em class="dl-em">（{{ scope.row.indirectOrderCount }}单）</em>
          </template>
          <template v-slot:revenue="{scope}">
            <div :class="(formChannelData.bizTypeActive !== 2 && formChannelData.bizTypeActive !== 3)?'blue-cls':''">
              <span>{{ filterPrice(scope.row.revenue) }}</span>
              <em class="dl-em">（{{ scope.row.revenueOrderCount }}单）</em>
            </div>
          </template>
          <template v-slot:refundAmount="{scope}">
            <div :class="(formChannelData.bizTypeActive === 2 )?'blue-cls':''">
              <span>{{ filterPrice(scope.row.refundAmount) }}</span>
              <em class="dl-em">（{{ scope.row.refundOrderCount }}单）</em>
            </div>
          </template>
          <template v-slot:refundPercent="{scope}">
            {{ scope.row.refundPercent }}%
          </template>
          <template v-slot:gmv="{scope}">
            <div :class="(formChannelData.bizTypeActive === 3 )?'blue-cls':''">
              {{ filterPrice(scope.row.gmv) }}
            </div>
          </template>
          <template v-slot:amount="{scope}">
            {{ filterPrice(scope.row.amount) }}
          </template>
          <template v-slot:linkAmount="{scope}">
            {{ filterPrice(scope.row.linkAmount) }}
          </template>
          <template v-slot:amountLinkRatio="{scope}">
            {{ scope.row.amountLinkRatio>1000?'1000%+':scope.row.amountLinkRatio+'%' }}
          </template>
        </channelTable>
      </div>
      <div class="item-row" style="min-width: 400px;">
        <accountChart ref="accountChartFormChannel" />
      </div>
    </div>
  </div>
</template>

<script>
import channelTable from './table.vue'
import { channelColumnsOnline, channelColumnsOffline } from './tearcherTable'
import accountChart from './accountChart.vue'
import { filterPrice } from '@/utils'
import { revenueGroupByBizType, getChannelLandscape } from '@/api/business/onlineAndOffline'
export default {
  components: {
    channelTable,
    accountChart
  },
  data() {
    return {
      channelColumnsOnline,
      channelColumnsOffline,
      formChannelData: {},
      amount: 0,
      contrastString: '昨日',
      amountLinkRatio: 0,
      title: '',
      dataArray: [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    filterPrice,
    getList() {
      const params = this.returnParams()
      return getChannelLandscape(params)
    },
    getChartData() {
      const params = this.returnParams()
      getChannelLandscape(params).then(res => {
        if (res.code === 1 && res.data) {
          this.$nextTick(() => {
            this.$refs.accountChartFormChannel.init(res.data, this.title + '渠道', 2, this.formChannelData)
          })
        }
      })
    },
    returnParams() {
      const item = this.formChannelData
      const params = {}
      params.bizType = item.bizTypeActive
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
      return params
    },
    init(item) {
      this.formChannelData = item
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
      this.loadBizTypeData(item)
      this.$nextTick(() => {
        this.$refs.zbChannelData.init()
      })
    },
    loadBizTypeData(item) {
      const params = {}
      params.bizTypes = []
      params.bizTypes.push(item.bizTypeActive)
      if (item.deptArray && item.deptArray.length > 0) {
        params.employeeDeptId = item.deptArray[0]
      }
      if (item.deptArray && item.deptArray.length > 1) {
        params.employeeSecondDeptId = item.deptArray[1]
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
          this.title = ''
          if (this.formChannelData.productCategory === 0) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '视频课' + res.data[0].bizTypeName
          } else if (this.formChannelData.productCategory === 1) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '直播课' + res.data[0].bizTypeName
          } else if (this.formChannelData.productCategory === 2) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '线下课' + res.data[0].bizTypeName
          } else if (this.formChannelData.productCategory === 3) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '组合课' + res.data[0].bizTypeName
          } else {
            this.title = res.data[0].bizTypeName
          }
        } else {
          this.title = ''
          if (this.formChannelData.productCategory === 0) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '视频课'
          } else if (this.formChannelData.productCategory === 1) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '直播课'
          } else if (this.formChannelData.productCategory === 2) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '线下课'
          } else if (this.formChannelData.productCategory === 3) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '组合课'
          }
          this.title += this.formChannelData.bizTypeActiveName
        }
        this.getChartData()
      })
    }
  }
}
</script>

    <style lang="scss" scoped>
    .wrapper-online-channel-data {
    width: 100%;
    float: left;
    .gmv-block {
    margin-top: 20px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 6px;
    float: left;
    padding: 0 20px;
    background: #E8F1FF;
    span {
        color: #333333;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px;
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
    .ip-tearcher-row {
        margin-top: 20px;
        float: left;
        width: calc(100% + 18px);
        margin-left: -10px;
        .item-row {
            float: left;
            width: 400px;
            margin-left: 18px;
            margin: 0 10px;
            flex-shrink: 0;
            border-radius: 6px;
            border: 1px solid #EFF2F6;
        }
        .item-first-row {
            width: calc(100% - 442px);
        }
    }
  }

  .dl-em {
    font-style: normal;
  }

  .blue-cls {
    color: #0091FF;
  }
    </style>
