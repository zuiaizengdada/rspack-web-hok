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
import eleSealAgreement from './components/eleSealAgreement/index'
import { electronicSealPageListAjax } from '@/views/oaMannagement/api/badge.js'

export default {
  name: 'BadgeManagement',

  components: { eleSealAgreement },
  data() {
    return {
      electronicSealCount: '',
      tabConfigList: [],
      currentComponent: 'eleSealAgreement'
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
        this.currentComponent = 'eleSealAgreement'
      }
    },
    async getTabListCount() {
      const { data } = await electronicSealPageListAjax({
        pageIndex: 1,
        pageSize: 10
      })
      this.electronicSealCount = data.total
      // 在数据获取后再初始化 tabConfigList
      this.tabConfigList = [
        {
          name: 'eleSealAgreement',
          label: `电子公章（${this.electronicSealCount}）`
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
