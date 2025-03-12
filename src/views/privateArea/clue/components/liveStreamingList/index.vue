<template>
  <div>
    <filterTop
      :search="search"
      @handleClear="handleClear"
      @handleOk="handleOk"
    />
    <dynamicTable
      ref="tableRef"
      v-model="tableData"
      class="table"
      height="1000px"
      immediate-check
      :columns="columns"
      :get-list-api="getList"
    />
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import columns from './columns'
import { getClueLivePage } from '@/api/privateArea/clue'
import dynamicTable from '@/components/DynamicTable/table'
export default {
  components: {
    dynamicTable,
    filterTop
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: () => ({
    tableData: [],
    columns,
    search: {
      liveRoom: ['', ''],
      recordVideoName: ''
    }
  }),
  created() {
    this.onRefresh()
  },
  methods: {
    getList(params) {
      const liveRoomStartTime =
        this.search.liveRoom?.length && this.search.liveRoom[0]
          ? `${this.search.liveRoom[0]} 00:00:00`
          : undefined
      const liveRoomEndTime =
        this.search.liveRoom?.length && this.search.liveRoom[1]
          ? `${this.search.liveRoom[1]} 23:59:59`
          : undefined
      return getClueLivePage({
        ...params,
        recordVideoName: this.search.recordVideoName,
        liveRoomStartTime,
        liveRoomEndTime,
        studentId: this?.data[0]?.userId
      })
    },
    handleOk() {
      this.onRefresh()
    },
    handleClear() {
      this.onRefresh()
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.tableRef.pageIndex = 1
        this.$refs.tableRef.onRefresh()
        this.tableData = []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table{
  height: calc(100vh - 300px);
}
</style>
