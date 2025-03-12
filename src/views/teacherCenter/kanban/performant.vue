<template>
  <div class="m-l-20 m-r-20 m_page">
    <MTitle>
      <span>已评估IP排行榜</span>
      <el-tooltip class="item" effect="dark" content="排行榜只展示已评估的老师" placement="top-end">
        <i class="el-icon-question m-l-10" />
      </el-tooltip>
    </MTitle>
    <AppDatepicker
      :show="[7]"
      :default="7"
      :search="search.time"
      :picker-options="pickerOptions"
      @change="timeChange"
      @blur="currentTime = ''"
    />
    <div v-loading="loading">
      <el-table
        :data="tableData"
        class="m_table"
        size="small"
        :header-cell-style="{ background: '#f5f5f5' }"
        height="390px"
      >
        <el-table-column label="排名" type="index" width="50" align="center" />
        <el-table-column prop="teacherName" label="IP姓名" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="goLink(row)">{{
              row.teacherName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="overallRating" label="综合评分" align="center">
          <template slot-scope="{ row }">
            {{ row.overallRating | filterPayerTotal }}
          </template>
        </el-table-column>
        <el-table-column prop="assessStatus" label="评估截止日期" align="center">
          <template slot-scope="{ row }">
            {{ row.expiresTime }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { teacherAssessedOverallRating } from '@/api/tearchCenter'
import { ASSESS_TYPES } from '../enum'
import AppDatepicker from '@/components/AppDatePicker'
export default {
  components: { AppDatepicker },
  data() {
    return {
      ASSESS_TYPES,
      loading: false,
      tableData: [],
      search: {
        time: {
          active: 1,
          time: ['', '']
        }
      },
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 364 * 24 * 3600 * 1000
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
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    timeChange(val) {
      this.search.time = val
      this.getList()
    },
    goLink(row) {
      const routerUrl = this.$router.resolve({
        path: `/teacherCenter/teacherAssessment/detail/${row.teacherId}`
      })
      window.open(routerUrl.href, '_blank')
    },
    // 获取列表数据
    getList() {
      this.loading = true
      teacherAssessedOverallRating({
        startDate: this.search.time.time[0] || undefined,
        endDate: this.search.time.time[1] || undefined
      })
        .then((res) => {
          this.tableData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.m_page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .MTitle{
    margin-bottom: 16px;
  }
  .m_table {
    width: 100%;
    flex: 1 0 0;
    margin-top: 16px;
  }
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
