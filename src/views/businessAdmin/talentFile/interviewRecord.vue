<template>
  <MCard>
    <div class="registration">历史面试记录</div>
    <div class="interview-history">
      <div style="width: 100%">
        <el-card
          v-for="(item, index) in list"
          :key="index"
          class="box-card"
          shadow="never"
        >
          <el-form class="history-form" label-width="110px">
            <template v-if="item.interviewResult === 1">
              <el-form-item label="发起录用人" class="form-item">
                <div>{{ item.interviewerName }}</div>
              </el-form-item>
              <el-form-item
                label="面试结果"
                class="form-item"
                :style="interviewResultStyleMap[item.interviewResult]"
              >
                <div>{{ interviewResultMap[item.interviewResult] }}</div>
              </el-form-item>
              <el-form-item label="试用期薪资" class="form-item">
                <div>{{ toFixedTwo(item.probationSalary) }}</div>
              </el-form-item>
              <el-form-item label="转正薪资" class="form-item">
                <span>
                  {{ toFixedTwo(item.agreedRegularSalary) }}
                </span>
                <span v-if="item.agreedRegularSalaryMax">
                  {{ '-' + toFixedTwo(item.agreedRegularSalaryMax) }}
                </span>
              </el-form-item>
              <el-form-item
                label="建议薪资"
                class="form-item"
                v-if="item.suggestedSalary"
              >
                <span>
                  {{ toFixedTwo(item.suggestedSalary) }}
                </span>
                <span v-if="item.suggestedSalaryMax">
                  {{ '-' + toFixedTwo(item.suggestedSalaryMax) }}
                </span>
              </el-form-item>
              <el-form-item label="预计入职日期" class="form-item">
                <div>{{ getTime(item.expectedEntryTime, 'YYYY-MM-DD') }}</div>
              </el-form-item>
              <el-form-item label="入职公司" class="form-item">
                <div>{{ item.entryCompanyName }}</div>
              </el-form-item>
              <el-form-item label="入职部门" class="form-item">
                <div>{{ item.entryDepartmentName }}</div>
              </el-form-item>
              <el-form-item label="岗位" class="form-item">
                <div>{{ item.positionName }}</div>
              </el-form-item>
              <el-form-item label="发起时间" class="form-item">
                <div>{{ getTime(item.evaluationTime) }}</div>
              </el-form-item>
              <el-form-item label="备注" class="form-item">
                <div>{{ item.remark }}</div>
              </el-form-item>
            </template>

            <template
              v-if="item.interviewResult === 2 || item.interviewResult === 3"
            >
              <el-form-item label="面试官" class="form-item">
                <div>{{ item.interviewerName }}</div>
              </el-form-item>
              <el-form-item label="面试建议" class="form-item">
                <div :style="interviewResultStyleMap[item.interviewResult]">
                  {{ interviewResultMap[item.interviewResult] }}
                </div>
              </el-form-item>
              <el-form-item label="评价" class="form-item">
                <p>
                  {{ item.evaluation }}
                </p>
              </el-form-item>
              <el-form-item label="评价时间" class="form-item">
                <div>
                  {{ getTime(item.evaluationTime) }}
                </div>
              </el-form-item>
            </template>
          </el-form>
        </el-card>
      </div>

      <div v-if="list.length === 0" class="no-record">暂无面试记录~</div>

      <div class="pagination">
        <el-pagination
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="config.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </MCard>
</template>

<script>
import { queryInterviewRecordPageList } from '@/api/businessAdmin/talentFile'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      list: [],
      interviewResultStyleMap: {
        1: { color: '#00b42a' },
        2: { color: '#00b42a' },
        3: { color: '#ED1B24' }
      },
      interviewResultMap: {
        1: '录用',
        2: '待定',
        3: '淘汰'
      },
      config: {
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.getInterviewRecordPageList()
  },
  methods: {
    getTime(val, type = 'YYYY-MM-DD HH:mm:ss') {
      return moment(val).format(type)
    },
    async getInterviewRecordPageList() {
      const params = {
        personnelBaseInfoId: this.$route.query.candidateId,
        page: this.config.currentPage,
        pageSize: this.config.pageSize
      }

      const res = await queryInterviewRecordPageList(params)

      this.list = res.data.items
      this.config.total = res.data.total
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getInterviewRecordPageList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getInterviewRecordPageList()
    },
    toFixedTwo(num) {
      return num ? `${num.toFixed(2)}元` : ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
  }
}
.registration {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  // border-bottom: 1px solid #e7e7e7;
}

.pagination {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.interview-history {
  flex: 1;
  height: 625px;
  overflow: auto;

  .title {
    font-size: 16px;
    margin-bottom: 30px;
  }

  .no-record {
    font-size: 16px;
    text-align: center;
    width: 100%;
  }

  .box-card {
    margin-bottom: 10px;
  }
}

.interview-history {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
</style>
