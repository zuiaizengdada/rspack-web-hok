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
          <div class="msg">
            <el-image v-if="item.msgUrl" :src="item.msgUrl" fit="fill" />
          </div>
          <div class="bottom_row">
            <div class="schedule">{{ index + 1 }}/1</div>
            <el-button type="primary" class="next" @click="next">
              我知道了
            </el-button>
            <div />
          </div>
          <img
            v-if="item.targetUrl"
            :style="{ width: item.widthImg, height: item.heightImg }"
            :src="item.targetUrl"
            alt=""
            style="position: absolute; bottom: -98px; right: -84px"
          />
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
          left: '71.75%',
          top: '516px',
          widthImg: '199px',
          heightImg: '68px',
          arrowClass: 'arrowClass-td',
          content: '',
          title: '审批通过/审核驳回',
          tips: '',
          targetUrl: require('@/assets/image/aigc/srzpttags.png'),
          msgUrl: require('@/assets/image/aigc/szrspydt.png')
        }
      ]
    }
  },
  methods: {
    next() {
      if (this.index === 0) {
        this.$emit('ok')
        return
      }
      this.index++
    }
  }
}
</script>

<style lang="scss" scoped>
.noviceGuidance {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(65, 65, 65, 0.9);
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
      width: 417px;
      height: 341px;
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
      padding: 0 12px;
      margin-top: 25px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 42px;
        bottom: -4%;
        width: 18px;
        height: 16px;
        background-image: url('../../../../assets/image/aigc/arrow-up.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: rotate(178deg);
      }
      .title {
        font-size: 20px;
        color: #1778ff;
        line-height: 28px;
        padding-top: 15px;
      }
      .tips {
        font-size: 14px;
        color: #333333;
        padding-top: 10px;
      }
      .msg {
        width: 100%;
        height: 144px;
        margin-top: 17px;
        div {
          width: 100%;
          height: 100%;
        }
      }
      .bottom_row {
        margin-top: 22px;
        width: 100%;
        display: flex;
        justify-content: center;
        position: relative;
        .schedule {
          font-size: 14px;
          color: #999999;
          position: absolute;
          left: 10px;
          bottom: 0;
        }
        .next {
          width: 248px;
          height: 34px;
          background: #0c6fff;
          border-radius: 4px;
        }
      }
    }
  }
}
.arrowClass-td {
  height: 279px !important;
  &::after {
    left: 85% !important;
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
