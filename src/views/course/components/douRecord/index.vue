<template>
  <AppDialog
    v-if="visible"
    v-model="visible"
    width="800px"
    height="500px"
    title="提交日志"
    class="dou-container"
    @success="visible = false"
  >
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    />
  </AppDialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import AppDialog from '@/components/AppDialog'
import { douRecordPage } from '@/api/dou/index'
export default {
  name: 'DouApprove',
  components: {
    AppDialog,
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'createTime', label: '提交时间', type: 'text' },
        { prop: 'submitUserName', label: '提交人', type: 'text' },
        { prop: 'firstClass', label: '一级课程分类', type: 'text' },
        { prop: 'secondClass', label: '二级课程分类', type: 'text' },
        { prop: 'content', label: '提交内容', type: 'text' }
      ],
      visible: false,
      goodsId: ''
    }
  },
  methods: {
    open(goodsId) {
      this.goodsId = goodsId
      this.visible = true
    },
    async getList(params) {
      return douRecordPage({
        current: params.pageIndex,
        size: params.pageSize,
        goodsId: this.goodsId
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dou-container{
    ul{
        margin: 20px 50px;
    }
}
</style>
