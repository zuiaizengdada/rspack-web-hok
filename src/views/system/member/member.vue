<template>
  <div class="page_wrap">
    <!-- 员工管理 -->
    <div class="p-20 filter_top">
      <filterTop class="w-100p" :search="search" @search="handerSearch" />
    </div>
    <div class="p-20 table-module clearfix">
      <div class="m-b-20 toolTielabel">
        <!-- <el-button v-permission="['user:add', permsList]" type="primary" size="small" :loading="search.loading" @click="openAddModel">新增</el-button>
        <el-button v-permission="['user:export', permsList]" class="m-r-10" :loading="search.loading" @click="openExportUserModal">导入用户</el-button> -->
        <el-popover
          v-model="labelVisible"
          placement="right-start"
          width="325"
          trigger="click"
          @hide="popoverhide"
        >
          <el-select
            v-model="labelList"
            class="w-300"
            multiple
            :loading="labelLoading"
            value-key="labelId"
          >
            <div class="search-input-box p-10">
              <el-input v-model.trim="labelSearch" suffix-icon="el-icon-search" clearable @input="getLabeloption" />
            </div>
            <el-option
              v-for="(item) in labelOption"
              :key="item.labelId"
              :label="item.labelName"
              :value="item"
            >
              {{ item.labelName }}
            </el-option>
          </el-select>
          <div class="m-t-10 tag-popover-footer">
            <el-button type="text" @click="openAddGroup">新建标签</el-button>
            <div class="btn-box">
              <el-button @click="labelVisible = false">取消</el-button>
              <el-button type="primary" :loading="labelLoading" @click="AllEditLabel">确定</el-button>
            </div>

          </div>
          <el-button slot="reference" v-permission="['user:label:add', permsList]" :loading="search.loading" size="small" class="tielabel" style="margin-left: 0" @click.native="getLabeloption('')">贴标签</el-button>
        </el-popover>
      </div>
      <el-table v-loading="search.loading" :data="config.tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户" prop="name" min-width="400">
          <template slot-scope="{ row }">
            <div class="nickName pointer">
              <AppAvatar :name="row.name || row.realName || row.id || row.phone" width="45" :no-name="true" />
              <div class="m-l-10 ">
                <div style="color: #1472ff;" @click="$router.push({path: `memberDetail/${row.id}`})">{{ row.name }} </div>
                <div>id:
                  <AppIconClipboard :src="row.id ">
                    <span>{{ row.id }}</span>
                  </AppIconClipboard>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="渠道来源" prop="channelSource">
          <template slot-scope="{ row }">
            <!-- {{ {1: '抖店', 2: '快手', 3: '获课'}[row.channelSource] }} -->
            {{ row.channelSource | getOptionsValue(channelSourceOptions) }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="用户来源" prop="userSource">
          <template slot-scope="{ row }">
            {{ {1: '获课安卓', 2: '获课IOS', 3: '获课H5', 4:'获课小程序', 5: '后台导入'}[row.userSource] }}
          </template>
        </el-table-column> -->
        <el-table-column label="用户状态" prop="status">
          <template slot-scope="{ row }">
            {{ {'-1': '删除', 0: '禁用', 1: '正常', 2: '待激活'}[row.status] }}
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="realName" />
        <el-table-column label="手机号码" prop="phone" width="140">
          <template slot-scope="{ row }">
            <tablePhoneItem
              v-model="row.phone"
              :phone-area-code="row.phoneAreaCode"
              :row-data="row"
              type="platformUser"
            />
          </template>
        </el-table-column>
        <el-table-column label="邮箱" prop="email" width="130">
          <template slot-scope="{ row }">
            <tablePhoneItem
              v-model="row.email"
              :row-data="row"
              type="email"
            />
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createTime" min-width="120" />
        <!-- <el-table-column label="消费次数" prop="consumeNum" />
        <el-table-column label="消费总额(元)" prop="consumeAmount">
          <template slot-scope="{ row }">
            {{ row.consumeAmount | filtersMoney }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="$router.push({path: `/ptyy/member/memberDetail/${row.id}`})">详情</el-button>
            <el-popover
              v-model="row.labelVisible"
              placement="right-start"
              width="325"
              trigger="click"
            >
              <el-select
                v-model="labelList"
                class="w-300"
                multiple
                :loading="labelLoading"
                value-key="labelId"
              >
                <div class="search-input-box p-10">
                  <el-input v-model.trim="labelSearch" suffix-icon="el-icon-search" clearable @input="getLabeloption" />
                </div>
                <el-option
                  v-for="(item) in labelOption"
                  :key="item.labelId"
                  :label="item.labelName"
                  :value="item"
                >
                  {{ item.labelName }}
                </el-option>
              </el-select>
              <div class="m-t-10 tag-popover-footer">
                <el-button type="text" @click="openAddGroup">新建标签</el-button>
                <div class="btn-box">
                  <el-button @click="row.labelVisible = false">取消</el-button>
                  <el-button type="primary" :loading="labelLoading" @click="editLebal(row)">确定</el-button>
                </div>
              </div>
              <el-button slot="reference" type="text" class="tielabel" @click.native="getLabeloption('')">贴标签</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr m-t-20 m-b-20"
        :current-page="config.currentPage"
        :page-size="config.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="config.total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新建标签弹框层 -->
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="500px"
      height="200px"
      @success="sendSuccess"
    >
      <div class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="标签名称" prop="labelName">
            <el-input v-model.trim="form.labelName" class="w-300" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="标签类型">
            <span>{{ {0: '手动标签', 1: '其他标签'}[form.labelType] }}</span>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>

    <!-- 新增用户弹框 -->
    <Modal
      :title="userModal.title"
      :type="userModal.type"
      size="600px"
      width="600px"
      :visible.sync="userModal.visible"
    >
      <userModalDialog
        :type="userModal.type"
        :visible.sync="userModal.visible"
        :data="userModal.data"
        :loading="userModal.loading"
        @close="closeUserModal()"
        @success="addUserSuccess"
      />
    </Modal>

    <!-- 导入用户弹框 -->
    <Modal
      :title="exportUserModal.title"
      :type="exportUserModal.type"
      size="600px"
      width="600px"
      :visible.sync="exportUserModal.visible"
    >
      <exportUserDialog
        :type="exportUserModal.type"
        :visible.sync="exportUserModal.visible"
        @close="closeExportUserModal()"
      />
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import userModalDialog from '@/components/Modal/user/member'
import AppIconClipboard from '@/components/AppIconClipboard'
// import store from '@/store'
import { GetMemberList, pfUserAdd } from '@/api/user/member'
import { GetList, Add } from '@/api/user/label'
import { mapGetters } from 'vuex'
import filterTop from './filterTop.vue'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppDialog from '@/components/AppDialog'
import { userLabelBatch } from '@/api/user/member'
import exportUserDialog from '@/components/Modal/user/exportUser.vue'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import { getOptionsValue } from '@/filters/index'
const channelSourceOptions = [
  { label: '获课安卓', value: 1 },
  { label: '获课苹果', value: 2 },
  { label: '获课H5', value: 3 },
  { label: '获课小程序', value: 4 },
  { label: '后台导入', value: 5 }
]
export default {
  name: 'MemberManage',
  components: {
    Modal,
    userModalDialog,
    filterTop,
    AppAvatar,
    AppDialog,
    AppIconClipboard,
    exportUserDialog,
    tablePhoneItem
  },
  data() {
    return {
      getOptionsValue,
      channelSourceOptions,
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
      // 导入用户弹框
      exportUserModal: {
        title: '导入用户',
        tyoe: 1,
        visible: false,
        loading: false
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'labelType'
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
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
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
        status: this.search.status,
        thirdShopId: this.search.thirdShopId
      }
      this.search.loading = true
      GetMemberList(params).then(res => {
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
          platformUserId: row.id
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
          platformUserId: v.id
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
      pfUserAdd(res).then(res => {
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
    // 打开新增弹框
    openAddModel() {
      this.userModal = {
        title: '新增',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: true,
        loading: false
      }
    },
    // 打开导入用户弹框
    openExportUserModal() {
      this.exportUserModal.visible = true
    },
    // 关闭导入用户弹框
    closeExportUserModal() {
      this.exportUserModal.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  // height: 100%;
  min-width: 1200px;
  overflow: auto;
  // background-color: #fff;
  border-radius: 4px;
  &::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color: rgba(0,0,0,0);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0,0,0,.2);
    transition: all .4s ease;
    -moz-transition: all .4s ease;
    -webkit-transition: all .4s ease;
    -o-transition: all .4s ease;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0,0,0,.1);
  }
  .filter_top {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
  .table-module {
    padding: 20px;
    margin-top: 20px;
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  }
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
</style>
