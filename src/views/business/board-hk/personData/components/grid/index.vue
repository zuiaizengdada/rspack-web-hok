<template>
  <div class="grid_c">
    <chunk
      v-show="isRevenue"
      ref="gmvChunkObj"
      :obj="gmvChunkObj"
      @handleClick="handleClick"
    />
    <chunk ref="zysChunkObj" :obj="zysChunkObj" @handleClick="handleClick" />
    <chunk
      v-show="isRevenue"
      ref="tkjeChunkObj"
      :obj="tkjeChunkObj"
      @handleClick="handleClick"
    />
    <chunk ref="spdhChunkObj" :obj="spdhChunkObj" @handleClick="handleClick" />
    <chunk ref="zbdhChunkObj" :obj="zbdhChunkObj" @handleClick="handleClick" />

    <chunk
      v-show="!isDeptId && syxscjChunkObj.value > 0"
      ref="syxscjChunkObj"
      :obj="syxscjChunkObj"
      @handleClick="handleClick"
    />

    <chunk
      v-show="!isDeptId && xxldChunkObj.value > 0"
      ref="xxldChunkObj"
      :obj="xxldChunkObj"
      @handleClick="handleClick"
    />
  </div>
</template>
<script>
import {
  bizTypeRevenueData,
  bizTypeData
} from '@/api/business/board-hk/businessData'
import chunk from './chunk.vue'
export default {
  components: { chunk },
  data() {
    return {
      isRevenue: true,
      isDeptId: true,
      gmvChunkObj: {
        title: 'GMV',
        value: 0,
        ratio: 0,
        contemporaneousPeriodAmount: 0,
        loading: false,
        active: 0,
        isCheck: true,
        width: '32.8%'
      },
      zysChunkObj: {
        title: '总营收',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '32.8%'
      },
      tkjeChunkObj: {
        title: '退款金额',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '32.8%'
      },
      spdhChunkObj: {
        title: '视频带货',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '24.5%'
      },
      zbdhChunkObj: {
        title: '直播带货',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '24.5%'
      },
      syxscjChunkObj: {
        title: '私域线上成交',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '24.5%'
      },
      xxldChunkObj: {
        title: '线下录单',
        value: 0,
        ratio: 0,
        loading: false,
        active: 0,
        isCheck: false,
        width: '24.5%'
      }
    }
  },
  methods: {
    handleClick(key) {
      if (
        this.gmvChunkObj.loading ||
        this.zysChunkObj.loading ||
        this.tkjeChunkObj.loading ||
        this.spdhChunkObj.loading ||
        this.zbdhChunkObj.loading ||
        this.syxscjChunkObj.loading ||
        this.xxldChunkObj.loading
      ) {
        setTimeout(() => {
          const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
          console.log(setBuObj)
          this.handleClick(setBuObj.refKey, setBuObj.refsValue)
        }, 200)
        return
      }
      this.gmvChunkObj.isCheck = key === 'GMV'
      this.zysChunkObj.isCheck = ['总营收', '总业绩'].includes(key)
      this.tkjeChunkObj.isCheck = key === '退款金额'
      this.spdhChunkObj.isCheck = key === '视频带货'
      this.zbdhChunkObj.isCheck = key === '直播带货'
      this.syxscjChunkObj.isCheck = key === '私域线上成交'
      this.xxldChunkObj.isCheck = key === '线下录单'
      // 重新定义orderSource
      const mapOrderSource = {
        总营收: 1,
        总业绩: 1,
        退款金额: 2,
        GMV: 3,
        直播带货: 10,
        视频带货: 5,
        私域线上成交: 11,
        线下录单: 9
      }[key]
      this.$emit('gridChage', mapOrderSource)
    },
    initData(params) {
      this.apis(params)
    },
    mapLoading(val) {
      const objs = {
        // 总营收
        1: () => {
          this.zysChunkObj.loading = val
        },
        // 退款
        2: () => {
          this.tkjeChunkObj.loading = val
        },
        // GMV
        3: () => {
          this.gmvChunkObj.loading = val
        },
        // 直播带货
        10: () => {
          this.zbdhChunkObj.loading = val
        },
        // 视频带货
        5: () => {
          this.spdhChunkObj.loading = val
        },
        // 主播直播
        6: () => {
          this.zbdhChunkObj.loading = val
        },
        // 老师直播
        7: () => {},
        // 线上成交
        8: () => {
          this.syxscjChunkObj.loading = val
        },
        // 线下录单
        9: () => {
          this.xxldChunkObj.loading = val
        }
      }
      Object.keys(objs).map(m => {
        objs[m](val)
      })
    },
    getBizType(params) {
      let type = params.bizType
      if (params.changeIsRevenue) {
        if (!params.isRevenue) {
          if (
            this.gmvChunkObj.isCheck ||
            this.tkjeChunkObj.isCheck ||
            this.xxldChunkObj.isCheck ||
            this.syxscjChunkObj.isCheck
          ) {
            type = 1
          }
        }
        this.zysChunkObj.isCheck = type === 1
        this.gmvChunkObj.isCheck = type === 3
        this.tkjeChunkObj.isCheck = type === 2
        this.zbdhChunkObj.isCheck = type === 10
        this.spdhChunkObj.isCheck = type === 5
        this.xxldChunkObj.isCheck = type === 9
        this.syxscjChunkObj.isCheck = type === 11
      }
      return type
    },
    apis(data) {
      const params = { ...data }
      this.isDeptId = !!params.deptId
      this.mapLoading(true)
      this.isRevenue = params.isRevenue

      this.zysChunkObj.title = params.isRevenue ? '总营收' : '总业绩'
      const api = params.isRevenue ? bizTypeRevenueData : bizTypeData
      api({
        bizTypes: params.isRevenue
          ? [1, 2, 3, 5, 10, 11, 9]
          : [1, 5, 10, 11, 9],
        endTime: params.endTime,
        employeeDeptId: params.deptId,
        employeeUid: params?.employeeUid || this.$store.getters.userInfo.userId,
        itemIdList:
          params.goodsId && params.goodsId.length > 0
            ? params.goodsId
            : undefined,
        productCategory: params.productCategory,
        orderChannel: params.isRevenue ? params.orderChannel : undefined,
        startTime: params.startTime,
        teacherIdList: params.teacherIdList,
        timeType: params.type,
        shopId: params.isRevenue ? params.shopId : undefined
      })
        .then(res => {
          this.mapLoading(false)
          if (res.data) {
            const objs = {
              // 总营收
              1: item => {
                this.zysChunkObj.loading = false
                this.zysChunkObj.value = item.amount
                this.zysChunkObj.contemporaneousPeriodAmount = item.amountDiffer
                this.zysChunkObj.ratio = item.amountLinkRatio
                this.zysChunkObj.active = params.type
              },
              // 退款
              2: item => {
                this.tkjeChunkObj.loading = false
                this.tkjeChunkObj.value = item.amount
                this.tkjeChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.tkjeChunkObj.ratio = item.amountLinkRatio
                this.tkjeChunkObj.active = params.type
              },
              // GMV
              3: item => {
                this.gmvChunkObj.loading = false
                this.gmvChunkObj.value = item.amount
                this.gmvChunkObj.contemporaneousPeriodAmount = item.amountDiffer
                this.gmvChunkObj.ratio = item.amountLinkRatio
                this.gmvChunkObj.active = params.type
              },
              // 直播带货
              10: item => {
                this.zbdhChunkObj.loading = false
                this.zbdhChunkObj.value = item.amount
                this.zbdhChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.zbdhChunkObj.ratio = item.amountLinkRatio
                this.zbdhChunkObj.active = params.type
              },
              // 视频带货
              5: item => {
                this.spdhChunkObj.loading = false
                this.spdhChunkObj.value = item.amount
                this.spdhChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.spdhChunkObj.ratio = item.amountLinkRatio
                this.spdhChunkObj.active = params.type
              },
              // 主播直播
              6: item => {
                this.zbdhChunkObj.loading = false
                this.zbdhChunkObj.value = item.amount
                this.zbdhChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.zbdhChunkObj.ratio = item.amountLinkRatio
                this.zbdhChunkObj.active = params.type
              },
              // 老师直播
              7: item => {},
              // 线下录单
              9: item => {
                this.xxldChunkObj.loading = false
                this.xxldChunkObj.value = item.amount
                this.xxldChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.xxldChunkObj.ratio = item.amountLinkRatio
                this.xxldChunkObj.active = params.type
              },
              // 私域线上成交
              11: item => {
                this.syxscjChunkObj.loading = false
                this.syxscjChunkObj.value = item.amount
                this.syxscjChunkObj.contemporaneousPeriodAmount =
                  item.amountDiffer
                this.syxscjChunkObj.ratio = item.amountLinkRatio
                this.syxscjChunkObj.active = params.type
              }
            }
            res.data.map((m, i) => {
              objs[m.bizType] && objs[m.bizType](m)
              if (i === res.data.length - 1) {
                this.zysChunkObj.width = '24.5%'
                this.mapStyle()
              }
            })
          }
        })
        .catch(() => {
          this.mapLoading(false)
        })
    },
    mapStyle() {
      if (this.isRevenue) {
        this.zysChunkObj.width = '32.8%'
      } else {
        this.zysChunkObj.width = '24.5%'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.grid_c {
  width: 100%;
}
</style>
