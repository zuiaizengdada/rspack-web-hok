<template>
  <el-drawer
    title="详情"
    :visible.sync="visible"
    direction="rtl"
    :size="830"
    class="view-container"
  >

    <div class="drawer-container">
      <dynamicTable
        ref="table"
        v-model="tableData"
        immediate-check
        :columns="columns"
        :get-list-api="getList"
        class="dialog-table"
      />
    </div>
  </el-drawer>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { clueStatOrderList } from '@/api/privateArea/clue'
import { mapGetters } from 'vuex'
import { afterSaleStatus } from '@/utils/enum'
import { getOptionsValue } from '@/filters/index'
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
          prop: 'orderNo',
          label: '订单号',
          type: 'text',
          visible: true
        },
        {
          prop: 'shopName',
          label: '渠道',
          type: 'text',
          visible: true,
          slotFn: (row) => getOptionsValue(row.channelSource, this.channelSourceType)
        },
        {
          prop: 'goodsName',
          label: '课程名称',
          type: 'text',
          visible: true
        },
        {
          prop: 'payerTotal',
          label: '支付金额',
          type: 'text',
          visible: true,
          slotFn: (row) => (row.payerTotal / 100).toFixed(2)
        },
        {
          prop: 'payTime',
          label: '支付时间',
          type: 'text',
          visible: true
        },
        {
          prop: 'afterSalestatus',
          label: '售后状态',
          type: 'text',
          visible: true,
          slotFn: (row) => afterSaleStatus[row.afterSaleStatus]
        }
      ],
      sysUserId: ''
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  methods: {
    open(row, params) {
      this.visible = true
      this.sysUserId = [row.followUserId]
      this.$store.dispatch('option/getChannelsourceType')
      this.$nextTick(() => {
        this.$refs.table.onRefresh({
          ...params,
          userName: undefined
        })
      })
    },
    search() {
      this.$refs.table.onRefresh()
    },
    getList(params) {
      return clueStatOrderList({
        ...params,
        sysUserId: this.sysUserId,
        taskId: this.$route.query.taskId,
        liveId: undefined
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container ::v-deep{
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter-container{
    padding:0px;
  }
  .my-table{
    margin: 0 ;
  }
  .dialog-table{
    flex: 1;
  }
  .IconStatus {
    .isAddGwIconClass {
      width: 24px;
      height: 24px;
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
</style>
