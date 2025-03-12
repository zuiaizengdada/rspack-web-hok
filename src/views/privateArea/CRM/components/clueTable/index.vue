<template>
  <div class="listBox">
    <el-form :inline="true" size="small" :model="form" class="demo-form-inline">
      <el-form-item label="渠道">
        <el-select
          v-model="form.platformId"
          style="width: 180px"
          placeholder="渠道"
          filterable
          clearable
          :disabled="disabled"
          @change="changePlatform"
        >
          <el-option
            v-for="item in channelOptions"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投放账号">
        <el-select
          v-model="form.adAccountId"
          style="width: 180px"
          placeholder="投放账号"
          filterable
          clearable
          :disabled="disabled"
          :remote="Boolean(!form.platformId)"
          :remote-method="queryAdvertiserListByKeyword"
          :loading="adAccountLoading"
          @change="changeAdAccount"
        >
          <el-option
            v-for="item in advertiserOptions"
            :key="`${item.advertiserName}(${item.advertiserId})`"
            :label="`${item.advertiserName}(${item.advertiserId})`"
            :value="item.advertiserId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投放计划">
        <el-select
          v-model="form.adPlanId"
          style="width: 180px"
          placeholder="投放计划"
          filterable
          clearable
          :disabled="disabled"
          remote
          :remote-method="queryAdPlanListByKeyword"
          :loading="planLoading"
        >
          <el-option
            v-for="item in planOptions"
            :key="`${item.planName}(${item.planId})`"
            :label="`${item.planName}(${item.planId})`"
            :value="item.planId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="城市">
        <el-cascader
          ref="cascader"
          v-model="form.city"
          :disabled="disabled"
          :options="options"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button
          type="primary"
          style="margin-left: 20px"
          :disabled="disabled"
          @click="add"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #action="{ row }">
        <el-button
          class="delete-r"
          :disabled="disabled"
          type="text"
          @click="del(row)"
        >删除</el-button>
      </template>
      <template #submitBtn>
        <el-button type="primary" :disabled="disabled" @click="add">新增</el-button>
      </template>
    </dynamicTable>
    <clueDialog ref="clueDialog" @success="handleSuccess" />
  </div>
</template>
<script>
import dynamicTable from '@/components/DynamicTable/table'
import clueDialog from './clueDialog'
import { getColumns } from './column'
import {
  queryAdvertiserList,
  queryChannelList,
  saleTaskInfoFlowConditionDoPage,
  saleTaskInfoFlowConditionDoRemove,
  queryAdPlanListByKeyword,
  queryAdvertiserListByKeyword,
  areaCodeList
} from '@/api/privateArea/CRM'
export default {
  components: {
    dynamicTable,
    clueDialog
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      form: {
        city: '',
        adPlan: '',
        taskId: '',
        platformId: '',
        adAccountId: '',
        adPlanId: ''
      },
      loading: false,
      visible: false,
      options: [],
      channelOptions: [],
      advertiserOptions: [],
      planOptions: [],
      adAccountLoading: false,
      planLoading: false,
      disabled: false
    }
  },
  created() {
    this.getAreaList()
    this.queryChannelList()
    this.queryAdPlanListByKeyword()
    this.queryAdvertiserListByKeyword()
  },
  methods: {
    del(row) {
      this.$delModal({
        tips: '确定删除？',
        success: async () => {
          const { code } = await saleTaskInfoFlowConditionDoRemove({
            taskId: this.form.taskId,
            id: row.id
          })
          if (code === 1) {
            this.$message.success('删除成功')
          }
          this.$refs.table.onRefresh()
        }
      })
    },
    getList(params) {
      let adChannel
      this.channelOptions.forEach(i => {
        if (this.form.platformId === i.platformId) {
          adChannel = i.platformName
        }
      })
      const city = this.form.city
        ? this.form.city[this.form.city.length - 1]
        : undefined
      return saleTaskInfoFlowConditionDoPage({
        ...params,
        adAccountId: this.form.adAccountId || undefined,
        adChannel,
        adPlanId: this.form.adPlanId || undefined,
        taskId: this.form.taskId,
        city
      })
    },
    async queryAdPlanListByKeyword(keyword = '') {
      this.planLoading = true
      const { data } = await queryAdPlanListByKeyword({
        keyword,
        platformId: this.form.platformId || undefined,
        advertiserId: this.form.adAccountId || undefined,
        pageIndex: 1,
        pageSize: 100
      })
      this.planOptions = data?.items ?? []
      this.planLoading = false
    },
    async queryAdvertiserListByKeyword(keyword = '') {
      this.adAccountLoading = true
      const { data } = await queryAdvertiserListByKeyword({
        keyword,
        pageIndex: 1,
        pageSize: 100
      })
      if (!this.form.platformId) {
        this.advertiserOptions = data?.items ?? []
      }
      this.adAccountLoading = false
    },
    changePlatform() {
      if (this.form.platformId) {
        this.queryAdvertiserList()
        this.queryAdPlanListByKeyword()
      } else {
        this.queryAdvertiserListByKeyword()
      }
      this.form.adPlanId = ''
      this.form.adAccountId = ''
    },
    async queryAdvertiserList() {
      if (!this.form.platformId) return
      const { data } = await queryAdvertiserList({
        platformId: this.form.platformId || undefined
      })
      this.advertiserOptions = data
    },
    async queryChannelList() {
      const { data } = await queryChannelList()
      this.channelOptions = data
    },
    changeAdAccount() {
      this.queryAdPlanListByKeyword()
      this.form.adPlanId = ''
    },
    getAreaList() {
      const params = [
        areaCodeList({
          level: 0
        }),
        areaCodeList({
          level: 1
        })
      ]
      Promise.all(params)
        .then(res => {
          const options = res[1].data
          this.options = res[0].data.map(i => {
            return {
              value: i.shortName,
              label: i.shortName,
              id: i.areaCode,
              children: []
            }
          })
          this.options.forEach(i => {
            options.forEach(j => {
              if (i.id === j.parentCode) {
                i.children.push({
                  value: j.shortName,
                  label: j.shortName,
                  id: j.areaCode,
                  children: null
                })
              }
            })
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    reset() {
      this.form = {
        city: '',
        adPlan: '',
        taskId: this.form.taskId,
        platformId: '',
        adAccountId: '',
        adPlanId: ''
      }
    },
    handleSuccess(taskId) {
      this.form.taskId = taskId
      this.$refs.table.onRefresh()
    },
    add() {
      this.$refs.clueDialog.open(this.form.taskId)
    },
    search(isDisabled = false) {
      // 详情的时候不能编辑
      this.disabled = isDisabled === true
      this.$refs.table.onRefresh()
    }
  }
}
</script>
<style lang="scss" scoped>
.listBox::v-deep {
  height: 480px;
  padding: 20px;
  display: flex;
  margin: 0 20px 20px;
  flex-direction: column;
  border: 1px solid #d8dce6;
  border-radius: 6px;
  .el-table th.el-table__cell {
    background: #f2f9ff !important;
  }
  .table_container {
    flex: 1;
  }
  .filter-container {
    padding: 0px;
  }
  .page_footer {
    padding: 0px !important;
  }
  .el-table {
    border-radius: 6px;
    min-height: 300px !important;
    border: 1px solid #d8dce6;
  }
}
</style>
