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
      <div class="like_content overflowOuto">
        <div v-for="(nav) in likeList" :key="nav.goodsId" class="like_content_view">
          <img :src="nav.coverVerticalUrl" />
          <div class="like_content_view_footer">
            <unitPrice :price="nav.salePrice" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import unitPrice from '@/views/live/liveList/component/price.vue'
import { mapState } from 'vuex'

export default {
  components: {
    unitPrice
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      likeList: (state) => state.homePageSetting.likeList
    })
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
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
    padding: 10px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bolder;
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .like_content {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
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
  }
}
</style>
