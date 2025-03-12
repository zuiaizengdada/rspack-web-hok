<template>
  <div class="page_warp">
    <div class="custom-tree-container view" :style="setLeftStyle()">
      <div v-loading="loading" class="block">
        <div class="search">
          <div class="search-bottom">
            <span
              v-if="searchType === 2"
              style="cursor: pointer; color: #105cfb; width: 5em"
              @click="searchBack"
              >返回</span
            >
            <el-input
              v-model.trim="search.deptName"
              size="small"
              suffix-icon="el-icon-search"
              clearable
              placeholder="请输入部门名称"
              @keyup.enter.native="searchFn"
            />
          </div>
          <!-- <el-button
            v-permission="['system:dept:add', permsList]"
            size="small"
            class="m-r-20"
            type="primary"
            @click="openDeptModal"
            >新增部门</el-button
          >
          <span v-if="searchType === 2" @click="searchBack">返回</span>
          <el-input
            v-model.trim="search.deptName"
            size="small"
            suffix-icon="el-icon-search"
            clearable
            placeholder="请输入部门名称"
            @keyup.enter.native="searchFn"
          /> -->
        </div>

        <div class="tree">
          <template v-if="searchType === 1">
            <el-tree
              ref="tree"
              :expand-on-click-node="false"
              :default-expanded-keys="defaultExpandedKeys"
              :load="loadNode"
              lazy
              :highlight-current="true"
              node-key="id"
              @node-expand="expandChange"
              @node-click="nodeClick"
            >
              <div slot-scope="{ node, data }" class="addressBooksBox">
                <div class="checkName">
                  <span :title="node.label">{{ node.label }}</span
                  >&nbsp;<el-tag
                    v-if="data.deptType === 1"
                    effect="plain"
                    size="mini"
                    >外</el-tag
                  >
                </div>
              </div>
            </el-tree>
          </template>

          <template v-else>
            <div class="searchDept">
              <div
                v-for="(item, index) in searchDeptData"
                :key="index"
                class="searchDept"
                :class="{ active: item.deptId === deptId }"
                @click="searchDeptClick(item)"
              >
                <span class="checkName" :title="item.deptName">{{
                  item.deptName
                }}</span>
                <!-- <el-dropdown
                  v-if="
                    permsList.includes('system:dept:edit') ||
                    permsList.includes('system:dept:remove')
                  "
                  trigger="click"
                >
                  <span class="el-dropdown-link">
                    <span class="next tips">操作</span>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-permission="['system:dept:edit', permsList]"
                      @click.native="openSearchEditDeptModal(item)"
                      >编辑</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-permission="['system:dept:remove', permsList]"
                      @click.native="delSearchDept(item)"
                      >删除</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown> -->
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div id="line" class="line" />
    <div :style="setRightStyle()" class="view page_warp_right">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`全部员工(${totalCount.all})`" name="all">
          <filterTop :search="search" type="all" @search="searchUserFn" />
          <div class="page_wrap_right_table">
            <MPageLayout
              ref="MPageLayoutall"
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
              row-key="userId"
              reserve-selection
              :default-sort="{ prop: 'entryDate', order: null }"
              @sort-change="sortChange"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            >
              <div slot="headerRight" style="margin-bottom: 5px">
                <el-button
                  size="small"
                  type="default"
                  :disabled="multipleSelection.length === 0"
                  @click="handleBatchAddSign"
                  class="addBtn"
                  >批量添加签署</el-button
                >
              </div>
              <!-- <div slot="nickName" slot-scope="{ row }">
                <span>{{ row.nickName }}</span
                >&nbsp;<el-tag
                  v-if="row.deptType === 1"
                  effect="plain"
                  size="mini"
                  >外</el-tag
                >
              </div> -->
              <div slot="action" slot-scope="{ row }">
                <el-button type="text" @click="handleLeave(row)"
                  >离职</el-button
                >
                <el-button
                  type="text"
                  @click="handleRegular(row)"
                  v-if="row.employeeType === 1"
                  >转正</el-button
                >

                <el-button type="text" @click="handleTransfer(row)"
                  >调动</el-button
                >

                <el-button type="text" @click="toDetail(row)"
                  >查看详情</el-button
                >
              </div>
            </MPageLayout>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="`试用期员工(${totalCount.probation})`"
          name="probation"
        >
          <filterTop :search="search" type="probation" @search="searchUserFn" />
          <div class="page_wrap_right_table">
            <MPageLayout
              ref="MPageLayoutprobation"
              type="tablePage"
              :slot-arr="['headerRight', 'headerLeft', 'action', 'footer']"
              :current-page="config.currentPage"
              :page-sizes="config.pageSizes"
              :page-size="config.pageSize"
              :total="config.total"
              :table-data="config.tableData"
              :table-columns="config.tableProbationColumns"
              :loading="loading"
              layout="total, sizes, prev, pager, next, jumper"
              checkbox
              row-key="userId"
              reserve-selection
              :default-sort="{ prop: 'entryDate', order: null }"
              @sort-change="sortChange"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            >
              <div slot="headerRight" style="margin-bottom: 5px">
                <el-button
                  size="small"
                  type="default"
                  :disabled="multipleSelection.length === 0"
                  @click="handleBatchAddSign"
                  class="addBtn"
                  >批量添加签署</el-button
                >
              </div>
              <div slot="action" slot-scope="{ row }">
                <el-button type="text" @click="handleLeave(row)"
                  >离职</el-button
                >
                <el-button type="text" @click="handleRegular(row)"
                  >转正</el-button
                >
                <el-button type="text" @click="handleTransfer(row)"
                  >调动</el-button
                >
                <el-button type="text" @click="toDetail(row)"
                  >查看详情</el-button
                >
              </div>
            </MPageLayout>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`正式员工(${totalCount.regular})`" name="regular">
          <filterTop :search="search" type="regular" @search="searchUserFn" />
          <div class="page_wrap_right_table">
            <MPageLayout
              ref="MPageLayoutregular"
              type="tablePage"
              :slot-arr="['headerRight', 'headerLeft', 'action', 'footer']"
              :current-page="config.currentPage"
              :page-sizes="config.pageSizes"
              :page-size="config.pageSize"
              :total="config.total"
              :table-data="config.tableData"
              :table-columns="config.tableRegularColumns"
              :loading="loading"
              layout="total, sizes, prev, pager, next, jumper"
              checkbox
              row-key="userId"
              reserve-selection
              :default-sort="{ prop: 'entryDate', order: null }"
              @sort-change="sortChange"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            >
              <div slot="headerRight" style="margin-bottom: 5px">
                <el-button
                  size="small"
                  type="default"
                  :disabled="multipleSelection.length === 0"
                  @click="handleBatchAddSign"
                  class="addBtn"
                  >批量添加签署</el-button
                >
              </div>
              <div slot="action" slot-scope="{ row }">
                <el-button type="text" @click="handleLeave(row)"
                  >离职</el-button
                >
                <el-button type="text" @click="handleTransfer(row)"
                  >调动</el-button
                >

                <el-button type="text" @click="toDetail(row)"
                  >查看详情</el-button
                >
              </div>
            </MPageLayout>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`离职(${totalCount.quit})`" name="quit">
          <filterTop :search="search" type="quit" @search="searchUserFn" />
          <div class="page_wrap_right_table">
            <MPageLayout
              ref="MPageLayoutquit"
              type="tablePage"
              :slot-arr="['headerLeft', 'action', 'footer']"
              :current-page="config.currentPage"
              :page-sizes="config.pageSizes"
              :page-size="config.pageSize"
              :total="config.total"
              :table-data="config.tableData"
              :table-columns="config.tableQuitColumns"
              :loading="loading"
              :default-sort="{ prop: 'entryDate', order: null }"
              @sort-change="sortChange"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            >
              <div slot="action" slot-scope="{ row }">
                <el-button type="text" @click="toDetail(row)"
                  >查看详情</el-button
                >
              </div>
            </MPageLayout>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`签署审核(${totalCount.review})`" name="review">
          <filterTop :search="search" type="review" @search="searchUserFn" />
          <div class="page_wrap_right_table">
            <MPageLayout
              ref="MPageLayoutreview"
              type="tablePage"
              :slot-arr="[
                'headerRight',
                'action',
                'headerLeft',
                'footer',
                'waitForApprovalNum',
                'waitForSealNum'
              ]"
              :current-page="config.currentPage"
              :page-sizes="config.pageSizes"
              :page-size="config.pageSize"
              :total="config.total"
              :table-data="config.tableData"
              :table-columns="config.tableReviewColumns"
              :loading="loading"
              layout="total, sizes, prev, pager, next, jumper"
              checkbox
              row-key="personnelBaseInfoId"
              reserve-selection
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @handleSelectionChange="handleSelectionChange"
            >
              <div slot="headerRight" style="margin-bottom: 5px">
                <el-button
                  size="small"
                  type="default"
                  class="addBtn"
                  :disabled="multipleSelection.length === 0"
                  @click="handleBatchReview"
                  >批量审核</el-button
                >
                <el-button
                  size="small"
                  type="default"
                  @click="handleOneStamping"
                  :loading="oneStampingLoading"
                  >一键落章</el-button
                >
              </div>
              <div slot="waitForApprovalNum" slot-scope="{ row }">
                <span class="c_FF8D1A">{{ row.waitForApprovalNum }}</span>
              </div>
              <div slot="waitForSealNum" slot-scope="{ row }">
                <span class="c_FF8D1A">{{ row.waitForSealNum }}</span>
              </div>
              <div slot="action" slot-scope="{ row }">
                <el-button type="text" @click="handleReviewDetail(row)"
                  >明细</el-button
                >
              </div>
            </MPageLayout>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增/编辑用户弹框 -->
    <Modal
      :title="userModal.title"
      :type="userModal.type"
      size="600px"
      width="600px"
      :visible.sync="userModal.visible"
    >
      <employeeModalDialog
        :type="userModal.type"
        :visible.sync="userModal.visible"
        :data="userModal.data"
        :loading="userModal.loading"
        @close="closeUserModal()"
        @success="addUserSuccess"
      />
    </Modal>

    <!-- 新增/编辑部门弹框 -->
    <Modal
      :title="deptModal.title"
      :type="deptModal.type"
      size="800px"
      width="800px"
      :visible.sync="deptModal.visible"
    >
      <deptModalDialog
        :type="deptModal.type"
        :visible.sync="deptModal.visible"
        :data="deptModal.data"
        :loading="deptModal.loading"
        @close="closeDeptModal()"
        @success="addDeptSuccess"
      />
    </Modal>

    <!-- 导入员工弹框 -->
    <Modal
      :title="exportUserModal.title"
      :type="exportUserModal.type"
      size="600px"
      width="600px"
      :visible.sync="exportUserModal.visible"
    >
      <exportEmployee
        :type="exportUserModal.type"
        :visible.sync="exportUserModal.visible"
        @close="closeExportUserModal()"
      />
    </Modal>

    <!-- 重置密码弹框 -->
    <Modal
      :title="resetPwdModal.title"
      size="600px"
      width="600px"
      :visible.sync="resetPwdModal.visible"
    >
      <div style="padding: 20px">
        <div>
          账号
          <span style="font-weight: bold">{{ resetPwdModal.userName }}</span>
          密码被重置为:
        </div>
        <div
          v-loading="resetPwdModal.loading"
          style="font-size: 24px; font-weight: bold"
          class="m-t-20 m-b-20"
        >
          {{ resetPwdModal.value }}
        </div>
        <div v-if="!resetPwdModal.loading">
          <el-button
            v-clipboard:copy="resetPwdModal.value"
            v-clipboard:success="clipboardSuccess"
            type="primary"
            >复制密码并关闭</el-button
          >
        </div>
      </div>
    </Modal>

    <!-- 批量设置角色弹框 -->
    <setRoleModal ref="setRoleModal" @submitRoleSet="submitRoleSet" />
    <!-- 批量设置岗位 -->
    <batchAdjustPostDialog
      ref="batchAdjustPostRef"
      v-model="visiblePost"
      @close="visiblePost = false"
    />

    <leaveDialog
      :row="row"
      v-if="leaveDialogVisiable"
      :visible.sync="leaveDialogVisiable"
      @close="leaveDialogVisiable = false"
      @success="leaveDialogSuccess"
    >
    </leaveDialog>
    <regularDialog
      :row="row"
      v-if="regularDialogVisiable"
      :visible.sync="regularDialogVisiable"
      @close="regularDialogVisiable = false"
      @success="regularDialogSuccess"
    >
    </regularDialog>
    <transferDialog
      :row="row"
      v-if="transferDialogVisiable"
      :visible.sync="transferDialogVisiable"
      @close="transferDialogVisiable = false"
      @success="transferDialogSuccess"
    >
    </transferDialog>
    <batchReviewDialog
      v-if="batchReviewDialogVisable"
      :select-list="multipleSelection"
      :signFileList="signFileList"
      @search="getUserList()"
      @success="batchReviewDialogSuccess()"
      :visible.sync="batchReviewDialogVisable"
      @close="batchReviewDialogVisable = false"
    >
    </batchReviewDialog>
    <batchAddSignDialog
      :filterFileByInfoId="true"
      :select-list="multipleSelection"
      v-if="batchAddSignDialogVisable"
      :visible.sync="batchAddSignDialogVisable"
      @close="batchAddSignDialogVisable = false"
      @success="batchAddSignDialogSuccess"
    >
    </batchAddSignDialog>
    <oneStampingDialog
      :signFileList="signFileList"
      v-if="oneStampingDialogVisable"
      :visible.sync="oneStampingDialogVisable"
      @close="oneStampingDialogVisable = false"
      @success="oneStampingDialogSuccess"
    >
    </oneStampingDialog>
  </div>
