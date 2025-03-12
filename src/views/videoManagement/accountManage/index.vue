<template>
  <div class="page_wrap1">
    <div class="search">
      <el-form
        :inline="true"
        :model="accountForm"
        class="form-container"
        size="small"
      >
        <el-form-item label="部门">
          <el-cascader
            v-model="accountForm.deptArray"
            :options="deptTreeArray"
            :props="{ checkStrictly: true }"
            clearable
            @change="visibleChangeD($event)"
            @visible-change="visibleChangeD($event)"
          />
        </el-form-item>
        <el-form-item label="运营者">
          <el-select
            v-model="accountForm.operatorId"
            filterable
            placeholder="请选择"
            clearable
            @change="getListForSearch"
          >
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span
                v-if="item.status === 1"
                style="float: right; color: #f53f3f; font-size: 13px"
              >已离职</span></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP">
          <el-select
            v-model="accountForm.teacherId"
            clearable
            filterable
            remote
            :remote-method="tearchFilter"
            placeholder="请选择IP"
            @blur="()=>tearchFilter('')"
            @change="handleChangeTeacher"
          >
            <el-option-group
              v-for="group in filteredGroups(tearchArray)"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-select
            v-model="accountForm.loginStatus"
            filterable
            placeholder="请选择"
            clearable
            @change="getListForSearch"
          >
            <el-option
              v-for="item in loginArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select
            v-model="accountForm.accountType"
            filterable
            placeholder="请选择"
            clearable
            @change="getListForSearch"
          >
            <el-option
              v-for="item in accountStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-select
            v-model="accountForm.platformId"
            filterable
            placeholder="请选择"
            clearable
            @change="changePlatform"
          >
            <el-option
              v-for="item in platformArray"
              :key="item.platformId"
              :label="item.platformName"
              :value="item.platformId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isShowDyId" label="抖音号">
          <el-input
            v-model="accountForm.uniqueId"
            placeholder="请输入账号名称"
            clearable
            @change="getListForSearch"
          />
        </el-form-item>
        <el-form-item label="账号名称">
          <el-input
            v-model="accountForm.accountName"
            placeholder="请输入账号名称"
            clearable
            @change="getListForSearch"
          />
        </el-form-item>
        <el-form-item label="账号UID">
          <el-input
            v-model="accountForm.accountId"
            placeholder="请输入UID"
            clearable
            @change="getListForSearch"
          />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input
            v-model="accountForm.phone"
            placeholder="请输入电话号码"
            clearable
            @change="getListForSearch"
          />
        </el-form-item>
        <div class="opt_list">
          <el-form-item>
            <div>
              <el-button
                type="primary"
                @click="getListForSearch"
              >查询</el-button>
              <el-button @click="clear">重置</el-button>
              <el-button
                type="primary"
                @click="toAddAccount"
              ><i class="el-icon-plus add_account" />添加账号</el-button>
              <el-button
                type="primary"
                plain
                @click="toAccountGroup"
              >分组管理</el-button>
              <span
                class="m-l-8"
                style="display: inline-block"
                @click="handleClickSyncData"
              >
                <el-button
                  type="primary"
                  plain
                  :loading="visibleDialogDataSync"
                >{{ visibleDialogDataSync ? '数据同步中' : '数据一键同步' }}
                  <el-tooltip
                    class="item-tips"
                    effect="dark"
                    placement="bottom"
                  >
                    <div slot="content" class="content-cls">
                      <p>仅同步自己的账号数据</p>
                    </div>
                    <img
                      :src="wenhaoImg"
                      style="
                        float: right;
                        margin-left: 5px;
                        cursor: pointer;
                        width: 12px;
                        height: 12px;
                      "
                    /> </el-tooltip></el-button>
              </span>
              <el-button
                v-permission="['web:accountMange:abnormalAccount', permsList]"
                class="m-l-8"
                type="danger"
                plain
                @click="toAbnormal"
              >异常账号管理</el-button>
              <el-button
                v-permission="['web:accountMange:syncDataSetting', permsList]"
                type="primary"
                style="margin-right: 12px"
                plain
                @click="syncDataSetting"
              >数据同步检测设置</el-button>
            </div>
            <div class="exportData">
              <el-button
                v-permission="['web:accountMange:exportData', permsList]"
                type="primary"
                style="margin-right: 12px"
                plain
                @click="exportData"
              >导出数据</el-button>
              <el-popover placement="bottom-end" width="150" trigger="click">
                <p
                  slot="reference"
                  style="
                    color: #0c6fff;
                    font-size: 14px;
                    width: 93px;
                    text-align: right;
                    cursor: pointer;
                  "
                  type="text"
                  size="small"
                >
                  自定义表头
                  <img
                    :src="iconShezhi"
                    class="mr-1"
                    style="margin-top: 7px; float: left"
                  />
                </p>

                <el-checkbox
                  v-model="allColumnsSelected"
                  :disabled="allColumnsSelected"
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
                  :disabled="item.disable"
                  @change="handleCheckedTableColumnsChange(item)"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-popover>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 账号管理 -->
    <MPageLayout
      ref="MPageLayout"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :row-class-name="tableRowClassName"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @sort-change="sortChange"
    >
      <div slot="name" slot-scope="{ row }" class="plat-form-line">
        <img :src="row.avatar" />
        <span>{{ row.name }}</span>
      </div>
      <div slot="todayIsSync" slot-scope="{ row }">
        <div v-if="row.todayIsSync === 1" class="asyncStatus">
          <span class="tips tips1" />
          <span class="tipsFont tipsFont1">已同步</span>
        </div>
        <div v-else class="asyncStatus">
          <span class="tips tips2" />
          <span class="tipsFont tipsFont2">未同步</span>
        </div>
      </div>
      <div slot="loginStatus" slot-scope="{ row }">
        <p v-if="row.loginStatus === 2" class="login-success">授权成功</p>
        <span v-else-if="row.loginStatus === 1" class="login-error">
          <span class="unLogin">未授权</span>
          <el-button
            v-if="row.operatorId === userInfo.userId"
            :loading="row.isLoginLoading"
            size="mini"
            @click="toLgoinNow(row)"
          >立即授权</el-button>
        </span>
      </div>
      <div slot="platformId" slot-scope="{ row }" class="plat-form-line">
        <img :src="row.platformImg" />
        <span>{{ row.platformName }}</span>
      </div>
      <div
        slot="authorId"
        slot-scope="{ row }"
        class="plat-table-author text_hidden"
      >
        <AppIconClipboard :src="row.authorId">
          <span class="authorShow">{{ row.authorId }}</span>
        </AppIconClipboard>
      </div>
      <div slot="accountStatus" slot-scope="{ row }" class="accountStatus">
        <span
          class="accountStatus1"
          :style="{
            color: statusObj[row.accountStatus].color,
            background: statusObj[row.accountStatus].bgColor
          }"
        >
          <span>{{ statusObj[row.accountStatus].name }}</span>
        </span>
      </div>
      <div slot="action" slot-scope="{ row }" class="flex">
        <div style="min-height: 36px" />
        <!-- v-permission="['web:teachFileList:detail', permsList]" -->
        <el-button
          v-permission="['web:accountMange:accountDetails', permsList]"
          type="text"
          @click="gotoAccountDataDetail(row)"
        >详情</el-button>
        <!-- <el-button
          type="text"
          @click="gotoEditAccount(row)"
        >编辑</el-button> -->
        <el-button
          v-if="row.operatorId === userInfo.userId"
          type="text"
          @click="gotoZhuye(row)"
        >账号主页</el-button>
        <!-- !isAbnormalAccountEmpty 有按钮权限 && 有停更按钮权限账号状态不是停更  && 有恢复更新按钮权限且账号状态不是1 -->
        <el-dropdown v-if="!isAbnormalAccountEmpty">
          <el-button type="text" class="el-dropdown-link m-l-12">
            更多<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu
            v-if="row.operatorId !== userInfo.userId"
            slot="dropdown"
          >
            <el-dropdown-item
              v-permission="['web:accountMange:accountEdit', permsList]"
              type="text"
              @click.native="gotoEditAccount(row)"
            >编辑</el-dropdown-item>
            <el-dropdown-item
              v-if="row.accountStatus !== 2 && row.accountStatus <= 2"
              v-permission="['web:accountMange:accountStop', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="stopOrResume(row, 1)"
            >停更</el-dropdown-item>
            <el-dropdown-item
              v-if="row.accountStatus !== 1 && row.accountStatus <= 2"
              v-permission="['web:accountMange:accountRestore', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="stopOrResume(row, 2)"
            >恢复更新</el-dropdown-item>
            <el-dropdown-item
              v-if="
                row.accountStatus > 2 &&
                  permsList.includes(nameObj[row.accountStatus].auth)
              "
              type="text"
              @click.native="
                revokeAccount(row, nameObj[row.accountStatus].status)
              "
            >{{ nameObj[row.accountStatus].name }}</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:accountMange:accountTransfer', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 3)"
            >转号</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:accountMange:changeOperations', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 4)"
            >变更运营</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:accountMange:transferTeacher', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 5)"
            >移交IP</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:accountMange:logOff', permsList]"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="logOff(row, 7)"
            >注销</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:accountMange:logging', permsList]"
              type="text"
              @click.native="showLogging(row)"
            >日志记录</el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else slot="dropdown">
            <el-dropdown-item
              type="text"
              @click.native="gotoEditAccount(row)"
            >编辑</el-dropdown-item>
            <el-dropdown-item
              v-if="row.accountStatus !== 2 && row.accountStatus <= 2"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="stopOrResume(row, 1)"
            >停更</el-dropdown-item>
            <el-dropdown-item
              v-if="row.accountStatus !== 1 && row.accountStatus <= 2"
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="stopOrResume(row, 2)"
            >恢复更新</el-dropdown-item>
            <el-dropdown-item
              v-if="row.accountStatus > 2"
              type="text"
              @click.native="
                revokeAccount(row, nameObj[row.accountStatus].status)
              "
            >{{ nameObj[row.accountStatus].name }}</el-dropdown-item>
            <el-dropdown-item
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 3)"
            >转号</el-dropdown-item>
            <el-dropdown-item
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 4)"
            >变更运营</el-dropdown-item>
            <el-dropdown-item
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="transferAccount(row, 5)"
            >移交IP</el-dropdown-item>
            <el-dropdown-item
              :disabled="row.accountStatus > 2"
              type="text"
              @click.native="logOff(row, 7)"
            >注销</el-dropdown-item>
            <el-dropdown-item
              type="text"
              @click.native="showLogging(row)"
            >日志记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button
          v-if="row.operatorId === userInfo.userId"
          v-permission="['web:accountManage:remove', permsList]"
          class="del-cls"
          type="text"
          @click="deleteAccount(row)"
        >移除</el-button> -->
      </div>
      <div slot="footer" class="fans-item">
        粉丝数合计：{{ formatterForW(fansNum) }}
      </div>
    </MPageLayout>
    <stop-or-resume
      ref="stopOrResume"
      :type="optType"
      :account-info="accountInfo"
      @refresh="getListForSearch"
    />
    <transferAccount
      ref="transferAccount"
      :type="optType"
      :account-info="accountInfo"
      @refresh="getListForSearch"
    />
    <log-off
      ref="logOff"
      :type="optType"
      :account-info="accountInfo"
      @refresh="getListForSearch"
    />
    <logging ref="logging" :account-info="accountInfo" />
    <addAccount
      ref="addAccountRef"
      :plat-array="platformArray"
      @loginSuccess="loginSuccess"
      @addSuccessAccount="addSuccessAccount"
    />
    <AccountConfiguration
      ref="accountConfiguration"
      :user-info="userInfo"
      :visible="showAccount"
      @closeAccountConfig="closeAccountConfig"
      @successForAccount="successForAccount"
    />
    <dialog-data-sync
      :is-full="isFull"
      :visible.sync="visibleDialogDataSync"
      @getList="getList"
      @addGround="addGround"
      @syncOver="syncOver"
      @handleMinimize="handleMinimize"
      @closeSync="closeSync"
    />
    <syncDataSetting ref="syncDataSetting" @success="syncDataSuccess" />
    <DownloadModal ref="DownloadModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppIconClipboard from '@/components/AppIconClipboard'
