<template>
  <el-dialog title="生成日志" :visible.sync="visible" width="1300px">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
      immediate-check
    >
      <template slot="param" slot-scope="{ row }">
        <div>
          <span>{{ row.param }}</span>
          <el-button type="text" @click="handleCopy(row.param)">复制</el-button>
        </div>
      </template>
      <template slot="route" slot-scope="{ row }">
        <div>
          <span>{{ row.route }}</span>
          <el-button type="text" @click="handleCopy(row.route)">复制</el-button>
        </div>
      </template>
      <template slot="contentName" slot-scope="{ row }">
        <div>
          <span>{{ row.contentName }}</span>
          <el-button type="text" @click="handleCopy(row.contentName)">复制</el-button>
        </div>
      </template>
    </dynamicTable>
  </el-dialog>
</template>

<script>
import {
  goodsLogPage
} from '@/api/course'
import { copy } from '@/utils/index'
import dynamicTable from '@/components/DynamicTable/table'
import { searchExpertChannelEnums } from '@/api/order/performanceShare'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      visible: false,
      tableData: [],
      columns: [
        {
          prop: 'expertChannel',
          label: '达人渠道',
          type: 'text',
          slotFn: (row) => getOptionsValueByKey(
            'code',
            'message',
            row.expertChannel,
            this.liveChannel
          ),
          width: 90
        },
        { prop: 'expertName', label: '达人昵称', type: 'text', 'show-overflow-tooltip': true, width: 100 },
        { prop: 'route', label: '路径', type: 'slot', width: 280 },
        { prop: 'param', label: '参数', type: 'slot', width: 380 },
        { prop: 'contentName', label: '商品名称', type: 'slot', width: 240 },
        { prop: 'createTime', label: '生成时间', type: 'text' }
      ],
      liveChannel: []
    }
  },
  mounted() {
    this.searchExpertChannelEnumsd()
  },
  methods: {
    open(row) {
      this.visible = true
      this.details = row
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    searchExpertChannelEnumsd() {
      searchExpertChannelEnums().then(res => {
        this.liveChannel = res.data
      })
    },
    async getList(params) {
      return goodsLogPage({
        ...params,
        current: params.pageIndex,
        size: params.pageSize,
        goodsId: this.details.goodsId,
        tenantId: this.details.tenantId,
        pageIndex: undefined,
        pageSize: undefined
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    handleCopy(val) {
      copy(val)
      this.$message.success('复制成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.table_container{
  height: 600px;
  .el-button{
    margin-left: 10px;
  }
}
</style>
