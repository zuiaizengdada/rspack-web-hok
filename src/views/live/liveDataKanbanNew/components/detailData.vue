<template>
  <div class="ranking-data">
    <div class="ranking-data-h">
      <MTitle>排名</MTitle>
      <span @click="toBack">返回</span>
    </div>
    <div class="ranking-header">
      <div class="choose-con">
        <span :class="chooseType === 0?'active-span':''" @click="changeType(0)">营收</span>
        <span :class="chooseType === 1?'active-span':''" @click="changeType(1)">退款</span>
        <span :class="chooseType === 2?'active-span':''" @click="changeType(2)">GMV</span>
      </div>
      <div class="right-choose">
        <el-radio-group v-model="detailDataRadio" v-removeAriaHidden @change="changeProportionType">
          <el-radio :label="1">环比</el-radio>
          <el-radio :label="2">同比</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="echart-data">
      <detailChart ref="detailCharts" :choose-type="chooseType" />
    </div>
    <div class="data-for-table">
      <dataTableRevenue v-if="chooseType === 0" ref="dataTableRevenue" :teacher-id="form.userId" />
      <dataTableRefund v-if="chooseType === 1" ref="dataTableRefund" :teacher-id="form.userId" />
      <dataTableGmv v-if="chooseType === 2" ref="dataTableGmv" :teacher-id="form.userId" />
    </div>
  </div>
</template>

<script>
import detailChart from './detailChart.vue'
import dataTableRevenue from './dataTableRevenue.vue'
import dataTableRefund from './dataTableRefund.vue'
import dataTableGmv from './dataTableGmv.vue'
export default {
  components: {
    detailChart,
    dataTableRevenue,
    dataTableRefund,
    dataTableGmv
  },
  props: {
  },
  data() {
    return {
      chooseType: 0,
      detailDataRadio: 1,
      form: {}
    }
  },
  mounted() {},
  methods: {
    changeProportionType() {
      this.form.comparisonWay = this.detailDataRadio
      this.$nextTick(() => {
        this.$refs.detailCharts.init(this.form)
      })
      // this.searchFn()
    },
    init(data, obj, chooseType) {
      this.form = { ...data }
      this.form.comparisonWay = this.detailDataRadio
      this.form.userName = obj.teacherName
      this.form.userId = obj?.teacherId
      this.changeType(chooseType)
      this.$nextTick(() => {
        this.$refs.detailCharts.init(this.form)
      })
    },
    searchFn() {
      if (this.chooseType === 0) {
        this.$nextTick(() => {
          this.$refs.dataTableRevenue.init(this.form)
        })
      } else if (this.chooseType === 1) {
        this.$nextTick(() => {
          this.$refs.dataTableRefund.init(this.form)
        })
      } else if (this.chooseType === 2) {
        this.$nextTick(() => {
          this.$refs.dataTableGmv.init(this.form)
        })
      }
    },
    toBack() {
      this.$emit('changeDetailStatus', true)
    },
    changeType(num) {
      this.chooseType = num
      setTimeout(() => {
        if (this.chooseType === 0) {
          this.$refs.dataTableRevenue.init(this.form)
        } else if (this.chooseType === 1) {
          this.$refs.dataTableRefund.init(this.form)
        } else if (this.chooseType === 2) {
          this.$refs.dataTableGmv.init(this.form)
        }
        this.$refs.detailCharts.init(this.form)
      }, 300)
    }
  }
}
</script>

  <style lang='scss' scoped>
  .ranking-data {
      width: 100%;
      min-height: 500px;
  }
  .ranking-data-h {
    width: 100%;
    height: 40px;
    position: relative;
    span {
        position: absolute;
        width: 60px;
        height: 32px;
        right: 0;
        top: 0;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        color: '#CBCFD3';
        border: 1px solid #CBCFD3;
        cursor: pointer;
        border-radius: 3px;
    }
  }
  .ranking-header {
    width: 100%;
    height: 32px;
    margin-top: 3px;
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
.echart-data {
    width: 100%;
    height: 470px;
}
.data-for-table {
    width: 100%;
    padding-bottom: 20px;
}

  </style>

