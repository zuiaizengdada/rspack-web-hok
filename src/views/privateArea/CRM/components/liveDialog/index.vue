<template>
  <el-dialog
    title="直播间"
    width="800px"
    :visible.sync="visible"
    class="dialog-container"
    :close-on-click-modal="false"
  >
    <dynamicTable
      ref="table"
      v-model="tableData"
      hide-pagination
      class="table"
      immediate-check
      :columns="columns"
      :get-list-api="getList"
    >
      <template slot="headerBtn">
        <el-button
          v-permission="['web:crm:setLive', permsList]"
          type="primary"
          size="small"
          @click="handleSetLive"
        >设置直播间</el-button>
      </template>
      <template slot="action" slot-scope="{ row }">

        <el-button
          style="color: #F53F3F;"
          type="text"
          @click="delModal(row)"
        >移除</el-button>
      </template>
      <template #liveModel="{row}">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.liveModel,liveModelOption)"
          :color="getOptionsValueByKey('value','color', row.liveModel,liveModelOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.liveModel, liveModelOption)"
          :title="getOptionsValueByKey('value','label',row.liveModel,liveModelOption)"
        />
      </template>
    </dynamicTable>

    <selectLiveRoom ref="selectLiveRoom" @submit="handleSubmit" />
  </el-dialog>
</template>

<script>
import { getColumns } from './columns'
import dynamicTable from '@/components/DynamicTable/table'
import selectLiveRoom from '../liveRoomSetting/components/selectLiveRoom/index'
import {
  saleTaskPage,
  saleTaskAdd,
  saleTaskRemove
} from '@/api/privateArea/toolbox'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  components: {
    dynamicTable,
    selectLiveRoom
  },
  data() {
    return {
      visible: false,
      columns: getColumns.call(this),
      tableData: [],
      taskId: '',
      liveModelOption: [
        { label: '真人直播', value: 'PERSON_LIVE', background: '#E7F0FF', color: '#0C6FFF', icon: 'icon_PERSON_LIVE' },
        { label: '数字直播', value: 'AI_LIVE', background: '#E6F7EA', color: '#00B42A', icon: 'icon_AI_LIVE' },
        { label: '数字人直播', value: 'DIGITAL_PERSON_LIVE', background: '#E7F9FF', color: '#0099FF', icon: 'icon_DIGITAL_PERSON_LIVE' }
      ],
      permsList: this.$route.meta.permsList || [],
      taskStatus: ''
    }
  },
  methods: {
    getOptionsValueByKey,
    open(row) {
      this.visible = true
      this.taskId = row.id
      this.taskStatus = row.taskStatus
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    async handleSubmit(tableData) {
      const lives = tableData.map(i => {
        return {
          liveCode: i.code,
          liveId: i.id
        }
      })
      const params = {
        lives,
        taskId: this.taskId
      }
      const { code } = await saleTaskAdd(params)
      if (code === 1) {
        this.$message.success('新增成功')
        this.$nextTick(() => {
          this.$refs.table.onRefresh()
        })
      }
    },
    delModal(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.handleClickDel(row)
        }
      })
    },
    async handleClickDel(row) {
      const { code } = await saleTaskRemove({
        liveId: row.liveId,
        taskId: this.taskId
      })
      if (code === 1) {
        this.$nextTick(() => {
          this.$refs.table.onRefresh()
        })
      }
    },
    handleSetLive() {
      this.$refs.selectLiveRoom.open()
    },
    getList(params) {
      return saleTaskPage({
        taskId: this.taskId
      }).then(({ data }) => {
        return {
          data: {
            items: data ?? []
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep{
    .filter-container{
        padding: 0px;
        .row-btn{
            border-bottom:0px;
            padding:0 0 15px 0
        }
    }
    .el-dialog__body{
        padding: 20px;
    }
    .table{
      height: 500px;
    }
}
</style>
