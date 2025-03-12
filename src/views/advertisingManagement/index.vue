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
      if-index
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="action" slot-scope="scope">
        <!-- {{scope.row.name}} -->
        <el-button type="text" @click="openDetail(scope.row)">查看直播间</el-button>
        <el-button type="text" @click="openEdit(scope.row)">管理直播间</el-button>
        <el-button type="text" style="color: red" @click="del(scope.row)">删除直播间</el-button>
      </div>
      <div slot="headerLeft">
        <el-button type="primary" @click="openAddGroup">创建直播间</el-button>
      </div>
      <div slot="headerRight">
        <el-input v-model.trim="search" placeholder="输入直播间名称" clearable class="w-200 m-r-10" @keyup.enter.native="handerSearch" />
        <el-button type="primary" @click="handerSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="init()" />
      </div>

      <div slot="footer">
        <AppTableTools ref="tableTools" @onAllChange="onAllChange" @onClick="allChange" />
      </div>

      <div slot="tenantName" slot-scope="scope">
        <AppAvatar :name="scope.row.tenantName" width="35" />
      </div>

      <div slot="managerName" slot-scope="scope">
        <AppAvatar :name="scope.row.managerName" width="35" />
      </div>

      <div slot="status" slot-scope="scope">
        <el-button v-if="scope.row.status === 1" type="text" icon="el-icon-s-platform" style="color:#67C23A">直播中</el-button>
        <el-button v-if="scope.row.status === 0" type="text">未开始</el-button>
        <el-button v-if="scope.row.status === 2" type="text" disabled>已结束</el-button>
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
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import store from '@/store'
export default {
  components: {
    Modal,
    liveModal,
    AppAvatar,
    AppTableTools
  },
  data() {
    return {
      loading: false,
      search: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'tenantName', 'managerName', 'status'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'name', label: '直播间名称', type: 'text' },
          { prop: 'tenantName', label: 'IP', type: 'slot', width: '120' },
          { prop: 'managerName', label: '创建人', type: 'slot', width: '120' },
          { prop: 'status', label: '状态', type: 'slot', width: '120' },
          { prop: 'userCount', label: '直播间人数', type: 'text', width: '80' },
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
      allChangeType: false
    }
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
      this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
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
      //   const params = {
      //     chatType: 1, // 企业群
      //     keyWord: this.search,
      //     pageIndex: this.config.currentPage,
      //     pageSize: this.config.pageSize
      //   }
      //   getListChat(params).then(res => {
      this.loading = false
      this.config.tableData = [
        {
          name: '测试',
          status: 1,
          tenantName: '皮卡丘',
          userCount: 2,
          managerName: '小智'
        },
        {
          name: '测试',
          status: 0,
          tenantName: '皮卡丘',
          userCount: 2,
          managerName: '小智'
        },
        {
          name: '测试',
          status: 2,
          tenantName: '皮卡丘',
          userCount: 2,
          managerName: '小智'
        }
      ]
      this.config.total = 3
    //   }).catch(() => {
    //     this.loading = false
    //   })
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
      // this.$Select({
      //   type: 'group',
      //   visible: true,
      //   multiple: false,
      //   params: { chatType: '' },
      //   success: (res) => {
      //   }
      // })
      // console.log(row)
    //   this.groupStore.getInfo(row.id)
      this.modal = {
        title: '管理群',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true
      }
    },
    // 删除群
    del(row) {
    //   const ids = [row.id]
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
        }
      })
    },

    // 新增或者编辑成功
    sendSuccess() {
      console.log(store)
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
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: 100%;
  overflow: auto;
}
</style>
