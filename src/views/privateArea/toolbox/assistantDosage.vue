<template>
  <div class="dosage-container">
    <div class="dosage-header">
      <el-row :gutter="20">
        <el-col
          v-for="(item, index) in items"
          :key="item.title"
          :style="{ 'margin-bottom': index !== 2 ? '20px' : 0 }"
          :span="index === 2 ? 12 : 6"
        >
          <span class="title">{{ item.title }}：</span>
          <span class="value">{{ item.value }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" class="flexTop">
          <span class="title">扣费模式：</span>
          <div class="value">
            <el-radio-group v-model="type" @change="handleType">
              <el-radio :label="1" class="flex">获客助手剩余使用量
                <span class="colorRed">（需要提前在企业微信中充值到获客助手余额，余额为0会暂停任务执行。）</span>
              </el-radio>
              <el-radio :label="2">企微余额<span class="colorRed">（不需提前充值到获客助手余额，但是需要在企业微信先进行充值，设置好获客助手自动扣款，企业微信余额为0时，将影响自动加微，请在企业微信余额处设置好余额提醒通知。）</span></el-radio>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="type===1">
        <div style="margin-left:70px;">
          <span class="value">剩余量小于等于</span>
          <el-input-number
            :key="copyTenantBalanceFeishu"
            v-model="tenantBalanceFeishu"
            :controls="false"
            style="width: 100px; margin: 0 10px"
            size="mini"
            @change="handleChange"
          />
          <span class="value">每天提醒1次预警人员</span>
          <span class="title">（销售设置-提醒设置-预警提醒设置-打开通知开关）</span>
        </div>
      </el-row>
    </div>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
      class="dialog-table"
    />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import {
  hkPage,
  hkUsageInfo,
  editBalanceFeishu
} from '@/api/privateArea/toolbox'
export default {
  components: {
    dynamicTable
  },
  data() {
    return {
      items: [
        {
          title: '历史累计使用量',
          value: '',
          key: 'tenantUsedNum'
        },
        {
          title: '统计时间',
          value: '',
          key: 'syncTime'
        },
        {
          title: '剩余使用量',
          value: '',
          key: 'wechatBalance'
        }
      ],
      tenantBalanceFeishu: '',
      type: 1,
      copyTenantBalanceFeishu: '',
      tableData: [],
      columns: [
        {
          prop: 'linkName',
          label: '链接名称'
        },
        {
          prop: 'usedNum',
          label: '消耗数量',
          width: 400
        }
      ]
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getList(params) {
      return hkPage(params)
    },
    async handleType() {
      if (this.type === 1 && !this.tenantBalanceFeishu) {
        this.$message.error('飞书提醒剩余量必须不为空并且大于0')
        return
      }
      const { code } = await editBalanceFeishu({ tenantBalanceFeishu: this.tenantBalanceFeishu, type: this.type })
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async handleChange(tenantBalanceFeishu) {
      if (!(tenantBalanceFeishu && tenantBalanceFeishu > 0)) {
        setTimeout(() => {
          this.tenantBalanceFeishu = this.copyTenantBalanceFeishu
        }, 200)
        this.$message.error('飞书提醒剩余量必须不为空并且大于0')
        return
      }
      const { code } = await editBalanceFeishu({ tenantBalanceFeishu, type: this.type })
      this.copyTenantBalanceFeishu = this.tenantBalanceFeishu
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    async getDetails() {
      const { data = {} } = await hkUsageInfo()
      console.log(22222222, data)
      this.type = data.type
      for (const i in data) {
        this.items.forEach(j => {
          if (j.key === i) {
            j.value = data[i] ?? '--'
          }
          if (i === 'tenantBalanceFeishu') {
            this.tenantBalanceFeishu = data[i]
            this.copyTenantBalanceFeishu = this.tenantBalanceFeishu
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.dosage-container ::v-deep {
  @include responsive-height(76px);
  display: flex;
  flex-direction: column;
  .flexTop{
    display: flex;
    align-items: flex-start;
    >.title{
      min-width: 70px;
    }
  }
  .flex{
    display: flex;
    align-items: center;
  }
  .el-radio{
    margin-bottom: 15px;
    margin-top: 3px;
  }
  .colorRed{
    color:red;
    margin-left: 10px;
  }
  .dosage-header {
    margin: 20px;
    border-radius: 6px;
    background: #e7f0ff62;
    padding: 20px;
    font-size: 14px;
    .title {
      font-weight: 500;
      color: #777777;
    }
    .value {
      font-weight: 400;
      color: #333333;
    }
  }
  .filter-container {
    padding: 0px;
  }
  .dialog-table {
    // flex: 1;
    height: calc(100vh - 400px);
  }
}
</style>
