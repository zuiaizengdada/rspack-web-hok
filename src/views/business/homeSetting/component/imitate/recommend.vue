<template>
  <div class="recommend">
    <div v-if="groupList.length === 0" class="noData">
      <div class="noDataTile">{{ item.name }}</div>
      <div class="noDataImg">
        <img src="~@/assets/image/homeSetting/recommend.png" alt="" />
      </div>
    </div>

    <div v-else class="content">
      <div class="recommendName">{{ item.name }}</div>
      <div>
        <van-tabs v-model="active" @click="handleChange">
          <van-tab
            v-for="itemRe in groupList"
            :key="itemRe.groupingId"
            :name="itemRe.groupingId"
            :title="itemRe.groupingName"
          />
        </van-tabs>
      </div>
      <div class="home-newest-content">
        <div v-for="(itemRe, index) in list" :key="index" class="home-newest-list">
          <div class="home-newest-list-img"><img :src="itemRe.coverUrlExtendVo.big" /></div>
          <div class="home-newest-list-content">
            <div class="card-content__header--title">{{ itemRe.contentName }}</div>
            <div class="card-content__box">{{ itemRe.columnContent }}</div>
            <div class="card-content__footer">
              <div class="card-content__footer">
                <p>{{
                  [
                    '图片',
                    '音频',
                    '视频',
                    '专栏',
                    '大专栏',
                    '线下课',
                    '线下课',
                    '线下课'
                  ][itemRe.goodsType]
                }}</p>
                <span v-if="itemRe.classHour && itemRe.goodsType !== 5">{{ itemRe.classHour }}节</span>
              </div>
              <div v-if="itemRe.goodsPopularity" class="hok-viewers__text"><svg-icon icon-class="icon_popularity" />{{ itemRe.goodsPopularity | getPopularity }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGroupingList, getpopularityList } from '@/api/business/homeSetting/index.js'
import tab from 'vant/lib/tab'
import tabs from 'vant/lib/tabs'
import 'vant/lib/tabs/style'
import 'vant/lib/tab/style'
import { mapState } from 'vuex'
export default {
  components: {
    vanTab: tab,
    vanTabs: tabs
  },
  filters: {
    getPopularity(val) {
      if (typeof val !== 'number' && typeof val !== 'string' && val) {
        return 0
      }
      if (val > 10000 && val <= 1000000) {
        return Math.floor(val / 100) / 100 + '万'
      } else if (val > 1000000 && val <= 1000000000) {
        return Math.floor(val / 10000) + '万'
      } else if (val > 1000000000) {
        return '10亿'
      }
      return val
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      groupList: [],
      list: [],
      active: ''
    }
  },
  computed: {
    ...mapState({
      recommendActive: state => state.homePageSetting.recommendActive,
      refresh: state => state.homePageSetting.refresh,
      refreshActive: state => state.homePageSetting.refreshActive,
      recommendId: state => state.homePageSetting.groupId.recommendId
    })
  },
  watch: {
    recommendActive: {
      handler(val) {
        console.log(val)
        if (val) {
          this.active = val
          this.getGroupList()
        }
      },
      deep: true,
      immediate: true
    },
    refresh: {
      handler(val) {
        console.log('refresh改变触发', this.refreshActive && this.refreshActive === 1)
        if (this.refreshActive && this.refreshActive === 1) {
          this.getGrouping()
        } else if (this.refreshActive && this.refreshActive === 2) {
          this.getGroupList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.getGrouping()
  },
  methods: {
    getGrouping() {
      this.item.loading = true
      this.groupList = []
      const data = {
        parentId: this.recommendId
      }
      console.log(this.recommendId, 'recommendId ++++++++++++++++++')
      getGroupingList(data).then(res => {
        this.groupList = res.data
        if (!this.active && res.data.length > 0) {
          this.active = res.data[0].groupingId
          this.handleChange(this.active)
        }
        this.item.loading = false
      }).catch(() => {
        this.item.loading = false
      })
    },
    getGroupList() {
      if (this.active) {
        getpopularityList({ groupingId: this.active, current: 0, size: 2 }).then(res => {
          console.log('获取爆款推荐得分组详情数据')
          this.list = res.data.records
        })
      }
    },
    handleChange(res) {
      this.active = res
      this.$store.commit('homePageSetting/SET_recommendActive', res)
      this.getGroupList()
    }
  }
}
</script>

<style lang='scss' scoped>
.recommend {
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
  .recommendName {
    padding: 10px 10px 0px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    text-align: left;
    font-style: normal;
  }
  .home-newest-content {
    .home-newest-list {
      display: flex;
      padding: 4px 8px 8px;
      height: 80px;
      .home-newest-list-img {
        width: 70px;
        height: 70px;
        border-radius: 6px;
      }
      .home-newest-list-content {
        margin-left: 6px;
        flex: 1 0 0;
        display: flex;
        flex-direction: column;
        .card-content__header--title {
          font-size: 10px;
          font-weight: bold;
          color: rgb(51, 51, 51);
        }
        .card-content__box {
          color: rgb(153, 153, 153);
          font-size: 8px;
          margin-top: 2px;
          flex: 1 0 0;
        }
        .card-content__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          > p {
            border-radius: 4px;
            border: 1px solid #f2382b;
            font-size: 10px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: 400;
            line-height: 1;
            background: #fff1e9;
            text-align: center;
            padding: 4px 2px;
            transform: scale(.85);
            background-image: -webkit-linear-gradient(left,#ff803c,#ed1b24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          >span {
            margin-left: 4px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: 400;
            font-size: 8px;
            color: rgb(153, 153, 153);
          }
          .hok-viewers__text {
            color: rgb(153, 153, 153);
            font-size: 8px;
          }
        }
      }
    }
  }
}
::v-deep {
  .van-tab {
    line-height: 15px;
    font-size: 10px;
    min-width: 34px !important;
    max-width: 55px !important;
  }
  .van-tabs__nav--line.van-tabs__nav--complete {
    padding-right: 4px;
    padding-left: 4px;
  }
  .van-tabs__nav--line {
    padding-bottom: 0px;
  }
  .van-tabs__wrap--scrollable .van-tab {
    padding: 0 6px;
  }
  .van-tabs__line {
    width: 20px;
    height: 3px;
    bottom: 0px;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 25px;
  }
}
</style>
