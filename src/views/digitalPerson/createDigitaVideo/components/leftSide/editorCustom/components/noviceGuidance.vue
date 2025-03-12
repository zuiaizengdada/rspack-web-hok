<template>
  <div class="noviceGuidance">
    <template v-for="(item, i) in getList">
      <div
        v-if="index === i"
        :key="i"
        class="posit"
        :style="{ left: item.left, top: item.top }"
      >
        <img
          :style="{ width: item.widthImg, height: item.heightImg }"
          :src="item.targetUrl"
          alt=""
        >
        <div :class="['item', item.arrowClass ? item.arrowClass : '']">
          <div class="title">{{ item.title }}</div>
          <div class="tips">{{ item.tips }}</div>
          <div class="msg">
            <el-image v-if="item.msgUrl" :src="item.msgUrl" fit="fill" />
          </div>
          <div class="bottom_row">
            <div class="schedule">{{ index + 1 }}/{{ getList.length }}</div>
            <el-button type="primary" class="next" @click="next">
              我知道了
            </el-button>
            <div />
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
      thirdType: 1,
      list: [
        {
          type: 1,
          left: '17rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-td',
          content: '',
          title: '停顿设置',
          tips: '点击停顿按钮，可设置文案的停顿操作。',
          targetUrl: require('@/assets/image/aigc/jub-td-jy.png'),
          msgUrl: require('@/assets/image/aigc/msg-ju-td-jy.png')
        },
        {
          type: 2,
          left: '22.05rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-td',
          content: '',
          title: '静音设置',
          tips: '点击静音按钮，可设置文案的静音操作。',
          targetUrl: require('@/assets/image/aigc/tager-jy.png'),
          msgUrl: require('@/assets/image/aigc/msg-jy.png')
        },
        {
          type: 3,
          left: '27.5rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-dyz',
          content: '',
          title: '多音字设置',
          tips: '选择单个文字，点击多音字按钮，可设置文案中多音字正确读音操作。',
          targetUrl: require('@/assets/image/aigc/tager-dyz.png'),
          msgUrl: require('@/assets/image/aigc/msg-dyz-n.png')
        },
        {
          type: 4,
          left: '32.5rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-sz',
          content: '',
          title: '数字设置',
          tips: '选择数字文本，可设置数字的不同读法：电话、数值和序列选其一。',
          targetUrl: require('@/assets/image/aigc/tager-sz.png'),
          msgUrl: require('@/assets/image/aigc/msg-sz-n.png')
        },
        {
          type: 5,
          left: '37.25rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-sz',
          content: '',
          title: '局部语速设置',
          tips: '选中文字点击语速设置按钮，可设置文案的语速快慢。',
          targetUrl: require('@/assets/image/aigc/jbyustags.png'),
          msgUrl: require('@/assets/image/aigc/jbyushu.png')
        },
        {
          type: 6,
          left: '42rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-sz',
          content: '',
          title: '局部语调设置',
          tips: '选中文字点击语调设置按钮，可设置文案的语调高低。',
          targetUrl: require('@/assets/image/aigc/jbyudiaotags.png'),
          msgUrl: require('@/assets/image/aigc/jbyudiao.png')
        },
        {
          type: 7,
          left: '46.8rem',
          top: '270px',
          widthImg: '84px',
          heightImg: '48px',
          arrowClass: 'arrowClass-sz',
          content: '',
          title: '音量设置',
          tips: '选中文字点击音量设置按钮，可设置文案的音量大小。',
          targetUrl: require('@/assets/image/aigc/jbyingliantags.png'),
          msgUrl: require('@/assets/image/aigc/jbyinglian.png')
        },
        {
          left: '55vw',
          top: '270px',
          widthImg: '118px',
          heightImg: '48px',
          title: 'AI助手',
          tips: '利用AI助手，可实现文案生成，文案优化、文案扩展和文案精简操作，帮助你更轻松的管理文案内容。',
          targetUrl: require('@/assets/image/aigc/globel-ai-tagr.png'),
          msgUrl: require('@/assets/image/aigc/globel-ai.png')
        }
      ]
    }
  },
  computed: {
    getList() {
      return this.thirdType === 1
        ? this.list.filter(f => f.type < 5)
        : this.list
    }
  },
  methods: {
    next() {
      if (this.index === this.getList.length - 1) {
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
        top: -4%;
        width: 18px;
        height: 16px;
        background-image: url('../../../../../../../assets/image/aigc/arrow-up.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
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
        height: 157px;
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
  height: 328px !important;
  &::after {
    left: 9.5% !important;
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
