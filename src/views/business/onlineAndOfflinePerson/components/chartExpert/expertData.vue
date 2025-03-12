<template>
  <div class="wrapper-online-expert-data">
    <MTitle class="expert-mtitle" title="达人数据" />
    <expertTable
      ref="zbExpertTable"
      :columns="formExpertData.chooseType === 1?columns:columnsOffline"
      :get-list="getList"
      :choose-type="chooseType"
      :form-for-list="formExpertData"
      :hb-line="6"
      :is-pages="false"
    >
      <template v-slot:expertName="{scope}">
        <img class="img-cls" :src="scope.row.channelAppImg" />
        <span class="span-cls">{{ scope.row.expertName }}</span>
      </template>
      <template v-slot:freeAmount="{scope}">
        <p>{{ filterPrice(scope.row.freeAmount) }}</p>
        <p class="scope-em"> ({{ scope.row.freeOrderCount }}单) </p>
      </template>
      <template v-slot:freePerformance="{scope}">
        <p>{{ filterPrice(scope.row.freePerformance) }}</p>
        <p class="scope-em"> ({{ scope.row.freeOrderCount }}单) </p>
      </template>
      <template v-slot:directAmount="{scope}">
        <p>
          {{ filterPrice(scope.row.directAmount) }}

        </p>
        <p class="scope-em"> ({{ scope.row.directOrderCount }}单) </p>
      </template>
      <template v-slot:indirectAmount="{scope}">
        <p>
          {{ filterPrice(scope.row.indirectAmount) }}

        </p>
        <p class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </p>
      </template>
      <template v-slot:totalAmount="{scope}">
        <div :class="(formExpertData.bizTypeActive !== 2 && formExpertData.bizTypeActive !== 3)?'blue-cls':''">
          <p>
            {{ filterPrice(scope.row.totalAmount) }}
          </p>
          <p class="scope-em"> ({{ scope.row.orderCount }}单) </p>
        </div>
      </template>
      <template v-slot:totalPerformance="{scope}">
        <div :class="(formExpertData.bizTypeActive !== 2 && formExpertData.bizTypeActive !== 3)?'blue-cls':''">
          <p>
            {{ filterPrice(scope.row.totalPerformance) }}

          </p>
          <p class="scope-em"> ({{ scope.row.orderCount }}单) </p>
        </div>
      </template>
      <template v-slot:refundAmount="{scope}">
        <div :class="formExpertData.bizTypeActive === 2?'blue-cls':''">
          <p>
            {{ filterPrice(scope.row.refundAmount) }}

          </p>
          <p class="scope-em"> ({{ scope.row.refundOrderCount }}单) </p>
        </div>
      </template>
      <template v-slot:refundRate="{scope}">
        <span>
          {{ scope.row.refundRate>1000?'1000%+':scope.row.refundRate+'%' }}
        </span>
      </template>
      <template v-slot:gmv="{scope}">
        <div :class="formExpertData.bizTypeActive === 3?'blue-cls':''">
          <span>
            {{ filterPrice(scope.row.gmv) }}
          </span>
        </div>
      </template>
      <template v-slot:currentMonthAmount="{scope}">
        <span>
          {{ filterPrice(scope.row.currentMonthAmount) }}
        </span>
      </template>
      <template v-slot:lastMonthAmount="{scope}">
        <span>
          {{ filterPrice(scope.row.lastMonthAmount) }}
        </span>
      </template>
      <template v-slot:growthPercent="{scope}">
        <span>
          {{ scope.row.growthPercent > 1000 ?'1000%+':scope.row.growthPercent+'%' }}
        </span>
      </template>
      <template v-slot:currentMonthPerformance="{scope}">
        <span>
          {{ filterPrice(scope.row.currentMonthPerformance) }}
        </span>
      </template>
      <template v-slot:linkMonthPerformance="{scope}">
        <span>
          {{ filterPrice(scope.row.linkMonthPerformance) }}
        </span>
      </template>
      <template v-slot:linkRatio="{scope}">
        <span>
          {{ scope.row.linkRatio > 1000 ?'1000%+':scope.row.linkRatio+'%' }}
        </span>
      </template>
    </experttable>
  </div>
</template>

<script>
import expertTable from './table.vue'
import { columns, columnsOffline } from './chartExpertJs'
import { filterPrice } from '@/utils'
import { getExpertLandscapeForPerson, getDailyPerformanceExpert } from '@/api/business/onlineAndOffline'
export default {
  components: {
    expertTable
  },
  data() {
    return {
      columns,
      columnsOffline,
      formExpertData: {},
      chooseType: 1
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    filterPrice,
    init(item) {
      this.formExpertData = item
      this.chooseType = item.chooseType
      this.$nextTick(() => {
        this.$refs.zbExpertTable.init()
        this.panduanHasData()
      })
    },
    panduanHasData() {
      const params = this.returnParams()
      if (this.formExpertData.chooseType === 1) {
        getExpertLandscapeForPerson(params).then(res => {
          if (res.code === 1 && res.data.length === 0) {
            this.$emit('changeHasDarenData', false)
          } else {
            this.$emit('changeHasDarenData', true)
          }
        })
      } else if (this.formExpertData.chooseType === 2) {
        getDailyPerformanceExpert(params).then(res => {
          if (res.code === 1 && res.data.length === 0) {
            this.$emit('changeHasDarenData', false)
          } else {
            this.$emit('changeHasDarenData', true)
          }
        })
      }
    },
    returnParams() {
      const params = {}
      const item = this.formExpertData
      params.bizType = item.bizTypeActive
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]
      return params
    },
    getList() {
      const params = this.returnParams()
      if (this.formExpertData.chooseType === 1) {
        return getExpertLandscapeForPerson(params)
      } else if (this.formExpertData.chooseType === 2) {
        return getDailyPerformanceExpert(params)
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-expert-data {
      width: 100%;
      padding: 20px;
      display: inline-block;
      border-radius: 10px;
      .expert-mtitle {
        margin-bottom: 20px;
      }
  }
  .img-cls {
    float: left;
    width: 30px;
    margin-right: 10px;
  }

  .span-cls {
    line-height: 30px;
    width: 155px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    float: left;
  }

  .scope-em {
    font-style: normal;
  }
  .blue-cls {
    color: #0091FF;
    cursor: pointer;
  }

  .active-cls {
    color: #0091ff;
  }
  .blue-cls {
    color: #0091ff;
  }
  </style>
