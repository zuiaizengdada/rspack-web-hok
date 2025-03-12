<template>
  <div class="courseDeliveryCost">
    <div class="tableBox">
      <el-table :data="tableColumn" :header-cell-style="{ background: '#F3F3F3' }">
        <el-table-column prop="label" label="成本名称" align="center" />
        <el-table-column prop="value" label="成本金额" align="center">
          <template slot-scope="{ row }">
            ￥{{ row.value | filtersMoneyByZero }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="fileList.length > 0" class="fileView">
      <div class="fileViewText">成本明细</div>
      <div class="fileViewBox">
        <div v-for="(item, index) in fileList" :key="index" class="fileItem">
          <costFileList :name="item.name" :url="item.url" />
        </div>
      </div>
    </div>
    <div class="tableFooter">
      <div class="formView">
        <div class="formViewLabel">最新录入人姓名：</div>
        <div class="formViewValue">{{ form.updateUserName }}</div>
      </div>
      <div class="formView">
        <div class="formViewLabel">最新录入时间：</div>
        <div class="formViewValue">{{ form.updateTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import costFileList from './costFileList.vue'
export default {
  components: {
    costFileList
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          tuitionAmount: '', // 学员学费汇总
          totalCost: '', // 课程交付成本汇总
          expectProfit: '', // 预期利润
          updateTime: '',
          updateUserName: '',
          fileList: []
        }
      }
    },
    tableColumn: {
      type: Array,
      default: () => {
        return [
          { key: 'travelCost', label: '差旅费', value: '' },
          { key: 'siteCost', label: '场地费', value: '' },
          { key: 'conferenceServiceCost', label: '会务服务费', value: '' },
          { key: 'projectMaterialCost', label: '项目物料费', value: '' },
          { key: 'commissionCost', label: '手续费', value: '' },
          { key: 'fixedLaborCost', label: '固定人工费', value: '' },
          { key: 'channelCost', label: '渠道费', value: '' },
          { key: 'teacherSalaryCost', label: '老师课酬费', value: '' },
          { key: 'performanceCommissionCost', label: '业务奖金/提成', value: '' }
        ]
      }
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.courseDeliveryCost {
  .tableBox {
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #E7E7E7;
    border-bottom: none;
    overflow: hidden;
  }
  .fileView {
    padding-top: 20px;
    .fileViewText {
      margin-bottom: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 24px;
    }
    .fileViewBox {
      width: 718px;
      display: flex;
      flex-wrap: wrap;
      .fileItem {
        margin-bottom: 16px;
        &:nth-child(2n + 1) {
          margin-right: 16px;
        }
      }
    }
  }
  .tableFooter {
    margin-top: 20px;
    padding-bottom: 28px;
    display: flex;
    .formView {
      display: flex;
      align-items: center;
      .formViewLabel {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
      }
      .formViewValue {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 24px;
      }
    }
    .formView + .formView {
      margin-left: 32px;
    }
  }
}
::v-deep {
  tbody {
    .el-table__row {
      &:nth-last-child(1) {
        border-radius: 8px;
        border-left: 1px solid #E7E7E7;
        border-right: 1px solid #E7E7E7;
        border-bottom: 1px solid #E7E7E7;
      }
    }
  }
}
</style>
