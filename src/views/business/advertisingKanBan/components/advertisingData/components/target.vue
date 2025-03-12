<template>
  <div id="target" :class="{ warpper: true, 'selected-warpper': isFocus }">
    <el-popover
      v-model="isFocus"
      placement="bottom-start"
      popper-class="target-popover"
    >
      <div class="popover-d">
        <div class="popover-t">数据指标：</div>
        <el-radio
          v-model="radio"
          label="totalShowCnt"
          class="popover-radio"
        >曝光数量</el-radio>
        <el-radio
          v-model="radio"
          label="totalCpmPlatform"
          class="popover-radio"
        >千次展示成本</el-radio>
        <el-radio
          v-model="radio"
          label="totalClickCnt"
          class="popover-radio"
        >点击数量</el-radio>
        <el-radio
          v-model="radio"
          label="totalClickRatio"
          class="popover-radio"
        >点击率</el-radio>
        <el-radio
          v-model="radio"
          label="payOrderCount"
          class="popover-radio"
        >直接成交数量</el-radio>
        <el-radio
          v-model="radio"
          label="totalPayOrderCount"
          class="popover-radio"
        >总成交数量</el-radio>
        <el-radio
          v-model="radio"
          label="totalStatCost"
          class="popover-radio"
        >广告花费</el-radio>
        <el-radio
          v-model="radio"
          label="payOrderAmount"
          class="popover-radio"
        >直接成交业绩</el-radio>
        <el-radio
          v-model="radio"
          label="totalPayOrderAmount"
          class="popover-radio"
        >总业绩</el-radio>
        <el-radio
          v-model="radio"
          label="totalPrepayAndPayOrderRoi"
          class="popover-radio"
        >直接支付ROI</el-radio>
        <el-radio
          v-model="radio"
          label="totalRoi"
          class="popover-radio"
        >总ROI</el-radio>
      </div>

      <div slot="reference" class="reference">
        <img
          class="target"
          src="@/assets/image/advertisingKanBan/target.png"
          alt=""
        >
        <span class="label">指标</span>
        <div v-if="value" class="content">
          数据指标：{{ value }}
          <!-- <i class="el-icon-close" style="color: #3c8bff" @click.stop="clear" /> -->
        </div>
        <div v-else class="content-p">请选择</div>
        <img
          class="down"
          src="@/assets/image/advertisingKanBan/icon_xiala.png"
          alt=""
        >
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  name: 'Target',
  data() {
    return {
      value: '总成交数量',
      isFocus: false,
      radio: 'totalPayOrderCount'
    }
  },
  watch: {
    radio(val) {
      this.value = {
        totalShowCnt: '曝光数量',
        totalCpmPlatform: '千次展示成本',
        totalClickCnt: '点击数量',
        totalClickRatio: '点击率',
        payOrderCount: '直接成交数量',
        totalPayOrderCount: '总成交数量',
        totalStatCost: '广告花费',
        payOrderAmount: '直接成交业绩',
        totalPayOrderAmount: '总业绩',
        totalPrepayAndPayOrderRoi: '直接支付ROI',
        totalRoi: '总ROI'
      }[val]
      this.$emit('targetValue', { name: this.value, key: val })
    }
  },
  created() {
    document.addEventListener('click', this.addClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.addClick)
  },
  methods: {
    addClick(e) {
      if (!e) {
        return
      }
      const isM = document.getElementById('target').contains(e.target)
      this.isFocus = isM
    },
    reset() {
      this.radio = 'totalPayOrderCount'
    },
    clear() {
      this.isFocus = false
    }
  }
}
</script>
<style lang="scss" scoped>
.warpper {
  position: relative;
  .reference {
    width: 244px;
    height: 36px;
    position: relative;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #d8dce6;
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 8px;
  }

  .selected-warpper {
    border-color: #0c6fff;
  }
  .label {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    margin-right: 8px;
  }
  .target {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  .down {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 8px;
  }
  .content {
    max-width: 145px;
    padding: 2px 8px;
    background: #e7f0ff;
    border-radius: 4px;
    border: 1px solid #dae9ff;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    i {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .content-p {
    padding: 2px 8px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
</style>
<style lang="scss">
.target-popover {
  width: 176px;
  max-height: 382px;
  background: #ffffff;
  box-shadow: 0px 4px 12px 0px rgba(22, 22, 22, 0.25);
  padding-bottom: 15px;
  .popper__arrow {
    left: 12% !important;
  }
  .popover-d {
    .popover-t {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-top: 5px;
    }
    .popover-radio {
      margin-top: 10px;
    }
  }
}
</style>
