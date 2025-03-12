<template>
  <div class="oa-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :name="item.name"
        lazy
      >
        <template
          v-if="item.name === 'fixedAssets' && activeName === 'fixedAssets'"
        >
          <fixedAssets />
        </template>
        <template
          v-else-if="item.name === 'phoneCard' && activeName === 'phoneCard'"
        >
          <phoneCard />
        </template>
        <template
          v-else-if="
            item.name === 'confirmProcess' && activeName === 'confirmProcess'
          "
        >
          <confirmProcess />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import fixedAssets from '../fixedAssets'
import phoneCard from '../phoneCard'
import confirmProcess from '../confirmProcess'
export default {
  components: {
    fixedAssets,
    phoneCard,
    confirmProcess
  },
  data() {
    return {
      activeName: 'fixedAssets',
      tabs: [
        { label: '固定资产管理', name: 'fixedAssets' },
        { label: '电话卡管理', name: 'phoneCard' },
        { label: '确认流程', name: 'confirmProcess' }
      ]
    }
  },
  created() {
    const { tab } = this.$route.query
    if (tab === 'phoneCard') {
      this.activeName = 'phoneCard'
    } else if (tab === 'confirmProcess') {
      this.activeName = 'confirmProcess'
    } else {
      this.activeName = 'fixedAssets'
    }
  },
  methods: {
    handleClick(tab) {
      this.$router.push({
        path: '/oaManagement/oaMannagementIndex',
        query: {
          tab: tab.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.oa-container {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
}
</style>
