<template>
  <div class="table_wrap">
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
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
      @handleSelectionChange="handleListSelectionChange"
    >
      <template slot="search">
        <myFilterTop ref="searchTop" :search="search" @search="searchFn" />
      </template>
      <div slot="headerRight">
        <el-popover placement="bottom-end" width="150" trigger="click">
          <!-- <el-button slot="reference" type="text" size="small">自定义表头</el-button> -->
          <el-checkbox
            v-model="allColumnsSelected"
            :indeterminate="allColumnsSelectedIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in config.tableColumns"
            :key="item.label"
            v-model="item.visible"
            v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
        <!-- <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="openModel(row)">编辑</el-button>
        <!-- <el-button v-if="row.isEdit" type="text" @click="table_save(row)">保存</el-button>
        <el-button v-if="row.isEdit" type="text" @click="table_cancel(row)">取消</el-button>
        <el-button v-if="!row.isEdit" type="text">移除</el-button> -->
      </div>
      <div slot="sort" slot-scope="{ row }">
        <el-input-number v-if="row.isEdit" v-model="row._sort" :step="1" step-strictly :min="0" />
        <span v-else>{{ row.sort }}</span>
      </div>
      <div slot="commission" slot-scope="{ row }">
        <template v-if="row.isEdit">
          <el-input-number v-model="row._commission" :max="100" :min="0" />
          <span>%</span>
        </template>
        <span v-else>{{ row.commission }}%</span>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="openEmployeeModel">获取企业员工</el-button>
        <!-- <el-button type="danger" size="small" :disabled="multipleSelection.length === 0">批量审核</el-button> -->
      </div>
    </MPageLayout>
    <AppDialog
      v-model="employeeModel.visible"
      :title="employeeModel.title"
      width="640px"
      height="auto"
      @success="employeeModel.visible = false"
    >
      <div
        v-loading="employeeModel.loading"
        element-loading-text="正在获取中….请勿关闭窗口,否则会中断获取用户!"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="customer-info-box"
      >
        <div class="elist-box">
          <!--表格渲染-->
          <MPageLayout
            ref="MPageLayout"
            border
            type="tablePage"
            :slot-arr="slotArr"
            :current-page="employeeConfig.currentPage"
            :page-sizes="employeeConfig.pageSizes"
            :page-size="employeeConfig.pageSize"
            :total="employeeConfig.total"
            :table-data="employeeConfig.tableData"
            :table-columns="employeeConfig.tableColumns"
            :loading="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleEmployeeListSizeChange"
            @current-change="handleEmployeeListCurrentChange"
            @handleSelectionChange="handleEmployeeListSelectionChange"
          >
            <div slot="headerRight">
              <el-popover placement="bottom-end" width="150" trigger="click">
                <!-- <el-button slot="reference" type="text" size="small">自定义表头</el-button> -->

                <el-checkbox
                  v-model="allColumnsSelected"
                  :indeterminate="allColumnsSelectedIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  v-for="item in config.tableColumns"
                  :key="item.label"
                  v-model="item.visible"
                  v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
                  @change="handleCheckedTableColumnsChange(item)"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-popover>
              <!-- <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
            </div>
            <div slot="action" slot-scope="{ row }">
              <el-button type="text" @click="viewAll(row)">获取企业名下所有员工</el-button>
              <!-- <el-button v-if="row.isEdit" type="text" @click="table_save(row)">保存</el-button>
              <el-button v-if="row.isEdit" type="text" @click="table_cancel(row)">取消</el-button>
              <el-button v-if="!row.isEdit" type="text">移除</el-button> -->
            </div>
            <div slot="footer">
              <!-- <el-button type="danger" size="small" :disabled="multipleSelection.length === 0">批量审核</el-button> -->
            </div>
          </MPageLayout>
        </div>
      </div>
      <div slot="footer" class="footer">
        <!-- <el-button type="primary" size="small">保存</el-button> -->
      </div>
    </AppDialog>
    <AppDialog
      v-model="memberModal.visible"
      :title="memberModal.title"
      width="560px"
      height="auto"
      @success="memberModal.visible = false"
    >
      <div v-loading="memberModal.loading" class="customer-info-box">
        <template>
          <el-form ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="企业名称">
              <span>{{ form.corpName }}</span>
            </el-form-item>
            <el-form-item label="部门名称">
              <span>{{ form.deptName }}</span>
            </el-form-item>
            <el-form-item label="成员名称">
              <span>{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="班主任" prop="headTeacherFlag">
              <el-radio v-model="form.headTeacherFlag" label="2" @change="headClickTeacherFlag(true)">是</el-radio>
              <el-radio v-model="form.headTeacherFlag" label="1" @change="headClickTeacherFlag(false)">否</el-radio>
            </el-form-item>
            <el-form-item v-if="form.hokCorpStaffFlag === 2" label="企微客服" prop="customServiceFlag">
              <el-radio
                v-model="form.customServiceFlag"
                label="2"
                :disabled="form.hokCorpStaffFlag === 2 ? false : true"
              >是</el-radio>
              <el-radio
                v-model="form.customServiceFlag"
                label="1"
                :disabled="form.hokCorpStaffFlag === 2 ? false : true"
              >否</el-radio>
            </el-form-item>
            <el-form-item v-else label="企微客服">
              <el-radio
                v-model="form.customServiceFlag"
                label="2"
                :disabled="form.hokCorpStaffFlag === 2 ? false : true"
              >是</el-radio>
              <el-radio
                v-model="form.customServiceFlag"
                label="1"
                :disabled="form.hokCorpStaffFlag === 2 ? false : true"
              >否</el-radio>
            </el-form-item>
            <template v-if="form.headTeacherFlag == 2">
              <el-form-item label="班主任场景">
                <el-radio v-model="form.headTeacherType" label="1">直播交付</el-radio>
                <el-radio v-model="form.headTeacherType" label="2">老客户服务</el-radio>
              </el-form-item>
              <el-form-item v-if="form.headTeacherFlag == 2" label="关联获课账号" prop="hokUserName">
                <el-button type="primary" @click="openAdressBook">添加人员</el-button>
                <span v-if="form.hokUserName">已选：{{ form.hokUserName }}</span>
              </el-form-item>
            </template>
            <template v-if="form.hokUserName && form.headTeacherFlag == 2">
              <el-form-item label="企微机器人">
                <div class="qrcode-info">
                  <div class="qrcode-box">
                    <img :src="form.qrcode" alt="">
                  </div>
                  <span
                    v-if="form.wxRobotStatus !== 1"
                    class="qrcode-txt m-r20"
                    @click="setRobotLogout(form.robotId, form.id)"
                  >解除绑定</span>
                  <span
                    v-if="form.wxRobotStatus === 1 || form.wxRobotStatus === 2"
                    class="qrcode-txt"
                    @click="refreshRobot(form.id)"
                  >扫码成功后请点击刷新</span>
                  <!-- <el-button v-if="form.wxRobotStatus !== 1" type="danger" size="small" class="qrcode-btn" plain>解除绑定</el-button> -->
                </div>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </div>
      <div slot="footer" class="footer">
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import myFilterTop from './CWUserTop'
import {
  corpUsertPage,
  getRobotCode,
  setRobotLogout,
  corpSettingPage,
  corpSettingInitDeptAndUser,
  corpUser,
  refreshRobot
} from '@/api/privateArea/CWCorpUser'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'CWeChat',
  components: {
    AppDialog,
    myFilterTop
  },
  data() {
    return {
      loading: false,
      search: {
        searchType: 'corpId', // 搜索类型
        searchTxt: '', // 搜索内容
        linkHokUserFlag: '', // 关联获课
        headTeacherFlag: '', // 班主任
        customServiceFlag: '', // 企微客服
        wxRobotStatus: '', // 企微机器人
        wxInServiceFlag: '', // 企微在职
        hokInServiceFlag: '' // 获课在职
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'search', 'headerLeft', 'action', 'footer', 'goodsName', 'price', 'type', 'sort', 'commission'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'slot', visible: true },
          { prop: 'corpId', label: '企业(corpid)', type: 'text', visible: true },
          { prop: 'deptName', label: '部门名称', type: 'text', visible: true },
          { prop: 'name', label: '成员名称', type: 'text', visible: true },
          { prop: 'userId', label: 'open_userid', type: 'text', visible: true },
          { prop: 'hokUserName', label: '关联获课账号', type: 'text', visible: true },
          { prop: 'wxRobotStatusTxt', label: '企微机器人', type: 'text', visible: true },
          { prop: 'headTeacherFlagTxt', label: '班主任', type: 'text', visible: true },
          { prop: 'customServiceFlagTxt', label: '企微客服', type: 'text', visible: true },
          { prop: 'wxInServiceFlagTxt', label: '企微在职', type: 'text', visible: true },
          { prop: 'hokInServiceFlagTxt', label: '获课在职', type: 'text', visible: true }
          // { prop: 'commission', label: '加入时间', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      employeeConfig: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'slot', visible: true },
          { prop: 'corpId', label: '企业(corpid)', type: 'text', visible: true },
          { prop: 'corpName', label: '企业名称', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      memberModal: {
        loading: false,
        visible: false,
        title: '编辑'
      },
      employeeModel: {
        visible: false,
        title: '企微员工',
        loading: false
      },
      form: {
        customServiceFlag: '', // 客服标志
        headTeacherFlag: '', // 班主任标志
        hokUserId: '', // 获课编号
        hokUserName: '',
        name: '',
        id: '', // 企业编号
        robotId: '',
        hokCorpStaffFlag: ''
      },
      rules: {
        headTeacherFlag: [{ required: true, message: '请选择班主任', trigger: 'change' }],
        customServiceFlag: [{ required: true, message: '请选择企微客服', trigger: 'change' }],
        hokUserName: [{ required: true, message: '请选择获课账户', trigger: 'change' }]
      },
      disabledUser: []
    }
  },
  created() {},
  mounted() {
    this.getList()
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      console.log('search', this.search)
      const params = {
        linkHokUserFlag: this.search.linkHokUserFlag,
        headTeacherFlag: this.search.headTeacherFlag,
        customServiceFlag: this.search.customServiceFlag,
        wxRobotStatus: this.search.wxRobotStatus,
        wxInServiceFlag: this.search.wxInServiceFlag,
        hokInServiceFlag: this.search.hokInServiceFlag,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      params[this.search.searchType] = this.search.searchTxt
      corpUsertPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.loading = false
          res.data.records.map((v) => {
            if (v.wxRobotStatus === 1) {
              v['wxRobotStatusTxt'] = '否'
            } else if (v.wxRobotStatus === 2) {
              v['wxRobotStatusTxt'] = '离线'
            } else if (v.wxRobotStatus === 3) {
              v['wxRobotStatusTxt'] = '在线'
            }
            if (v.hokInServiceFlag === 1) {
              v['hokInServiceFlagTxt'] = '离职'
            } else if (v.hokInServiceFlag === 2) {
              v['hokInServiceFlagTxt'] = '在职'
            } else if (v.hokInServiceFlag === 0) {
              v['hokInServiceFlagTxt'] = '未绑定'
            }
            v.wxInServiceFlag === 1 ? (v['wxInServiceFlagTxt'] = '离职') : (v['wxInServiceFlagTxt'] = '在职')
            v.headTeacherFlag === 1 ? (v['headTeacherFlagTxt'] = '否') : (v['headTeacherFlagTxt'] = '是')
            v.customServiceFlag === 1 ? (v['customServiceFlagTxt'] = '否') : (v['customServiceFlagTxt'] = '是')
          })
          this.config.tableData = res.data.records
          this.config.total = +res.data.total
          // 企业员工列表
          // this.employeeConfig.tableData = res.data.records
          // this.employeeConfig.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn(res) {
      this.search = res
      this.config.currentPage = 1
      this.getList()
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map((v) => {
        v.visible = true
      })
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'text', visible: true },
        { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
        { prop: 'price', label: '推广员', type: 'text', visible: true },
        { prop: 'type', label: '审核状态', type: 'text', visible: true },
        { prop: 'sort', label: '姓名', type: 'text', visible: true },
        { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
        { prop: 'sort', label: '累计用户', type: 'text', visible: true },
        { prop: 'sort', label: '状态', type: 'text', visible: true },
        { prop: 'commission', label: '加入时间', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('promoter_tableColumns', JSON.stringify(tableColumns))
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      this.getList()
    },
    handleEmployeeListSizeChange(val) {
      this.employeeConfig.pageSize = val
      this.employeeConfig.currentPage = 1
      this.corpSettingPage()
    },
    handleEmployeeListCurrentChange(val) {
      this.employeeConfig.currentPage = val
      this.corpSettingPage()
    },
    handleEmployeeListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      this.corpSettingPage()
    },
    // 获取列表数据
    corpSettingPage() {
      this.employeeModel.loading = true
      const params = {
        current: this.employeeConfig.currentPage,
        size: this.employeeConfig.pageSize
      }
      corpSettingPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.loading = false
          // 企业员工列表
          this.employeeConfig.tableData = res.data.records
          this.employeeConfig.total = res.data.total
          this.employeeModel.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 打开成员信息弹框
    openEmployeeModel(row) {
      this.employeeConfig.pageSize = 10
      this.employeeConfig.currentPage = 1
      this.corpSettingPage()
      this.employeeModel.visible = true
    },
    refreshRobot(id) {
      const params = id
      this.memberModal.loading = true
      refreshRobot(params)
        .then((res) => {
          console.log(res.data, 'res')
          if (res.code === 1 && res.data) {
            this.form.qrcode = res.data.qrcode
            this.form.robotId = res.data.robotId
            this.form.wxRobotStatus = res.data.wxRobotStatus
            res.data.wxRobotStatus === 2 ? this.getRobotCode() : ''
            this.config.tableData.forEach((e) => {
              if (id === String(e.id)) {
                e.wxRobotStatus = res.data.wxRobotStatus
                res.data.wxRobotStatus === 3 ? (e.wxRobotQrCode = res.data.qrcode) : (e.wxRobotQrCode = '')
                if (res.data.wxRobotStatus === 1) {
                  e.wxRobotStatusTxt = '否'
                } else if (res.data.wxRobotStatus === 2) {
                  e.wxRobotStatusTxt = '离线'
                } else if (res.data.wxRobotStatus === 3) {
                  e.wxRobotStatusTxt = '在线'
                }
              }
            })
          }
          this.memberModal.loading = false
        })
        .catch(() => {
          this.memberModal.loading = false
        })
    },
    // 获取企微登录 二维码
    getRobotCode() {
      const params = { robotId: this.form.robotId }
      this.memberModal.loading = true
      getRobotCode(params)
        .then((res) => {
          // console.log(res.data, 'res')
          this.form.qrcode = res.data
          this.memberModal.loading = false
        })
        .catch(() => {})
    },
    setRobotLogout(robotId, id) {
      console.log(robotId)
      const params = { robotId }
      const that = this
      this.memberModal.loading = true
      setRobotLogout(params)
        .then((res) => {
          this.config.tableData.forEach((e) => {
            if (id === String(e.id)) {
              e.wxRobotStatus = 1
              e.wxRobotQrCode = ''
              e.wxRobotStatusTxt = '否'
              that.form.qrcode = ''
              that.form.wxRobotStatus = 1
            }
          })
          this.getRobotCode()
          this.$message({
            message: '解绑成功',
            type: 'success'
          })
          this.memberModal.loading = false
        })
        .catch(() => {
          this.$message({
            message: '解绑失败',
            type: 'warning'
          })
          this.memberModal.loading = false
        })
    },
    headClickTeacherFlag(type) {
      // console.log(type)
      type ? this.getRobotCode() : ''
    },
    openModel(data) {
      let headTeacherType = data.headTeacherType
      data.headTeacherType === 0 ? (headTeacherType = 1) : (headTeacherType = data.headTeacherType)
      this.disabledUser = []

      this.form = {
        id: data.id,
        corpName: data.corpName,
        deptName: data.deptName,
        name: data.name,
        headTeacherFlag: String(data.headTeacherFlag),
        customServiceFlag: data.hokCorpStaffFlag === 2 ? String(data.customServiceFlag) : '',
        hokUserId: data.hokUserId,
        qrcode: data.wxRobotQrCode,
        hokUserName: data.hokUserName,
        wxRobotStatus: data.wxRobotStatus,
        robotId: data.robotId,
        headTeacherType: String(headTeacherType),
        hokCorpStaffFlag: data.hokCorpStaffFlag // 等于2的时候可选
      }
      // console.log('看着这里', data.headTeacherType)
      if (data.wxRobotStatus === 1 || data.wxRobotStatus === 2) {
        data.headTeacherFlag === 2 ? this.getRobotCode() : ''
      } else {
        this.memberModal.loading = false
      }
      this.disabledUser.push(data.hokUserId)
      this.memberModal.visible = true
    },
    // 获取列表数据
    corpSettingInitDeptAndUser(corpId) {
      this.employeeModel.loading = true
      const params = { corpId }
      corpSettingInitDeptAndUser(params)
        .then((res) => {
          console.log(res, 'res')
          this.loading = false
          // 企业员工列表
          setTimeout(() => {
            this.$message({
              message: '更新完成',
              type: 'success'
            })
            this.employeeModel.loading = false
          }, 2000)
          setTimeout(() => {
            this.employeeModel.visible = false
            this.$refs.searchTop.clear()
          }, 4000)
        })
        .catch(() => {
          this.employeeModel.loading = false
          this.$message({
            message: '更新失败',
            type: 'warning'
          })
        })
    },
    viewAll(data) {
      this.employeeModel.loading = true
      console.log(data)
      console.log(data.corpId)
      this.corpSettingInitDeptAndUser(data.corpId)
    },
    // 打开部门组件
    openAdressBook() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        defultCheck: [],
        disabledUser: this.disabledUser,
        type: [1],
        success: (res) => {
          console.log(res.user)
          this.form.hokUserName = res.user[0].userName
          this.form.hokUserId = res.user[0].userId
          this.disabledUser = []
          this.disabledUser.push(res.user[0].userId)
          this.$refs.form.clearValidate('hokUserName')
        }
      })
    },
    // 更新用户信息
    corpUser(params) {
      this.memberModal.loading = true
      corpUser(params)
        .then((res) => {
          console.log(res, 'res')
          console.log(params, 'params')
          this.config.tableData.forEach((e) => {
            if (params.id === String(e.id)) {
              e.customServiceFlag = params.customServiceFlag
              params.customServiceFlag === 1 ? (e.customServiceFlagTxt = '否') : (e.customServiceFlagTxt = '是')
              e.headTeacherFlag = params.headTeacherFlag
              params.headTeacherFlag === 1 ? (e.headTeacherFlagTxt = '否') : (e.headTeacherFlagTxt = '是')
            }
          })
          this.memberModal.loading = false
          this.memberModal.visible = false
          this.getList()
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        })
        .catch(() => {
          // this.$message({
          //   message: '编辑失败',
          //   type: 'warning'
          // })
          this.memberModal.loading = false
          // this.memberModal.visible = false
        })
    },
    // 点击保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!')
          console.log(this.form)
          const params = {
            customServiceFlag: Number(this.form.customServiceFlag),
            headTeacherFlag: Number(this.form.headTeacherFlag),
            headTeacherType: Number(this.form.headTeacherType),
            hokUserId: this.form.hokUserId,
            id: String(this.form.id)
          }
          console.log('提交数据', params)
          this.corpUser(params)
        } else {
          console.log('error submit!!')
          this.$notify({
            title: '警告',
            message: '请完成必填项!',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table_wrap {
  height: calc(100vh - 166px);
  padding: 0 20px;
}
.customer-info-box {
  padding: 20px;
  .qrcode-info {
    display: flex;
    align-items: flex-end;
    .qrcode-box {
      width: 120px;
      height: 120px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .qrcode-txt {
      cursor: pointer;
      color: #606266;
      font-weight: 500;
      font-size: 14px;
    }
  }
}
.fl {
  align-items: center;
}

.input-w {
  width: 260px;
}
.m-l20 {
  padding-left: 20px;
}
.m-r20 {
  margin-right: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}
.elist-box {
  height: 580px;
  overflow: hidden;
}
::v-deep .tablePage .page_footer{
  justify-content: space-between;
  box-shadow: none;
  padding:10px 0px 0px;
  height:auto;
}
::v-deep .page_header{
  padding: 0!important;
}
::v-deep .my-table{
  margin:0!important
}
</style>