import wenhaoImg from '@/assets/image/account/icn_wenhao.svg'
import stopChange_icon from '@/assets/svg/videoManga/stopChange_icon.svg'
import updating_icon from '@/assets/svg/videoManga/updating_icon.svg'
import { deptTree, userNoPage } from '@/api/addressBookApi'
import { operateAccountExamine } from '@/api/videoManagement/accountApproval'
import { loadUserData, changeTeacher, tearchFilter, filteredGroups } from '@/utils/videoMange'
import {
  getPlatform,
  getAccountList,
  getLoginInfo,
  deleteAccount,
  getPlatformLogin,
  checkLogin,
  updateLoginStatus,
  updateUnLogin,
  getAccountListFansNum,
  getGroupList,
  syncCheckSave,
  exportAccountList,
  qryCookieByPlatformAccountId
} from '@/api/videoManagement/accountManage'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import addAccount from './components/addAccount.vue'
import AccountConfiguration from './components/AccountGrouping/AccountConfiguration.vue'
import DialogDataSync from '../../videoPublish/components/DialogDataSync/index.vue'
import DownloadModal from '@/components/DownloadModal/index.vue'
import StopOrResume from './components/stopOrResume.vue'
import transferAccount from './components/transferAccount.vue'
import logOff from './components/logOff.vue'
import logging from './components/logging.vue'
import syncDataSetting from './components/syncDataSetting.vue'
import { filtersMoneyByW } from '@/filters/index'
import { querySyncInfo } from '../../videoPublish/publish/api/index'
import { formatterForW, isUseNewClient, downloadFile } from '@/utils'
export default {
  components: {
    addAccount,
    AccountConfiguration,
    DialogDataSync,
    DownloadModal,
    transferAccount,
    StopOrResume,
    logOff,
    AppIconClipboard,
    syncDataSetting,
    logging
  },
  // mixins: [mixinsSyncData],
  data() {
    return {
      wenhaoImg,
      filteredGroups,
      stopChange_icon,
      updating_icon,
      permsList: this.$route.meta.permsList || [],
      showAccount: false,
      iconShezhi,
      slotArr: [
        'action',
        'footer',
        'loginStatus',
        'accountStatus',
        'todayIsSync',
        'platformId',
        'name',
        'authorId'
      ],
      statusObj: {
        1: { name: '更新中', color: '#00B42A', bgColor: '#E6F7EA' },
        2: { name: '停更', color: '#F53F3F', bgColor: '#FEECEC' },
        3: { name: '停更申请中', color: '#FF7D00', bgColor: '#FFE3D2' },
        4: { name: '转号申请中', color: '#5286D0', bgColor: '#D3E5FF' },
        5: { name: '变更运营申请中', color: '#9E6CAA', bgColor: '#F3EAFF' },
        6: { name: '移交IP申请中', color: '#3BAEE8', bgColor: '#D6F8F9' },
        7: { name: '注销申请中', color: '#D4390C', bgColor: '#F7D5D7' }
      },
      nameObj: {
        3: {
          name: '撤销停更申请',
          status: 1,
          auth: 'web:accountMange:revokeAccountStop'
        },
        4: {
          name: '撤销转号申请',
          status: 2,
          auth: 'web:accountMange:revokeAccountTransfer'
        },
        5: {
          name: '撤销变更运营申请',
          status: 3,
          auth: 'web:accountMange:revokeChangeOperations'
        },
        6: {
          name: '撤销移交IP申请',
          status: 4,
          auth: 'web:accountMange:revokeTransferTeacher'
        },
        7: {
          name: '撤销注销申请',
          status: 5,
          auth: 'web:accountMange:revokeLogOff'
        }
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'name',
            width: 250,
            label: '账号',
            type: 'slot',
            visible: true,
            fixed: 'left',
            disable: true
          },
          {
            prop: 'teacherName',
            label: 'IP',
            'show-overflow-tooltip': true,
            type: 'text',
            sortable: 'custom',
            render: row => {
              return row.teacherName || '--'
            },
            visible: true
          },
          {
            prop: 'platformId',
            label: '平台',
            width: 120,
            type: 'slot',
            fixed: 'left',
            visible: true,
            disable: true
          },
          {
            prop: 'loginStatus',
            width: 180,
            label: '授权状态',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'accountStatus',
            width: 120,
            label: '账号状态',
            type: 'slot',
            align: 'center',
            visible: true
          },
          {
            prop: 'todayIsSync',
            width: 110,
            label: '今日同步数据',
            align: 'center',
            type: 'slot',
            visible: true
          },
          {
            prop: 'fans',
            width: 90,
            label: '粉丝数',
            align: 'center',
            sortable: 'custom',
            type: 'text',
            visible: true,
            render: row => {
              return filtersMoneyByW(row.fans)
            }
          },
          {
            prop: 'operatorName',
            label: '运营者',
            width: 120,
            type: 'text',
            visible: true
          },
          {
            prop: 'deptName',
            label: '部门',
            width: 280,
            type: 'text',
            visible: true
          },
          {
            prop: 'stopDays',
            label: '作品断更天数',
            width: 130,
            sortable: 'custom',
            align: 'center',
            type: 'text',
            visible: true
          },
          {
            prop: 'authorId',
            width: 230,
            label: '账号UID',
            type: 'slot',
            visible: true
          },
          {
            prop: 'phone',
            label: '电话号码',
            width: 120,
            type: 'text',
            visible: true
          },
          {
            prop: 'empowerTime',
            label: '授权时间',
            type: 'text',
            width: 180,
            align: 'center',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            fixed: 'right',
            disable: true
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 30,
        currentPage: 1,
        total: 0
      },
      visibleDialogDataSync: false,
      isShowDyId: false,
      loading: false,
      deptTreeArray: [],
      userArray: [],
      isFull: true,
      tearchArray: [],
      tearchList: [],
      platformArray: [],
      timer: null,
      groupArray: [],
      accountInfo: null,
      optType: 1,
      fansNum: 0,
      isFrist: true,
      loginArray: [
        { label: '未授权', value: 1 },
        { label: '已授权', value: 2 }
      ],
      accountStatus: [
        { label: '更新中', value: 1 },
        { label: '停更', value: 2 },
        { label: '停更申请中', value: 3 },
        { label: '转号申请中', value: 4 },
        { label: '变更运营申请中', value: 5 },
        { label: '移交IP申请中', value: 6 },
        { label: '注销申请中', value: 7 }
      ],
      accountForm: {
        deptArray: [],
        accountType: '',
        uniqueId: '',
        operatorId: '',
        teacherId: '',
        loginStatus: null,
        groupId: '',
        accountName: '',
        accountId: '',
        teacherSort: '', // IP排序
        fansSort: '', // 粉丝数排序
        platformId: null,
        phone: '',
        sortType: 0
      },
      roleObject: {},
      userInfo: {}
    }
  },
  computed: {
    // 不包含web:accountMange:abnormalAccount，web:accountMange:page之后是不是空
    isAbnormalAccountEmpty() {
      return (
        this.permsList.filter(
          v =>
            v !== 'web:accountMange:abnormalAccount' &&
            v !== 'web:accountMange:page' &&
            v !== 'web:accountMange:exportData'
        ).length === 0
      )
    },
    moreList() {
      return this.permsList.filter(
        v =>
          v !== 'web:accountMange:abnormalAccount' &&
          v !== 'web:accountMange:page' &&
          v !== 'web:accountMange:exportData'
      )
    },
    ...mapGetters([
      'allChannelSwitch',
      'fuxiVersion',
      'isNewSocketVideoPublish'
    ])
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
  activated() {},
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log(JSON.stringify(this.config.tableColumns))
      localStorage.setItem(
        'accountManage_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    this.userInfo = this.$store.getters.userInfo
    const accountManage_searchData = localStorage.getItem(
      'accountManage_searchData'
    )
    if (accountManage_searchData) {
      this.accountForm = {
        ...this.accountForm,
        ...JSON.parse(accountManage_searchData)
      }
      this.isShowDyId = this.accountForm.platformId === 19
    }
    const tableColumns = localStorage.getItem('accountManage_tabledata')
    if (tableColumns) {
      const newTableColumns = JSON.parse(tableColumns)
      // 更新缓存里面的配置项
      this.config.tableColumns.forEach(item => {
        newTableColumns.forEach(v => {
          if (item.prop === v.prop) {
            v.width = item?.width
            v.type = item?.type
          }
        })
      })
      this.config.tableColumns = newTableColumns
    }
    this.getOperationVideo()
    this.getSyncInfo()
    this.loadUserLoginInfo()
    this.loadTeacherData()
    this.loadGroupList()
    this.loadPlatformData()
    console.log(this.permsList, '账号有的权限')
    // this.automaticSync() // 自动同步
    // this.timer = setInterval(() => {
    //   this.automaticSync(1) // 自动同步
    // }, 1000 * 60 * 60 * 6)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
  },
  methods: {
    formatterForW,
    changePlatform(val) {
      this.accountForm.platformId = val
      this.isShowDyId = val === 19
      this.getListForSearch()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.operatorId === this.userInfo.userId) {
        return 'isMe-row'
      }
      return ''
    },
    // 打开数据同步检测设置弹窗
    syncDataSetting() {
      this.$refs.syncDataSetting.openDialog()
    },
    // 同步成功
    async syncDataSuccess(data) {
      // 获取data.timeArray日期格式new Date(2023, 10, 13, 12, 1, 0),
      const timeArray = data.timeArray.map(item => {
        return new Date(item).toLocaleTimeString('chinese', {
          hour12: false
        })
      })
      const obj = {
        status: data.value ? 2 : 1,
        startTime: timeArray[0],
        endTime: timeArray[1],
        id: data.id || ''
      }
      const res = await syncCheckSave(obj)
      this.$message.success('设置成功')
      console.log(res, '同步成功')
    },
    async getOperationVideo() {
      await this.$store.dispatch(
        'user/viewingFlag',
        'operationAccountManagement'
      )
    },
    // 自动检测一遍是否有掉线账号
    async getSyncInfo() {
      const { data } = await querySyncInfo({ type: 2 })
      data &&
        data.forEach(item => {
          item.newVersion = this.allChannelSwitch[item.platformId]
          isUseNewClient(
            item.platformId,
            'check-account-login-status',
            item.platformAccountId,
            '检测登录自媒体账号'
          ).emit(
            'check-account-login-status',
            JSON.stringify([item]),
            response => {
              // console.log(JSON.parse(response), '检测账号登录情况。。。')
              const checkAccountLoginStatusRes = JSON.parse(response)
              const res = checkAccountLoginStatusRes[0]
              if (res.Code === 200) {
                updateLoginStatus({
                  platformAccountId: item.platformAccountId,
                  name: res.AuthorName,
                  avatar: res.AuthorLogo,
                  cookie: item.cookie,
                  remark: '检测登录自媒体账号',
                  type: 1,
                  loginStatus: 2
                })
              } else {
                console.log(item, res, '错误的的账号')
                if (res?.PlatformAccountInfo.Code === -1) {
                  updateUnLogin({
                    loginStatus: 1,
                    platformAccountId: item.platformAccountId,
                    cookie: item.cookie,
                    version: this.fuxiVersion
                  })
                }
                this.$store.dispatch('videoManage/saveErrorInfo', {
                  platformAccountId: item.platformAccountId,
                  requestParam: item.cookie,
                  planId: item.platformId,
                  apiUrl: 'check-account-login-status',
                  errorInfo: res?.PlatformAccountInfo.Message
                })
              }
            }
          )
        })
    },
    // 导出数据
    async exportData() {
      const params = Object.assign({ 'pageIndex': 1, 'pageSize': 100000 }, this.accountForm)
      params.deptId = this.accountForm.deptArray[this.accountForm.deptArray.length - 1] ? this.accountForm.deptArray[this.accountForm.deptArray.length - 1] : ''
      delete params.deptArray
      const res = await exportAccountList(params)
      downloadFile(res, '运营账号管理.xls')
      console.log('导出数据：', res)
    },
    // 撤销申请
    async revokeAccount(data, type) {
      const params = {
        operateType: 3,
        platformAccountId: data.platformAccountId,
        recordId: '',
        type: type
      }
      await operateAccountExamine(params)
      this.$message.success('撤销成功')
      this.getList()
    },
    // 转号跟变更运营和移交老师
    async transferAccount(row, type) {
      const key =
        type === 3
          ? 'operatonTransferAccount'
          : type === 4
            ? 'operatonAccountChangeOperator'
            : 'operatonAccountChangeTeacher'
      const res = await this.$store.dispatch('user/viewingFlag', key)
      if (!res) {
        if (type === 3) {
          // 转号
          this.$uweb &&
            this.$uweb.setAction('Event_AccountMange_accountTransfer')
        } else if (type === 4) {
          // 变更运营
          this.$uweb &&
            this.$uweb.setAction('Event_AccountMange_changeOperations')
        } else if (type === 5) {
          // 移交老师
          this.$uweb &&
            this.$uweb.setAction('Event_AccountMange_transferTeacher')
        }
        this.accountInfo = row
        this.optType = type
        this.$nextTick(() => {
          this.$refs.transferAccount.show()
        })
      }
    },
    // 注销
    async logOff(row, type) {
      this.$uweb && this.$uweb.setAction('Event_AccountMange_logOff')
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operatonAccountWriteOff'
      )
      if (!res) {
        this.accountInfo = row
        this.optType = type
        this.$nextTick(() => {
          this.$refs.logOff.show()
        })
      }
    },
    // 查看日志
    showLogging(row) {
      this.accountInfo = row
      this.$nextTick(() => {
        this.$refs.logging.show()
      })
    },
    // // 恢复更新
    // resumeUpdates() {
    //   this.$uweb && this.$uweb.setAction('Event_AccountMange_accountRestore')
    //   this.$refs.stopOrResume.show()
    // },
    // 停更
    async stopOrResume(row, type) {
      if (type === 1) {
        this.$uweb && this.$uweb.setAction('Event_AccountMange_accountStop')
      } else {
        this.$uweb && this.$uweb.setAction('Event_AccountMange_accountRestore')
      }
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operatonAccountStopUpdating'
      )
      if (!res) {
        this.accountInfo = row
        this.optType = type
        this.$refs.stopOrResume.show()
      }
    },
    async toAbnormal() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationAbnormalAccount'
      )
      if (!res) {
        this.$uweb && this.$uweb.setAction('Event_AccountMange_abnormalAccount')
        this.$router.push({ path: 'abnormalManage' })
      }
    },
    // 最小化窗口
    handleMinimize() {
      this.isFull = false
    },
    // 关闭弹窗
    closeSync() {
      this.visibleDialogDataSync = false
      this.getList()
    },
    // 开始数据同步
    async handleClickSyncData() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationSyncAccount'
      )
      if (!res) {
        const isSocket = this.isNewSocketVideoPublish
        console.log(isSocket, this.visibleDialogDataSync, 'isSocket')
        if (isSocket) {
          if (this.visibleDialogDataSync) {
            this.isFull = true
          } else {
            this.visibleDialogDataSync = true
          }
        } else {
          this.$refs.DownloadModal.show()
        }
        this.$uweb && this.$uweb.setAction('Event_AccountMange_dataSync')
        // this.$openYixiaoer()
      }
    },
    // 数据同步结束
    syncOver() {},
    // 添加账号
    addGround() {
      this.visibleDialogDataSync = false
      this.toAddAccount()
    },
    updataLoginLoading(platformAccountId) {
      const index = this.config.tableData.findIndex(item => item.platformAccountId === platformAccountId)
      if (index !== -1) {
        this.config.tableData[index].isLoginLoading = !this.config.tableData[index].isLoginLoading
        this.$forceUpdate()
        console.log(this.config.tableData, 'table数据')
      }
    },
    // 更改登录状态
    async updataLoginStatus(data) {
      const paramsd = {
        loginStatus: 2,
        platformAccountId: data.platformAccountId,
        cookie: data.cookie,
        remark: '检测更新登录状态',
        type: 1
      }
      await updateLoginStatus(paramsd)
      this.getList()
    },
    async toLgoinNow(row) {
      this.$uweb && this.$uweb.setAction('Event_videoManage_accountMange_login')
      const isSocket = this.isNewSocketVideoPublish
      if (isSocket) { // 查询最新的cookie 并且把row.cookie替换成最新的
        const res = await qryCookieByPlatformAccountId({ platformAccountId: row.platformAccountId })
        const newCookie = res.data
        row.cookie = newCookie
        const checkData = [{
          platformId: row.platformId,
          platformAccountId: row.platformAccountId,
          cookie: newCookie,
          token: this.merchantToken
        }]
        this.updataLoginLoading(row.platformAccountId)
        isUseNewClient(row.platformId, 'check-account-login-status', row.platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify(checkData), response => {
          const checkAccountLoginStatusRes = JSON.parse(response)
          const res = checkAccountLoginStatusRes[0]
          if (res.Code === 200) {
            this.$message.success('当前账号已登录，无需重新授权登录！')
            this.updataLoginStatus(row)
          } else {
            getPlatformLogin().then(res => {
              console.log(res, '用户登录之前获取merchantToken')
              if (res.success) {
                let loginResponse = ''
                const merchantToken = res.data.merchantToken // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbl9pZCI6IjNhMDlhMzNiLTk1YjQtNTE3YS05NjQwLWYxNmRjNDczMmQxNyIsIm5iZiI6MTY3Nzc1NDU2NywiZXhwIjoxNjc3ODQwOTY3LCJpYXQiOjE2Nzc3NTQ1NjcsImlzcyI6IkdhZWEiLCJhdWQiOiJHYWVhIn0.mEaVIFA76YJQeEMSBoZZQfM7S3eUx6jOkRefcXBl0jY'
                // 登录账号
                const params = {
                  accountId: res.data.accountId,
                  merchantId: res.data.merchantId,
                  platformId: row.platformId,
                  merchantToken,
                  cookie: null,
                  newVersion: this.allChannelSwitch[row.platformId],
                  authorizationModel: true
                }
                this.updataLoginLoading(row.platformAccountId)
                this.$store.dispatch('videoManage/saveErrorInfo', {
                  platformAccountId: row.platformAccountId,
                  requestParam: row.cookie,
                  planId: row.platformId,
                  apiUrl: 'account-login',
                  errorInfo: '登录之前的日志记录'
                })
                try {
                  console.log(params, '提交登录参数')
                  isUseNewClient(
                    row.platformId,
                    'account-login',
                    row.platformAccountId,
                    '登录自媒体账号'
                  ).emit('account-login', JSON.stringify(params), response => {
                    loginResponse = JSON.parse(response)
                    console.log('loginReeeeeeeee:', loginResponse)
                    if (loginResponse.code === 200) {
                      const userInfo = loginResponse.data?.userInfo ? JSON.parse(loginResponse.data?.userInfo) : null
                      const short_id = userInfo?.unique_id || userInfo?.short_id
                      const paramsSecord = {
                        authorId: loginResponse.data.authorId,
                        platformAccountId: row.platformAccountId
                      }
                      this.$store.dispatch('videoManage/saveErrorInfo', {
                        platformAccountId: row.platformAccountId,
                        requestParam: loginResponse.data.cookie,
                        planId: row.platformId,
                        apiUrl: 'account-login',
                        errorInfo: '登录之后的日志记录'
                      })
                      checkLogin(paramsSecord).then(res => {
                        if (res.success) {
                          const paramsd = {
                            loginStatus: 2,
                            cookie: loginResponse.data.cookie,
                            platformAccountId: row.platformAccountId,
                            remark: '登录自媒体账号',
                            uniqueId: short_id,
                            type: 1
                          }
                          updateLoginStatus(paramsd).then(res => {
                            if (res.success) {
                              this.$message.success('登录成功！')
                              this.$store.dispatch(
                                'videoManage/syncAccountData',
                                row.platformAccountId
                              )
                              // 没有手机号  打开编辑弹窗
                              if (!row.phone) {
                                this.gotoEditAccount(row)
                              }
                              this.getList()
                            }
                          })
                        }
                      })
                    } else {
                      this.$message.error(loginResponse.message)
                    }
                  })
                } catch (err) {
                  console.log(err, '错误')
                }
              }
            })
          }
        })
      } else {
        this.$refs.DownloadModal.show()
      }
    },
    loadUserLoginInfo() {
      getLoginInfo().then(res => {
        console.log(res, '用户信息')
        if (res.success) {
          this.roleObject = res.data
          // this.roleObject.role = 1
          this.loadTreeData(res.data.deptId)
          this.accountForm.operatorId = this.userInfo.userId
          // 不区分是否为负责人
          this.loadUserNoPage()
          this.getList()
          // if (this.roleObject.role === 1) {
          //   console.log('调用了列表接口')
          //   this.loadUserNoPage()
          //   this.getList()
          // } else {
          //   this.accountForm.operatorId = this.userInfo.userId
          //   // this.accountForm.deptArray.push()
          //   this.loadUserNoPage()
          //   this.getList()
          // }
        }
      })
    },
    async gotoZhuye(row) {
      console.log('row:', row)
      // // 如果是未授权状态则直接打开授权窗口
      // if (row.loginStatus !== 2) {
      //   this.toLgoinNow(row)
      //   return
      // }
      // 查询最新的cookie 并且把row.cookie替换成最新的
      const res = await qryCookieByPlatformAccountId({ platformAccountId: row.platformAccountId })
      const newCookie = res.data
      row.cookie = newCookie
      const checkData = [{
        platformId: row.platformId,
        platformAccountId: row.platformAccountId,
        cookie: newCookie,
        token: this.merchantToken
      }]
      isUseNewClient(row.platformId, 'check-account-login-status', row.platformAccountId, '检测登录自媒体账号').emit('check-account-login-status', JSON.stringify(checkData), response => {
        const checkAccountLoginStatusRes = JSON.parse(response)
        const res = checkAccountLoginStatusRes[0]
        console.log(res, '账号主页的检测')
        updateLoginStatus({
          cookie: res.Code === 200 ? res.cookie : '[]',
          loginStatus: res.Code === 200 ? 2 : 1,
          platformAccountId: row.platformAccountId,
          remark: '打开账号主页',
          type: 1
        })
        if (res.Code === 200) {
          row.loginStatus = 2
        } else {
          row.loginStatus = 1
          this.$message.error('该账号登录失效，请扫码授权登录。')
        }
      })
      this.$uweb && this.$uweb.setAction('Event_videoManage_accountMange_home')
      const isSocket = this.isNewSocketVideoPublish
      // 存储数据到session
      const updataHomepage =
        JSON.parse(localStorage.getItem('updataHomepage')) || []
      const itemIndex = updataHomepage.findIndex(
        item => item.platformAccountId === row.platformAccountId
      )
      if (itemIndex !== -1) {
        // 如果找到了匹配的项，更新cookie
        updataHomepage[itemIndex].cookie = row.cookie
      } else {
        // 如果没有找到匹配的项，添加新的项
        updataHomepage.push(row)
      }
      localStorage.setItem('updataHomepage', JSON.stringify(updataHomepage))
      if (isSocket) {
        getPlatformLogin().then(res => {
          if (res.success) {
            let loginResponse = ''
            const merchantToken = res.data.merchantToken // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbl9pZCI6IjNhMDlhMzNiLTk1YjQtNTE3YS05NjQwLWYxNmRjNDczMmQxNyIsIm5iZiI6MTY3Nzc1NDU2NywiZXhwIjoxNjc3ODQwOTY3LCJpYXQiOjE2Nzc3NTQ1NjcsImlzcyI6IkdhZWEiLCJhdWQiOiJHYWVhIn0.mEaVIFA76YJQeEMSBoZZQfM7S3eUx6jOkRefcXBl0jY'
            // 登录账号
            const params = {
              accountId: row.platformAccountId,
              url: row.authorityUrl,
              displayName: row.platformName + '-' + row.name,
              platformId: row.platformId,
              merchantToken,
              token: null,
              cookie: row.cookie,
              newVersion: this.allChannelSwitch[row.platformId],
              authorizationModel: false
            }
            console.log(params)
            this.$store.dispatch('videoManage/saveErrorInfo', {
              platformAccountId: row.platformAccountId,
              requestParam: row.cookie,
              planId: row.platformId,
              apiUrl: 'open-account',
              errorInfo:
                row.platformName + '-' + row.name + '-' + row.platformId
            })
            try {
              isUseNewClient(
                row.platformId,
                'open-account',
                row.platformAccountId,
                '打开账号主页'
              ).emit('open-account', JSON.stringify(params), response => {
                loginResponse = JSON.parse(response)
                console.log(loginResponse, '账号主页5555555555')
                if (loginResponse.code === 200) {
                  const userInfo = loginResponse.data?.userInfo ? JSON.parse(loginResponse.data?.userInfo) : null
                  const short_id = userInfo?.unique_id || userInfo?.short_id
                  const updataHomepage =
                    JSON.parse(localStorage.getItem('updataHomepage')) || []
                  const itemIndex = updataHomepage.findIndex(
                    item =>
                      item.platformAccountId ===
                      loginResponse.data.platformAccountId
                  )
                  // 没有登录过期的
                  console.log(loginResponse, '账号主页')
                  const paramsd = {
                    loginStatus: 2,
                    oldCookie: updataHomepage[itemIndex]?.cookie,
                    cookie: loginResponse.data.cookie,
                    platformAccountId: loginResponse.data.platformAccountId,
                    type: 1,
                    uniqueId: short_id,
                    remark: '打开账号主页'
                  }
                  // 删除队列里面这条数据
                  updataHomepage.splice(itemIndex, 1)
                  checkLogin({ authorId: loginResponse.data.authorId, platformAccountId: row.platformAccountId }).then(res => {
                    if (res.success) {
                      updateLoginStatus(paramsd).then(res => {
                        this.getList()
                      })
                    }
                  })
                }
              })
            } catch (err) {
              console.log(err)
            }
          }
        })
      } else {
        this.$refs.DownloadModal.show()
      }
    },
    gotoEditAccount(row) {
      this.showAccount = true
      this.$refs.accountConfiguration.showEidt(row)
      this.$uweb && this.$uweb.setAction('Event_AccountMange_edit')
    },
    deleteAccount(row) {
      this.$uweb &&
        this.$uweb.setAction('Event_videoManage_accountMange_remove')
      this.$confirm(
        '删除后，后续将无法查看和跟踪发布详情，确认删除吗？',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }
      )
        .then(() => {
          const params = {
            platformAccountId: row.platformAccountId
          }
          deleteAccount(params).then(res => {
            if (res.success) {
              this.$message.success('移除成功！')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    clear() {
      this.accountForm = {
        deptArray: [],
        operatorId: '',
        uniqueId: '',
        teacherId: '',
        accountType: '',
        loginStatus: null,
        groupId: '',
        accountName: '',
        teacherSort: '', // IP排序
        fansSort: '', // 粉丝数排序
        accountId: '',
        platformId: null,
        phone: '',
        sortType: 0
      }
      this.isShowDyId = false
      this.getListForSearch()
    },
    loginSuccess(item) {
      this.showAccount = true
      this.$refs.accountConfiguration.show(item)
    },
    closeAccountConfig() {
      this.showAccount = false
    },
    async toAddAccount() {
      this.$uweb && this.$uweb.setAction('Event_AccountMange_addAccount')

      const isSocket = this.isNewSocketVideoPublish
      if (isSocket) {
        this.$refs.addAccountRef.show()
      } else {
        this.$refs.DownloadModal.show()
      }
    },
    toAccountGroup() {
      this.$uweb && this.$uweb.setAction('Event_videoManage_accountMange_group')
      this.$router.push({ path: 'accountGroup' })
    },
    successForAccount() {
      this.showAccount = false
      this.$refs.addAccountRef.addAccountFlag = false
      this.getList()
    },
    gotoAccountDataDetail(data) {
      this.$uweb && this.$uweb.setAction('Event_AccountMange_details')
      const path = this.$route.path
      const toTaskLog = this.$router.push({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${data.platformAccountId}&path=${path}&name=账号管理`
      })
      window.open(toTaskLog.href, '_blank')
    },
    addSuccessAccount() {
      this.getListForSearch()
    },
    getImgSrc(id) {
      let img = ''
      this.platformArray.some(item => {
        if (item.platformId === id) {
          img = item.platformIcon
          return
        }
      })
      return img
    },
    getListForSearch() {
      this.$uweb && this.$uweb.setAction('Event_videoManage_accountMange_list')
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      // 每次获取列表的时候缓存搜索条件
      localStorage.setItem(
        'accountManage_searchData',
        JSON.stringify(this.accountForm)
      )
      const params = {
        deptId: this.accountForm.deptArray[
          this.accountForm.deptArray.length - 1
        ]
          ? this.accountForm.deptArray[this.accountForm.deptArray.length - 1]
          : '',
        groupId: this.accountForm.groupId,
        loginStatus: this.accountForm.loginStatus,
        operatorId: this.accountForm.operatorId,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        accountType: this.accountForm.accountType,
        platformId: this.accountForm.platformId
          ? this.accountForm.platformId
          : null,
        teacherId: this.accountForm.teacherId,
        accountName: this.accountForm.accountName,
        accountId: this.accountForm.accountId,
        uniqueId: this.accountForm.uniqueId,
        sortType: this.accountForm.sortType,
        teacherSort: this.accountForm.teacherSort,
        phone: this.accountForm.phone,
        fansSort: this.accountForm.fansSort
      } // this.accountForm
      getAccountList(params).then(res => {
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.tableData.some(item => {
            item.platformImg = this.getImgSrc(item.platformId)
            item.isLoginLoading = false
          })
          console.log(this.config.tableData, '列表数据')
          // 如果是首次进来没有数据则去掉运营者再次查询
          if (this.config.tableData.length === 0 && this.isFrist) {
            this.accountForm.operatorId = ''
            this.accountForm.teacherId = ''
            this.getList()
          }
          this.isFrist = false
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.total = res.data.total
        }
      })
      getAccountListFansNum(params).then(res => {
        if (res.success) {
          this.fansNum = res.data
        }
      })
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })
      localStorage.setItem(
        'accountManage_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'accountManage_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    },
    loadGroupList() {
      getGroupList().then(res => {
        if (res.success) {
          this.groupArray = res.data
        }
      })
    },
    loadUserNoPage() {
      const params = {
        deptId: this.accountForm.deptArray[
          this.accountForm.deptArray.length - 1
        ]
          ? this.accountForm.deptArray[this.accountForm.deptArray.length - 1]
          : '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('accountCommonUse', 1)
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async handleChangeTeacher() {
      if (this.accountForm.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'accountCommonUse', this.accountForm.teacherId)
        this.tearchArray = res
      }
      this.getListForSearch()
    },
    async tearchFilter(query) {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList, this.accountForm.teacherId)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    async loadTreeData(id) {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
      const list = this.findParents(res.data, id)
      const list2 = list.reverse()
      list2.push(id)
      console.log(list2)
      this.accountForm.deptArray = [list2[0]] || []
      console.log(this.accountForm.deptArray, '拿到了当前部门信息')
    },
    setListItemDisable(list) {
      list.forEach(element => {
        element.disabled = false
        if (element.children && element.children.length > 0) {
          this.setListItemDisable(element.children)
        }
      })
    },
    findParents(treeData, id) {
      if (treeData.length === 0) return
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === id) {
          treeData[i].disabled = false
          if (treeData[i].children) {
            this.setListItemDisable(treeData[i].children)
          }
          return []
        } else {
          if (treeData[i].children) {
            const res = this.findParents(treeData[i].children, id)
            if (res !== undefined) {
              return res.concat(treeData[i].id)
            }
          }
        }
      }
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    visibleChangeD(events) {
      console.log('events: ', events)
      if (!events) {
        this.loadUserNoPage()
        this.getListForSearch()
      } else {
        this.getListForSearch()
      }
    },
    sortChange({ prop, order }) {
      console.log(prop, order, '排序')
      this.accountForm.teacherSort = ''
      this.accountForm.fansSort = ''
      this.accountForm.sortType = 0
      const configMap = {
        fans: {
          ascending: 1,
          descending: 2,
          default: ''
        },
        teacherName: {
          ascending: 1,
          descending: 2,
          default: ''
        },
        stopDays: {
          ascending: 1,
          descending: 2,
          default: 0
        }
      }
      if (prop === 'fans') {
        this.accountForm.fansSort = configMap[prop][order]
      } else if (prop === 'teacherName') {
        this.accountForm.teacherSort = configMap[prop][order]
      } else if (prop === 'stopDays') {
        console.log(configMap[prop], 'stopDays')
        this.accountForm.sortType = configMap[prop][order] || 0
      }
      this.getList()
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 多选触发
    handleSelectionChange() {}
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.exportData {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.asyncStatus {
  display: flex;
  align-items: center;
  justify-content: center;
  .tips {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .tipsFont1 {
    color: #00b42a;
  }
  .tipsFont2 {
    color: #f53f3f;
  }
  .tips1 {
    background: #00b42a;
  }
  .tips2 {
    background: #f53f3f;
  }
}
.page_wrap1 ::v-deep {
  @include responsive-height(20px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 15px;
  .opt_list .el-form-item {
    width: 100%;
  }
  .opt_list .el-form-item__content {
    display: flex;
    // align-items: center;
    // justify-content: space-between;
    width: 100%;
  }
  .el-table .isMe-row {
    background: #f7fbff;
  }

  .accountStatus {
    display: flex;
    .accountStatus1,
    .accountStatus2 {
      display: flex;
      align-items: center;
      height: 24px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      justify-content: center;
      img {
        margin-left: 10px;
        margin-right: 4px;
        width: 14px;
        height: 14px;
      }
    }
    .accountStatus1 {
      color: #00b42a;
      width: 108px;
      background: #e6f7ea;
    }
    .accountStatus2 {
      color: #f53f3f;
      width: 62px;
      background: #feecec;
    }
  }
  .search {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .form-container {
      width: 100%;
      .form-item {
        flex: 1;
        min-width: 400px;
        .el-form-item__content {
          display: flex;
        }
      }
    }
    .search_box {
      display: flex;
      height: 33px;
      width: 100%;
      // .search_right {
      //   margin-left: 20px;
      //   flex: 1 0 0;
      //   display: flex;
      //   align-items: flex-end;
      //   justify-content: flex-end;
      // }
    }
  }
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
}
.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.fans-item {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
.experience {
  width: 135px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}

.search_for_button {
  margin-left: 10px;
  ::v-deep .el-button--primary.is-plain {
    border: 1px solid #0c6fff;
    color: #0c6fff;
    background: none !important;
  }
  .add_account {
    margin-right: 5px;
    font-weight: bold;
  }
}

.login-success {
  color: #00b42a;
}
.login-error {
  display: flex;
  align-items: center;
  .unLogin {
    color: #f53f3f;
    margin-right: 12px;
  }
  ::v-deep .el-button {
   // width: 80px;
  }
}
.plat-form-line {
  img {
    float: left;
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }
  span {
    line-height: 36px;
    margin-left: 8px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
  }
}
.del-cls {
  color: #f53f3f;
}

.item-tips {
  float: left;
}
</style>
