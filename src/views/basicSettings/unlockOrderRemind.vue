<template>
  <!-- 解除锁单飞书提醒人员设置 -->
  <div>
    <div class="header">
      <el-button :loading="loading" size="small" @click="handleClickAdd"><i class="el-icon-plus el-icon--left" />添加提醒人员</el-button>
      <div class="headerRight">
        <span class="headerRightLabel">兜底人员</span>
        <div class="m-l-16 m-r-8">
          <el-button v-if="!userInfo.userId" :loading="unlockFinalUserLoading" type="text" @click="handleClickSetting">设置</el-button>
          <el-tag v-else v-loading="unlockFinalUserLoading" class="pointer" @click="handleClickSetting">{{ userInfo.userName }}</el-tag>
        </div>
        <span class="headerRightTips">需要解除锁单场景找不到设置的通知兜底人员</span>
      </div>
    </div>
    <div class="myTablePage">
      <el-table
        ref="MPageLayout"
        type="tablePage"
        :data="config.tableData"
        :loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column label="课程名称" prop="goodsName" />
        <el-table-column label="通知人员" prop="sysUsers">
          <template slot-scope="{ row }">
            {{ row.sysUsers | filterUser }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleClickEdit(row)">编辑</el-button>
            <el-button type="text" style="color: #F53F3F" @click="handleClickDel(row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹框层 -->
    <unlockUserDialog :config="unlockUserConfig" :disabled-fn="disabledFn" @success="unlockUserSuccessFn" />
  </div>
</template>

<script>
import { getPageUnlockFeishuremind, setFinalUserUnlockFeishuremind, getSetGoods, getUnlockFinalUser, deleteUnlockFeishuremind } from '@/api/deliver/baseSeeting'
import unlockUserDialog from './components/unlockUserDialog.vue'
export default {
  components: {
    unlockUserDialog
  },
  filters: {
    filterUser(val) {
      if (val.length === 0) {
        return ''
      } else {
        return val.reduce((prev, next, index) => { return `${prev}${index === 0 ? '' : '/'}${next.sysUserName}` }, '')
      }
    }
  },
  data() {
    return {
      slotArr: ['action', 'user', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'goodsName', label: '课程名称', type: 'text' },
          { prop: 'sysUsers', label: '通知人员', type: 'slot', 'show-overflow-tooltip': true },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      unlockFinalUserLoading: false,
      // 兜底人员信息
      userInfo: {
        userName: '',
        userId: ''
      },
      // 新增/编辑弹框
      unlockUserConfig: {
        type: 1, // 1：新增 2编辑
        visible: false,
        row: {}
      },
      // 已选课程
      disabledGoods: []
    }
  },
  mounted() {
    this.getList()
    this.getUnlockFinalUser()
  },
  methods: {
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击设置按钮
    handleClickSetting() {
      const checkUser = []
      if (this.userInfo.userId) {
        checkUser.push({
          userName: this.userInfo.userName,
          nickName: this.userInfo.userName,
          userId: this.userInfo.userId
        })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        checkUser: checkUser,
        success: (res) => {
          if (res.user.length > 0) {
            const params = {
              sysUserId: res.user[0].userId
            }
            this.loading = true
            setFinalUserUnlockFeishuremind(params).then(result => {
              this.loading = false
              this.$notify({ title: '提示', message: '操作成功' })
              this.getUnlockFinalUser()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      getPageUnlockFeishuremind(params).then(res => {
        this.loading = false
        this.config.tableData = res.data.items
        this.config.total = res.data.total
      }).catch(() => {
        this.loading = false
        this.$refs.MPageLayout.doLayout()
      })
    },
    // 点击新增按钮
    handleClickAdd() {
      this.loading = true
      getSetGoods().then(res => {
        this.loading = false
        this.disabledGoods = res.data
        this.unlockUserConfig = {
          type: 1,
          visible: true,
          row: {}
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击编辑按钮
    handleClickEdit(row) {
      const userList = []
      if (row.sysUsers && row.sysUsers.length > 0) {
        row.sysUsers.map(v => {
          userList.push({
            userId: v.sysUserId,
            nickName: v.sysUserName
          })
        })
      }
      const data = {
        goodsId: row.goodsId,
        goodsName: row.goodsName,
        id: row.id,
        userList: userList
      }
      this.unlockUserConfig.type = 2
      this.unlockUserConfig.visible = true
      this.unlockUserConfig.row = data
    },
    // 点击移除按钮
    handleClickDel(row) {
      console.log(row)
      this.$delModal({
        tips: `确定移除【${row.goodsName}】吗？`,
        success: () => {
          console.log('确定')
          console.log(row)
          this.loading = true
          deleteUnlockFeishuremind(row.goodsId).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getList()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 课程禁选
    disabledFn(item) {
      return this.disabledGoods.includes(item.goodsId)
    },
    unlockUserSuccessFn() {
      this.unlockUserConfig.visible = false
      this.getList()
    },
    // 获取兜底人员
    getUnlockFinalUser() {
      this.unlockFinalUserLoading = true
      getUnlockFinalUser().then(res => {
        console.log('获取兜底人员', res)
        this.unlockFinalUserLoading = false
        if (res.data) {
          this.userInfo = {
            userName: res.data.sysUserName,
            userId: res.data.sysUserId
          }
        }
      }).catch(() => {
        this.unlockFinalUserLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.myTablePage {
    // height: 650px;
    border: 1px solid #E7E7E7;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 16px;
    .pagination {
      padding-right: 19px;
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .headerRight {
        display: flex;
        align-items: center;
        .headerRightLabel {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
        }
        .headerRightTips {
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #999999;
            line-height: 20px;
        }
    }
}
</style>
