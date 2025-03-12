<template>
  <div>
    <div class="page_header">
      <div class="page_header_title">
        <span class="pointer" @click="$router.push({ path: '/course/live' })">直播</span>
        /
        <span>直播详情</span>
      </div>

      <div v-loading="loading" class="page_header_detail">
        <div class="page_header_detail_img">
          <el-image style="width: 100%; height: 100%; background: #f5f7fa" :src="detail.horCoverUrl" fit="contain" />
        </div>
        <div class="page_header_detail_content">
          <div class="content_title">{{ detail.liveName }}</div>
          <div class="desc">
            <span>开播时间:{{ detail.liveStartTime | filterDate }}</span>
            <span class="m-l-10">上架状态: {{ { 0: '已上架', 1: '已下架', 2: '待上架' }[detail.shelveFlag] }}</span>
          </div>
          <div class="price-wrapper">
            <span v-if="detail.materialSaleVo && detail.materialSaleVo.saleType === 0" class="c_777">免费</span>
            <span
              v-if="detail.materialSaleVo && detail.materialSaleVo.saleType === 1"
              class="c_777"
            >￥{{ detail.materialSaleVo.salePrice | filtersMoney }}</span>
            <span v-if="detail.replay && !detail.replayValidity" class="c_777">长期有效</span>
            <span v-if="detail.replay && detail.replayValidity" class="c_777">有效期{{ detail.replayValidity }}</span>
            <span v-if="detail.shelveHideFlag === 1" class="c_777 m-l-10">已隐藏</span>
          </div>
          <div class="operate">
            <el-button>去直播</el-button>
            <el-button @click="editLiveRoom(detail)">编辑</el-button>
            <el-button>开播指引</el-button>
            <el-button v-share="`pages/subpage/share/index?id=${id}&type=1`">分享</el-button>
            <el-button>数据大屏</el-button>
            <el-button>删除</el-button>
            <el-button v-if="detail.shelveFlag === 1" @click.native="goodsShelfBatch(detail)">
              {{ ['下架', '上架'][detail.shelveFlag] }}
            </el-button>

            <!-- <el-dropdown>
              <el-button class="m-l-10">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="detail.shelveFlag !== 2" @click.native="goodsShelfBatch(detail)">
                  {{ ['下架', '上架'][detail.shelveFlag] }}
                </el-dropdown-item>
                <el-dropdown-item>数据大屏</el-dropdown-item>
                <el-dropdown-item @click.native="del(detail)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
      </div>
    </div>

    <div class="page_content">
      <el-tabs v-model="activeName" @tab-click="tabsChange">
        <el-tab-pane label="购物车设置" name="shopCar" />
        <el-tab-pane label="直播间设置" name="liveRoomSetting" />
        <el-tab-pane label="互动设置" name="interactiveSettings" />
        <el-tab-pane label="运营设置" name="operationSetting" />
        <el-tab-pane label="回放设置" name="playbackSetting" />
        <el-tab-pane label="拉流设置" name="pullStreamSettings" />
        <el-tab-pane label="学员" name="user" />
        <el-tab-pane label="讨论设置" name="discuss" />
        <el-tab-pane label="机器人" name="robot" />

        <components :is="activeName || 'shopCar'" />
      </el-tabs>
    </div>

    <!-- 新增/编辑直播间弹框 -->
    <el-drawer
      :title="formDialog.title"
      :visible.sync="formDialog.visible"
      direction="rtl"
      size="auto"
      :destroy-on-close="true"
    >
      <liveDrawer
        :id="formDialog.id"
        :visible="formDialog.visible"
        :type="formDialog.type"
        @success="addRoomAfter"
        @close="formDialog.visible = false"
      />
    </el-drawer>
  </div>
</template>

<script>
import shopCar from './shopCar.vue'
import liveDrawer from './drawer.vue'
import liveRoomSetting from './liveRoomSetting.vue'
import interactiveSettings from './InteractiveSettings.vue'
import operationSetting from './operationSetting.vue'
import playbackSetting from './playbackSetting.vue'
import pullStreamSettings from './pullStreamSettings.vue'
import { getLiveDetail } from '@/api/live/live.js'
import user from './user.vue'
import discuss from './discuss.vue'
import robot from './robot.vue'
export default {
  name: 'AudioDetail',
  components: {
    shopCar,
    liveRoomSetting,
    interactiveSettings,
    operationSetting,
    playbackSetting,
    pullStreamSettings,
    user,
    discuss,
    robot,
    liveDrawer
  },
  data() {
    return {
      loading: false,
      current: 1,
      size: 10,

      detail: {},
      activeName: 'shopCar',

      tableData: [],
      id: '',
      formDialog: {
        title: '新增',
        visible: false,
        id: '', // id, 为空为新增
        type: 1 // 1: 新增 2： 编辑
      }
    }
  },
  watch: {},
  created() {
    this.activeName = this.$route.query.type || 'shopCar'
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.loading = true
      this.id && this.getDetail()
    },
    // 获取详情数据
    getDetail() {
      this.loading = false
      // getGoodsDetail(this.id).then(res => {
      //   this.detail = {
      //     ...this.detail,
      //     ...res.data
      //   }
      //   console.log(this.detail)
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
      const params = {
        id: this.id
      }
      getLiveDetail(params)
        .then((res) => {
          console.log(res)
          this.detail = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    goodsShelfBatch(row) {
      this.$delModal({
        tips: `确定${row.shelveFlag === 0 ? '下架' : '上架'}这个商品吗？`,
        success: () => {
          this.loading = true
          // const params = {
          //   goodsIds: [row.goodsId],
          //   type: row.shelveFlag === 0 ? 1 : 0
          // }
          // shelfGoods(params).then(res => {
          //   this.getDetail()
          // })
        }
      })
    },
    // 编辑
    gotoEdit(row) {
      console.log(row, '点击编辑')
    },
    // 删除
    del(row) {
      this.$delModal({
        tips: `确定删除这个商品吗？`,
        success: () => {
          this.loading = true
          // const params = {
          //   goodsIds: [row.goodsId]
          // }
          // delGoodsBatch(params).then(res => {
          //   this.loading = false
          //   this.$router.push({ path: '/course/audio' })
          // }).catch(() => {
          //   this.loading = false
          // })
        }
      })
    },
    tabsChange() {
      this.$router.push({
        query: { ...this.$route.query, type: this.activeName }
      })
    },
    // 点击编辑直播，打开编辑直播弹框
    editLiveRoom() {
      this.formDialog = {
        title: '编辑',
        type: 2,
        visible: true,
        id: this.detail.id
      }
    },
    addRoomAfter() {
      this.formDialog.visible = false
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
// .page_wrap {
// //   background-color: #fff;
//   border-radius: 4px;
//   padding: 20px 21px;
// }
.page_header {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 21px;

  .page_header_title {
  }

  .page_header_detail {
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    width: 100%;
    height: 160px;
    padding: 20px;
    background-color: #ffffff;
    position: relative;
    box-sizing: border-box;
    .page_header_detail_img {
      min-width: 160px;
      max-width: 160px;
      width: 160px;
      height: 120px;
    }
    .page_header_detail_content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      height: 100%;
      padding-left: 20px;
      .content_title {
        font-size: 16px;
        font-weight: 600;
      }
      .desc {
        font-size: 14px;
        color: #999999;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        // overflow: hidden;
      }
      .price-wrapper {
        display: flex;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #fb6161;
      }
      .operate {
        display: flex;
        font-size: 14px;
      }
    }
  }
}

.page_content {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 4px;
  padding: 10px 21px;
}
</style>
