<template>
  <div class="like">
    <div v-if="likeList.length === 0" class="noData">
      <div class="noDataTile">{{ item.name }}</div>
      <div v-if="likeList.length === 0" class="noDataImg">
        <img src="~@/assets/image/homeSetting/like.png" alt="" />
      </div>
    </div>
    <template v-else>
      <div class="likeName">{{ item.name }}</div>
      <div class="like_content">
        <!-- <div
          v-for="nav in likeList"
          :key="nav.goodsId"
          class="like_content_view"
        >
          <img :src="nav.coverVerticalUrl" />
          <div class="like_content_view_footer">
            <unitPrice :price="nav.salePrice" />
          </div>
        </div> -->
        <div v-for="(itemRe, index) in likeList" :key="index" class="home-row">
          <div class="cover-img">
            <img :src="itemRe.coverVerticalUrl" />
          </div>
          <div class="home-goods-name">{{ itemRe.contentName }}</div>
          <div class="home-goods-price">
            <div class="left-span">
              ¥<span style="font-size: 14px">{{ mapPrice(100000) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  selectPfHomePageLevelList,
  selectPageHomePageGoods
} from '@/api/platform/homeSetting'
// import { mapState } from 'vuex'
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
    return { likeList: [] }
  },
  computed: {
    // ...mapState({
    //   likeList: state => state.homePageSetting.likeList
    // })
  },
  watch: {
    'current.type': {
      handler(val) {
        if (val === 'like') {
          this.getLikeList()
        }
      },
      deep: true,
      lmmediate: true
    }
  },
  mounted() {
    this.getLikeList()
    eventBus.$on('refreshActive', () => {
      this.getLikeList()
    })
  },
  destroyed() {
    eventBus.$off('refreshActive')
  },
  methods: {
    mapPrice(val) {
      return (Number(val) / 100).toFixed(0)
    },
    getLikeList() {
      selectPfHomePageLevelList()
        .then(res => {
          const parentId =
            res.data.find(f => f.levelName === '猜你喜欢').id || {}
          selectPageHomePageGoods({
            homePageLevelId: parentId,
            pageIndex: 1,
            pageSize: 10
          }).then(res => {
            console.log('获取爆款推荐得分组详情数据')
            this.likeList = res.data.items
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.like {
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
      top: 35px;
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
  .likeName {
    padding: 10px 10px 10px 0;
    font-family: PingFangSC, PingFang SC;
    // font-weight: bolder;
    font-size: 12px;
    color: #000;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .like_content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .like_content_view {
      padding-left: 11px;
      margin-right: 11px;
      border-radius: 6px;
      // overflow: hidden;
      > img {
        width: 105px;
        min-width: 105px;
        height: 105px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      .like_content_view_footer {
        padding: 7px 4px;
      }
    }
    .home-row {
      width: 47%;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 6px;
      .cover-img {
        img {
          border-radius: 3px;
          width: 100px;
          height: 100px;
        }
      }
      .home-goods-name {
        width: 100%;
        height: 34px;
        font-size: 12px;
        padding: 2px 0;
        color: #111111;
        // 文本显示两行
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-top: 4px;
      }
      .home-goods-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 5px 0;
        .left-span {
          color: #ff2d19;
          font-size: 12px;
        }
        .right-span {
          font-size: 12px;
          color: #999999;
          scale: 0.7;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
