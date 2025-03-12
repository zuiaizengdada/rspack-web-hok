<template>
  <div class="page_Wrap">
    <!-- 问卷详情 -->
    <div>
      <el-input
        v-model="search.text.value"
        placeholder="请输入"
        class="w-350"
        clearable
        @keyup.enter.native="init"
        @clear="init"
      >
        <el-select slot="prepend" v-model="search.text.label" placeholder="请选择" class="w-150">
          <el-option label="问卷名称" value="questionnaireName" />
          <el-option label="用户昵称" value="studentName" />
          <el-option label="手机号码" value="studentPhone" />
        </el-select>
      </el-input>
      <el-button icon="el-icon-search" class="m-l-10" type="primary" @click="init">搜索</el-button>
    </div>

    <div class="m-t-20">
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="id" label="答卷ID">
          <template slot-scope="{ row }">
            <span class="a_link" @click="openUserAnswer(row)">{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="questionnaireName" label="问卷名称" />
        <el-table-column prop="studentNickName" label="用户昵称" />
        <el-table-column prop="studentPhone" label="手机号码" />
        <el-table-column prop="studentName" label="姓名" />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="{ row }">
            {{ row.createTime | parseTime }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer_pagination m-t-20">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <AppDialog v-model="dialog.visible" title="详情" height="auto">
      <div v-loading="dialog.loading" class="dialog overflowOuto">
        <div v-for="(item, index) in dialog.detail.list" :key="index">
          <div class="title">
            {{ item.name }}
          </div>
          <div class="answer">
            <template v-if="['turnoverId', 'industryId', 'positionId'].includes(item.params)">
              <template v-if="item.params === 'turnoverId'">
                {{ dialog.answer[item.model] | getOptionsDictLabel(sys_turnover) }}
              </template>
              <template v-else-if="item.params === 'industryId'">
                {{ dialog.answer[item.model] | getOptionsDictLabel(sys_industry) }}
              </template>
              <template v-else-if="item.params === 'positionId'">
                {{ dialog.answer[item.model] | getOptionsDictLabel(sys_position) }}
              </template>
            </template>
            <template v-else>
              <template v-if="typeof dialog.answer[item.model] === 'object'">
                <div v-for="(e, i) in dialog.answer[item.model]" :key="i">{{ e }}</div>
              </template>
              <template v-else>
                {{ dialog.answer[item.model] }}
              </template>
            </template>
          </div>
        </div>
      </div>
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import { getQuestionnaireAnswer, getQuestionnaireDetail } from '@/api/tools/questionnaire'
import AppDialog from '@/components/AppDialog'
import { dictType } from '@/api/option'
import axios from 'axios'
export default {
  components: {
    AppDialog
  },
  filters: {
    getOptionsDictLabel: (value, arr) => {
      // console.log(value, arr, 'value, arr')
      const obj = arr.find((v) => v.dictCode === value)
      if (obj) {
        return obj.dictLabel
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      search: {
        text: { label: 'questionnaireName', value: '' }
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialog: {
        visible: false,
        id: '',
        loading: false,
        detail: {},
        answer: {}
      },
      // 职业数据表
      sys_position: [],
      // 行业数据表
      sys_industry: [],
      // 营业额数据表
      sys_turnover: []
    }
  },
  created() {
    this.getDictType()
    this.search.text.label = 'questionnaireName'
    this.search.text.value = this.$route.query.name || ''
    this.init()
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    getQuestionnaireAnswer() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        [this.search.text.label]: this.search.text.value
      }
      getQuestionnaireAnswer(params)
        .then((res) => {
          this.list = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.currentPage = 1
      this.getQuestionnaireAnswer()
    },
    openUserAnswer(row) {
      const content = JSON.parse(row.questionnaireContext)
      this.dialog = {
        visible: true,
        loading: true,
        id: row.questionnaireId,
        detail: {},
        answer: content
      }
      this.getDictType()
        .then(() => {
          this.getQuestionnaireDetail()
        })
        .catch(() => {
          this.$message.error('获取数据字典失败')
        })
    },
    // 获取问卷详情
    getQuestionnaireDetail() {
      this.dialog.loading = true
      getQuestionnaireDetail(this.dialog.id)
        .then((res) => {
          this.dialog.detail = JSON.parse(res.data.questionnaireContext)
          this.dialog.loading = false
        })
        .catch(() => {
          this.dialog.loading = false
        })
    },
    // 获取数据字典
    getDictType() {
      return axios
        .all([dictType('sys_position'), dictType('sys_industry'), dictType('sys_turnover')])
        .then((res) => {
          this.sys_position = res[0].data
          this.sys_industry = res[1].data
          this.sys_turnover = res[2].data
          return
        })
        .catch((err) => {
          console.log(err, 'err')
        })
    }
    // option根据dictCode取dictLabel
  }
}
</script>

<style lang="scss" scoped>
.page_Wrap {
  padding: 10px;
  background: #fff;
  .footer_pagination {
    display: flex;
    justify-content: flex-end;
  }
}
.dialog {
  max-height: 590px;
  padding: 20px;
  box-sizing: border-box;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .answer {
    margin-left: 10px;
  }
}
</style>
