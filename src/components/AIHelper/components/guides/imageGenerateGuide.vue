<template>
  <div class="noviceGuidance">
    <template v-for="(item, i) in list">
      <div
        v-if="index === i"
        :key="i"
        class="posit"
        :style="{ left: item.left, top: item.top }"
      >
        <div :class="['item', item.arrowClass ? item.arrowClass : '']">
          <div class="title">{{ item.title }}</div>
          <div v-if="item.tips" class="tips">{{ item.tips }}</div>

          <div class="msg">通过文字描述来生成各种图片。</div>

          <div class="bottom_row">
            <!-- <div class="schedule">{{ index + 1 }}/1</div> -->
            <el-button type="primary" class="next" @click="next">
              我知道了
            </el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      list: [
        {
          type: 1,
          left: '310px',
          top: '177px',
          widthImg: '199px',
          heightImg: '68px',
          arrowClass: 'arrowClass-td',
          content: '',
          title: 'AI图片生成',
          tips: ''
        }
      ]
    }
  },
  methods: {
    next() {
      this.$emit('ok')
      return
    }
  }
}
</script>

<style lang="scss" scoped>
.noviceGuidance {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  top: 0;
  left: 0;
  // 禁止滚动条外部滚动
  overscroll-behavior: contain;
  .posit {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;

    .item {
      width: 370px;
      height: 341px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
      padding: 20px;
      margin-top: 25px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 42px;
        bottom: 36.5%;
        width: 45px;
        height: 45px;
        background-image: url('../../../../assets/image/aigc/xfjt.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: rotate(269deg);
      }
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        width: 100%;
      }
      .tips {
        font-size: 14px;
        color: #333333;
        padding-top: 10px;
      }
      .msg {
        width: 100%;
        height: 39px;
        margin-top: 17px;
        font-size: 14px;
        font-weight: 400;
        color: #777777;
        div {
          width: 100%;
          height: 100%;
        }
      }
      .bottom_row {
        width: 100%;
        display: flex;
        justify-content: right;
        position: relative;
        .schedule {
          font-size: 14px;
          color: #999999;
          position: absolute;
          left: 10px;
          bottom: 0;
        }
        .next {
          width: 130px;
          height: 34px;
          background: #0c6fff;
          border-radius: 4px;
        }
      }
    }
  }
}
.arrowClass-td {
  height: 153px !important;
  &::after {
    left: -8% !important;
  }
}
.arrowClass-sz {
  &::after {
    left: 15% !important;
  }
}
.arrowClass-ys {
  &::after {
    left: 40% !important;
  }
}
.arrowClass-dyz {
  &::after {
    left: 16% !important;
  }
}
</style>
