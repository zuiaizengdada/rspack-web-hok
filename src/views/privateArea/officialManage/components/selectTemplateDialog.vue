<template>
  <el-dialog
    title="新增附件"
    :visible.sync="visible"
    append-to-body
    top="60px"
    width="948px"
  >
    <div class="message-container">
      <dynamicTable
        ref="table"
        v-model="tableData"
        hide-pagination
        immediate-check
        :columns="columns"
        :get-list-api="getList"
        class="dialog-table"
      >
        <template #radio="{ row }">
          <el-radio v-model="radioValue" :label="row.id"><span /></el-radio>
        </template>
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
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        size="small"
        @click="handleSave"
      >确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { templateList, templateSync } from '@/api/privateArea/toolbox'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      radioValue: '',
      columns: [
        {
          prop: 'radio',
          type: 'slot',
          label: '',
          width: 40
        },
        {
          prop: 'id',
          label: '模版ID',
          width: 170
        },
        {
          prop: 'title',
          label: '模版标题',
          width: 240,
          showInSearch: true
        },
        {
          prop: 'content',
          label: '模版内容',
          showInSearch: true
        }
      ],
      visible: false
    }
  },
  methods: {
    getList(params) {
      const id = this.$route.query.id
      return templateList({
        ...params,
        id
      }).then(res => {
        return {
          data: {
            items: res.data
          }
        }
      })
    },
    open() {
      this.visible = true
      this.onRefresh()
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
    },
    handleSave() {
      const current = this.tableData.find(i => i.id === this.radioValue)
      if (!current) {
        this.$message.error('请选择一条模板')
        return
      }
      this.$emit('select', current)
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.message-container ::v-deep{
    height: 100%;
    .el-dialog__body{
      padding: 0 20px 30px;
    }
    .filter-container{
      padding: 0 0px 20px 0px
    }
    .my-table{
      margin: 0px;
    }
    .dialog-table{
      height: 600px;
    }
    .dialog-btn{
      background: #fff;
      color: #0C6FFF;
      border-color: #0C6FFF;
    }
}
</style>
