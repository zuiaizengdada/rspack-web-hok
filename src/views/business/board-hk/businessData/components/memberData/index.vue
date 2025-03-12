<template>
  <div class="member-data">
    <div class="top-data">
      <span class="left-title">
        <span class="tit-name">明细数据</span>
        <div v-if="isRevenue" class="switch-type">
          <div
            :class="{
              'switch-type-item': true,
              'switch-type-item-active': type == 1
            }"
            @click="changeType(1)"
          >
            员工
          </div>
          <div
            :class="{
              'switch-type-item': true,
              'switch-type-item-active': type == 2
            }"
            @click="changeType(2)"
          >
            达人
          </div>
          <div
            :class="{
              'switch-type-item': true,
              'switch-type-item-active': type == 3
            }"
            @click="changeType(3)"
          >
            商品
          </div>
        </div>
      </span>

      <div v-if="type == 1" class="right-search">
        <span>员工姓名</span>
        <AppUserSelect class="w-200 user-select-m" @change="changeUser" />
      </div>
      <div v-if="type == 2" class="right-search">
        <span>达人名称</span>
        <liveAccountSelect
          :params="{ expertChannel: search.liveChannel }"
          maxlength="30"
          style="width: 100%"
          :default-id="search.liveAccount.id"
          :value="search.liveAccount.name"
          @selected="liveAccountSelect"
        />
      </div>
      <div v-if="type == 3" class="right-search">
        <span>商品名称</span>
        <el-select
          v-model="goods"
          clearable
          multiple
          filterable
          :filter-method="getGoodsList"
          @change="goodsChange"
        >
          <el-option
            v-for="item in goodsList"
            :key="item.goodsId"
            :label="item.contentName"
            :value="item.goodsId"
          />
        </el-select>
      </div>
    </div>

    <el-table
      ref="table"
      v-loading="loading"
      :data="list"
      style="width: 100%; margin-top: 26px"
    >
      <el-table-column
        v-for="item in getColumns"
        :key="item.key"
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
import AppUserSelect from '@/components/AppUserSelect'
import liveAccountSelect from '@/views/business/liveScheduling/components/liveAccountSelect.vue'
import {
  employeeData,
  expertData,
  productData,
  employeePerformanceData
} from '@/api/business/board-hk/businessData'
import {
  staffColumns,
  intelligentPersonColumns,
  goodsColumns,
  performanceColumns
} from './headerColumn'
import { getShowGoodsList } from '@/api/course'
export default {
  name: 'MemberData',
  components: { AppUserSelect, liveAccountSelect },
  props: {
    isShowMemberData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sbData: [],
      staffColumns,
      intelligentPersonColumns,
      goodsColumns,
      performanceColumns,
      type: 1,
      list: [],
      isRevenue: true,
      queryParams: {
        bizType: undefined,
        employeeUid: undefined,
        endTime: undefined,
        expertId: undefined,
        itemIdList: undefined,
        productCategory: undefined,
        orderChannel: undefined,
        startTime: undefined,
        teacherIdList: undefined,
        employeeDeptId: undefined,
        timeType: undefined,
        shopId: undefined
      },
      loading: false,
      goodsList: [],
      goods: undefined,
      search: {
        liveAccount: {
          id: undefined,
          name: undefined
        },
        liveChannel: undefined
      }
    }
  },
  computed: {
    getColumns() {
      if (!this.isRevenue) {
        return this.performanceColumns
      }
      if (this.type === 1) {
        return this.staffColumns
      } else if (this.type === 2) {
        return this.intelligentPersonColumns
      } else {
        return this.goodsColumns
      }
    }
  },
  methods: {
    changeSort({ row, prop, order }) {
      if (prop === 'refundRate' && order === 'descending') {
        this.$refs.table.clearSort()
        this.sortByRefundRate(1)
      } else if (prop === 'refundRate' && order === 'ascending') {
        this.$refs.table.clearSort()
        this.sortByRefundRate(2)
      }
    },
    sortByRefundRate(type) {
      let sbData = []
      console.log('before:', this.sbData)
      if (type === 1) {
        sbData = this.sbData.sort((a, b) => b.refundRate - a.refundRate)
      } else {
        sbData = this.sbData.sort((a, b) => a.refundRate - b.refundRate)
      }
      console.log('after:', sbData)

      if (sbData) {
        let ls = []
        ls = sbData.map(m => ({
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
          refundAmount: Number(Number(m.refundAmount / 100).toFixed(2))
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
    },
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
    // 点击选择直播账号
    liveAccountSelect(row) {
      this.search.liveAccount.name = row.expertName
      this.search.liveAccount.id = row.id
      this.search.liveChannel = row.expertChannel
      this.queryParams.expertId = row.expertId
      this.initData()
    },
    goodsChange(val) {
      this.queryParams.itemIdList = [...val]
      this.initData()
    },
    getGoodsList(val) {
      getShowGoodsList({ contentName: val, current: 1, size: 500 }).then(
        res => {
          this.goodsList = res.data.records
        }
      )
    },
    initData(record) {
      if (record) {
        this.isRevenue = record.isRevenue
        if (record.deptIsRevenue !== undefined) {
          this.isRevenue = record.deptIsRevenue
        }
        if (!this.isRevenue) {
          this.type = 1
        }
        this.queryParams = {
          bizType: record.bizType,
          employeeUid:
            this.type === 1 ? this.queryParams.employeeUid : undefined,
          endTime: record.endTime,
          expertId: this.type === 2 ? this.queryParams.expertId : undefined,
          itemIdList:
            this.type === 3
              ? [...record.goodsId, ...this.goods]
              : record.goodsId && record.goodsId.length > 0
                ? record.goodsId
                : undefined,
          productCategory: record.productCategory,
          orderChannel:
            !this.isRevenue || (record.changeIsRevenue && !record.isRevenue)
              ? undefined
              : record.orderChannel,
          startTime: record.startTime,
          teacherIdList: record.teacherIdList,
          employeeDeptId: record.deptId || undefined,
          timeType: record.type,
          shopId:
            !this.isRevenue || (record.changeIsRevenue && !record.isRevenue)
              ? undefined
              : record.shopId
        }
      }
      this.$refs.table.clearSort()
      this.loading = true
      this.list = []
      const api =
        this.type === 1
          ? this.isRevenue
            ? employeeData
            : employeePerformanceData
          : this.type === 2
            ? expertData
            : productData
      api({ ...this.queryParams, search: undefined })
        .then(res => {
          this.loading = false
          // 让滚动条置底
          // this.$nextTick(() => {
          //   const el = document.querySelector('.main-container')
          //   window.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
          // })
          if (res.data) {
            let ls = []
            this.sbData = res.data
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
              refundAmount: Number(Number(m.refundAmount / 100).toFixed(2))
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
    changeUser(res) {
      this.queryParams.employeeUid = res
      this.initData()
    },
    changeType(type) {
      if (this.type === type) return
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.mixiDataType = type
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.type = type
      this.queryParams.employeeUid = undefined
      this.queryParams.expertId = undefined
      this.search = {
        liveAccount: {
          id: undefined,
          name: undefined
        },
        liveChannel: undefined
      }
      this.initData()
    },
    handleEdit(item) {
      this.$emit('goPage', item)
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
    border-radius: 3px;
  }
}
.right-search {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  display: flex;
  align-items: center;

  span {
    margin-right: 8px;
    white-space: nowrap;
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
