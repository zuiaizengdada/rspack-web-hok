<template>
  <div class="page_wrap">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref">
      <template #teacherId>
        <el-select
          v-model="formOpts.formData.teacherId"
          size="small"
          filterable
          placeholder="请选择"
          clearable
          @change="searchFn()"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </template>
    </HokSearchForm>

    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:headImgUrl="{ scope }">
        <AppAvatar
          :avatar="scope.row.headImgUrl"
          :name="scope.row.liveRoomAlias || scope.row.teacherName"
          width="30"
          :no-name="true"
        />
      </template>
      <template v-slot:teacherTel="{ scope }">
        <watchPhoneNumber
          :default-value="scope.row.teacherTel"
          :params="scope.row"
          :user-id="scope.row.teacherId"
          :get-api="operationLogsWrite"
        />
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['btn:assistantMange:edit', permsList]"
          type="text"
          @click="onhandleEdit(scope.row)"
          >编辑</el-button
        >
      </template>
    </ZBTable>
    <addDialog :config="addConfig" @success="addConfigSuccess" />
  </div>
</template>

<script>
import { liveOperationType } from '@/views/live/columns.js'
import { userNoPage } from '@/api/addressBookApi'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { liveRoomTutorPage, sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import addDialog from './addDialog.vue'
// import sensitiveOrgSetting from '../sensitive/index.vue'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columns'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    watchPhoneNumber,
    AppAvatar,
    addDialog
    // sensitiveOrgSetting
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: { plain: true },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.searchFn(true)
            }
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      userArray: [],
      addConfig: {
        visible: false
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.loadUserNoPage()
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          teacherId: undefined,
          teacherTel: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params).then(res => {
        this.userArray = res.data
      })
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      return liveRoomTutorPage(params)
    },
    // 点击编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    addConfigSuccess() {
      this.addConfig = {
        visible: false,
        row: {}
      }
      this.searchFn()
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.teacherId,
        phoneNum: params.teacherTel,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type10
      }
      return sysUserWrite(data)
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  padding: 0 20px 20px 20px;
}
</style>
