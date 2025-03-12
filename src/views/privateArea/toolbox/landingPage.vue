<template>
  <!-- 营销通落地页 -->
  <div class="page_wrap">
    <el-table
      v-loading="loading"
      :data="tableData"
      class="m-t-20"
      :header-cell-style="{ background: '#f5f5f5' }"
    >
      <el-table-column prop="pageName" label="落地页名称" />
      <el-table-column prop="pageType" label="类型">
        <template slot-scope="{ row }">
          <!-- {{ statusOption[row.pageType] }} -->
          {{ getOptionsValueByKey('value','label',row.pageType,statusOption) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="customerName" label="二维码策略"></el-table-column> -->
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="pageStatus" label="状态">
        <template slot-scope="{ row }">
          <!-- {{ statusOption[row.pageStatus] }} -->
          <MIconStatus
            :background="getOptionsValueByKey('value','background',row.pageStatus,statusOption)"
            :color="getOptionsValueByKey('value','color', row.pageStatus,statusOption)"
            :icon-class="getOptionsValueByKey('value', 'icon', row.pageStatus, statusOption)"
            :title="getOptionsValueByKey('value','label',row.pageStatus,statusOption)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="onhandleCreateLink(row)">生成链接</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 生成链接 -->
    <Create-url-dialog
      :visible.sync="dialogFormConfig.visible"
      :landing-page-id="dialogFormConfig.landingPageId"
    />
  </div>
</template>

<script>
import CreateUrlDialog from './components/CreateUrlDialog.vue'
import { getlandingPagelist } from '@/api/privateArea/toolbox'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  components: {
    CreateUrlDialog
  },
  data() {
    return {
      dialogFormConfig: {
        visible: false,
        domainId: '',
        landingPageId: ''
      },
      tableData: [],
      loading: false,
      statusOption: [
        { label: '草稿', value: 'DRAFT', background: '#F5F5F5', color: '#777777', icon: 'audit_info' },
        { label: '已发布', value: 'RELEASED', background: '#E6F7EA', color: '#00B42A', icon: 'audit_success' },
        { label: '审核中', value: 'UNDER_REVIEW', background: '#E7F0FF', color: '#0C6FFF', icon: 'jinxingzhong' },
        { label: '驳回', value: 'REJECT', background: '#FEECEC', color: '#F53F3F', icon: 'audit_fail' },
        { label: '私域加粉', value: 'PRIVATE_FANS_ADD' }
      ]
      // statusOption: {
      //   DRAFT: '草稿',
      //   RELEASED: '已发布',
      //   UNDER_REVIEW: '审核中',
      //   REJECT: '驳回',
      //   PRIVATE_FANS_ADD: '私域加粉'
      // }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getOptionsValueByKey,
    // 获取列表数据
    getList() {
      // this.loading = true
      console.log('获取数据')
      this.loading = true
      getlandingPagelist()
        .then(res => {
          this.tableData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 编辑
    onhandleEdit(row) {
      console.log(row, '点击设为兜底')
    },
    // 点击生成链接
    onhandleCreateLink(row) {
      console.log(row)
      this.dialogFormConfig = {
        visible: true,
        landingPageId: row.landingPageId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 186px);
  padding: 0 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
