<template>
  <div class="page_wrap1">
    <div class="search">
      <el-form :inline="true" :model="search" class="form-container" size="small">
        <el-form-item label="IP姓名">
          <!-- <el-input v-model="search.name" style="width: 194px" /> -->
          <teacherInput
            ref="teacherInput"
            v-model="search.teacherName"
            attribute="teacherName"
            @clear="searchFn"
            @select="searchFn()"
            @keyup.enter.native="searchFn"
          />
        </el-form-item>
        <el-form-item label="所属领域">
          <el-select v-model="search.domainId" clearable @change="searchFn()" @clear="searchFn">
            <el-option
              v-for="(item, index) in areaOption"
              :key="index"
              :label="item.domainName"
              :value="item.domainId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="IP推荐人">
          <el-input v-model="search.recommendName" placeholder="请输入IP推荐人" clearable />
        </el-form-item>
        <el-form-item label="评估截止日期">
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            style="width:228px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
        <el-form-item label="评估状态">
          <el-select
            v-model="search.assessStatus"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in ASSESS_TYPES"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评估结果">
          <el-select
            v-model="search.assessResult"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in ASSESS_RESULT_All"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合作状态">
          <el-select
            v-model="search.cooperateStatus"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in COOPERATION_TYPE"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item label="创建人">
          <el-input v-model="search.createUserName" placeholder="请输入创建人" clearable />
        </el-form-item>
        <el-form-item label="是否需要评估">
          <el-select
            v-model="search.assessFlag"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              label="是"
              :value="1"
            />
            <el-option
              label="否"
              :value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-item">
          <div class="search_box">
            <el-button type="primary" :loading="loading" @click="searchFn">查询</el-button>
            <el-button :loading="loading" @click="clear">重置</el-button>
            <div class="search_right">
              <el-button
                v-permission="['web:teachFileList:add', permsList]"
                :loading="loading"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="gotoAdd"
              >新增IP</el-button>
              <el-button
                v-permission="['web:teachFileList:reminder', permsList]"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="openDialog"
              >评估提醒</el-button>
              <el-button
                v-permission="['web:teachFileList:notice', permsList]"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="openNotice"
              >跟进通知</el-button>
              <el-button
                v-permission="['web:teachFileList:export', permsList]"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="handleExport"
              >导出</el-button>
              <el-button
                v-permission="['web:teachFileList:changeName', permsList]"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="goModifyLink"
              >IP名称修改</el-button>
            </div>
          </div>

        </el-form-item>
      </el-form>

    </div>
    <!-- 师资档案 -->
    <MPageLayout
      ref="MPageLayout"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @sort-change="sortChange"
    >
      <template slot="shareStatus" slot-scope="{ row }">
        {{ row.share ? '共享' : '不共享' }}<el-switch v-model="row.share" v-permission="['web:teachFileList:share', permsList]" @change="handleShareStatusChange($event,row)" />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['web:teachFileList:detail', permsList]"
          type="text"
          @click="gotoDetail(row)"
        >详情</el-button>
        <el-button
          v-permission="['web:teachFileList:edit', permsList]"
          type="text"
          @click.native="gotoEdit(row)"
        >编辑</el-button>
        <el-button
          v-permission="['web:teachFileList:follow', permsList]"
          type="text"
          @click.native="openFollow(row)"
        >跟进</el-button>
        <el-dropdown>
          <span v-if="hasMore" class="m-l-10" style="color:#0C6FFF;cursor: pointer;"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-permission="['web:teachFileList:schedule', permsList]"
              @click.native="gotoSchedule(row)"
            >排期</el-dropdown-item>
            <el-dropdown-item
              v-if="canTransfer &&![1,9].includes(row.cooperateStatus)"
              v-permission="['web:teachFileList:transfer', permsList]"
              @click.native="gotoTransfer(row)"
            >转让</el-dropdown-item>
            <!-- <el-dropdown-item
                  v-permission="['web:teachFileList:assess', permsList]"
                  @click.native="gotoEvaluate(row)"
                >评估</el-dropdown-item> -->
            <!-- <el-dropdown-item
              v-permission="['web:teachFileList:authorize', permsList]"
              @click.native="gotoAuthorize(row)"
            >授权</el-dropdown-item> -->
            <el-dropdown-item
              v-permission="['web:teachFileList:demand', permsList]"
              @click.native="gotoDemand(row)"
            >话题</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:teachFileList:case', permsList]"
              @click.native="gotoCase(row)"
            >选题</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:teachFileList:plan', permsList]"
              @click.native="gotoPlan(row)"
            >计划</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:teachFileList:courseware', permsList]"
              @click.native="gotoCourseware(row)"
            >课件</el-dropdown-item>
            <el-dropdown-item
              v-permission="['web:teachFileList:material', permsList]"
              @click.native="gotoMaterial(row)"
            >文件</el-dropdown-item>
            <!-- <el-dropdown-item v-permission="['web:teachFileList:order', permsList]" @click.native="gotoOrder(row)"
                >订单</el-dropdown-item
              > -->
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="assessResult" slot-scope="{row}">
        <el-button
          v-if="row.overallRating !== null && row.overallRating !== undefined && row.assessStatus === 3"
          type="text"
          @click="goAssessDetail(row)"
        >
          {{ (row.overallRating / 100) + '分' }}
        </el-button>
        <span v-else>{{ getOptionsValue(row.mergeResult, ASSESS_RESULT_OTHER) || '—' }}</span>
      </template>
      <template slot="photoUrl" slot-scope="{ row }">
        <div class="photoUrl">
          <ImagePreviewer
            :preview-src-list="[row.photoUrl]"
            fit="contain"
            :src="row.photoUrl"
            style="width: 100%; height: 100%"
            :scale-width="70"
            :scale-height="80"
            error-slot
          >
            <img slot="error" src="@/assets/image/tupianjiazaishibai.png" alt="" style="width: 100%; height: 100%" />
          </ImagePreviewer>
        </div>
      </template>
      <template slot="experience" slot-scope="{ row }">
        <el-tooltip effect="dark" placement="top" width="400">
          <div slot="content" v-html="row.experience ? row.experience.replace(/\n/g, '<br />') : ''" />
          <span class="experience">
            {{ row.experience }}
          </span>
        </el-tooltip>
      </template>
    </MPageLayout>
    <assessDialog ref="assessDialog" @success="getList" />
    <followModal ref="followModal" @success="getList" />
    <noticeDialog ref="noticeDialog" />
    <transferDialog ref="transferDialog" @success="getList" />
  </div>
