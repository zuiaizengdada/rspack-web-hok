<template>
  <div class="page_wrap">
    <!-- 讲师管理列表 -->
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="action" slot-scope="scope">
        <!-- {{scope.row.name}} -->
        <el-button
          v-permission="['system:lecturer:edit', permsList]"
          type="text"
          @click="openEdit(scope.row)"
        >管理IP</el-button>
        <el-button
          v-permission="['system:lecturer:remove', permsList]"
          type="text"
          style="color: red"
          @click="del(scope.row)"
        >删除IP</el-button>
      </div>
      <div slot="headerLeft">
        <el-button
          v-permission="['system:lecturer:add', permsList]"
          type="primary"
          @click="openAddGroup"
        >创建IP</el-button>
      </div>
      <div slot="headerRight">
        <!-- <el-button>表格筛选</el-button> -->
        <el-input
          v-model.trim="search"
          placeholder="输入IP名称"
          clearable
          class="w-200 m-r-10"
          @keyup.enter.native="handerSearch"
          @clear="handerSearch"
        />
        <el-button type="primary" @click="handerSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="init()" />
      </div>

      <div slot="lecturerState" slot-scope="{ row }">
        <AppStatus :status="row.lecturerState ? 'error' : 'success'">
          <span>
            {{ row.lecturerState ? '隐藏' : '显示' }}
          </span>
        </AppStatus>
      </div>

      <div slot="lecturerName" slot-scope="scope">
        <div class="nickName">
          <AppAvatar
            :avatar="scope.row.headUrl"
            :name="scope.row.lecturerName"
            width="45"
            :no-name="true"
          />
          <div class="m-l-10">
            <div>{{ scope.row.lecturerName }}</div>
          </div>
        </div>
      </div>

      <!-- 背景图 -->
      <div slot="coverUrl" slot-scope="{ row }">
        <div>
          <el-image
            style="width: 80px; height: 60px"
            :src="row.coverUrl"
            fit="contain"
            :preview-src-list="[row.coverUrl]"
          />
        </div>
      </div>

      <!-- 封面图 -->
      <div slot="backgroundUrl" slot-scope="{ row }">
        <div>
          <el-image
            style="width: 80px; height: 60px"
            :src="row.backgroundUrl"
            fit="contain"
            :preview-src-list="[row.backgroundUrl]"
          />
        </div>
      </div>

      <div slot="sort" slot-scope="{ row }">
        <el-popover v-model="row.visible" placement="bottom" width="240">
          <p>
            序号
            <el-input
              v-model.trim="sortChange"
              class="w-80"
              type="number"
              :min="0"
            />
            <el-tooltip
              class="item"
              effect="dark"
              content="序号越小越靠前"
              placement="top-start"
            >
              <i class="el-icon-info m-l-10" />
            </el-tooltip>
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="text" @click="showSort(row)">取消</el-button>
            <el-button type="primary" @click="sort(row)">确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="text"
            @click="sortChange = row.sort"
          >{{ row.sort }}</el-button>
        </el-popover>
      </div>
    </MPageLayout>

    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="900px"
      width="900px"
      :visible.sync="modal.visible"
    >
      <lecturerModal
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
import lecturerModal from '@/components/Modal/shop/teacher'
import { getTeacherPage, addTeacher, editTeacher, delTeacher } from '@/api/shop'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppStatus from '@/components/AppStatus'
export default {
  name: 'Teacher',
  components: {
    Modal,
    lecturerModal,
    AppStatus,
    AppAvatar
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
        'lecturerState',
        'coverUrl',
        'backgroundUrl',
        'coverUrl',
        'backgroundUrl',
        'lecturerName',
        'sort'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'lecturerName', label: 'IP名称', type: 'slot' },
          { prop: 'lecturerLabel', label: '标签', type: 'text' },
          { prop: 'coverUrl', label: '封面图', type: 'slot', width: '160' },
          // { prop: 'backgroundUrl', label: '背景图', type: 'slot', width: '160' },
          // { prop: 'briefIntroductionOne', label: '老师简介1', type: 'text', width: '120' },
          // { prop: 'briefIntroductionTwo', label: '老师简介2', type: 'text', width: '120' },
          // { prop: 'briefIntroductionThree', label: '老师简介3', type: 'text', width: '120' },
          // { prop: 'content', label: '详情介绍', type: 'text', width: '120' },
          { prop: 'sort', label: '排序', type: 'slot', width: '120' },
          { prop: 'lecturerState', label: '状态', type: 'slot', width: '120' },
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
      sortChange: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    showSort(row) {
      row.visible = false
    },
    sort(row) {
      row.visible = false
      this.loaidng = true
      const data = {
        lecturerId: row.lecturerId,
        sort: this.sortChange
      }
      editTeacher(data)
        .then(res => {
          this.sortChange = ''
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
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
        title: '新建IP',
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
        size: this.config.pageSize,
        lecturerName: this.search,
        current: this.config.currentPage,
        startTime: '',
        endTime: ''
      }
      getTeacherPage(params)
        .then(res => {
          console.log(res, '列表数据')
          this.loading = false
          this.config.total = res.data.total
          this.config.tableData = res.data.records
        })
        .catch(() => {
          this.loading = false
        })
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
      this.modal = {
        title: '管理IP',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true,
        data: JSON.parse(JSON.stringify(row))
      }
    },
    // 删除群
    del(row) {
      //   const ids = [row.id]
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          this.loading = true
          delTeacher(row.lecturerId)
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
      try {
        this.modal.type === 1 ? await addTeacher(res) : await editTeacher(res)
      } catch (e) {
        this.loading = false
        console.log(e)
      }
      this.init()
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

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
}
.nickName {
  display: flex;
  align-items: center;
}
</style>
