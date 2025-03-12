<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="通用敏感词" name="myvideo">
        <generalSensitiveWord ref="generalSensitiveWord" />
      </el-tab-pane>
      <el-tab-pane label="专属敏感词" name="sharevideo">
        <sensitiveWord ref="sensitiveWord" />
      </el-tab-pane>
      <el-tab-pane label="直播敏感词" name="liveSensitive">
        <liveSensitive ref="liveSensitive" />
      </el-tab-pane>
      <!-- <el-tab-pane label="C端敏感词" name="clientSensitive">
        <clientSensitive ref="clientSensitive" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import generalSensitiveWord from '@/views/basicSettings/generalSensitiveWord'
import sensitiveWord from '@/views/basicSettings/sensitiveWord'
import liveSensitive from '@/views/basicSettings/liveSensitive'
// import clientSensitive from '@/views/basicSettings/clientSensitive'
export default {
  components: {
    sensitiveWord,
    generalSensitiveWord,
    liveSensitive
    // clientSensitive
  },
  data() {
    return {
      activeName: 'myvideo'
    }
  },
  watch: {},
  mounted() {},
  created() {
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'myvideo') {
        this.$refs.generalSensitiveWord.getList()
      } else if (this.activeName === 'sharevideo') {
        this.$refs.sensitiveWord.getList()
      } else if (this.activeName === 'liveSensitive') {
        this.$refs.liveSensitive.getList()
      } else if (this.activeName === 'clientSensitive') {
        this.$refs.clientSensitive.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  height: 100%;
  ::v-deep .el-tabs {
    @include responsive-height(100px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tabs__content {
    @include responsive-height(100px);
  }
  ::v-deep .el-tab-pane {
    @include responsive-height(100px);
  }
}
</style>
