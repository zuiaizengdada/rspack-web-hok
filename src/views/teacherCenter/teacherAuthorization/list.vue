<template>
  <div class="page_wrap hoc-main-height">
    <MCard>
      <div class="search m-l-20 m-r-20">
        <el-form :inline="true" :model="search" size="small">
          <el-form-item label="IP姓名">
            <teacherSelect
              v-model="search.teacherId"
              @clear="searchFn()"
              @select="searchFn"
            />
          </el-form-item>
          <el-form-item label="合作状态">
            <el-select
              v-model="search.cooperateStatus"
              clearable
              @change="searchFn"
              @clear="searchFn"
            >
              <el-option
                v-for="item in COOPERATION_TYPE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchFn()">查询</el-button>
            <el-button @click="clear()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 师资授权 -->
      <div class="tableModel">
        <MPageLayout
          ref="MPageLayout"
          type="tablePage"
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
        >
          <template slot="action" slot-scope="{ row }">
            <el-button
              v-permission="['web:teachAuthorList:detail', permsList]"
              type="text"
              @click="gotoDetail(row)"
            >详情</el-button>
            <el-button
              v-permission="['web:teachAuthorList:edit', permsList]"
              type="text"
              @click="gotoEdit(row)"
            >编辑</el-button>
          </template>
          <template slot="accountAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.accountAuthorization ? 'success' : 'error'"
            />
            {{ row.accountAuthorization ? '已上传' : '未上传' }}
          </template>
          <template slot="companyAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.companyAuthorization ? 'success' : 'error'"
            />
            {{ row.companyAuthorization ? '已上传' : '未上传' }}
          </template>
          <template slot="platformAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.platformAuthorization ? 'success' : 'error'"
            />
            {{ row.platformAuthorization ? '已上传' : '未上传' }}
          </template>
          <template slot="portraitAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.portraitAuthorization ? 'success' : 'error'"
            />
            {{ row.portraitAuthorization ? '已上传' : '未上传' }}
          </template>
          <template slot="idCardAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.idCardAuthorization ? 'success' : 'error'"
            />
            {{ row.idCardAuthorization ? '已上传' : '未上传' }}
          </template>
          <template slot="courseCopyright" slot-scope="{ row }">
            <svg-icon :icon-class="row.courseCopyright ? 'success' : 'error'" />
            {{ row.courseCopyright ? '已上传' : '未上传' }}
          </template>
          <template slot="otherAuthorization" slot-scope="{ row }">
            <svg-icon
              :icon-class="row.otherAuthorization ? 'success' : 'error'"
            />
            {{ row.otherAuthorization ? '已上传' : '未上传' }}
          </template>
        </MPageLayout>
      </div>
    </MCard>
  </div>
</template>

<script>
import teacherSelect from '../components/teacherSelect/index'
import { getAuthorizePage } from '@/api/tearchCenter'
import { getDict } from '@/utils/index'
import { getOptionsValue } from '@/filters'
export default {
  components: {
    teacherSelect
  },
  data() {
    return {
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'accountAuthorization',
        'companyAuthorization',
        'platformAuthorization',
        'portraitAuthorization',
        'idCardAuthorization',
        'courseCopyright',
        'otherAuthorization'
      ],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'teacherName',
            label: 'IP姓名',
            type: 'text',
            align: 'center'
          },
          {
            prop: 'cooperateStatus',
            label: '合作状态',
            slotFn: row =>
              getOptionsValue(row.cooperateStatus, this.COOPERATION_TYPE),
            type: 'text',
            align: 'center'
          },
          {
            prop: 'accountAuthorization',
            label: '账号授权书',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'companyAuthorization',
            label: '公司授权书',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'platformAuthorization',
            width: 160,
            label: '平台身份验证信息',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'portraitAuthorization',
            label: '肖像权授权书',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'idCardAuthorization',
            label: '身份证正反面',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'courseCopyright',
            label: '课程版权',
            type: 'slot',
            align: 'center'
          },
          {
            prop: 'otherAuthorization',
            label: '其他授权',
            type: 'slot',
            align: 'center'
          },
          { prop: 'action', label: '操作', type: 'slot', align: 'center' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      COOPERATION_TYPE: [],
      search: {
        teacherId: '',
        cooperateStatus: 1
      },
      loading: false,
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  activated() {
    this.getList()
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
    this.getList()
  },
  methods: {
    // 搜索触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
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
      this.$router.push(
        `/teacherCenter/teacherAuthorization/detail/${row.teacherId}`
      )
    },
    // 点击跳转编辑页面
    gotoEdit(row) {
      this.$router.push(
        `/teacherCenter/teacherAuthorization/edit/${row.teacherId}`
      )
    },
    // 清空触发
    clear() {
      this.search = {
        teacherId: '',
        cooperateStatus: 1
      }
      this.searchFn()
    },
    // 获取列表
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        teacherId: this.search.teacherId,
        cooperateStatus: this.search.cooperateStatus
      }
      getAuthorizePage(params)
        .then(res => {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  .search {
    border-bottom: 1px solid #e7e7e7;
  }
  .tableModel {
    height: calc(100% - 51px);
  }
}
.tips {
  margin-left: 4px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}
</style>
