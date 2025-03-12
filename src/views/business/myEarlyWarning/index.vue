<template>
  <!-- 消息模板 -->
  <div class="page-wrap">
    <div class="filter_top">
      <filterTop @search="handleSearch" />
    </div>
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      border
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
      if-index
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div slot="action" slot-scope="scope">
        <el-button
          v-permission="['system:my:warning:edit', permsList]"
          type="text"
          style="margin-right: 10px"
          @click="openModel(scope.row)"
        >关闭预警</el-button>
        <el-dropdown>
          <el-button v-show="hideMore(scope.row)" type="text">更多</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="hideSource(scope.row)"
              v-permission="['system:my:order:active:send', permsList]"
              command="1"
            >
              <el-button type="text" @click.native="sendActivationSMS(scope.row)">激活短信</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="hideSource(scope.row)" v-permission="['web:my:order:link', permsList]" command="2">
              <el-button v-activation="scope.row.orderNo" type="text">激活链接</el-button>
            </el-dropdown-item>
            <el-dropdown-item v-if="hideManual(scope.row)" v-permission="['system:my:order:manual', permsList]" command="3">
              <el-button type="text" @click="handleManual(scope.row.orderNo)">解密用户</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div slot="orderNo" slot-scope="scope">
        <span class="followerUserTips" @click="goOrderDetails(scope.row)">{{ scope.row.orderNo }}</span>
      </div>
      <div slot="followers" slot-scope="scope">
        <div
          v-if="scope.row.followers && scope.row.followers.length > 0"
          v-permission="['web:warning:follow', permsList]"
          class="followerUserTips"
          @click="clickFollowUser(scope.row)"
        >
          <span v-for="(e, ei) in scope.row.followers" :key="e.role">
            {{ e.userName }}
            <template v-if="ei !== scope.row.followers.length - 1">/</template>
          </span>
        </div>
        <div
          v-else
          v-permission="['web:warning:follow', permsList]"
          class="followerUserTips"
          @click="clickFollowUser(scope.row)"
        >
          无跟进人员
        </div>
      </div>
      <div slot="userPhone" slot-scope="scope">
        <span style="margin-right: 10px">{{ scope.row.userPhone }}</span>
        <el-tag v-if="scope.row.userStatus === 2" type="danger">未激活</el-tag>
        <el-tag v-if="scope.row.userStatus === 1">已激活</el-tag>
      </div>
      <template slot="channelSource" slot-scope="scope">
        <span>{{ scope.row.channelSource | getOptionsValue(channelSourceType) }}</span>
      </template>
    </MPageLayout>
    <!-- 跟进人员弹框 -->
    <AppDialog v-model="followUserModel.visible" :title="followUserModel.title" width="800px" height="auto">
      <div class="follow-user-model">
        <div v-for="(item, index) in followUserModel.data" :key="index">
          <div class="clearfix follow-user">
            <div class="fl roleName">{{ item.roleName }}</div>
            <div class="fl selectUser">
              <el-tag v-if="item.userId" closable @close="delFollowUser(item, index)">{{ item.userName }}</el-tag>
              <el-button v-else class="button-new-tag" size="small" @click="addFollowUser(index)">+ 选择人员</el-button>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="follow-user-footer">
        <el-button type="primary" @click="sureFollowUser">确定</el-button>
        <el-button @click="closeFollowUserModel">取消</el-button>
      </div>
    </AppDialog>
    <modal
      v-if="formDialog.visible"
      width="500px"
      title="关闭原因"
      :type="2"
      :visible.sync="formDialog.visible"
      @close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px" label-position="left" :rules="rules">
        <el-form-item label="关闭原因" prop="closeReason">
          <el-autocomplete
            v-model="form.closeReason"
            type="textarea"
            style="width: 100%"
            :maxlength="100"
            show-word-limit
            popper-class="my-autocomplete"
            :fetch-suggestions="querySearch"
            placeholder="请输入关闭原因"
          >
            <i slot="suffix" class="el-icon-edit el-input__icon" />
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button type="primary" size="small" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </modal>
  </div>
</template>

