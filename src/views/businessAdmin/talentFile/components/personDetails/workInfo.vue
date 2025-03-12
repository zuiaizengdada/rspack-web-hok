<template>
  <div class="workInfo-container">
    <div class="workInfo-title">主要工作经验</div>
    <baseTable
      key="workInfoTable"
      style="height: 200px; margin: 0"
      :table-data="detailBaseInfo.workExperienceList"
      :table-columns="workConfig.tableColumns"
      v-loading="loading"
    ></baseTable>
    <div class="workInfo-title m_t_16">教育培训经历</div>
    <baseTable
      key="educationExperienceTable"
      style="height: 200px;  margin: 0"
      :table-data="detailBaseInfo.educationExperienceList"
      :table-columns="getEducationColumns.tableColumns"
      v-loading="loading"
    ></baseTable>
  </div>
</template>
<script>
import baseTable from './baseTable.vue'
import { getWorkColumns, getEducationColumns } from './columns'

export default {
  components: {
    baseTable
  },
  props: {
    detailBaseInfo: {
      type: Object,
      default: () => {
        return {
          educationExperienceList: [],
          workExperienceList: [],
          personnelSelfEvaluation: {},
          personnelBaseInfo: {},
          enteringInformation: {},
          educationExperienceList: []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      workConfig: {
        tableColumns: getWorkColumns.call(this),
        tableData: []
      },
      getEducationColumns: {
        tableColumns: getEducationColumns.call(this),
        tableData: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.workInfo-container {
  margin-bottom: 16px;
  .workInfo-title {
    color: #000000;
    font-size: 14px;
    font-weight: 400;
    font-family: '微软雅黑';
    margin-bottom: 16px;
  }
  .m_t_16 {
    margin-top: 16px;
  }
}
</style>
