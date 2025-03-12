<template>
  <el-form ref="coOpProtocolForm" size="small" :inline="true" :model="form">
    <el-form-item label="视频名称" prop="videoName">
      <el-input
        v-model="form.videoName"
        placeholder="请输入视频名称"
        clearable
      />
    </el-form-item>
    <el-form-item label="IP" prop="teacherId">
      <el-select v-model="form.teacherId" clearable placeholder="请选择IP">
        <el-option
          v-for="item in ipList"
          :key="item.teacherId"
          :label="item.teacherName"
          :value="item.teacherId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="内容来源" prop="supplierOrgId">
      <el-select
        v-model="form.supplierOrgId"
        clearable
        placeholder="请选择内容来源"
      >
        <el-option
          v-for="item in supplierOrgList"
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
  getSupplierOrgListApi,
  getVideoIpListApi
} from '@/api/videoManagement/vedioSetting.js'

import { MeTableJson } from '../../data'
export default {
  data() {
    return {
      form: MeTableJson.form,
      channelSourceList: [], // 发布渠道
      supplierOrgList: [], // 来源列表
      ipList: [] // ip列表
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 内容来源
      getSupplierOrgListApi({ type: 1 }).then(res => {
        this.supplierOrgList = res.data || []
      })
      // ip列表
      getVideoIpListApi().then(res => {
        this.ipList = res.data || []
      })
    },
    searchInfo() {
      return {
        channelSource: this.form.channelSource || undefined,
        videoName: this.form.videoName || undefined,
        teacherId: this.form.teacherId || undefined,
        endTime: this.form.time[1] || undefined,
        startTime: this.form.time[0] || undefined,
        supplierOrgId: this.form.supplierOrgId || undefined
      }
    },
    // 搜索
    handleClickQuery() {
      this.$emit('search')
    },
    // 重置
    handleClickReset() {
      this.form.time = []
      this.$refs.coOpProtocolForm.resetFields()
      this.handleClickQuery()
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
