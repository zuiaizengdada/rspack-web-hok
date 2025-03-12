<template>
  <div class="kanbanlist" :class="{active: active}" @click="onhandleClick">
    <div class="line" :style="{backgroundColor: lineColor}" />
    <div v-if="active" class="check">
      <svg-icon icon-class="selectCheck" class-name="check-icon" />
    </div>
    <div class="kanbanlistTitle">
      {{ title }}
      <el-tooltip class="item" effect="dark" content="未发送成功和发送成功未到达" placement="top-start">
        <svg-icon v-if="title === '总发送失败条数'" icon-class="tips" class="titleIcon" style="stroke:currentColor" />
      </el-tooltip>
    </div>
    <div class="kanbanlistNumber">
      <i v-if="loading" class="el-icon-loading statisticsLoading" />
      <template v-else>{{ sumData | filtersMoney }}</template>
    </div>
    <div class="footer">
      <div class="footerView">
        <span class="footerViewText">环比上期</span>
        <span>
          <i :class="cssFullClass(linkRelativeRatio)" />
          <em class="footerViewValue">
            <i v-if="loading" class="el-icon-loading statisticsLoading" />
            <template v-else>{{ linkRelativeRatio }}%</template>
          </em>
        </span>
      </div>
      <div class="footerView">
        <span class="footerViewText">同比上期</span>
        <span>
          <i :class="cssFullClass(yearBasisRatio)" />
          <em class="footerViewValue">
            <i v-if="loading" class="el-icon-loading statisticsLoading" />
            <template v-else>{{ yearBasisRatio }}%</template>
          </em>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  components: {},
  filters: {
    // 金额处理：分转元 并添加，分割，以及取小数点后两位
    filtersMoney(money) {
      return parseFloat(BigNumber(Math.abs(+money || 0)))
        .toFixed(2)
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('').replace(/(\.00)$/, '')
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    lineColor: {
      type: String,
      default: '#FF5962'
    },
    // 同比上期
    yearBasisRatio: {
      type: [String, Number],
      default: ''
    },
    // 环比上期
    linkRelativeRatio: {
      type: [String, Number],
      default: ''
    },
    sumData: {
      type: [String, Number],
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    cssFullClass(val) {
      if (val < 0) {
        return 'start-red-p c_F53F3F'
      } else if (val > 0) {
        return 'start-green-p c_00B42A'
      } else {
        return ''
      }
    },
    onhandleClick() {
      this.$emit('onClick')
    }
  }
}
</script>

<style lang='scss' scoped>
.kanbanlist {
    background: #FAFAFA;
    border-radius: 8px;
    border: 1px solid #FAFAFA;
    position: relative;
    padding: 16px 16px 19px;
    cursor: pointer;
    overflow: hidden;
    .line {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 106px;
        background: #0C6FFF;
        border-radius: 0px 100px 100px 0px;
    }
    .check {
      position: absolute;
      right: 0;
      top: 0;
      width: 24px;
      height: 24px;
    }
    .check-icon {
      width: 24px;
      height: 24px;
      position: absolute;
      top: -1px;
      right: -1px;
    }
    .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .footerView {
            display: flex;
            align-items: center;
            margin-right: 16px;
            min-width: 200px;
            .footerViewText {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #777777;
                line-height: 22px;
                margin-right: 8px;
            }
            .footerViewValue {
                font-style: normal;
                font-size: 18px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #161616;
                line-height: 26px;
            }
        }
    }
    .kanbanlistTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
    }
    .kanbanlistNumber {
      font-size: 28px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      line-height: 40px;
      margin: 8px 0 9px;
      .statisticsLoading {
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
}
.active {
  border: 1px solid #0C6FFF;
  background: #F2F9FF;
}
</style>
