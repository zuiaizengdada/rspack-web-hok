<template>
  <div class="homeView">
    <div class="homeViewContent overflowOuto">
      <div
        v-for="item in list"
        :key="item.type"
        v-loading="item.loading"
        :style="{ 'min-height': item.minHeight }"
        class="cardView"
        :class="{
          active: current.type === item.type,
          cardView2: item.type === 'recommend'
        }"
        @click="$emit('onClick', item)"
      >
        <components :is="item.type" :item="item" :current="current">
          <div>
            <img :src="item.noDataImg" alt="" />
          </div>
        </components>
      </div>
    </div>
  </div>
</template>

<script>
import banner from './component/imitate/banner.vue'
import recommend from './component/imitate/recommend.vue'
import like from './component/imitate/like.vue'
import navView from './component/imitate/navView.vue'
import myShoping from './component/imitate/myShoping.vue'
export default {
  components: {
    myShoping,
    banner,
    recommend,
    like,
    navView
  },
  props: {
    current: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.homeView {
  height: 535px;
  display: flex;
  flex-direction: column;
  background: url(../../../assets/image/homeSetting/phone_header.png);
  background-size: cover;
  overflow: hidden;
  padding-top: 75px;
  padding-bottom: 62px;
  .homeViewContent {
    flex: 1 0 0;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    text-align: left;
    font-style: normal;
    overflow: auto;
    .cardView {
      width: 222px;
      border-radius: 6px;
      margin: 0 auto 8px;
      border: 1px solid #fafafa;
      overflow: hidden;
    }
    .cardView2 {
      width: 99% !important;
    }
    // .banner {
    //   width: 222px;
    //   height: 62px;
    //   background: #FFFFFF;
    //   border-radius: 6px;
    //   margin: 0 auto 8px;
    //   border: 1px solid transparent;
    // }
    // .nav {
    //   width: 222px;
    //   height: 55px;
    //   background: #FFFFFF;
    //   border-radius: 6px;
    //   margin: 0 auto 8px;
    //   border: 1px solid transparent;
    // }
    // .myShop {
    //   width: 222px;
    //   height: 48px;
    //   margin: 0 auto 8px;
    //   background: url(../../../assets/image/homeSetting/myShop.png);
    //   background-size: cover;
    //   background-repeat: no-repeat;
    //   border: 1px solid transparent;
    // }
    // .RecommendCourses {
    //   width: 222px;
    //   min-height: 200px;
    //   overflow: auto;
    //   background: #FFFFFF;
    //   border-radius: 6px;
    //   border: 1px solid transparent;
    //   margin: 0 auto 8px;
    // }
    .active {
      border: 1px solid #0c6fff;
      // border-color: #0C6FFF;
      box-shadow: 0px 0px 4px 0px rgba(12, 111, 255, 0.4);
    }
  }
}
</style>
