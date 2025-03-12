<template>
  <AppDialog v-model="config.visible">
    <div class="userInfoStatistics">
      <!-- 学员信息统计 -->
      <div class="headerSearch">
        <div>
          <el-button size="small" type="primary" :loading="exportLoading" @click="exportExcel">导出EXCEL</el-button>
        </div>
        <div>
          <el-button size="small" class="m-r-10" @click="periodChange">
            {{ search.period.periodNum ? `${search.period.periodNum}期` : '选择期数' }}
          </el-button>
          <el-input
            v-model.trim="search.text.value"
            size="small"
            placeholder="请输入"
            class="input-with-select"
            clearable
          >
            <el-select
              slot="prepend"
              v-model="search.text.label"
              size="small"
              placeholder="请选择"
              style="width: 100px"
            >
              <el-option label="学员姓名" value="studentName" />
              <el-option label="手机号" value="studentPhone" />
            </el-select>
          </el-input>
          <el-button size="small" class="m-l-10" @click="clear">清空</el-button>
          <el-button size="small" type="primary" @click="searchFn">搜索</el-button>
        </div>
      </div>

      <div class="m-t-20">
        <el-table :data="data" style="width: 100%" border height="450px">
          <el-table-column label="期数" prop="periodNum" />
          <el-table-column label="学员姓名" prop="studentName" />
          <el-table-column label="手机号码" prop="studentPhone" />
          <el-table-column label="公司名称" prop="companyName" />
          <el-table-column label="职位" prop="positionName" />
          <el-table-column label="行业" prop="industryName" />
          <el-table-column label="营业额" prop="turnoverName" />
        </el-table>
        <el-pagination
          class="m-t-20"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getQuestionnaireAnswerPage, excelQuestionnaireAnswer } from '@/api/user/member'
export default {
  components: { AppDialog },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          periodId: '',
          periodNum: '',
          goodsId: ''
        }
      }
    },
    period: {
      type: Object,
      default: () => {
        return {
          id: '',
          periodNum: ''
        }
      }
    }
  },
  data() {
    return {
      search: {
        text: { label: 'studentName', value: '' },
        period: { id: '', periodNum: '' }
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      data: [],
      exportLoading: false
    }
  },
  watch: {
    'config.visible': {
      handler(newValue) {
        if (newValue) {
          this.search.period = this.period
          this.currentPage = 1
          this.data = []
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 点击选择期数
    periodChange() {
      this.$Select({
        type: 'period',
        visible: true,
        multiple: false,
        params: { goodsId: this.config.goodsId },
        success: (res) => {
          this.search.period = res
          this.searchFn()
        }
      })
    },
    // 点击清空按钮
    clear() {
      this.search = {
        text: { label: 'studentName', value: '' },
        period: { id: '', periodNum: '' }
      }
      this.currentPage = 1
      this.getList()
    },
    // 点击搜索按钮
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 分页查询
    getList() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.pageSize,
        periodId: this.search.period.id,
        periodNum: this.search.period.periodNum,
        goodsId: this.config.goodsId,
        [this.search.text.label]: this.search.text.value
      }
      getQuestionnaireAnswerPage(params)
        .then((res) => {
          this.data = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击导出excel
    exportExcel() {
      this.exportLoading = true
      const params = {
        periodId: this.search.period.id,
        periodNum: this.search.period.periodNum,
        goodsId: this.config.goodsId,
        [this.search.text.label]: this.search.text.value
      }
      excelQuestionnaireAnswer(params)
        .then((res) => {
          this.exportLoading = false
          window.location = res.data
        })
        .catch(() => {
          this.exportLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.userInfoStatistics {
  padding: 20px;
  .headerSearch {
    display: flex;
    justify-content: space-between;
    .input-with-select {
      width: 300px;
    }
  }
}
</style>
