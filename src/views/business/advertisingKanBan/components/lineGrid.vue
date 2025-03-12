<template>
  <div class="warpper">
    <el-row>
      <el-col class="item">
        <div class="item-title">
          创意数量
          <el-tooltip
            effect="dark"
            content="产生过数据的广告创意的数量"
            placement="top"
          >
            <i class="el-icon-question" style="color: #999999" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalCreativeId, false) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.creativeIdRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.creativeIdRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'创意数量'"
          :data="mapADAccount('totalCreativeId')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          曝光数量
          <el-tooltip
            effect="dark"
            content="所选维度下所有广告创意的曝光数量总和"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalShowCnt, false) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.showCntRatio)" />
            <span class="bfb">{{ Math.abs(adLargeMarket.showCntRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'曝光数量'"
          :data="mapADAccount('totalShowCnt')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          千次展示成本
          <el-tooltip
            effect="dark"
            content="广告花费/曝光数量*1000"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalCpmPlatform) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.cpmPlatformRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.cpmPlatformRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'千次展示成本'"
          :data="mapADAccount('totalCpmPlatform')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          点击数量
          <el-tooltip
            effect="dark"
            content="所选维度下所有广告创意的点击数量总和"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalClickCnt, false) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.clickCntRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.clickCntRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'点击数量'"
          :data="mapADAccount('totalClickCnt')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          成交成本
          <el-tooltip effect="dark" content="花费/总成交数量" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalConvertCost) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.convertCostRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.convertCostRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'成交成本'"
          :data="mapADAccount('totalConvertCost')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          直接成交数量
          <el-tooltip
            effect="dark"
            content="直接成交数量+间接成交数量"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalPayOrderCount, false) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.payOrderCountRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.payOrderCountRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'直接成交数量'"
          :data="mapADAccount('totalPayOrderCount')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          花费
          <el-tooltip
            effect="dark"
            content="所选维度下所有广告创意产生的消耗金额总和"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalStatCost) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.statCostRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.statCostRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'花费'"
          :data="mapADAccount('totalStatCost')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          总业绩
          <el-tooltip
            effect="dark"
            content="营销/推广目标=短视频带货/直播带货时；所选维度下所有广告创意在广告平台产生的直接成交与间接成交金额总和"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalPayOrderAmount) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.payOrderAmountRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.payOrderAmountRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'总业绩'"
          :data="mapADAccount('totalPayOrderAmount')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          直接支付ROI
          <el-tooltip effect="dark" content="直接成交业绩/花费" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">
            {{ numberFormat(adLargeMarket.totalPrepayAndPayOrderRoi) }}
          </div>
          <div>
            <span class="hb">环比</span>
            <i
              :class="fillClassString(adLargeMarket.prepayAndPayOrderRoiRatio)"
            />
            <span class="bfb">
              {{ Math.abs(adLargeMarket.prepayAndPayOrderRoiRatio) }}%
            </span>
          </div>
        </div>
        <LineEchart
          :name="'直接支付ROI'"
          :data="mapADAccount('totalPrepayAndPayOrderRoi')"
          :x-data="timeList"
        />
      </el-col>
      <el-col class="item">
        <div class="item-title">
          总ROI
          <el-tooltip effect="dark" content="总业绩/广告花费" placement="top">
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="value-n">
          <div class="count">{{ numberFormat(adLargeMarket.totalRoi) }}</div>
          <div>
            <span class="hb">环比</span>
            <i :class="fillClassString(adLargeMarket.totalRoiRatio)" />
            <span
              class="bfb"
            >{{ Math.abs(adLargeMarket.totalRoiRatio) }}%</span>
          </div>
        </div>
        <LineEchart
          :name="'总ROI'"
          :data="mapADAccount('totalRoi')"
          :x-data="timeList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineEchart from '../components/line.vue'
import { getAdLargeMarketData, getAccountPage } from '@/api/advertisingKanBan'
import { getDayAll } from '@/utils/index'

export default {
  name: 'LineGrid',
  components: { LineEchart },
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      adLargeMarket: {
        clickCntRatio: 0, // 点击次数环比
        convertCostRatio: 0, // 成交成本环比
        cpmPlatformRatio: 0, // 千次展示成本环比
        creativeIdRatio: 0, // 创意数量环比
        payOrderAmountRatio: 0, // 总业绩环比
        payOrderCountRatio: 0, // 直接成交数量环比
        prepayAndPayOrderRoiRatio: 0, // 直接支付ROI环比
        showCntRatio: 0, // 曝光数量环比
        statCostRatio: 0, // 花费环比
        totalClickCnt: 0, // 点击次数
        totalConvertCost: 0, // 成交成本
        totalCpmPlatform: 0, // 千次展示成本
        totalCreativeId: 0, // 创意数量
        totalPayOrderAmount: 0, // 总业绩
        totalPayOrderCount: 0, // 直接成交数量
        totalPrepayAndPayOrderRoi: 0, // 直接支付ROI
        totalRoi: 0, // 总roi
        totalRoiRatio: 0, // 总roi环比
        totalShowCnt: 0, // 曝光数量
        totalStatCost: 0 // 花费
      },
      adAccount: [],
      timeList: []
    }
  },
  created() {
    this.query()
  },
  methods: {
    numberFormat(value, isT = true) {
      if (Number(value) < 10000) {
        return isT ? Number(value).toFixed(2) : value
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.0001).toFixed(2) + '万'
      }
      if (Number(value) > 10000) {
        return (Number(value) * 0.00000001).toFixed(2) + '亿'
      }
    },
    query() {
      const params = { ...this.search }
      if (params.time) {
        params.startTime = params.time.time[0]
        params.endTime = params.time.time[1]
        delete params.time
        delete params.active
      }

      this.timeList = getDayAll(params.startTime, params.endTime)
      this.getAdLargeMarketData(params)
      this.getAccountPage(params)
    },
    mapADAccount(key) {
      const d = []
      const isToday = this.search.time.time[0] === this.search.time.time[1]
      this.timeList.forEach((e, index) => {
        const m = isToday
          ? this.adAccount[index]
          : this.adAccount.find(f => e.includes(f.daily))
        if (m) {
          d.push(m[key] || 0)
        } else {
          d.push(0)
        }
      })
      return d
    },
    // 数据大盘
    async getAdLargeMarketData(params) {
      const res = await getAdLargeMarketData(params)
      if (res.code === 1) {
        this.adLargeMarket = res.data
      }
    },
    // 数据大盘(折线图)
    async getAccountPage(params) {
      const res = await getAccountPage(params)
      if (res.code === 1) {
        this.adAccount = res.data
      }
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.warpper {
  position: relative;
  width: 100%;
}
.item {
  width: 19%;
  height: 11rem;
  margin-right: 1%;
  margin-bottom: 15px;
  background: #ffffff;
  box-shadow: -1px 2px 10px 0px rgba(12, 111, 255, 0.1);
  border-radius: 8px;
  .item-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    padding: 1rem 1rem 0 1rem;
  }
  .value-n {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem 1rem 0 1rem;
    .count {
      font-size: 1.5rem;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
    }
    .hb {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      margin-right: 2px;
    }
    .bfb {
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      margin-left: 2px;
    }
  }

  .red-p {
    width: 12px;
    height: 12px;
    display: inline-block;
    background-image: url('../../../../assets/image/product/down.png');
    background-size: 100% 100%;
  }

  .green-p {
    width: 12px;
    height: 12px;
    margin-right: 2px;
    display: inline-block;
    background-image: url('../../../../assets/image/product/up.png');
    background-size: 100% 100%;
  }

  i {
    font-size: 16px;
  }
}
</style>
