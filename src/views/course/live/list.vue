<template>
  <div class="page_wrap">
    <!-- 套餐课列表 -->
    <MPageLayout
      ref="MPageLayout"
      keys="shop_package_list"
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
      <div slot="headerLeft">
        <!--        v-permission="['system:goods:add', permsList]"-->
        <el-button
          size="small"
          type="primary"
          @click="gotoAddVideo()"
        >新增
        </el-button>
      </div>
      <el-form
        slot="headerRight"
        class="header-form"
        :inline="true"
        size="small"
      >
        <el-form-item label="商品名称">
          <el-input
            v-model.trim="form.contentName"
            placeholder="输入商品名称"
            clearable
            suffix-icon="el-icon-search"
            @clear="handerSearch"
            @keyup.enter.native="handerSearch"
          />
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input
            v-model="form.goodsId"
            style="width: 160px"
            clearable
            placeholder="请输入商品ID"
            @blur="handerSearch"
          />
        </el-form-item>
        <el-form-item label="IP">
          <teacherSelect v-model="form.lecturerId" style="width: 160px" />
        </el-form-item>
        <!-- <el-form-item label="审核状态">
          <el-cascader
            v-model="form.douExamineStatus"
            :options="examineStatusOptions"
            style="width: 180px"
            clearable
            placeholder="请选择审核状态"
          />
        </el-form-item> -->
        <el-form-item label="上架状态">
          <el-select
            v-model="form.shelveFlag"
            style="width: 160px"
            placeholder="请选择"
          >
            <el-option label="全部状态" value="" />
            <el-option label="已上架" :value="0" />
            <el-option label="已下架" :value="1" />
            <el-option label="待上架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="隐藏状态">
          <el-select
            v-model="form.shelveHideFlag"
            style="width: 180px"
            placeholder="请选择"
            @change="handerSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="已隐藏" :value="1" />
            <el-option label="未隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="上架日期">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            style="width: 228px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handerSearch"
          >搜索
          </el-button>
          <el-button size="small" @click="handerClrear">重置 </el-button>
          <!-- <el-button   @click="$message('暂不支持')">导出</el-button> -->
        </el-form-item>
      </el-form>
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['system:goods:detail', permsList]"
          type="text"
          @click="gotoDetail(row)"
        >详情
        </el-button>
        <el-button
          v-permission="['system:goods:edit', permsList]"
          type="text"
          @click="gotoEdit(row)"
        >编辑
        </el-button>
        <el-button
          v-permission="['system:goods:copy', permsList]"
          type="text"
          @click="handleCopyGoods(row)"
        >复制
        </el-button>
        <el-button
          v-if="row.shelveFlag !== 2"
          v-permission="['system:goods:shelf', permsList]"
          type="text"
          @click="goodsShelfBatch(row)"
        >
          {{ ['立即下架', '立即上架'][row.shelveFlag] }}
        </el-button>
        <!-- <el-button
          v-permission="['web:goods:share', permsList]"
          type="text"
          @click="handlesShare(row)"
        >分享
        </el-button> -->
        <!-- <el-button
          v-if="row.douExamineStatus !== 2"
          v-permission="['system:goods:douApprove', permsList]"
          type="text"
          @click="handleDouApprove(row)"
        >提交抖音审核
        </el-button> -->
        <!-- <el-button
          v-permission="['system:goods:logs', permsList]"
          type="text"
          @click="handleOpenRecord(row)"
        >提交日志
        </el-button> -->
        <!-- <el-button type="text"  >更多</el-button> -->
        <el-button
          v-permission="['system:goods:remove', permsList]"
          type="text"
          class="c_red"
          @click="del(row)"
        >删除
        </el-button>
      </div>
      <div slot="footer">
        <!-- <AppTableTools ref="tableTools" @onAllChange="onAllChange" @onClick="allClick" /> -->
        <el-button
          v-permission="['system:goods:shelf', permsList]"
          @click="allClick(0)"
        >上架
        </el-button>
        <el-button
          v-permission="['system:goods:shelf', permsList]"
          @click="allClick(1)"
        >下架
        </el-button>
        <el-button
          v-permission="['system:goods:removes', permsList]"
          @click="allClick(2)"
        >删除
        </el-button>
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
      <!-- 图文名称 -->
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
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.contentName"
              placement="top"
            >
              <div class="titleOptions" @click="gotoDetail(row)">
                {{ row.contentName }}
              </div>
            </el-tooltip>

            <div style="display: flex">
              <span style="float: left; width: 20px">ID:</span>
              <span class="fuzhi-font">{{ row.goodsId }}</span>
              <img
                v-clipboard:copy="row.goodsId"
                v-clipboard:success="clipboardSuccess"
                title="复制商品Id"
                style="
                  float: left;
                  cursor: pointer;
                  margin-top: 4px;
                  width: 14px;
                  height: 14px;
                  font-style: normal;
                  margin-left: 10px;
                "
                src="../../../assets/image/coupon/icn_copy.png"
              />
            </div>
            <div class="price-info">
              <!-- <span v-if="row.saleType === 0" class="c_777">免费</span>
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
              </span> -->
              <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
              <span
                v-if="row.saleValidity === 2"
                class="c_777"
              >有效期{{ row.fixedTime }}</span>
              <span
                v-if="row.saleValidity === 1 && row.validityYears == 0"
                class="c_777"
              >有效期{{ row.validityDays }}天</span>
              <span
                v-if="row.saleValidity === 1 && row.validityYears > 0"
                class="c_777"
              >有效期{{ row.validityYears }}年</span>
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

      <!-- 专栏类型 -->
      <div slot="goodsType" slot-scope="{ row }">
        <svg-icon v-if="row.goodsType === 6" icon-class="zhibo" />
        {{ goodsType_obj[row.goodsType] }}
      </div>
      <div slot="douAuditId" slot-scope="{ row }">
        <span style="cursor: pointer" @click="handleCopy(row.douAuditId)">{{
          row.douAuditId || '--'
        }}</span>
      </div>
      <!-- 抖音小程序商品id -->
      <div slot="douProductId" slot-scope="{ row }">
        {{ row.douProductId }}
        <i
          v-if="row.douProductId"
          v-clipboard:copy="row.douProductId"
          v-clipboard:success="clipboardSuccess"
          style="cursor: pointer"
          class="el-icon-document-copy"
        />
      </div>
      <div slot="douExamineStatus" slot-scope="{ row }">
        <el-popover
          :disabled="row.douExamineStatus !== 4"
          placement="bottom"
          trigger="hover"
          @show="handleShow(row)"
        >
          <div v-loading="reasonLoading" class="popover-container">
            失败原因： {{ douReasonList[row.goodsId] }}
          </div>
          <span
            slot="reference"
            :class="`status status${row.douExamineStatus}`"
            class="flex-inline flex-middle"
          >
            <svg-icon
              style="font-size: 22px"
              :icon-class="douExamineStatusEnumColor[row.douExamineStatus]"
            />
            {{ douExamineStatusEnum[row.douExamineStatus] }}
          </span>
        </el-popover>
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
    <douApprove ref="douApprove" @success="getList" />
    <douRecord ref="douRecord" />
    <el-drawer
      :title="copy ? '复制直播课' : '编辑直播课'"
      :visible.sync="visibleFlag"
      direction="rtl"
      size="1200px"
      :before-close="handleClose"
    >
      <edit
        ref="editDrawwer"
        :type="type"
        :goods-id="goodsIdNowEdit"
        @close="handleCloseFromZ"
      />
    </el-drawer>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import edit from './edit'
