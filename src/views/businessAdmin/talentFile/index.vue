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
import ResumeList from './components/resumeList/index'
import ApplicantList from './components/applicantList/index'
import BlackList from './components/blackList/index'
import WaitingEntryList from './components/waitingEntryList/index'

import { queryTabList } from '@/api/businessAdmin/talentFile'

export default {
  name: 'TalentFile',

  components: { ResumeList, ApplicantList, BlackList, WaitingEntryList },
  data() {
    return {
      blackListPersonnelCount: '',
      recruitCandidateCount: '',
      talentPoolPersonnelCount: '',
      waitEntryCount: '',
      tabConfigList: [],
      currentComponent: 'ResumeList'
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
        this.currentComponent = 'ResumeList'
      }
    },
    async getTabListCount() {
      const { data } = await queryTabList()

      this.blackListPersonnelCount = data.blackListPersonnelCount
      this.recruitCandidateCount = data.recruitCandidateCount
      this.talentPoolPersonnelCount = data.talentPoolPersonnelCount
      this.waitEntryCount = data.waitEntryCount

      // 在数据获取后再初始化 tabConfigList
      this.tabConfigList = [
        {
          name: 'ResumeList',
          label: `简历库（${this.talentPoolPersonnelCount}）`
        },
        {
          name: 'ApplicantList',
          label: `应聘人员（${this.recruitCandidateCount}）`
        },
        {
          name: 'WaitingEntryList',
          label: `待入职人员（${this.waitEntryCount}）`
        },
        {
          name: 'BlackList',
          label: `黑名单（${this.blackListPersonnelCount}）`
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
  // height: 100%;
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
