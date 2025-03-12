<template>
  <div class="common-container flex flex-wrap">
    <el-tag v-for="item in commonTopicList" :key="item" closable type="info" class="tag-item cursor-pointer" @close="handleCloseTag(item)" @click="handleClickTagItem(item)">{{ item }}</el-tag>
  </div>
</template>
<script>
import { oftenUseTopic, delOftenUseTopic } from '../../api/index'
export default {
  data() {
    return {
      commonTopicList: []
    }
  },
  mounted() {
    this.getCommonTopicList()
  },
  methods: {
    handleClickTagItem(data) {
      this.$emit('add', data)
    },
    async  getCommonTopicList() {
      const { finishVideoId } = this.$route.query
      if (finishVideoId) {
        const res = await oftenUseTopic({ finishVideoId: finishVideoId })
        this.commonTopicList = res.data
      }
    },
    async handleCloseTag(item) {
      await delOftenUseTopic({ topic: item })
      this.$message.success('删除成功')
      this.getCommonTopicList()
    }
  }
}
</script>
<style lang="scss" scoped>
.common-container{
    float: left;
    width: 100%;
    margin: 10px 0;
    .title{
        font-size:16px;
        color: #333333;
        line-height: 24px;
    }
    .tag-item{
        margin-right:6px;
        margin-bottom:6px;
    }
}
</style>
