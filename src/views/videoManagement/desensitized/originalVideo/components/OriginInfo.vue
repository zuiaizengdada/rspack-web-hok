<template>
  <!-- visibleSave 保存  visibleCancelBtn 取消-->
  <layout-main :visible-bread="true" v-bind="$attrs" v-on="$listeners">
    <div slot="layout-wrapper">
      <base-info ref="baseInfo" v-loading="loading" v-bind="$attrs" :data="detailInfo" @changeTeacher="baseInfoChangeTeacher" @changeVideoGroup="changeVideoGroup" />
      <silen-rule v-if="videoGroupType===1" ref="silenRule" v-bind="$attrs" :data="detailInfo.videoTabRuleReq" />
      <teacher-sens :id="teacherId" v-bind="$attrs" />
      <video-list v-loading="loading" v-bind="$attrs" :data="detailInfo" @update="getVideoGroupDetail" />
    </div>
    <slot slot="button-extend" name="button-upload" />
  </layout-main>
</template>
<script>
import LayoutMain from '@/views/videoManagement/desensitized/components/Common/LayoutMain.vue'
import BaseInfo from '../../components/BaseInfo.vue'
import SilenRule from '../../components/SilenRule.vue'
import TeacherSens from '../../components/TeacherSens.vue'
import VideoList from '../../components/Video/VideoList.vue'
import { getVideoDetail } from '@/api/videoManagement/origin'

export default {
  components: {
    LayoutMain,
    BaseInfo,
    SilenRule,
    TeacherSens,
    VideoList
  },
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      detailInfo: {},
      teacherId: '',
      videoGroupType: '',
      loading: false
    }
  },
  mounted() {
    this.getVideoGroupDetail()
  },
  methods: {
    getVideoGroupInfo() {
      const baseInfo = this.$refs.baseInfo
      const silenRuleInfo = this.$refs.silenRule
      const validBaseInfo = baseInfo.validateForm()
      let validSliceRuleInfo = {}
      if (this.videoGroupType !== 2) {
        validSliceRuleInfo = silenRuleInfo.validateForm()
      }
      if (validBaseInfo && validSliceRuleInfo) {
        return {
          baseInfo: baseInfo.form,
          silenRuleInfo: silenRuleInfo?.form || {},
          videoGroupId: this.detailInfo.videoGroupId
        }
      }
    },
    changeVideoGroup(val) {
      this.videoGroupType = val
    },
    baseInfoChangeTeacher(val) {
      this.teacherId = val
    },
    async getVideoGroupDetail() {
      const { id } = this.$route.params
      if (id) {
        try {
          this.loading = true
          const res = await getVideoDetail({ videoGroupId: id, type: this.status })
          const { teacherId } = res.data
          console.log(res.data, '视频组信息')
          this.videoGroupType = res.data.isMultiCamera
          this.detailInfo = res.data
          this.teacherId = teacherId
          this.loading = false
          this.$emit('complete', res.data)
        } catch (err) {
          console.log(err)
        }
      }
    },
    isEditForm() {
      const baseFormCount = this.$refs.baseInfo.isDataChangeCount
      const silenFormCount = this.$refs.silenRule && this.$refs.silenRule.isDataChangeCount

      console.log(baseFormCount, silenFormCount, 8989)
      return baseFormCount + silenFormCount > 2
    }
  }
}
</script>
