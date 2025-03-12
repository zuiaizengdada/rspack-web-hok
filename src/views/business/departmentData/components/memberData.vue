<template>
  <div class="member-data">
    <div class="top-data">
      <span class="left-title"><i /><span class="tit-name">成员业绩</span><el-tooltip
        :content="'成员业绩。'"
        class="item"
        effect="dark"
        placement="top"
      >
        <img src="@/assets/image/product/icon.png">
      </el-tooltip></span>
    </div>
    <el-table
      :data="personTotalData"
      :summary-method="getSummaries"
      show-summary
      :default-sort="{prop: 'totalCount', order:'descending'}"
      style="width: 100%;margin-top: 16px;"
    >
      <el-table-column
        prop="date"
        label="个人信息"
        align="center"
      >
        <el-table-column
          prop="name"
          label="姓名"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)"
            >{{ scope.row.personName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="position"
          label="职位"
        />
      </el-table-column>
      <el-table-column label="业绩组成" align="center">
        <el-table-column
          prop="contentGoodsTotal"
          label="内容带货业绩"
          sortable
        />
        <el-table-column
          prop="contentOrder"
          label="订单数"
          sortable
        />
        <el-table-column
          prop="liveGoodsTotal"
          label="直播带货业绩"
          sortable
        />
        <el-table-column
          prop="liveOrder"
          label="订单数"
          sortable
        />
      </el-table-column>
      <el-table-column label="业绩汇总" align="center">
        <el-table-column
          prop="totalCount"
          label="总业绩"
          sortable
        />
        <el-table-column
          prop="orderTotalCount"
          label="总订单数"
          sortable
        />
        <el-table-column
          prop="refundRatio"
          label="总退费率"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.refundRatio }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'MemberData',
  props: {
    personTotalData: {
      type: Array,
      default: () => {
        return []
      }
    },
    personTotalCount: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    handleEdit(item) {
      this.$emit('goPage', item)
    },
    // 合计统计
    getSummaries() {
      const sums = []
      sums[0] = '小计'
      sums[2] = this.personTotalCount.contentGoodsCountTotal || 0
      sums[3] = this.personTotalCount.contentCountOrder || 0
      sums[4] = this.personTotalCount.liveGoodsCountTotal || 0
      sums[5] = this.personTotalCount.liveCountOrder || 0
      sums[6] = this.personTotalCount.personTotalCount || 0
      sums[7] = this.personTotalCount.personOrderTotalCount || 0
      sums[8] = this.personTotalCount.refundCountRatio + '%'
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.top-data {
  margin-top: 32px;
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

</style>
