<template>
  <div class="dataCource" :class="{current: ifCurrent}" v-on="$listeners">
    <div class="kanban">
      <span>{{ title }}</span>
      <el-tooltip class="item" effect="dark" placement="top-start">
        <div slot="content" v-html="tips" />
        <svg-icon icon-class="tips" style="stroke:currentColor" />
      </el-tooltip>
    </div>
    <div class="number">
      <template v-if="ifMoney">
        <span v-if="number < 0">-</span>
        {{ number | filtersMoneyByZero }}
      </template>
      <template v-else>
        {{ number }}
      </template>
    </div>
    <div class="footer">
      <div class="footerView">
        <span class="footerViewText">{{ labelArr[0] }}</span>
        <span>
          <i :class="cssFullClass(valueArr[0])" />
          <em class="footerViewValue">{{ valueArr[0] }}%</em>
        </span>
      </div>
      <!-- <div class="footerView">
        <span class="footerViewText">{{ labelArr[1] }}</span>
        <span>
          <i :class="cssFullClass(valueArr[1])" />
          <em class="footerViewValue">{{ valueArr[1] }}%</em>
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    ifCurrent: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    number: {
      type: [Number, String],
      default: ''
    },
    labelArr: {
      type: Array,
      default: () => ['环比上期', '同比上期']
    },
    valueArr: {
      type: Array,
      default: () => [0, 0]
    },
    tips: {
      type: String,
      default: ''
    },
    ifMoney: {
      type: Boolean,
      default: true
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
    }
  }
}
</script>

<style lang='scss' scoped>
.dataCource {
    border-radius: 8px;
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid #EFF2F6;
    cursor: pointer;
    &:hover {
      box-shadow: -2px 4px 12px 0px rgba(22,22,22,0.25);
    }
    .kanban {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #777777;
    }
    .number {
      margin: 8px 0 9px;
      font-size: 26px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      line-height: 40px;
    }
    .footer {
      margin-top: 9px;
      margin-bottom: 5px;
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
}
.current {
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('~@/assets/image/kanbanbg.png');
  border: none;
  .kanban {
    color: #fff;
  }
  .number {
    color: #fff;
  }
  .footer {
    >.footerView {
      .footerViewText {
         color: #FFFFFF;
      }
      .footerViewValue {
         color: #FFFFFF;
      }
    }

  }
}
.c_00B42A {
  color: #00B42A;
}
.c_F53F3F {
  color: #F53F3F;
}
</style>
