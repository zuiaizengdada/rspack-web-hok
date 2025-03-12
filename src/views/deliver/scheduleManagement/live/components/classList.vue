<template>
  <div>
    <div>
      <div class="live-room-setting-table-content">
        <el-table
          :data="chapterTableData"
          :loading="loading"
          :height="500"
          row-key="id"
          :tree-props="{
            children: 'childrenChapter'
          }"
          style="width: 100%"
        >
          <el-table-column prop="chapterName" label="章节名称" />
          <el-table-column prop="chapterType" label="章节类型">
            <template #default="scope">
              {{ getChapterType(scope.row.chapterType) }}
            </template>
          </el-table-column>
          <el-table-column prop="playback" label="回放">
            <template #default="scope">
              {{ scope.row.playback ? '支持' : '不支持' }}
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序值" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getScheduleCourse } from '@/api/liveRoom/course'
export default {
  props: {
    scheduleId: {
      type: [String, Number],
      default: ''
    }
  },
  data: () => ({
    chapterTableData: [],
    loading: false
  }),
  mounted() {
    this.getScheduleCourse()
  },
  methods: {
    async getScheduleCourse() {
      this.loading = true
      const { code, data } = await getScheduleCourse({ id: this.scheduleId })
      if (code === 1) {
        this.chapterTableData = data || []
      }
      this.loading = false
    },
    // 1目录 2图片 3视频 4直播 5打卡
    getChapterType(type) {
      return {
        1: '目录',
        2: '图片',
        3: '视频',
        4: '直播',
        5: '打卡'
      }[type]
    }
  }
}
</script>
<style lang="scss" scoped>
.live-room-setting-table-content {
  padding: 20px;
}
</style>
