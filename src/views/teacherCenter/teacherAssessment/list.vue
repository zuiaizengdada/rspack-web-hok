<template>
  <div class="page_wrap hoc-main-height">
    <MCard class="hoc-main-min-height">
      <!-- 师资评估 -->
      <div class="m-l-20 m-r-20 search">
        <el-form :inline="true" :model="search" size="small">
          <el-form-item label="IP姓名">
            <teacherSelect
              v-model="search.teacherId"
              @clear="searchFn"
              @select="searchFn"
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
          <el-form-item label="评估状态">
            <el-select
              v-model="search.assessStatus"
              clearable
              @change="assessStatusChange"
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
              @change="assessResultChange"
            >
              <el-option
                v-for="(item, index) in ASSESS_RESULT"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最终综合分">
            <el-input
              v-model.number="search.beginRating"
              :min="0"
              :max="100"
              type="number"
              style="width: 100px"
              @input="(e) => delNoNumber(e, 'beginRating')"
            />
            <span> - </span>

            <el-input
              v-model.number="search.endRating"
              :min="0"
              :max="100"
              type="number"
              style="width: 100px"
              @input="(e) => delNoNumber(e, 'endRating')"
            />
            <!-- <el-input-number
              v-model="search.beginRating"
              :precision="1"
              :step="1"
              style="width: 102px"
              controls-position="right"
              :min="0"
              :max="100"
              @change="handleBeginRating"
            />
            <span> - </span>
            <el-input-number
              v-model="search.endRating"
              :precision="1"
              :step="1"
              style="width: 102px"
              controls-position="right"
              :min="search.beginRating"
              :max="100"
              @change="handleEndRating"
            /> -->
          </el-form-item>
          <el-form-item label="评估截止日期">
            <el-date-picker
              v-model="dateTimeValue"
              type="daterange"
              style="width: 228px"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="handleDateChange"
              @blur="currentTime = ''"
            />
          </el-form-item>
          <el-form-item label="创建人">
            <el-input
              v-model="search.createUserName"
              placeholder="请输入IP推荐人"
              clearable
            />
          </el-form-item>
          <el-form-item label="评估参与">
            <el-select v-model="search.assessByMe" clearable @change="searchFn">
              <el-option
                v-for="(item, index) in ASSESS_BY_TYPE"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="评估人">
            <!-- <el-input v-model="search.assessorSysUser" placeholder="请输入评估人" clearable /> -->
            <m-select
              v-model="search.assessorSysUser"
              placeholder="请输入评估人"
              :request="userNoPage"
              :param="{ value: 'userId', label: 'nickName' }"
            />
          </el-form-item>
          <el-form-item label="支持做的百分比大于">
            <el-input-number
              v-model="search.percentageRatio"
              placeholder="请输入百分比"
              controls-position="right"
              :min="0"
              style="width: 102px"
              :max="100"
              :step="1"
              :precision="0"
              clearable
            />
            %
          </el-form-item>
          <el-form-item label="支持做的次数">
            <el-input-number
              v-model="search.sustainNum"
              placeholder="请输入支持做的次数"
              controls-position="right"
              style="width: 120px"
              :min="1"
              :max="100"
              :step="1"
              :precision="0"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              @click="searchFn"
            >
              查询
            </el-button>
            <el-button size="small" :loading="loading" @click="clear()">
              重置
            </el-button>
          </el-form-item>
          <span style="float: right">
            <el-button
              v-permission="['web:teachAssessment:export', permsList]"
              size="small"
              @click="exportData"
            >
              导出
            </el-button>
            <el-button
              v-permission="['web:teachAssessment:notice', permsList]"
              size="small"
              @click="openNotice"
            >
              评估结果通知
            </el-button>
          </span>
        </el-form>
      </div>
      <div class="tablePage">
        <el-table
          ref="MPageLayout"
          class="el_table"
          type="tablePage"
          :loading="loading"
          :data="config.tableData"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
          height="calc(100% - 54px)"
        >
          <el-table-column
            label="IP姓名"
            prop="teacherName"
            fixed="left"
            width="180"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="text" @click="goLink(row)">{{
                row.teacherName
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="所属领域"
            width="120"
            prop="domainNameList"
            align="center"
          >
            <template slot-scope="{ row }">
              <span v-if="row.domainNameList.length">{{ row.domainNameList.join() }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="评估维度"
            prop="evaluationDimension"
            width="180"
            align="center"
            class-name="item-column"
          >
            <template slot-scope="{ row }">
              <div
                v-for="(item, index) in row.assessDimensionDatas"
                :key="index"
                class="item"
              >
                {{ item.evaluationDimension }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="评分"
            prop="point"
            width="180"
            align="center"
            class-name="item-column"
          >
            <template slot-scope="{ row }">
              <div
                v-for="(item, index) in row.assessDimensionDatas"
                :key="index"
                class="item"
              >
                {{ item.point | filterSum(row) }}
              </div>
              <div
                v-if="
                  !(row.assessDimensionDatas && row.assessDimensionDatas.length)
                "
              >
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="最终综合分"
            width="140"
            prop="overallRating"
            align="center"
          >
            <template slot-scope="{ row }">
              {{ row.overallRating | filterSum(row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="评估截止时间"
            width="140"
            prop="expiresTime"
            align="center"
          >
            <template slot-scope="{ row }">
              {{
                new Date(row.expiresTime).getTime()
                  | parseTime('{y}-{m}-{d} {h}:{i}')
              }}
            </template>
          </el-table-column>
          <el-table-column label="评估状态" prop="assessStatus" align="center">
            <template slot-scope="{ row }">
              {{ row.assessStatus | getOptionsValue(ASSESS_TYPES) }}
            </template>
          </el-table-column>
          <el-table-column
            label="评估结果"
            width="120"
            prop="assessResult"
            align="center"
          >
            <template slot="header">
              <span>评估结果</span>
            </template>
            <template slot-scope="{ row }">
              <span v-if="row.assessStatus === 3">{{
                row.assessResult | getOptionsValue(ASSESS_RESULT)
              }}</span>
              <span v-else>--</span>
              <!-- <template v-if="row.overallRating && row.overallRating >= 8">有潜力</template>
              <template v-else-if="row.overallRating && row.overallRating >= 7">可尝试</template>
              <template v-else-if="row.overallRating && row.overallRating < 7">不推荐</template> -->
            </template>
          </el-table-column>
          <el-table-column
            label="支持做次数"
            width="120"
            prop="sustainNum"
            align="center"
          />
          <el-table-column
            label="不做次数"
            width="120"
            prop="noSustainNum"
            align="center"
          />
          <el-table-column
            label="支持做的百分比"
            width="120"
            prop="percentage"
            align="center"
          >
            <template slot-scope="{ row }"> {{ row.percentage }}% </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="180"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button
                v-if="!row.canAssessFlag"
                v-permission="['web:teachAssessmentList:detail', permsList]"
                type="text"
                @click="gotoDetail(row)"
              >详情</el-button>
              <el-button
                v-else
                size="small"
                type="primary"
                @click="gotoAssess(row)"
              >评估</el-button>
              <el-button
                v-if="row.canUpdated == 1"
                v-permission="['web:teachAssessmentList:editAssess', permsList]"
                type="text"
                @click="editAssess(row)"
              >修改评估</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="m-t-20"
          style="float: right"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </MCard>
    <assessmentNotice ref="assessmentNotice" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import teacherSelect from '../components/teacherSelect/index'
import { ASSESS_TYPES, ASSESS_RESULT, ASSESS_BY_TYPE } from '../enum'
import { assessPage, teacherAssessExport } from '@/api/tearchCenter'
import moment from 'moment'
import assessmentNotice from './components/assessmentNotice'
import { userNoPage } from '@/api/addressBookApi'
export default {
  filters: {
    filterSum(val, row) {
      if (row.canAssessFlag) {
        return '*'
      } else {
        if (
          typeof overallRating === 'object' ||
          row.overallRating === 0 ||
          row.assessStatus === 1 ||
          typeof val === 'object'
        ) {
          return '-'
        } else {
          return val / 100
        }
      }
    },
    filterUserNum(val, row) {
      if (row.canAssessFlag) {
        return '*'
      } else {
        if (
          typeof overallRating === 'object' ||
          row.overallRating === 0 ||
          row.assessStatus === 1
        ) {
          return '-'
        } else {
          return val
        }
      }
    }
  },

  components: {
    teacherSelect,
    assessmentNotice
  },
  data() {
    return {
      userNoPage,
      ASSESS_TYPES,
      ASSESS_RESULT,
      ASSESS_BY_TYPE,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'result'],
      config: {
        tableData: [],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      dateTimeValue: [],
      loading: false,
      search: {
        teacherId: '',
        beginRating: '',
        endRating: '',
        assessStatus: 2, // 1暂无建议，2有潜力，3可尝试，4不建议
        assessResult: '', // 1未评估，2评估中，3已评估
        strengthSort: '', // 老师实力排序,1升序 2降序
        courseContentSort: '', // 课程内容排序,1升序 2降序
        courseDeductionSort: '', // 课程演绎排序,1升序 2降序
        earningPotentialSort: '', // 变现潜力排序,1升序 2降序
        overallRatingSort: '', // 综合评分排序，1升序 2降序
        beginTime: '',
        endTime: '',
        assessByMe: 1,
        createUserName: '',
        assessorSysUser: '', // 评估人
        percentageRatio: '', // 百分比
        sustainNum: undefined // 支持做的次数
      },
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
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['areaOption'])
  },
  created() {
    this.search.beginTime = moment().format('YYYY-MM-DD')
    this.search.endTime = moment().format('YYYY-MM-DD')
    this.dateTimeValue = [
      moment().format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    ]
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {

    delNoNumber(e, key) {
      this.search[key] = e.replace(/\D/g, '')
      if (+this.search[key] > 100) {
        this.search[key] = '100'
      }
    },
    init() {
      if (JSON.stringify(this.$route.query) !== '{}') {
        const {
          assessResult = '',
          beginRating = '',
          endRating = '',
          assessStatus = '',
          beginTime = '',
          endTime = '',
          createUserName = '',
          assessorSysUser = '',
          percentageRatio = '',
          assessByMe = '',
          sustainNum = undefined
        } = this.$route.query
        this.dateTimeValue = [beginTime, endTime]
        this.search = {
          teacherId: '',
          beginRating,
          endRating,
          assessStatus: assessStatus ? +assessStatus : '',
          assessResult: assessResult ? +assessResult : '',
          strengthSort: '', // 老师实力排序,1升序 2降序
          courseContentSort: '', // 课程内容排序,1升序 2降序
          courseDeductionSort: '', // 课程演绎排序,1升序 2降序
          earningPotentialSort: '', // 变现潜力排序,1升序 2降序
          overallRatingSort: '', // 综合评分排序，1升序 2降序
          beginTime,
          endTime,
          assessByMe,
          createUserName,
          assessorSysUser,
          percentageRatio,
          sustainNum
        }
      }
      this.getList()
    },
    handleBeginRating() {
      if (this.search.beginRating === undefined) {
        this.$nextTick(() => {
          this.$set(this.search, 'beginRating', 0)
        })
      }
    },
    handleEndRating() {
      if (this.search.endRating === undefined) {
        this.$nextTick(() => {
          this.$set(this.search, 'endRating', 10)
        })
      }
    },
    openNotice() {
      this.$refs.assessmentNotice.open()
    },
    async exportData() {
      if (this.search.beginRating && !this.search.endRating) {
        this.search.endRating = '100'
      }
      if (this.search.endRating && !this.search.beginRating) {
        this.search.beginRating = '0'
      }
      const params = {
        beginRating: this.search.beginRating
          ? Math.round(this.search.beginRating * 100)
          : undefined,
        endRating: this.search.endRating
          ? Math.round(this.search.endRating * 100)
          : undefined,
        teacherId: this.search.teacherId, // 老师名称
        assessResult: this.search.assessResult, // 1暂无建议，2有潜力，3可尝试，4不建议
        assessStatus: this.search.assessStatus, // 1未评估，2评估中，3已评估
        pageIndex: this.config.currentPage, // 当前页
        pageSize: this.config.pageSize,
        imageSort: this.search.imageSort,
        strengthSort: this.search.strengthSort, // 老师实力排序,1升序 2降序
        courseContentSort: this.search.courseContentSort, // 课程内容排序,1升序 2降序
        courseDeductionSort: this.search.courseDeductionSort, // 课程演绎排序,1升序 2降序
        earningPotentialSort: this.search.earningPotentialSort, // 变现潜力排序,1升序 2降序
        overallRatingSort: this.search.overallRatingSort, // 综合评分排序，1升序 2降序
        beginTime: this.search.beginTime,
        endTime: this.search.endTime,
        assessByMe: this.search.assessByMe,
        createUserName: this.search.createUserName,
        assessorSysUser: this.search.assessorSysUser,
        percentageRatio: this.search.percentageRatio,
        sustainNum: this.search.sustainNum
      }
      const { data } = await teacherAssessExport(params)
      window.open(data)
    },
    handleDateChange(val) {
      if (val && val.length) {
        this.search.beginTime = val[0]
        this.search.endTime = val[1]
      } else {
        this.search.beginTime = undefined
        this.search.endTime = undefined
      }
      this.searchFn()
    },
    // 页码改变
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    goLink(row) {
      this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}`)
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击跳转详情页面
    gotoDetail(row) {
      this.$router.push(
        `/teacherCenter/teacherAssessment/detail/${row.teacherId}`
      )
    },
    // 点击跳转评估页面
    gotoAssess(row) {
      this.$router.push(
        `/teacherCenter/teacherAssessment/assess/${row.teacherId}`
      )
    },
    editAssess(row) {
      this.$router.push(
        `/teacherCenter/teacherAssessment/assess/${row.teacherId}?editAssess=true`
      )
    },
    // 清空触发
    clear() {
      this.search = {
        beginRating: '',
        endRating: '',
        teacherId: '',
        assessStatus: 2, // 1暂无建议，2有潜力，3可尝试，4不建议
        assessResult: '', // 1未评估，2评估中，3已评估
        imageSort: '', // IP形象排序,1升序 2降序
        strengthSort: '', // 老师实力排序,1升序 2降序
        courseContentSort: '', // 课程内容排序,1升序 2降序
        courseDeductionSort: '', // 课程演绎排序,1升序 2降序
        earningPotentialSort: '', // 变现潜力排序,1升序 2降序
        overallRatingSort: '', // 综合评分排序，1升序 2降序
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        assessByMe: 1,
        createUserName: '',
        assessorSysUser: '',
        percentageRatio: '',
        sustainNum: undefined
      }
      this.dateTimeValue = [
        moment().format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
      this.$refs.MPageLayout && this.$refs.MPageLayout.clearSort()
      this.getList()
    },
    // 获取列表
    getList() {
      this.loading = true
      this.config.tableData = []
      if (this.search.beginRating && !this.search.endRating) {
        this.search.endRating = '100'
      }
      if (this.search.endRating && !this.search.beginRating) {
        this.search.beginRating = '0'
      }
      const params = {
        beginRating: this.search.beginRating
          ? Math.round(this.search.beginRating * 100)
          : undefined,
        endRating: this.search.endRating
          ? Math.round(this.search.endRating * 100)
          : undefined,
        teacherId: this.search.teacherId, // 老师名称
        assessResult: this.search.assessResult, // 1暂无建议，2有潜力，3可尝试，4不建议
        assessStatus: this.search.assessStatus, // 1未评估，2评估中，3已评估
        pageIndex: this.config.currentPage, // 当前页
        pageSize: this.config.pageSize,
        imageSort: this.search.imageSort,
        strengthSort: this.search.strengthSort, // 老师实力排序,1升序 2降序
        courseContentSort: this.search.courseContentSort, // 课程内容排序,1升序 2降序
        courseDeductionSort: this.search.courseDeductionSort, // 课程演绎排序,1升序 2降序
        earningPotentialSort: this.search.earningPotentialSort, // 变现潜力排序,1升序 2降序
        overallRatingSort: this.search.overallRatingSort, // 综合评分排序，1升序 2降序
        beginTime: this.search.beginTime,
        endTime: this.search.endTime,
        assessByMe: this.search.assessByMe,
        createUserName: this.search.createUserName,
        assessorSysUser: this.search.assessorSysUser,
        percentageRatio: this.search.percentageRatio,
        sustainNum: this.search.sustainNum,
        domainId: this.search.domainId
      }
      const items = [
        [
          {
            name: 'IP形象',
            value: 40
          },
          {
            name: '实力背景',
            value: 20
          },
          {
            name: '课程内容',
            value: 16
          }
        ],
        [
          {
            name: 'IP形象',
            value: 40
          },
          {
            name: '实力背景',
            value: 20
          },
          {
            name: '课程内容',
            value: 16
          },
          {
            name: '变现潜力',
            value: 10
          }
        ]
      ]
      assessPage(params)
        .then(res => {
          this.config.tableData = res.data.items.map((i, index) => {
            return {
              ...i,
              items: items[index]
            }
          })
          this.config.total = res.data.total
          this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 评估状态改变
    assessStatusChange(val) {
      this.$router.replace(
        `/teacherCenter/teacherAssessment/list?assessStatus=${this.search.assessStatus}&assessResult=${this.search.assessResult}`
      )
      this.searchFn()
    },
    // 评估结果改变
    assessResultChange(val) {
      this.$router.replace(
        `/teacherCenter/teacherAssessment/list?assessStatus=${this.search.assessStatus}&assessResult=${this.search.assessResult}`
      )
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap ::v-deep {
  // background: #fff;
  box-sizing: border-box;
  .card {
    display: flex;
    flex-direction: column;
  }
  .search {
    border-bottom: 1px solid #e7e7e7;
  }
  .item-column {
    padding: 0;
    .cell {
      padding-left: 0px;
      padding-right: 0px;
      .item {
        padding: 10px;
        border-bottom: 1px solid #dfe6ec;
        &:last-child {
          border: 0px;
        }
      }
    }
  }

  .page_wrap_footer {
    padding: 10px 10px 0 10px;
    text-align: right;
  }
  .tablePage {
    flex: 1;
    padding: 0 20px;
  }
}
</style>
