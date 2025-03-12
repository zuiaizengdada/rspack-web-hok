<template>
  <div class="page_wrap">
    <!-- 员工管理 -->
    <div class="p-20">
      <filterTop class="w-100p" :search="search" @search="handerSearch" />
    </div>
    <div class="p-20">
      <el-table ref="table" :data="config.tableData" border max-height="500" :row-key="(row) => row.phone" style="width: 1176px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column label="用户" prop="name" width="400">
          <template slot-scope="{ row }">
            <div class="nickName pointer">
              <AppAvatar :name="row.name || row.realName || row.uid || row.phone" width="45" :no-name="true" />
              <div class="m-l-10 ">
                <!-- <router-link :to="{path: `/user/memberDetail/${row.uid}`}" target="_blank">
                  <div style="color: #1472ff;">
                    {{ row.name }}
                  </div>
                </router-link> -->
                <div class="c_link" @click="gotoUserDetail(row.id)">
                  <div style="color: #1472ff;">
                    {{ row.name }}
                  </div>
                </div>
                <div>uid:
                  <AppIconClipboard :src="row.uid ">
                    <span>{{ row.uid }}</span>
                  </AppIconClipboard>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="渠道来源" prop="channelSource">
          <template slot-scope="{ row }">
            <!-- {{ {1: '抖店', 2: '快手', 3: '获课'}[row.channelSource] }} -->
            {{ row.channelSource | getOptionsValue(channelSourceType) }}
          </template>
        </el-table-column>
        <el-table-column label="用户状态" prop="status">
          <template slot-scope="{ row }">
            {{ {'-1': '删除', 0: '禁用', 1: '正常', 2: '待激活'}[row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="realName" />
        <el-table-column label="手机号码" prop="phone" />
        <el-table-column label="注册时间" prop="createTime" />
        <el-table-column label="消费次数" prop="consumeNum" />
        <el-table-column label="消费总额(元)" prop="consumeAmount">
          <template slot-scope="{ row }">
            {{ row.consumeAmount | filtersMoney }}
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div class="fl m-t-20 m-b-20">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            <span v-if="multipleSelection.length === 0">选中本页</span>
            <span v-else class="des">已选{{ multipleSelection.length }}项</span>
          </el-checkbox>
        </div>
        <el-pagination
          class="fr m-t-20 m-b-20"
          :current-page="config.currentPage"
          :page-size="config.pageSize"
          :page-sizes="[10, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="config.total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <!-- 用户详情弹框 -->
      <Modal
        title="用户详情"
        :type="UserInfoDialog.type"
        size="1200px"
        width="1200px"
        :visible.sync="UserInfoDialog.visible"
      >
        <UserInfoModal
          :type="UserInfoDialog.type"
          :visible.sync="UserInfoDialog.visible"
          :user-id="UserInfoDialog.userId"
          @close="UserInfoDialog.visible = false"
        />
      </Modal>
    </div>
  </div>
</template>

<script>
import AppIconClipboard from '@/components/AppIconClipboard'
import { GetUserMemberList, userAdd } from '@/api/user/member'
import { GetList, Add } from '@/api/user/label'
import { mapGetters } from 'vuex'
import filterTop from './filterTop.vue'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { userLabelBatch } from '@/api/user/member'
import UserInfoModal from '@/components/Modal/user/userInfo.vue'
import Modal from '@/components/Modal'
export default {
  name: 'MemberManage',
  components: {
    filterTop,
    AppAvatar,
    AppIconClipboard,
    Modal,
    UserInfoModal
  },
  props: {
    outGoodsId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      config: {
        tableData: [],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      allChangeType: false,
      search: {
        user: { label: 'name', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        channelSource: '', // 商品名称
        userSource: '', // 订单状态
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        labelId: [],
        loading: false,
        status: ''
      },
      labelLoading: false,
      labelOption: [],
      labelList: [],
      labelSearch: '',
      // 新建标签弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      // 新建标签弹框form
      form: {
        labelName: '',
        labelType: 0
      },
      // 新建标签弹框rule
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      labelVisible: false, // 贴标签弹框
      // 新建标签弹框属性
      userModal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false,
        loading: false
      },
      isIndeterminate: false,
      checkAll: false, // 选择状态
      checkAllText: '选中本页', //
      checkList: [],
      UserInfoDialog: {
        visible: false,
        type: 1,
        userId: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'labelType',
      'channelSourceType'
    ])
  },
  mounted() {
    this.$store.dispatch('option/getChannelsourceType')
    this.init()
  },
  activated() {
    this.getList()
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
    handleSelectionChange(val) {
      console.log(val)
      if (val.length > 0) {
        this.isIndeterminate = true
        this.checkAll = false
      } else {
        this.isIndeterminate = false
        this.checkAll = false
      }
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      this.$emit('handleSelectionChange', val)
    },
    getList() {
      this.loading = true
      const labelIdList = []
      this.search.labelId.map(v => {
        labelIdList.push(v.labelId)
      })
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        [this.search.user.label]: this.search.user.value,
        channelSource: this.search.channelSource,
        userSource: this.search.userSource,
        timeType: this.search.time.label,
        startTime: this.search.time.value && this.search.time.value[0],
        endTime: this.search.time.value && this.search.time.value[1],
        labelIdList,
        outGoodsId: this.outGoodsId,
        thirdShopId: this.search.thirdShopId
      }
      this.search.loading = true
      GetUserMemberList(params).then(res => {
        this.loading = false
        console.log(res, '列表数据')
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.search.loading = false
      }).catch(() => {
        this.loading = false
        this.search.loading = false
      })
    },
    init() {
      this.config.currentPage = 1
      this.getList()
      this.getLabeloption('')
    },
    handerSearch(res) {
      console.log(res, 'res')
      this.config.currentPage = 1
      this.search = res
      this.getList()
    },
    getLabeloption(query) {
      console.log('123123')
      this.labelLoading = true
      const params = {
        size: 20,
        current: 1,
        labelName: query
      }
      GetList(params).then(res => {
        if (res.data && res.data.records) {
          this.labelOption = res.data.records
        }
        this.labelLoading = false
      }).catch(() => {
        this.labelLoading = false
      })
    },
    // 新增标签确定
    sendSuccess() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          let res = null
          if (this.modal.type === 1) {
            // 新增
            res = await Add(data)
          }
          if (res) {
            this.closeModal()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
            this.getLabeloption('')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭新增标签弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    // 打开新增标签
    openAddGroup() {
      this.modal = {
        title: '新建',
        type: 1,
        visible: true
      }
      this.form = {
        labelName: '',
        labelType: 0
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 编辑标签
    editLebal(row) {
      row.labelVisible = false
      this.labelLoading = true
      const list = []
      this.labelList.map(v => {
        list.push({
          labelIdList: [v.labelId],
          userId: row.uid
        })
      })
      const data = {
        list
      }
      userLabelBatch(data).then(res => {
        row.visible = false
        this.labelLoading = false
        this.init()
      }).catch(() => {
        this.labelLoading = false
      })
    },
    // 批量添加标签
    AllEditLabel() {
      console.log(this.multipleSelection, this.labelList)
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择数据')
      }
      this.labelLoading = true
      const labelIdList = []
      this.labelList.map(v => {
        labelIdList.push(v.labelId)
      })
      const list = []
      this.multipleSelection.map(v => {
        list.push({
          labelIdList: labelIdList,
          userId: v.uid
        })
      })
      const data = {
        list
      }
      userLabelBatch(data).then(res => {
        this.labelLoading = false
        this.init()
      }).catch(() => {
        this.labelLoading = false
      })
    },
    // 隐藏贴标签弹框
    popoverhide() {
      this.labelList = []
      this.labelSearch = ''
    },
    // 关闭新增弹框
    closeUserModal() {
      this.userModal = {
        title: '新增',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false,
        loading: false
      }
    },
    // 新增确定
    addUserSuccess(res) {
      console.log(res, '新增数据')
      this.userModal.loading = true
      userAdd(res).then(res => {
        this.userModal = {
          title: '新增',
          type: 1, // 1: 新增; 2查看; 3编辑;
          visible: false,
          loading: false
        }
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.init()
      }).catch(() => {
        this.userModal = {
          title: '新增',
          type: 1, // 1: 新增; 2查看; 3编辑;
          visible: false,
          loading: false
        }
      })
    },
    openAddModel() {
      this.userModal = {
        title: '新增',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: true,
        loading: false
      }
    },
    // 点击选中本页触发
    handleCheckAllChange(res) {
      this.$refs.table.toggleAllSelection()
      console.log(res, 'res')
    },
    // 点击学员信息，跳转学员详情
    gotoUserDetail(userId) {
      // console.log()
      this.UserInfoDialog = {
        visible: true,
        type: 1,
        userId: userId
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  // height: 100%;
  min-width: 1200px;
  overflow: auto;
  background-color: #fff;
  border-radius: 4px;

  .nickName {
    display: flex;
    align-items: center;
  }
}
.tielabel {
  margin-left: 10px;
  cursor: pointer;
  color: #409EFF;
  font-size: 14px;
}
.tag-popover-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .toolTielabel {
    line-height: 32px;
  }
}
.des {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>
