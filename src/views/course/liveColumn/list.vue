<template>
  <div class="page_wrap">
    <!-- 专栏列表 -->
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
        <el-button type="text" @click="gotoDetail(row)">详情</el-button>
        <el-button type="text" @click="gotoEdit(row)">编辑</el-button>
        <el-button v-if="row.shelveFlag !== 2" type="text" @click="goodsShelfBatch(row)">
          {{ ['立即下架', '立即上架'][row.shelveFlag] }}
        </el-button>
        <el-button type="text" @click="handlesShare(row)">分享</el-button>
        <!-- <el-button type="text"  >更多</el-button> -->
        <el-button type="text" class="c_red" @click="del(row)">删除</el-button>
      </div>
      <div slot="headerLeft">
        <el-button type="primary" @click="gotoAddLiveColumn()">新建专栏</el-button>
      </div>
      <div slot="headerRight">
        <el-select v-model="shelveFlag" placeholder="请选择" class="m-r-10 w-144">
          <el-option label="全部状态" value="" />
          <el-option label="已上架" :value="0" />
          <el-option label="已下架" :value="1" />
          <el-option label="待上架" :value="2" />
        </el-select>
        <el-input v-model.trim="contentName" placeholder="输入名称" clearable class="w-150 m-r-10 my-search-input" suffix-icon="el-icon-search" @clear="handerSearch" @keyup.enter.native="handerSearch" />
        <el-button type="primary" @click="handerSearch">搜索</el-button>
        <!-- <el-button   @click="$message('暂不支持')">导出</el-button> -->
      </div>

      <div slot="footer">
        <!-- <AppTableTools ref="tableTools" @onAllChange="onAllChange" @onClick="allClick" /> -->
        <el-button v-permission="['system:goods:shelf', permsList]" @click="allClick(0)">上架</el-button>
        <el-button v-permission="['system:goods:shelf', permsList]" @click="allClick(1)">下架</el-button>
        <el-button v-permission="['system:goods:remove', permsList]" @click="allClick(2)">删除</el-button>
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
      <!-- 引用 -->
      <div slot="list" />
      <!-- 图文名称 -->
      <div slot="contentName" slot-scope="{ row }">
        <div class="fl goods-info-wrapper">
          <el-image
            class="m-r-10"
            style="width: 82px; height: 60px;border-radius: 4px;background: #F5F7FA"
            :src="row.patchUrl"
            fit="contain"
            :preview-src-list="[row.patchUrl]"
          />
          <div class="goods-info-detail">
            <div class="titleOptions" @click="gotoDetail(row)">
              {{ row.contentName }}
            </div>
            <div class="price-info">
              <span v-if="row.saleType === 0" class="c_777">免费</span>
              <span v-if="row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</span>
              <span v-if="[0, 1].includes(row.saleType) && [0, 1].includes(row.saleValidity)" class="c_777"> / </span>
              <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
              <span v-if="row.saleValidity === 1" class="c_777">有效期{{ row.validityDays }}天</span>
              <span v-if="row.shelveHideFlag === 1" class="c_777 m-l-10">已隐藏</span>
            </div>
          </div>
        </div>
      </div>

      <div slot="materialGoodsReVo" slot-scope="{ row }">
        <el-popover
          placement="bottom"
          width="400"
          trigger="hover"
        >
          <el-table v-if="row.materialGoodsReVo" :data="row.materialGoodsReVo">
            <el-table-column property="contentName" label="商品名称">
              <template slot-scope="scope">
                <div class="fl goods-info-wrapper">
                  <el-image
                    class="m-r-10"
                    style="width: 82px; height: 60px;border-radius: 4px;background: #F5F7FA"
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
            <i v-if="row.materialGoodsReVo && row.materialGoodsReVo.length" class="el-icon-arrow-down el-icon--right" />
          </div>
        </el-popover>
      </div>

      <!-- 专栏类型 -->
      <div slot="goodsType" slot-scope="{ row }">
        <svg-icon v-if="row.goodsType === 6" icon-class="zhibo" />
        {{
          goodsType_obj[row.goodsType]
        }}
      </div>
    </MPageLayout>

    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="500px"
      width="500px"
      :visible.sync="modal.visible"
    >
      <liveModal
        :type="modal.type"
        :visible.sync="modal.visible"
        @close="closeModal()"
        @success="sendSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import liveModal from '@/components/Modal/live/liveModal'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
