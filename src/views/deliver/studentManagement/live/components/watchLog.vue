<template>
  <div>
    <div class="student-control">
      <div class="student-list">
        <div
          v-for="item in tabs"
          :key="item.value"
          class="student-child"
          :class="{ 'student-active': getActive(item) }"
          @click="onClickPath(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 观看记录 -->
    <el-table
      v-loading="loading"
      :data="data"
      :header-cell-style="{ background: '#f5f5f5' }"
      :row-key="record => record.chapterId"
      default-expand-all
      :tree-props="{ children: 'childrenChapter', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="contentName"
        label="章节名称"
        :show-overflow-tooltip="true"
        width="242px"
      >
        <template slot-scope="{ row }">
          {{ row.chapterName }}
        </template>
      </el-table-column>
      <el-table-column prop="chapterType" label="类型">
        <template slot-scope="{ row }">
          {{ chapterTypeOptions[row.chapterType] }}
        </template>
      </el-table-column>
      <el-table-column prop="totalDuration" label="课程时长">
        <template v-if="row.chapterType !== 1" slot-scope="{ row }">
          {{ row.totalDuration | filterTime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="accumulatedDuration"
        label="学习时长(直播/回放时长)"
      >
        <template v-if="row.chapterType !== 1" slot-scope="{ row }">
          {{ row.accumulatedDuration | filterTime }}
          <span v-if="row.playbackAccumulatedDuration"
            >/ {{ row.playbackAccumulatedDuration | filterTime }}</span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column prop="learnedRatio" label="观看完成度">
        <template slot-scope="{ row }">
          {{ row.learnedRatio || 0 }} %
        </template>
      </el-table-column> -->
    </el-table>
    <div class="totleBox">
      <div>合计({{ active === 1 ? '不包含已删除章节' : '仅是已删章节' }})</div>
      <div>{{ currentTotal.totalDuration | filterTime }}</div>
      <div>{{ +currentTotal.accumulatedDuration | filterTime }}</div>
      <!-- <div>{{ currentTotal.learnedRatio }}%</div> -->
    </div>
    <div class="totleBox">
      <div>总计(包括已删章节)</div>
      <div>{{ allTotal.totalDuration | filterTime }}</div>
      <div>{{ allTotal.accumulatedDuration | filterTime }}</div>
      <!-- <div>{{ allTotal.learnedRatio }}%</div> -->
    </div>
    <!-- <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </div>
</template>

<script>
import {
  progressTreeLiveCourse,
  progressDeleteLiveCourse
} from '@/api/deliver/studentManagement'
export default {
  components: {},
  props: {
    deliveryInfoId: {
      type: [Number, String],
      default: ''
    },
    subOrderId: {
      type: [Number, String],
      default: ''
    },
    userId: {
      type: [Number, String],
      default: ''
    },
    type: {
      type: [Number, String],
      default: ''
    },
    goodsId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      loading: false,
      pageSize: 10,
      currentTotal: {},
      allTotal: {},
      tabs: [
        {
          name: '当前章节',
          value: 1
        },
        {
          name: '已删章节',
          value: 2
        }
      ],
      active: 1,
      chapterTypeOptions: {
        1: '目录',
        2: '图片',
        3: '视频',
        4: '直播间',
        5: '打卡'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onClickPath(item) {
      this.active = item.value
      this.init()
    },
    getActive(item) {
      return this.active === item.value
    },
    init() {
      this.data = []
      this.total = 0
      this.currentPage = 1
      this.currentTotal = 0
      this.allTotal = 0
      this.getList()
      // this.getUserProgressDeliveryTotal()
      // this.getUserAllTotal()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const api =
        this.active === 1 ? progressTreeLiveCourse : progressDeleteLiveCourse
      const param = {
        current: this.currentPage,
        size: this.pageSize,
        subOrderId: this.subOrderId,
        goodsId: this.goodsId,
        userId: this.userId
      }
      api(param)
        .then(res => {
          if (this.active === 1) {
            this.data = res.data.courseChapters
            this.total = res.data.courseChapters.length
            this.loading = false
            this.currentTotal = res.data.sum
            this.allTotal = res.data.total
          } else {
            this.data = res.data.courseChapters
            this.total = res.data.courseChapters.length
            this.loading = false
            this.currentTotal = res.data.sum
            this.allTotal = res.data.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.student-control {
  background: #f3f3f3;
  border-radius: 4px;
  padding: 2px;
  margin-bottom: 15px;
  display: inline-block;
  .student-list {
    display: flex;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
              supported by Chrome, Edge, Opera and Firefox */
    .student-child {
      width: 88px;
      height: 32px;
      line-height: 32px;
      background: #f3f3f3;
      border-radius: 2px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      text-align: center;
      cursor: pointer;
    }
    .student-active {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      background: #ffffff;
    }
  }
}
.totleBox {
  display: flex;
  margin-top: 10px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 10px;
  > div {
    flex: 1;
    text-indent: 10px;
    font-size: 16px;
    color: #999999;
  }
  > div:nth-of-type(1) {
    min-width: 490px !important;
  }
}
</style>
