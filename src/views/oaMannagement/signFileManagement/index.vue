<template>
  <div class="talent-file hoc-main-height">
    <el-tabs v-model="currentComponent">
      <el-tab-pane
        v-for="item in tabConfigList"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      />
      <keep-alive class="table-cnt">
        <component :is="currentComponent" @submit="getTabListCount" />
      </keep-alive>
    </el-tabs>
  </div>
</template>

<script>
import contractAgreement from './components/contractAgreement/index'
import companyAgreement from './components/companyAgreement/index'
import { signFileTabDataStaticAjax } from '@/views/oaMannagement/api/signFile.js'

export default {
  name: 'SignFileManagement',

  components: { contractAgreement, companyAgreement },
  data() {
    return {
      contractCount: '',
      companySystemCount: '',
      tabConfigList: [],
      currentComponent: 'contractAgreement'
    }
  },

  mounted() {
    this.getTabListCount()
    this.setActiveTabFromQuery()
  },
  methods: {
    setActiveTabFromQuery() {
      const currentComponent = this.$route.query.currentComponent

      if (currentComponent) {
        this.currentComponent = currentComponent
      } else {
        this.currentComponent = 'contractAgreement'
      }
    },
    async getTabListCount() {
      const { data } = await signFileTabDataStaticAjax()
      this.contractCount = data.contractCount
      this.companySystemCount = data.companySystemCount
      // 在数据获取后再初始化 tabConfigList
      this.tabConfigList = [
        {
          name: 'contractAgreement',
          label: `合同协议（${this.contractCount}）`
        },
        {
          name: 'companyAgreement',
          label: `公司制度（${this.companySystemCount}）`
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.talent-file {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  .table-cnt {
    height: calc(100% - 60px) !important;
  }
}
::v-deep .el-tabs {
  height: 100%;
}
::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}
::v-deep .el-table th.el-table-column--selection > .cell {
  display: flex;
  justify-content: space-around;
}
</style>
