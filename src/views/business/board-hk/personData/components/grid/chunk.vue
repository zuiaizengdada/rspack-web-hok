<template>
  <div
    v-loading="obj.loading"
    element-loading-spinner="el-icon-loading"
    :class="{ chunk: true, isCheck: obj.isCheck }"
    :style="{
      width: obj.width
    }"
    @click="handleClick"
  >
    <img v-if="obj.isCheck" class="checkImg" :src="checkImg" alt="">
    <div class="item-c">
      <span class="label-c"> {{ obj.title }}</span>
      <span class="value-c">{{ filterPrice(obj.value) }}</span>
    </div>
    <div class="item-v">
      <img class="icon-v" :src="getImageUrl" alt="">
      <div
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        <span class="dimension">
          {{ getTotalRatioLabel }}
        </span>
        <span class="ratio" style="padding-right: 8px">{{
          filterPrice(obj.contemporaneousPeriodAmount)
        }}</span>
        <span class="ratio">
          {{ obj.ratio > 1000 ? '1000% +' : obj.ratio + '%' }}
        </span>
        <img class="icon-r" :src="getRidio" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import cjje from '@/assets/image/operateData/cjje.png'
import dspdh from '@/assets/image/operateData/dspdh.png'
import tkjh from '@/assets/image/operateData/tkjh.png'
import zbdh from '@/assets/image/operateData/zbdh.png'
import zrcj from '@/assets/image/operateData/zrcj.png'
import syxscj from '@/assets/image/operateData/syxscj.png'
import xxld from '@/assets/image/operateData/xxld.png'
import up from '@/assets/image/operateData/up.png'
import down from '@/assets/image/operateData/down.png'
import checkImg from '@/assets/image/operateData/check.png'
export default {
  components: {},
  props: {
    obj: {
      type: Object,
      default: () => {
        return {
          title: '',
          value: 0,
          ratio: 0,
          contemporaneousPeriodAmount: 0,
          loading: false,
          active: 1, //
          isCheck: false
        }
      }
    }
  },
  data() {
    return { checkImg }
  },
  computed: {
    getRidio() {
      return this.obj.ratio >= 0 ? up : down
    },
    getImageUrl() {
      return {
        GMV: cjje,
        总营收: dspdh,
        总业绩: dspdh,
        退款金额: tkjh,
        视频带货: zbdh,
        直播带货: zrcj,
        私域线上成交: syxscj,
        线下录单: xxld
      }[this.obj.title]
    },
    getTotalRatioLabel() {
      return {
        1: '对比昨天',
        2: '较上同期',
        3: '对比上月',
        4: '对比去年',
        '': '较上同期'
      }[this.obj.active]
    }
  },
  created() {},
  methods: {
    setCheck() {
      this.obj.isCheck = !this.obj.isCheck
    },
    handleClick() {
      this.$emit('handleClick', this.obj.title)
    },
    // 过滤所有的数值
    filterPrice(value) {
      const isNegative = Number(value) < 0
      const v = Math.abs(Number((Number(value) / 100).toFixed(2)))
      if (v < 10000) {
        return v
      }
      if (v >= 10000) {
        return isNegative ? '-' + Number(v * 0.0001).toFixed(2) + '万' : '' + Number(v * 0.0001).toFixed(2) + '万'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chunk {
  min-width: 224px;
  margin-right: 0.5%;
  position: relative;
  display: inline-block;
  background: #ffffff;
  box-shadow: 0px 3px 11px 0px rgba(49, 66, 82, 0.1);
  border-radius: 8px;
  padding: 22px 16px;
  margin-bottom: 16px;
  .item-c {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 19px;
    .label-c {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #2c3242;
    }
    .value-c {
      font-size: 20px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #2c3242;
    }
  }
  .item-v {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon-v {
      width: 24px;
      min-width: 24px;
      height: 24px;
      margin-left: 12px;
    }
    .dimension {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #757575;
      margin-right: 4px;
    }
    .ratio {
      font-size: 14px;
      font-family: ArialMT;
      color: #2c3242;
      margin-right: 4px;
    }
    .icon-r {
      width: 10px;
      min-width: 10px;
      height: 12px;
      display: inline-block;
    }
  }
  .checkImg {
    width: 22px;
    height: 19px;
    position: absolute;
    top: -1px;
    right: -1px;
  }
}
.isCheck {
  background: #f4fbff;
  border: 1px solid #00a3ff;
}
</style>
