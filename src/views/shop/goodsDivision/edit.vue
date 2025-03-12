<template>
  <div class="page_wrap">
    <div class="page_wrap_header">
      <div class="division-info">
        <div class="shop-name" :title="catalogueInfo.catalogueName">
          {{ catalogueInfo.catalogueName || '--' }}
        </div>
        <div class="edit-share">
          <el-button
            v-permission="['system:catalogue:edit', permsList]"
            type="text"
            @click="editCatalogue()"
          >编辑</el-button>
          <el-divider direction="vertical" />
          <el-button
            v-permission="['web:catalogue:share', permsList]"
            v-share="'courseList/' + catalogueInfo.catalogueId"
            type="text"
          >分享</el-button>
          <el-divider direction="vertical" />
          <el-dropdown>
            <el-button
              v-permission="['system:catalogue:remove', permsList]"
              type="text"
            >更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="_delCatalogue">删除</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="edit-create-time">
          创建时间：{{ catalogueInfo.createTime || '暂无' }}
        </div>
      </div>
    </div>
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
        checkbox
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="action" slot-scope="{ row }">
          <el-popover
            v-model="row.visible"
            v-permission="['system:grouping:add', permsList]"
            placement="bottom"
            width="240"
          >
            <p>
              排列至第
              <el-input v-model.trim="sortChange" class="w-80" />
              位
            </p>
            <div style="text-align: right; margin: 0">
              <el-button type="text" @click="showSort(row)">取消</el-button>
              <el-button type="primary" @click="sort(row)">确定</el-button>
            </div>
            <el-button
              slot="reference"
              type="text"
              class="m-r-10"
            >排序</el-button>
          </el-popover>
          <el-button
            v-permission="['web:grouping:share', permsList]"
            v-share="
              `share?id=${row.goodsId}&type=${row.goodsType < 5 ? 1 : 2}`
            "
            type="text"
          >分享</el-button>
          <el-button
            v-permission="['system:grouping:edit', permsList]"
            type="text"
            @click="del(row)"
          >移出分类</el-button>
        </div>
        <div slot="headerLeft">
          <el-button
            v-permission="['system:grouping:add', permsList]"
            type="primary"
            @click="openAdd"
          >添加商品</el-button>
        </div>
        <div slot="headerRight">
          <el-input
            v-model.trim="search"
            placeholder="请输入商品名称"
            clearable
            class="w-200 m-r-10"
            @keyup.enter.native="handerSearch"
            @clear="handerSearch"
          />
          <el-button type="primary" @click="handerSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="init()" />
        </div>

        <!-- 商品名称 -->
        <div slot="contentName" slot-scope="{ row }">
          <div class="item-wrapper">
            <ImagePreviewer
              class="image-previewer"
              :src="row.coverVerticalUrl"
              alt=""
            />
            <div class="item-info">
              <div class="item-name">{{ row.contentName }}</div>
              <div
                v-if="row.materialSaleVo && row.materialSaleVo.saleType === 0"
                class="item-price"
              >
                免费
              </div>
              <div
                v-if="row.materialSaleVo && row.materialSaleVo.saleType === 2"
                class="item-price"
              >
                加密
              </div>
              <div
                v-if="row.materialSaleVo && row.materialSaleVo.saleType === 1"
                class="item-price"
              >
                ￥{{ row.materialSaleVo.salePrice | filtersMoney }}
              </div>
            </div>
          </div>
        </div>

        <!-- 商品类型 -->
        <div slot="goodsType" slot-scope="{ row }">
          {{ goodsType_obj[row.goodsType] }}
        </div>

        <!-- 商品状态 -->
        <div slot="shelveFlag" slot-scope="{ row }">
          <AppStatus :status="['success', 'error'][row.shelveFlag]">
            <span>
              {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
            </span>
          </AppStatus>
        </div>
        <div slot="footer">
          <el-button @click="handleDel">批量删除</el-button>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import {
  goodsGroupingPage,
  catalogueDetail,
  delGoodsGrouping,
  sortgoods,
  updateCatalogue,
  addGoodsGrouping,
  delCatalogue,
  removeBatch
} from '@/api/shop'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
export default {
  name: 'GoodsDivisionEdit',
  components: {
    AppStatus
  },
  data() {
    return {
      loading: false,
      search: '',
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'contentName',
        'goodsType',
        'shelveFlag'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'contentName', label: '商品名称', type: 'slot' },
          { prop: 'goodsType', label: '类型', type: 'slot', width: '180' },
          { prop: 'shelveFlag', label: '状态', type: 'slot', width: '180' },
          { prop: 'sort', label: '序号', type: 'text', width: '180' },
          { prop: 'action', label: '操作', type: 'slot', width: '240' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '新建商品分类',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false,
        data: {} // 详情数据
      },
      multipleSelection: [],
      allChangeType: false,
      srcList: [],
      // 分组详情信息
      catalogueInfo: {
        catalogueName: '--',
        createTime: '',
        goodsNum: '',
        catalogueId: '',
        catalogueSort: '',
        catalogueUrl: ''
      },
      sortChange: '', // 排序的目标值
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj'])
  },
  created() {
    console.log(this.$route.meta.permsList)
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.$refs.tableTools &&
        this.$refs.tableTools.handleChangeType(
          val.length === this.config.tableData.length
        )
      this.multipleSelection = val
    },
    handleDel() {
      if (!this.multipleSelection.length) {
        this.$notify.warning({
          title: '提示',
          message: '请勾选后再进行操作'
        })
        return
      }
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}条数据吗？`,
        success: () => {
          this.loading = true

          const groupingIds = this.multipleSelection.map(i => i.groupingId)
          removeBatch({ groupingIds })
            .then(res => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击添加商品
    openAdd() {
      const check = []
      this.config.tableData.map(v => check.push(v.goodsId))
      this.$SelectGoods({
        visible: true,
        check: check,
        tabList: [
          // { id: '0', name: '图文', api: '' },
          // { id: '1', name: '音频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        multiple: true,
        success: res => {
          if (!res.length) return
          this.loading = true
          const data = []
          res.map(v => {
            data.push({
              catalogueId: this.$route.params.id,
              goodsId: v.goodsId
            })
          })
          addGoodsGrouping({ list: data })
            .then(res => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    getList() {
      this.loading = true
      const params = {
        catalogueId: this.$route.params.id,
        current: this.config.currentPage,
        size: this.config.pageSize,
        contentName: this.search
      }
      goodsGroupingPage(params)
        .then(res => {
          res.data.records.map(v => {
            v.visible = false
          })
          this.config.tableData = res.data.records
          this.loading = false
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
      this.getDetail()
    },
    // 获取分组详情
    getDetail() {
      return catalogueDetail(this.$route.params.id).then(res => {
        console.log(res, '分组详情信息')
        this.catalogueInfo = res.data
      })
    },
    // 商品移除
    del(row) {
      this.$delModal({
        tips: '确定移除?',
        success: () => {
          delGoodsGrouping(row.groupingId).then(res => {
            this.getList()
          })
        }
      })
    },
    // 商品排序
    sort(row) {
      row.visible = false
      this.loaidng = true
      const params = {
        catalogueId: this.$route.params.id,
        goodsId: row.goodsId,
        sort: this.sortChange
      }
      sortgoods(params).then(res => {
        this.getList()
      })
    },
    // 商品展示排序弹框
    showSort(row) {
      row.visible = false
    },
    // 分组编辑
    editCatalogue() {
      this.$AppEditName({
        title: '请输入分类名称',
        maxlength: 30,
        defaultValue: this.catalogueInfo.catalogueName,
        success: value => {
          this.loading = true
          const param = {
            catalogueId: this.catalogueInfo.catalogueId,
            catalogueName: value
          }
          return updateCatalogue(param)
            .then(res => {
              return this.getDetail()
            })
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 搜索
    handerSearch() {
      this.getList()
    },
    // 删除分组
    _delCatalogue() {
      this.loading = true
      delCatalogue(this.catalogueInfo.catalogueId)
        .then(res => {
          this.$router.push({ name: 'GoodsDivisionList' })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
  // height: 100vh;
  height: calc(100vh - 100px);
  background-color: #fff;
  border-radius: 4px;
  .page_wrap_header {
    padding: 20px 20px 0;
    .division-info {
      width: 100%;
      padding: 10px;
      background: #f5f5f5;
      .shop-name {
        display: inline-block;
        line-height: 22px;
        color: #333;
        font-weight: 600;
        font-size: 14px;
      }
      .edit-share {
        float: right;
        line-height: 20px;
        font-size: 14px;
      }
      .edit-create-time {
        margin-top: 5px;
        font-size: 12px;
        color: #888;
      }
    }
  }
  .content {
    height: calc(100% - 80px);
  }
}

.item-wrapper {
  display: flex;
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 1;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  > .image-previewer {
    width: 60px;
    height: 60px;
    border-radius: 2px;
    margin-right: 10px;
    border: 0;
    vertical-align: middle;
  }
  .item-info {
    max-width: 550px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    .item-name {
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 6px;
      color: #353535;
    }
    .item-price {
      height: 22px;
      line-height: 22px;
      display: inline-block;
      color: #fb6161;
    }
  }
}
</style>
