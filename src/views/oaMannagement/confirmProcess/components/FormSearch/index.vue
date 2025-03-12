<template>
  <el-form ref="form" :model="form" inline size="small">
    <el-form-item label="资产类型" prop="assetType">
      <el-select
        v-model="form.assetType"
        clearable
        placeholder="请选择资产类型"
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in assetTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="创建人" prop="createUserId">
      <el-select
        v-model="form.createUserId"
        placeholder="请输入创建人"
        filterable
        clearable
        :remote-method="remoteMethodIssuer"
        remote
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in renderIssuerList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="创建时间">
      <el-date-picker
        v-model="form.createTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="yyyy-MM-dd"
        @change="handleChangeCreateTime"
      />
    </el-form-item>
    <el-form-item label="确认状态" prop="confirmStatus">
      <el-select
        v-model="form.confirmStatus"
        clearable
        placeholder="请选择状态"
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in confirmStatusOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleClickSearch">查询</el-button>
      <el-button @click="handleClickReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { userNoPage } from '@/api/addressBookApi'
import { assetTypeOption, confirmStatusOption } from '../../constants'

export default {
  data() {
    return {
      form: {
        createTime: [],
        assetType: '',
        createUserId: '',
        confirmStatus: '',
        createEndTime: '',
        createStartTime: ''
      },
      userList: [],
      renderIssuerList: [],
      assetTypeOption,
      confirmStatusOption
    }
  },
  mounted() {
    this.queryUserNoPage()
  },
  methods: {
    handleClickSearch() {
      this.$emit('search', this.form)
    },
    handleClickReset() {
      this.form = {
        createTime: [],
        assetType: '',
        createUserId: '',
        confirmStatus: '',
        createEndTime: '',
        createStartTime: ''
      }
      this.$refs.form.resetFields()
      this.$emit('clearSelectList')
      this.$emit('search', this.form)
    },
    async queryUserNoPage() {
      const res = await userNoPage()
      this.userList = res.data
      this.renderIssuerList = res.data
    },
    remoteMethodIssuer(query) {
      this.renderIssuerList = []
      this.renderIssuerList = this.remoteMethod(query)
    },
    remoteMethod(query) {
      let list = []
      if (query !== '') {
        list = this.userList.filter(item => {
          return item.nickName.indexOf(query) > -1
        })
      }
      return list
    },
    getSearchForm() {
      return this.form
    },
    setSearchForm(data) {
      this.form = { ...this.form, ...data }
    },
    handleChangeCreateTime(value) {
      if (value === null) {
        this.form.createStartTime = ''
        this.form.createEndTime = ''
        this.handleClickSearch()
        return
      }
      this.form.createStartTime = value[0]
      this.form.createEndTime = value[1]
      this.handleClickSearch()
    }
  }
}
</script>
