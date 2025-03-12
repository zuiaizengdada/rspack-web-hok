<template>
  <MCard class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.current"
      :page-sizes="config.pageSizes"
      :page-size="config.size"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop :search="search" @onSearch="onSearchFn" @onClear="onClear" />
      </template>
      <template slot="operateDetails" slot-scope="{row}">
        <div>
          <template v-if="row.operateType === 1">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div>{{ `新增内容：${row.operateAfter || ''}` }}</div>
              </div>
              <div class="text">{{ `新增内容：${row.operateAfter || ''}` }}</div>
            </el-tooltip>
          </template>
          <template v-else-if="row.operateType === 2">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37 || row.operateBefore.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div style="margin-bottom:10px">{{ `修改前：${row.operateBefore || ''}` }}</div>
                <div>{{ `修改后：${row.operateAfter || ''}` }}</div>
              </div>
              <div>
                <div class="text">{{ `修改前：${row.operateBefore || ''}` }}</div>
                <div class="text">{{ `修改后：${row.operateAfter || ''}` }}</div>
              </div>
            </el-tooltip>
          </template>
          <template v-else-if="row.operateType === 4">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div class="text">{{ `${row.operateAfter || ''}` }}</div>
              </div>
              <div>
                <div class="text">{{ `${row.operateAfter || ''}` }}</div>
              </div>
            </el-tooltip>
          </template>
          <template v-else-if="row.operateType === 5">
            <el-tooltip placement="bottom" :disabled="!(row.operateAfter.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div class="text">操作内容：{{ `${row.operateAfter || ''}` }}</div>
              </div>
              <div>
                <div class="text">操作内容：{{ `${row.operateAfter || ''}` }}</div>
              </div>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip placement="bottom" :disabled="!(row.operateBefore.length > 37)">
              <div slot="content" style="font-size: 14px;">
                <div>{{ `删除内容：${row.operateBefore || ''}` }}</div>
              </div>
              <div class="text">{{ `删除内容：${row.operateBefore || ''}` }}</div>
            </el-tooltip>
          </template>
        </div>
      </template>
    </MPageLayout>

  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getLogsList } from '@/api/business'
import { parseTime } from '@/utils'
import { operateModuleMap, operateTypeMap } from './columns'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      slotArr: ['operateDetails', 'search'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'operateModule', label: '操作模块', type: 'text', visible: true, slotFn: (row) => operateModuleMap.get(row.operateModule) },
          { prop: 'operateType', label: '操作类型', type: 'text', visible: true, slotFn: (row) => operateTypeMap.get(row.operateType) },
          { prop: 'operator', label: '操作人员', type: 'text', visible: true },
          { prop: 'operateDetails', label: '操作明细', type: 'slot', visible: true, render: (row) => { return row } },
          { prop: 'createTime', label: '操作时间 ', type: 'text', visible: true, slotFn: (row) => parseTime(new Date(row.createTime).getTime(), '{y}-{m}-{d} {h}:{i}') || '—' }
        ],
        pageSizes: [10, 20, 50, 100],
        size: 10,
        current: 1,
        total: 0
      },
      search: {
        operator: '',
        operateType: '',
        operateModule: ''
      },
      loading: false,
      addConfig: {
        type: 1, // 1：新增 2：编辑
        row: {},
        visible: false
      }
    }
  },
  mounted() {
    this.onSearchFn()
  },
  methods: {
    // 分页改变触发
    handleSizeChange(row) {
      this.config.size = row
      this.config.current = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.current = row
      this.getList()
    },
    // 点击查询按钮
    onSearchFn() {
      console.log(this.search)
      this.config.current = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        operator: '',
        operateType: '',
        operateModule: ''
      }
      this.getList()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        current: this.config.current,
        size: this.config.size,
        ...this.search
      }
      this.params = params
      const res = await getLogsList(params)
      if (res.code === 1) {
        this.loading = false
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.$refs.MPageLayout.doLayout()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  min-width: 1200px;
  height: calc(100vh - 90px);
  padding: 20px;
}
::v-deep .tablePage .page_footer{
  justify-content: space-between;
  box-shadow: none;
  padding:10px 0px 0px;
  height:auto;
}
::v-deep .page_header{
  padding: 0!important;
}
::v-deep .my-table{
  margin:0!important
}
</style>
