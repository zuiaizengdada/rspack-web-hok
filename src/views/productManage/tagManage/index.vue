<template>
  <div class="tagsPage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="脱敏标记" name="first" lazy>
        <tagsPage :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="爆款标记" name="second" lazy>
        <tagsPage :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tagsPage from './components/tagsPage.vue'
export default {
  components: {
    tagsPage
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.tagsPage{
  background-color: #fff;
  padding:0 20px 16px 20px;
  border-radius: 10px;
}
</style>
