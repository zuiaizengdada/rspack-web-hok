<template>
  <div class="page_wrap">
    <div class="shop">
      <div class="setting-hint">
        <span class="new-tip" />
        商品分类功能可帮助您更高效地分类管理商品，让用户更加便捷找到所需商品。
      </div>
    </div>
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        type="tablePage"
        class="tablePageTable"
        row-key="catalogueId"
        :slot-arr="slotArr"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="action" slot-scope="{ row }">
          <el-button
            v-if="(!row.goodsNum&&!row.catalogueVos.length) || row.catalogueVos.length"
            type="text"
            @click="handleItem(row)"
          >查看二级分类</el-button>
          <el-button
            v-if="!row.catalogueVos.length"
            type="text"
            @click="$router.push({ path: `/messageManager/goodsDivision/details/${row.catalogueId}` })"
          >内容管理</el-button>
          <el-button
            v-permission="['system:catalogue:edit', permsList]"
            type="text"
            @click="openEdit(row)"
          >编辑</el-button>
          <el-button
            v-permission="['web:catalogue:share', permsList]"
            v-share="'pages/shop/index/?id=' + row.catalogueId +'&shopId='+organizationId+'&active=1'"
            type="text"
          >分享</el-button>
          <el-button
            v-permission="['system:catalogue:remove', permsList]"
            type="text"
            @click="del(row)"
          >删除</el-button>
        </div>
        <div slot="headerLeft">
          <el-button
            v-permission="['system:catalogue:add', permsList]"
            type="primary"
            size="small"
            @click="openAdd"
          >新建商品分类</el-button>
        </div>
        <div slot="headerRight">
          <el-input
            v-model.trim="search"
            size="small"
            placeholder="请输入商品分类名称"
            clearable
            class="w-200 m-r-10"
            @keyup.enter.native="handerSearch"
            @clear="handerSearch"
          />
          <el-button size="small" type="primary" @click="handerSearch()">搜索</el-button>
          <el-button size="small" icon="el-icon-refresh" @click="init()" />
        </div>

        <div slot="catalogueUrl" slot-scope="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.catalogueUrl"
            :preview-src-list="srcList"
          />
        </div>
      </MPageLayout>
    </div>

    <sonList
      ref="sonListRef"
      :config.sync="sonConfig"
      @handleOpenAdd="openAdd"
      @handleOpenEdit="openEdit"
      @handleDel="del"
    />
    <!-- 弹框层 -->
    <!-- 新建商品分类弹框 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="500px"
      width="500px"
      :visible.sync="modal.visible"
    >
      <goodsDivisionModal
        :data="modal.data"
        :type="modal.type"
        :visible.sync="modal.visible"
        @close="closeModal()"
        @success="sendSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import Modal from '@/components/Modal'
import Sortable from 'sortablejs'
import goodsDivisionModal from '@/components/Modal/shop/goodsDivision.vue'
import sonList from './sonList'
import {
  getCatalogueList,
  addCatalogue,
  delCatalogue,
  updateCatalogue,
  updateCatalogueSort
} from '@/api/shop'
export default {
  name: 'GoodsDivisionList',
  components: {
    Modal,
    goodsDivisionModal,
    sonList
  },
  data() {
    return {
      sonConfig: { visible: false },
      loading: false,
      search: '',
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'catalogueUrl'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'catalogueSort', label: '序号', type: 'text', width: '55' },
          { prop: 'catalogueName', label: '分组名称', type: 'text' },
          { prop: 'catalogueUrl', label: '分组图标', type: 'slot' },
          { prop: 'goodsNum', label: '商品数', type: 'text', width: '120' },
          {
            prop: 'subscription',
            label: '创建时间',
            type: 'text',
            width: '120'
          },
          { prop: 'action', label: '操作', type: 'slot' }
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
      permsList: this.$route.meta.permsList || []
    }
  },

  computed: {
    // 是否全选
    organizationId() {
      return getItem('orgInfo').organizationId
    }
  },

  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.rowZiliaoDrop()
    })
  },
  methods: {
    // 资料行拖拽
    rowZiliaoDrop() {
      const tbody = document.querySelector('.content tbody')
      const that = this
      if (tbody) {
        Sortable.create(tbody, {
          animation: 300,
          draggable: '.el-table__row',
          onEnd({ newIndex, oldIndex }) {
            const currRow = that.config.tableData.splice(oldIndex, 1)[0]
            currRow.catalogueSort = newIndex
            that.config.tableData.splice(newIndex, 0, currRow)
            that.updateCatalogueSort()
          }
        })
      }
    },

    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    async updateCatalogueSort() {
      this.config.tableData = this?.config?.tableData.map((item, index) => ({
        ...item,
        catalogueSort: ++index
      }))
      await updateCatalogueSort({ reqs: this?.config?.tableData })
      // this.getList()
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
    // 打开新建弹框
    openAdd() {
      this.modal = {
        title: '新建商品分类',
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
        catalogueName: this.search
      }
      this.srcList = []
      getCatalogueList(params).then(res => {
        this.config.tableData = res.data
        this.srcList = []
        this.config.tableData.map(v => {
          this.srcList.push(v.catalogueUrl)
        })
        this.loading = false
        this.config.total = res.data.length
      })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
    },
    // 打开管理群
    openEdit(row) {
      this.modal = {
        title: '编辑',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true,
        data: row
      }
    },
    // 查看子类
    handleItem(row) {
      this.sonConfig = { ...row, visible: true }
    },
    // 删除
    del(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          delCatalogue(row.catalogueId).then(() => {
            if (this.sonConfig?.visible) return this.$refs.sonListRef.refresh()
            this.init()
          })
        }
      })
    },

    // 新增或者编辑成功
    async sendSuccess(params) {
      this.closeModal()
      this.loading = true
      // 新增添加上层id
      if (this.modal.type === 1) {
        params = {
          ...params,
          parentId: this.sonConfig?.id
        }
      }

      try {
        this.modal.type === 1
          ? await addCatalogue(params)
          : await updateCatalogue(params)
        if (this.sonConfig?.visible) this.$refs.sonListRef.refresh()
        this.init()
      } catch {
        this.loading = false
      }
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
    }
  }
}
</script>

<style scoped lang='scss'>
.page_wrap {
  min-width: 1200px;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  .page_head {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
  .shop {
    padding: 10px 20px 10px 20px;
    .setting-hint {
      position: relative;
      width: 100%;
      padding: 10px 10px 10px 48px;
      line-height: 24px;
      border-radius: 2px;
      margin: 10px 0;
      font-size: 14px;
      background-color: #f5f7fa;
      color: #333333;
      > .new-tip {
        position: absolute;
        left: 0;
        top: 8px;
        color: #ffffff;
        display: inline-block;
        width: 56px;
        height: 28px;
        font-size: 16px;
        background: #fb6161;
        border-radius: 16px;
        text-align: center;
        line-height: 26px;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
        &::before {
          content: 'new';
        }
      }
    }
  }
  .content {
    height: calc(100vh - 300px);
    overflow: hidden;
  }
}
</style>
