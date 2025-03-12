<template>
  <div class="page_wrap">
    <!-- 留言反馈列表 -->
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="headerLeft">
        <el-select
          v-model="select"
          size="small"
          class="m-r-10 w-100"
          @change="getList()"
        >
          <el-option label="未处理" :value="1" />
          <el-option label="已处理" :value="2" />
        </el-select>
        <el-input
          v-model.trim="search"
          size="small"
          placeholder="输入用户名称"
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

      <div slot="footer">
        <!-- <AppTableTools
          ref="tableTools"
          :tools="['批量删除']"
          @onAllChange="onAllChange"
          @onClick="allChange"
        /> -->
        <el-button
          v-permission="['system:message:remove', permsList]"
          size="small"
          @click="allChange(0)"
        >批量删除</el-button>
      </div>

      <div slot="action" slot-scope="scope">
        <el-button
          v-permission="['system:message:edit', permsList]"
          type="text"
          @click="openModel(scope.row)"
        >答复</el-button>
      </div>

      <div slot="receiverType" slot-scope="scope">
        {{ { 1: '用户', 2: '公告' }[scope.row.receiverType] }}
      </div>

      <div slot="status" slot-scope="scope">
        <AppStatus :status="{ 1: 'error', 2: 'success' }[scope.row.status]">
          <span>
            {{ { 1: '未处理', 2: '已处理' }[scope.row.status] }}
          </span>
        </AppStatus>
      </div>

      <div slot="type" slot-scope="scope">
        {{ { 1: '售前咨询', 2: '售后', 3: '问题反馈' }[scope.row.type] }}
      </div>

      <div slot="username" slot-scope="scope">
        <div class="nickName pointer">
          <AppAvatar
            :name="scope.row.username || scope.row.userId || scope.row.phone"
            width="45"
            :no-name="true"
          />
          <div class="m-l-10">
            <div v-if="!scope.row.userId">
              {{ scope.row.username }}
            </div>
            <div v-else style="color: #1472ff">
              <!-- <router-link :to="{path: `/user/memberDetail/${scope.row.userId}`}" target="_blank">
                {{ scope.row.username }}
              </router-link> -->
              <div class="c_link" @click="gotoUserDetail(scope.row.userId)">
                <div style="color: #1472ff">
                  {{ scope.row.username }}
                </div>
              </div>
            </div>
            <!-- <div v-if="scope.row.userId">userId:
              <AppIconClipboard :src="scope.row.userId">
                <router-link :to="{path: `/user/memberDetail/${scope.row.userId}`}" target="_blank">
                  <span class="text_hidden_1" style="color: #1472ff;width: 200px" :title="scope.row.userId">{{ scope.row.userId }}</span>
                </router-link>
              </AppIconClipboard>
            </div> -->
          </div>
        </div>
      </div>
    </MPageLayout>

    <!-- 弹框层 -->
    <!-- 新建标签弹框层 -->
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="700px"
      height="550px"
      :btn-footer="false"
    >
      <div v-loading="modal.loading" class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="问题编号" prop="labelName">
            <span>{{ form.id }}</span>
          </el-form-item>
          <el-form-item label="分类">
            <span>{{
              { 1: '售前咨询', 2: '售后', 3: '问题反馈' }[form.type]
            }}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{ form.username }}</span>
          </el-form-item>
          <el-form-item label="手机号码">
            <span>{{ form.phoneAreaCode?'(+'+ form.phoneAreaCode+')  ':'' }} {{ form.phone }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ form.email }}</span>
          </el-form-item>
          <el-form-item label="问题描述">
            <span class="messageContent">{{ form.messageContent }}</span>

            <div>
              <ImagePreviewer
                v-for="(item, index) in form.messageImages"
                :key="index"
                class="imageView"
                :src="item"
                :preview-index="index"
                :preview-src-list="form.messageImages"
              />
            </div>
          </el-form-item>
          <el-form-item label="提问时间">
            <span>{{ form.createTime }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option label="未处理" :value="1" />
              <el-option label="已处理" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="答复内容">
            <el-input
              v-model="form.replayContent"
              type="textarea"
              :autosize="{ minRows: 2 }"
            />
            <!-- <span>{{ {0: '手动标签', 1: '其他标签'}[form.labelType] }}</span> -->
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="p-20 choose_footer">
        <el-button type="primary" @click="sendSuccess()">提交</el-button>
        <el-button @click="closeModal()">取消</el-button>
      </div>
    </AppDialog>

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
</template>

<script>
import AppDialog from '@/components/AppDialog'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import AppStatus from '@/components/AppStatus'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
// import AppIconClipboard from '@/components/AppIconClipboard'
import Modal from '@/components/Modal'
import UserInfoModal from '@/components/Modal/user/userInfo.vue'
import {
  messagePage,
  replyMessage,
  deleteMessage
} from '@/api/messageManagement/message'
export default {
  name: 'Message',
  components: {
    AppDialog,
    // AppTableTools,
    AppStatus,
    AppAvatar,
    Modal,
    UserInfoModal
    // AppIconClipboard
  },
  data() {
    return {
      loading: false,
      search: '',
      select: '',
      slotArr: [
        'username',
        'headerLeft',
        'action',
        'footer',
        'receiverType',
        'status',
        'type'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'id', label: '留言编号', type: 'text', 'min-width': '120px' },
          {
            prop: 'username',
            label: '用户名称',
            type: 'slot',
            'min-width': '120px'
          },
          { prop: 'messageContent', label: '内容', type: 'text' },
          {
            prop: 'phone',
            label: '手机号',
            type: 'text',
            'min-width': '150px',
            render: row => {
              let str = ''
              if (row.phone) {
                str = `${row.phoneAreaCode ? '(+' + row.phoneAreaCode + ')' : ''} ${row.phone}`
              } else {
                str = ''
              }
              return str
            }
          },
          { prop: 'email', label: '邮箱', width: 180, type: 'text' },
          { prop: 'updateBy', label: '处理人', type: 'text' },
          { prop: 'status', label: '状态', type: 'slot' },
          { prop: 'createTime', label: '留言时间', type: 'text' },
          { prop: 'type', label: '分类', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '答复',
        visible: false,
        loading: false
      },
      multipleSelection: [],
      form: {
        createTime: '',
        id: 0,
        messageContent: '',
        messageImages: [],
        phone: '',
        status: 0,
        type: 0,
        updateBy: '',
        userId: '',
        username: ''
      },
      rules: {},
      permsList: this.$route.meta.permsList || [],
      UserInfoDialog: {
        visible: false,
        type: 1,
        userId: ''
      }
    }
  },
  mounted() {
    console.log(this.permsList)
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
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    // 打开新增
    openModel(row) {
      this.form = {
        ...row,
        replayContent: row.replayContent
      }
      this.modal = {
        title: '回复',
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
        status: this.select, // 企业群
        username: this.search,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      messagePage(params)
        .then(res => {
          console.log(res, 'res')
          this.loading = false
          res.data.records.map(v => {
            v.messageImages
              ? (v.messageImages = v.messageImages.split(','))
              : (v.messageImages = [])
          })
          this.config.tableData = res.data.records
          console.log(this.config.tableData)
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.select = ''
      this.getList()
    },
    // 点击答复弹框提交按钮
    sendSuccess() {
      // console.log()
      const data = {
        id: this.form.id,
        replayContent: this.form.replayContent,
        status: this.form.status
      }
      this.modal.loading = true
      replyMessage(data)
        .then(res => {
          this.modal.loading = false
          this.modal.visible = false
          this.$notify.success({
            title: '成功',
            message: '回复成功'
          })
          this.getList()
        })
        .catch(() => {
          this.modal.loading = false
        })
    },

    handerSearch() {
      this.config.currentPage = 1
      this.getList()
    },

    // 底部上架下架删除按钮点击事件
    allChange(index) {
      console.log(index, 'index')
      switch (index) {
        case 0:
          this.del()
          break
      }
    },
    // 底部选中本页
    onAllChange(e) {
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    },
    // 删除
    del() {
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请先选择')
      }
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          that.loading = true
          const ids = []
          this.multipleSelection.map(v => ids.push(v.id))
          const param = {
            ids
          }
          deleteMessage(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
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

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  overflow: auto;
  background: #fff;
}
.nickName {
  display: flex;
  align-items: center;
}
.choose_resource {
  width: 700px;
  height: 550px;
  overflow: auto;
}
.choose_footer {
  text-align: center;
}
.imageView {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-top: 10px;
}
.messageContent {
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
