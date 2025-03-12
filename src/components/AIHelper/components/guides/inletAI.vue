<template>
  <div class="noviceGuidance">
    <template v-for="(item, i) in list">
      <div
        v-if="index === i"
        :key="i"
        class="posit"
        :style="{ right: item.right, bottom: item.bottom }"
      >
        <div :class="['item', item.arrowClass ? item.arrowClass : '']">
          <div class="title">{{ item.title }}</div>
          <div v-if="item.tips" class="tips">{{ item.tips }}</div>

          <div class="msg">
            新增GPT-4，以及视频文案提取和AI图片生成功能，助力快速创作文稿。点击我进入伏羲云AI助手主页，开启你的AI之旅！
          </div>

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
          right: '74px',
          bottom: '58px',
          widthImg: '199px',
          heightImg: '68px',
          arrowClass: 'arrowClass-td',
          content: '',
          title: '开启你的伏羲云AI之旅',
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
  z-index: 9999;
  top: 0;
  left: 0;
  // 禁止滚动条外部滚动
  overscroll-behavior: contain;
  .posit {
    position: fixed;
    right: 0;
    bottom: 0;
    display: flex;

    .item {
      width: 400px;
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
        right: 47%;
        bottom: 76px;
        width: 45px;
        height: 45px;
        background-image: url('../../../../assets/image/aigc/xfjt.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: rotate(87deg);
      }
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #000;
      }
      .tips {
        font-size: 14px;
        color: #333333;
        padding-top: 10px;
      }
      .msg {
        width: 100%;
        height: 77px;
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
  height: 195px !important;
  &::after {
    right: -30px !important;
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
