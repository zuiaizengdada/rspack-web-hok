<template>
  <div class="detail-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="detail-breadcrumb">
      <el-breadcrumb-item
        :to="{ path: '/privateArea/officialManage/list' }"
      >公众号管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ type === 'add' ? '新增':'设置' }}公众号</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="active">
      <el-tab-pane label="基本设置" name="basicSettings" />
      <el-tab-pane v-if="type === 'edit'" label="模板消息群发" name="batchSending" />
      <el-tab-pane v-if="type === 'edit'" label="模板消息" name="templateMessage" />
      <el-tab-pane v-if="type === 'edit'" label="自动回复" name="automaticReply" />
    </el-tabs>
    <components :is="active" @load="load" />
  </div>
</template>

<script>
import basicSettings from './components/basicSettings'
import batchSending from './components/batchSending'
import templateMessage from './components/templateMessage'
import automaticReply from './components/automaticReply'
import { changeQuery } from '@/utils/index'
export default {
  components: {
    basicSettings,
    batchSending,
    templateMessage,
    automaticReply
  },
  data() {
    return {
      active: 'basicSettings',
      type: 'add'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.type = this.$route.query.type ?? 'add'
    },
    load(current) {
      const params = changeQuery(current)
      location.href = location.origin + '/#/privateArea/officialManage/detail?' + params
      this.type = current.type
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-container ::v-deep{
    background: #fff;
    height: calc(100vh - 90px);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    .el-tabs__nav-wrap::after{
        height: 1px;
    }
    .detail-breadcrumb{
        margin-bottom: 20px;
    }
    .el-tabs__header{
        margin: 0px;
    }
}
</style>
