<template>
  <div class="tips" :style="{'justify-content': align}">
    <span class="tipsText">
      <slot>
        {{ text }}
      </slot>
    </span>
    <el-tooltip class="item" :content="tips" placement="top">
      <img :src="imgSrc ? imgSrc : TipsImg" class="iconText" />
    </el-tooltip>
  </div>
</template>

<script>
import TipsImg from '@/assets/image/icon/icon_question.png'
export default {
  components: {},
  props: {
    text: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      validator: function (value) {
        // 在 validator 函数中，检查传递的值是否是合法的
        return ['flex-start', 'flex-end', 'center'].includes(value)
      },
      default: 'flex-start'
    },
    imgSrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      TipsImg
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.tips {
    display: flex;
    align-items: center;
    .tipsText {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        display: flex;
        align-items: center;
    }
    .iconText {
        margin-left: 6px;
        width: 14px;
        height: 14px;
    }
}
</style>
