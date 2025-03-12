<template>
  <div class="big-wrapper">
    <div v-loading="loading" class="wrapper-online-gmv-show" :class="nowItem.bizType === activeBiz?'active-show':''" @click="changeTheBizType(nowItem)">
      <div class="gmv-left">
        <span>{{ nowItem.bizTypeName }}</span>
        <span class="gmv-left-gmv"><em />{{ formatNumber(nowItem.orderCount,0) }}单</span>
      </div>
      <div class="gmv-center">
        <span class="gmv-span"><em>￥</em>{{ filterPriceNoCompany(nowItem.amount) }}<em>{{ filterPriceReturnCompany(nowItem.amount) }}</em></span>
        <div class="gmv-center-detail">
          <span>对比{{ contrastString }}</span>
          <span class="lc">{{ filterPrice(nowItem.amountDiffer) }}</span>
          <em />
          <div v-if="nowItem.bizType === activeBiz" class="huanbi-cls">
            <span>{{ nowItem.amountLinkRatio }}%</span>
            <img v-if="nowItem.amountLinkRatio < 0" src="../../../../../assets/image/business/icn_down.png" />
            <img v-else-if="nowItem.amountLinkRatio > 0" src="../../../../../assets/image/business/icn_up.png" />
          </div>
          <div v-else class="huanbi-cls">
            <span :class="nowItem.amountLinkRatio>0?'green-span':'red-span'">{{ nowItem.amountLinkRatio }}%</span>
            <img v-if="nowItem.amountLinkRatio < 0" src="../../../../../assets/image/business/icn_red_up.png" />
            <img v-else-if="nowItem.amountLinkRatio > 0" src="../../../../../assets/image/business/icn_green_up.png" />
          </div>
        </div>
      </div>
      <div class="gmv-right">
        <span v-if="gmvShowForm.chooseType === 1" @click.stop="toListData(nowItem)">详情&nbsp;&nbsp;></span>
      </div>
    </div>
    <dataRow ref="dataRowRef" :loadding="loading" :contrast-string="contrastString" :choose-type="gmvShowForm.chooseType" :biz-type-active="activeBiz" @changeTheBizType="changeTheBizType" @changeToList="changeToList" />
  </div>
</template>

