<template>
  <el-form ref="form" :model="form" inline size="small">
    <el-form-item label="手机号" prop="phoneNumber">
      <el-input
        v-model="form.phoneNumber"
        clearable
        placeholder="请输入手机号码"
        @clear="handleClickSearch"
      />
    </el-form-item>
    <el-form-item label="开卡人" prop="issuerId">
      <el-select
        v-model="form.issuerId"
        placeholder="请输入开卡人"
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
    <el-form-item label="使用人" prop="occupantUserId">
      <el-select
        v-model="form.occupantUserId"
        clearable
        placeholder="请输入使用人"
        filterable
        :remote-method="remoteMethodOccupantUser"
        remote
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in renderOccupantUserList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="使用状态" prop="state">
      <el-select
        v-model="form.state"
        clearable
        placeholder="请选择使用状态"
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in userStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="开卡地" prop="cityCode">
      <el-select
        v-model="form.cityCode"
        clearable
        filterable
        placeholder="请选择地点"
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in querySelectCityList"
          :key="item.cityCode"
          :label="`${item.provinceName}/${item.cityName}`"
          :value="item.cityCode"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="使用部门" prop="occupantDeptIds">
      <el-cascader
        v-model="form.occupantDeptIds"
        placeholder="请选择使用部门"
        :options="deptTreeArray"
        :props="{ multiple: true, emitPath: false, checkStrictly: true }"
        clearable
        @change="changeCascader"
      />
    </el-form-item>
    <el-form-item label="通信公司" prop="communicationCompany">
      <el-select
        v-model="form.communicationCompany"
        clearable
        placeholder="请选择通信公司"
        @change="handleClickSearch"
      >
        <el-option
          v-for="item in communicationCompanyList"
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
import { userNoPage, deptTree } from '@/api/addressBookApi'
import { communicationCompanyList } from '../../constants'
import { cardSelectCityAjax } from '../../../api/card.js'

export default {
  data() {
    return {
      userStatusList: [
        { label: '使用中', value: 0 },
        { label: '未使用', value: 1 },
        { label: '闲置', value: 2 },
        { label: '已注销', value: 3 }
      ],
      form: {
        phoneNumber: '', // 手机号
        issuerId: '', // 开开人
        occupantUserId: '', // 使用人
        state: '', // 使用状态:0-使用中、1-未使用、2-闲置、3-已注销
        communicationCompany: '',
        occupantDeptIds: []
      },
      userList: [],
      renderIssuerList: [],
      renderOccupantUserList: [],
      communicationCompanyList,
      deptTreeArray: [],
      querySelectCityList: []
    }
  },
  mounted() {
    this.getDeptTree()
    this.querySelectCity()
    this.queryUserNoPage()
  },
  methods: {
    handleClickSearch() {
      this.$emit('search', this.form)
    },
    handleClickReset() {
      this.form = {
        phoneNumber: '', // 手机号
        issuerId: '', // 开开人
        occupantUserId: '', // 使用人
        state: '', // 使用状态:0-使用中、1-未使用、2-闲置、3-已注销
        communicationCompany: '',
        cityCode: undefined,
        occupantDeptIds: []
      }
      this.$refs.form.resetFields()
      // this.$emit('clearSelectList')
      this.$emit('search', this.form)
    },
    async queryUserNoPage() {
      const res = await userNoPage()
      this.userList = res.data
      this.renderIssuerList = res.data
      this.renderOccupantUserList = res.data
    },
    remoteMethodIssuer(query) {
      this.renderIssuerList = []
      this.renderIssuerList = this.remoteMethod(query)
    },
    remoteMethodOccupantUser(query) {
      this.renderOccupantUserList = []
      this.renderOccupantUserList = this.remoteMethod(query)
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
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        // array[i].disabled = true
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    async getDeptTree() {
      const res = await deptTree()
      const list = this.encapsulateData(res.data)
      this.deptTreeArray = list
    },
    changeCascader() {
      // this.form.occupantDeptId =
      //   this.form.occupantDeptIdList[this.form.occupantDeptIdList.length - 1]
      this.handleClickSearch()
    },
    async querySelectCity() {
      const res = await cardSelectCityAjax()
      this.querySelectCityList = res.data
    }
  }
}
</script>
