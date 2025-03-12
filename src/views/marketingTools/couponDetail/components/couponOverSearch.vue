<template>
  <div class="headerSelect">
    <div class="top-cls">
      <div class="data-search">
        <span class="left-title"><i />{{ title }}</span>
        <div class="right-search">
          <AppDatepicker
            ref="AppDatepicker"
            style="width: 558px"
            :show="[0,7, 'month','year']"
            :default="searchActive"
            :search="search.time"
            :picker-options="pickerOptions"
            @change="timeChange"
            @blur="currentTime = ''"
          />
        </div>
      </div>
    </div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <el-form-item label="优惠券信息">
        <el-input v-model.trim="form.orderValue" placeholder="请输入内容" class="input-with-input" clearable>
          <el-select slot="prepend" v-model="form.orderLabel" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-select v-model="form.type" clearable placeholder="请选择">
          <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="col-submit-btn" size="small" @click="onSubmit">查询</el-button>
        <el-button size="small" @click="resetFormForSearch()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import moment from 'moment'
export default {
  components: {
    AppDatepicker
    // barCharts
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    search: {
      type: Object,
      default: () => {
        return { time: { active: '', time: ['', ''] }, current: 0 }
      }
    }
  },
  data() {
    return {
      searchActive: 0,
      orderStatus: [
        { label: '全部', value: '' },
        { label: '商品券', value: 1 },
        { label: '直播专享券', value: 3 }
      ],
      options: [
        { label: '优惠券名称', value: 'couponName' },
        { label: '优惠券ID', value: 'couponId' }
      ],
      form: {
        type: '',
        dataType: 1,
        orderLabel: 'couponName',
        orderValue: '',
        startTime: '',
        endTime: ''
      },
      currentTime: '',
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
        }
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    timeChange(val) {
      this.search.time = val
      if (val.active === 0) {
        this.form.dataType = 1
      } else if (val.active === 7) {
        this.form.dataType = 2
      } else if (val.active === 'month') {
        this.form.dataType = 3
      } else if (val.active === 'year') {
        this.form.dataType = 4
      } else {
        this.form.dataType = ''
      }
      this.form.startTime = val.time[0]
      this.form.endTime = val.time[1]
      this.$emit('submit', this.form)
    },
    resetFormForSearch() {
      this.searchActive = 0
      this.form = {
        type: '',
        orderLabel: 'couponName',
        orderValue: ''
      }
      this.$refs.AppDatepicker.handClick(0)
      // this.$emit('resetForm', this.form)
    },
    onSubmit() {
      this.$emit('submit', this.form, this.goodsInfo)
    }
  }
}
</script>
  <style lang="scss" scoped>
  .headerSelect {
    //margin-top: 16px;
  }
  .top-cls{
    margin-bottom: 16px;
  }
  .input-box{
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
  .input-box,.input-box1 {
    width: 196px;
    height: 32px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    cursor: pointer;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #DCDFE6;
  }
  .input-box1{
    overflow: hidden;
    text-align: center;
  }
  .data-search {
    width: 100%;
    .updata-time{
      margin-left: 16px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
    .left-title {
      width: 100px;
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      font-family: '微软雅黑';
      i {
        width: 4px;
        height: 24px;
        margin-top: 3px;
        float: left;
        background: #0c6fff;
        border-radius: 8px;
      }
    }
    .right-search {
      float: right;
      height: 30px;
      .date-choose {
        margin-left: 10px;
        position: relative;
        .data_icon {
          position: absolute;
          top: 11px;
          right: 10px;
          z-index: 9;
          color: #c0c4cc;
          font-size: 14px;
          transform: translateY(-50%);
        }
        ::v-deep .el-range__close-icon {
          position: absolute;
          right: 10px;
          top: 11px;
          transform: translateY(-50%);
        }
      }
    }
  }
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
  </style>