<script>
import dataRow from './dataRow.vue'
import { filterPrice, formatNumber, filterPriceNoCompany, filterPriceReturnCompany } from '@/utils'
import {
  revenueGroupByBizType,
  getDailyPerformanceTotal, // 查询总业绩
  getDailyPerformanceVideo, // 查询 业绩中直播带货模块数据
  getDailyPerformanceAnchorLive, // 查询 业绩中的视频带货数据
  getDailyPerformanceOfflinePay, // 查询 业绩中的线下录单业绩
  getDailyPerformancePrivateLive // 查询 业绩中的私域直播
} from '@/api/business/onlineAndOffline'
export default {
  components: {
    dataRow
  },
  data() {
    return {
      loading: false,
      contrastString: '昨日',
      dataArray: [],
      nowItem: {
        amount: 0,
        bizType: '',
        bizTypeName: '',
        orderCount: 0,
        amountDiffer: 0,
        amountLinkRatio: 0
      },
      activeBiz: '',
      gmvShowForm: {}
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
    formatNumber,
    filterPriceNoCompany,
    filterPriceReturnCompany,
    changeActive(item) {
      this.activeBiz = item.bizTypeActive
    },
    toListData(obj) {
      this.$emit('changeToList', obj)
    },
    changeToList(obj) {
      this.$emit('changeToList', obj)
    },
    changeTheBizType(obj) {
      this.activeBiz = obj.bizType
      this.$emit('changeBizTypeForForm', obj.bizType, obj.bizTypeName)
    },
    returnParams(type, num) {
      const item = this.gmvShowForm
      var params = {
      }
      if (type === 1) {
        params.bizTypes = item.bizTypes
      } else {
        params.bizType = num
      }

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
      this.loading = true
      this.activeBiz = item.bizTypeActive
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
      this.gmvShowForm = item
      this.activeBiz = item.bizTypeActive
      const params = this.returnParams(1)
      if (item.chooseType === 1) {
        revenueGroupByBizType(params).then(res => {
          if (res.code === 1 && res.data) {
            this.dataArray = res.data
            this.$emit('setBizArray', this.dataArray)
            let hasMoren = false
            this.dataArray.some((obj, index) => {
              if (obj.bizType === item.bizTypeActive) {
                hasMoren = true
              }
            })
            this.dataArray.some((obje, index) => {
              if (obje.bizType === 3) {
                this.nowItem = obje
                this.dataArray.splice(index, 1)
                this.$nextTick(() => {
                  setTimeout(() => {
                    this.loading = false
                  }, 500)
                  this.$refs.dataRowRef.init(this.dataArray)
                })
              }
            })
            if (!hasMoren) {
              this.activeBiz = 3
              this.$emit('changeBizTypeForForm', this.activeBiz, 'GMV')
            }
          }
        })
      } else if (item.chooseType === 2) {
        let hasActive = false
        item.bizTypes.some(bizItem => {
          if (bizItem === item.bizTypeActive) {
            hasActive = true
          }
        })
        if (!hasActive) {
          this.activeBiz = 1
          this.$emit('changeBizTypeForForm', this.activeBiz, '总业绩')
        }

        this.dataArray = []
        const params = this.returnParams(2, 1)
        getDailyPerformanceTotal(params).then(res => {
          if (res.code === 1 && res.data) {
            this.nowItem = res.data
            this.nowItem.bizType = 1
          }
        })
        const params1 = this.returnParams(2, 4)
        getDailyPerformanceAnchorLive(params1).then(res => {
          if (res.code === 1 && res.data) {
            const obj = {
              amount: res.data.amount,
              amountDiffer: res.data.amountDiffer,
              amountLinkRatio: res.data.amountLinkRatio,
              bizTypeName: res.data.bizTypeName,
              orderCount: res.data.orderCount,
              bizType: 4
            }
            this.dataArray.push(obj)
          }
        })
        const params2 = this.returnParams(2, 5)
        getDailyPerformanceVideo(params2).then(res => {
          if (res.code === 1 && res.data) {
            const obj1 = {
              amount: res.data.amount,
              amountDiffer: res.data.amountDiffer,
              amountLinkRatio: res.data.amountLinkRatio,
              bizTypeName: res.data.bizTypeName,
              orderCount: res.data.orderCount,
              bizType: 5
            }
            this.dataArray.push(obj1)
          }
        })
        const params3 = this.returnParams(2, 9)
        getDailyPerformanceOfflinePay(params3).then(res => {
          if (res.code === 1 && res.data) {
            const obj2 = {
              amount: res.data.amount,
              amountDiffer: res.data.amountDiffer,
              amountLinkRatio: res.data.amountLinkRatio,
              bizTypeName: res.data.bizTypeName,
              orderCount: res.data.orderCount,
              bizType: 9
            }
            this.dataArray.push(obj2)
          }
        })
        const params4 = this.returnParams(2, 12)
        getDailyPerformancePrivateLive(params4).then(res => {
          if (res.code === 1 && res.data) {
            const obj3 = {
              amount: res.data.amount,
              amountDiffer: res.data.amountDiffer,
              amountLinkRatio: res.data.amountLinkRatio,
              bizTypeName: res.data.bizTypeName,
              orderCount: res.data.orderCount,
              bizType: 12
            }
            this.dataArray.push(obj3)
          }
        })
        this.$nextTick(() => {
          setTimeout(() => {
            this.loading = false
            this.$refs.dataRowRef.init(this.dataArray)
          }, 1000)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-gmv-show {
    width: 100%;
    margin-top: 20px;
    height: 122px;
    flex-shrink: 0;
    border-radius: 10px;
    display: inline-block;
    display: flex;
    justify-content: space-between;
    background: #F5FAFF;
    cursor: pointer;
    .gmv-left {
        width: 300px;
        height: 122px;
        padding: 20px 20px;
        span {
            color: #000;
            font-family: "Microsoft YaHei";
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: 16px;
        }
        span.gmv-left-gmv {
            margin-left: 10px;
            border-radius: 20px;
            background: #E9F2FF;
            padding: 6px 12px;
            color: #3e4d89;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            em {
                width: 8px;
                height: 8px;
                background: #3E4E89;
                border-radius: 100%;
                display: inline-block;
                margin-right: 10px;
            }
        }
    }
    .gmv-center {
        width: 500px;
        padding: 22px 20px;
        text-align: center;
        height: 122px;
        .gmv-span {
            color: #000;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 34px;
            font-style: normal;
            font-weight: 600;
            em {
                font-style: normal;
                font-size: 20px;
                margin-left: 5px;
                font-weight: lighter;
            }
        }
        .gmv-center-detail {
            width: 100%;
            span {
                color: #666;
                text-align: center;
                font-family: "Microsoft YaHei";
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                line-height: 14px;
            }
            span.lc {
                margin-left: 8px;
            }
            em {
                width: 1px;
                height: 10px;
                background: #fff;
                margin-left: 10px;
                margin-right: 10px;
                display: inline-block;
            }
            img {
                width: 16px;
                height: 16px;
                margin-left: 8px;
                margin-top: -2px;
                display: inline-block;
            }
        }
    }
    .gmv-right {
        width: 300px;
        height: 122px;
        padding: 20px 20px;
        text-align: right;
        span {
            color: #666;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px;
            cursor: pointer;
        }
    }
}

.active-show {
  background: linear-gradient(315deg, #00C8FF 0%, #0091FF 100%);
  .gmv-left {
    span {
      color: #fff;
    }
    span.gmv-left-gmv {
      background: #ffffff33;
      color: #fff;
      em {
          background: #fff;
      }
    }
  }
  .gmv-center {
    .gmv-span {
      color: #ffffff;
    }
    .gmv-center-detail {
      width: 100%;
      span {
        color: #d3f3ff;
      }
      em {
        background: #fff;
      }
    }
  }
  .gmv-right {
    span {
      color: #fff;
    }
  }
}

.huanbi-cls {
  display: inline-block;
}
.green-span {
  color: #43CF7C!important;
}
.red-span {
  color: #D43030!important;
}

.big-wrapper {
  padding-bottom: 20px;
}

.hidden-cls {
  display: none;
}
</style>