</template>

<script>
import {
  deptTree,
  userPage,
  addUser,
  addDept,
  editUser,
  disable,
  delUser,
  delDept,
  editDept,
  getDeptList,
  getDeptDetail,
  resetPwd
} from '@/api/addressBookApi'
import { queryCompanyByDeptId } from '@/api/businessAdmin/talentFile'
import clipboard from '@/directive/clipboard/index.js'
import filterTop from './components/filterTop.vue'
import Modal from '@/components/Modal'
import employeeModalDialog from '@/components/Modal/user/employee.vue'
import deptModalDialog from '@/components/Modal/user/deptModal.vue'
import AppStatus from '@/components/AppStatus'
import exportEmployee from '@/components/Modal/user/exportEmployee.vue'
import setRoleModal from './components/setRoleModal.vue'
import { setDeptA, setRole } from '@/api/role'
import batchAdjustPostDialog from './components/batchAdjustPostDialog.vue'
import { hasValue } from '@/utils/index'
import {
  getColunmsAll,
  getColunmsProbation,
  getColunmsRegular,
  getColunmsQuit,
  getColunmsReview
} from './columns.js'
import leaveDialog from './components/leaveDialog'
import regularDialog from './components/regularDialog'
import transferDialog from './components/transferDialog'
import batchReviewDialog from './components/batchReviewDialog'
import batchAddSignDialog from './components/batchAddSignDialog'
import oneStampingDialog from './components/oneStampingDialog'
import {
  employeePageListAjax,
  signStatisticsPageListAjax,
  employeetTbDataStaticAjax
} from '../../../api/staff.js'
import { staffActiveNameType } from '../../options'

