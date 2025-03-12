<template>
  <div>
    <div class="page_header">
      <div class="page_header_title">
        <span class="pointer" @click="$router.push({path: '/messageManager/goodsGrouping/list'})">分组</span>
        /
        <span>分组详情</span>
      </div>

      <div v-loading="loading" class="page_header_detail">
        <div class="page_header_detail_content">
          <div class="content_title">{{ detail.groupingName }}</div>
          <div class="desc text_hidden m-t-20">所属页面: {{ detail.pageName }}</div>
        </div>
      </div>
    </div>

    <div class="page_content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="关联商品" name="1">
          <recommend v-if="!addChildFlag" />
          <recommendOne v-else />
        </el-tab-pane>
        <!-- <el-tab-pane label="学员" name="2">学员</el-tab-pane>
            <el-tab-pane label="运营设置" name="3">运营设置</el-tab-pane>
            <el-tab-pane label="数据分析" name="4">数据分析</el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { groupingDetail } from '@/api/shop'
import { delGoodsBatch, shelfGoods } from '@/api/course'
import recommend from './recommend.vue'
import recommendOne from './recommendOne.vue'
export default {
  name: 'CourseVideoDetail',
  components: {
    recommend,
    recommendOne
  },
  data() {
    return {
      loading: false,
      current: 1,
      size: 10,
      addChildFlag: false,
      detail: {
        contentName: '',
        columnContent: '',
        coverUrl: '',
        saleValidity: '',
        saleType: '',
        salePrice: ''
      },
      activeName: '1',

      tableData: []
    }
  },
  created() {
    this.addChildFlag = this.$route.query.addChildFlag
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.loading = true
      this.getDetail()
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      groupingDetail(this.$route.params.id).then(res => {
        this.detail = {
          ...JSON.parse(JSON.stringify(this.detail)),
          ...res.data
        }
        console.log(this.detail)
        this.loading = false
      }).catch(() => {
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
          shelfGoods(params).then(res => {
            this.getDetail()
          })
        }
      })
    },
    // 编辑
    gotoEdit(row) {
      // this.$router.push({ path: `/offlineEdit/${row.goodsId}` })
      this.$AppEditGoods({
        type: 'editOffline',
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getDetail()
        }
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
          delGoodsBatch(params).then(res => {
            this.loading = false
            this.$router.push({ path: '/offline' })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

    <style lang='scss' scoped>
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

