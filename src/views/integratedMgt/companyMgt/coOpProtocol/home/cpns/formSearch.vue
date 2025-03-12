<template>
  <el-form ref="coOpProtocolForm" size="small" :inline="true" :model="form">
    <el-form-item label="协议名称" prop="agreementName">
      <el-input
        v-model="form.agreementName"
        placeholder="请输入协议名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="协议编号" prop="agreementCode">
      <el-input
        v-model="form.agreementCode"
        placeholder="请输入协议编号"
        clearable
      />
    </el-form-item>
    <el-form-item label="供应机构" prop="supplierOrgId">
      <el-select
        v-model="form.supplierOrgId"
        clearable
        filterable
        placeholder="请选择供应机构"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in supplierOrgList"
          :key="item.orgId"
          :label="item.orgName"
          :value="item.orgId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="合作机构" prop="cpOrgId">
      <el-select
        v-model="form.cpOrgId"
        clearable
        filterable
        placeholder="请选择合作机构"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in cpOrgList"
          :key="item.orgId"
          :label="item.orgName"
          :value="item.orgId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="合作范围" prop="coopScope">
      <el-select
        v-model="form.coopScope"
        clearable
        filterable
        placeholder="请选择合作范围"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in cpOrgRangeList"
          :key="item.code"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="协议状态" prop="status">
      <el-select
        v-model="form.status"
        clearable
        filterable
        placeholder="请选择协议状态"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in auditList"
          :key="item.status"
          :label="item.statusName"
          :value="item.status"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="时间搜索">
      <el-date-picker
        v-model="form.time"
        class="w-250"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :unlink-panels="true"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleClickQuery">查询</el-button>
      <el-button @click="handleClickReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {
  agreementSupplierListApi,
  agreementCpOrgListTreeApi,
  statusListApi,
  coopScopeListApi
} from '@/api/coOpProtocol/index.js'
import { finishTableJson } from '../../data'
export default {
  data() {
    return {
      form: JSON.parse(JSON.stringify(finishTableJson.searchInfo)),
      auditList: [], // 审核状态搜索项
      cpOrgList: [], // 合作机构搜索项
      cpOrgRangeList: [], // 合作范围搜索项
      supplierOrgList: [] // 供应机构搜索项
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 合作机构
      agreementCpOrgListTreeApi().then(res => {
        this.cpOrgList = res.data || []
      })
      // 供应机构
      agreementSupplierListApi().then(res => {
        this.supplierOrgList = res.data || []
      })
      // 审核状态
      statusListApi().then(res => {
        this.auditList = res.data || []
      })
      // 合作范围
      coopScopeListApi().then(res => {
        this.cpOrgRangeList = res.data || []
      })
    },
    searchInfo() {
      return {
        agreementCode: this.form.agreementCode || undefined,
        agreementName: this.form.agreementName || undefined,
        status: this.form.status || undefined,
        cpOrgId: this.form.cpOrgId || undefined,
        coopScope: this.form.coopScope || undefined,
        endDate: this.form.time ? this.form.time[1] : undefined,
        startDate: this.form.time ? this.form.time[0] : undefined,
        supplierOrgId: this.form.supplierOrgId || undefined
      }
    },
    // 搜索
    handleClickQuery() {
      this.$emit('search')
    },
    // 重置
    handleClickReset() {
      this.$refs.coOpProtocolForm.resetFields()
      this.form = JSON.parse(JSON.stringify(finishTableJson.searchInfo))
      this.handleClickQuery()
    },
    forceUpdate() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 88px;
  height: 32px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-radius: 3px 0px 0px 3px;
}
.input-with-select-chang {
  ::v-deep .el-input__inner {
    border: none;
    border-radius: 3px 0px 0px 3px;
    border: 1px solid #d8dce6 !important;
    border-right: none !important;
  }
}
.input-with-input {
  ::v-deep .el-input__inner {
    border-radius: 0px 3px 3px 0px;
  }
}
::v-deep label.el-form-item__label {
  font-weight: 500;
  color: #333;
}
</style>
