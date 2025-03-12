<template>
  <el-form
    ref="desensitizationFormRef"
    size="small"
    :inline="true"
    :model="form"
  >
    <el-form-item label="视频名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入视频名称" clearable />
    </el-form-item>
    <el-form-item label="视频组名称" prop="title">
      <el-input v-model="form.title" placeholder="请输入视频组名称" clearable />
    </el-form-item>
    <el-form-item label="分发人" prop="createUserId">
      <el-select
        v-model="form.createUserId"
        clearable
        filterable
        placeholder="请选择分发人"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in createUserList"
          :key="item.userId"
          :label="item.userName"
          :value="item.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="IP" prop="teacherId">
      <el-select
        v-model="form.teacherId"
        clearable
        filterable
        placeholder="请选择IP"
        @change="forceUpdate"
      >
        <el-option
          v-for="item in ipList"
          :key="item.teacherId"
          :label="item.teacherName"
          :value="item.teacherId"
        />
      </el-select>
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
  desensitizedVideoCreateUserListApi,
  desensitizedVideoIpListApi,
  desensitizedVideoCpOrgListApi,
  desensitizedVideoSupplierOrgListApi
} from '@/api/contentDistribution/index.js'
import { desensitizationTableJson } from '../../data'

export default {
  data() {
    return {
      form: JSON.parse(JSON.stringify(desensitizationTableJson.searchInfo)),

      cpOrgList: [], // 合作机构
      createUserList: [], // 分发人列表
      ipList: [], // IP列表
      supplierOrgList: [] // 供应机构列表
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // 合作机构
      desensitizedVideoCpOrgListApi().then(res => {
        this.cpOrgList = res.data || []
      })
      // 分发人
      desensitizedVideoCreateUserListApi().then(res => {
        this.createUserList = res.data || []
      })
      // IP
      desensitizedVideoIpListApi().then(res => {
        this.ipList = res.data || []
      })
      // 供应机构
      desensitizedVideoSupplierOrgListApi().then(res => {
        this.supplierOrgList = res.data || []
      })
    },
    // 搜索
    handleClickQuery() {
      const data = { ...this.form }
      data.startTime = this.form.time ? this.form.time[0] : undefined
      data.endTime = this.form.time ? this.form.time[1] : undefined
      delete data.time
      this.$emit('search', data)
    },
    // 重置
    handleClickReset() {
      this.$refs.desensitizationFormRef.resetFields()
      this.form = JSON.parse(
        JSON.stringify(desensitizationTableJson.searchInfo)
      )
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
::v-deep label.el-form-item__label {
  font-weight: 500;
  color: #333;
}
.input-with-input {
  ::v-deep .el-input__inner {
    border-radius: 0px 3px 3px 0px;
  }
}
</style>
