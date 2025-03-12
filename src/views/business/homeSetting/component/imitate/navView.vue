<template>
  <div class="navView">
    <div v-if="navViewList.length === 0" class="noData">
      <div class="noDataTile">{{ item.name }}</div>
      <div class="noDataImg">
        <img src="~@/assets/image/homeSetting/navView.png" alt="" />
      </div>
    </div>

    <el-scrollbar ref="scrollContainer" :vertical="true" class="conversation-container-content-scroll">
      <div class="navViewContent overflowOuto">
        <div v-for="(itemRe) in navViewList" :key="itemRe.id" class="flex_view">
          <img :src="itemRe.url" alt="" class="iconImg" />
          <div class="text_hidden flex_view_text">{{ itemRe.adTitle }}</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
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
      navViewList: state => state.homePageSetting.navViewList
    })
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.navView {
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
      width: 42px;
      height: 28px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .conversation-container-content-scroll {
    width: 100%;
    height:55px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .navViewContent {
    height: 55px;
    display: flex;
    flex-wrap: nowrap;
    // overflow-x: auto;
    // overflow-y: hidden;
    box-sizing: border-box;
    // scrollbar-width: none;
    // -ms-overflow-style: none;
    // &::-webkit-scrollbar {
    //   display: none;;
    // }
    .flex_view {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 44px;
      padding: 8px 5px;
      .iconImg {
        width: 24px;
        min-width: 24px;
        height: 24px;
        min-height: 24px;
      }
      .flex_view_text{
        margin-top: 5px;
        font-size: 8px;
        text-align: center;
        line-height: 10px;
      }
    }
    // overflow-x: auto;
  }
}
::v-deep {
  .el-scrollbar__wrap {
    overflow-y: auto!important;
    overflow-x: auto!important;
    height: 79px;
    margin-right: 0px!important;
  }
  .el-scrollbar__view {
    overflow-x: auto;
    overflow-y: hidden;
    display: inline-block;
  }
  .el-scrollbar__bar.is-vertical {
    display: none;
  }
}
</style>
