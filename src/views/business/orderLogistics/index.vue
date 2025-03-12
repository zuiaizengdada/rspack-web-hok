<template>
  <div class="order-logistics-wrapper">
    <search ref="searchRef" @onSearch="queryList" @onClear="initInfo" />
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="waybillNumber" label="运单号">
        <template slot-scope="scope">
          <span>{{ scope.row.waybillNumbers? scope.row.waybillNumbers.join(','): scope.row.waybillNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logisticsStatusName" label="物流状态" />
      <el-table-column prop="giftsCode" label="商品编码" />
      <el-table-column prop="giftsName" label="实物商品名称" align="center" />
      <el-table-column prop="goodsName" label="订单商品名称" align="center" />
      <el-table-column prop="goodsPricesMap" label="商品单价" />
      <el-table-column prop="channelSourceName" label="渠道平台" />
      <el-table-column prop="orderStatusName" label="订单状态" />
      <el-table-column prop="orderCreateTime" label="下单时间">
        <template slot-scope="scope"> 
          <span>{{ scope.row.orderCreateTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="addressCreateTime" label="地址填写时间">
        <template slot-scope="scope">
          <span>{{ scope.row.addressCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logisticsUpdateTime" label="物流更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.logisticsUpdateTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openTrajectoryInfo(scope.row)">
            物流轨迹
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <el-empty
          :image-size="400"
          :description="isToConfig ? '暂无数据' : '未开启物流发货功能'"
        >
          <img
            slot="image"
            src="@/assets/image/aigc/digitalVideoManage/icn_nodata.png"
            alt=""
          />
          <div v-if="!isToConfig" slot="default">
            请先在 售后管理-售后设置-实物物流 设置中开启物流服务<span
              style="color: #409eff; cursor: pointer"
              @click="toConfig"
            >
              点击进入
            </span>
          </div>
        </el-empty>
      </template>
    </el-table>
    <el-row type="flex" justify="space-between" style="margin-top: 20px">
      <el-button v-if="total > 0" type="text" @click="updateItem">
        更新物流
      </el-button>
      <div v-else />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <trajectoryInfo v-model="dialogVisible" :row="row" />
  </div>
</template>

<script>
import {
  getLogisticsPage,
  getLogisticsPUT,
  getLogisticsEnableSetting
} from '@/api/business/orderLogistics'
import search from './components/search'
import { mapGetters } from 'vuex'
import trajectoryInfo from './components/trajectoryInfo'
import {
  logisticsStatusList,
  orderStatusList,
  mapAmount
} from './util'
export default {
  components: {
    search,
    trajectoryInfo
  },
  data() {
    return {
      logisticsStatusList,
      orderStatusList,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      row: {},
      multipleSelection: [],
      isToConfig: true
    }
  },
  created() {
    this.currentPage = 1
    this.$store.dispatch('option/getChannelsourceType')
    this.queryList()
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  methods: {
    toConfig() {
      this.$router.push({
        path: '/afterSale/generalSetting/logistics/basicInfo'
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateItem() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请选择数据')
        return
      }
      this.loading = true
      getLogisticsPUT({
        orderNos: this.multipleSelection.map(m => m.orderNo)
      })
        .then(() => {
          this.loading = false
          this.$message.success('更新成功')
          this.initInfo()
        })
        .catch(() => {
          this.loading = false
        })
    },
    initInfo() {
      this.currentPage = 1
      this.$refs.searchRef.onSearch()
    },
    queryList(params) {
      getLogisticsEnableSetting({ erpType: 1 }).then(res => {
        if (res.data) {
          this.isToConfig = true
          this.getList(params)
        } else {
          this.isToConfig = false
          this.tableData = []
        }
      })
    },
    getList(params = {}) {
      this.loading = true
      getLogisticsPage({
        ...params,
        current: this.currentPage,
        size: this.pageSize
      })
        .then(res => {
          this.loading = false
          this.tableData = res.data.records.map(m => ({
            ...m,
            logisticsStatusName:
              this.logisticsStatusList.find(f => f.value === m.logisticsStatus)
                ?.label || '-',
            orderStatusName:
              this.orderStatusList.find(f => f.value === m.orderStatus)
                ?.label || '-',
            channelSourceName:
              this.channelSourceType.find(f => f.value === m.channelSource)
                ?.label || '-',
            goodsPricesMap: mapAmount(m.goodsPrices),
            giftsName: m.giftsName || '-'
          }))
          this.total = Number(res.data.total)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.$refs.searchRef.onSearch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.$refs.searchRef.onSearch()
    },
    openTrajectoryInfo(row) {
      this.row = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.order-logistics-wrapper {
  position: relative;
  background-color: #fff;
  padding: 20px;
}
</style>
