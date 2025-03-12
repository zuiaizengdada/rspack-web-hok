<template>
  <formPage title="师资评估" sub-title="评估详情" @click="$router.push('/teacherCenter/teacherAssessment/list')">
    <el-button
      v-permission="['web:teachAssessment:detailExport', permsList]"
      size="small"
      type="primary"
      style="margin:20px;"
      @click="assessExport"
    >导出</el-button>
    <div class="content">
      <el-table
        :data="detail.teacherUserAssessList"
        style="width: 100%"
        show-summary
        :summary-method="getSummaries"
        sum-text="综合分"
        :header-cell-style="{ background: '#f5f5f5' }"
        :span-method="objectSpanMethod"
      >
        <el-table-column prop="teacherName" label="IP名称">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goLink(row)">{{
              detail.teacherName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in detail.assessDimensionDatas"
          :key="item.sort"
          :prop="item.evaluationDimension"
          :label="item.evaluationDimension"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.assessDimensionDatas[index] && row.assessDimensionDatas[index].point | filterSum(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="overallRating" label="最终得分" align="center">
          <template slot-scope="{ row }">
            {{ row.overallRating | filterSum(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="comments" label="个人评语" width="240">
          <template slot-scope="{ row }">
            <template v-if="row.assessStatus === 2 && row.overallRating === null"> * </template>
            <template v-else>
              <span v-if="row.comments && row.comments.length > 40">
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content" v-html="row.comments.replace(/\n/g, '<br />')" />
                  <span>{{ row.comments.substring(0, 40) + '...' }}</span>
                </el-tooltip>
              </span>
              <span v-else>{{ row.comments }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="opinion" label="个人意见" align="center">
          <template slot-scope="{ row }">
            {{ opinion[row.opinion ] || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="评估人">
          <template slot-scope="{ row }">
            {{ row.userName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="assessStatus" label="个人状态">
          <template slot-scope="{ row }">
            {{ row.assessStatus | getOptionsValue(ASSESS_STATUS) }}
          </template>
        </el-table-column>
        <el-table-column prop="assessTime" label="评估时间" width="100">
          <template slot-scope="{ row }">
            {{ row.assessTime | parseTime }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </formPage>
</template>

<script>
import formPage from '../components/formPage'
import { assessInfoTeacherId, teacherAssessInfoExport } from '@/api/tearchCenter'
import { ASSESS_STATUS } from '../enum'
export default {
  filters: {
    filterSum(val, row) {
      if (row.canAssessFlag || (row.assessStatus === 2 && row.overallRating === null)) {
        return '*'
      } else {
        if (typeof overallRating === 'object' || row.assessStatus === 1 || row.overallRating === 0 && val !== 0) {
          return '-'
        } else {
          return val / 100
        }
      }
    }
  },
  components: {
    formPage
  },
  data() {
    return {
      ASSESS_STATUS,
      loading: false,
      detail: {
        assessStatus: 0,
        assessUserNum: 0,
        courseContent: 0,
        courseDeduction: 0,
        earningPotential: 0,
        image: 0,
        keyContent: 0,
        overallRating: 0,
        strength: 0,
        teacherId: '',
        teacherName: '',
        teacherUserAssessList: []
      },
      opinion: {
        1: '做',
        2: '不做'
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.getTearchDetail()
  },
  methods: {
    // 前端计算综合分
    getSummaries() {
      const sums = ['综合分']
      const numList = this.detail?.assessDimensionDatas?.map(i => i.point) ?? []
      numList.push(this.detail.overallRating)
      numList.forEach(i => {
        sums.push((i !== null && i !== undefined) ? i / 100 : '-')
      })
      return sums
    },
    async assessExport() {
      const { data } = await teacherAssessInfoExport({ teacherId: this.$route.params.id })
      window.open(data)
    },
    goLink(row) {
      this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}`)
    },
    // 合并表格第一项
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.detail.teacherUserAssessList.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    dataSort(item) {
      return item.assessDimensionDatas?.sort((a, b) => a.sort - b.sort) ?? []
    },
    // 获取师资评估详情
    getTearchDetail() {
      this.loading = true
      assessInfoTeacherId(this.$route.params.id)
        .then((res) => {
          this.detail = {
            ...res.data,
            assessDimensionDatas: this.dataSort(res.data),
            teacherUserAssessList: res.data.teacherUserAssessList?.map(i => {
              const assessDimensionDatas = this.dataSort(i)
              return {
                ...i,
                assessDimensionDatas
              }
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
