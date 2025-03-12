<template>
  <div class="coupon-data-detail">
    <div class="coupon-data-row">
      <div class="data-row-btn">
        <span v-permission="['web:couponDetail:CouponTypeData', permsList]" :class="couponType === 1?'active':''" @click="changeCouponType(1)">券种明细</span>
        <span v-permission="['web:couponDetail:CouponTypeDetail', permsList]" :class="couponType === 2?'active':''" @click="changeCouponType(2)">使用明细</span>
      </div>
      <div class="data-row-tool">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
        <el-button v-if="couponType === 1" v-permission="['web:couponTypeData:export', permsList]" size="small" @click="exportFor">导出</el-button>
        <el-button v-if="couponType === 2" v-permission="['web:couponTypeDetail:export', permsList]" size="small" @click="exportFor">导出</el-button>
      </div>
    </div>
    <div v-if="couponType === 1" class="data-search-row">
      <couponDetailSearch ref="couponDetailSearch" />
      <couponDetailData ref="couponDetailData" />
    </div>
    <div v-if="couponType === 2" class="data-search-row">
      <couponUseSearch ref="couponUseSearch" />
      <couponUseData ref="couponUseData" />
    </div>
  </div>
</template>

<script>
import couponDetailSearch from '@/views/marketingTools/couponDetail/components/couponDetailSearch'
import couponUseSearch from '@/views/marketingTools/couponDetail/components/couponUseSearch'
import couponDetailData from '@/views/marketingTools/couponDetail/components/couponDetailData'
import couponUseData from '@/views/marketingTools/couponDetail/components/couponUseData'
import { toExportCoupon, toExportUsedData } from '@/api/marketingTools/coupon.js'
export default {
  name: 'CouponDataDetail',
  components: {
    couponDetailSearch,
    couponUseSearch,
    couponDetailData,
    couponUseData
  },
  data() {
    return {
      searchParam: '',
      permsList: this.$route.meta.permsList || [],
      couponType: 1
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    if (this.$route.query.search) {
      this.searchParam = JSON.parse(this.$route.query.search)
      this.couponType = 2
      this.$nextTick(() => {
        this.$refs.couponUseSearch.search = this.searchParam
        this.$refs.couponUseData.loadData(this.$refs.couponUseSearch.search)
      })
    } else {
      this.search()
    }
  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    changeCouponType(type) {
      this.couponType = type
      this.search()
    },
    search() {
      if (this.couponType === 1) {
        this.searchForDetail()
      } else if (this.couponType === 2) {
        this.seearchForUsed()
      }
    },
    clear() {
      if (this.couponType === 1) {
        this.searchForDetailClear()
      } else if (this.couponType === 2) {
        this.seearchForUsedClear()
      }
    },
    exportFor() {
      if (this.couponType === 1) {
        const searchFor = this.$refs.couponDetailSearch.search
        const params = {
          startTime: searchFor.orderTimeArray ? searchFor.orderTimeArray[0] : '',
          endTime: searchFor.orderTimeArray ? searchFor.orderTimeArray[1] : '',
          type: searchFor.type,
          useStatus: searchFor.useStatus,
          pageIndex: searchFor.pageIndex,
          pageSize: searchFor.pageSize
        }
        if (searchFor.orderValue && searchFor.orderLabel === 'couponName') {
          params.conponType = 1
          params.couponVal = searchFor.orderValue
        } else if (searchFor.orderValue && searchFor.orderLabel === 'couponNo') {
          params.conponType = 2
          params.couponVal = searchFor.orderValue
        }
        toExportCoupon(params).then(res => {
          if (res.code === 1) {
            window.open(res.data, '_blank')
          }
        })
      } else if (this.couponType === 2) {
        const searchForStart = this.$refs.couponUseSearch.search
        const params = {
          writeOffTimeStart: searchForStart.orderTimeArray ? searchForStart.orderTimeArray[0] : '',
          writeOffTimeEnd: searchForStart.orderTimeArray ? searchForStart.orderTimeArray[1] : '',
          userCouponNo: searchForStart.userCouponNo,
          pageIndex: searchForStart.pageIndex,
          pageSize: searchForStart.pageSize
        }
        if (searchForStart.orderValue && searchForStart.orderLabel === 'couponName') {
          params.conponType = 1
          params.couponVal = searchForStart.orderValue
        } else if (searchForStart.orderValue && searchForStart.orderLabel === 'couponNo') {
          params.conponType = 2
          params.couponVal = searchForStart.orderValue
        }
        if (searchForStart.userValue && searchForStart.userLable === 'userName') {
          params.userType = 1
          params.userVal = searchForStart.userValue
        } else if (searchForStart.userValue && searchForStart.userLable === 'userId') {
          params.userType = 2
          params.userVal = searchForStart.orderValue
        }
        toExportUsedData(params).then(res => {
          if (res.code === 1) {
            window.open(res.data, '_blank')
          }
        })
      }
    },
    searchForDetailClear() {
      this.$nextTick(() => {
        this.$refs.couponDetailSearch.clear()
        this.$refs.couponDetailData.loadData(this.$refs.couponDetailSearch.search)
      })
    },
    searchForDetail() {
      this.$nextTick(() => {
        this.$refs.couponDetailData.loadData(this.$refs.couponDetailSearch.search)
      })
    },
    seearchForUsedClear() {
      this.$nextTick(() => {
        this.$refs.couponUseSearch.clear()
        this.$refs.couponUseData.loadData(this.$refs.couponUseSearch.search)
      })
    },
    seearchForUsed() {
      this.$nextTick(() => {
        this.$refs.couponUseData.loadData(this.$refs.couponUseSearch.search)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-data-detail {
    width: 100%;
    height: 100%;
    display: inline-block;
    margin-bottom: 15px;
    border-radius: 10px;
    background-color: #fff;
    .coupon-data-row {
        width: 100%;
        height: 40px;
        .data-row-btn {
            float: left;
            padding: 3px;
            height: 36px;
            background: #F3F3F3;
            border-radius: 4px;
            span {
                width: 90px;
                text-align: center;
                height: 30px;
                line-height: 30px;
                color: #333;
                display: inline-block;
                cursor: pointer;
                font-size: 14px;
            }
            span.active {
                background: #fff;
                color: #0C6FFF;
            }
        }
        .data-row-tool {
            float: right;
        }
    }
    .data-search-row {
        width: 100%;
        margin-top: 5px;
    }
}
</style>

