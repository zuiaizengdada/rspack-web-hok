<template>
  <div class="list-container hoc-main-min-height">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-if="permsList.includes('list')"
        label="IP档案"
        name="first"
      >
        <teacher v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="permsList.includes('draftList')"
        label="转入的IP"
        name="fourth"
      >
        <draft v-if="activeName === 'fourth'" type="transfer" />
      </el-tab-pane>
      <el-tab-pane
        v-if="permsList.includes('draftList')"
        label="档案草稿"
        name="second"
      >
        <draft v-if="activeName === 'second'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="permsList.includes('teacherPreliminaryAudit')"
        label="IP初审"
        name="third"
      >
        <approve v-if="activeName === 'third'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import teacher from './components/teacher'
import draft from './components/draft'
import approve from './components/approve'
import { getRoutesPermsList } from '@/utils/index'
export default {
  components: {
    teacher,
    draft,
    approve
  },
  data() {
    return {
      activeName: 'first',
      permsList: []
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    init() {
      const child = getRoutesPermsList('teachFile')
      this.permsList = child?.map(k => k.path) ?? []
      if (JSON.stringify(this.$route.query) !== '{}') {
        this.activeName = this.$route.query.activeName ?? 'first'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.list-container ::v-deep {
  background: #fff;
  padding: 10px 20px;
  border-radius: 15px;
  .el-tabs__item {
    font-size: 16px;
  }
}
</style>
