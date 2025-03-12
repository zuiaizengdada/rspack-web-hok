<template>
  <div class="image-training-wrapper">
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
      <template #photoUrl="{ scope }">
        <div
          class="photoBox"
          style="width: 76px; height: 97px; object-fit: contain"
        >
          <img
            :src="scope.row.photoUrl"
            style="width: 76px; height: 97px; object-fit: contain"
          />
          <div class="mask-img">
            <div
              class="mask-img-item"
              @click="openReviewImgDialog(scope.row.photoUrl, 'horizontal')"
            >
              <i class="el-icon-zoom-in" />
              大图
            </div>
          </div>
        </div>
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
              permsList.includes('digitalPerson:ImageTraining:imageExample')
          "
          type="text"
          @click="handleImageExampleClick(scope.row)"
        >形象示例</el-button>
        <el-button
          v-if="
            scope.row.trainingStatus === 4 &&
              scope.row.purchaseStatus === 0 &&
              permsList.includes('digitalPerson:ImageTraining:purchase')
          "
          type="text"
          @click="handlePurchaseClick(scope.row)"
        >采购</el-button>
        <el-button
          v-if="
            scope.row.trainingStatus === 4 &&
              scope.row.purchaseStatus === 0 &&
              permsList.includes('digitalPerson:ImageTraining:surrender')
          "
          type="text"
          @click="handleSurrenderClick(scope.row)"
        >放弃</el-button>
      </template>
    </HokTable>
    <ImageExampleDialog v-model="isImageExampleDialog" :row="row" />

    <AddImageTrainingDialog
      v-if="addImageTrainingConfig.visible"
      :config="addImageTrainingConfig"
      @sumbit="handleAddAddImageTrainingSuccess"
    />

    <ReviewImgDialog
      v-model="bigImgVisible"
      :row="selectImg"
      @close="bigImgVisible = false"
    />
    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
    <PurchaseDialog
      v-model="purchaseDialogVisible"
      :row="rowData"
      @sumbit="searchFn(true)"
    />
  </div>
</template>

<script>
import ImageExampleDialog from './components/ImageExampleDialog/index.vue'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import HokTable from '@/components/baseCpns/table/index.vue'
import { formConfig } from '../../config/form.config'
import { columns } from '../../config/table.config'
import moment from 'moment'
import {
  getImageTrainingList,
  giveUpPurchase,
  addImageTraining
} from '@/api/aiVideoManage/training'
import AddImageTrainingDialog from './components/AddImageTrainingDialog/index.vue'
import ReviewImgDialog from './components/ReviewImgDialog/index.vue'
import PurchaseDialog from './components/purchaseDialog/index.vue'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'

export default {
  components: {
    HokSearchForm,
    HokTable,
    AddImageTrainingDialog,
    ReviewImgDialog,
    ImageExampleDialog,
    BalanceNotTipsDialog,
    PurchaseDialog
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
        ...formConfig,
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
            label: '新增',
            fn: () => {
              this.openImageTrainingDialog()
            },
            isHide: !this.permsList.includes('digitalPerson:ImageTraining:add'),
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
      columns,
      // 分页配置
      paginationConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      // 是否打开形象训练弹框
      showImageTrainingDialog: false,
      isImageExampleDialog: false,
      row: {},
      // 新增形象训练配置
      addImageTrainingConfig: {
        type: 1,
        row: {},
        visible: false
      },
      selectImg: { type: '', url: '' },
      // 是否展示大图
      bigImgVisible: false,
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: '',
      purchaseDialogVisible: false,
      rowData: {}
    }
  },
  computed: {
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
        'digitalPerson:ImageTraining:add'
      )
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    typeSearchFn(val) {
      this.searchForm.formData.type = val
      this.searchFn()
    },
    moment,
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
      const data = {
        ...this.paginationConfig,
        ...this.searchForm.formData,
        timeType:
          this.tempSearchForm.createTimeorconfirmTime &&
          this.tempSearchForm.createTimeorconfirmTime.length
            ? this.searchForm.formData.timeType
            : undefined,
        startTime:
          this.tempSearchForm.createTimeorconfirmTime?.[0] || undefined,
        endTime: this.tempSearchForm.createTimeorconfirmTime?.[1] || undefined
      }

      return getImageTrainingList(data)
    },
    handleSizeChangeEmit(val) {
      this.paginationConfig.pageSize = val
      this.searchFn()
    },
    handleCurrentChangeEmit(val) {
      this.paginationConfig.pageIndex = val
      this.searchFn(false, false)
    },
    // 形象示例
    handleImageExampleClick(row) {
      this.row = { ...row }
      this.isImageExampleDialog = true
    },
    // 采购
    async handlePurchaseClick(row) {
      this.rowData = { ...row }
      this.purchaseDialogVisible = true
    },
    // 放弃
    handleSurrenderClick(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">放弃</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确认不采购形象${row.name}吗?</div>`,
        success: async () => {
          const params = {
            id: row.id
          }
          const { code } = await giveUpPurchase(params)

          if (code === 1) {
            this.$message.success('放弃采购成功')
            this.searchFn()
          }
        }
      })
    },
    // 打开新增窗口
    openImageTrainingDialog() {
      this.addImageTrainingConfig.visible = true
    },
    openReviewImgDialog(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
    },
    // 新增形象训练成功
    async handleAddAddImageTrainingSuccess(form) {
      this.addImageTrainingConfig.visible = false

      const formData = new FormData()
      // formData.append('file', form.file)
      formData.append('uploadOss', form.uploadOss)
      formData.append('name', form.name)
      formData.append('photoUrl', form.photoUrl)

      if (form.teacherId) {
        formData.append('teacherId', form.teacherId)
      }
      this.$refs.zbTableRef.loadding = true
      const { code } = await addImageTraining(formData)
      this.loadding = false

      if (code === 1) {
        this.$message.success('新增形象训练成功')
        this.searchFn()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-input {
  padding-left: 0 !important;
}
.image-training-wrapper {
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
