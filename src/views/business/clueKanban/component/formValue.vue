<template>
  <div class="formValue">
    <div class="formLable" :style="labelStyle">
      {{ label }}
      <el-tooltip v-if="tips" class="item" effect="dark" :content="tips" placement="top-start">
        <svg-icon icon-class="tips" class="titleIcon" style="stroke:currentColor" />
      </el-tooltip>
    </div>
    <div class="formValue">
      <i v-if="loading" class="el-icon-loading" />
      <div v-else-if="type === 'scale'">
        <span class="scale">
          <i :class="cssFullClass(value)" />
          <em class="footerViewValue">{{ Math.abs(value) || 0 }}%</em>
        </span>
      </div>
      <div v-else-if="type === 'money'" class="money">{{ value || 0 }}</div>
      <div v-else class="formValueText">{{ value || 0 }}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String, // ['scale'比例 , 'money'金额]
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    labelStyle: {
      type: Object,
      default: () => {}
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
.formValue {
  display: flex;
  align-items: center;
  .formLable {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    line-height: 24px;
    .titleIcon {
      width: 16px;
      height: 16px;
      font-size: 16px;
      line-height: 24px;
    }
  }
  .formValue {
    margin-left: 10px;
    .scale {
      .footerViewValue {
        font-style: normal;
        font-size: 14px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #161616;
        line-height: 24px;
      }
    }
    .formValueText {
      font-size: 16px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #777777;
      line-height: 24px;
    }
    .money {
      font-size: 24px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      line-height: 24px;
    }
  }
}
</style>