</template>

<script>
import teacherInput from '../../components/teacherSelect/index'
import { ASSESS_TYPES, ASSESS_RESULT_All, ASSESS_RESULT_OTHER } from '../../enum'
import { mapGetters } from 'vuex'
import { getTeacherList, getTeacherListExport } from '@/api/tearchCenter/index'
import { getSharingSettingOrgByType, updateShare } from '@/api/tearchCenter'
import { getOptionsValue } from '@/filters'
import assessDialog from '../assessDialog'
import noticeDialog from '../noticeDialog'
import { parseTime } from '@/utils/index'
import followModal from './followModal/index'
import transferDialog from './transferDialog'
import { getDict } from '@/utils/index'
export default {
  components: {
    teacherInput,
    assessDialog,
    followModal,
    noticeDialog,
    transferDialog
  },
  data() {
    return {
      COOPERATION_TYPE: [], // 合作状态
      ASSESS_TYPES: [...ASSESS_TYPES, { label: '无需评估', value: 4 }], // 评估状态
      ASSESS_RESULT_All,
      ASSESS_RESULT_OTHER,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'photoUrl', 'domains', 'experience', 'assessResult', 'shareStatus'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherId', label: 'IP编号', type: 'text' },
          { prop: 'teacherName', label: 'IP姓名', type: 'text', render: (row) => {
            return row.teacherName || '--'
          } },
          { prop: 'photoUrl', label: 'IP照片', type: 'slot' },
          { prop: 'domains', label: '所属领域', type: 'text', 'show-overflow-tooltip': true, slotFn: (row) => row.domains?.map(i => i.domainName)?.join('、') },
          { prop: 'experience', label: 'IP资质', type: 'slot', width: 160 },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            width: 140,
            align: 'center'
          }, {
            prop: 'expiresDate',
            label: '评估截止时间',
            type: 'text',
            width: 140,
            align: 'center',
            slotFn: (row) => parseTime(new Date(row.expiresDate).getTime(), '{y}-{m}-{d} {h}:{i}') || '—'
          },
          {
            prop: 'assessStatus',
            label: '评估状态',
            type: 'text',
            align: 'center',
            slotFn: (row) => getOptionsValue(row.assessStatus, this.ASSESS_TYPES) || '—'
          },
          {
            prop: 'assessResult',
            label: '评估结果',
            type: 'slot',
            align: 'center',
            sortable: 'custom'
          },
          {
            prop: 'sustainNum',
            label: '支持做次数',
            type: 'text',
            align: 'center'
          },
          {
            prop: 'cooperateStatus',
            label: '合作状态',
            align: 'center',
            type: 'text',
            slotFn: (row) => getOptionsValue(row.cooperateStatus, this.COOPERATION_TYPE)
          },
          {
            prop: 'shareStatus',
            label: '是否共享',
            type: 'slot',
            width: 120,
            align: 'center'
          },
          { prop: 'action', label: '操作', width: 210, type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      dateTimeValue: [],
      createTimeValue: [],
      currentTime: '',
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
      search: {
        teacherName: '', // IP姓名
        domainId: '', // 所属领域
        serviceEnterprise: '', // 服务企业
        assessStatus: '', // 评估状态
        cooperateStatus: '', // 合作状态
        searchDateEnd: '',
        searchDateStart: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      },
      loading: false,
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      params: {},
      canTransfer: false
    }
  },
  computed: {
    ...mapGetters(['industryOption', 'areaOption']),
    hasMore() {
      return (
        this.permsList.includes('web:teachFileList:schedule') ||
        // this.permsList.includes('web:teachFileList:authorize') ||
        this.permsList.includes('web:teachFileList:demand') ||
        this.permsList.includes('web:teachFileList:plan') ||
        this.permsList.includes('web:teachFileList:case') ||
        this.permsList.includes('web:teachFileList:courseware') ||
        this.permsList.includes('web:teachFileList:material') ||
        this.permsList.includes('web:teachFileList:transfer')
      )
    }
  },
  activated() {
    this.init()
  },
  created() {
    this.getSharingSettingOrgList()
  },
  mounted() {
    this.init()
  },
  methods: {
    async handleShareStatusChange(e, row) {
      await updateShare({
        teacherId: row.teacherId,
        share: !!e
      })
      this.$message.success('操作成功')
      row.share = !!e
    },

    async getSharingSettingOrgList() {
      const res = await getSharingSettingOrgByType({
        organizationId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        sharingSettingType: 2
      })
      this.canTransfer = res.data.length > 0
    },

    sortChange({ prop, order }) {
      if (prop === 'assessResult') {
        this.search.isOrderByOverallRatingAsc = order === 'ascending'
        this.getList()
      }
    },
    // 获取领域数据
    async getAreaList() {
      this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
      await this.$store.dispatch('option/getAreaOption')
    },
    openGroup() {
      this.$refs.group.open()
    },
    openNotice() {
      this.$refs.noticeDialog.open()
    },
    goAssessDetail(row) {
      this.$router.push(`/teacherCenter/teacherAssessment/detail/${row.teacherId}`)
    },
    async  handleExport() {
      const { data } = await getTeacherListExport(this.params)
      window.open(data)
    },
    getOptionsValue,
    init() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        const {
          createTimeBegin = '',
          assessResult = '',
          createTimeEnd = '',
          assessFlag = '',
          assessStatus = '',
          createUserName = ''
        } = this.$route.query
        this.createTimeValue = [createTimeBegin, createTimeEnd]
        this.search = {
          teacherName: '', // IP姓名
          domainId: '', // 所属领域
          serviceEnterprise: '', // 服务企业
          assessStatus: assessStatus ? +assessStatus : '',
          cooperateStatus: assessResult ? +assessResult : '',
          searchDateEnd: '',
          searchDateStart: '',
          createTimeBegin,
          createTimeEnd,
          assessResult: '',
          recommendName: '',
          createUserName,
          assessFlag: assessFlag ? +assessFlag : ''
        }
        const { teacherId, teacherName } = this.$route.query
        if (teacherName && teacherId) {
          this.search.teacherName = teacherName
          this.search.teacherId = teacherId
          this.$refs.teacherInput.remoteMethod(teacherName)
        }
      }
      this.getAreaList()
      this.getList()
    },
    // 搜索查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    handleDateChange(val) {
      if (val && val.length) {
        this.search.searchDateStart = val[0]
        this.search.searchDateEnd = val[1]
      } else {
        this.search.searchDateStart = undefined
        this.search.searchDateEnd = undefined
      }
      this.searchFn()
    },
    handleCreateChange(val) {
      if (val && val.length) {
        this.search.createTimeBegin = val[0]
        this.search.createTimeEnd = val[1]
      } else {
        this.search.createTimeBegin = undefined
        this.search.createTimeEnd = undefined
      }
      this.searchFn()
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
    handleSelectionChange() {},
    // 点击跳转详情页面
    gotoDetail(row) {
      this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}`)
    },
    // 跳转新增IP页面
    gotoAdd() {
      this.$router.push(`/teacherCenter/teachFile/add`)
    },
    goModifyLink() {
      this.$router.push('/teacherCenter/teachFile/teacherNameModify')
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        serviceEnterprise: this.search.serviceEnterprise, // 服务企业
        teacherName: this.search.teacherName, // IP姓名
        domainId: this.search.domainId, // 所属领域编码
        cooperateStatus: this.search.cooperateStatus, // 合作状态
        assessStatus: this.search.assessStatus, // 评估状态
        searchDateStart: this.search.searchDateStart,
        searchDateEnd: this.search.searchDateEnd,
        createTimeBegin: this.search.createTimeBegin,
        createTimeEnd: this.search.createTimeEnd,
        assessResult: this.search.assessResult,
        recommendName: this.search.recommendName,
        createUserName: this.search.createUserName,
        assessFlag: this.search.assessFlag,
        isOrderByOverallRatingAsc: this.search.isOrderByOverallRatingAsc
      }
      this.params = params
      getTeacherList(params)
        .then((res) => {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清空筛选数据
    clear() {
      this.search = {
        teacherName: '', // IP姓名
        domainId: '', // 所属领域
        serviceEnterprise: '', // 服务企业
        assessStatus: '', // 评估状态
        cooperateStatus: '', // 合作状态
        searchDateEnd: '',
        searchDateStart: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      this.dateTimeValue = []
      this.createTimeValue = []
      this.searchFn()
    },
    // 点击跳转编辑页面
    gotoEdit(row) {
      this.$router.push(`/teacherCenter/teachFile/edit/${row.teacherId}`)
    },
    // 点击跳转排班表
    gotoSchedule(row) {
      this.$router.push({
        path: `/teacherCenter/schedule`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName,
          tab: 'second'
        }
      })
    },
    // 点击跳转评估详情
    gotoEvaluate(row) {
      // this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}`)
      this.$router.push({
        path: `/teacherCenter/teachFile/detail/${row.teacherId}`
      })
    },
    // 点击跳转授权页面
    gotoAuthorize(row) {
      this.$router.push({
        path: `/teacherCenter/teacherAuthorization/detail/${row.teacherId}`
      })
    },
    gotoDemand(row) {
      this.$router.push({
        path: `/productManage/demandManage/index`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName
        }
      })
    },
    gotoMaterial(row) {
      this.$router.push({
        path: `/productManage/courseDoc`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName
        }
      })
    },
    // 点击跳转计划页面
    gotoPlan(row) {
      this.$router.push({
        path: `/productManage/planManage/index`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName
        }
      })
    },
    // 点击跳转案例页面
    gotoCase(row) {
      this.$router.push({
        path: `/productManage/caseManage/index`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName
        }
      })
    },
    // 点击跳转课件页面
    gotoCourseware(row) {
      this.$router.push({
        path: `/productManage/courseManage/index`,
        query: {
          teacherId: row.teacherId
        }
      })
    },
    // 转让
    gotoTransfer(row) {
      this.$refs.transferDialog.open(row)
    },
    openDialog() {
      this.$refs.assessDialog.open()
    },
    openFollow(row) {
      this.$refs.followModal.open(row)
    },
    // 点击跳转订单页面
    gotoOrder(row) {},
    // 显示所属领域
    showDomains(row) {
      let str = ''
      row.map((v) => {
        str += v.domainName + ' '
      })
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap1 ::v-deep{
  // height: 100%;
  height: calc(100vh - 164px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 10px;
  box-sizing: border-box;
  .search {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .form-container{
      display: flex;
      flex-wrap: wrap;
      .form-item{
        flex: 1;
        .el-form-item__content{
           display: flex;
        }
      }
    }
    .search_box{
      display: flex;
      height: 33px;
      width: 100%;
      .search_right {
        margin-left: 20px;
        flex: 1 0 0;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }
    }

  }
  .tablePage {
    height: calc(100vh - 380px);
  }
}
.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
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
</style>
