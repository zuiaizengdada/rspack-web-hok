<template>
  <div class="coupon-data-detail-search">
    <el-form ref="form" v-model="search" class="filter-module" label-width="90px" size="small" :inline="true">
      <el-form-item label="优惠券信息">
        <el-input v-model.trim="search.orderValue" placeholder="请输入内容" class="input-with-input" clearable>
          <el-select slot="prepend" v-model="search.orderLabel" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-select v-model="search.type" clearable placeholder="请选择">
          <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券状态">
        <el-select v-model="search.useStatus" clearable placeholder="请选择">
          <el-option v-for="item in preferentialTypeArray" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间查询">
        <el-date-picker
          v-model="search.orderTimeArray"
          style="width: 362px"
          range-separator="至"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'CouponDetailSearch',
  components: {
  },
  data() {
    return {
      userArray: [],
      orderStatus: [
        { label: '全部', value: '' },
        { label: '商品券', value: 1 },
        { label: '直播专享券', value: 3 }
      ],
      preferentialTypeArray: [
        { label: '全部', value: '' },
        { label: '待开始', value: 1 },
        { label: '生效中', value: 2 },
        { label: '已过期', value: 3 },
        { label: '已作废', value: 4 }
      ],
      options: [
        { label: '优惠券名称', value: 'couponName' },
        { label: '优惠券ID', value: 'couponId' }
      ],
      pickerOptions: {
        disabledDate: (time) => {
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
        }
      },
      couponType: 1,
      search: {
        orderTimeArray: [],
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        useStatus: '',
        couponName: '',
        couponNo: '',
        type: '',
        startTime: '',
        endTime: '',
        orderLabel: 'couponName',
        orderValue: ''
      }
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.search.orderTimeArray = [this.getCurMonthFirstOrLast(0), this.getCurMonthFirstOrLast()]
  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    getCurMonthFirstOrLast(type = 2) {
      const date = new Date()
      const y = date.getFullYear().toString()
      const m = (date.getMonth() + 1).toString().padStart(2, 0)
      const d = (['1', new Date(y, m, 0).getDate(), date.getDate()][type]).toString().padStart(2, 0)
      return [y, m, d].join('-')
    },
    clear() {
      this.search = {
        orderTimeArray: [this.getCurMonthFirstOrLast(0), this.getCurMonthFirstOrLast()],
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        useStatus: '',
        couponName: '',
        couponNo: '',
        type: '',
        startTime: '',
        endTime: '',
        orderLabel: 'couponName',
        orderValue: ''
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .coupon-data-detail-search {
    width: 100%;
    display: inline-block;
    margin-top: 10px;
    border-radius: 10px;
    background-color: #fff;
    .input-with-input {
        width: 308px;
    }
    .input-with-select {
        width: 120px;
        height: 32px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        border-radius: 3px 0px 0px 3px;
    }
  }
  </style>

