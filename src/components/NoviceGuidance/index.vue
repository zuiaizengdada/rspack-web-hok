<template>
  <div class="noviceGuidance">
    <template v-for="(item, i) in list">
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
        <div :class="['item', item.arrowClass ? item.arrowClass : '']" :style="{'width':item.tipsWidth,'height':item.tipsHeight,'left':item.tipsLeft}">
          <div class="title">{{ item.title }}</div>
          <div class="tips">{{ item.tips }}</div>
          <div v-if="item.msgUrl" class="msg">
            <img :src="item.msgUrl" alt="">
          </div>
          <div class="bottom_row">
            <div v-if="item.haveStep" class="schedule">{{ index + 1 }}/5</div>
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
  props: {
    /**
     * @description: 引导列表
     * @type {Array}
     * @default: () => []
     * @example:
     * {
            left: '13.2vw', // 引导框的left
            top: '14.2vh', // 引导框的top
            widthImg: '1648px', // 图片宽高
            heightImg: '95px', // 图片宽高
            tipsWidth: '417px', // 提示框宽高
            tipsHeight: '187px', // 提示框宽高
            tipsLeft: '600px', // 提示框left
            arrowClass: 'arrowClass-desensiti', // 箭头样式,需要自定义需要自己增加class
            content: '',
            haveStep: false, // 是否有步骤
            title: '筛选项', // 标题
            tips: '脱敏数据可以根据视频组创建时间、部门、创建者、讲师进行查询。', // 提示
            targetUrl: require('@/assets/image/video/ng_desensitization_step1.png'), // 引导图片
            msgUrl: '' // 引导图片下面的提示图片
        },
     */
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      index: 0
    }
  },
  computed: {
    getInfo() {
      return this.list[this.index]
    }
  },
  watch: {
    getInfo: {
      handler(val) {
        if (val.content) {
          this.$emit('handleShow', val.content)
        }
      },
      deep: true
    }
  },
  methods: {
    next() {
      if (this.index === this.list.length - 1) {
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
        // width: 417px;
        // height: 341px;
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
          background-image: url('../../assets/image/aigc/arrow-up.png');
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
          img {
            width: 100%;
            height: 100%;
          }
        }
        .bottom_row {
          margin-top: 22px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
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
            margin-top: 20px;
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
  .arrowClass-desensiti{

    &::after {
      left:48% !important;
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

