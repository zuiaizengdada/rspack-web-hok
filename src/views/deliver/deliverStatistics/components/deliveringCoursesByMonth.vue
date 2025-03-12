<template>
  <div class="deliveringCoursesByMonth">
    <div class="title">
      <div><MTitle>交付课程月度汇总</MTitle></div>

      <AppDatepickerMonth
        ref="AppDatepickerMonth"
        style="width: 380px"
        :show="[12]"
        :default="12"
        :search="search.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
    </div>
    <div class="search">
      <div>
        <el-form :inline="true" :model="form" size="small">
          <el-form-item label="IP">
            <TeacherSelect
              ref="teacherSelect"
              :default-tearch-id="form.tearch.lecturerId"
              :value="form.tearch.lecturerName"
              @selected="teacherSelect"
            />
          </el-form-item>
          <el-form-item label="交付形式">
            <m-select v-model="form.deliveryType" dict-key="DELIVERY_SHAPE" @change="handleDeliveryType" />
          </el-form-item>
          <el-form-item label="课程名称">
            <courseSelect
              ref="CourseSelect"
              :lecturer-id="form.tearch.lecturerId"
              style="width: 200px"
              :multiple="true"
              :tab-list="tabList"
              :current-id="tabList[0].id"
              :default-id="form.goodsId"
              :value="form.goodsName"
              @selected="courseSelect"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="clear()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div><el-button v-permission="['web:deliveringCourses:excel', permsList]" :loading="exportLoading" size="small" class="btn_primary" @click="exportExcel">导出汇总报表</el-button></div>
    </div>
    <boundaryGapCharts ref="boundaryGapCharts" v-model="type" :deliver-type="form.deliveryType" @change="onhandleTypeChange" />
  </div>
</template>

<script>
import boundaryGapCharts from './boundaryGapCharts.vue'
import AppDatepickerMonth from '@/components/AppDatePicker/month.vue'
import { mapGetters } from 'vuex'
import {
  deliveryMonthRecruitRank,
  deliveryMonthDeliveryFeeRank,
  deliveryMonthHokFeeRank,
  deliveryMonthCostRank,
  deliveryMonthExpectProfitRank,
  deliveryMonthRefundFeeRank,
  deliveryMonthExport
} from '@/api/deliver/deliverStatistics'
import TeacherSelect from '../../components/tearchSelect.vue'
import courseSelect from '../../components/courseSelect.vue'
import BigNumber from 'bignumber.js'
import moment from 'moment'
export default {
  components: {
    boundaryGapCharts,
    AppDatepickerMonth,
    courseSelect,
    TeacherSelect
  },
  data() {
    return {
      form: {
        tearch: { lecturerName: '', lecturerId: '' },
        goodsName: [],
        goodsId: [],
        goods: []
      },
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(1, 'years').valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
          console.log(this.currentTime, 'this.currentTime')
        }
      },
      search: {
        time: {
          active: 12,
          time: ['', '']
        },
        current: 12
      },
      type: 1,
      params: {
        deliveryFlag: 1 // 1交付 2导流
      },
      exportLoading: false,
      currentTime: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['dictList']),
    tabList() {
      if (this.form.deliveryType === 1) {
        return [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' }
        ]
      }
      if (this.form.deliveryType === 2) return [{ id: '5', name: '线下课', api: '' }]
      return [
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' }
      ]
    }
  },
  mounted() {},
  methods: {
    // 时间改变触发
    timeChange(val) {
      console.log(val)
      this.search.time = val
      this.getCharts()
    },
    onhandleTypeChange(val) {
      this.type = val
      this.getCharts()
    },
    handleDeliveryType() {
      this.form.goodsId = []
      this.form.goodsName = []
      this.form.goods = []
      if (this.form.deliverType === 1) {
        this.type = 3
      } else {
        this.type = 1
      }
      this.getCharts()
    },
    // 获取图表数据
    getCharts() {
      const apiFn = {
        1: deliveryMonthRecruitRank,
        2: deliveryMonthDeliveryFeeRank,
        3: deliveryMonthHokFeeRank,
        4: deliveryMonthCostRank,
        5: deliveryMonthExpectProfitRank,
        6: deliveryMonthRefundFeeRank
      }
      const params = {
        lecturerId: this.form.tearch.lecturerId,
        goodsIdList: this.form.goodsId.join(','),
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1],
        deliveryType: this.form.deliveryType
      }
      this.loading = true
      apiFn[this.type](params).then(res => {
        const xData = []
        const yData = []
        if (res && res.data) {
          res.data.map(v => {
            xData.push(v.dateTime)
            yData.push(Number(new BigNumber(v.sumData).div(100).toString()))
          })
        }
        this.$refs.boundaryGapCharts && this.$refs.boundaryGapCharts.setOptions({ xData, yData })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    courseSelect(val = [], keyList) {
      // 选中的为空
      if (!keyList.length) {
        this.form.goodsId = []
        this.form.goodsName = []
        this.form.goods = []
        this.getCharts()
        return
      }

      // 存在选中状态
      // 合并过滤
      const newVal = [...val, ...this.form.goods]
      const copyVal = newVal.reduce((prev, cur) => {
        const bol = prev.some(item => item.goodsId === cur.goodsId)
        if (bol) return [...prev]
        return [...prev, cur]
      }, [])
      const list = copyVal.filter(item => keyList.includes(item.goodsId))
      this.form.goodsId = list.map(item => item.goodsId)
      this.form.goodsName = list.map(item => item.contentName || item.goodsName)
      this.form.goods = list.map(item => ({ goodsId: item.goodsId, goodsName: item.contentName || item.goodsName }))
      this.getCharts()
    },
    teacherSelect(val) {
      this.form.tearch.lecturerId = val.lecturerId
      this.form.tearch.lecturerName = val.lecturerName
      this.getCharts()
    },
    // 点击导出按钮
    exportExcel() {
      this.exportLoading = true
      const params = {
        lecturerId: this.form.tearch.lecturerId,
        goodsId: this.form.goodsId,
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1]
      }
      deliveryMonthExport(params).then(res => {
        console.log(res)
        var newWin = window.open('loading page', '_self')
        newWin.location.href = res.data // 成功 重定向到目标页面
        this.exportLoading = false
      }).catch(() => {
        this.exportLoading = false
      })
    },
    // 点击重置按钮
    clear() {
      this.form = {
        tearch: { lecturerName: '', lecturerId: '' },
        goodsName: [],
        goodsId: []
      }
      this.search = {
        time: {
          active: 12,
          time: ['', '']
        },
        current: 12
      }
      this.type = 1
      this.$refs.AppDatepickerMonth.timeChange()
    }
  }
}
</script>

<style lang='scss' scoped>
.deliveringCoursesByMonth {
  padding: 0 20px 20px 20px;
  .title {
    padding-bottom: 24px;
    border-bottom: 1px solid #E0E0E0;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .search {
    display: flex;
    justify-content: space-between;
  }
}
</style>
