<template>
  <MCard class="page_wrap">
    <filterTop
      :search="search"
      @onhandleAdd="onhandleAdd"
      @onSearch="searchFn"
      @onClear="onClear"
    />
    <el-table
      ref="MPageLayout"
      v-loading="loading"
      type="tablePage"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="config.tableData"
    >
      <el-table-column
        label="产品名称"
        prop="productName"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        label="产品类别"
        prop="sortLabel"
        min-width="113px"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ renderSortLabel(row) }}
        </template>
      </el-table-column>
      <el-table-column
        label="商品属性"
        prop="goodsAttribute"
        min-width="113px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{
            row.goodsAttribute ? returnGoodsAttribute(row.goodsAttribute) : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="讲师名称"
        prop="teacherName"
        min-width="113px"
        show-overflow-tooltip
      />
      <el-table-column label="商品价格" prop="goodsPrice" min-width="113px">
        <template slot-scope="{ row }">
          <span>￥{{ row.goodsPrice | filtersMoneyByZero }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="课研人员"
        prop="researcherList"
        min-width="113px"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          {{ renderResearcherList(row) }}
        </template>
      </el-table-column>
      <el-table-column label="赠品" center prop="giveawayHas" width="50px">
        <template slot-scope="{ row }">
          <span v-if="row.researchProgress !== 1">
            {{ row.giveawayHas | getOptionsValue(giveawayHasOption) }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="交付主体"
        prop="deliveryMainBody"
        min-width="113px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{
            row.deliveryMainBody
              ? returndeliveryMainBody(row.deliveryMainBody)
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="伏羲云商品ID"
        prop="distributionUserName"
        min-width="140px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.sysGoodsId ? row.sysGoodsId : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="伏羲云分配人"
        prop="distributionUserName"
        min-width="140px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.distributionUserName ? row.distributionUserName : '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="ERP分配人"
        prop="erpDistributionUser"
        min-width="113px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.erpDistributionUser ? row.erpDistributionUser : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="是否完结" prop="completeStatus">
        <template slot-scope="{ row }">
          <span v-if="row.researchProgress !== 1">{{
            row.completeStatus === 0 ? '已完结' : '未完结'
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="研发进度" prop="researchProgress">
        <template slot-scope="{ row }">
          <span v-if="row.researchProgress === 1">制作中</span>
          <span v-if="row.researchProgress === 2">待分配</span>
          <span v-if="row.researchProgress === 3">待上架</span>
          <span v-if="row.researchProgress === 4">已上架</span>
          <span v-if="row.researchProgress === 5">已宣发</span>
          <span v-if="row.researchProgress === 6">已下架</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上架计划"
        prop="expectedClassHour"
        min-width="113px"
        show-overflow-tooltip
      />
      <el-table-column label="宣发周知">
        <template slot-scope="{ row }">
          <span
            v-if="
              row.researchProgress !== 1 &&
                (row.dispersingLink ||
                  (row.dispersingUrlList && row.dispersingUrlList.length))
            "
            style="cursor: pointer; color: #0c6fff"
            @click="onDispersing(row, true)"
          >查看</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="上架地址">
        <template slot-scope="{ row }">
          <span
            v-if="row.researchProgress > 3"
            style="cursor: pointer; color: #0c6fff"
            @click="openGroundingDetail(row.id)"
          >
            查看
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" prop="shelfDate" min-width="113px">
        <template slot-scope="{ row }">
          {{
            row.shelfDate
              ? moment(row.shelfDate).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          }}
        </template>
      </el-table-column>

      <!-- <el-table-column
        label="课程介绍"
        prop="courseIntroduction"
        min-width="113px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.courseIntroduction"
            placement="top"
            popper-class="mw_400"
          >
            <div>
              {{
                row.courseIntroduction.length > 10
                  ? `${row.courseIntroduction.slice(0, 10)}...`
                  : row.courseIntroduction.slice(0, 10)
              }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="素材图地址"
        prop="materialAddress"
        min-width="113px"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.materialAddress"
            placement="top"
            popper-class="mw_400"
          >
            <div>
              {{
                row.materialAddress.length > 10
                  ? `${row.materialAddress.slice(0, 10)}...`
                  : row.materialAddress.slice(0, 10)
              }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>  -->
      <el-table-column label="最后更新时间" prop="updateTime" width="110px">
        <template slot-scope="{ row }">
          {{ moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="最后更新人" prop="updateBy" min-width="113px" />
      <el-table-column label="操作" prop="action" min-width="200" fixed="right">
        <template slot-scope="{ row }">
          <span v-permission="['web:product:finish', permsList]">
            <el-button
              v-if="row.researchProgress === 1"
              style="padding: 0 2px"
              type="text"
              @click="onFinish(row)"
            >制作完成</el-button>
          </span>
          <span v-permission="['web:product:allocation', permsList]">
            <el-button
              v-if="row.researchProgress === 2"
              style="padding: 0 2px"
              type="text"
              @click="onAllocation(row)"
            >分配</el-button>
          </span>
          <span v-permission="['web:product:dispersing', permsList]">
            <el-button
              v-if="row.researchProgress === 4"
              style="padding: 0 2px"
              type="text"
              @click="onDispersing(row)"
            >宣发</el-button>
          </span>
          <span v-permission="['web:product:update', permsList]">
            <el-button
              v-if="
                (row.researchProgress === 5 ||
                  row.researchProgress === 4 ||
                  row.researchProgress === 6) &&
                  row.completeStatus !== 0
              "
              style="padding: 0 2px"
              type="text"
              @click="onUpdate(row)"
            >更新</el-button>
          </span>
          <span v-permission="['web:product:grounding', permsList]">
            <el-button
              v-show="row.researchProgress === 3 || row.researchProgress === 6"
              style="padding: 0 2px"
              type="text"
              @click="onGrounding(row, 1)"
            >上架</el-button>
          </span>
          <span v-permission="['web:product:notes', permsList]">
            <el-button
              v-show="
                row.researchProgress != 1 &&
                  row.researchProgress != 2
              "
              style="padding: 0 2px"
              type="text"
              @click="onNotes(row)"
            >备注</el-button>
          </span>
          <span v-permission="['web:product:offline', permsList]">
            <el-button
              v-show="row.researchProgress === 5 || row.researchProgress === 4"
              style="padding: 0 2px"
              type="text"
              @click="onOffline(row)"
            >下架</el-button>
          </span>
          <span v-permission="['web:product:productEdit', permsList]">
            <el-button
              v-show="row.researchProgress !== 1"
              style="padding: 0 2px"
              type="text"
              :loading="row.editLoading"
              @click="onEdit(row)"
            >产品编辑</el-button>
          </span>
          <span v-permission="['web:product:groundingEdit', permsList]">
            <el-button
              v-show="[4,5].includes(row.researchProgress)"
              style="padding: 0 2px"
              type="text"
              :loading="row.editLoading"
              @click="onEditOne(row)"
            >上架编辑</el-button>
          </span>
          <el-button
            type="text"
            :loading="row.reviewLoading"
            @click="onReview(row)"
          >详情</el-button>
          <el-button
            v-permission="['web:product:del', permsList]"
            style="color: #f53f3f"
            type="text"
            @click="onDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page_footer">
      <div />
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <addDialog ref="addDialog" @successAdd="successAdd" />
    <finishProduct
      ref="finishProduct"
      :row="zhizuoWancRow"
      @successAdd="successAdd"
    />
    <allocationDialog ref="allocationDialog" @successAdd="successAdd" />
    <groundingDialog
      ref="groundingDialog"
      :is-add="isAdd"
      :product-id="productId"
      @success="searchFn"
    />
    <notesDialog ref="notesDialog" @successAdd="successAdd" />
    <dispersingDialog ref="dispersingDialog" @successAdd="successAdd" />
    <updateDialog ref="updateDialog" @successAdd="successAdd" />
    <groundingDetail
      v-model="isShowGroundingDetail"
      :product-id="productId"
      @handleClose="
        () => {
          isShowGroundingDetail = false
        }
      "
    />
  </MCard>
</template>

<script>
// import Dialog from '@/views/product/Dialog/index.js'
import addDialog from '@/views/product/Dialog/addDialog.vue'
import finishProduct from '@/views/product/Dialog/finishProduct.vue'
import allocationDialog from '@/views/product/Dialog/allocationDialog.vue'
import groundingDialog from '@/views/product/Dialog/groundingDialog.vue'
import notesDialog from '@/views/product/Dialog/notesDialog.vue'
import dispersingDialog from '@/views/product/Dialog/dispersingDialog.vue'
import groundingDetail from '@/views/product/productManage/groundingDetail.vue'
import updateDialog from '@/views/product/Dialog/updateDialog.vue'
import filterTop from './filterTop.vue'
import {
  getProductlistAjax,
  productDeleteAjax,
  productDetailByIdAjax,
  productOffine
} from '@/api/product/productManage.js'
import {
  sortLabelOption,
  giveawayHasOption,
  researchProgressOption,
  deliveryMainBodyArray,
  goodsAttributeArray
} from '@/views/product/columns.js'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  components: {
    filterTop,
    addDialog,
    finishProduct,
    allocationDialog,
    groundingDialog,
    notesDialog,
    dispersingDialog,
    updateDialog,
    groundingDetail
  },
  data() {
    return {
      zhizuoWancRow: {},
      permsList: this.$route.meta.permsList || [],
      deliveryMainBodyArray,
      goodsAttributeArray,
      config: {
        tableData: [],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 查询条件
      search: {
        productName: '',
        researchProgress: '',
        researcherId: '',
        teacherName: '',
        goodsId: '',
        sortLabel: ''
      },
      sortLabelOption,
      giveawayHasOption,
      researchProgressOption,
      productId: undefined,
      isShowGroundingDetail: false,
      isAdd: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    openGroundingDetail(id) {
      this.productId = id
      this.isShowGroundingDetail = true
    },
    successAdd() {
      this.getList()
    },
    moment,
    renderResearcherList(row) {
      const arr = row.researcherList
      if (!arr || arr.length === 0) {
        return ''
      }
      const value = arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.sysUserName}`)
        return pre
      }, '')
      return value
    },
    renderSortLabel(row) {
      if (!row.sortLabel) {
        return ''
      }
      const labelArray = row.sortLabel.split(',').map(value => {
        const option = this.sortLabelOption.find(
          option => option.value + '' === value
        )
        return option ? option.label : ''
      })
      return labelArray.join('、')
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        productName: this.search.productName,
        researcherId: this.search.researcherId,
        goodsId: this.search.goodsId,
        sortLabel: this.search.sortLabel,
        researchProgress: this.search.researchProgress,
        teacherName: this.search.teacherName,
        sysGoodsId: this.search.sysGoodsId
      }
      this.loading = true
      getProductlistAjax(data)
        .then(res => {
          if (res.code === 1) {
            res.data.items?.map(v => {
              v.editLoading = false
              v.reviewLoading = false
            })
            this.config.tableData = res.data.items || []

            this.config.total = res.data.total
            this.$nextTick(() => {
              this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onReview(row) {
      this.$router.push(`/product/productDetail?productId=${row.id}`)
      /* row.reviewLoading = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            Dialog.open({
              type: 'AddProduct',
              title: '查看',
              ifEdit: true,
              ifReview: true,
              deliveryMainBodyArray: this.deliveryMainBodyArray,
              goodsAttributeArray: this.goodsAttributeArray,
              row: res.data,
              success: () => {
                Dialog.close()
                this.getList()
              }
            })
          }
        })
        .finally(() => {
          row.reviewLoading = false
        })*/
    },
    returnGoodsAttribute(value) {
      let returnString = ''
      this.goodsAttributeArray.some(item => {
        if (item.value === value) {
          returnString = item.label
        }
      })
      return returnString
    },
    returndeliveryMainBody(value) {
      let returnString = ''
      this.deliveryMainBodyArray.some(item => {
        if (item.value === value) {
          returnString = item.label
        }
      })
      return returnString
    },
    onEditOne(row){
      this.onGrounding(row, 2)
    },
    onEdit(row) {
      this.onFinish(row)
    },
    onDel(row) {
      this.$delModal({
        tips: `请确认删除"${row.productName}"产品？`,
        success: () => {
          this.loading = true
          const params = {
            productId: row.id
          }
          productDeleteAjax(params)
            .then(res => {
              this.loading = false
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {}
      })
    },
    onFinish(row) {
      this.$refs.finishProduct.visible = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            // this.$refs.finishProduct.row = res.data
            this.$refs.finishProduct.loadData(res.data)
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    onOffline(row) {
      this.$delModal({
        tips: `请确认下架"${row.productName}"产品？`,
        success: () => {
          this.loading = true
          const params = {
            productId: row.id
          }
          productOffine(params)
            .then(res => {
              this.loading = false
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {}
      })
    },
    onNotes(row) {
      this.$refs.notesDialog.visible = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            // this.$refs.finishProduct.row = res.data
            this.$refs.notesDialog.loadData(res.data)
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    onGrounding(row, status) {
      this.productId = row.id
      this.isAdd = status === 1
      this.$refs.groundingDialog.visible = true
    },
    onAllocation(row) {
      this.$refs.allocationDialog.visible = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            // this.$refs.finishProduct.row = res.data
            this.$refs.allocationDialog.loadData(res.data)
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    onUpdate(row) {
      this.$refs.updateDialog.visible = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            // this.$refs.finishProduct.row = res.data
            this.$refs.updateDialog.loadData(res.data)
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    onDispersing(row, isReview = false) {
      this.$refs.dispersingDialog.isReview = isReview
      this.$refs.dispersingDialog.visible = true
      productDetailByIdAjax({
        productId: row.id
      })
        .then(res => {
          if (res.code === 1) {
            // this.$refs.finishProduct.row = res.data
            console.log('ddddd:::::::::::::::::::::', res.data)
            this.$refs.dispersingDialog.loadData(res.data)
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    searchFn(search) {
      console.log('hhhhhhhhhhhhhhh', search)
      if (search) {
        this.search = search
      }
      this.config.currentPage = 1
      this.getList()
    },
    onClear() {
      this.search = {
        productName: '',
        researchProgress: '',
        teacherName: '',
        researcherId: '',
        sortLabel: '',
        goodsId: '',
        sysGoodsId: ''
      }
      this.searchFn()
    },
    clsoeAddDialog() {
      this.addConfig.visible = false
      this.getList()
    },
    onhandleAdd() {
      this.$refs.addDialog.visible = true
      /* Dialog.open({
        type: 'AddProduct',
        title: '新增',
        deliveryMainBodyArray: this.deliveryMainBodyArray,
        goodsAttributeArray: this.goodsAttributeArray,
        success: () => {
          Dialog.close()
          this.getList()
        }
      }) */
    },
    handleToShelfAddress(row) {
      const url = row.shelfAddress
      if (!url) return
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  // max-height: 600px;
  min-width: 1000px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
