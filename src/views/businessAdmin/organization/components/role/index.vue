<template>
  <div class="page-wrap">
    <div style="padding: 10px 20px">
      <div style="color: #333333; font-weight: 700; margin-bottom: 20px">
        <h1>综合管理中心</h1>
      </div>
      <div class="flex">
        <el-input
          v-model="search"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 300px"
          @keyup.enter.native="onSearchFn"
          @clear="onSearchFn"
        />
        <el-button
          class="m-l-10"
          size="small"
          type="primary"
          @click="onSearchFn"
          >查询</el-button
        >
      </div>
    </div>

    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      style="height: 80vh"
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
      checkbox
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
      @handleSelectionChange="handleListSelectionChange"
    >
      <div slot="headerLeft" style="margin-bottom: 5px">
        <div>
          <div>
            <el-button
              v-permission="['system:role:add', permsList]"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="showAddDialog"
              >新增</el-button
            >
            <el-button
              v-if="
                (roleUserModel.isDefault && ifAdmin) || !roleUserModel.isDefault
              "
              size="small"
              type="danger"
              @click="delAll"
              >批量删除</el-button
            >
          </div>
        </div>
      </div>
      <div slot="headerRight">
        <el-popover placement="bottom-end" width="150" trigger="click">
          <el-button slot="reference" type="text" size="small"
            >自定义表头</el-button
          >

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
            v-dragging="{
              item: item,
              list: config.tableColumns,
              group: 'item'
            }"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
        <el-button type="text" size="small" class="m-l-20" @click="clear()"
          >重置表头</el-button
        >
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-if="!(row.isDefault && !ifAdmin)"
          v-permission="['system:role:edit', permsList]"
          type="text"
          @click="openRoleSetting(row)"
          >设置</el-button
        >
        <el-button
          v-if="!(row.isDefault && !ifAdmin)"
          v-permission="['system:role:remove', permsList]"
          type="text"
          style="color: #ff4949"
          @click="delRole(row)"
          >删除</el-button
        >
      </div>
      <div slot="roleNum" slot-scope="{ row }">
        <span class="a_link" @click="openRoleUserModel(row)">{{
          row.roleNum
        }}</span>
      </div>
      <div slot="roleTerminal" slot-scope="{ row }">
        <span>
          {{ { 1: '商家后台' }[row.roleTerminal] }}
        </span>
      </div>
      <!-- <div slot="footer">
        <el-button
          v-permission="['system:role:remove', permsList]"
          type="danger"
          size="small"
          :disabled="multipleSelection.length === 0"
          @click="delAll"
          >批量删除</el-button
        >
      </div> -->
      <div slot="roleId" slot-scope="{ row }">
        <template v-if="row.isDefault && !ifAdmin">
          <span>{{ row.roleId }}</span>
        </template>
        <template v-else>
          <span class="a_link" @click="editRoleNameOpen(row)">{{
            row.roleId
          }}</span>
        </template>
      </div>
    </MPageLayout>

    <!-- 新增/修改角色弹框 -->
    <el-drawer
      :title="formDialog.title"
      :visible.sync="formDialog.visible"
      size="500px"
      :wrapper-closable="false"
      @close="deforeCloseDialog"
    >
      <div class="groupDrawer">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button
            :loading="formDialog.loading"
            @click="formDialog.visible = false"
            >取 消</el-button
          >
          <el-button
            v-permission="['system:role:edit,system:role:add', permsList]"
            type="primary"
            :loading="formDialog.loading"
            @click="sure"
            >确 定</el-button
          >
        </div>
      </div>
    </el-drawer>

    <!-- 设置角色权限弹框 -->
    <Modal
      :title="roleSettingModal.title"
      :type="roleSettingModal.type"
      size="600px"
      width="600px"
      :visible.sync="roleSettingModal.visible"
    >
      <roleModal
        :type="roleSettingModal.type"
        :visible.sync="roleSettingModal.visible"
        :data="roleSettingModal.data"
        @close="closeRoleSettingModal()"
        @success="settingRoleSuccess"
      />
    </Modal>

    <!-- 角色人员列表 -->
    <AppDialog v-model="roleUserModel.visible" title="">
      <div
        slot="title"
        style="width: 700px; display: inline-block; margin-top: 10px"
      >
        <span>
          <p style="float: left">{{ roleUserModel.title }}</p>
          <p
            style="
              float: left;
              margin-left: 20px;
              font-size: 14px;
              font-weight: normal;
              line-height: 26px;
            "
          >
            {{ roleUserModel.roleName }}
          </p>
        </span>
        <el-button
          v-if="
            (roleUserModel.isDefault && ifAdmin) || !roleUserModel.isDefault
          "
          size="mini"
          style="position: absolute; right: 80px"
          @click="addNewUser"
          >新增人员</el-button
        >
      </div>
      <div v-loading="roleUserModel.loading" class="p-10">
        <el-table
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="roleUserModel.tableData"
          border
          height="500px"
          @selection-change="roleChangeSelect"
        >
          <el-table-column type="selection" width="40" />
          <!-- <el-table-column prop="userName" label="登录账号" /> -->
          <el-table-column prop="nickName" label="员工姓名" />
          <el-table-column prop="phoneNumber" label="手机号码" width="120" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="{ row }">
              <AppStatus :status="{ 0: 'success', 1: 'error' }[row.status]">
                <span>{{ { 0: '在职', 1: '离职' }[row.status] }}</span>
              </AppStatus>
            </template>
          </el-table-column>
          <el-table-column prop="roleVoList" label="角色">
            <template slot-scope="{ row }">
              <el-tag v-for="(item, index) in row.roleVoList" :key="index">{{
                item.roleName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="部门" />
          <el-table-column prop="time" width="140" label="添加日期" />
          <!-- <el-table-column prop="updateTime" width="140" label="更新日期" /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                style="color: #ee2e14"
                @click="deleteUser(scope.row)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="fr m-t-10"
          :current-page.sync="roleUserModel.current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="roleUserModel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="roleUserModel.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div slot="footer" style="margin-top: -90px; padding: 15px">
        <el-button
          v-if="
            (roleUserModel.isDefault && ifAdmin) || !roleUserModel.isDefault
          "
          size="mini"
          type="danger"
          @click="plDelete"
          >批量删除</el-button
        >
      </div>
    </AppDialog>
    <div v-if="moveRoleModalObj.moveRoleModalFlag" class="move-role-cls">
      <el-dialog
        :title="moveRoleModalObj.title"
        :visible.sync="moveRoleModalObj.moveRoleModalFlag"
        width="30%"
        :before-close="closeMoveRole"
      >
        <span class="title-span">
          <em>移除角色：</em>
          <p>{{ chooseNumberObj.roleName }}</p>
        </span>
        <span v-if="moveRoleModalObj.isOne" class="title-span">
          <em>移除人员：</em>
          <p>{{ moveRoleModalObj.row.nickName }}</p>
        </span>
        <span v-else class="title-span">
          <em>移除人员：</em>
          <p v-for="(item, index) in roleChangeMultiple" :key="item.userId">
            {{ item.nickName }}<em v-if="index !== 0">、</em>
          </p>
        </span>
        <span>确认是否移除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            @click="moveRoleModalObj.moveRoleModalFlag = false"
            >取 消</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="sureToMoveUser(moveRoleModalObj)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  editRole,
  getMenuTree,
  getRoleUserList,
  delRole
} from '@/api/system/role'
import roleModal from '@/components/Modal/system/roleModal.vue'
import Modal from '@/components/Modal'
import AppDialog from '@/components/AppDialog'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
import { moveUser, getAllUserByRoleId, setAllUserByRoleId } from '@/api/role'
const defaultForm = {
  menuIds: [],
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: ''
}
export default {
  name: 'Menu',
  components: {
    roleModal,
    Modal,
    AppDialog,
    AppStatus
  },
  data() {
    return {
      roleChangeMultiple: [],
      moveRoleModalObj: {
        moveRoleModalFlag: false,
        title: '移除人员确认'
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,

      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'roleNum',
        'roleTerminal',
        'roleId'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'roleName', label: '角色名称', type: 'text', visible: true },
          { prop: 'roleId', label: '角色ID', type: 'slot', visible: true },
          { prop: 'roleNum', label: '人员数量', type: 'slot', visible: true },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            visible: true
          },
          { prop: 'roleSort', label: '显示顺序', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      query: {
        blurry: '',
        createTime: ''
      },
      search: '',
      crud: {
        loading: false,
        data: []
      },
      // 新增角色/编辑角色弹框
      formDialog: {
        title: '新增',
        type: 1,
        visible: false,
        loading: false
      },
      form: {
        roleName: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '请输入权限字符串', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (!/[a-zA-z]$/.test(value)) {
                callback(new Error('请输入英文'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
        ],
        menuIds: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个角色权限',
            trigger: 'blur'
          }
        ]
      },
      // 设置角色权限弹框
      roleSettingModal: {
        title: '设置',
        type: 1,
        visible: false,
        loading: false,
        data: {}
      },
      treeData: [],
      roleUserModel: {
        title: '人员列表',
        roleName: '',
        visible: false,
        loading: false,
        tableData: [],
        current: 1,
        size: 10,
        total: 0
      },
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      chooseNumberObj: {}
    }
  },
  computed: {
    ...mapGetters(['ifAdmin'])
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
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
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log(res)
      localStorage.setItem(
        'role_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    this.$store.dispatch('user/viewingFlag', 'roleManagement')
    this.$store.dispatch('user/getUserAdmin')
    const tableColumns = localStorage.getItem('role_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.getList()
  },
  methods: {
    plDelete() {
      if (this.roleChangeMultiple.length === 0) {
        return this.$message.warning('请先选择数据')
      }
      console.log('this.roleChangeMultiple: ', this.roleChangeMultiple)
      this.moveRoleModalObj.title = '批量移除人员确认'
      this.moveRoleModalObj.moveRoleModalFlag = true
      this.moveRoleModalObj.isOne = false
    },
    closeMoveRole() {
      this.moveRoleModalObj.moveRoleModalFlag = false
    },
    addNewUser() {
      getAllUserByRoleId(this.chooseNumberObj.roleId).then(res => {
        if (res.code === 1) {
          const checkUser = []
          const userIdsForDisabl = []
          res.data.some(item => {
            const obj = {
              userId: item.userId,
              userName: item.userName,
              nickName: item.nickName
            }
            userIdsForDisabl.push(item.userId)
            checkUser.push(obj)
          })
          this.$AddressBook({
            visible: true,
            multiple: true,
            type: [1],
            disabledUser: userIdsForDisabl,
            success: res => {
              const userForids = []
              res.user.some(item => {
                userForids.push(item.userId)
              })
              const params = {
                roleId: this.chooseNumberObj.roleId,
                userIds: userForids
              }
              setAllUserByRoleId(params).then(res => {
                if (res.code === 1) {
                  this.$message.success('添加成功！')
                  const params = {
                    roleId: this.roleUserModel.roleId,
                    current: this.roleUserModel.current,
                    size: this.roleUserModel.size
                  }
                  getRoleUserList(params)
                    .then(res => {
                      this.roleUserModel.tableData = res.data.records
                      this.roleUserModel.total = res.data.total
                      this.roleUserModel.loading = false
                    })
                    .catch(() => {
                      this.roleUserModel.loading = false
                    })
                  this.getList()
                }
              })
            }
          })
        }
      })
    },
    sureToMoveUser(data) {
      let params = {}
      if (data.isOne) {
        params = {
          roleId: this.chooseNumberObj.roleId,
          userIds: [data.row.userId]
        }
      } else {
        const userIds = []
        this.roleChangeMultiple.some(item => {
          userIds.push(item.userId)
        })
        params = {
          roleId: this.chooseNumberObj.roleId,
          userIds: userIds
        }
      }

      moveUser(params).then(res => {
        if (res.code === 1) {
          this.$message.success('移除成功！')
          this.moveRoleModalObj.moveRoleModalFlag = false
          const params = {
            roleId: this.roleUserModel.roleId,
            current: this.roleUserModel.current,
            size: this.roleUserModel.size
          }
          getRoleUserList(params)
            .then(res => {
              this.roleUserModel.tableData = res.data.records
              this.roleUserModel.total = res.data.total
              this.roleUserModel.loading = false
            })
            .catch(() => {
              this.roleUserModel.loading = false
            })
          this.getList()
        }
      })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'role_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'role_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },

    roleChangeSelect(val) {
      console.log(val)
      this.roleChangeMultiple = val
    },
    // 点击新增按钮打开新增弹框
    showAddDialog() {
      this.form = JSON.parse(JSON.stringify(defaultForm))
      this.formDialog = {
        title: '新增',
        type: 1,
        visible: true,
        loading: true
      }
      this.form = {
        roleName: ''
      }
      getMenuTree()
        .then(res => {
          this.treeData = res.data
          this.formDialog.loading = false
        })
        .catch(() => {
          this.formDialog.loading = false
        })
    },
    deleteUser(row) {
      console.log('row:', row)
      this.moveRoleModalObj.title = '移除人员确认'
      this.moveRoleModalObj.moveRoleModalFlag = true
      this.moveRoleModalObj.isOne = true
      this.moveRoleModalObj.row = row
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'slot', visible: true },
        { prop: 'roleId', label: 'ID', type: 'slot', visible: true },
        {
          prop: 'roleTerminal',
          label: '终端/系统',
          type: 'slot',
          visible: true
        },
        { prop: 'roleName', label: '角色名称', type: 'text', visible: true },
        { prop: 'roleNum', label: '人员数量', type: 'slot', visible: true },
        { prop: 'createTime', label: '创建时间', type: 'text', visible: true },
        { prop: 'roleSort', label: '排序', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('role_tableColumns', JSON.stringify(tableColumns))
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        size: this.config.pageSize,
        current: this.config.currentPage,
        roleName: this.search
      }
      getRoleList(params)
        .then(res => {
          console.log('获取列表数据', res)
          this.config.tableData = res.data.records
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击确定
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.formDialog.loading = true
          const data = {
            ...this.form
          }
          if (this.formDialog.type === 1) {
            addRole(data)
              .then(res => {
                this.formDialog.loading = false
                this.formDialog.visible = false
                this.getList()
              })
              .catch(() => {
                this.formDialog.loading = false
              })
          } else if (this.formDialog.type === 2) {
            editRole(data)
              .then(() => {
                this.formDialog.loading = false
                this.formDialog.visible = false
                this.getList()
              })
              .catch(() => {
                this.formDialog.loading = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 打开设置角色权限弹框
    openRoleSetting(row) {
      this.roleSettingModal = {
        type: 1,
        title: '设置',
        visible: true,
        data: row
      }
    },
    // 关闭设置角色权限弹框
    closeRoleSettingModal() {
      this.roleSettingModal.visible = false
    },
    // 设置角色权限
    settingRoleSuccess() {
      this.closeRoleSettingModal()
      this.getList()
    },
    handleCheckChange(node, check) {
      console.log(node, check)
      // console.log(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
      this.form.menuIds = check.checkedKeys
      console.log(this.form.menuIds)
      this.$refs.form.validateField('menuIds')
    },
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate)
    //   if (checked) {
    //     // 添加
    //     this.form.menuIds.push(data.id)
    //   } else {
    //     // 移除
    //     const index = this.form.menuIds.findIndex(v => v.id === data.id)
    //     this.form.menuIds.splice(index, 1)
    //   }
    // },
    // 打开人员列表弹框
    openRoleUserModel(row) {
      console.log(row)
      this.chooseNumberObj = row
      console.log('sdfsafdsa:', this.chooseNumberObj)
      this.roleUserModel = {
        title: '人员列表',
        roleName: row.roleName,
        visible: true,
        loading: true,
        tableData: [],
        current: 1,
        size: 10,
        total: 0,
        isDefault: row.isDefault,
        roleId: row.roleId
      }
      this.getRoleUserList()
      // this.roleUserModel.visible = true
    },
    getRoleUserList() {
      this.roleUserModel.loading = true
      const params = {
        roleId: this.roleUserModel.roleId,
        current: this.roleUserModel.current,
        size: this.roleUserModel.size
      }
      getRoleUserList(params)
        .then(res => {
          this.roleUserModel.tableData = res.data.records
          this.roleUserModel.total = res.data.total
          this.roleUserModel.loading = false
        })
        .catch(() => {
          this.roleUserModel.loading = false
        })
    },
    handleSizeChange(val) {
      this.roleUserModel.size = val
      this.getRoleUserList()
    },
    handleCurrentChange(val) {
      this.roleUserModel.current = val
      this.getRoleUserList()
    },
    delRole(row) {
      console.log(row)
      const str = '确定删除【' + row.roleName + '】这个角色吗？'
      this.$delModal({
        tips: str,
        success: () => {
          this.loading = true
          delRole(row.roleId)
            .then(res => {
              this.config.currentPage = 1
              this.getList()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 多个删除
    delAll() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }
      console.log('sssssss:', this.multipleSelection)
      let str = '确定删除'
      this.multipleSelection.some((item, index) => {
        if (index !== this.multipleSelection.length - 1) {
          str += '【' + item.roleName + '】、'
        } else {
          str += '【' + item.roleName + '】'
        }
      })
      str += '这些角色吗？'
      this.$delModal({
        tips: str,
        success: () => {
          this.loading = true
          const roles = []
          this.multipleSelection.map(v => roles.push(v.roleId))
          delRole(roles)
            .then(res => {
              this.getList()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
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
    },
    // 修改角色名称弹框
    editRoleNameOpen(row) {
      console.log(row)
      this.formDialog = {
        title: '修改',
        type: 2,
        visible: true,
        loading: false
      }
      this.form = {
        roleName: row.roleName,
        roleId: row.roleId
      }
    },
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
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

// .black-list {
//   min-width: 1200px;
//   height: calc(100vh - 200px);
// }

.page-wrap {
  height: 100%;
  background: #fff;
}
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .demo-ruleForm {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}

.move-role-cls {
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
  .title-span {
    width: 100%;
    display: inline-block;
    margin-bottom: 10px;
    em {
      float: left;
      font-style: normal;
    }
    p {
      float: left;
    }
  }
}
</style>
