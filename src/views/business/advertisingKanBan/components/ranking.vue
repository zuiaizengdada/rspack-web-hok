<template>
  <div class="warpper">
    <div class="data-search">
      <span class="left-title"><i />{{ title }}</span>
      <!-- <el-tooltip effect="dark" :content="msg" placement="top">
        <i
          class="el-icon-warning-outline"
          style="color: #999999; margin-left: 8px"
        />
      </el-tooltip> -->
    </div>
    <el-table
      v-loading="loading"
      :data="data"
      border
      style="width: 100%"
      :header-cell-style="{
        background: '#F2F9FF',
        border: 'none',
        'border-right': '1px solid #dfe6ec'
      }"
      class="m-t-20 ranking"
      max-height="400"
      :summary-method="getSummaries"
      :show-summary="status == 1"
    >
      <el-table-column
        prop="userName"
        label="投手"
        :width="status == 1 ? '' : '110'"
      >
        <template slot-scope="{ row, $index }">
          <div class="pm">
            <img
              v-if="$index == 0"
              src="@/assets/image/advertisingKanBan/one-p.png"
              alt=""
            >
            <img
              v-if="$index == 1"
              src="@/assets/image/advertisingKanBan/tow-p.png"
              alt=""
            >
            <img
              v-if="$index == 2"
              src="@/assets/image/advertisingKanBan/three-p.png"
              alt=""
            >
            <div v-if="$index > 2" class="ruond-p">
              <span>{{ $index + 1 }}</span>
            </div>

            <span
              :style="{
                'font-weight':
                  userId === row.userId && status == 1 ? 'bold' : 'inherit',
                color: userId === row.userId && status == 1 ? '#000' : '#333333'
              }"
            >{{ row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="status == 2"
        prop="title"
        label="创意名称"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        v-if="status == 2"
        prop="creativeId"
        label="创意ID"
        show-overflow-tooltip
        width="150"
      />
      <el-table-column
        prop="totalPayOrderCount"
        label="总成交数量"
        sortable
        width="115"
      >
        <template slot-scope="{ row }">
          {{ numberFormat(row.totalPayOrderCount, false) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPayOrderAmount"
        label="总业绩"
        sortable
        min-width="90"
      >
        <template slot-scope="{ row }">
          {{ numberFormat(row.totalPayOrderAmount) }}
        </template>
      </el-table-column>
      <el-table-column prop="totalRoi" label="总ROI" sortable min-width="90" />
      <!-- <el-table-column
        v-if="status == 2"
        prop="c"
        label="订单数"
        sortable="custom"
      /> -->
      <!-- <el-table-column v-if="status == 2" prop="d" label="广告链接">
        <template slot-scope="{ row }">
          <span class="a_link" :aa="row">查看</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import {
  getPitcherRankData,
  getAdRankData,
  getPitcherRankTotalData
} from '@/api/advertisingKanBan'
export default {
  name: 'Ranking',
  props: {
    // 是否千川
    type: { type: Number, default: 1 },
    search: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 默认投手排名
    status: { type: Number, default: 1 }
  },
  data() {
    return {
      data: [],
      loading: false,
      totalRoi: 0,
      // 获取用户id
      userId: this.$store.getters.userInfo.userId
    }
  },
  computed: {
    title() {
      return this.status === 1 ? '投手排名' : '广告排名'
    },
    msg() {
      return this.status === 1
        ? '用于展示当日优化师的线索数量、业绩与ROI排名，默认按业绩大小倒序排序'
        : '用于展示在广告创意ID+投手维度下展示广告的业绩与ROI，默认按照业绩大小倒序排列'
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
      this.status === 1
        ? this.getAdvertisingData(params)
        : this.getAdRankData(params)
    },
    // 投手排名
    async getAdvertisingData(params) {
      const res = await getPitcherRankData(params)
      const res2 = await getPitcherRankTotalData(params)
      if (res.code === 1) {
        this.data = res.data.map(m => ({
          ...m,
          totalPayOrderCount: m.totalPayOrderCount,
          totalPayOrderAmount: m.totalPayOrderAmount,
          totalRoi: m.totalRoi
        }))
      }
      if (res2.code === 1) {
        this.totalRoi = this.numberFormat(
          res2.data.totalRoi ? res2.data.totalRoi : 0
        )
      }
    },
    // 广告排名
    async getAdRankData(params) {
      const res = await getAdRankData(params)
      if (res.code === 1) {
        this.data = res.data
          .sort((a, b) => {
            return a.totalPayOrderAmount > b.totalPayOrderAmount
          })
          .map(m => ({
            ...m,
            totalPayOrderCount: m.totalPayOrderCount,
            totalPayOrderAmount: m.totalPayOrderAmount,
            totalRoi: m.totalRoi
          }))
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index === 3) {
          sums[index] = this.totalRoi
          return
        }
        const values = data.map(item => Number(item[column.property]))
        const v = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        sums[index] = this.numberFormat(v, index !== 1)
      })

      return sums
    }
  }
}
</script>
<style lang="scss" scoped>
.warpper {
  position: relative;
  .data-search {
    width: 100%;
    .updata-time {
      margin-left: 16px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
    .left-title {
      width: 100px;
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      font-family: '微软雅黑';
      i {
        width: 4px;
        height: 24px;
        margin-top: 3px;
        float: left;
        background: #0c6fff;
        border-radius: 8px;
      }
    }
  }
  .pm {
    display: flex;
    width: 100%;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    .ruond-p {
      width: 20px;
      height: 20px;
      background: #f2f9ff;
      border-radius: 50%;
      font-size: 10px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;
    }
  }
  .ranking {
    border-radius: 6px;
  }
}
::v-deep {
  .el-table__cell.gutter {
    background-color: #f2f9ff;
    border: none;
  }
}
</style>
