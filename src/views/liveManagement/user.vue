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

        <el-input v-model.trim="search" placeholder="请输入" class="input-with-select" clearable>
          <el-select slot="prepend" v-model="shelveFlag" placeholder="请选择" style="width: 90px">
            <el-option label="昵称" :value="0" />
            <el-option label="手机号" :value="1" />
          </el-select>
          <!-- <el-button slot="append">查询</el-button> -->
        </el-input>
        <el-button class="m-l-10" type="primary" @click.native="getList">查询</el-button>
      </div>
    </div>

    <div class="m-t-20">
      <el-table :data="tableList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="主订单id" min-width="180">
          <template slot-scope="{ row }">
            <div class="pointer">
              <AppIconClipboard :src="row.orderNo ">
                <router-link :to="{path: `/business/order/${row.orderNo}`}" target="_blank">
                  <span style="color: #1472ff;">
                    {{ row.orderNo }}
                  </span>
                </router-link>
              </AppIconClipboard>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="subOrderId" label="子订单id" min-width="120" />
        <el-table-column prop="name" label="学员信息" min-width="300">
          <template slot-scope="{ row }">
            <div class="nickName pointer">
              <AppAvatar :name="row.name" :avatar="row.headImg" width="45" :no-name="true" />
              <div class="m-l-10 ">
                <router-link :to="{path: `/user/memberDetail/${row.uid}`}" target="_blank">
                  <div style="color: #1472ff;">
                    {{ row.name }}
                  </div>
                </router-link>
                <div>uid:
                  <AppIconClipboard :src="row.uid ">
                    <span>{{ row.uid }}</span>
                  </AppIconClipboard>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="channelSource" label="渠道来源" min-width="120">
          <template slot-scope="{ row }">
            {{ {1: '抖店', 2: '快手', 3: '获课'}[row.channelSource] }}
          </template>
        </el-table-column>
        <el-table-column prop="learningRate" label="学习进度" min-width="120">
          <template slot-scope="{ row }">
            {{ row.learningRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="加入类型" min-width="120">
          <template slot-scope="{ row }">
            {{ {1: '微信', 2: '阿里', 3: '赠送', 4: '抖店支付', 5: '快手支付'}[row.paymentType] }}
          </template>
        </el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" min-width="120" />
        <el-table-column prop="failureTime" label="失效时间" min-width="120" />
      </el-table>
    </div>

    <div class="user_footer">
      <div class="user_footer_left">
        <el-button class="m-r-10" :loading="expiredLoading" @click="orderExpired">失效</el-button>
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
          <el-button slot="reference" class="tielabel" style="margin-left: 0" @click.native="getLabeloption('')">贴标签</el-button>
        </el-popover>
        <!-- <el-dropdown>
          <el-button class="m-l-10">联系用户</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>发短信</el-dropdown-item>
            <el-dropdown-item>发站内信</el-dropdown-item>
            <el-dropdown-item>推送消息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button class="m-l-10" @click="openGoodsAddUserModal()">添加学员</el-button>
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
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { GetList, Add } from '@/api/user/label'
import { userLabelBatch, studentList, studentGiveCourse, orderExpired } from '@/api/user/member'
import Modal from '@/components/Modal'
import GoodsAddUser from '@/components/Modal/user/goodsAddUser'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppIconClipboard from '@/components/AppIconClipboard'
export default {
  components: {
    AppDialog,
    GoodsAddUser,
    Modal,
    AppAvatar,
    AppIconClipboard
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
      expiredLoading: false
    }
  },
  created() {
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
      studentList(data).then(res => {
        console.log('获取学员列表数据', res)
        this.tableList = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
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
        this.labelVisible = false
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.getList()
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
    getLabeloption(query) {
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
    // 关闭添加学员弹框
    closeGoodsAddUserModal() {
      this.goodsAddUserModal.visible = false
    },
    openGoodsAddUserModal() {
      this.goodsAddUserModal.visible = true
    },
    // 添加学员点击确认提交
    sendUser(res) {
      const data = {
        ...res,
        goodsId: this.$route.params.id
      }
      console.log(res, 'res')
      this.goodsAddUserModal.loading = true
      studentGiveCourse(data).then(res => {
        this.goodsAddUserModal.loading = false
        this.closeGoodsAddUserModal()
        this.getList()
        this.$refs.GoodsAddUser.clear()
      }).catch(() => {
        this.goodsAddUserModal.loading = false
      })
    },
    // 订单失效接口
    orderExpired() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择')
      }
      this.expiredLoading = true
      const idList = []
      this.multipleSelection.map(v => {
        idList.push(Number(v.subOrderId))
      })
      orderExpired(idList).then(res => {
        this.expiredLoading = false
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(() => {
        this.expiredLoading = false
      })
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
        .header_right {

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
</style>
