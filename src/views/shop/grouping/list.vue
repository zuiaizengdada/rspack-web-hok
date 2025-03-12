<template>
  <div class="page_wrap">
    <!-- 商品分组管理列表 -->
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      class="MPageLayout"
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
      <div slot="action" slot-scope="scope">
        <!-- {{scope.row.name}} -->
        <el-button type="text" @click="gotoDetail(scope.row)">详情</el-button>
        <el-button
          v-permission="['system:group:edit', permsList]"
          type="text"
          @click="openEdit(scope.row)"
        >编辑</el-button>
        <el-button
          v-permission="['system:group:remove', permsList]"
          type="text"
          class="c_red"
          @click="del(scope.row)"
        >删除</el-button>
      </div>
      <div slot="headerLeft">
        <!-- <el-button
          v-permission="['system:group:add', permsList]"
          size="small"
          type="primary"
          @click="openAddGroup"
        >创建分组</el-button> -->
      </div>
      <div slot="headerRight">
        <el-select
          slot="prepend"
          v-model="select"
          size="small"
          placeholder="请选择状态"
          clearable
          class="w-120 m-r-10"
          @change="handerSearch()"
        >
          <el-option label="全部" value="" />
          <el-option label="上架" :value="0" />
          <el-option label="下架" :value="1" />
        </el-select>
        <el-select
          slot="prepend"
          v-model="pageName"
          size="small"
          clearable
          placeholder="请选择页面"
          class="w-120 m-r-10"
          @change="handerSearch()"
        >
          <el-option
            v-for="item in groupingType"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictLabel"
          />
        </el-select>
        <el-input
          v-model.trim="search"
          size="small"
          placeholder="输入分组名称"
          clearable
          class="w-200 m-r-10"
          @keyup.enter.native="handerSearch"
          @clear="handerSearch"
        />
        <el-button
          size="small"
          type="primary"
          @click="handerSearch()"
        >搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="init()" />
      </div>

      <div slot="shelveFlag" slot-scope="{ row }">
        <AppStatus :status="row.shelveFlag ? 'error' : 'success'">
          <span>
            {{ row.shelveFlag ? '下架' : '上架' }}
          </span>
        </AppStatus>
      </div>
    </MPageLayout>

    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="600px"
      width="600px"
      :visible.sync="modal.visible"
    >
      <groupingModal
        :type="modal.type"
        :visible.sync="modal.visible"
        :data="modal.data"
        @close="closeModal()"
        @success="sendSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import groupingModal from '@/components/Modal/shop/grouping'
import {
  groupingList,
  addGrouping,
  groupingEdit,
  groupingDel
} from '@/api/shop'
import AppStatus from '@/components/AppStatus'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'GoodsGrouping',
  components: {
    Modal,
    groupingModal,
    AppStatus
  },
  data() {
    return {
      loading: false,
      search: '',
      select: '',
      pageName: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'shelveFlag'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'groupingName', label: '分组名称', type: 'text' },
          { prop: 'pageName', label: '页面名称', type: 'text', width: '120' },
          { prop: 'displayNum', label: '展示数量', type: 'text', width: '160' },
          { prop: 'maxNum', label: '最大数量', type: 'text', width: '160' },
          { prop: 'sort', label: '排序', type: 'text', width: '120' },
          { prop: 'shelveFlag', label: '状态', type: 'slot', width: '120' },
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
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['groupingType'])
  },
  async created() {
    await store.dispatch('option/getGroupingType')
  },
  mounted() {
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
    // 打开新建群
    openAddGroup() {
      this.modal = {
        title: '新建分组',
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
        groupingName: this.search,
        pageName: this.pageName,
        shelveFlag: this.select
      }
      groupingList(params)
        .then(res => {
          console.log(res, '列表数据')
          this.loading = false
          this.config.total = res.data.length
          this.config.tableData = res.data
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
    // 打开管理群
    openEdit(row) {
      this.modal = {
        title: '管理IP',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true,
        data: row
      }
    },
    // 删除
    del(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          this.loading = true
          groupingDel(row.groupingId)
            .then(() => {
              this.init()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    // 新增或者编辑成功
    async sendSuccess(res) {
      this.closeModal()
      this.loading = true
      this.modal.type === 1 ? await addGrouping(res) : await groupingEdit(res)
      this.init()
    },

    handerSearch() {
      this.config.currentPage = 1
      this.config.total = 0
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
    gotoDetail(row) {
      this.$router.push({
        path: `/messageManager/goodsGrouping/${row.groupingId}`,
        query: { addChildFlag: row.addChildFlag, id: row.id }
      })
      // this.$router.push({ path: `detail/${row.groupingId}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  min-width: 1200px;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  .MPageLayout {
    height: 500px;
  }
}
</style>
