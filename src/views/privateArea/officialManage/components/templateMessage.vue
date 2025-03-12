<template>
  <div class="message-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
      class="dialog-table"
    >
      <template #submitBtn>
        <el-button
          type="primary"
          class="dialog-btn"
          plain
          size="mini"
          @click="onUpdate"
        >更新列表</el-button>
      </template>
    </dynamicTable>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { templatePage, templateSync } from '@/api/privateArea/toolbox'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'id',
          label: '模版ID'
        },
        {
          prop: 'title',
          label: '模版标题',
          showInSearch: true
        },
        {
          prop: 'content',
          label: '模版内容',
          showInSearch: true
        }
      ]
    }
  },
  methods: {
    getList(params) {
      const id = this.$route.query.id
      return templatePage({
        ...params,
        id
      })
    },
    async onUpdate() {
      const id = this.$route.query.id
      const { code } = await templateSync({ id })
      if (code === 1) {
        this.onRefresh()
      }
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.message-container ::v-deep{
    padding-top: 20px;
    height: 100%;
    .filter-container{
      padding: 0 0px 20px 0px
    }
    .my-table{
      margin: 0px;
    }
    .dialog-table{
      height: 100%;
    }
    .dialog-btn{
      background: #fff;
      color: #0C6FFF;
      border-color: #0C6FFF;
    }
}
</style>
