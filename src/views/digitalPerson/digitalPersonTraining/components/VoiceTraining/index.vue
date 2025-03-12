<template>
  <div class="voice-training-wrapper">
    <HokSearchForm
      :form-opts="searchForm"
      :ref-obj.sync="searchForm.ref"
      class="pd20"
      style="margin-top: 20px"
    >
      <template #name>
        <div class="flex">
          <el-input
            v-model="searchForm.formData.name"
            clearable
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>

      <template #trainingStatus>
        <div class="flex">
          <el-select
            v-model="searchForm.formData.trainingStatus"
            clearable
            placeholder="请选择"
            @change="searchFn()"
          >
            <el-option
              v-for="({ label, value }, index) in searchForm.optionsObj
                .trainingStatus"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </div>
      </template>

      <template #purchaseStatus>
        <div class="flex">
          <el-select
            v-model="searchForm.formData.purchaseStatus"
            clearable
            placeholder="请选择"
            @change="searchFn()"
          >
            <el-option
              v-for="({ label, value }, index) in searchForm.optionsObj
                .purchaseStatus"
              :key="index"
              :label="label"
              :value="value"
            />
          </el-select>
        </div>
      </template>

      <template #createTimeorconfirmTime>
        <div class="flex" style="padding-left: 8px">
          <el-select
            v-model="searchForm.formData.timeType"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
            @change="searchFn()"
          >
            <el-option label="创建时间" :value="1" />
            <el-option label="确认时间" :value="2" />
          </el-select>
          <el-date-picker
            v-model="tempSearchForm.createTimeorconfirmTime"
            style="padding-left: 20px"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchFn()"
          />
        </div>
      </template>
    </HokSearchForm>

    <HokTable
      ref="zbTableRef"
      :columns="columns"
      height="517px"
      :get-list="getTabelData"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template #thirdType="{ scope }">
        {{ thirdTypeObj(scope.row.thirdType) }}
      </template>
      <template #trainingStatus="{ scope }">
        <div class="status-wrapper">
          <!-- 状态指示点 -->
          <div
            class="status-dot"
            :style="{
              backgroundColor: trainingStatusObj(scope.row.trainingStatus).color
            }"
          />
          <!-- 状态文字 -->
          <div class="status-text">
            {{ trainingStatusObj(scope.row.trainingStatus).text }}
          </div>
        </div>
      </template>
      <template #purchaseStatus="{ scope }">
        <div class="status-wrapper">
          <!-- 状态指示点 -->
          <div
            class="status-dot"
            :style="{
              backgroundColor: purchaseStatusObj(scope.row.purchaseStatus).color
            }"
          />
          <!-- 状态文字 -->
          <div class="status-text">
            {{ purchaseStatusObj(scope.row.purchaseStatus).text }}
          </div>
        </div>
      </template>
      <template #createTime="{ scope }">
        <span>
          {{ moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
      </template>
      <template #confirmUserName="{ scope }">
        <span>
          {{
            scope.row.purchaseStatus === '' || scope.row.purchaseStatus === 0
              ? '-'
              : scope.row.confirmUserName
          }}
        </span>
      </template>
      <template #confirmTime="{ scope }">
        <span>
          {{
            scope.row.purchaseStatus === '' || scope.row.purchaseStatus === 0
              ? '-'
              : moment(scope.row.confirmTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </span>
      </template>
      <template #operate="{ scope }">
        <el-button
          v-if="
            scope.row.trainingStatus === 4 &&
              permsList.includes('digitalPerson:VoiceTraining:voiceExample')
          "
          type="text"
          @click="handleVoiceTrainingClick(scope.row)"
        >声音训练</el-button>
        <el-button
          v-if="
            scope.row.trainingStatus === 4 &&
              scope.row.purchaseStatus === 0 &&
              permsList.includes('digitalPerson:VoiceTraining:purchase')
          "
          type="text"
          @click="handlePurchaseClick(scope.row)"
        >采购</el-button>
        <el-button
          v-if="
            scope.row.trainingStatus === 4 && scope.row.purchaseStatus === 0&&
              permsList.includes('digitalPerson:VoiceTraining:surrender')
          "
          type="text"
          @click="handleSurrenderClick(scope.row)"
        >放弃</el-button>
      </template>
    </HokTable>
    <AddVoiceTrainingDialog
      v-if="addVoiceTrainingDialogConfig.visible"
      :config="addVoiceTrainingDialogConfig"
      @submit="handleAddVoiceTrainingSubmit"
      @cancel="addVoiceTrainingDialogConfig.visible = false"
    />

    <VoiceExampleDialog
      v-if="voiceExampleDialogConfig.visible"
      :config="voiceExampleDialogConfig"
      :perms-list="permsList"
      @openAdd="addVoiceTrainingDialogConfig.visible = true"
      @openEdit="handleOpenEdit"
    />

    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import HokTable from '@/components/baseCpns/table/index.vue'
import { voiceFormConfig } from '../../config/form.config'
import { voiceColumns } from '../../config/table.config'
import moment from 'moment'
import {
  getVoiceTrainingList,
  confirmVoicePurchase,
  giveUpVoicePurchase,
  addVoiceTraining
} from '@/api/aiVideoManage/training'
import AddVoiceTrainingDialog from './components/AddVoiceTrainingDialog'
import VoiceExampleDialog from './components/VoiceExampleDialog'

import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'

export default {
  components: {
    HokSearchForm,
    HokTable,
    AddVoiceTrainingDialog,
    VoiceExampleDialog,
    BalanceNotTipsDialog
  },
  props: {
    permsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 搜索表单
      searchForm: {
        ...voiceFormConfig,
        operatorList: [
          {
            label: '查询',
            bind: {
              plain: true
            },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.searchFn(true)
            }
          },
          {
            label: '新增声音',
            fn: async () => {
              const res = await checkPackageOrderBalance({ type: 2 })
              if (res.data && res.data.length) {
                this.balanceNotTipsDialog = true
                this.balanceNotTipsDialogMsg = res.data
                return
              }
              this.addVoiceTrainingDialogConfig.visible = true
            },
            isHide: !this.permsList.includes('digitalPerson:VoiceTraining:add'),
            bind: {
              icon: 'el-icon-plus'
            },
            className: ['right']
          }
        ]
      },
      // 临时搜索表单
      tempSearchForm: {
        // 创建时间/确认时间
        createTimeorconfirmTime: []
      },
      // 表格数据
      columns: voiceColumns,
      // 分页配置
      paginationConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      row: {},
      // 新增声音弹框配置
      addVoiceTrainingDialogConfig: {
        type: 1,
        row: {},
        visible: false
      },
      // 声音示例弹框配置
      voiceExampleDialogConfig: {
        row: {},
        visible: false
      },
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  computed: {
    thirdTypeObj() {
      return type => {
        switch (type) {
          case 1:
            return '华为'
          case 2:
            return '火山'
          case 3:
            return '硅基'
          case 4:
            return '媲美'
          case 5:
            return '火山大模型'
          default:
            return '-'
        }
      }
    },
    trainingStatusObj() {
      return status => {
        switch (status) {
          case 1:
            return {
              color: '#FFC868',
              text: '排队中'
            }
          case 2:
            return {
              color: '#FF8432',
              text: '训练中'
            }
          case 3:
            return {
              color: '#F53F3F',
              text: '训练失败'
            }
          case 4:
            return {
              color: '#00B42A',
              text: '已完成'
            }
          default:
            return {
              color: 'transparent',
              text: ''
            }
        }
      }
    },
    purchaseStatusObj() {
      return status => {
        switch (status) {
          case 0:
            return {
              color: '#F75757',
              text: '未确认'
            }
          case 1:
            return {
              color: '#00B42A',
              text: '确认采购'
            }
          case 2:
            return {
              color: '#FF8432',
              text: '确认不采购'
            }
          default:
            return {
              color: 'transparent',
              text: '-'
            }
        }
      }
    }
  },
  watch: {
    permsList(val) {
      this.searchForm.operatorList[2].isHide = !val.includes(
        'digitalPerson:VoiceTraining:add'
      )
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    moment,
    typeSearchFn(val) {
      this.searchForm.formData.type = val
      this.searchFn()
    },
    // 搜索表单
    searchFn(isReset, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.paginationConfig.pageIndex = 1
      }

      if (isReset) {
        this.searchForm.formData.name = ''
        this.searchForm.formData.trainingStatus = ''
        this.searchForm.formData.purchaseStatus = ''
        this.searchForm.timeType = 1
        this.searchForm.startTime = ''
        this.searchForm.endTime = ''
        this.tempSearchForm.createTimeorconfirmTime = []
        this.paginationConfig.pageIndex = 1
        this.paginationConfig.pageSize = 10
      }

      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    // 获取表格数据
    getTabelData() {
      // 从日期选择器获取开始和结束时间
      const startTime =
        this.tempSearchForm.createTimeorconfirmTime?.[0] || undefined
      const endTime =
        this.tempSearchForm.createTimeorconfirmTime?.[1] || undefined

      const data = {
        ...this.paginationConfig,
        ...this.searchForm.formData,
        timeType:
          this.tempSearchForm.createTimeorconfirmTime &&
          this.tempSearchForm.createTimeorconfirmTime.length
            ? this.searchForm.formData.timeType
            : undefined,
        startTime,
        endTime
      }

      return getVoiceTrainingList(data)
    },
    handleSizeChangeEmit(val) {
      this.paginationConfig.pageSize = val
      this.searchFn()
    },
    handleCurrentChangeEmit(val) {
      this.paginationConfig.pageIndex = val
      this.searchFn(false, false)
    },
    // 声音训练
    handleVoiceTrainingClick(row) {
      this.voiceExampleDialogConfig.visible = true
      this.voiceExampleDialogConfig.row = row
    },
    // 采购
    async handlePurchaseClick(row) {
      this.$Modal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">采购</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认采购声音${row.name}吗?</div>`,
        success: async () => {
          const params = {
            id: row.id
          }
          const { code } = await confirmVoicePurchase(params)

          if (code === 1) {
            this.$message.success('确认采购成功')
            this.searchFn()
          }
        }
      })
    },
    // 放弃
    handleSurrenderClick(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">放弃</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认不采购声音${row.name}吗?</div>`,
        success: async () => {
          const params = {
            id: row.id
          }
          const { code } = await giveUpVoicePurchase(params)

          if (code === 1) {
            this.$message.success('放弃采购成功')
            this.searchFn()
          }
        }
      })
    },
    // 新增声音弹框提交
    async handleAddVoiceTrainingSubmit(row) {
      const formData = new FormData()
      formData.append('file', row.file)
      formData.append('name', row.name)
      formData.append('thirdType', row.thirdType)
      formData.append('speed', row.speed)
      formData.append('volume', row.volume)
      formData.append('pitch', row.pitch)
      formData.append('userInputText', row.userInputText)
      formData.append('generateContent', row.generateContent)
      if (row.teacherId) {
        formData.append('teacherId', row.teacherId)
      }

      this.addVoiceTrainingDialogConfig.visible = false

      const { code } = await addVoiceTraining(formData)

      if (code === 1) {
        this.$message.success('新增声音训练成功')
      }

      this.addVoiceTrainingDialogConfig.visible = false
      this.searchFn()
    },
    // 编辑声音弹框提交
    handleOpenEdit(row) {
      this.addVoiceTrainingDialogConfig.visible = true
      this.addVoiceTrainingDialogConfig.row = row
    }
  }
}
</script>

<style scoped lang="scss">
.el-input {
  padding-left: 0 !important;
}
.voice-training-wrapper {
  position: relative;
  padding-bottom: 12px;

  .photoBox {
    position: relative;
    &:hover {
      .mask-img {
        display: flex;
      }
    }
  }

  .mask-img {
    display: none;
    width: 100%;
    height: 20px;
    background: rgba(51, 51, 51, 0.4);
    position: absolute;
    bottom: 0;
    align-items: center;
    justify-content: center;
    user-select: none;
    .mask-img-item {
      font-size: 12px;
      color: #ffffff;
      cursor: pointer;
    }
  }

  .status-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-text {
      color: #000000;
    }
  }
}
</style>
