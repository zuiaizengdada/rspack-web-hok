<template>
  <div class="page_wrap">
    <!-- 问卷列表 -->
    <div class="search_header">
      <div>
        <el-select
          v-model="search.status"
          size="small"
          clearable
          @change="init"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-input
          v-model="search.name"
          size="small"
          class="w-200 m-l-10 m-r-10"
          placeholder="请输入问卷名称"
          clearable
          @keyup.enter.native="init"
          @clear="init"
        />
        <el-button size="small" type="primary" @click="init">搜索</el-button>
      </div>
      <div>
        <el-button
          class="btn_primary"
          plain
          size="small"
          @click="addQuestionnaire"
        >新增问卷</el-button>
      </div>
    </div>
    <div class="table_model m-t-20">
      <el-table v-loading="loading" :data="list" border class="m-t-20">
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.status === 1"
              type="text"
              @click="openShare(row)"
            >分享</el-button>
            <el-button type="text" @click="gotoDetail(row)">数据</el-button>
          </template>
        </el-table-column>
        <el-table-column label="问卷ID" prop="id">
          <template slot-scope="{ row }">
            <span class="a_link" @click="openDetailDialog(row)">{{
              row.id
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="问卷名称"
          prop="questionnaireName"
          show-overflow-tooltip
        />
        <el-table-column label="关联专栏" prop="livePeriodCount">
          <template slot-scope="{ row }">
            <span class="a_link" @click="openQuestionnair(row)">
              {{ row.livePeriodCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收集表单数" prop="formNum" />
        <el-table-column label="使用状态" prop="status">
          <template slot-scope="{ row }">
            <div class="table_status">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="editStatus(row)"
              />
              <span class="m-l-10">{{
                { 1: '启用', 0: '禁用' }[row.status]
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="有效期" prop="validType">
          <template slot-scope="{ row }">
            <template v-if="row.validType === 1"> 长期有效 </template>
            <template v-if="row.validType === 2">
              {{ row.startTime | parseTime }} 至 {{ row.endTime | parseTime }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="{ row }">
            {{ row.createTime | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="最新收集时间" prop="latestCollectTime">
          <template slot-scope="{ row }">
            {{ row.latestCollectTime | parseTime }}
          </template>
        </el-table-column>
      </el-table>
      <div class="page_pagination">
        <el-pagination
          class="m-t-10"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 分享弹框 -->
    <AppDialog
      v-model="shareModel.visible"
      height="400px"
      width="600px"
      title="分享"
    >
      <div class="shareModel">
        <div class="modelFormView">
          <span>问卷名称:</span>
          <span>{{ shareModel.name }}</span>
        </div>
        <div class="modelFormView">
          <el-input v-model="shareModel.url" disabled size="small" />
          <el-button
            v-clipboard:copy="shareModel.url"
            v-clipboard:success="clipboardSuccess"
            class="m-l-10"
            size="small"
            type="primary"
            icon="el-icon-document"
          >复制链接</el-button>
        </div>
        <div>
          <AppQrcode :src="shareModel.url" />
        </div>
      </div>
      <div slot="footer" />
    </AppDialog>

    <!-- 查看问卷详情弹框 -->
    <AppDialog
      v-model="detailDialog.visible"
      height="300px"
      width="300px"
      title="详情"
    >
      <div v-if="detailDialog.visible" class="detailModel">
        <div class="myQrcode">
          <AppQrcode :src="detailDialog.url" />
        </div>
        <div class="tipsTitle">请使用手机扫一扫查看详情</div>
      </div>
      <div slot="footer" />
    </AppDialog>

    <!-- 问卷关联的专栏弹框 -->
    <AppDialog
      v-model="dialog.visible"
      width="600px"
      height="auto"
      :title="dialog.title"
    >
      <div v-loading="dialog.loading" class="p-20">
        <el-table :data="dialog.list" border max-height="400px">
          <el-table-column label="专栏名称" prop="contentName" />
          <el-table-column label="专栏期数" prop="periodNum">
            <template slot-scope="{ row }"> {{ row.periodNum }}期 </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import AppDialog from '@/components/AppDialog'
import AppQrcode from '@/components/AppQrcode'
import { getQuestionnaireAnswerPage } from '@/api/tools/questionnaire'
import {
  getQuestionnaireList,
  // addQuestionnaire,
  editQuestionnaire
} from '@/api/tools/questionnaire'
export default {
  components: {
    AppDialog,
    AppQrcode
  },
  directives: {
    clipboard
  },
  data() {
    return {
      search: {
        status: '',
        name: ''
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      shareModel: {
        visible: false,
        name: '',
        url: ''
      },
      loading: false,
      dialog: {
        visible: false,
        title: '关联专栏',
        questionnaireId: '',
        questionnaireName: '',
        loading: false,
        list: [],
        current: 1,
        pageSize: 10,
        total: 0
      },
      detailDialog: {
        visible: false,
        title: '问卷详情',
        name: '',
        url: ''
      }
    }
  },
  mounted() {},
  created() {
    this.init()
  },
  methods: {
    // 当前页码改变
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getList()
    },
    openShare(row) {
      console.log(row)
      if (row.validType === 1 || !row.startTime) {
        this.shareModel.url = process.env.VUE_APP_QUESTIONNAIRE_URL + row.id
        this.shareModel.visible = true
      } else if (row.startTime > Date.now()) {
        this.$delModal({
          tips: '问卷时间还未开始,确定要分享?',
          success: () => {
            this.shareModel.url = process.env.VUE_APP_QUESTIONNAIRE_URL + row.id
            this.shareModel.visible = true
          }
        })
      } else if (row.endTime < Date.now()) {
        this.$delModal({
          tips: '问卷时间已经结束,确定要分享?',
          success: () => {
            this.shareModel.url = process.env.VUE_APP_QUESTIONNAIRE_URL + row.id
            this.shareModel.visible = true
          }
        })
      } else {
        this.shareModel.url = process.env.VUE_APP_QUESTIONNAIRE_URL + row.id
        this.shareModel.visible = true
      }
      this.shareModel.name = row.questionnaireName
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 点击新增问卷
    addQuestionnaire() {
      // const routeLink = this.$router.resolve({
      //   path: '/formGenerator'
      // })
      // window.open(routeLink.href, '_blank')
      this.$router.push({ path: `/formGenerator` })
    },
    // 点击数据
    gotoDetail(row) {
      console.log(row)
      this.$router.push({
        path: `detail?name=${row.questionnaireName}&id=${row.id}`
      })
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        status: this.search.status,
        size: this.pageSize,
        current: this.currentPage,
        questionnaireName: this.search.name
      }
      getQuestionnaireList(params)
        .then(res => {
          console.log(res, '获取的列表数据')
          this.list = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 数据初始化
    init() {
      this.currentPage = 1
      this.list = []
      this.getList()
    },
    // 问卷启用/禁用
    editStatus(row) {
      console.log(row)
      this.loading = true
      const data = {
        id: row.id,
        status: row.status
      }
      editQuestionnaire(data)
        .then(res => {
          this.getList()
        })
        .catch(() => {
          this.getList()
        })
    },
    // 获取问卷关联的专栏
    getQuestionnaireAnswerPage() {
      this.dialog.loading = true
      getQuestionnaireAnswerPage(this.dialog.questionnaireId)
        .then(res => {
          this.dialog.list = res.data
          this.dialog.loading = false
        })
        .catch(() => {
          this.dialog.loading = true
        })
    },
    openQuestionnair(row) {
      console.log(row)
      this.dialog = {
        visible: true,
        title: `${row.questionnaireName}关联专栏`,
        questionnaireId: row.id,
        questionnaireName: row.questionnaireName,
        loading: false,
        list: [],
        current: 1,
        pageSize: 10,
        total: 0
      }
      this.getQuestionnaireAnswerPage()
    },
    // 点击问卷id打开查看详情的二维码
    openDetailDialog(row) {
      this.detailDialog = {
        url: process.env.VUE_APP_QUESTIONNAIRE_URL + row.id,
        name: row.questionnaireName,
        visible: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  background: #fff;
  padding: 10px;
  .search_header {
    display: flex;
    justify-content: space-between;
  }
  .page_pagination {
    display: flex;
    justify-content: flex-end;
  }
}
.table_status {
  display: flex;
  align-items: center;
  // justify-content: center;
}
.shareModel {
  padding: 20px;
  .modelFormView {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
.btn_primary {
  background: #fff;
  border-color: #409eff;
  color: #409eff;
}
.detailModel {
  padding: 20px;
  text-align: center;
  .modelFormView {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .myQrcode {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tipsTitle {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
