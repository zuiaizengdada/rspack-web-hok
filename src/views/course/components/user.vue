<template>
  <div class="user">
    <div class="user_header">
      <div class="header_left">
        <!-- <el-select v-model="shelveFlag" @change="getList">
          <el-option label="昵称" :value="0" />
          <el-option label="手机号" :value="1" />
        </el-select>
        <el-input v-model.trim="contentName" class="w-200 m-l-10 m-r-10" clearable placeholder="请输入" />
         -->

        <el-input
          v-model.trim="search"
          placeholder="请输入"
          class="input-with-select"
          clearable
          @keyup.enter.native="searchFn"
          @clear="searchFn"
        >
          <el-select slot="prepend" v-model="shelveFlag" placeholder="请选择" style="width: 90px">
            <el-option label="昵称" :value="0" />
            <el-option label="手机号" :value="1" />
          </el-select>
          <!-- <el-button slot="append">查询</el-button> -->
        </el-input>
        <el-button class="m-l-10" type="primary" @click.native="searchFn">查询</el-button>
      </div>
    </div>

    <div class="m-t-20">
      <el-table :data="tableList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column prop="orderNo" label="主订单id" min-width="180">
          <template slot-scope="{ row }">
            <div class="pointer">
              <AppIconClipboard :src="row.orderNo">
                <!-- <router-link :to="{path: `/business/order/${row.orderNo}`}" target="_blank">
                  <span style="color: #1472ff;">
                    {{ row.orderNo }}
                  </span>
                </router-link> -->
                <span style="color: #1472ff" @click="gotoOrderDetail(row.orderNo)">
                  {{ row.orderNo }}
                </span>
              </AppIconClipboard>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subOrderId" label="子订单id" min-width="120" />
        <el-table-column prop="name" label="学员信息" min-width="300">
          <template slot-scope="{ row }">
            <div class="nickName pointer">
              <AppAvatar :name="row.name" :avatar="row.headImg" width="45" :no-name="true" />
              <div class="m-l-10">
                <!-- <router-link :to="{path: `/user/memberDetail/${row.uid}`}" target="_blank"> -->
                <div class="c_link" @click="gotoUserDetail(row.uid)">
                  <div style="color: #1472ff">
                    {{ row.name }}
                  </div>
                </div>
                <!-- </router-link> -->
                <div>
                  uid:
                  <AppIconClipboard :src="row.uid">
                    <span>{{ row.uid }}</span>
                  </AppIconClipboard>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channelSource" label="渠道来源" min-width="120">
          <template slot-scope="{ row }">
            <!-- {{ { 1: '抖店', 2: '快手', 3: '获课', 4: '微信小店', 5: '老用户' }[row.channelSource] }} -->
            <template v-if="row.channelSource === 5">老用户</template>
            <template v-else>
              {{ row.channelSource | getOptionsValue(channelSourceType) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="learningRate" label="学习进度" min-width="120">
          <template slot-scope="{ row }"> {{ row.learningRate }}% </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="加入类型" min-width="120">
          <template slot-scope="{ row }">
            {{ row.channelSource | getOptionsValue([...paymentType_options,{ label: '视频号小店支付', value: 10 }]) }}
            <!-- {{ { 1: '微信', 2: '阿里', 3: '赠送', 4: '抖店支付', 5: '快手支付' }[row.paymentType] }} -->
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" min-width="120" />
        <el-table-column prop="failureTime" label="失效时间" min-width="120" />
      </el-table>
    </div>

    <div class="user_footer">
      <div class="user_footer_left">
        <el-button
          v-permission="['system:order:expired', permsList]"
          class="m-r-10"
          :loading="expiredLoading"
          @click="orderExpired"
        >失效</el-button>
        <el-popover v-model="labelVisible" placement="right-start" width="325" trigger="click" @hide="popoverhide">
          <el-select v-model="labelList" class="w-300" multiple :loading="labelLoading" value-key="labelId">
            <div class="search-input-box p-10">
              <el-input v-model.trim="labelSearch" suffix-icon="el-icon-search" clearable @input="getLabeloption" />
            </div>
            <el-option v-for="item in labelOption" :key="item.labelId" :label="item.labelName" :value="item">
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
          <el-button
            slot="reference"
            v-permission="['user:label:add', permsList]"
            class="tielabel"
            style="margin-left: 0"
            @click.native="getLabeloption('')"
          >贴标签</el-button>
        </el-popover>
        <!-- <el-dropdown>
          <el-button class="m-l-10">联系用户</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>发短信</el-dropdown-item>
            <el-dropdown-item>发站内信</el-dropdown-item>
            <el-dropdown-item>推送消息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button
          v-permission="['web:user:add', permsList]"
          class="m-l-10"
          @click="openGoodsAddUserModal()"
        >添加学员</el-button>
      </div>
      <div class="user_footer_right">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新建标签弹框层 -->
    <AppDialog v-model="modal.visible" :title="modal.title" width="500px" height="200px" @success="sendSuccess">
      <div class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="标签名称" prop="labelName">
            <el-input v-model.trim="form.labelName" class="w-300" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="标签类型">
            <span>{{ { 0: '手动标签', 1: '其他标签' }[form.labelType] }}</span>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>

    <Modal
      :title="goodsAddUserModal.title"
      :type="goodsAddUserModal.type"
      size="auto"
      width="auto"
      :visible.sync="goodsAddUserModal.visible"
    >
      <GoodsAddUser
        ref="GoodsAddUser"
        :loading="goodsAddUserModal.loading"
        :type="goodsAddUserModal.type"
        :visible.sync="goodsAddUserModal.visible"
        :out-goods-id="$route.params.id"
        @close="closeGoodsAddUserModal()"
        @success="sendUser"
      />
    </Modal>

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

    <!-- 订单详情弹框 -->
    <Modal
      :title="OrderInfoDialog.title"
      :type="OrderInfoDialog.type"
      size="1200px"
      width="1200px"
      :visible.sync="OrderInfoDialog.visible"
    >
      <OrderDetailModal
        :type="OrderInfoDialog.type"
        :visible.sync="OrderInfoDialog.visible"
        :order-no="OrderInfoDialog.orderNo"
        @close="OrderInfoDialog.visible = false"
      />
    </Modal>

    <el-dialog
      :visible.sync="uploadDialog.visible"
      width="620px"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <span slot="title">上传中(上传过程请不要关闭弹框)</span>
      <span slot="footer" class="dialog-footer">
        <div>
          <span>上传成功: {{ uploadDialog.success.length }}</span>
          <span class="m-l-20">上传失败: {{ uploadDialog.error.length }}</span>
        </div>
        <span v-if="uploadDialog.status === 'success'">
          <el-button v-if="uploadDialog.error.length > 0" size="small" @click="alignUpdate">重新上传失败数据</el-button>
          <el-button type="primary" size="small" @click="getList()">确 定</el-button>
        </span>
      </span>
      <div class="upload-dialog-content">
        <el-tag
          v-for="item in uploadDialog.showData"
          :key="item.inde"
          size="small"
          class="upload-dialog-content-tag"
          :type="{ loading: 'info', success: 'success', error: 'warning' }[item.status]"
        >
          <span class="m-r-10">{{ item.value }}</span>
          <i v-if="item.status === 'loading'" class="el-icon-loading" />
          <i
            v-if="item.status === 'success'"
            style="color: #67c23a"
            class="el-icon-upload-success el-icon-circle-check"
          />
          <i v-if="item.status === 'error'" style="color: #f56c6c" class="el-icon-circle-close" />
        </el-tag>
        <!-- <div v-for="(item) in uploadDialog.showData" :key="item.index" class="upload-dialog-content-tag">
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { GetList, Add } from '@/api/user/label'
import { userLabelBatch, studentList, studentGiveCourse, orderExpired } from '@/api/user/member'
import Modal from '@/components/Modal'
import UserInfoModal from '@/components/Modal/user/userInfo.vue'
import OrderDetailModal from '@/components/Modal/order/orderDetail.vue'
import GoodsAddUser from '@/components/Modal/user/goodsAddUser'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppIconClipboard from '@/components/AppIconClipboard'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppDialog,
    GoodsAddUser,
    Modal,
    AppAvatar,
    AppIconClipboard,
    UserInfoModal,
    OrderDetailModal
  },
  data() {
    return {
      search: '',
      shelveFlag: 0,
      tableList: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
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
      labelLoading: false,
      labelOption: [],
      labelList: [],
      labelSearch: '',
      multipleSelection: [],
      goodsAddUserModal: {
        visible: false,
        loading: false,
        type: 1,
        title: '添加学员'
      },
      expiredLoading: false,
      UserInfoDialog: {
        visible: false,
        type: 1,
        userId: ''
      },
      OrderInfoDialog: {
        visible: false,
        type: 1,
        orderNo: ''
      },
      permsList: this.$route.meta.permsList || [],
      uploadDialog: {
        visible: false,
        showData: [], // 展示的数据
        success: [], // 上传成功的数据
        error: [], // 上传失败的数据
        status: 'loading'
      }
    }
  },
  computed: {
    ...mapGetters(['channelSourceType', 'paymentType_options'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.init()
  },
  methods: {
    init() {
      this.current = 1
      this.search = ''
      this.shelveFlag = 0
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.uploadDialog.visible = false
      this.loading = true
      let name = ''
      let phone = ''
      if (this.shelveFlag === 1) {
        phone = this.search
      } else {
        name = this.search
      }
      const data = {
        goodsId: this.$route.params.id,
        current: this.currentPage,
        size: this.pageSize,
        name,
        phone
      }
      studentList(data)
        .then((res) => {
          this.tableList = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 批量添加标签
    AllEditLabel() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择数据')
      }
      this.labelLoading = true
      const labelIdList = []
      this.labelList.map((v) => {
        labelIdList.push(v.labelId)
      })
      const list = []
      this.multipleSelection.map((v) => {
        list.push({
          labelIdList: labelIdList,
          userId: v.uid
        })
      })
      const data = {
        list
      }
      userLabelBatch(data)
        .then((res) => {
          this.labelLoading = false
          this.labelVisible = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        })
        .catch(() => {
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
    openAddModel() {
      this.userModal = {
        title: '新增',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: true,
        loading: false
      }
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
    // 关闭新增标签弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    // 新增标签确定
    sendSuccess() {
      this.$refs.form.validate(async (valid) => {
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
          return false
        }
      })
    },
    getLabeloption(query) {
      this.labelLoading = true
      const params = {
        size: 20,
        current: 1,
        labelName: query
      }
      GetList(params)
        .then((res) => {
          if (res.data && res.data.records) {
            this.labelOption = res.data.records
          }
          this.labelLoading = false
        })
        .catch(() => {
          this.labelLoading = false
        })
    },
    // 关闭添加学员弹框
    closeGoodsAddUserModal() {
      this.goodsAddUserModal.visible = false
    },
    openGoodsAddUserModal() {
      this.goodsAddUserModal.visible = true
    },
    // 添加学员点击确认提交
    sendUser(res) {
      this.goodsAddUserModal.loading = true
      const phoneData = []
      res.phones.map((v, i) => {
        phoneData.push({ value: v, status: 'loading', index: i })
      })
      this.uploadDialog = {
        res,
        visible: true,
        showData: [], // 展示的数据
        status: 'loading',
        success: [],
        error: []
      }
      this.studentGiveCourse(res, phoneData, 1, 10)
    },
    // 重新上传失败数据
    alignUpdate() {
      this.uploadDialog.error.map((v) => {
        v.status = 'loading'
      })
      const data = JSON.parse(JSON.stringify(this.uploadDialog.error))
      this.uploadDialog.status = 'loading'
      this.uploadDialog.success = []
      this.uploadDialog.error = []
      this.uploadDialog.showData = []
      this.studentGiveCourse(this.uploadDialog.res, data, 1, 10)
    },
    async studentGiveCourse(res, data, current, size) {
      const phonesArr = data.filter((v, i) => {
        const min = (current - 1) * size
        const max = current * size
        return i >= min && i < max
      })
      const phones = []
      phonesArr.map((v) => {
        phones.push(v.value)
      })
      this.uploadDialog.showData.unshift(...phonesArr)
      const params = {
        ...res,
        phones,
        goodsId: this.$route.params.id
      }
      try {
        const result = await studentGiveCourse(params)
        if (result.code === 1) {
          result.data.successList &&
            result.data.successList.map((v) => {
              const index = this.uploadDialog.showData.findIndex((e) => v === e.value)
              this.$set(this.uploadDialog.showData[index], 'status', 'success')
              this.uploadDialog.success.push(this.uploadDialog.showData[index])
            })

          // result.data.successList && result.data.successList.map(v => {
          //   const index = this.uploadDialog.showData.findIndex(e => v === e.value)
          //   this.$set(this.uploadDialog.showData[index], 'status', 'success')
          // })
          result.data.errorList &&
            result.data.errorList.map((v) => {
              const index = this.uploadDialog.showData.findIndex((e) => v === e.value)
              this.$set(this.uploadDialog.showData[index], 'status', 'error')
              this.uploadDialog.error.push(this.uploadDialog.showData[index])
            })
          // if (result.data.successList && result.data.successList.length > 0) {
          //   result.data.successList.map(v => {
          //     this.uploadDialog.success.push({
          //       status: 'success',
          //       value: v
          //     })
          //   })
          // }
          // if (result.data.errorList && result.data.errorList.length > 0) {
          //   result.data.errorList.map(v => {
          //     this.uploadDialog.error.push({
          //       status: 'error',
          //       value: v
          //     })
          //   })
          // }
        }
      } catch (err) {
        phonesArr.map((v) => {
          v.status = 'error'
          const index = this.uploadDialog.showData.findIndex((e) => v.index === e.index)
          // this.uploadDialog.showData[index].status = 'error'
          this.$set(this.uploadDialog.showData[index], 'status', 'error')
        })
        this.uploadDialog.error.push(...phonesArr)
      }
      if (this.uploadDialog.showData.length !== data.length) {
        this.studentGiveCourse(res, data, current + 1, size)
      } else {
        this.uploadDialog.status = 'success'
        this.goodsAddUserModal.loading = false
        this.goodsAddUserModal.visible = false
      }
    },
    // 订单失效接口
    orderExpired() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择')
      }
      this.expiredLoading = true
      const idList = []
      this.multipleSelection.map((v) => {
        idList.push(Number(v.subOrderId))
      })
      orderExpired(idList)
        .then((res) => {
          this.expiredLoading = false
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        })
        .catch(() => {
          this.expiredLoading = false
        })
    },
    // 点击学员信息，跳转学员详情
    gotoUserDetail(userId) {
      this.UserInfoDialog = {
        visible: true,
        type: 1,
        userId: userId
      }
    },
    // 点击订单，跳转订单详情
    gotoOrderDetail(orderNo) {
      this.OrderInfoDialog = {
        title: '订单详情',
        type: 1,
        visible: true,
        orderNo
      }
    },
    // 搜索
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 表格多选的禁选判断
    selectable(row, index) {
      return true
      // return row.type === 1
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  .user_header {
    display: flex;
    justify-content: space-between;
    .header_left {
      display: flex;
    }
  }
  .user_table {
    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
  .user_footer {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
.nickName {
  display: flex;
  align-items: center;
}
.upload-dialog-content {
  display: flex;
  flex-wrap: wrap;
  max-height: 400px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    transition: all 0.4s ease;
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .upload-dialog-content-tag {
    margin: 2px;
  }
}
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
