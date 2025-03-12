<template>
  <div class="wrapper">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="{ path: '/orgSettlement/setMealModule' }">
          <span style="color: #777777">数字人</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>消费记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider />
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #orgId>
        <el-select
          v-model="formOpts.formData.orgId"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </template>
    </HokSearchForm>
    <CustomTable
      ref="customTableRef"
      height="490px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import CustomTable from '@/components/baseCpns/table'
import { columns, formConfig } from './columns'
import {
  getConsumeRecordPage,
  getOrganizationByName
} from '@/api/aiVideoManage/setMealModule'
import moment from 'moment'
export default {
  name: 'OrgListDialog',
  components: {
    HokSearchForm,
    CustomTable
  },
  data() {
    return {
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: { plain: true },
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
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      orgList: []
    }
  },
  created() {
    this.formOpts.formData.orgId = this.$route.query?.orgId
      ? Number(this.$route.query?.orgId)
      : undefined
  },
  mounted() {
    this.searchFn()
    this.getOrganizationByName()
  },
  methods: {
    getOrganizationByName() {
      getOrganizationByName({ searchKey: '' })
        .then(res => {
          const { data } = res
          this.orgList = data
        })
        .catch(() => {})
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {}

        // this.formOpts.formData.orgId = this.$route.query?.orgId
        //   ? Number(this.$route.query?.orgId)
        //   : undefined
      }

      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        orgId: this.formOpts.formData.orgId
      }
      return new Promise((resolve, reject) => {
        getConsumeRecordPage(params).then(res => {
          res.data.items.forEach(item => {
            item.consumeTime = item.consumeTime
              ? moment(item.consumeTime).format('YYYY-MM-DD HH:mm:ss')
              : undefined
            item.consumeTypeName =
              item.consumeType === 1
                ? '采购形象克隆'
                : item.consumeType === 2
                  ? '声音克隆'
                  : item.consumeType === 3
                    ? '视频生成'
                    : '形象训练声音时长'
            const dw =
              item.consumeType === 1 || item.consumeType === 2 ? '次' : '分钟'
            item.consumeCount = item.consumeCount + dw
          })
          resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  background-color: #fff;
  padding: 20px;
}
.footer {
  position: absolute;
  height: 68px;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .org-list-dialog {
    .el-drawer__header {
      padding-bottom: 20px !important;
      margin-bottom: 0 !important;
      border-bottom: 1px solid #eff2f6;
      span {
        font-size: 16px;
        color: #000;
        font-weight: 600;
        font-family: 'Microsoft YaHei';
        letter-spacing: 1px;
      }
    }
    .el-drawer__body {
      padding: 20px 23px 68px 23px;
    }
  }
}
</style>
