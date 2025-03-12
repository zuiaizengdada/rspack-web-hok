<template>
  <div v-loading="loading" class="groupDrawer">
    <div class="content">
      <div class="title title1">
        【基础】信息开通确认
        <div>
          状态：<span :class="{ isFinished: baseInfoFinished }">{{
            baseInfoFinished ? '已完成' : '待完成'
          }}</span>
        </div>
      </div>
      <div class="box">
        <Base :info="detailData" />
        <div class="flex flex-right">
          <el-button
            class="btn"
            size="mini"
            plain
            type="primary"
            @click="handleUpdataBaseInfo"
          >修改</el-button>
        </div>
        <div v-if="type === '2' && isContract !== -1">
          <Contract :info="contractData" />
          <div class="flex flex-right">
            <el-button
              class="btn"
              size="mini"
              plain
              type="primary"
              @click="handleUpdataContractnfo"
            >{{ isContract === 0 ? '上传' : '修改' }}</el-button>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in organizationList" :key="index">
        <div class="title">
          {{ item.settingsName }}
          <div>
            状态：<span :class="{ isFinished: item.isFinished }">{{
              item.isFinished === 1 ? '已完成' : '待完成'
            }}</span>
          </div>
        </div>
        <div class="box">
          <div>
            <div
              v-for="(value, i) in item.settingsValues"
              :key="i"
              class="flex-box flex"
            >
              <div class="text-l" :span="3">
                {{ value.settingsColumnName }}：
              </div>
              <div class="text-r" :span="8">{{ value.value }}</div>
            </div>
          </div>
          <div class="flex flex-right">
            <el-button
              class="btn"
              size="mini"
              plain
              type="primary"
              @click="handleSet(item, item.settingsValues)"
            >{{ item.isFinished === 1 ? '修改' : '设置' }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="type === '1'" class="drawer__footer">
      <el-button
        size="small"
        type="primary"
        :disabled="!isFinished"
        @click="handleSubmit"
      >确认完成开通({{ finishedList }}/{{
        organizationList.length + 1
      }})</el-button>
      <el-button size="small" @click="$emit('close')">关 闭</el-button>
    </div>
    <!-- 配置 -->
    <AppDialog
      v-model="visibleConfig.visible"
      :title="visibleConfig.title"
      width="600px"
      height="80%"
      @success="handleSuccessSet"
      @beforeClose="handleCloseSet"
    >
      <Set
        v-if="visibleConfig.visible"
        ref="SetRef"
        :config="visibleConfig.config"
        :title="visibleConfig.title"
        @success="refresh"
      />
    </AppDialog>
    <!-- 基础信息 -->
    <AppDialog
      v-model="baseInfoConfig.visible"
      title="修改基础信息"
      width="800px"
      :btn-footer="false"
    >
      <Edit
        v-if="baseInfoConfig.visible"
        ref="EditRef"
        :type="type"
        :info="baseInfoConfig.info"
        @success="refresh1"
        @close="handleCloseInfo"
      />
    </AppDialog>
    <!-- 合同信息 -->
    <ContractDialog ref="contractRef" @search="getContractDetail" />
  </div>
</template>
<script>
import {
  listByApplyId,
  listByOrganizationId,
  beforeOpenComplete,
  beforeGetOrganizationDetail,
  getOrganizationDetail,
  orgContractDetailApi
} from '@/api/organization/settings.js'
import AppDialog from '@/components/AppDialog'
import Set from './setDialog.vue'
import Base from './base.vue'
import Edit from './editDialog.vue'
import Contract from './contract.vue'
import ContractDialog from './contractDialog.vue'

export default {
  components: {
    AppDialog,
    Set,
    Base,
    Edit,
    Contract,
    ContractDialog
  },
  props: {
    type: {
      type: String,
      default: '1' // 1 申请 2 已入驻
    },
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      visibleConfig: {
        visible: false,
        config: {},
        title: ''
      },
      baseInfoConfig: {
        visible: false,
        info: {}
      },
      organizationList: [],
      detailData: {},
      isContract: -1, // 是否上传合同 0 未上传 1 已上传 -1 状态未确认
      contractData: {}, // 合同信息
      baseInfoFinished: false
    }
  },

  computed: {
    finishedList() {
      const l = this.organizationList.filter(i => i.isFinished === 1).length
      if (this.baseInfoFinished) return l + 1
      return l
    },
    isFinished() {
      return this.finishedList === this.organizationList.length + 1
    },
    id() {
      return this.type === '1' ? this.info.id : this.info.organizationId
    }
  },
  created() {
    const apis = [this.getDetail(), this.getList()]
    if (this.type === '2') {
      apis.push(this.getContractDetail())
    }
    Promise.all(apis)
  },
  methods: {
    async getDetail() {
      const Pro =
        this.type === '1' ? beforeGetOrganizationDetail : getOrganizationDetail
      const { data } = await Pro(this.id)
      this.detailData = { ...data, typeName: data.type === 1 ? '企业' : '个人' }
      if (this.detailData.bigLogo) {
        this.baseInfoFinished = true
      }
    },
    async getContractDetail() {
      const res = await orgContractDetailApi(this.id)
      this.contractData = res.data || {}
      this.isContract = res.data ? 1 : 0
    },
    async getList() {
      this.loading = true
      const Pro = this.type === '1' ? listByApplyId : listByOrganizationId
      const res = await Pro(this.id).finally(() => {
        this.loading = false
      })
      this.organizationList = res.data
    },
    handleSet(item, config) {
      this.visibleConfig = {
        visible: true,
        title: item.settingsName,
        config: {
          isVerifiable: item.isVerifiable,
          settingsDefId: item.settingsDefId,
          organizationId: item.organizationId,
          institutionalApplyId: item.institutionalApplyId,
          isFinished: item.isFinished,
          isOpened: item.isOpened,
          isOptional: item.isOptional,
          settingsValues: config,
          type: this.type
        }
      }
    },
    handleUpdataBaseInfo() {
      this.baseInfoConfig = {
        visible: true,
        info: this.detailData
      }
    },
    handleUpdataContractnfo() {
      this.$refs.contractRef.openDialog({
        organizationId: this.info.organizationId
      })
    },
    handleSuccessSet() {
      this.$refs.SetRef.handleSaveSetting()
    },
    refresh() {
      this.visibleConfig.visible = false
      this.baseInfoConfig.visible = false
      this.getList()
    },
    refresh1() {
      this.visibleConfig.visible = false
      this.baseInfoConfig.visible = false
      this.baseInfoFinished = true
      this.getList()
      this.getDetail()
    },
    handleCloseSet() {
      this.visibleConfig.visible = false
    },
    handleCloseInfo() {
      this.baseInfoConfig.visible = false
    },
    handleSubmit() {
      this.$confirm(`确认完成开通吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await beforeOpenComplete(this.id)
          this.$message.success('开通完成')
          this.$emit('success')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content {
  height: calc(100vh - 77px - 50px);
  width: 100%;
  overflow: auto;
  padding: 0 25px;
  box-sizing: border-box;
}

.box {
  background: #f3f7fa;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #d8dce5;
  padding: 14px 20px 20px 0;
}

.title {
  line-height: 28px;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  margin: 13px 0;
  display: flex;

  > div {
    margin-left: 35px;

    > span {
      color: rgba(255, 125, 0, 1);

      &.isFinished {
        color: #10c400;
      }
    }
  }
}

.title1 {
  padding-left: 20px;
}

.flex-box {
  // flex: 1 0 50%;
  display: inline-flex;
  width: 50%;
}

.text-l {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 28px;
  text-align: right;
  flex: 0 0 120px;
}

.text-r {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 28px;
  word-break: break-all;
  white-space: pre-wrap;
  text-align: left;
}

.drawer__footer {
  text-align: right;
  padding-right: 20px;
  padding-bottom: 20px;
  margin-top: 30px;
}

// ::v-deep .ss-material-box-bottom {
//   height: 0;
// }
</style>
