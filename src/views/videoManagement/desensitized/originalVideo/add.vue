<template>
  <origin-info ref="originInfo" origin="add" :visible-back="false" @save="originAddSave">
    <template slot="button-upload">
      <el-button type="primary" size="small" class="border" @click="originAddSave(true)">保存并跳转上传视频</el-button>
    </template>
  </origin-info>
</template>
<script>
import OriginInfo from './components/OriginInfo.vue'
import { addVideoGroup } from '@/api/videoManagement/origin'
export default {
  components: {
    OriginInfo
  },
  methods: {
    async originAddSave(isUpload) {
      const res = this.$refs.originInfo.getVideoGroupInfo()
      const { baseInfo, silenRuleInfo } = res
      const params = {
        ...baseInfo, videoTabRuleAddReq: { ...silenRuleInfo }
      }
      const { data } = await addVideoGroup(params)
      this.$message.success('添加成功')
      setTimeout(() => {
        if (isUpload) {
          // eslint-disable-next-line no-undef
          this.$router.replace('/videoManagement/originalVideoUpload/' + String(BigInt(data)))
        } else {
          this.$router.go(-1)
        }
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .border.el-button--primary {
  background-color:#fff;
  color:#0C6FFF
}
</style>
