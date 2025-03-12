<template>
  <div class="headerSelect">
    <div class="top-cls">
      <div class="data-search">
        <span class="left-title"><i />{{ title }}</span>
        <span class="updata-time">更新时间：{{ newTime }}</span>
        <div class="right-search">
          <AppDatepicker
            ref="AppDatepicker"
            style="width: 558px"
            :show="[0,7, 'month','year']"
            :default="searchActive"
            :search-active="searchActive"
            :search="search.time"
            :picker-options="pickerOptions"
            @change="timeChange"
            @blur="currentTime = ''"
          />
        </div>
      </div>
    </div>
    <el-form ref="form" :inline="true" :model="form" size="small">
      <!--      <el-form-item label="渠道">-->
      <!--        <el-select v-model="form.channelId" clearable @change="updataForm">-->
      <!--          <el-option label="全部" value="" />-->
      <!--          <el-option v-for="(item) in thirdShopDataType" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="订单">-->
      <!--        <el-select v-model="form.orderType" clearable placeholder="请选择" class="input-with-select select-width-200" @change="updataForm">-->
      <!--          <el-option v-for="item in orderType_options" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="老师">
        <TeacherSelect
          ref="teacherSelect"
          :default-tearch-id="form.teacherId"
          :value="form.lecturerName"
          @selected="teacherSelect"
        />
      </el-form-item>
      <el-form-item label="商品">
        <div class="flex-box">
          <div v-if="form.contentName" class="w-296 m-r32">
            <AppSelectMultiple v-model="form.productIdList" :option="goodsInfo" @onClick="selectGoodsPop" @change="selectGoodsPopChange" />
          </div>
          <div v-else class="w-296 m-r32">
            <div
              class="input-box"
              @click="selectGoodsPop"
            >请输入商品名称搜索</div>
            <!-- <input-goods @selectedGoods="
            /> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="价格">
        <el-select v-model="form.productPriceList" clearable multiple @change="updataForm">
          <el-option v-for="(item) in goodsPrices_options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="col-submit-btn" size="small" :loading="showLoading" @click="onSubmit">查询</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import AppDatepicker from '@/components/AppDatePickerForPerson'
import moment from 'moment'
import AppSelectMultiple from '@/components/AppSelectMultiple'

import { mapGetters } from 'vuex'
export default {
  components: {
    TeacherSelect,
    AppDatepicker,
    AppSelectMultiple
    // barCharts
  },
  props: {
    title: {
      type: String,
      default: '企业经营数据'
    },
    search: {
      type: Object,
      default: () => {
        return { time: { active: '', time: ['', ''] }, current: 0 }
      }
    },
    searchActive: {
      type: [String, Number],
      default: 'month'
    },
    newTime: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      goodsInfo: [],
      tabList: [],
      currentTime: '',
      showLoading: false,
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
    ...mapGetters(['thirdShopDataType', 'deptList', 'orderType_options', 'goodsPrices_options'])
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
    // this.$store.dispatch('option/getDeptList')
    this.$store.dispatch('option/goodsPrices')
    if (this.form.goodsInfo) {
      this.goodsInfo = this.form.goodsInfo
    }
  },
  mounted() {

  },
  methods: {
    selectGoodsPopChange(val) {
      this.goodsInfo = this.goodsInfo.reduce((pre, next) => {
        val.includes(next.goodsId) && pre.push(next)
        return pre
      }, [])
      const str = val.reduce((pre, next) => { return (pre = pre + next.contentName) }, '')
      this.form.contentName = str
    },
    loadOverviewData() {
      const timeType = new Map([[0, 1], [7, 2], ['month', 3], ['year', 4]])
      const params = {
        ...this.form,
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1],
        type: timeType.get(this.search.time.active) || 0
      }
      this.$emit('submit', params, this.goodsInfo)
    },
    timeChange(val) {
      this.search.time = val
      this.loadOverviewData()
    },
    resetForm(formName) {
      this.form = {
        deptId: '', // 部门ID
        channelId: '', // 渠道ID
        orderType: '', // 订单类型
        copyDeptId: '',
        productIdList: [], // 商品id
        productPriceList: [], // 价格
        teacherId: '', // ip老师ID
        contentName: '',
        lecturerName: ''
      }
      this.goodsInfo = []
      this.$refs.AppDatepicker.timeChange()
      // this.$emit('resetForm', this.form)
    },
    selectGoodsPop() {
      this.$SelectGoods({
        visible: true,
        multiple: true,
        defaultValue: this.form.productIdList,
        goodsInfo: this.goodsInfo,
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' }
        ],
        tearchSearch: false,
        currentId: '3',
        success: (res) => {
          this.handleSelectGoods(res)
        }
      })
    },
    handleSelectGoods(item) {
      this.goodsInfo = item
      const goodsId = []
      const contentNameList = []
      item.map((ele) => {
        goodsId.push(ele.goodsId)
        contentNameList.push(ele.contentName)
      })
      // this.$refs['form'].clearValidate(['productId'])
      this.form.productIdList = goodsId
      this.form.contentName = contentNameList.join(',')
      this.$emit('updataForm', this.form)
    },
    teacherSelect(val) {
      this.form.teacherId = val.lecturerId
      this.form.lecturerName = val.lecturerName
      this.$emit('updataForm', this.form)
    },
    onSubmit() {
      this.showLoading = true
      const that = this
      setTimeout(() => {
        that.showLoading = false
      }, 2000)
      this.$emit('submit', this.form, this.goodsInfo)
    },
    // 更新form数据
    updataForm() {
      this.$emit('updataForm', this.form)
    },
    // 筛选栏的类型切换
    courceChange(item) {
      this.courceItem = item
      console.log('筛选栏改变')
      // this.getlineCharts(item)
      // this.getBarCharts()
    },
    getTabList() {

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
</style>
