<template>
  <div>
    <div class="page_header">
      <div class="page_header_title">
        <span class="pointer" @click="$router.push({ path: '/shop/offline' })">线下课程</span>
        /
        <span>线下课程详情</span>
      </div>

      <div v-loading="loading" class="page_header_detail">
        <div class="page_header_detail_img">
          <ImagePreviewer
            style="width: 100%; height: 100%; background: #f5f7fa"
            :src="detail.coverVerticalUrl"
            fit="contain"
            :scale-width="160"
            :scale-height="120"
          />
        </div>
        <div class="page_header_detail_content">
          <div class="content_title">{{ detail.contentName }}</div>
          <div class="desc text_hidden">{{ detail.columnContent }}</div>
          <div class="price-wrapper">
            <span v-if="detail.saleType === 0" class="c_777">免费</span>
            <span v-if="detail.saleType === 1" class="c_777">￥{{ detail.salePrice | filtersMoney }}</span>
            <span v-if="[0, 1].includes(detail.saleType) && [0, 1].includes(detail.saleValidity)" class="c_777">
              /
            </span>
            <span v-if="detail.saleValidity === 0" class="c_777">长期有效</span>
            <span v-if="detail.saleValidity === 1" class="c_777">有效期{{ detail.validityDays }}天</span>
            <el-tag v-if="detail.deliverySubject === 1" size="small">伏羲云交付</el-tag>
            <el-tag v-if="detail.deliverySubject === 2" size="small" type="success">非伏羲云交付</el-tag>
          </div>
          <div class="operate">
            <el-button v-permission="['system:goods:edit', permsList]" size="small" @click="gotoEdit(detail)">编辑</el-button>
            <el-button v-permission="['web:goods:share', permsList]" v-share="`pages/subpage/share/index?id=${$route.params.id}&type=2`" size="small">分享</el-button>

            <el-dropdown>
              <el-button size="small" class="m-l-10">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="detail.shelveFlag !== 2" v-permission="['system:goods:shelf', permsList]" @click.native="goodsShelfBatch(detail)">
                  {{ ['下架', '上架'][detail.shelveFlag] }}
                </el-dropdown-item>
                <el-dropdown-item v-permission="['system:goods:remove', permsList]" @click.native="del(detail)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <div class="page_content">
      <el-tabs v-model="activeName" @tab-click="tabsChange">
        <el-tab-pane label="期数" name="period" />
        <el-tab-pane label="内容管理" name="contentManage" />
        <el-tab-pane label="相关推荐" name="recommend" />
        <!-- <el-tab-pane label="用户评价" name="comment" /> -->
        <!-- <el-tab-pane label="学员管理" name="user" /> -->
        <el-tab-pane label="抖店" name="tiktok" />
        <el-tab-pane label="快手小店" name="kwai" />
        <el-tab-pane label="微店" name="weShop" />
        <el-tab-pane label="小鹅通" name="xiaoetech" />
        <el-tab-pane label="视频号小店" name="videoShop" />
        <el-tab-pane label="枫页小店" name="fyShop" />
        <el-tab-pane label="小红书" name="xiaohongshu" />
        <el-tab-pane label="百度小店" name="baidu" />
        <!-- <el-tab-pane label="练习" name="exercise" /> -->
        <!-- <el-tab-pane label="学员练习" name="exerciseList" /> -->

        <components :is="activeName || 'recommend'" />
      </el-tabs>
    </div>
    <el-drawer
      title="编辑线下课程"
      :visible.sync="visibleFlag"
      direction="rtl"
      size="1200px"
      :before-close="handleClose"
    >
      <edit ref="editDrawwer" :goods-id="goodsIdNowEdit" @close="handleCloseFromZ" />
    </el-drawer>
  </div>
</template>

<script>
import { getGoodsDetail, shelfGoods, delGoodsBatch } from '@/api/course'
import recommend from '../components/recommend.vue'
import exercise from '../components/exercise.vue'
import exerciseList from '../components/exerciseList.vue'
import comment from '../components/comment.vue'
import user from '../components/user.vue'
import tiktok from '../components/tiktok.vue'
import kwai from '../components/kwai.vue'
import weShop from '../components/weShop.vue'
import xiaoetech from '../components/xiaoetech.vue'
import period from './period.vue'
import videoShop from '../components/videoShop.vue'
import fyShop from '../components/fyShop.vue'
import xiaohongshu from '../components/xiaohongshu.vue'
import contentManage from './content.vue'
import edit from './edit.vue'
import baidu from '../components/baidu.vue'
export default {
  name: 'OfflineDetail',
  components: {
    recommend,
    exercise,
    exerciseList,
    comment,
    user,
    tiktok,
    kwai,
    weShop,
    xiaoetech,
    period,
    videoShop,
    fyShop,
    contentManage,
    xiaohongshu,
    edit,
    baidu
  },
  data() {
    return {
      visibleFlag: false,
      goodsIdNowEdit: '',
      loading: false,
      current: 1,
      size: 10,

      detail: {
        contentName: '',
        columnContent: '',
        coverUrl: '',
        saleValidity: '',
        saleType: '',
        salePrice: ''
      },
      activeName: 'period',

      tableData: [],
      id: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    // $route: {
    //   handler(val) {
    //     this.activeName = val.query.type || 'period'
    //   },
    //   deep: true
    // }
  },
  created() {
    this.id = this.$route.params.id
    this.activeName = this.$route.query.type || 'period'
    this.init()
  },
  methods: {
    handleClose() {
      this.visibleFlag = false
    },
    handleCloseFromZ(string) {
      if (string === 'fromSuccess') {
        this.init()
      }
      this.handleClose()
    },
    // 初始化
    init() {
      this.loading = true
      this.getDetail()
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      getGoodsDetail(this.id)
        .then((res) => {
          this.detail = {
            ...this.detail,
            ...res.data
          }
          console.log(this.detail)
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
          const params = {
            goodsIds: [row.goodsId],
            type: row.shelveFlag === 0 ? 1 : 0
          }
          shelfGoods(params).then((res) => {
            this.getDetail()
          })
        }
      })
    },
    // 编辑
    gotoEdit(row) {
      /* console.log(row)
      // this.$router.push({ path: `/course/offlineEdit/${row.goodsId}` })
      this.$AppEditGoods({
        type: 'editOffline',
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getDetail()
        }
      }) */
      this.goodsIdNowEdit = row.goodsId
      this.visibleFlag = true
      this.$nextTick(() => {
        this.$refs.editDrawwer.init()
      })
    },
    // 删除
    del(row) {
      this.$delModal({
        tips: `确定删除这个商品吗？`,
        success: () => {
          this.loading = true
          const params = {
            goodsIds: [row.goodsId]
          }
          delGoodsBatch(params)
            .then((res) => {
              this.loading = false
              this.$router.push({ path: '/course/offline' })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    tabsChange() {
      this.$router.push({
        query: { ...this.$route.query, type: this.activeName }
      })
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
      width: 120px;
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
