<template>
  <div class="kanbanlist">
    <div class="kanbanContent">
      <div class="kanbanlistTitle">
        <span v-if="!item.isCarousel">
          {{ item.text }}
        </span>
        <el-carousel
          v-else
          ref="carouselRefTwo"
          style="width: 100%"
          height="20px"
          direction="vertical"
          :autoplay="false"
          @mouseenter.native="disableMouseEvents"
          @mouseleave.native="disableMouseEvents"
          @click.native="disableClickEvents"
        >
          <el-carousel-item v-for="(n, index) in item.text" :key="index">
            <div>{{ n }}</div>
          </el-carousel-item>
        </el-carousel>
        <el-tooltip
          v-if="item.tips"
          class="item"
          effect="dark"
          placement="top-start"
        >
          <div slot="content" v-html="item.tips" />
          <svg-icon
            icon-class="tips"
            class="titleIcon"
            style="stroke: currentColor"
          />
        </el-tooltip>
      </div>
      <div class="kanbanlistNumber">
        <div v-if="!item.isCarousel">
          {{ item.value }}
        </div>
        <el-carousel
          v-else
          ref="carouselRefOne"
          style="width: 100%"
          height="40px"
          direction="vertical"
          :autoplay="false"
          @mouseenter.native="disableMouseEvents"
          @mouseleave.native="disableMouseEvents"
          @click.native="disableClickEvents"
        >
          <el-carousel-item v-for="(n, index) in item.value" :key="index">
            <div>{{ n }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="kanbanListFloatFot">
        <div v-if="item.addWxRate" class="deliveryRateBox">
          <div>加微率</div>
          <span v-if="!item.isCarousel">
            {{ item.addWxRate }}
          </span>
          <el-carousel
            v-else
            ref="carouselRefThree"
            style="width: 30%"
            height="14px"
            direction="vertical"
            :autoplay="false"
            @mouseenter.native="disableMouseEvents"
            @mouseleave.native="disableMouseEvents"
            @click.native="disableClickEvents"
          >
            <el-carousel-item v-for="(n, index) in item.addWxRate" :key="index">
              <div>{{ n }}</div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div
          v-for="(n, index) in item.ratioLabel"
          :key="index"
          :class="{ borders: index === 1 }"
        >
          {{ n }} <span>{{ item.basisRatio[index] }}</span>
        </div>
      </div>
    </div>
    <img src="@/assets/image/cardBtmBg.png" alt="" />
  </div>
</template>

<script>
export default {
  components: {},
  // 在你的Vue组件中添加这个自定义指令
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          icon: '线索',
          text: '',
          tips: '',
          value: '',
          basisRatio: ''
        }
      }
    },
    active: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.timer) return
      this.handleBanClick()
      this.timer = setInterval(() => {
        this.$refs.carouselRef?.next()
        this.$refs.carouselRefOne?.next()
        this.$refs.carouselRefTwo?.next()
        this.$refs.carouselRefThree?.next()
      }, 3000)
    })
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    setHandlers(ref) {
      if (!ref) return
      ref.handleButtonEnter = () => {}
      ref.handleButtonLeave = () => {}
      ref.handleIndicatorClick = () => {}
      ref.handleIndicatorHover = () => {}
      ref.handleMouseEnter = () => {}
      ref.handleMouseLeave = () => {}
    },
    async handleBanClick() {
      await this.$nextTick()
      this.setHandlers(this.$refs.carouselRef)
      this.setHandlers(this.$refs.carouselRefOne)
      this.setHandlers(this.$refs.carouselRefTwo)
      this.setHandlers(this.$refs.carouselRefThree)
    },
    disableMouseEvents() {
      // 不做任何操作，或者可以实现特定逻辑
    },
    disableClickEvents() {
      // 不做任何操作，或者可以实现特定逻辑
    },
    onhandleClick(item) {
      this.$emit('onClick')
    },
    initNumb(val) {
      let numl = val
      if (typeof numl === 'string') {
        if (numl.includes('-')) {
          numl = numl?.replace('-', '')
        }
        return numl
      }
      if (numl < 0) {
        numl = Math.abs(numl)
      }
      return numl
    },
    cssFullClass(val, key) {
      let numl = val
      if (typeof numl === 'string' && numl.includes('%')) {
        numl = numl?.replace('%', '')
        numl = Number(numl)
      }
      if (numl < 0) {
        return 'start-red-p c_F53F3F'
      } else if (numl > 0) {
        return 'start-green-p c_00B42A'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.kanbanlist::v-deep {
  width: calc(100% / 6.39);
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .deliveryRateBox {
    width: 100%;
    display: flex;
    align-items: center;
    > div:nth-of-type(1) {
      margin-right: 4px;
    }
  }
  cursor: pointer;
  .el-carousel__button {
    opacity: 0;
  }
  &:hover {
    box-shadow: -2px 4px 12px 0px rgba(22, 22, 22, 0.1);
  }
  .listIcon {
    width: 58px;
    height: 58px;
  }
  .footerViewTexts {
    font-weight: bold;
  }
  .kanbanContent {
    width: 100%;
    padding: 16px;
    padding-bottom: 0;
    .kanbanlistTitle {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 20px;
    }
    .titleIcon {
      width: 14px;
      height: 14px;
      color: #999;
    }
    .kanbanlistNumber {
      font-size: 28px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #065cff;
      margin: 8px 0;
      display: flex;
      align-items: center;
      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        > div:nth-of-type(2) {
          font-size: 14px;
          margin-top: -10px;
        }
        margin-left: 65px;
      }
      > div:nth-of-type(1) {
        margin-left: 0;
        flex: 1;
        align-items: flex-start;
        height: 35px;
        > div {
          width: 100%;
        }
      }
    }

    .kanbanListFloat {
      display: flex;
      align-items: center;
      color: #333333;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
      > div:nth-of-type(2) {
        margin-left: 4px;
        flex: 1;
      }
    }
    .kanbanListFloatFot {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
      margin-top: 19px;
      > div {
        margin-right: 11px;
      }
      span {
        font-weight: 700;
      }
      .borders {
        margin-right: 0;
        padding-left: 11px;
        border-left: 1px solid #cccccc;
      }
    }

    .kanbanlistFooter {
      .footerViewText {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin: 5px 5px 5px 0;
      }
      .footerViewTextSwiper {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
      }
      .footerViewValue {
        font-style: normal;
        font-size: 14px;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #161616;
        line-height: 16px;
      }
    }
  }
}
.active {
  border-top: 4px solid #065cff;
}
.text {
  font-weight: 500;
}
.textOne {
  // font-size: 18px;
  font-weight: 500;
}
.flex {
  display: flex;
  > div {
    flex: 1;
    width: 50%;
  }
}
.textAlin {
  text-align: center;
  font-weight: 200 !important;
}
</style>