import liveModal from '@/components/Modal/live/liveModal'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
import douApprove from '../components/douApprove/index'
import douRecord from '../components/douRecord/index'
import { copy } from '@/utils/index'
import { examineStatusOptions } from '@/utils/enum'
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
import clipboard from '@/directive/clipboard/index.js'
import AppClipboard from '@/components/AppClipboard/index.js'
import { getGoodsList, shelfGoods, delGoodsBatch } from '@/api/course'
import { douResult } from '@/api/dou/index'

export default {
  name: 'PackageList',
  components: {
    Modal,
    liveModal,
    AppStatus,
    douApprove,
    douRecord,
    edit,
    teacherSelect
  },
  directives: {
    clipboard
  },
  data() {
    return {
      visibleFlag: false,
      goodsIdNowEdit: '',
      goodsType: 8, // 0:图片,1:音频，2视频,3专栏，4大专栏
      loading: false,
      sortData: {},
      type: 'edit',
      form: {
        shelveHideFlag: '',
        goodsId: '',
        lecturerId: '',
        douExamineStatus: [],
        shelveFlag: '',
        contentName: '',
        goodsType: 8,
        searchDateStart: undefined,
        searchDateEnd: undefined,
        time: ['', '']
      },
      douExamineStatusEnum: {
        1: '待审核',
        2: '审核中',
        3: '审核通过',
        4: '审核不通过'
      },
      examineStatusOptions,
      douExamineStatusEnumColor: {
        1: 'icon_examine1',
        2: 'icon_examine2',
        3: 'icon_examine3',
        4: 'icon_examine4'
      },
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'goodsType',
        'contentName',
        'shelveFlag',
        'shelveTime',
        'updateTime',
        'materialGoodsReVo',
        'douExamineStatus',
        'douAuditId',
        'douProductId'
      ],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'contentName',
            width: 400,
            label: '课程名称',
            type: 'slot',
            visible: true
          },
          {
            prop: 'lecturerName',
            slotFn: row =>
              row.lecturerVos?.map(i => i.lecturerName)?.join('/') || '--',
            label: 'IP',
            type: 'text',
            visible: true
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
          // { prop: 'goodsType', label: '专栏类型', type: 'slot', width: '100' },
          // {
          //   prop: 'douExamineStatus',
          //   label: '审核状态',
          //   type: 'slot',
          //   width: '140'
          // },
          {
            prop: 'shelveFlag',
            label: '上架状态',
            type: 'slot',
            width: '140',
            visible: true
          },
          {
            prop: 'shelveTime',
            label: '上架时间',
            sortable: 'custom',
            width: '180',
            visible: true,
            type: 'slot'
          },
          {
            prop: 'updateTime',
            label: '更新时间',
            sortable: 'custom',
            width: '180',
            visible: true,
            type: 'slot'
          },
          // {
          //   prop: 'materialGoodsReVo',
          //   label: '关联商品',
          //   type: 'slot',
          //   width: '100'
          // },
          // { prop: 'douAuditId', label: '审核ID', type: 'slot', width: '100' },
          // {
          //   prop: 'douProductId',
          //   label: '抖音小程序商品id',
          //   type: 'slot',
          //   width: '200'
          // },
          {
            prop: 'action',
            label: '操作',
            type: 'slot',
            width: '400',
            disable: true
          }
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
      permsList: this.$route.meta.permsList || [],
      douReasonList: {},
      reasonLoading: false,
      copy: false
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj'])
  },
  mounted() {
    this.init()
  },
  activated() {
    this.getList()
  },
  methods: {
    handerClrear() {
      this.form = {
        shelveHideFlag: '',
        goodsId: '',
        lecturerId: '',
        douExamineStatus: [],
        shelveFlag: '',
        contentName: '',
        goodsType: 8,
        searchDateStart: undefined,
        searchDateEnd: undefined,
        time: ['', '']
      }
      this.form.shelveTimeFrom = undefined
      this.form.shelveTimeTo = undefined
      this.init()
    },
    handleDateChange(val) {
      if (val && val.length) {
        this.form.shelveTimeFrom = val[0]
        this.form.shelveTimeTo = val[1]
      } else {
        this.form.shelveTimeFrom = undefined
        this.form.shelveTimeTo = undefined
      }
    },
    handlesShare(row) {
      const vue_app_h5_url =
        this.$store.getters['institution/orgInfo']?.vue_app_h5_url
      const url = `${vue_app_h5_url}pages/subpage/share/index?id=${
        row.goodsId
      }&type=${row.goodsType === 5 ? 2 : 1}`
      AppClipboard.open({ src: url })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleCloseFromZ(string) {
      if (string === 'fromSuccess') {
        this.getList()
      }
      this.handleClose()
    },
    handleDouApprove(row) {
      this.$refs.douApprove.open(row.goodsId)
    },
    handleCopy(val) {
      if (!val) return
      copy(val)
      this.$message.success('复制成功')
    },
    async handleShow(row) {
      if (this.douReasonList[row.goodsId]) return
      this.reasonLoading = true
      const { data } = await douResult(row.goodsId)
      this.douReasonList[row.goodsId] = data.errorMsg
      this.reasonLoading = false
    },
    handleOpenRecord(row) {
      this.$refs.douRecord.open(row.goodsId)
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
        goodsType: this.form.goodsType, // 0:图片,1:音频，2图文,3专栏，4大专栏
        size: this.config.pageSize,
        onlineFlag: this.onlineFlag,
        // combinationType: 1,
        douExamineStatus: this.form.douExamineStatus[1],
        lecturerId: this.form.lecturerId,
        contentName: this.form.contentName,
        shelveFlag: this.form.shelveFlag,
        shelveHideFlag: this.form.shelveHideFlag,
        goodsId: this.form.goodsId,
        shelveTimeFrom: this.form.shelveTimeFrom,
        shelveTimeTo: this.form.shelveTimeTo,
        ...this.sortData
      }
      getGoodsList(params)
        .then(res => {
          this.config.tableData = res.data.records
          this.config.total = Number(res.data.total)
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
    // 跳转到新建图文页面
    gotoAddVideo() {
      this.$router.push({ path: 'add' })
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
      this.$router.push({ path: `/shop/liveCourse/detail/${row.goodsId}` })
    },
    gotoDouEdit(row) {
      this.$AppEditGoods({
        type: 'editColumn',
        goodsId: row.goodsId,
        visible: true,
        isDou: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })

      // this.$router.push({ path: `/course/columnEdit/${row.goodsId}` })
    },
    handleCopyGoods(row) {
      this.goodsIdNowEdit = row.goodsId
      this.visibleFlag = true
      this.copy = true
      this.type = 'copy'
      this.$nextTick(() => {
        this.$refs.editDrawwer.init(true)
      })
    },
    // 编辑
    gotoEdit(row) {
      /* this.$AppEditGoods({
        type: 'editColumn',
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })*/
      this.goodsIdNowEdit = row.goodsId
      this.visibleFlag = true
      this.copy = false
      this.type = 'edit'
      this.$nextTick(() => {
        this.$refs.editDrawwer.init()
      })

      // this.$router.push({ path: `/course/columnEdit/${row.goodsId}` })
    },
    handleClose() {
      this.visibleFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap ::v-deep {
  min-width: 1200px;
  height: calc(100vh - 190px);
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;

  > .header {
    padding: 10px 18px;
  }

  .el-form.header-form {
    padding-left: 40px;
    width: 100%;
    flex: 1;

    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .my-search-input {
    ::v-deep {
      .el-input__inner {
        border-radius: 15px;
      }
    }
  }
}

.status {
  height: 28px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  padding: 0 10px;
}

.status1 {
  background: #eef2f9;
  color: #717f99;
}

.status2 {
  background: #fff2e6;
  color: #ff7d00;
}

.status3 {
  background: #e6f7ea;
  color: #00b42a;
}

.status4 {
  background: #feecec;
  color: #f53f3f;
}

.popover-container {
  .text {
    margin-bottom: 15px;
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
      width: 100%;
      // align-items: center;
      max-width: 90%;
      max-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}

.fuzhi-font {
  display: inline-block;
  margin-left: 2px;
  width: 260px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
