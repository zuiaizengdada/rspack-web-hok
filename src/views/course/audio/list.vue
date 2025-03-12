<template>
  <div class="page_wrap">
    <!-- 群管理列表 -->
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
      @sort-change="sortChange"
    >
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="gotoDetail(row)">详情</el-button>
        <el-button
          v-permission="['system:goods:edit', permsList]"
          type="text"
          @click="gotoEdit(row)"
        >编辑</el-button>
        <el-button
          v-if="row.shelveFlag !== 2"
          v-permission="['system:goods:shelf', permsList]"
          type="text"
          @click="goodsShelfBatch(row)"
        >
          {{ ['立即下架', '立即上架'][row.shelveFlag] }}
        </el-button>
        <el-button
          v-permission="['web:goods:share', permsList]"
          type="text"
          @click="handlesShare(row)"
        >分享</el-button>
        <!-- <el-button type="text"  >更多</el-button> -->
        <el-button
          v-permission="['system:goods:remove', permsList]"
          type="text"
          class="c_red"
          @click="del(row)"
        >删除</el-button>
      </div>
      <div slot="headerLeft">
        <el-button
          v-permission="['system:goods:add', permsList]"
          size="small"
          type="primary"
          @click="gotoAddVideo()"
        >新建音频</el-button>
        <!-- <el-button   @click="$message('暂不支持')">批量创建</el-button> -->
      </div>
      <div slot="headerRight">
        <el-form :inline="true" size="small">
          <el-form-item label="IP">
            <teacherSelect v-model="form.lecturerId" />
          </el-form-item>
          <el-form-item label="上架状态">
            <el-select v-model="form.shelveFlag" placeholder="请选择">
              <el-option label="全部状态" value="" />
              <el-option label="已上架" :value="0" />
              <el-option label="已下架" :value="1" />
              <el-option label="待上架" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input
              v-model.trim="form.contentName"
              placeholder="输入名称"
              clearable
              suffix-icon="el-icon-search"
              @clear="handerSearch"
              @keyup.enter.native="handerSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="handerSearch"
            >搜索</el-button>
            <!-- <el-button   @click="$message('暂不支持')">导出</el-button> -->
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer">
        <!-- <AppTableTools ref="tableTools" @onAllChange="onAllChange" @onClick="allClick" /> -->
        <el-button
          v-permission="['system:goods:shelf', permsList]"
          @click="allClick(0)"
        >上架</el-button>
        <el-button
          v-permission="['system:goods:shelf', permsList]"
          @click="allClick(1)"
        >下架</el-button>
        <el-button
          v-permission="['system:goods:remove', permsList]"
          @click="allClick(2)"
        >删除</el-button>
      </div>

      <!-- 上架状态 -->
      <div slot="shelveFlag" slot-scope="{ row }">
        <AppStatus :status="['success', 'error'][row.shelveFlag]">
          <span>
            {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
          </span>
        </AppStatus>
      </div>
      <!-- 上架时间 -->
      <div slot="shelveTime" slot-scope="scope">
        <div>{{ scope.row.shelveTime | parseTime }}</div>
      </div>
      <!-- 更新时间 -->
      <div slot="updateTime" slot-scope="scope">
        <div>{{ scope.row.updateTime | parseTime }}</div>
      </div>
      <!-- 引用 -->
      <div slot="list" />
      <!-- 音频名称 -->
      <div slot="contentName" slot-scope="{ row }">
        <div class="fl goods-info-wrapper">
          <ImagePreviewer
            class="m-r-10"
            style="
              width: 60px;
              height: 60px;
              border-radius: 4px;
              background: #f5f7fa;
            "
            :src="row.coverVerticalUrl"
            fit="contain"
            :preview-src-list="[row.coverVerticalUrl]"
          />
          <div class="goods-info-detail">
            <div class="titleOptions" @click="gotoDetail(row)">
              {{ row.contentName }}
            </div>
            <div class="price-info">
              <span v-if="row.saleType === 0" class="c_777">免费</span>
              <span
                v-if="row.saleType === 1"
                class="c_777"
              >￥{{ row.salePrice | filtersMoney }}</span>
              <span
                v-if="
                  [0, 1].includes(row.saleType) &&
                    [0, 1].includes(row.saleValidity)
                "
                class="c_777"
              >
                /
              </span>
              <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
              <span
                v-if="row.saleValidity === 1"
                class="c_777"
              >有效期{{ row.validityDays }}天</span>
              <span
                v-if="row.shelveHideFlag === 1"
                class="c_777 m-l-10"
              >已隐藏</span>
            </div>
          </div>
        </div>
      </div>

      <div slot="materialGoodsReVo" slot-scope="{ row }">
        <el-popover placement="bottom" width="400" trigger="hover">
          <el-table v-if="row.materialGoodsReVo" :data="row.materialGoodsReVo">
            <el-table-column property="contentName" label="商品名称">
              <template slot-scope="scope">
                <div class="fl goods-info-wrapper">
                  <ImagePreviewer
                    class="m-r-10"
                    style="
                      width: 82px;
                      height: 60px;
                      border-radius: 4px;
                      background: #f5f7fa;
                    "
                    :src="scope.row.coverUrl"
                    fit="fill"
                  />
                  <div class="goods-info-detail">
                    <div class="titleOptions">
                      {{ scope.row.contentName }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="100" property="goodsType" label="商品类型">
              <template slot-scope="scope">
                {{ goodsType_obj[scope.row.goodsType] }}
              </template>
            </el-table-column>
          </el-table>
          <div slot="reference">
            {{ row.materialGoodsReVo && row.materialGoodsReVo.length }}
            <i
              v-if="row.materialGoodsReVo && row.materialGoodsReVo.length"
              class="el-icon-arrow-down el-icon--right"
            />
          </div>
        </el-popover>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
import { examineStatusOptions } from '@/utils/enum'
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
import AppClipboard from '@/components/AppClipboard/index.js'
import { getGoodsList, shelfGoods, delGoodsBatch } from '@/api/course'
export default {
  name: 'Audio',
  components: {
    // AppTableTools,
    AppStatus,
    teacherSelect
  },
  data() {
    return {
      goodsType: 1, // 0:图片,1:音频，2音频,3专栏，4大专栏
      loading: false,
      form: {
        lecturerId: '',
        shelveFlag: '',
        contentName: ''
      },
      sortData: {},
      examineStatusOptions,
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'contentName',
        'shelveFlag',
        'shelveTime',
        'updateTime',
        'materialGoodsReVo'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'contentName', width: 280, label: '音频名称', type: 'slot' },
          {
            prop: 'lecturerName',
            slotFn: row =>
              row.lecturerVos?.map(i => i.lecturerName)?.join('、') || '--',
            label: 'IP',
            type: 'text'
          },
          {
            prop: 'salePrice',
            label: '价格',
            type: 'text',
            sortable: 'custom',
            visible: true,
            slotFn: row =>
              row.salePrice ? (row.salePrice / 100).toFixed(2) : '免费'
          },
          { prop: 'shelveFlag', label: '上架状态', type: 'slot' },
          {
            prop: 'shelveTime',
            label: '上架时间',
            sortable: 'custom',
            type: 'slot'
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            sortable: 'custom',
            type: 'slot'
          },
          { prop: 'materialGoodsReVo', label: '关联商品', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot', width: '240' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      multipleSelection: [],
      allChangeType: false,
      onlineFlag: 0,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj'])
  },
  mounted() {
    // this.init()
  },
  activated() {
    this.getList()
  },
  methods: {
    // 分享
    handlesShare(row) {
      const vue_app_h5_url =
        this.$store.getters['institution/orgInfo']?.vue_app_h5_url
      const url = `${vue_app_h5_url}pages/subpage/share/index?id=${row.goodsId}&type=${
        row.goodsType === 5 ? 2 : 1
      }`
      AppClipboard.open({ src: url })
    },
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
    sortChange({ prop, order }) {
      const sortValue = {
        descending: '1',
        ascending: '0'
      }
      this.sortData = {
        BSortFiled: sortValue[order] ? prop : '',
        BSort: sortValue[order]
      }
      this.getList()
    },
    handleSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    // 打开新建群
    openAddGroup() {
      this.modal = {
        title: '新建直播间',
        type: 1,
        visible: true
      }
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        goodsType: this.goodsType, // 0:图片,1:音频，2音频,3专栏，4大专栏
        size: this.config.pageSize,
        onlineFlag: this.onlineFlag,
        lecturerId: this.form.lecturerId,
        contentName: this.form.contentName,
        shelveFlag: this.form.shelveFlag,
        ...this.sortData
      }
      //   getListChat(params).then(res => {
      getGoodsList(params)
        .then(res => {
          console.log(res, '列表信息')
          this.config.tableData = res.data.records
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
    },
    // 删除群
    del(row) {
      console.log(row, 'row')
      this.$delModal({
        tips: `确定删除这个商品吗？`,
        success: () => {
          this.loading = true
          const params = {
            goodsIds: [row.goodsId]
          }
          delGoodsBatch(params)
            .then(res => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    handerSearch() {
      this.config.currentPage = 1
      this.getList()
    },

    // 底部上架下架删除按钮点击事件
    allChange(index) {
      console.log(index, 'index')
    },
    // 底部选中本页
    onAllChange(e) {
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    },
    // 跳转到新建音频页面
    gotoAddVideo() {
      this.$router.push({ path: 'audioAdd' })
    },

    // 商品上下架
    goodsShelfBatch(row) {
      this.$delModal({
        tips: `确定${row.shelveFlag === 0 ? '下架' : '上架'}这个商品吗？`,
        success: () => {
          this.loading = true
          const params = {
            goodsIds: [row.goodsId],
            type: row.shelveFlag === 0 ? 1 : 0
          }
          shelfGoods(params)
            .then(res => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    allClick(index) {
      if (this.multipleSelection.length === 0) {
        return this.$notify.warning({
          title: '警告',
          message: '请先选中商品'
        })
      }
      const goodsIds = []
      this.multipleSelection.map(v => {
        goodsIds.push(v.goodsId)
      })
      switch (index) {
        case 0:
          this.$delModal({
            tips: `确定上架这${this.multipleSelection.length}个商品吗？`,
            success: () => {
              this.loading = true
              const params = {
                goodsIds,
                type: 0
              }
              shelfGoods(params)
                .then(res => {
                  this.getList()
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
          break
        case 1:
          this.$delModal({
            tips: `确定下架这${this.multipleSelection.length}个商品吗？`,
            success: () => {
              this.loading = true
              const params = {
                goodsIds,
                type: 1
              }
              shelfGoods(params)
                .then(res => {
                  return this.getList()
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
          break
        case 2:
          this.$delModal({
            tips: `确定删除这${this.multipleSelection.length}个商品吗？`,
            success: () => {
              console.log('删除')
              this.loading = true
              const params = {
                goodsIds
              }
              delGoodsBatch(params)
                .then(res => {
                  return this.getList()
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
          break
      }
    },

    // 详情
    gotoDetail(row) {
      console.log(row, 'row')
      this.$router.push({ path: `/shop/audio/audioDetail/${row.goodsId}` })
    },
    // 编辑
    gotoEdit(row) {
      this.$AppEditGoods({
        type: 'editAudio',
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })
      // this.$router.push({ path: `/course/audioEdit/${row.goodsId}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  min-width: 1200px;
  height: calc(100vh - 190px);
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  > .header {
    padding: 10px 18px;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .my-search-input {
    ::v-deep {
      .el-input__inner {
        border-radius: 15px;
      }
    }
  }
}
.goods-info-wrapper {
  width: 100%;
  height: 60px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .goods-info-detail {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 100%;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .titleOptions {
      display: flex;
      width: 100%;
      // align-items: center;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
</style>