<script>
import { myOrderWarning, orderWarningClose, goodActivesSendSMS, addFollowSave, orderManual } from '@/api/business'
import { getColumns } from './columns.js'
import filterTop from './components/filterTop'
import modal from '@/components/Modal/index'
import AppDialog from '@/components/AppDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'MessageLog',
  components: { filterTop, modal, AppDialog },
  data() {
    return {
      time: null,
      active: 'orderNo',
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'channelSource', 'orderNo', 'action', 'userPhone', 'footer', 'followers'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      followUserModel: {
        visible: false,
        subOrderId: '',
        data: [
          { userId: '', userName: '', roleName: '班主任', role: 1 },
          { userId: '', userName: '', roleName: '销售', role: 2 },
          { userId: '', userName: '', roleName: '客服', role: 3 }
        ],
        orderNo: '',
        title: '添加跟进人员'
      },
      rules: {
        closeReason: [
          { required: true, message: '请输入关闭原因', trigger: 'blur' },
          { required: true, message: '请输入关闭原因', trigger: 'change' }
        ]
      },
      formDialog: {
        visible: false
      },
      form: {
        closeReason: ''
      },
      row: {},
      textDialog: {
        visible: false,
        value: ''
      },
      restaurants: [
        {
          value: '已主动联系客户'
        }
      ],
      query: {},
      multipleSelection: [],
      crud: {
        loading: false,
        data: []
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter((v) => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    hideSource(row) {
      return [1, 2, 4].includes(row.channelSource) && row.orderStatus === 2
    },
    hideMore(row) {
      return this.hideSource(row) || this.hideManual(row)
    },
    goOrderDetails(row) {
      this.$router.push({ path: `/business/order/${row.orderNo}` })
    },
    hideManual(row) {
      return [1].includes(row.channelSource) && row.warningType === 2
    },
    handleSearch(val = {}) {
      this.config.currentPage = 1
      this.query = val
      this.getList()
    },
    async handleManual(orderNo) {
      console.log(orderNo)
      const { code } = await orderManual({
        orderId: orderNo
      })
      if (code === 1) {
        this.$notify.success('解密成功')
        this.getList()
      }
    },
    async getList() {
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        ...this.query
      }
      const { data } = await myOrderWarning(params)
      this.config.tableData = data.records
      this.config.total = data.total
      this.loading = false
    },
    openModel(row) {
      this.row = row
      this.formDialog.visible = true
    },
    querySearch(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants)
    },
    // 选择跟进人员
    addFollowUser(index) {
      this.$AddressBook({
        visible: true,
        type: [1],
        multiple: false,
        success: (res) => {
          console.log(res)
          if (res.user.length > 0) {
            const userInfo = res.user[0]
            this.followUserModel.data[index].userId = userInfo.userId
            this.followUserModel.data[index].userName = userInfo.userName
          }
        }
      })
    },
    delFollowUser(item, index) {
      this.followUserModel.data[index].userId = ''
      this.followUserModel.data[index].userName = ''
    },
    closeFollowUserModel() {
      this.followUserModel.visible = false
    },
    sureFollowUser() {
      this.loading = true
      const users = []
      if (this.followUserModel.data.length > 0) {
        this.followUserModel.data.map((v) => {
          v.userId && users.push(v)
        })
      }
      const data = {
        orderNo: this.followUserModel.orderNo,
        subOrderId: this.followUserModel.subOrderId,
        users
      }
      addFollowSave(data)
        .then((res) => {
          this.getList()
          this.followUserModel.visible = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击跟进人员
    clickFollowUser(row) {
      console.log(row)
      this.followUserModel.data = [
        { userId: '', userName: '', roleName: '班主任', role: 1 },
        { userId: '', userName: '', roleName: '销售', role: 2 },
        { userId: '', userName: '', roleName: '客服', role: 3 }
      ]
      this.followUserModel.orderNo = row.orderNo
      this.followUserModel.subOrderId = row.id
      if (row.followers && row.followers.length > 0) {
        // this.followUserModel.data
        row.followers.map((v) => {
          this.followUserModel.data[v.role - 1].userId = v.userId
          this.followUserModel.data[v.role - 1].userName = v.userName
        })
      }
      this.followUserModel.visible = true
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
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map((v) => {
        v.visible = true
      })
      localStorage.setItem('msg_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击发送激活短信
    sendActivationSMS(row) {
      this.$delModal({
        tips: '确定发送激活短信?',
        success: () => {
          const data = {
            orderNo: row.orderNo,
            phone: row.userPhone,
            userId: row.userId
          }
          // this.$emit('delHandle', node.data)
          goodActivesSendSMS(data).then((res) => {
            // console.log
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
          })
        }
      })
    },
    async submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { code } = await orderWarningClose({
            closeReason: this.form.closeReason,
            orderNo: this.row.orderNo,
            warningId: this.row.warningId
          })

          if (code === 1) {
            this.$notify.success({
              title: '提示',
              message: '关闭成功'
            })
          }
          this.formDialog.visible = false
          this.form.closeReason = ''
          this.getList()
        }
      })
    },
    handleClose() {
      this.formDialog.visible = false
      this.form.closeReason = ''
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = getColumns()
      this.config.tableColumns = tableColumns
      localStorage.setItem('msg_tableColumns', JSON.stringify(tableColumns))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.head-container {
  padding: 20px 20px 0;
}
.follow-user-model {
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
  .follow-user {
    margin-bottom: 20px;
    line-height: 32px;
    .roleName {
      width: 80px;
    }
  }
}
.follow-user-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
.followerUserTips {
  color: #1890ff;
  cursor: pointer;
  // &:active {
  //   color: ;
  // }
}
.page-wrap ::v-deep {
  height: calc(100vh - 100px);
  .filter_top {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
      0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .filter-item {
    margin-right: 10px;
  }
  .PageLayout {
    background: #fff;
  }

  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
