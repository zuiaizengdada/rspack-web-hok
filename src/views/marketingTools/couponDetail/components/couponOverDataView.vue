<template>
  <div class="data_show">
    <div class="data_show_row">
      <div class="dsr_block" :class="active === 1?'activeClass':''" @click="changeChooseItem(1)">
        <img v-if="active === 1" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>发放张数</em>
          <el-tooltip class="item" effect="dark" content="券创建时的发放总张数" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ couponData.issueCount }}</p>
        <span class="dsr_span_bottom" :class="couponData.issueCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.issueCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.issueCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 2?'activeClass':''" @click="changeChooseItem(2)">
        <img v-if="active === 2" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>领取张数</em>
          <el-tooltip class="item" effect="dark" content="当前时间段用户领取的张数" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForW(couponData.claimCount) }}</p>
        <span class="dsr_span_bottom" :class="couponData.claimCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.claimCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.claimCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 3?'activeClass':''" @click="changeChooseItem(3)">
        <img v-if="active === 3" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>领取人数</em>
          <el-tooltip class="item" effect="dark" content="当前时间段领取优惠券的人数，按用户去重" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForW(couponData.claimUserCount) }}</p>
        <span class="dsr_span_bottom" :class="couponData.claimUserCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.claimUserCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.claimUserCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 4?'activeClass':''" @click="changeChooseItem(4)">
        <img v-if="active === 4" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>使用张数</em>
          <el-tooltip class="item" effect="dark" content="当前时间段用户使用的张数" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForW(couponData.writeOffCount) }}</p>
        <span class="dsr_span_bottom" :class="couponData.writeOffCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.writeOffCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.writeOffCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
    </div>
    <div class="data_show_row">
      <div class="dsr_block" :class="active === 5?'activeClass':''" @click="changeChooseItem(5)">
        <img v-if="active === 5" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>成交金额</em>
          <el-tooltip class="item" effect="dark" content="当前时间段，使用优惠券带来的业绩总计" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForNumber(couponData.orderAmount/100) }}</p>
        <span class="dsr_span_bottom" :class="couponData.orderAmountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="(couponData.orderAmountRelative/100).toString()" placement="bottom-end">
            <strong>{{ couponData.orderAmountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 6?'activeClass':''" @click="changeChooseItem(6)">
        <img v-if="active === 6" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>成交订单数</em>
          <el-tooltip class="item" effect="dark" content="当前时间段，使用了优惠券的订单总数" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForNumber(couponData.orderCount) }}</p>
        <span class="dsr_span_bottom" :class="couponData.orderCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.orderCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.orderCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 7?'activeClass':''" @click="changeChooseItem(7)">
        <img v-if="active === 7" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>成交人数</em>
          <el-tooltip class="item" effect="dark" content="当前时间段，使用了优惠券的人数" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForNumber(couponData.userCount) }}</p>
        <span class="dsr_span_bottom" :class="couponData.userCountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="couponData.userCountRelative.toString()" placement="bottom-end">
            <strong>{{ couponData.userCountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
      <div class="dsr_block" :class="active === 8?'activeClass':''" @click="changeChooseItem(8)">
        <img v-if="active === 8" class="checkImg" :src="checkImg" alt="" />
        <span class="dsr_span_title">
          <em>券优惠金额</em>
          <el-tooltip class="item" effect="dark" content="当前时间段使用优惠券成交的订单中总优惠金额之和" placement="top">
            <img src="../../../../assets/image/coupon/icn_tips.png" />
          </el-tooltip>
        </span>
        <p class="dsr_nums">{{ formatterForQW(couponData.discountAmount/100) }}</p>
        <span class="dsr_span_bottom" :class="couponData.discountAmountRate < 0?'ds_xy_btn':''">
          <em>{{ title }}</em>
          <el-tooltip class="item" effect="dark" :content="(couponData.discountAmountRelative/100).toString()" placement="bottom-end">
            <strong>{{ couponData.discountAmountRate.toFixed(2) }}%</strong>
          </el-tooltip>
          <i />
        </span>
      </div>
    </div>
    <div class="data-line-echart">
      <lineChart ref="lineChartRef" :active-name="activeName" />
    </div>
  </div>
</template>

<script>
import { couponDataBoard } from '@/api/marketingTools/coupon.js'
import lineChart from '@/views/marketingTools/couponDetail/components/lineChart/index.vue'
import { debounce } from '@/utils'
import checkImg from '@/assets/image/operateData/check.png'
export default {
  name: 'DataShow',
  components: {
    lineChart
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['activeName'],
  data() {
    return {
      checkImg,
      title: '较昨日',
      checked: false,
      couponData: {
        claimCount: 0,
        claimCountRate: 0,
        claimCountRelative: 0,
        claimUserCount: 0,
        claimUserCountRate: 0,
        claimUserCountRelative: 0,
        discountAmount: 0,
        discountAmountRate: 0,
        discountAmountRelative: 0,
        issueCount: 0,
        issueCountRate: 0,
        issueCountRelative: 0,
        orderAmount: 0,
        orderAmountRate: 0,
        orderAmountRelative: 0,
        orderCount: 0,
        orderCountRate: 0,
        orderCountRelative: 0,
        userCount: 0,
        userCountRate: 0,
        userCountRelative: 0,
        writeOffCount: 0,
        writeOffCountRate: 0,
        writeOffCountRelative: 0
      },
      active: 1,
      search: {},
      searchActive: '',
      chart: {},
      chartBing: {},
      titleArray: ['', '新增作品', '新增粉丝', '新增播放', '新增点赞', '新增评论', '新增分享', '新增订单', '新增免费订单', '新增付费订单', '新增GMV', '新增免费GMV', '新增付费GMV']
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        // this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  created() {
  },
  methods: {
    changeChooseItem(num) {
      this.active = num
      const params = {
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        type: this.search.type,
        dateType: this.search.dataType
      }
      if (this.search.orderValue !== '') {
        params.couponVal = this.search.orderValue
        if (this.search.orderLabel === 'couponName') {
          params.couponType = 1
        } else {
          params.couponType = 2
        }
      }
      params.dataType = this.active
      this.$refs.lineChartRef.initData(params)
    },

    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    formatterForNumber(num) {
      return String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    },
    formatterForW(num) {
      let numReturn = ''
      if (num > 10000) {
        const nums = (num / 10000).toFixed(2) + ''
        const numStr = nums.substring(nums.indexOf('.'), nums.length)
        numReturn = this.formatterForNumber(parseInt(num / 10000)) + numStr + 'w'
        return numReturn
      } else {
        numReturn = this.formatterForNumber(num)
        return numReturn
      }
    },
    formatterForQW(num) {
      let numReturn = ''
      if (num > 10000000) {
        const nums = (num / 10000).toFixed(2) + ''
        const numStr = nums.substring(nums.indexOf('.'), nums.length)
        numReturn = this.formatterForNumber(parseInt(num / 10000)) + numStr + 'w'
        return numReturn
      } else {
        numReturn = this.formatterForNumber(num)
        return numReturn
      }
    },
    formatterForBFB(num) {
      let nums = Math.abs(num)
      nums = (nums * 100).toFixed(2)
      return nums
    },
    loadData(search) {
      this.search = { ...search }
      this.searchActive = search.active
      const params = {
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        type: this.search.type,
        dateType: this.search.dataType
      }
      if (this.search.dataType === 1) {
        this.title = '较昨日'
      } else if (this.search.dataType === 2) {
        this.title = '对比前7天'
      } else if (this.search.dataType === 3) {
        this.title = '对比上月'
      } else if (this.search.dataType === 4) {
        this.title = '对比去年'
      } else {
        this.title = '对比上周期'
      }
      if (this.search.orderValue !== '') {
        params.couponVal = this.search.orderValue
        if (this.search.orderLabel === 'couponName') {
          params.couponType = 1
        } else {
          params.couponType = 2
        }
      }
      couponDataBoard(params).then(res => {
        if (res.code === 1) {
          this.couponData = { ...res.data }
        }
      })
      const paramsForLine = {
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        type: this.search.type,
        dateType: this.search.dataType,
        dataType: this.active
      }
      if (this.search.orderValue !== '') {
        params.couponVal = this.search.orderValue
        if (this.search.orderLabel === 'couponName') {
          params.couponType = 1
        } else {
          params.couponType = 2
        }
      }
      this.$refs.lineChartRef.initData(paramsForLine)
    }
  }
}
</script>

  <style scoped lang="scss">
  .data_show {
      width: 100%;
      padding-bottom: 5px;
      overflow-x: auto;
      overflow-y: hidden;
      .data_contrast{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
      }
      .qoq{
        display: flex;
        align-items: center;
        // position: absolute;
        // z-index: 999;
        // left: 20px;
        // top: 50px;
        img{
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
      .data_show_row {
          width: calc(100% + 20px);
          margin-top: 20px;
          margin-left: -20px;
          display: flex;
          justify-content: space-between;
          .dsr_block {
              position: relative;
              width: 100%;
              min-width: 240px;
              max-width: 350px;
              margin-left: 20px;
              padding: 20px;
              background: #FAFAFA;
              border: 1px solid #FAFAFA;
              cursor: pointer;
              border-radius: 8px;
              .dsr_span_title {
                  width: 100%;
                  font-size: 14px;
                  color: #777;
                  em {
                    font-style: normal;
                    float: left;
                  }
                  img {
                    width: 16px;
                    height: 16px;
                    float: left;
                    margin-left: 4px;
                    margin-top: 3px;
                  }
              }
              .dsr_nums {
                  float: left;
                  word-break: break-word;
                  font-size: 32px;
                  width: 100%;
                  font-family: 'DINAlternate-Bold, DINAlternate';
                  font-weight: bold;
                  color: #161616;
              }
              .dsr_span_bottom {
                  width: 100%;
                  margin-top: 5px;
                  display: inline-block;
                  em {
                      font-size: 14px;
                      color: #777;
                      font-style: normal;
                      float: left;
                      line-height: 20px;
                  }
                  i {
                      width: 14px;
                      height: 14px;
                      background-image: url(../../../../assets/image/product/up.png);
                      background-size: 100%;
                      margin-left: 8px;
                      margin-right: 5px;
                      margin-top: 3px;
                      float: right;
                  }
                  strong {
                      float: right;
                      line-height: 20px;
                      font-size: 18px;
                      color: #161616;
                      font-family: 'DINAlternate-Bold, DINAlternate';
                      font-weight: 400;
                  }
              }
              .ds_xy_btn {
                i {
                  background-image: url(../../../../assets/image/product/down.png);
                  background-size: 100%;
                }
              }
          }
          .activeClass {
            border: 1px solid #0C6FFF;
            background: #F2F9FF;
          }
      }
  }

  .data-line-echart {
    width: 100%;
    min-width: 1100px;
    margin-top: 20px;
    height: 390px;
    .data-line-echart-span {
      height: 40px;
      width: 100%;
      line-height: 40px;
      font-size: 16px;
      color: #333;
    }
    .data-line-show {
      width: 100%;
      height: 325px;
    }
  }

  .checkImg {
    position: absolute;
    width: 18px;
    height: 18px;
    right: 0px;
    top: 0px;
  }
  </style>

