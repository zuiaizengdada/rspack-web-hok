<template>
  <div class="filterTop">
    <!-- 筛选栏 -->
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-form-item label="IP姓名">
        <el-input
          v-model.trim="search.teacherName"
          clearable
          maxlength="20"
          @keyup.enter.native="handleSubmit"
          @clear="handleSubmit"
        />
      </el-form-item>
      <el-form-item label="评估结果">
        <el-select
          v-model="search.assessResult"
          clearable
          @change="handleSubmit"
        >
          <el-option
            v-for="(item, index) in ASSESS_RESULT_All"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合作状态" label-width="66x">
        <el-select
          v-model="search.cooperateStatus"
          clearable
          @change="handleSubmit"
        >
          <el-option
            v-for="item in COOPERATION_TYPE"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人所属机构" label-width="108px">
        <el-select
          v-model="search.orgId"
          clearable
          @change="onTenantIdChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建人">
        <m-select
          ref="mSelect"
          v-model="search.createUserId"
          remote
          clearable
          filterable
          :request="getUserList"
          :param="{ value: 'sysUserId', label: 'userName' }"
          @change="handleSubmit"
        />
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="createTimeValue"
          type="daterange"
          style="width:228px"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="handleCreateChange"
          @blur="currentTime = ''"
        />
      </el-form-item>
      <el-form-item label="跟进人所属机构" label-width="108px">
        <el-select
          v-model="search.followOrgId"
          clearable
          @change="onTenantIdChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="跟进人" label-width="52px">
        <m-select
          ref="mSelect"
          v-model="search.followUserId"
          remote
          clearable
          filterable
          :request="getUserList1"
          :param="{ value: 'sysUserId', label: 'userName' }"
          @change="handleSubmit"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="handleSubmit">
          查询
        </el-button>
        <el-button size="small" @click="handleInit">重置</el-button>
        <el-button
          v-permission="['teacherShare-export', permsList]"
          v-loading="exportLoading"
          type="primary"
          size="small"
          @click="handleExport"
        >导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { ASSESS_RESULT_All } from '../enum'
import { getDict } from '@/utils/index'
import { getItem } from '@/utils/localStorage'
import { querySysUser } from '@/api/tearchCenter/tearchSharing.js'
import { getSharingSettingOrgByType } from '@/api/tearchCenter'
import { userNoPage } from '@/api/addressBookApi'
import { exportTeacherSharingNewList } from '@/api/tearchCenter/tearchSharing.js'
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: 'first'
    },
    search: {
      type: Object,
      default: () => {
        return {
          cooperateStatus: '', // 跟进状态
          followUserId: '', // 跟进人Id
          createUserId: '', // 跟进人Id
          followerName: '', // 跟进人姓名
          teacherName: '', // 老师真实姓名
          orgId: '', // 跟进人所属机构id
          followOrgId: '', // 跟进人所属机构id
          assessResult: '', // 跟进人所属机构id
          domainId: undefined,
          createUserName: '',
          pageIndex: 1,
          pageSize: 10,
          createTimeEnd: undefined,
          createTimeBegin: undefined
        }
      }
    }
  },
  data() {
    return {
      ASSESS_RESULT_All,
      COOPERATION_TYPE: [],
      orgList: [],
      userNoPage,
      currentTime: '',
      createTimeValue: [],
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 365 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      exportLoading: false
    }
  },
  computed: {
    permsList() {
      return this.$route.meta.permsList || []
    }
  },
  async created() {
    const arr = await getDict('COOPERATION_TYPE')
    if (this.type === 'first') {
      this.COOPERATION_TYPE = arr.filter(item => !['已签合同', '黑名单'].includes(item.label))
    } else if (this.type === 'second') {
      this.COOPERATION_TYPE = arr.filter(item => ['已签合同'].includes(item.label))
    } else if (this.type === 'third') {
      this.COOPERATION_TYPE = arr.filter(item => ['黑名单'].includes(item.label))
    }
    this.search.cooperateStatus = ''
    await this.$store.dispatch('option/getAreaOption')
    this.getSharingSettingOrgList()
    // this.orgList = await getDict('TEARCHER_ORGLIST')
  },
  mounted() {},
  methods: {
    async getSharingSettingOrgList() {
      const res = await getSharingSettingOrgByType({
        organizationId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        sharingSettingType: 1
      })
      this.orgList = res.data
      this.orgList.unshift({
        organizationId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        name: JSON.parse(localStorage.getItem('orgInfo')).name
      })
    },
    handleCreateChange(val) {
      if (val && val.length) {
        this.search.createTimeBegin = val[0]
          ? moment(val[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
        this.search.createTimeEnd = val[1]
          ? moment(val[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
      } else {
        this.search.createTimeBegin = undefined
        this.search.createTimeEnd = undefined
      }
      this.handleSubmit()
    },
    handleSubmit() {
      const search = {
        ...this.search,
        pageIndex: 1
      }
      this.$emit('search', search)
    },
    async handleExport() {
      if (this.exportLoading) {
        return
      }
      this.exportLoading = true
      const cooperateStatusPool = this.type === 'first' ? 1 : this.type === 'second' ? 2 : 3
      const res = await exportTeacherSharingNewList({ ...this.search, pageIndex: 1 }, cooperateStatusPool).finally(() => {
        this.exportLoading = false
      })
      window.open(res.data, '_self')
    },
    handleInit() {
      const search = {
        ...this.search,
        cooperateStatus: '',
        followerName: '',
        teacherRealName: '',
        teacherPhoneNum: '',
        followOrgId: '',
        followUserId: '',
        createUserId: '',
        teacherName: '',
        assessResult: '',
        orgId: '',
        pageIndex: 1,
        pageSize: 10,
        createTimeEnd: undefined,
        createTimeBegin: undefined
      }
      this.currentTime = ''
      this.createTimeValue = []
      this.$emit('search', search)
    },
    onTenantIdChange() {
      const search = {
        ...this.search,
        pageIndex: 1,
        followerName: ''
      }
      this.$refs.mSelect.clearOption()
      this.$emit('search', search)
    },
    // 根据指定机构获取系统员工
    getUserList(val) {
      const orginfo = getItem('orgInfo')
      const data = {
        tenantId: this.search.orgId
          ? this.search.orgId
          : orginfo.organizationId,
        nickName: val.name
      }
      return querySysUser(data)
    },
    // 根据指定机构获取系统员工
    getUserList1(val) {
      const orginfo = getItem('orgInfo')
      const data = {
        tenantId: this.search.followOrgId
          ? this.search.followOrgId
          : orginfo.organizationId,
        nickName: val.name
      }
      return querySysUser(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop{
  margin-left: 20px;
  margin-right: 20px;
}
</style>
