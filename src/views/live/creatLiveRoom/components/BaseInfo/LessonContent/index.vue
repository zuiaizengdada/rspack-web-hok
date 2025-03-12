<template>
  <div>
    <AppSelect
      :get-api-fn="getScriptList"
      search-key="coursewareName"
      :popover-width="245"
      :value="scriptName"
      :label="scriptName"
      :props="propsCourse"
      @selected="selectScript"
    >
      <div slot-scope="{ row }" class="liveRoomScript">
        <div class="text_hidden_ellipsis">{{ row.coursewareName }}</div>
        <div class="text_hidden_ellipsis" style="font-size: 12px;margin-top: 6px;">创建人: {{ row.createUserName }}</div>
      </div>
    </AppSelect>
    <!-- <el-button class="m-l-20" type="primary" size="small" @click="getLatestScript">获取最新课件</el-button>
    <div class="tipsError">当前课件有更新新的内容。</div> -->
  </div>
</template>
<script>
import AppSelect from '@/components/AppSelect/index'
import { getCoursewareList } from '@/api/liveRoom/courseware.js'
export default {
  components: {
    AppSelect
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scriptName: '',
      propsCourse: {
        label: 'coursewareName',
        value: 'coursewareId'
      }
    }
  },
  methods: {
    getScriptList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: '',
        status: 1,
        videoId: this.id,
        coursewareName: params.coursewareName
      }
      return getCoursewareList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectScript(res) {
      console.log(res, 'res')
      this.scriptName = res.coursewareName
      this.$emit('select', res)
    },
    getLatestScript() {},
    emptyScript() {
      this.scriptName = ''
    }

  }
}
</script>
