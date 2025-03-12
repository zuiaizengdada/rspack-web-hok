<template>
  <el-dialog
    v-if="visible"
    title="设置直播间"
    :visible.sync="visible"
    width="1000px"
    top="80px"
    append-to-body
    :close-on-click-modal="false"
    class="dialog-container"
  >
    <el-form
      :inline="true"
      size="small"
      :model="form"
      class="search-form"
    >
      <el-form-item label="直播名称">
        <el-input
          v-model="form.liveRoomName"
          style="width:140px"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="onRefresh">查询</el-button>
        <el-button size="small" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <dynamicTable
      ref="table"
      v-model="tableData"
      checkbox
      row-key="id"
      immediate-check
      class="dialog-table"
      :columns="columns"
      :get-list-api="getList"
      @selectionChange="handleSelectionChange"
    >
      <template #liveModel="{row}">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.liveModel,liveModelOption)"
          :color="getOptionsValueByKey('value','color', row.liveModel,liveModelOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.liveModel, liveModelOption)"
          :title="getOptionsValueByKey('value','label',row.liveModel,liveModelOption)"
        />
      </template>
    </dynamicTable>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
      <el-button size="small" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getLiveRoomList } from '@/api/liveRoom/index'
import { getOptionsValueByKey } from '@/filters/index'
import moment from 'moment'
const renderTearch = (row) => {
  if (!row) return
  if (row.liveModel === 'PERSON_LIVE') {
    const arr = row.teacherInfoDtoList
    if (!arr) {
      return ''
    }
    const value = arr.filter(v => v.teacherRole === 0).reduce((pre, next) => {
      next && (pre = `${pre}${pre ? '、' : ''}${next.teacherName}`)
      return pre
    }, '')
    return value
  } else if (row.liveModel === 'AI_LIVE') {
    return row.videoTeacherName
  } else {
    return ''
  }
}
export default {
  name: 'SelectAllocation',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      visible: false,
      form: {
        liveRoomName: ''
      },
      multipleSelection: [],
      columns: [
        {
          prop: 'teacherName',
          label: '主讲老师',
          width: 180,
          slotFn: (row) => renderTearch(row)
        },
        {
          prop: 'name',
          label: '直播名称'
        },
        {
          prop: 'liveModel',
          label: '直播模式',
          type: 'slot',
          width: 120
        },
        {
          prop: 'teacherName1',
          label: '助教',
          width: 180,
          slotFn: (row) => row.teacherInfoDtoList?.filter(i => i.teacherRole === 1).map(i => i.teacherName).join('、')
        },
        {
          prop: 'createUserName',
          label: '创建人',
          width: 120
        },
        {
          prop: 'startTime',
          label: '直播时间',
          width: 160,
          slotFn: (row) => moment(row.startTime).format('YYYY-MM-DD HH:mm')
        }
      ],
      liveModelOption: [
        { label: '真人直播', value: 'PERSON_LIVE', background: '#E7F0FF', color: '#0C6FFF', icon: 'icon_PERSON_LIVE' },
        { label: '数字直播', value: 'AI_LIVE', background: '#E6F7EA', color: '#00B42A', icon: 'icon_AI_LIVE' },
        { label: '数字人直播', value: 'DIGITAL_PERSON_LIVE', background: '#E7F9FF', color: '#0099FF', icon: 'icon_DIGITAL_PERSON_LIVE' }
      ]
    }
  },
  methods: {
    getOptionsValueByKey,
    getList(params) {
      return getLiveRoomList({ ...params, liveRoomName: this.form.liveRoomName })
    },
    clear() {
      this.form = {
        liveRoomName: ''
      }
      this.onRefresh()
    },
    open() {
      this.visible = true
      this.onRefresh()
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
        this.multipleSelection = []
      })
    },
    onSubmit() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择直播间')
        return
      }
      this.visible = false
      this.$emit('submit', this.multipleSelection)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container ::v-deep{
  .el-dialog__body{
    padding: 10px 20px;
  }
  .el-dialog__header{
    border-bottom: 1px solid #E7E7E7;
  }
  .filter-container{
    padding: 0px;
  }
  .my-table{
    margin:0px;
  }
  .dialog-table{
    border-radius: 6px;
    border: 1px solid #EFF2F6;
    height: 550px;
  }
}

</style>
