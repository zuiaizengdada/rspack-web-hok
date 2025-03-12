<template>
  <div class="banner">
    <div class="noData">
      <div class="noDataTile">{{ item.name }}</div>
      <div class="noDataImg">
        <img src="~@/assets/image/homeSetting/banner.png" alt="" />
      </div>
    </div>

    <div class="bannerContent">
      <el-carousel
        height="62px"
        :initial-index="initialIndex"
        :autoplay="autoplay"
        arrow="never"
        indicator-position="none"
      >
        <el-carousel-item v-for="nav in bannerList" :key="nav.id">
          <img :src="nav.url" />
        </el-carousel-item>
      </el-carousel>
      <!-- <div v-for="(item) in bannerList" :key="item.id" class="flex_view">
        <img :src="item.url" alt="" class="iconImg" />
        <div class="text_hidden flex_view_text">{{ item.adTitle }}</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { adInfoList } from '@/api/platform/advertising'
import eventBus from '@/utils/eventBus'
export default {
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    current: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      autoplay: true, // 是否自动切换
      initialIndex: 0,
      bannerList: []
    }
  },
  watch: {
    'current.type': {
      handler(val) {
        this.autoplay = !(val === 'banner')
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getList()
    eventBus.$on('refreshBanner', () => {
      this.getList()
    })
  },
  destroyed() {
    eventBus.$off('refreshBanner')
  },
  methods: {
    getList() {
      adInfoList({ id: 23 }).then(res => {
        this.bannerList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  .noData {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    .noDataTile {
      font-family: PingFangSC, PingFang SC;
      font-weight: bolder;
      font-size: 12px;
      color: #333333;
      line-height: 17px;
      text-align: left;
      font-style: normal;
    }
    .noDataImg {
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 30px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .bannerContent {
  }
}
</style>
