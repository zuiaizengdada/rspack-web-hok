<template>
  <div class="ranking-data">
    <MTitle>排名</MTitle>
    <div class="ranking-header">
      <div class="choose-con">
        <span :class="chooseType === 0?'active-span':''" @click="changeType(0)">营收</span>
        <span :class="chooseType === 1?'active-span':''" @click="changeType(1)">退款</span>
        <span :class="chooseType === 2?'active-span':''" @click="changeType(2)">GMV</span>
      </div>
      <div class="right-choose">
        <el-radio-group v-model="proportionType" v-removeAriaHidden @change="changeProportionType">
          <el-radio :label="1">环比</el-radio>
          <el-radio :label="2">同比</el-radio>
        </el-radio-group>
        <span class="sort-span">排序</span>
        <el-select v-model="sortValue" size="mini" placeholder="请选择" @change="changeSortValue">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="echart-data">
      <revenueChart v-if="chooseType === 0" ref="revenueChart" @changeDetailStatus="changeDetailStatus" />
      <refundChart v-if="chooseType === 1" ref="refundChart" @changeDetailStatus="changeDetailStatus" />
      <gmvChart v-if="chooseType === 2" ref="gmvChart" @changeDetailStatus="changeDetailStatus" />
    </div>
  </div>
</template>

<script>
import revenueChart from './revenueChart.vue'
import refundChart from './refundChart.vue'
import gmvChart from './gmvChart.vue'
export default {
  components: {
    revenueChart,
    refundChart,
    gmvChart
  },
  props: {
  },
  data() {
    return {
      form: {
      },
      chooseType: 0,
      proportionType: 1,
      sortValue: 1,
      options: [{
        value: 1,
        label: '从高到低'
      }, {
        value: 2,
        label: '从低到高'
      }]
    }
  },
  mounted() {
  },
  methods: {
    changeProportionType() {
      this.form.comparisonWay = this.proportionType
      this.searchData()
    },
    changeSortValue() {
      this.form.sortBy = this.sortValue
      this.searchData()
    },
    init(data) {
      this.form = { ...data }
      this.form.comparisonWay = this.proportionType
      this.form.sortBy = this.sortValue
      this.searchData()
    },
    changeType(type) {
      this.chooseType = type
      this.searchData()
    },
    searchData() {
      if (this.chooseType === 0) {
        this.$nextTick(() => {
          this.$refs.revenueChart.init(this.form)
        })
      } else if (this.chooseType === 1) {
        this.$nextTick(() => {
          this.$refs.refundChart.init(this.form)
        })
      } else if (this.chooseType === 2) {
        this.$nextTick(() => {
          this.$refs.gmvChart.init(this.form)
        })
      }
    },
    changeDetailStatus(type, obj) {
      this.$emit('changeDetailStatus', type, obj, this.chooseType)
    }
  }
}
</script>

<style lang='scss' scoped>
.ranking-data {
    width: 100%;
    min-height: 500px;
}
.ranking-header {
    width: 100%;
    height: 32px;
    margin-top: 18px;
}
.choose-con {
    float: left;
    width: 245px;
    height: 32px;
    background: #F7F7F7;
    border-radius: 4px;
    span {
        width: 80px;
        height: 26px;
        text-align: center;
        color: #333;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        line-height: 26px;
        font-style: normal;
        font-weight: 400;
        float: left;
        margin-top: 3px;
        margin-left: 1px;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #F7F7F7;
    }
    .active-span {
        background: linear-gradient(90deg, #CEE2FF 0%, #BCC9FF 100%);
        color: #000;
        font-weight: bold;
    }

}
.right-choose {
    float: right;
    .sort-span {
        color: #000;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
        margin-left: 30px;
        margin-right: 12px;
    }
    ::v-deep .el-radio__label {
      color: #000!important;
    }
}

.echart-data {
    width: 100%;
    height: 450px;
}
</style>

