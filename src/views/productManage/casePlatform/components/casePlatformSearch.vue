<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <el-form :inline="true" :model="casePlatform" class="demo-form-inline">
      <el-form-item label="平台类型或名称：">
        <el-cascader
          ref="myCascader"
          v-model="ptOrName"
          :options="ptOrNameOption"
          :props="{ checkStrictly: true }"
          clearable
          @change="choosept"
        />
      </el-form-item>
      <el-form-item label="网站/账号名称：">
        <el-input v-model="casePlatform.accountName" maxlength="20" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sureSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item class="right-float">
        <p v-permission="['web:casePlatform:add', permsList]" class="right-tools" @click="addDelivery">
          <i class="el-icon-plus" />
          新增</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAccount } from '@/api/product/setting'
export default {
  name: 'CasePlatformSearch',
  // eslint-disable-next-line vue/require-prop-types
  props: [],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      ptOrNameOption: [],
      ptOrName: [],
      casePlatform: {
        accountName: '',
        pageIndex: 1,
        pageSize: 10,
        platformTypeCode: '',
        platformCode: '',
        platformName: '',
        platformTypeName: ''
      }
    }
  },
  computed: {},
  created() {
    this.loadAccountData()
  },
  methods: {
    loadAccountData() {
      getAccount().then((res) => {
        this.ptOrNameOption = []
        res.data.forEach((element) => {
          element.value = element.catalogCode
          element.label = element.catalogName
          if (element.level === 1) {
            this.ptOrNameOption.push(element)
          }
        })
        this.ptOrNameOption.forEach((item) => {
          const childrens = []
          res.data.forEach((obj) => {
            if (item.id === obj.parentId) {
              childrens.push(obj)
            }
          })
          item.children = childrens
        })
      })
    },
    choosept(val) {
      console.log(val)
      this.ptOrName = val
      this.changeSearchForm()
      this.sureSearch()
    },
    changeSearchForm() {
      if (this.ptOrName.length === 0) {
        this.casePlatform.platformCode = ''
        this.casePlatform.platformTypeCode = ''
      } else if (this.ptOrName.length === 1) {
        this.casePlatform.platformCode = ''
        this.casePlatform.platformTypeCode = this.ptOrName[0]
      } else if (this.ptOrName.length === 2) {
        this.casePlatform.platformCode = this.ptOrName[1]
        this.casePlatform.platformTypeCode = this.ptOrName[0]
      }
    },
    sureSearch() {
      this.casePlatform.pageIndex = 1
      this.$emit('search', this.casePlatform)
    },
    addDelivery() {
      this.$emit('addDelivery')
    },
    clear() {
      const res = {
        accountName: '',
        pageIndex: 1,
        pageSize: 10,
        platformTypeCode: '',
        platformCode: '',
        platformName: '',
        platformTypeName: ''
      }
      console.log(res)
      this.$refs.myCascader.$refs.panel.checkedValue = []
      this.casePlatform.accountName = ''
      this.casePlatform.platformCode = ''
      this.casePlatform.platformTypeCode = ''
      this.$emit('search', res)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  position: relative;
  padding: 15px;
}
.tools-block {
  width: 100%;
  height: 40px;
}
.tools-search {
  float: right;
}

.right-float {
  float: right;
  margin-right: 0px;
}
.right-tools {
  float: right;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #0C6FFF;
  color: #0C6FFF;
  background: none!important;
}

</style>
