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

          <div class="msg">{{ item.content }}</div>

          <div class="bottom_row">
            <div class="schedule">{{ index + 1 }}/2</div>
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
          left: '168px',
          top: '483px',
          widthImg: '199px',
          heightImg: '68px',
          arrowClass: 'arrowClass-td',
          content: '选中形象图，可调整形象大小，以及调整形象位置。',
          title: '形象大小和位置调整',
          tips: ''
        },
        {
          type: 1,
          left: '168px',
          top: '483px',
          widthImg: '199px',
          heightImg: '68px',
          arrowClass: 'arrowClass-td',
          content:
            '选中背景图，点击缩放图标，对背景图进行放大和缩小处理；按住鼠标拖拽，可调整背景图背景。',
          title: '背景图片缩放和调整位置',
          tips: ''
        }
      ]
    }
  },
  methods: {
    next() {
      this.index++
      if (this.index === this.list.length) {
        this.$emit('ok')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.noviceGuidance {
  position: absolute;
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
        top: -29px;
        width: 45px;
        height: 45px;
        background-image: url('../../../../../assets/image/aigc/xfjt.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: rotate(359deg);
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
        height: 46px;
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
    left: 42% !important;
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
