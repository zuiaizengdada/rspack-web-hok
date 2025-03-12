<template>
  <div class="filterTopCrm">
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
      size="small"
      :inline="true"
    >
      <el-row>
        <el-col :span="4">
          <el-form-item v-if="type === 'my'" label="所属类型">
            <el-select v-model="form.ITaskType" placeholder="请选择">
              <el-option :value="1" label="我创建的" />
              <el-option :value="2" label="我参与的" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="任务名称">
            <el-input
              v-model.trim="form.taskName"
              maxlength="50"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="任务状态">
            <el-select
              v-model.trim="form.taskStatus"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="item in ChannelOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="数据来源">
            <el-select
              v-model.trim="form.dataType"
              placeholder="请选择"
              filterable
              clearable
            >
              <el-option
                v-for="item in dataTypeOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务开始时间" label-width="160px">
            <el-date-picker
              v-model="form.createTime"
              type="daterange"
              range-separator="至"
              style="width: 100%"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <div class="flex">
          <el-button
            size="small"
            type="primary"
            @click="onSearch"
          >查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </div>
      </el-row>
    </el-form>
    <div class="btnBox">
      <div>
        <el-button
          v-if="type !== 'all'"
          v-permission="[permissionKey[0], [...permsList,'']]"
          type="primary"
          class="m-r-20"
          size="small"
          @click="handleAddTask"
        >新增任务</el-button>
        <template v-else>
          <el-button
            v-permission="['web:allTask:revealDistribution', permsList]"
            size="small"
            type="primary"
            plain
            @click="handleShowPopup"
          >任务分配规则</el-button>
          <el-button
            v-permission="['web:allTask:revealTask', permsList]"
            size="small"
            type="primary"
            plain
            @click="handleAddrevealTask"
          >兜底任务设置</el-button>
          <el-button
            v-permission="['web:allTask:revealClue', permsList]"
            size="small"
            type="primary"
            plain
            class="m-r-20"
            @click="handleActivateTask"
          >兜底任务线索</el-button>
        </template>
      </div>
    </div>
    <el-dialog title="任务分配规则" :visible.sync="visible" width="600px">
      <el-form
        ref="form"
        :model="dialogData"
        class="popup-form"
        label-width="140px"
      >
        <el-form-item label="任务间分配规则：">
          <el-radio-group v-model="dialogData.dispatchType">
            <el-radio :label="1">按任务可接量最大数等比例分配</el-radio>
            <el-radio :label="2">按任务平均分配</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单退款是否补量：">
          <el-radio-group v-model="dialogData.refundType">
            <el-radio :label="1">不补量</el-radio>
            <el-radio :label="2">补量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div style="margin-left: 140px">
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button @click="visible = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { ChannelOption } from './columns'
import {
  saleTaskConfigDetail,
  saleTaskConfigSetting
} from '@/api/saleTask/index'
export default {
  props: {
    type: {
      type: String,
      default: 'my'
    },
    columns: {
      type: Array,
      default: () => []
    },
    permissionKey: {
      type: Array,
      default: () => ['']
    }
  },
  data() {
    return {
      form: {
        taskName: '',
        taskStatus: '',
        dataType: '',
        lectureId: '',
        createTime: [],
        ITaskType: 2
      },
      ChannelOption,
      permsList: this?.$route?.meta?.permsList || [],
      visible: false,
      dialogData: {
        dispatchType: 1,
        refundType: 1
      },
      dialogDataCopy: {},
      dataTypeOption: [
        {
          label: '订单',
          value: 1
        },
        {
          label: '线下表格',
          value: 2
        },
        {
          label: '信息流表单',
          value: 4
        }
      ]
    }
  },
  methods: {
    async submit() {
      if (
        JSON.stringify(this.dialogData) === JSON.stringify(this.dialogDataCopy)
      ) {
        return
      }
      const { code } = await saleTaskConfigSetting(this.dialogData)
      if (code === 1) {
        this.$message.success('修改成功')
        this.visible = false
      }
    },
    handleShowPopup() {
      this.visible = true
      this.getPopupDetails()
    },
    async getPopupDetails() {
      const { data } = await saleTaskConfigDetail()
      this.dialogData.dispatchType = data?.dispatchType ?? 1
      this.dialogData.refundType = data?.refundType ?? 1
      this.dialogDataCopy = data
    },
    async handleAddTask() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newPrivateAreaCRMTask'
      )
      if (res) return
      this.$emit('handleAddTask')
    },
    handleAddrevealTask() {
      this.$router.push('/privateArea/revealTask')
    },
    handleActivateTask() {
      this.$router.push('/privateArea/CRM/revealTaskClue?success=1')
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    },
    onSearch() {
      this.$emit('onSearch', this.form)
    },
    onClear() {
      this.form = {
        taskName: '',
        taskStatus: '',
        dataType: '',
        lectureId: '',
        createTime: [],
        ITaskType: 2
      }
      this.$emit('onClear')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTopCrm::v-deep {
  margin-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  .btnBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .el-form-item {
    display: flex;
    > div:nth-of-type(2) {
      flex: 1;
    }
  }
  .el-select {
    width: 100% !important;
  }
  .el-input {
    width: 100% !important;
  }
  .searchFooter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .custom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    float: right;
  }
  .popup-form {
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
  label {
    font-weight: normal;
    color: #333;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
