<template>
  <div class="p5">
    <!-- 营销工具 -->
    <p5Header />
    <div class="p5_content">
      <liveLoading :visible="loading" />
      <div class="p5_content_box">
        <el-tabs v-if="marketingToolbar.length > 0" v-model="actionTabs">
          <el-tab-pane
            v-for="item in marketingToolbar"
            :key="item.key"
            :label="item.label"
            :name="item.key"
          >
            <div slot="label" class="tabsHeader">
              <MTips
                v-if="item.tips"
                :img-src="tipsImg"
                :text="item.label"
                :tips="item.tips"
                align="center"
              >
                {{ item.label }}
              </MTips>
              <template v-else>
                {{ item.label }}
              </template>
              <div
                v-if="item.key === 'liveToolPopularity'"
                class="heatStatus"
                :class="`heatStatus${ifHeatIng}`"
              >
                {{
                  { 0: '未加热', 1: '未开始', 2: '加热中', 3: '加热结束' }[
                    ifHeatIng || 0
                  ]
                }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div v-if="actionTabs" class="tabsContent">
          <keep-alive>
            <component :is="actionTabs" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liveLoading from '../components/loading/index.vue'
import p5Header from './p5Header.vue'
import liveToolAnnouncement from '@/views/live/liveRoomV2/components/liveToolAnnouncement'
import liveToolCoupon from '@/views/live/liveRoomV2/components/liveToolCoupon'
import liveToolDesensitization from '@/views/live/liveRoomV2/components/liveToolDesensitization'
import liveToolLianmaiRecord from '@/views/live/liveRoomV2/components/liveToolLianmaiRecord'
import liveToolLottery from '@/views/live/liveRoomV2/components/liveToolLottery'
import liveToolPlaceOrder from '@/views/live/liveRoomV2/components/liveToolPlaceOrder'
import liveToolPopularity from '@/views/live/liveRoomV2/components/liveToolPopularity'
import liveToolPurchaseRecord from '@/views/live/liveRoomV2/components/liveToolPurchaseRecord'
import liveToolReservation from '@/views/live/liveRoomV2/components/liveToolReservation'
import liveToolSign from '@/views/live/liveRoomV2/components/liveToolSign'
import { getLiveRoomHeatDetail } from '@/api/liveRoom/index.js'
import { mapState } from 'vuex'
export default {
  components: {
    liveLoading,
    p5Header,
    liveToolSign,
    liveToolReservation,
    liveToolPurchaseRecord,
    liveToolPopularity,
    liveToolPlaceOrder,
    liveToolLottery,
    liveToolLianmaiRecord,
    liveToolDesensitization,
    liveToolCoupon,
    liveToolAnnouncement
  },
  inject: ['getMarketingToolbar'],
  data() {
    return {
      loading: false,
      actionTabs: '',
      ifHeatIng: 0, // 加热状态
      tipsImg: require('../../../../assets/image/liveRoom/tips.png'),
      liveRoomId: this.$route.params.id
    }
  },
  computed: {
    marketingToolbar() {
      return this.getMarketingToolbar().filter(v => {
        return v.show()
      })
    },
    ...mapState({
      activeChangeType: state => state.im.activeChangeType
    })
  },
  watch: {
    marketingToolbar: {
      handler(val) {
        console.log(val, 'valvalval')
        if (val.length > 0) {
          this.actionTabs = val[0].key
        }
      },
      deep: true,
      immediate: true
    },
    activeChangeType: {
      handler(val) {
        console.log(val, 'val')
        if (val.type === 'HEAT_PEOPLE_STATUS_CHANGE') {
          this.getDetail()
        }
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    handleCommand(res) {
      console.log(res, 'res')
    },
    getDetail() {
      getLiveRoomHeatDetail(this.liveRoomId).then(res => {
        this.ifHeatIng = res.data.heatStatus
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.p5 {
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .p5_content {
    position: relative;
    flex: 1 0 0;
    overflow: hidden;
    background: #fff;
    // padding: 0 10px;
    .p5_content_box_scroll {
      height: 100%;
    }
    .p5_content_box {
      height: 100%;
    }
    .tabsContent {
      height: calc(100% - 43px);
      // height: 100%;
    }
  }
}
.tabsHeader {
  width: 100%;
  position: relative;
  .heatStatus {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px 0;
    background: #525356;
    color: #ffffff;
    font-size: 8px;
    padding: 0 3px;
    height: 12px;
    line-height: 12px;
  }
  .heatStatus2 {
    background: #ff6f16;
  }
}
.m-r-8 {
  margin-right: 8px;
}
::v-deep {
  .el-tabs {
    // height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-tabs__content {
    padding: 0;
    height: 100%;
  }
  .el-tab-pane {
    height: 100%;
  }
  .app-avatar {
    display: inline-block;
    transform: translateY(-2px);
  }
  .el-tabs__header {
    margin: 0;
    padding: 0 15px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #f2f2f2;
  }
  .el-tabs__item {
    padding: 0 5px;
  }
  .tabsHeader {
    width: 100%;
    border-radius: 5px;
    background: #f7f7f7;
    height: 34px;
    float: left;
    width: 116px;
    text-align: center;
    line-height: 34px;
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: bolder;
    line-height: 34px;
    .tips {
      .tipsText {
        line-height: 34px;
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: bolder;
        line-height: 34px;
      }
    }
    &:hover {
      background: #deebff;
    }
  }
  .el-tabs__active-bar {
    opacity: 0;
  }
  .el-tabs__nav {
    height: 44px;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 34px;
  }
  .is-active {
    .tabsHeader {
      background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
    }
  }
}
::v-deep {
  .el-input__inner {
    color: #000;
  }
}
</style>
