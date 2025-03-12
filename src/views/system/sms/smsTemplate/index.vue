<template>
  <!-- 短信模板 -->
  <div class="page_wrap">
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
      checkbox
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="search">
        <filterTop
          :loading="loading"
          :search="search"
          :columns="config.tableColumns"
          @change="handleCheckedTableColumnsChange"
          @onSearch="searchFn"
          @onClear="onClear"
          @onhandleAdd="onhandleAdd"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          type="text"
          @click="onhandleDetail(scope.row)"
        >详情</el-button>
        <el-button
          v-if="scope.row.examineStatus === 4"
          type="text"
          @click="onhandleTest(scope.row)"
        >测试</el-button>
        <el-button
          type="text"
          @click="onhandleLabel(scope.row)"
        >标签</el-button>
      </template>
      <template slot="status" slot-scope="{ row }">
        <AppStatus :status="['success', 'error'][row.status]">
          <span>
            {{ ['启用', '禁用'][row.status] }}
          </span>
        </AppStatus>
      </template>
      <template slot="examineStatus" slot-scope="{ row }">
        <div
          class="examineStatus"
          :style="{
            background: getOptionsValueByKey(
              'value',
              'background',
              row.examineStatus,
              examineStatusOption
            ),
            color: getOptionsValueByKey(
              'value',
              'color',
              row.examineStatus,
              examineStatusOption
            )
          }"
        >
          <svg-icon
            class-name="examineStatusicon"
            :icon-class="
              getOptionsValueByKey(
                'value',
                'icon',
                row.examineStatus,
                examineStatusOption
              )
            "
          />
          {{
            getOptionsValueByKey(
              'value',
              'label',
              row.examineStatus,
              examineStatusOption
            )
          }}
        </div>
      </template>
      <template slot="channelTemplateContent" slot-scope="{ row }">
        <div v-if="row.channelTemplateContent.length < 70">
          {{ row.channelTemplateContent }}
        </div>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          :content="row.channelTemplateContent"
          placement="top"
        >
          <div class="ellipsis">
            {{ row.channelTemplateContent.slice(0, 70) }}...
          </div>
        </el-tooltip>
      </template>
      <template slot="footer">
        <el-button
          type="text"
          :disabled="!search.channelId"
          @click="onhandleBatchCopy"
        >批量复制到渠道</el-button>
        <!-- :disabled="!(search.examineStatus === 1 || search.examineStatus === 3)" -->
        <el-button type="text" @click="onhandleBatchApply">批量申请</el-button>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <detailDialog :config="detailConfig" @success="closeDetailDialog" />
    <testDialog :config="testConfig" @suceess="closeTestDialog" />
    <labelDialog :config="labelConfig" @success="closeLabelDialog" />
    <batchCopyDialog
      :config="batchCopyConfig"
      @success="closeBatchCopyDialog"
    />
  </div>
</template>

<script>
import { getColumns, examineStatusOption } from './columns.js'
import filterTop from './filterTop.vue'
import detailDialog from './detailDialog.vue'
import AppStatus from '@/components/AppStatus'
import {
  getSmsChannelTemplate,
  duplicateSmsChannelTemplateApply
} from '@/api/system/sms.js'
import { getOptionsValueByKey } from '@/filters'
import testDialog from './testDialog.vue'
import labelDialog from './labelDialog.vue'
import batchCopyDialog from './batchCopyDialog.vue'
export default {
  components: {
    filterTop,
    detailDialog,
    AppStatus,
    testDialog,
    labelDialog,
    batchCopyDialog
  },
  data() {
    return {
      examineStatusOption,
      slotArr: [
        'action',
        'search',
        'footer',
        'status',
        'examineStatus',
        'channelTemplateContent'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        smsTypeId: '', // 模板类型
        channelId: '', // 渠道商名称
        examineStatus: '', // 审核状态
        tagName: '', // 标签名称
        tem: { label: 'templateName', value: '' }
      },
      loading: false,
      detailConfig: { visible: false, id: '' },
      testConfig: { visible: false, id: '' },
      labelConfig: { visible: false, id: '' },
      batchCopyConfig: { visible: false, arr: [] },
      multipleSelection: []
    }
  },
  activated() {
    this.getList()
  },
  mounted() {
    // this.searchFn()
  },
  methods: {
    getOptionsValueByKey,
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        channelId: this.search.channelId,
        examineStatus: this.search.examineStatus,
        smsTypeId: this.search.smsTypeId,
        tagName: this.search.tagName,
        [this.search.tem.label]: this.search.tem.value
      }
      getSmsChannelTemplate(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
        .catch(() => {
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.config.tableData = []
      this.config.total = 0
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 新增按钮点击触发
    onhandleAdd() {
      this.$router.push('/system/systemSms/smsTemplateAdd')
    },
    onClear() {
      this.search = {
        smsTypeId: '', // 模板类型
        channelId: '', // 渠道商名称
        examineStatus: '', // 审核状态
        tagName: '', // 标签名称
        tem: { label: 'templateName', value: '' }
      }
      this.searchFn()
    },
    // 点击打开详情弹框
    onhandleDetail(row) {
      this.detailConfig = {
        visible: true,
        id: row.templateId
      }
    },
    // 点击关闭弹框并刷新列表数据
    closeDetailDialog() {
      this.detailConfig.visible = false
      this.getList()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // 点击测试按钮
    onhandleTest(row) {
      this.testConfig = {
        visible: true,
        id: row.templateId
      }
    },
    closeTestDialog() {
      this.testConfig.visible = false
    },
    // 关闭标签弹框并刷新列表数据
    closeLabelDialog() {
      this.labelConfig.visible = false
      this.getList()
    },
    // 点击标签按钮
    onhandleLabel(row) {
      this.labelConfig = {
        visible: true,
        standardTemplateId: row.standardTemplateId,
        templateId: row.templateId
      }
    },
    // 关闭批量复制到渠道弹框
    closeBatchCopyDialog() {
      this.batchCopyConfig.visible = false
      this.getList()
    },
    // 点击批量复制到渠道按钮
    onhandleBatchCopy() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一项')
      }
      this.batchCopyConfig = {
        visible: true,
        smsChannel: this.multipleSelection[0].channelName,
        arr: this.multipleSelection
      }
    },
    // 点击批量申请
    onhandleBatchApply() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      this.$delModal({
        width: '505px',
        sureBtnBgColor: '#0C6FFF',
        tips: `
            <div style="font-size: 16px;color: #333333;line-height: 24px;font-weight: bold;">批量申请短信模板提醒</div>
            <div style="font-size: 14px;color: #333333;margin-top: 16px;line-height: 24px;">是否确认批量申请短信模版？重新发起申请，需要等待渠道商审核。</div>
          `,
        success: () => {
          this.loading = true
          const channelTemplateIdList = this.multipleSelection.reduce(
            (pre, next) => {
              pre.push(next.templateId)
              return pre
            },
            []
          )
          duplicateSmsChannelTemplateApply(channelTemplateIdList)
            .then(res => {
              if (res.data && (res.data.failNum || res.data.sucessNum)) {
                this.$notify.success({
                  title: '提示',
                  message: `已经成功提交申请${res.data.sucessNum}条，提交失败${res.data.failNum}条。`
                })
              }
              this.loading = false
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 自定义表头触发
    handleCheckedTableColumnsChange() {
      this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  padding: 0 20px 10px 20px;
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
.examineStatus {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  line-height: 12px;
  .examineStatusicon {
    width: 12px;
    height: 12px;
    font-size: 12px;
    margin-right: 4px;
  }
}
</style>
