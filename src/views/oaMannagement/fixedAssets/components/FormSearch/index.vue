<template>
  <el-form ref="form" size="small" :inline="true" :model="form">
    <el-form-item label="资产信息" prop="assetInfoValue">
      <div class="flex">
        <el-select
          v-model="form.assetInfoType"
          class="input-with-select input-with-select-chang"
          @change="onhandleAssetInfoType"
        >
          <el-option
            v-for="item in assetInfoList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        <el-input
          v-model="form.assetInfoValue"
          class="input-with-input"
          placeholder="请输入"
          style="width: 160px"
          clearable
          @clear="handleClickQuery"
          @change="handleChangeAssetInfoValue"
        />
      </div>
    </el-form-item>
    <el-form-item label="购置人" prop="purchaseUserId">
      <el-select
        v-model="form.purchaseUserId"
        clearable
        placeholder="请输入购置人"
        filterable
        :remote-method="remoteMethodPurchaseUser"
        remote
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in renderPurchaseUserList"
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
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in renderOccupantUserList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
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
    <el-form-item label="资产类型" prop="assetType">
      <el-select
        v-model="form.assetType"
        clearable
        placeholder="请选择资产类型"
        @change="handleChangeAssetType"
      >
        <el-option
          v-for="item in assetsTypeList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="form.assetSubtype"
        class="m-l-20"
        placeholder="请选择资产子类型"
        clearable
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in assetsTypeChildrenList"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="使用状态" prop="state">
      <el-select
        v-model="form.state"
        clearable
        placeholder="请选择使用状态"
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in userStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="原使用人" prop="originalOccupantUserId">
      <el-select
        v-model="form.originalOccupantUserId"
        clearable
        placeholder="请输入原使用人"
        filterable
        :remote-method="remoteMethodOrgOccupantUser"
        remote
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in renderOrgOccupantUserList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="资产使用/存放城市" prop="cityCode">
      <el-select
        v-model="form.cityCode"
        clearable
        filterable
        placeholder="请选择资产使用/存放城市"
        @change="handleClickQuery"
      >
        <el-option
          v-for="item in querySelectCityList"
          :key="item.cityCode"
          :label="`${item.provinceName}/${item.cityName}`"
          :value="item.cityCode"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleClickQuery">查询</el-button>
      <el-button @click="handleClickReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { userStatus } from '../../constants'
import { deptTree, userNoPage } from '@/api/addressBookApi'
import { assetTypeList, selectCity } from '../../../api/assets.js'
export default {
  data() {
    return {
      form: {
        assetInfoType: 0,
        assetInfoValue: '',
        assetCode: undefined, // 资产编号
        assetName: undefined, // 资产名称
        occupantUserId: undefined, // 使用人编号
        occupantDeptIds: [], // 使用部门ID
        occupantDeptId: undefined, // 使用部门ID
        purchaseUserId: undefined, // 购置人ID
        state: undefined, // 使用状态：1-良好，2-闲置，3-报废，4-损坏未废，5-丢失，6-闲置无归属，7-丢失已赔偿
        assetType: undefined, // 资产类型id
        assetSubtype: undefined, // 资产子类型id
        cityCode: undefined,
        originalOccupantUserId: undefined // 原使用人
      },
      userStatusList: userStatus,
      assetInfoList: [
        { label: '名称', value: 1 },
        { label: '编号', value: 0 }
      ],
      assetsTypeList: [],
      assetsTypeChildrenList: [],
      deptTreeArray: [],
      userList: [],
      renderPurchaseUserList: [],
      renderOccupantUserList: [],
      querySelectCityList: [],
      renderOrgOccupantUserList: []
    }
  },
  mounted() {
    this.getDeptTree()
    this.queryUserNoPage()
    this.queryAssetTypeList()
    this.querySelectCity()
  },
  methods: {
    async querySelectCity() {
      const res = await selectCity()
      this.querySelectCityList = res.data
    },
    // 搜索
    handleClickQuery() {
      this.$emit('query', this.form)
    },
    getSearchForm() {
      return this.form
    },
    setSearchForm(data) {
      this.form = { ...this.form, ...data }
    },
    // 重置
    handleClickReset() {
      this.form = {
        assetInfoType: 0,
        assetInfoValue: '',
        assetCode: undefined, // 资产编号
        assetName: undefined, // 资产名称
        occupantUserId: undefined, // 使用人编号
        occupantDeptIds: [], // 使用部门ID
        occupantDeptId: undefined, // 使用部门ID
        purchaseUserId: undefined, // 购置人ID
        state: undefined, // 使用状态：1-良好，2-闲置，3-报废，4-损坏未废，5-丢失，6-闲置无归属，7-丢失已赔偿
        assetType: undefined, // 资产类型id
        assetSubtype: undefined, // 资产子类型id
        cityCode: undefined,
        originalOccupantUserId: undefined // 原使用人
      }
      this.assetsTypeChildrenList = []
      this.renderOccupantUserList = []
      this.renderPurchaseUserList = []
      this.renderOrgOccupantUserList = []
      this.$refs.form.resetFields()
      // this.$emit('clearSelectList')
      this.handleClickQuery()
    },
    handleChangeAssetInfoValue() {
      const assetInfoType = this.form.assetInfoType
      if (assetInfoType === 1) {
        this.form.assetName = this.form.assetInfoValue
      } else if (assetInfoType === 0) {
        this.form.assetCode = this.form.assetInfoValue
      }
    },
    async queryAssetTypeList() {
      const res = await assetTypeList()
      this.assetsTypeList = res.data
      // //设置子资产类型
      const assetType = this.form.assetType
      let list = []
      this.assetsTypeList.forEach(item => {
        if (item.id === assetType) {
          list = item.children
        }
      })
      this.assetsTypeChildrenList = list
    },
    handleChangeAssetType(val) {
      let list = []
      this.assetsTypeList.forEach(item => {
        if (item.id === val) {
          list = item.children
        }
      })
      this.form.assetSubtype = undefined
      this.assetsTypeChildrenList = list
      this.handleClickQuery()
    },
    async queryUserNoPage() {
      const res = await userNoPage()
      this.userList = res.data
      this.renderPurchaseUserList = res.data
      this.renderOccupantUserList = res.data
      this.renderOrgOccupantUserList = res.data
    },
    async getDeptTree() {
      const res = await deptTree()
      const list = this.encapsulateData(res.data)
      this.deptTreeArray = list
    },
    remoteMethodPurchaseUser(query) {
      this.renderPurchaseUserList = []
      this.renderPurchaseUserList = this.remoteMethod(query)
    },
    remoteMethodOccupantUser(query) {
      this.renderOccupantUserList = []
      this.renderOccupantUserList = this.remoteMethod(query)
    },
    remoteMethodOrgOccupantUser(query) {
      this.renderOrgOccupantUserList = []
      this.renderOrgOccupantUserList = this.remoteMethod(query)
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
    changeCascader() {
      // this.form.occupantDeptId =
      //   this.form.occupantDeptIdList[this.form.occupantDeptIdList.length - 1]
      this.handleClickQuery()
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
    // 资产信息下拉搜索变化
    onhandleAssetInfoType() {
      this.form.assetName = ''
      this.form.assetCode = ''
      this.form.assetInfoValue = ''
      this.handleClickQuery()
    }
    // handleChangePurchaseUser() {
    //   this.handleClickQuery()
    // },
    // handleChangeOccupantUser() {
    //   this.handleClickQuery()
    // }
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
</style>
