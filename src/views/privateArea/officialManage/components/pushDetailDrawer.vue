<template>
  <el-drawer
    :title="title"
    :visible.sync="visible"
    direction="rtl"
    :size="730"
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
      >
        <template #isClick="{row}">
          <AppStatus
            :title="isClick[row.isClick]"
            :status="status[row.isClick]"
          />
        </template>
      </dynamicTable>
    </div>
  </el-drawer>
</template>

<script>
import AppStatus from '@/components/AppStatus/index'
import dynamicTable from '@/components/DynamicTable/table'
import { templatePullNum } from '@/api/privateArea/toolbox'
export default {
  components: {
    AppStatus,
    dynamicTable
  },
  data() {
    return {
      status: {
        0: 'error',
        1: 'success',
        2: 'info'
      },
      title: '新增任务',
      visible: false,
      tableData: [],
      columns: [
        {
          prop: 'templateTitle',
          label: '模板标题'
        },
        {
          prop: 'remark',
          label: '接受对象'
        },
        {
          prop: 'createTime',
          label: '发送时间'
        },
        {
          prop: 'isClick',
          type: 'slot',
          label: '链接是否点击',
          // showInSearch: true,
          valueType: 'select',
          formProps: {
            options: [
              { label: '是', value: 1 },
              { label: '否', value: 0 },
              { label: '无链接', value: 2 }
            ],
            labelWidth: '100px'
          },
          slotFn: (row) => this.isClick[row.isClick]
        }
      ],
      templateId: '',
      isClick: {
        0: '否',
        1: '是',
        2: '无链接'
      }
    }
  },
  methods: {
    open(row) {
      this.visible = true
      this.templateId = row.id
      this.title = row.name + '任务详情'
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    getList(params) {
      return templatePullNum({
        ...params,
        templateId: this.templateId
      }).then(({ data }) => {
        const items = data.items.map(i => {
          return {
            ...i,
            isClick: '0'
          }
        })
        return {
          data: {
            ...data,
            items
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container{
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .dialog-table{
    flex: 1;
  }
}
</style>