import AppClipboard from '@/components/AppClipboard/index.js'
import {
  getGoodsList,
  shelfGoods,
  delGoodsBatch
} from '@/api/course'
export default {
  name: 'PackageColumn',
  components: {
    Modal,
    liveModal,
    // AppTableTools,
    AppStatus
  },
  data() {
    return {
      goodsType: 6, // 0:图片,1:音频，2视频,3专栏，4大专栏, 5线下, 6:直播专栏
      loading: false,
      shelveFlag: '', // 上下架状态;  0: 已上架 1：已下架 2待上架
      contentName: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'contentName', 'shelveFlag', 'shelveTime', 'materialGoodsReVo', 'goodsType'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'contentName', label: '专栏名称', type: 'slot' },
          { prop: 'goodsType', label: '专栏类型', type: 'slot', width: '120' },
          { prop: 'shelveFlag', label: '上架状态', type: 'slot', width: '120' },
          { prop: 'shelveTime', label: '上架时间', type: 'slot', width: '180' },
          { prop: 'materialGoodsReVo', label: '关联商品', type: 'slot', width: '120' },
          { prop: 'action', label: '操作', type: 'slot' }
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
    ...mapGetters([
      'goodsType_obj'
    ])
  },
  mounted() {
    this.init()
  },
  activated() {
    this.getList()
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
        contentName: this.contentName,
        current: this.config.currentPage,
        goodsType: this.goodsType, // 0:图片,1:音频，2图文,3专栏，4大专栏
        shelveFlag: this.shelveFlag,
        size: this.config.pageSize,
        onlineFlag: this.onlineFlag,
        combinationType: 1
      }
      //   getListChat(params).then(res => {
      getGoodsList(params).then(res => {
        console.log(res, '列表信息')
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
    },

    // 打开查看群
    openDetail(row) {
      this.modal = {
        title: '群详情',
        type: 2, // 1: 新增; 2查看; 3编辑;
        visible: true
      }
    //   this.groupStore.getInfo(row.id)
    },
    // 打开管理群
    openEdit(row) {
      this.modal = {
        title: '管理群',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true
      }
    },
    // 删除群
    del(row) {
      this.$delModal({
        tips: `确定删除这个商品吗？`,
        success: () => {
          console.log('删除')
          this.loading = true
          const params = {
            goodsIds: [row.goodsId]
          }
          delGoodsBatch(params).then(res => {
            return this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    // 新增或者编辑成功
    sendSuccess() {
      // this.closeModal()
      // this.$notify({
      //   title: '提示',
      //   message: '操作成功',
      //   type: 'success'
      // })
      // this.init()
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
    // 跳转到新建专栏页面
    gotoAddLiveColumn() {
      console.log('1')
      this.$router.push({ path: '/course/liveColumn/add' })
    },
    handlesShare(row) {
      const vue_app_h5_url = this.$store.getters['institution/orgInfo']?.vue_app_h5_url
      const url = `${vue_app_h5_url}pages/subpage/share/index?id=${row.goodsId}&type=${row.goodsType === 5 ? 2 : 1}`
      AppClipboard.open({ src: url })
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
          shelfGoods(params).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    allClick(index) {
      console.log(index, 'index')
      console.log(this.multipleSelection, 'multipleSelection')
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
              shelfGoods(params).then(res => {
                return this.getList()
              }).catch(() => {
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
              shelfGoods(params).then(res => {
                return this.getList()
              }).catch(() => {
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
              delGoodsBatch(params).then(res => {
                return this.getList()
              }).catch(() => {
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
      if (row.goodsType === 6) {
        this.$router.push({ path: `/course/liveColumn/detail/${row.goodsId}` })
      } else {
        this.$router.push({ path: `/course/packageColumn/columnDetail/${row.goodsId}` })
      }
    },
    // 编辑
    gotoEdit(row) {
      this.$AppEditGoods({
        type: 'editColumn',
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })
      // this.$router.push({ path: `/course/columnEdit/${row.goodsId}` })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  min-width: 1200px;
  height: calc(100vh - 120px);
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  > .header {
    padding: 10px 18px;
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
