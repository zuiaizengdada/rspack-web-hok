<template>
  <div class="financial-instrument">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in configList" :key="item.approveStatus" :name="item.name" :label="item.label">
        <div v-if="item.name === 'orderList'">
          <orderList />
        </div>
        <div v-if="item.name === 'operationStatistics'">
          <operationstatistcs />
        </div>
        <div v-if="item.name === 'talentStatistics'">
          <tanlentStatistics />
        </div>
        <div v-if="item.name === 'launchStatistics'">
          <launch-statistics />
        </div>
        <div v-if="item.name === 'launchStatisticsManager'">
          <statisticsManager />
        </div>
        <div v-if="item.name === 'dataUpdate'">
          <uploadBrod />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="订单明细" name="orderList">
        <orderList />
      </el-tab-pane>
      <el-tab-pane label="运营统计" name="operationStatistics">
        <operationstatistcs />
      </el-tab-pane>
      <el-tab-pane label="达人统计" name="talentStatistics">
        <tanlentStatistics />
      </el-tab-pane>
      <el-tab-pane label="投放统计" name="launchStatistics">
        <launch-statistics />
      </el-tab-pane>
      <el-tab-pane label="投放账号管理" name="launchStatisticsManager">
        <statisticsManager />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import orderList from '@/views/business/financialInstruments/components/orderList'
import operationstatistcs from '@/views/business/financialInstruments/components/operationstatistcs'
import tanlentStatistics from '@/views/business/financialInstruments/components/tanlentStatistics'
import launchStatistics from '@/views/business/financialInstruments/components/launchStatistics'
import statisticsManager from '@/views/business/financialInstruments/components/statisticsManager'
import uploadBrod from '@/views/business/financialInstruments/components/uploadBrod'
export default {
  name: 'FinancialInstruments',
  components: {
    orderList,
    operationstatistcs,
    tanlentStatistics,
    launchStatistics,
    statisticsManager,
    uploadBrod
  },
  data() {
    return {
      configList: [
        { name: 'orderList', nums: 0, authority: 'web:financialInstruments:orderDetail', approveStatus: 1, label: '订单明细' },
        { name: 'operationStatistics', nums: 0, authority: 'web:financialInstruments:operationStatistcs', approveStatus: 2, label: '运营统计' },
        { name: 'talentStatistics', nums: 0, authority: 'web:financialInstruments:tanlentStatistics', approveStatus: 3, label: '达人统计' },
        { name: 'launchStatistics', nums: 0, authority: 'web:financialInstruments:launchStatistics', approveStatus: 4, label: '投放统计' },
        { name: 'launchStatisticsManager', nums: 0, authority: 'web:financialInstruments:statisticsManager', approveStatus: 5, label: '投放账号管理' },
        { name: 'dataUpdate', nums: 0, authority: 'web:financialInstruments:dataUpdate', approveStatus: 6, label: '数据上传' }
      ],
      permsList: this.$route.meta.permsList || [],
      activeName: 'orderList'
    }
  },
  watch: {
  },
  created() {

  },
  mounted() {
    console.log('诶诶诶诶：', this.permsList)
    this.configList = this.configList.filter(item => {
      return this.permsList.includes(item.authority)
    })
  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.financial-instrument {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
}
</style>

