<template>
  <div class="page_wrap_dataOverView">
    <div class="header_title">
      <div class="title">数据概括</div>
      <span class="tips m-l-20">数据统计时间:{{ createDate }}</span>
    </div>
    <div class="overViewContent">
      <div class="kanbanView">
        <div class="dataView">
          <div class="dataTitle">
            推广员数
            <el-tooltip class="item" effect="dark" content="从开通店铺到数据统计时间内所有推广员数,包含未审核的" placement="right-start">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="dataValue">{{ promoterNum }}</div>
        </div>
      </div>

      <div class="kanbanView">
        <div class="dataView">
          <div class="dataTitle">
            用户绑定数
            <el-tooltip class="item" effect="dark" content="单个推广员名下绑定的推荐用户数之和" placement="right-start">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="dataValue">{{ customerNum }}</div>
        </div>
      </div>

      <div class="kanbanView">
        <div class="dataView">
          <div class="dataTitle">
            推广订单金额
            <el-tooltip class="item" effect="dark" content="只计算已经完成并且未退款成功的订单总金额" placement="right-start">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="dataValue">
            ￥{{ customerTotalPrice }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  prompterStatisics
} from '@/api/promotion/promoter'
export default {
  components: {
  },
  data() {
    return {
      amount: 0,
      customerNum: 0, // 用户绑定数
      customerTotalPrice: 0, // 订单总金额，单位：分
      promoterNum: 0, // 推广员数
      createDate: '' // 数据统计时间
    }
  },
  created() {
    // this.amount = 200
    this.prompterStatisics()
    // this.numFun(0, 100200)
  },
  methods: {
    numFun(startNum, maxNum, key) {
      const duration = 0.5 * 60 // 时长多少秒执行完毕
      var step = ((maxNum - startNum) / duration)// 步长
      var that = this
      let numText = startNum
      let golb // 为了清除requestAnimationFrame
      function numSlideFun() { // 数字动画
        numText += step// 速度的计算可以为小数 。数字越大，滚动越快
        if (numText >= maxNum) {
          numText = maxNum
          cancelAnimationFrame(golb)
        } else {
          golb = requestAnimationFrame(numSlideFun)
        }
        that[key] = numText.toFixed(2)
      }
      numSlideFun() // 调用数字动画
    },
    // 获取推广统计
    prompterStatisics() {
      prompterStatisics().then(res => {
        console.log(res)
        this.customerNum = res.data.customerNum
        this.promoterNum = res.data.promoterNum
        this.createDate = res.data.createDate
        this.numFun(this.customerTotalPrice, res.data.customerTotalPrice / 100, 'customerTotalPrice')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap_dataOverView {
  padding: 20px;
  .header_title {
    display: flex;
    align-items: flex-end;
    .title {
      font-size: 20px;
      font-family: MicrosoftYaHei;
      color: rgba(51, 51, 51, 0.9);
      line-height: 28px;
      position: relative;
      padding-left: 10px;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 5px;
        width: 4px;
        height: 20px;
        background: #0C6FFF;
        border-radius: 3px;
      }
    }
    .tips {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 22px;
    }
  }
  .overViewContent {
    display: flex;
    min-width: 1000px;
    overflow: auto;
    .kanbanView {
      padding: 10px;
      margin-top: 10px;
      flex: 1 0 0;
      .dataView {
        // background: pink;
        .dataTitle {
          align-items: center;
          margin-bottom: 8px;
          color: #999999;
        }
        .dataValue {
          display: inline-block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          margin-bottom: 30px;
          font-weight: bold;
          font-size: 32px;
          -webkit-transition: color 0.3s;
          -o-transition: color 0.3s;
          transition: color 0.3s;
          cursor: pointer;
          color: #333333;
        }
      }
    }
  }
}
</style>
