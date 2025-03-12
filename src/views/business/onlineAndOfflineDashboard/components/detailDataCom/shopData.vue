<template>
  <div class="wrapper-online-ip-tearcher">
    <div class="ip-tearcher-row">
      <div class="item-row item-first-row">
        <tearcherTable
          ref="shopDataTableDa"
          :columns="formShopData.offlineFlag === 0 ?shopColumnsOnline:shopColumnsOffline"
          :form-for-list="formShopData"
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
            <div :class="(formShopData.bizTypeActive !== 2 && formShopData.bizTypeActive !== 3)?'blue-cls':''">
              <span>{{ filterPrice(scope.row.revenue) }}</span>
              <em class="dl-em">（{{ scope.row.revenueOrderCount }}单）</em>
            </div>
          </template>
          <template v-slot:refundAmount="{scope}">
            <div :class="(formShopData.bizTypeActive === 2)?'blue-cls':''">
              <span>{{ filterPrice(scope.row.refundAmount) }}</span>
              <em class="dl-em">（{{ scope.row.refundOrderCount }}单）</em>
            </div>
          </template>
          <template v-slot:refundPercent="{scope}">
            {{ scope.row.refundPercent>1000?'1000%+':scope.row.refundPercent+'%' }}
          </template>
          <template v-slot:gmv="{scope}">
            <div :class="(formShopData.bizTypeActive === 3)?'blue-cls':''">
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
        </tearcherTable>
      </div>
      <div class="item-row" style="min-width: 400px;">
        <accountChart ref="accountChartForShopData" />
      </div>
    </div>
  </div>
</template>

<script>
import tearcherTable from './table.vue'
import { shopColumnsOnline, shopColumnsOffline } from './tearcherTable'
import accountChart from './accountChart.vue'
import { filterPrice } from '@/utils'
import { getShopLandscape, revenueGroupByBizType } from '@/api/business/onlineAndOffline'
export default {
  components: {
    tearcherTable,
    accountChart
  },
  data() {
    return {
      shopColumnsOnline,
      shopColumnsOffline,
      dataArray: [],
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      title: '',
      formShopData: {}
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
    init(item) {
      this.formShopData = item
      this.$nextTick(() => {
        this.loadBizTypeData(item)
        this.$refs.shopDataTableDa.init()
      })
    },
    getList() {
      const params = this.returnParams()
      return getShopLandscape(params)
    },
    getChartData() {
      const params = this.returnParams()
      getShopLandscape(params).then(res => {
        if (res.code === 1 && res.data) {
          this.$nextTick(() => {
            this.$refs.accountChartForShopData.init(res.data, this.title + '店铺', 3, this.formShopData)
          })
        }
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
          this.title = ''
          if (this.formShopData.productCategory === 0) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '视频课' + res.data[0].bizTypeName
          } else if (this.formShopData.productCategory === 1) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '直播课' + res.data[0].bizTypeName
          } else if (this.formShopData.productCategory === 2) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '线下课' + res.data[0].bizTypeName
          } else if (this.formShopData.productCategory === 3) { // 0 视频课、1直播课、2线下课、3组合课
            this.title = '组合课' + res.data[0].bizTypeName
          } else {
            this.title = res.data[0].bizTypeName
          }
        } else {
          this.title = ''
          if (this.formIpTearcher.productCategory === 0) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '视频课'
          } else if (this.formIpTearcher.productCategory === 1) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '直播课'
          } else if (this.formIpTearcher.productCategory === 2) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '线下课'
          } else if (this.formIpTearcher.productCategory === 3) { // 0 视频课、1直播课、2线下课、3组合课
            this.title += '组合课'
          }
          this.title += this.formShopData.bizTypeActiveName
        }
        this.getChartData()
      })
    },
    returnParams() {
      const item = this.formShopData
      const params = {}
      params.bizType = item.bizTypeActive
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
      return params
    }
  }
}
</script>

      <style lang="scss" scoped>
      .wrapper-online-ip-tearcher {
    width: 100%;
    float: left;
    .gmv-block {
    margin-top: 20px;
    width: 480px;
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
