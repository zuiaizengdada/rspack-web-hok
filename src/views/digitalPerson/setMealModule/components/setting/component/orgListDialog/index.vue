<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="1500px"
    append-to-body
    title="选择机构"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
    custom-class="org-list-dialog"
  >
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    />
    <CustomTable
      ref="customTableRef"
      height="578px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
      @selection-change="handleSelectionChange"
    />
    <div class="footer">
      <el-button type="primary" @click="handleSave">确定</el-button>
      <el-button @click="dialogBeforeClose">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import CustomTable from '@/components/baseCpns/table'
import { columns, formConfig } from './columns'
import { getOrgList } from '@/api/aiVideoManage/setMealModule'
export default {
  name: 'OrgListDialog',
  components: {
    HokSearchForm,
    CustomTable
  },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: () => []
    }
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
      selectedOrgIds: []
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    getDialogVisible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.searchFn()
          })
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedOrgIds = val
    },
    handleSave() {
      if (this.selectedOrgIds.length === 0) {
        this.$message.warning('请选择机构')
        return
      }
      this.$emit('submit', this.selectedOrgIds)
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
      }
      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      return new Promise((resolve, reject) => {
        getOrgList(params).then(res => {
          resolve(res)
          setTimeout(() => {
            if (this.ids.length > 0) {
              const seleteList = res.data.items.filter(item =>
                this.ids.includes(item.organizationId + '')
              )
              seleteList.forEach(item => {
                this.$refs.customTableRef.toggleRowSelection(item)
              })
            }
          }, 300)
        })
      }).catch(() => {
        // eslint-disable-next-line no-undef
        reject({
          data: [],
          total: 0
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
