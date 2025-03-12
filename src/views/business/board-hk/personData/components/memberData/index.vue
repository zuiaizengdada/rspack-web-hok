<template>
  <div class="member-data">
    <div class="top-data">
      <span class="left-title">
        <span class="tit-name">明细数据</span>
      </span>

      <!-- <div class="right-search">
        <span>员工姓名</span>
        <AppUserSelect class="w-200 user-select-m" @change="changeUser" />
      </div> -->
    </div>

    <el-table
      ref="table"
      v-loading="loading"
      :data="list"
      style="width: 100%; margin-top: 26px"
    >
      <el-table-column
        v-for="(item, i) in getColumns"
        :key="item.key + i"
        :prop="item.key"
        :label="item.label"
        :sortable="item.sortable"
        :class-name="keyMapClass(item.key)"
      >
        <template slot-scope="scope">
          <div v-if="item.key === 'refundRate'">
            <p>{{ scope.row.refundRate }}%</p>
          </div>
          <div v-else>
            <p>{{ scope.row[item.key] }}</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import AppUserSelect from '@/components/AppUserSelect'
import {
  expertData,
  expertPerformanceData
} from '@/api/business/board-hk/businessData'
import { intelligentPersonColumns, performanceColumns } from './headerColumn'
export default {
  name: 'MemberData',
  // components: { AppUserSelect },
  data() {
    return {
      intelligentPersonColumns,
      performanceColumns,
      type: 2,
      list: [],
      isRevenue: true,
      loading: false,
      queryParams: {}
    }
  },
  computed: {
    getColumns() {
      if (!this.isRevenue) {
        return this.performanceColumns
      } else {
        return this.intelligentPersonColumns
      }
    }
  },
  methods: {
    keyMapClass(key) {
      const tmp = {
        1: ['revenue', 'totalPerformance'],
        2: ['refundAmount'],
        3: ['gmv']
      }

      return tmp[this.queryParams.bizType]?.includes(key)
        ? 'highlightColumn'
        : ''
    },
    initData(record) {
      this.isRevenue = record.isRevenue
      if (!this.isRevenue) {
        this.type = 2
      }
      this.queryParams = {
        bizType: record.bizType,
        employeeUid: record.employeeUid || this.$store.getters.userInfo.userId,
        endTime: record.endTime,
        expertId: this.type === 2 ? this.search?.liveAccount?.id : undefined,
        itemIdList:
          record.goodsId && record.goodsId.length > 0
            ? record.goodsId
            : undefined,
        productCategory: record.productCategory,
        orderChannel: record.orderChannel,
        startTime: record.startTime,
        teacherIdList: record.teacherIdList,
        employeeDeptId: record.deptId,
        timeType: record.type,
        shopId: record.shopId
      }
      const api = this.isRevenue ? expertData : expertPerformanceData
      this.loading = true
      this.$refs.table.clearSort()
      api({ ...this.queryParams })
        .then(res => {
          this.loading = false
          if (res.data) {
            let ls = []
            ls = res.data.map(m => ({
              ...m,
              freeRevenue: Number(Number(m.freeRevenue / 100).toFixed(2)),
              paidRevenue: Number(Number(m.paidRevenue / 100).toFixed(2)),
              revenue: Number(Number(m.revenue / 100).toFixed(2)),
              gmv: Number(Number(m.gmv / 100).toFixed(2)),
              growthPercent:
                m.growthPercent > 1000 ? '1000%+' : m.growthPercent + '%',
              refundRate: m.refundRate,
              contemporaneousRevenue: Number(
                Number(m.contemporaneousRevenue / 100).toFixed(2)
              ),
              refundAmount: Number(Number(Number(m.refundAmount) / 100).toFixed(2))
            }))
            if (!this.isRevenue) {
              ls = ls.map(m => ({
                ...m,
                freePerformance: m.freePerformance
                  ? Number(Number(m.freePerformance / 100).toFixed(2))
                  : 0,
                paidPerformance: m.paidPerformance
                  ? Number(Number(m.paidPerformance / 100).toFixed(2))
                  : 0,
                contemporaneousPerformance: m.contemporaneousPerformance
                  ? Number(
                    Number(m.contemporaneousPerformance / 100).toFixed(2)
                  )
                  : 0,
                totalPerformance: m.totalPerformance
                  ? Number(Number(m.totalPerformance / 100).toFixed(2))
                  : 0
              }))
            }
            this.list = ls
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击员工
    changeUser(res, info) {
      this.queryParams.employeeUid = res
      this.queryParams.expertId = undefined
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.top-data {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    font-family: '微软雅黑';

    .tit-name {
      margin-left: 8px;
    }

    i {
      width: 4px;
      height: 24px;
      margin-top: 3px;
      float: left;
      background: #0c6fff;
      border-radius: 8px;
    }

    img {
      float: left;
      width: 16px;
      margin-top: 5px;
      margin-left: 8px;
    }
  }
}
.switch-type {
  width: 218px;
  height: 28px;
  background: #e8ebee;
  border-radius: 4px;
  padding: 1px;
  display: inline-block;
  margin-left: 24px;
  .switch-type-item {
    display: inline-block;
    padding: 4px 24px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #424242;
    cursor: pointer;
    user-select: none;
  }
  .switch-type-item-active {
    background: #ffffff;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2474ff;
  }
}
.right-search {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  span {
    margin-right: 8px;
  }
}
::v-deep {
  .user-select-m .el-input input {
    height: 32px !important;
    line-height: 32px !important;
  }
}
</style>
<style>
.highlightColumn {
  color: #2474ff;
  cursor: pointer;
}
</style>
