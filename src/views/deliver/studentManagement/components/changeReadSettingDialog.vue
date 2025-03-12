<template>
  <AppDialog
    v-model="visible"
    :btn-footer="false"
    title="换人就读设置"
    width="900px"
    height="500px"
    top="60px"
    :loading="loading"
  >
    <div class="dialog-container">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :columns="columns"
        :get-list-api="getList"
      >
        <template #action="{ row }">
          <el-button
            type="text"
            @click="handleAddCount(row)"
          >增加次数</el-button>
        </template>
        <template #submitBtn>
          <el-button
            size="small"
            type="primary"
            @click="handleOpenInnerDialog"
          >安全性设置</el-button>
        </template>
      </dynamicTable>
    </div>
    <AppDialog
      v-model="innerVisible"
      title="安全性设置"
      width="400px"
      height="200px"
      @success="hanldeSubmit"
    >
      <el-form ref="form" v-model="form" class="inner-form" label-width="140px">
        <el-form-item label="单人单天默认次数">
          <m-select
            v-model="form.defaultNumType"
            :request="getDeliveryDict"
            :param="{ value: 'type', label: 'label' }"
            placeholder="请选择单人单天默认次数"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="B端开启验证码">
          <el-switch
            v-model="form.bType"
            :active-value="2"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item label="C端开启验证码">
          <el-switch
            v-model="form.cType"
            :active-value="2"
            :inactive-value="1"
          />
        </el-form-item>
      </el-form>
    </AppDialog>
    <addCountDialog ref="addCountDialog" @onOk="onOk" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import dynamicTable from '@/components/DynamicTable/table'
import addCountDialog from './addCountDialog'
import {
  safeSettingGet,
  safeSettingSave,
  getSettingPage,
  getDeliveryDict,
} from '@/api/deliver/studentManagement'
import { getDict } from '@/utils/index'
export default {
  name: 'CloseDeliverDialog',
  components: {
    AppDialog,
    dynamicTable,
    addCountDialog
  },
  props: {
    isPackage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        defaultNumType: '',
        bType: 1,
        cType: 1
      },
      loading: false,
      visible: false,
      innerVisible: false,
      tableData: [],
      columns: [
        {
          prop: 'operatorUserName',
          label: '操作人',
          showInSearch: true,
          type: 'text'
        },
        {
          prop: 'operatortNum',
          label: '操作次数',
          type: 'text'
        },
        {
          prop: 'residueNum',
          label: '剩余次数',
          type: 'text'
        },
        // {
        //   prop: 'operatortDate',
        //   label: '操作日期',
        //   type: 'text',
        //   showInSearch: true,
        //   valueType: 'daterange',
        //   formProps: {
        //     // pickerOptions: {
        //     //   disabledDate: function (time) {
        //     //     return time.getTime() > Date.now()
        //     //   }
        //     // },
        //     alias: {
        //       startTime: 'startTime',
        //       endTime: 'endTime'
        //     }
        //   }
        // },
        { prop: 'action', label: '操作', type: 'slot' }
      ]
    }
  },
  methods: {
    getDeliveryDict() {
      return getDeliveryDict({ key: 'ReplacementEnrollmentDefaultNumType' })
    },
    onOk() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
        this.tableData = []
      })
    },
    open() {
      this.visible = true
      this.getDetails()
      this.$refs.table.onRefresh()
      getDict('defaultNumType')
    },
    getList(data) {
      delete data.operatortDate
      const params = {
        current: data.pageIndex,
        size: data.pageSize
      }
      return getSettingPage(params).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    async getDetails() {
      const { code, data } = await safeSettingGet()
      if (code === 1 && data) this.form = data
    },
    async handleOpenInnerDialog() {
      this.innerVisible = true
    },
    handleAddCount(row) {
      this.$refs.addCountDialog.open(row)
    },
    async hanldeSubmit() {
      const { code } = await safeSettingSave(this.form)
      if (code !== 1) return
      this.$message.success('保存成功')
      this.innerVisible = false
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  padding: 0 20px;
  height: 100%;
  .filter-container {
    padding: 20px 0px 0 0px;
  }
}
.inner-form {
  padding: 20px 0;
}
</style>
