<template>
  <origin-info ref="originIfno" origin="edit" :is-back-callback="true" :status="2" @save="originEditSave" @back="originBack" />
</template>

<script>
import OriginInfo from './components/OriginInfo.vue'
import { addVideoGroup } from '@/api/videoManagement/origin'
export default {
  components: {
    OriginInfo
  },
  methods: {
    async originEditSave() {
      const res = this.$refs.originIfno.getVideoGroupInfo()
      const { baseInfo, silenRuleInfo, videoGroupId } = res
      const { planId, sceneId, teacherId, title } = baseInfo
      const params = { planId, sceneId, teacherId, title, videoGroupId }
      await addVideoGroup({
        ...params, videoTabRuleAddReq: { ...silenRuleInfo }
      })
      this.$message.success('编辑成功')
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    },
    originBack() {
      const isEdit = this.$refs.originIfno.isEditForm()
      console.log(isEdit)
      if (isEdit) {
        this.$confirm('返回将取消修改内容，确认返回吗', '提示', {
          type: 'warning'
        }).then(async () => {
          this.$router.go(-1)
        }).catch(() => {

        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
