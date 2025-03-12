<template>
  <div class="container">
    <div class="live-type relative">
      <el-radio
        v-model="feesType"
        :label="1"
        :disabled="type === 'copy'"
        @input="handleInputFessType"
      >
        免费
      </el-radio>
      <el-radio
        v-model="feesType"
        :label="2"
        :disabled="type === 'copy'"
        @input="handleInputFessType"
      >
        付费
      </el-radio>
      <el-tooltip
        effect="dark"
        placement="right"
        style="position: absolute; top: -2px; left: 140px"
      >
        <div slot="content" style="line-height: 1.4">
          免费类型，所有用户可进入<br />付费类型只有购买课程的用户<br />可进入
        </div>
        <span style="padding: 2px"><i class="el-icon-question" /></span>
      </el-tooltip>
    </div>
    <p class="tips" style="color: #f53f3f">
      注：请谨慎选择直播类型，一旦开播不可修改。
    </p>
    <div v-show="feesType == 2">
      <el-button
        type="primary"
        style="margin-bottom: 10px"
        :disabled="type === 'copy'"
        @click="handleClickLiveTypeChoiceProduct"
      >
        选择商品
      </el-button>
      <goods-list
        v-show="visibleGoodsList"
        :data="selectGoods"
        style="width: 600px"
        :type="type"
        @delete="handleDeleteGoods"
      />
      <el-form-item
        v-show="checkGoodsList.length && type === 'create'"
        label="商品订单支付时间"
        label-width="140px"
        style="margin-top: 14px"
      >
        <el-date-picker
          v-model="paymentTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="handleChangePaymentTime"
        />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import goodsList from './goodsList.vue'
export default {
  components: {
    goodsList
  },

  props: {
    type: {
      type: String,
      default: 'create'
    }
  },

  data() {
    return {
      feesType: 1,
      selectGoods: [],
      checkGoodsList: [],
      visibleGoodsList: false,
      paymentTime: this.getDefaultDateRange(),
      pickerOptions: {
        shortcuts: [
          {
            text: '近7天',
            onClick(picker) {
              const endDate = new Date()
              const startDate = new Date(endDate)
              startDate.setDate(endDate.getDate() - 7) // 往后7天
              picker.$emit('pick', [startDate, endDate]) // 选择范围为当前日期到往后7天
            }
          },
          {
            text: '近30天',
            onClick(picker) {
              const endDate = new Date()
              const startDate = new Date(endDate)
              startDate.setDate(endDate.getDate() - 30) // 往后30天
              picker.$emit('pick', [startDate, endDate]) // 选择范围为当前日期到往后30天
            }
          },
          {
            text: '近三月',
            onClick(picker) {
              const endDate = new Date()
              const startDate = new Date(endDate)
              startDate.setMonth(endDate.getMonth() - 3) // 往后3个月
              picker.$emit('pick', [startDate, endDate]) // 选择范围为当前日期到往后3个月
            }
          },
          {
            text: '近半年',
            onClick(picker) {
              const endDate = new Date()
              const startDate = new Date(endDate)
              startDate.setMonth(endDate.getMonth() - 6) // 往后6个月
              picker.$emit('pick', [startDate, endDate]) // 选择范围为当前日期到往后6个月
            }
          }
        ]
      }
    }
  },

  methods: {
    getDefaultDateRange() {
      const end = new Date()
      const start = new Date()
      start.setFullYear(end.getFullYear() - 1)
      return [start, end]
    },
    handleClickLiveTypeChoiceProduct() {
      this.$SelectGoods({
        visible: true,
        multiple: true,
        initSearch: {
          tagType: 5
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        // currentId: 'A7',
        showCourseType: true, // 开启标签筛选
        defaultValue: JSON.parse(JSON.stringify(this.checkGoodsList)),
        goodsInfo: JSON.parse(JSON.stringify(this.selectGoods)),
        success: (res, checkList) => {
          this.visibleGoodsList = true
          console.log(res, 'res')
          res.forEach(item => {
            item.payStartTime = moment(this.paymentTime[0]).format('YYYY-MM-DD')
            item.payEndTime = moment(this.paymentTime[1]).format('YYYY-MM-DD')
          })
          this.selectGoods = res
          this.$emit('select', this.selectGoods)
          // checkList.forEach(item)

          this.checkGoodsList = checkList
        }
      })
    },
    handleChangePaymentTime(val) {
      this.selectGoods.forEach(item => {
        item.payStartTime = moment(val[0]).format('YYYY-MM-DD')
        item.payEndTime = moment(val[1]).format('YYYY-MM-DD')
      })
      this.$emit('select', this.selectGoods)
    },
    handleDeleteGoods(list) {
      this.selectGoods = list
      const checkGoodsList = []
      this.selectGoods.forEach(item => {
        checkGoodsList.push(item.goodsId)
      })
      this.checkGoodsList = checkGoodsList
      this.$emit('select', this.selectGoods)
    },
    handleInputFessType(val) {
      this.$emit('change', val)
    }
  }
}
</script>
