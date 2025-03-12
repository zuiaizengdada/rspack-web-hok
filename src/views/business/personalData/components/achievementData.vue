<template>
  <div>
    <div class="top-data">
      <span class="left-title"><i /><span class="tit-name">业绩明细</span></span>
    </div>
    <el-table
      :data="personTotalDetailData"
      style="width: 100%;margin-top: 16px;"
      :header-row-class-name="'tableClassName'"
    >
      <el-table-column
        prop="name"
        label="渠道"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            class="channelName"
          >{{ scope.row.channelName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="operatorName"
        label="运营账号"
      />
      <el-table-column
        prop="contentGoodsTotal"
        label="内容带货"
        sortable
      />
      <el-table-column
        prop="contentOrder"
        label="订单数"
        sortable
      />
      <el-table-column
        prop="liveGoodsTotal"
        label="直播带货"
        sortable
      />
      <el-table-column
        prop="liveOrder"
        label="订单数"
        sortable
      />
      <el-table-column
        prop="refundTotalCount"
        label="总退费"
        sortable
      />
      <el-table-column
        prop="refundOrderRatio"
        label="退费率"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundOrderRatio }}%</span>
        </template>
      </el-table-column>>
      <el-table-column
        prop="dealTotal"
        label="成交金额"
        sortable
      />
      <el-table-column
        prop="orderTotalCount"
        label="总订单数"
        sortable
      />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AchievementData',
  props: {
    personTotalDetailData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333,
        periodPrice: 99999,
        periodPriceProportion: 0.25,
        num: 1111
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tableClassName>th{
    background: #F3F3F3 !important;
  }
}
.top-data{
  margin-top: 20px;
}
.channelName{
  cursor: default;
}
.left-title {
  width: 200px;
  height: 32px;
  line-height: 32px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  font-family: '微软雅黑';
  display: flex;
  align-items: center;
  .tit-name{
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
}
</style>
