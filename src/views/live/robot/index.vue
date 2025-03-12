<template>
  <MCard class="page_wrap">
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
    >
      <template slot="search">
        <div class="m-t-20 p-b-20 searchTop">
          <div>
            <span class="formLabel">用户昵称</span>
            <el-input
              v-model.trim="search.userName"
              class="w-200 m-r-20"
              size="small"
              clearable
              @keyup.enter.native="searchFn"
              @clear="searchFn"
            />
            <span class="formLabel">用户身份</span>
            <el-select
              v-model="search.userIdentity"
              placeholder="请选择"
              clearable
              size="small"
              @change="searchFn"
            >
              <el-option label="学员" :value="1" />
              <el-option label="助教" :value="2" />
              <el-option label="讲师" :value="3" />
            </el-select>
            <el-button
              size="small"
              class="m-l-20"
              type="primary"
              style="margin-left: 27px"
              @click="searchFn"
            >查询</el-button>
            <el-button
              size="small"
              class="m-l-20"
              style="margin-left: 16px"
              @click="onhanldeClear"
            >重置</el-button>
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="onhandleAdd"
            ><i class="el-icon-plus" />新增用户</el-button>
          </div>
        </div>
      </template>
      <template slot="robotHeadPic" slot-scope="{ row }">
        <AppAvatar
          :avatar="row.robotHeadPic"
          :name="row.robotNickName"
          :width="36"
          :no-name="true"
        />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="onhandleEdit(row)">编辑</el-button>
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="onhandleDel(row)"
        >删除</el-button>
      </template>
      <template slot="userIdentity" slot-scope="{ row }">
        <el-tag
          :type="renderRoleType(row.userIdentity).type"
          size="small"
          :effect="row.userIdentity === 1 ? 'plain' : 'dark'"
        >{{ renderRoleType(row.userIdentity).role }}</el-tag>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
    <editDialog :config="editConfig" @success="closeEditDialog" />
  </MCard>
</template>

<script>
import addDialog from './addDialog.vue'
import editDialog from './editDialog.vue'
import { getRobot, deleteRobot } from '@/api/liveRoom/robot'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import moment from 'moment'
export default {
  components: {
    addDialog,
    editDialog,
    AppAvatar
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'robotHeadPic', 'userIdentity'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'robotId', label: '用户ID', type: 'text' },
          { prop: 'robotHeadPic', label: '用户头像', type: 'slot' },
          { prop: 'userIdentity', label: '用户身份', type: 'slot' },
          { prop: 'robotNickName', label: '用户昵称', type: 'text' },
          { prop: 'createUserName', label: '创建人', type: 'text' },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            render: row => {
              return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          { prop: 'action', label: '操作', type: 'slot', width: '200px' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: {
        userName: '',
        userIdentity: ''
      },
      addConfig: {
        visible: false
      },
      editConfig: {
        visible: false,
        row: {}
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    renderRoleType(type) {
      if (type === 1) {
        return { type: '', role: '学员' }
      } else if (type === 2) {
        return { type: '', role: '助教' }
      } else if (type === 3) {
        return { type: '', role: '讲师' }
      } else {
        return { type: '', role: '' }
      }
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        userIdentity: this.search.userIdentity,
        robotNickName: this.search.userName
      }
      getRobot(data)
        .then(res => {
          console.log(res)
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: '确定删除该用户?',
        success: () => {
          console.log('删除')
          this.loading = true
          const data = {
            imRobotsId: row.id
          }
          deleteRobot(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击编辑
    onhandleEdit(row) {
      console.log(row)
      this.editConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    // 点击新增
    onhandleAdd() {
      this.addConfig = {
        visible: true
      }
    },
    closeAddDialog(type) {
      !type && (this.addConfig.visible = false)
      this.getList()
    },
    closeEditDialog() {
      this.editConfig.visible = false
      this.getList()
    },
    // 点击重置
    onhanldeClear() {
      this.search = {
        userName: '',
        userIdentity: ''
      }
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1000px;
  padding: 0 20px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