const defaultParentId = 100
export default {
  components: {
    filterTop,
    employeeModalDialog,
    Modal,
    AppStatus,
    deptModalDialog,
    exportEmployee,
    setRoleModal,
    batchAdjustPostDialog,
    leaveDialog,
    regularDialog,
    transferDialog,
    batchReviewDialog,
    batchAddSignDialog,
    oneStampingDialog
  },
  directives: {
    clipboard
  },
  data() {
    return {
      loading: false,
      deptList: [],
      width: 300, // 默认左边div的宽度
      lastClientX: 0, // 记录最后一次拖动的横向位置
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      activeName: 'all',
      totalCount: {
        all: '',
        probation: '',
        regular: '',
        quit: '',
        review: ''
      },
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'labelType',
        'status',
        'nickName',
        'roleVoList',
        'userId',
        'jobVoList',
        'userName',
        'employeeType'
      ],
      config: {
        tableData: [],
        tableColumns: getColunmsAll.call(this),
        tableProbationColumns: getColunmsProbation.call(this),
        tableRegularColumns: getColunmsRegular.call(this),
        tableQuitColumns: getColunmsQuit.call(this),
        tableReviewColumns: getColunmsReview.call(this),
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      search: {
        deptName: '',
        text: { label: 'name', value: '' },
        loading: false,
        deptType: 0,
        companyId: '',
        positionId: '',
        status: 0
      },
      deptId: '', // 当前选择的部门id
      userModal: {
        type: 1,
        visible: false,
        loading: false,
        data: {}
      },
      setRoleObj: {
        title: '批量设置角色',
        type: 1,
        visible: false
      },
      deptModal: {
        type: 1,
        visible: false,
        loading: false,
        data: {}
      },
      defaultExpandedKeys: [], // 默认展开的节点
      tableTreeRefreshTool: {},
      // 导入用户弹框
      exportUserModal: {
        title: '导入用户',
        tyoe: 1,
        visible: false,
        loading: false
      },
      searchType: 1,
      searchDeptData: [{}],
      // 重置密码弹框
      resetPwdModal: {
        visible: false,
        loading: false,
        value: '',
        userName: '',
        title: '重置密码'
      },
      permsList: this.$route.meta.permsList || [],
      visiblePost: false,
      curNode: undefined, // 当前树的node
      showTree: false,
      row: {}, //当前行
      leaveDialogVisiable: false, //离职
      regularDialogVisiable: false, //转正
      transferDialogVisiable: false, //调动
      batchReviewDialogVisable: false,
      batchAddSignDialogVisable: false,
      oneStampingDialogVisable: false,
      signFileList: [], //一键落章合同list
      oneStampingLoading: false
    }
  },
  watch: {
    // 'config.tableColumns': {
    //   handler(val) {
    //     const arr = val.filter(v => v.visible)
    //     if (arr.length === this.config.tableColumns.length) {
    //       this.allColumnsSelected = true
    //       this.allColumnsSelectedIndeterminate = false
    //     } else {
    //       this.allColumnsSelected = false
    //       this.allColumnsSelectedIndeterminate = true
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  mounted() {
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', res => {
    //   console.log(res)
    //   localStorage.setItem(
    //     'employee1_tableColumns',
    //     JSON.stringify(this.config.tableColumns)
    //   )
    // })
    this.setActiveTabFromQuery()
    const _this = this
    this.$nextTick(() => {
      const moveDom = document.getElementById('line') // 拖动元素
      moveDom.onmousedown = function (e) {
        _this.clientStartX = e.clientX
        document.onmousemove = function (e) {
          _this.moveHandle(e.clientX)
          return false
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          _this.lastClientX = 0 // 清零
        }
        return false
      }
    })
  },
  created() {
    // const tableColumns = localStorage.getItem('employee1_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
  },
  methods: {
    setActiveTabFromQuery() {
      const currentComponent = this.$route.query.currentComponent
      if (currentComponent) {
        this.activeName = currentComponent
        this.activeName === 'probation' &&
          this.$uweb?.setAction('Event_oa_probationEmployee_pages')
        this.activeName === 'regular' &&
          this.$uweb?.setAction('Event_oa_regularEmployee_pages')
        this.activeName === 'quit' &&
          this.$uweb?.setAction('Event_oa_quitEmployee_page')
        this.activeName === 'review' &&
          this.$uweb?.setAction('Event_oa_reviewEmployee_page')
      } else {
        this.$uweb?.setAction('Event_oa_allEmployee_pages')
        this.activeName = 'all'
      }
    },
    getDelTotal() {
      const Pro =
        this.activeName === 'review'
          ? signStatisticsPageListAjax
          : employeePageListAjax
      Pro({
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        type: this.search.time.label,
        startTime: this.search.time.value ? this.search.time.value[0] : '',
        endTime: this.search.time.value ? this.search.time.value[1] : '',
        deptId: this.deptId,
        deptType: this.search.deptType,
        [this.search.text.label]: this.search.text.value
      }).then(res => {
        this.secondTotal = res.data.total
      })
    },
    // 切换tab
    handleClick() {
      this.search = {
        deptName: '',
        text: { label: 'name', value: '' },
        loading: false,
        deptType: 0,
        companyId: '',
        positionId: '',
        status: 0
      }
      this.config.tableData = []
      this.config.pageSizes = [10, 20, 30, 40]
      this.config.pageSize = 10
      this.config.currentPage = 1
      this.config.total = 0
      this.handleClearSelection()
      this.getUserList()
    },
    // 跳转到岗位管理
    goPost() {
      this.$router.push({
        path: '/system/post'
      })
    },
    // 显示岗位弹窗
    showPost() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择员工')
      }
      this.visiblePost = true
    },
    // 表头操作
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'employee1_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'employee1_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置表头按钮
    clear() {
      const tableColumns = [
        {
          label: '序号',
          prop: 'index',
          type: 'text',
          width: '50'
        },
        {
          prop: 'userId',
          label: '员工id',
          type: 'slot',
          visible: true,
          width: '250'
        },
        {
          prop: 'nickName',
          label: '员工姓名',
          type: 'text',
          visible: true,
          width: '160'
        },
        // { prop: 'userName', label: '英文名称', type: 'slot', width: '160', visible: true },
        {
          prop: 'roleVoList',
          label: '角色',
          type: 'slot',
          visible: true,
          width: '120'
        },
        {
          prop: 'status',
          label: '状态',
          type: 'slot',
          visible: true,
          width: '120'
        },
        {
          prop: 'phoneNumber',
          label: '手机号码',
          type: 'text',
          visible: true,
          width: '250'
        },
        {
          prop: 'deptName',
          label: '部门',
          type: 'text',
          visible: true,
          width: '250'
        },
        {
          prop: 'createTime',
          label: '创建日期',
          type: 'text',
          visible: true,
          width: '180'
        },
        {
          prop: 'updateTime',
          label: '更新日期',
          type: 'text',
          visible: true,
          width: '180'
        },
        {
          prop: 'action',
          label: '操作',
          type: 'slot',
          visible: true,
          width: '200px',
          fixed: 'right',
          disable: true
        }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem(
        'employee1_tableColumns',
        JSON.stringify(tableColumns)
      )
    },
    submitRoleSet(data) {
      const userIds = []
      this.multipleSelection.some(item => {
        userIds.push(item.userId)
      })
      const params = {
        userIds: userIds,
        roleIds: data.roleIds
      }
      setRole(params).then(res => {
        if (res.code === 1) {
          this.$message.success('批量设置角色成功！')
          this.getUserList()
          this.$refs.setRoleModal.setRoleModalFlag = false
        }
      })
    },
    changeDeptName() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择员工')
      }
      const checkDept = []
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkDept,
        checkUserIds: [],
        success: res => {
          console.log(res)
          const userIds = []
          this.multipleSelection.some(item => {
            userIds.push(item.userId)
          })
          const params = {
            userIds: userIds,
            deptId: res.dept[0].deptId
          }
          setDeptA(params).then(res => {
            if (res.code === 1) {
              this.$message.success('批量调整部门成功！')
              this.getUserList()
            }
          })
        }
      })
    },
    setRole() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择员工')
      }
      this.$refs.setRoleModal.show()
    },
    searchFn() {
      console.log('点击搜索')
      this.searchType = 2
      this.loading = true
      const params = {
        deptName: this.search.deptName
      }
      getDeptList(params)
        .then(res => {
          this.searchDeptData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchUserFn(res) {
      this.search = res
      this.config.currentPage = 1
      this.search.deptType = this.search.deptTypeF ? 1 : 0
      delete this.search.deptTypeF
      this.handleClearSelection()
      this.getUserList()
    },
    searchBack() {
      this.search.deptName = ''
      this.searchDeptData = []
      this.searchType = 1
    },
    loadNode(node, resolve) {
      this.loading = true
      console.log(node, 'node')
      // console.log(node)
      if (node.level === 0) {
        const params = {
          parentId: 0
        }
        deptTree(params)
          .then(res => {
            this.loading = false
            resolve(res.data)
            this.curNode = node
            if (res.data.length > 0) {
              this.deptId = res.data[0].id
              this.$refs.tree && this.$refs.tree.setCurrentKey(res.data[0].id)
              this.defaultExpandedKeys = [res.data[0].id]
              this.getUserList()
              // this.getDelTotal()
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        // 在之前声明的全局变量中，增加一个key为 本条数据的id，id可替换为你数据中的任意唯一值
        this.tableTreeRefreshTool[node.data.id] = {}
        // 重要！保存resolve方法，以便后续使用
        this.tableTreeRefreshTool[node.data.id].resolve = resolve
        // 记录展开次数
        this.tableTreeRefreshTool[node.data.id].expandCount = 0
        const params = {
          parentId: node.data.id
        }
        deptTree(params)
          .then(res => {
            // this.deptList = res
            this.loading = false
            resolve(res.data)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    moveHandle(nowClient) {
      if (this.lastClientX === 0) {
        // 第一次拖动 记录起始位置
        this.lastClientX = nowClient
      } else {
        // 计算拖动的距离 赋值给左边div
        this.width += nowClient - this.lastClientX
        // 记录最后一个的拖动位置
        this.lastClientX = nowClient
      }
    },
    setLeftStyle: function () {
      const wid = this.width + 'px'
      return `width:${wid};`
    },
    setRightStyle: function () {
      const wid = this.width + 7 + 'px'
      // 右边div的宽度 等于 100% - （右边div + line的宽度）
      return `width: calc(100% - ${wid});`
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getUserList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取用户列表
    getUserList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        pageType: staffActiveNameType.get(this.activeName),
        departmentId: this.deptId,
        entryTimeStart: this.search.entryTimeStart,
        entryTimeEnd: this.search.entryTimeEnd,
        departureTimeEnd: this.search.departureTimeEnd,
        departureTimeStart: this.search.departureTimeStart,
        regularTimeStart: this.search.regularTimeStart,
        regularTimeEnd: this.search.regularTimeEnd,
        expectedRegularDateStart: this.search.expectedRegularDateStart,
        expectedRegularDateEnd: this.search.expectedRegularDateEnd,
        positionId: this.search.positionId,
        companyId: this.search.companyId,
        entryDateOrderBy: this.search.entryDateOrderBy,
        departureOrderBy: this.search.departureOrderBy,
        regularOrderBy: this.search.regularOrderBy,
        status: this.search.status,
        [this.search.text.label]: this.search.text.value
      }
      this.search.loading = true
      const Pro =
        this.activeName === 'review'
          ? signStatisticsPageListAjax
          : employeePageListAjax
      Pro(params)
        .then(res => {
          res.data.items?.forEach((v, index) => {
            v.index =
              (this.config.currentPage - 1) * this.config.pageSize + index + 1
          })
          this.config.tableData = res.data?.items || []
          this.config.total = res.data.total
          this.search.loading = false
          this.loading = false
          this.$nextTick(() => {
            this.$refs[`MPageLayout${this.activeName}`] &&
              this.$refs[`MPageLayout${this.activeName}`].doLayout()
          })
        })
        .catch(() => {
          this.search.loading = false
          this.loading = false
        })
      this.getEmployeetTbDataStatic()
    },
    //清空选中状态
    handleClearSelection() {
      this.$nextTick(() => {
        this.$refs[`MPageLayout${this.activeName}`] &&
          this.$refs[`MPageLayout${this.activeName}`].clearSelection()
      })
    },
    // 打开新增用户弹框
    async openUserModal() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'employeeManagement'
      )
      if (!res) {
        this.userModal = {
          title: '新增',
          type: 1,
          visible: true,
          loading: false,
          data: {
            nickName: '',
            password: '',
            phoneNumber: '',
            roleIds: [],
            userName: '',
            customerFlag: 2,
            deptName: '',
            deptId: '',
            status: 0,
            thirdAccounts: []
          }
        }
      }
    },
    // 打开修改用户弹框
    openEditUserModal(row) {
      const roleIds = []
      const jobIds = []
      row.roleVoList.map(v => {
        roleIds.push(v.roleId)
      })
      row.jobVoList.map(v => {
        jobIds.push(v.jobId)
      })

      const thirdAccounts = []
      if (row.erpId) {
        thirdAccounts.push({ type: 1, erpCode: row.erpId })
      }
      if (row.bizWechatName) {
        thirdAccounts.push({
          type: 2,
          wechatPhone: row.phoneNumber,
          weChat: {
            bizWechatAvatar: row.bizWechatAvatar || '',
            bizWechatName: row.bizWechatName || '',
            bizWechatAlias: row.bizWechatAlias || '',
            bizWechatId: row.bizWechatId || ''
          }
        })
      }
      this.userModal = {
        title: '修改',
        type: 3,
        visible: true,
        loading: false,
        data: {
          ...row,
          thirdAccounts,
          roleIds,
          jobIds
        }
      }
    },
    // 关闭新增用户弹框
    closeUserModal() {
      this.userModal.visible = false
    },
    addUserSuccess(data) {
      // console.log(data, 'data')
      this.loading = true
      this.closeUserModal()
      if (data.userId) {
        const params = {
          customerFlag: data.customerFlag,
          deptId: data.deptId,
          roleIds: data.roleIds,
          status: data.status,
          userId: data.userId,
          userName: data.userName,
          nickName: data.nickName,
          employeeType: data.employeeType,
          erpCode: data.erpCode,
          wechatPhone: data.wechatPhone,
          bizWechatId: data.bizWechatId,
          jobIds: data.jobIds,
          email: data.email
        }
        editUser(params)
          .then(res => {
            this.getUserList()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        addUser(data)
          .then(res => {
            console.log(res)
            this.getUserList()
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 树节点点击
    nodeClick(data, node) {
      this.deptId = node.data.id
      this.config.currentPage = 1
      this.handleClearSelection()
      this.getUserList()
      // this.getDelTotal()
    },
    // 搜索的树节点点击
    searchDeptClick(row) {
      this.deptId = row.deptId
      this.handleClearSelection()
      this.getUserList()
    },
    // 点击打开新增部门弹框
    async openDeptModal() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'departmentManagement'
      )
      if (!res) {
        this.deptModal = {
          title: '新增',
          type: 1,
          visible: true,
          loading: false,
          data: {
            deptName: '', //
            parentName: '',
            parentId: '' // 父部门id
          }
        }
      }
    },
    // 点击打开编辑部门弹框
    async openEditDeptModal(row) {
      const params = {
        deptId: row.data.id
      }

      const res = await queryCompanyByDeptId(params)

      this.deptModal = {
        title: '编辑部门',
        type: 3,
        visible: true,
        loading: false,
        data: {
          deptName: row.data.label, //
          deptId: row.data.id,
          leaderName: row.data?.leaderName,
          leaderId: row.data?.leaderId,
          deptType: row.data?.deptType,
          parentName: row.parent.data ? row.parent.data.label : '',
          parentId: row.parent.data ? row.parent.data.id : '', // 父部门id
          entryCompanyId: row.data?.entryCompanyId,
          companyId: res.data.companyId ? res.data.companyId + '' : '',
          companyName: res.data.companyName ? res.data.companyName + '' : '',
          sysDeptLeaderReqList: res.data?.sysDeptLeaderReqList
        }
      }
    },
    // 点击删除部门
    delDept(node, data) {
      this.$delModal({
        tips: `确定删除这个部门吗？`,
        success: () => {
          this.loading = true
          delDept(node.data.id)
            .then(res => {
              this.$refs.tree.remove(node.data.id)
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击删除部门(搜索条件下)
    delSearchDept(row) {
      this.$delModal({
        tips: `确定删除这个部门吗？`,
        success: () => {
          this.loading = true
          delDept(row.deptId)
            .then(res => {
              this.searchFn()
              this.$notify.success({ title: '提示', message: '操作成功' })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 关闭新增部门弹框
    closeDeptModal() {
      this.deptModal.visible = false
    },
    // 新增部门
    addDeptSuccess(data) {
      this.loading = true
      if (this.deptModal.type !== 1) {
        // 编辑
        const obj = {
          deptId: data.deptId,
          deptName: data.deptName,
          parentId: data.parentId,
          leaderId: data?.leaderId,
          companyId: data?.companyId,
          sysDeptLeaderReqList: data?.sysDeptLeaderReqList
        }
        editDept(obj)
          .then(res => {
            this.closeDeptModal()
            if (!hasValue(data.parentId)) {
              // 没有父id可能是最外层部门
              deptTree({ parentId: 0 }).then(res => {
                if (res.code === 1 && this.curNode?.childNodes?.length) {
                  this.curNode.childNodes.forEach(item => {
                    const itemFromArray = res.data.find(
                      obj => obj.id === item.data?.id
                    )
                    if (itemFromArray) {
                      Object.assign(item.data, itemFromArray)
                    }
                  })
                  // this.curNode.childNodes[0].data = res.data[0]
                }
              })
            }
            const curr = this.tableTreeRefreshTool[defaultParentId]
            if (curr) {
              const params = {
                parentId: defaultParentId
              }
              deptTree(params)
                .then(res => {
                  this.loading = false
                  curr.resolve(res.data)
                  // this.showTree = false
                  // this.$nextTick(() => {
                  //   this.showTree = true
                  // })
                })
                .catch(() => {
                  this.loading = false
                })
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        addDept(data)
          .then(res => {
            console.log(res)
            this.closeDeptModal()
            const curr = this.tableTreeRefreshTool[defaultParentId]
            if (curr) {
              const params = {
                parentId: defaultParentId
              }
              deptTree(params)
                .then(res => {
                  this.loading = false
                  curr.resolve(res.data)
                })
                .catch(() => {
                  this.loading = false
                })
            } else {
              this.loading = false
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 编辑部门(搜索条件下)
    async openSearchEditDeptModal(row) {
      console.log(row)
      if (row.parentId) {
        try {
          const res = await getDeptDetail(row.parentId)

          this.deptModal = {
            title: '修改',
            type: 3,
            visible: true,
            loading: false,
            data: {
              deptName: row.deptName, //
              deptId: row.deptId,
              parentName: res.data.deptName,
              parentId: row.parentId, // 父部门id
              companyId: row.companyId
            }
          }
        } catch (err) {
          console.log(err)
        }
      } else {
        this.deptModal = {
          title: '修改',
          type: 3,
          visible: true,
          loading: false,
          data: {
            deptName: row.deptName, //
            deptId: row.deptId,
            parentName: row.parentName,
            parentId: row.parentId // 父部门id
          }
        }
      }
    },
    // 展开刷新
    expandChange(row, expanded) {
      // 获取到之前保存的全局变量
      const curr = this.tableTreeRefreshTool[row.id]
      // // 展开次数 +1
      // api请求
      const params = {
        parentId: row.id
      }
      deptTree(params).then(res => {
        curr.resolve(res.data)
      })
    },
    // 启用
    enableUsers(status) {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择员工')
      }
      this.$delModal({
        tips: `确定${status === 0 ? '启用' : '禁用'}这${
          this.multipleSelection.length
        }个员工吗？`,
        success: () => {
          const userIds = []
          this.multipleSelection.map(v => {
            userIds.push(v.userId)
          })
          this.loading = true
          const data = {
            status,
            userIds
          }
          disable(data)
            .then(res => {
              this.getUserList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
      // const userIds = []
      // this.multipleSelection.map(v => {
      //   userIds.push(v.userId)
      // })
      // this.loading = true
      // const data = {
      //   status,
      //   userIds: []
      // }
      // disable(data).then(res => {
      //   this.getUserList()
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    //单个启用
    singleEnableUsers(row) {
      const { status, userId } = row
      this.$delModal({
        tips: `确定${status === 0 ? '禁用' : '启用'}这个员工吗？`,
        success: () => {
          const userIds = []
          userIds.push(userId)
          const curStatus = status === 0 ? 1 : 0
          this.loading = true
          const data = {
            status: curStatus,
            userIds
          }
          disable(data)
            .then(res => {
              this.getUserList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 删除
    delUsers() {
      if (this.multipleSelection.length === 0) {
        return this.$message.warning('请先选择员工')
      }
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}个员工吗？`,
        success: () => {
          const userIds = []
          this.multipleSelection.map(v => {
            userIds.push(v.userId)
          })
          this.loading = true
          const data = {
            userIds
          }
          delUser(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getUserList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 打开导入用户弹框
    openExportUserModal() {
      this.exportUserModal.visible = true
    },
    // 关闭导入用户弹框
    closeExportUserModal() {
      this.exportUserModal.visible = false
    },
    // 点击重置密码
    resetPwd(row) {
      this.$delModal({
        tips: `确定重置这个账号的密码吗？`,
        success: () => {
          this.resetPwdModal = {
            visible: true,
            loading: true,
            value: '',
            userName: '',
            title: '重置密码'
          }
          const params = {
            userId: row.userId
          }
          resetPwd(params)
            .then(res => {
              this.resetPwdModal.value = res.data
              this.resetPwdModal.loading = false
              this.resetPwdModal.userName = row.userName
            })
            .catch(() => {
              this.resetPwdModal.loading = false
            })
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
      this.resetPwdModal.visible = false
    },
    //离职
    handleLeave(row) {
      this.row = { ...row }
      this.leaveDialogVisiable = true
    },
    leaveDialogSuccess(row) {
      this.activeName === 'probation' &&
        this.$uweb?.setAction('Event_oa_probationEmployee_quit')
      this.activeName === 'regular' &&
        this.$uweb?.setAction('Event_oa_regularEmployee_quit')
      this.activeName === 'all' &&
        this.$uweb?.setAction('Event_oa_allEmployee_quit')
      this.leaveDialogVisiable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //转正
    handleRegular(row) {
      this.row = { ...row }
      this.regularDialogVisiable = true
    },
    //转正成功
    regularDialogSuccess() {
      this.activeName === 'probation' &&
        this.$uweb?.setAction('Event_oa_probationEmployee_regular')
      this.activeName === 'all' &&
        this.$uweb?.setAction('Event_oa_allEmployee_regular')
      this.regularDialogVisiable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //调动
    handleTransfer(row) {
      this.row = { ...row }
      this.transferDialogVisiable = true
    },
    //调动成功
    transferDialogSuccess() {
      this.activeName === 'regular' &&
        this.$uweb?.setAction('Event_oa_regularEmployee_transfer')
      this.activeName === 'probation' &&
        this.$uweb?.setAction('Event_oa_probationEmployee_transfer')
      this.activeName === 'all' &&
        this.$uweb?.setAction('Event_oa_allEmployee_transfer')
      this.transferDialogVisiable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //查看详情
    toDetail(row) {
      this.$router.push({
        path: '/businessAdmin/talentFile/detail',
        query: {
          personnelInfoId: row.personnelBaseInfoId,
          candidateId: row.personnelBaseInfoId,
          currentComponent: this.activeName,
          leftTitle: '员工管理',
          currentBackUrl: '/oaManagement/staffManagement/home'
        }
      })
    },
    //跳转明细
    handleReviewDetail(row) {
      this.$router.push({
        path: '/oaManagement/staffManagement/reviewDetail',
        query: {
          personnelBaseInfoId: row.personnelBaseInfoId,
          name: row.name
        }
      })
    },
    //批量审核
    handleBatchReview() {
      const personnelBaseInfoIds = this.multipleSelection.map(
        item => item.personnelBaseInfoId
      )
      const params = {
        reviewStatus: 0,
        employeeSignStatus: 1,
        personnelBaseInfoIds
      }
      this.$store
        .dispatch('oaManage/contractfollowConditionList', params)
        .then(res => {
          if (res?.length === 0) {
            this.$message.error('存在待签署或无待审核文件，无法批量审核')
            return
          }
          this.signFileList = res
          this.batchReviewDialogVisable = true
        })
    },
    //批量添加签署
    handleBatchAddSign() {
      this.batchAddSignDialogVisable = true
    },
    //批量签署成功
    batchAddSignDialogSuccess() {
      this.activeName === 'probation' &&
        this.$uweb?.setAction('Event_oa_probationEmployee_addSign')
      this.activeName === 'regular' &&
        this.$uweb?.setAction('Event_oa_regularEmployee_addSign')
      this.activeName === 'all' &&
        this.$uweb?.setAction('Event_oa_allEmployee_addSign')
      this.batchAddSignDialogVisable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //批量审核成功
    batchReviewDialogSuccess() {
      this.$uweb?.setAction('Event_oa_reviewEmployee_batchReview')
      this.batchReviewDialogVisable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //一键落章
    handleOneStamping() {
      const params = {
        reviewStatus: 1,
        employeeSignStatus: 1,
        sealStatus: 1
      }
      this.oneStampingLoading = true
      this.$store
        .dispatch('oaManage/contractfollowConditionList', params)
        .then(res => {
          if (res?.length === 0) {
            this.$message.error('存在待审核或无待落章文件，无法一键落章')
            return
          }
          this.signFileList = res
          this.oneStampingDialogVisable = true
        })
        .finally(() => {
          this.oneStampingLoading = false
        })
    },
    //一建落章成功
    oneStampingDialogSuccess() {
      this.$uweb?.setAction('Event_oa_reviewEmployee_oneStamping')
      this.oneStampingDialogVisable = false
      this.handleClearSelection()
      this.getUserList()
    },
    //tab页员工数
    getEmployeetTbDataStatic() {
      employeetTbDataStaticAjax().then(res => {
        if (res.code === 1) {
          this.totalCount = {
            all: res.data.allEmpCount,
            regular: res.data.formalEmpCount,
            quit: res.data.leaveEmpCount,
            probation: res.data.probationPeriodEmpCount,
            review: res.data.signAuditCount
          }
        }
      })
    },
    //排序
    sortChange({ prop, order }) {
      this.search.entryDateOrderBy = ''
      this.search.regularOrderBy = ''
      this.search.departureOrderBy = ''
      const configMap = {
        entryDate: {
          ascending: 1,
          descending: 2,
          default: 1
        },
        regularTime: {
          ascending: 1,
          descending: 2,
          default: 1
        },
        departureDate: {
          ascending: 1,
          descending: 2,
          default: 1
        }
      }
      if (prop === 'entryDate') {
        this.search.entryDateOrderBy = configMap[prop][order]
      } else if (prop === 'regularTime') {
        this.search.regularOrderBy = configMap[prop][order]
      } else if (prop === 'departureDate') {
        this.search.departureOrderBy = configMap[prop][order]
      }
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.more-icon {
  // 旋转90度
  transform: rotate(90deg);
}

.page_warp {
  height: 100%;
  // background: #fff;
  display: flex;
  min-width: 1280px;
  .custom-tree-container {
    width: 300px;
    height: 100%;
    background: #fff;
    .block {
      display: flex;
      flex-direction: column;
      height: 100%;
      .search {
        padding: 10px;
        //height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .search-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .label {
            font-weight: 700;
          }
        }

        .search-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;

          span {
            margin-right: 10px;
          }
        }
      }
      .tree {
        padding: 10px 0;
        flex: 1;
        overflow: auto;
        // overflow-x: hidden;
        width: 100%;
        height: calc(100% - 50px);
        &::-webkit-scrollbar-track-piece {
          background: #d3dce6;
        }

        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 20px;
        }

        .addressBooksBox {
          width: 100%;
          padding: 10px 10px;
          display: flex;
          align-items: center;
          .checkBox {
            margin-right: 10px;
            width: 16px;
            height: 16px;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
          }
          .checkBoxRadio {
            margin-right: 10px;
            width: 16px;
            height: 16px;
            border: 1px solid #dcdfe6;
            border-radius: 50%;
          }
          .checkName {
            flex: 1;
            width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .next {
            border-left: 1px solid #dcdfe6;
            padding-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .page_warp_right {
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    .page_wrap_right_table {
      height: calc(100% - 100px);
      flex: 1 0 0;
      overflow: hidden;
    }
    .page_wrap_right_table2 {
      height: calc(100% - 50px);
      flex: 1 0 0;
      overflow: hidden;
    }
  }

  .searchDept {
    .searchDept {
      height: 40px;
      box-sizing: border-box;
      width: 100%;
      padding: 10px 10px;
      display: flex;
      align-items: center;
      color: #606266;
      cursor: pointer;
      &:hover {
        background: #f5f7fa;
      }
      .checkName {
        flex: 1;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .next {
        border-left: 1px solid #dcdfe6;
        padding-left: 10px;
        cursor: pointer;
      }
    }
    .active {
      background: #cee2ff !important;
    }
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
::v-deep {
  .el-tree-node__content {
    padding: 20px 10px;
  }
  .el-tree-node.is-current {
    > .el-tree-node__content {
      background-color: #cee2ff !important;
    }
  }
}

.view {
  height: 100%;
  float: left;
  overflow: auto;
}
.line {
  float: left;
  width: 7px;
  // height: 100%;
  // background: #CEDEF5;
  border-radius: 5px;
  cursor: e-resize;
}
.red-cls {
  color: #f53f3f;
}
.footer-slot {
  width: 550px;
}
.c_FF8D1A {
  color: #ff8d1a;
}
.addBtn {
  border-color: #0c6fff;
  color: #0c6fff;
}
::v-deep .el-button.is-disabled,
.el-button.is-disabled:hover,
.el-button.is-disabled:focus {
  color: #c0c4cc;
  border-color: #e6ebf5;
}
</style>
