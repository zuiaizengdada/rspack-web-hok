<template>
  <div class="tabla-data-container">
    <div class="header flex justify-between">
      <Title class="title m-t-20" title="数据明细" />
    </div>
    <el-form ref="useForm" inline :model="config" size="mini" class="m-t-20">
      <div class="flex flex-end">
        <div class="flex">
          <el-form-item label="视频组名称" prop="department">
            <el-input v-model="config.videoGroupTitle" placeholder="请输入视频组名称" clearable />
          </el-form-item>
          <el-form-item v-if="activeIndex!==0" label="视频名称" prop="department">
            <el-input v-model="config.videoName" placeholder="请输入视频名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleClickSearch">查询</el-button>
            <el-button plain @click="handleClickReset">重置</el-button>
          </el-form-item>
        </div>
        <div v-if="activeIndex === 1">
          <el-select v-model="config.desensitizedStatus" placeholder="请选择" @change="handleChangeStatus">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
    </el-form>
    <el-table height="310" :header-row-class-name="'tableClassName'" :data="data.items" class="tableRef overflowOuto">
      <el-table-column v-for="item in tableColumns" :key="item.label" :width="item.width" :label="item.label" :prop="item.prop" :sortable="item.sortable">
        <template slot-scope="scope">
          <a v-if="item.prop === 'title'" :href="scope.row.openUrl" target="_blank" :style="scope.row.openUrl?'color: rgb(0, 0, 255);':'cursor: auto;'">
            {{ scope.row[item.prop] }}
          </a>
          <span v-else-if="item.prop === 'teacherName'">{{ scope.row.teacherName || '--' }}</span>
          <span v-else-if="item.prop === 'invalidVideoCount'" class="invalid-proportion" @click="goDetails(scope.row)">{{ scope.row.invalidVideoCount }}:{{ scope.row.effInvalidVideoCount }}</span>
          <span v-else-if="item.prop === 'hotMarkCount'" :class="scope.row.hotMarkCount?'invalid-proportion':''" @click="goHotMark(scope.row)">{{ scope.row.hotMarkCount }}</span>
          <span v-else-if="item.prop === 'manualDesensitizedCount'">{{ scope.row.autoDesensitizedCount }}:{{ scope.row.manualDesensitizedCount }}</span>
          <span v-else-if="item.prop === 'lastCreateTime'">{{ scope.row.lastCreateTime || '--' }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <div slot="empty" class="empty">
        <el-empty
          :image-size="70"
          description="暂无数据"
        />
      </div>
    </el-table>
    <div v-if="data.total>0" class="flex justify-end mt-2">
      <el-pagination
        :current-page="config.pageIndex"
        :page-sizes="[10,20, 40, 100]"
        :page-size="config.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleCurrentChange"
        @current-change="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
import { columns, columns1, columns2 } from './columns'
import Title from '../Base/Title.vue'

export default {
  components: {
    Title
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      columns,
      columns1,
      columns2,
      options: [
        {
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '已手动脱敏'
        }, {
          value: '0',
          label: '未手动脱敏'
        }],
      tableColumns: columns,
      config: {
        pageIndex: 1,
        pageSize: 10,
        videoGroupTitle: '',
        desensitizedStatus: '',
        videoName: ''
      },
      permsList: this.$route.meta.permsList || [],
      total: 0
    }
  },
  watch: {
    data(val) {
      this.tableData = val.items
      this.total = val.total
    },
    activeIndex: {
      handler(val) {
        console.log(val, '切换选中')
        if (val === 0) {
          this.tableColumns = this.columns
        } else if (val === 1) {
          this.tableColumns = this.columns1
        } else {
          this.tableColumns = this.columns2
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSizeChange(val) {
      this.config.pageIndex = val
      this.$emit('search')
    },
    handleCurrentChange(val) {
      this.config.pageIndex = 1
      this.config.pageSize = val
      this.$emit('search')
    },
    handleChangeStatus() {
      this.config.pageIndex = 1
      this.$emit('search')
    },
    handleClickSearch() {
      this.config.pageIndex = 1
      this.$emit('search')
    },
    handleClickReset() {
      this.config.pageIndex = 1
      this.config.videoGroupTitle = ''
      this.config.videoName = ''
      this.$emit('search')
    },
    handleClickExport() {
      this.$emit('export')
    },
    goHotMark(row) {
      if (!row.hotMarkCount) return
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${row.projectId}?videoType=2&videoGroupName=${row.projectName}&videoId=${row.desensitizedVideoId}&fromType=3`
      })
      window.open(toTaskLog.href, '_blank')
    },
    goDetails(row) {
      this.$router.push({
        path: '/videoManagement/desensitizationVideoDetail',
        query: {
          videoGroupId: row.videoGroupId
        }
      })
    },
    reset() {
      this.config.pageIndex = 1
      this.config.pageSize = 10
      this.config.videoGroupTitle = ''
      this.config.videoName = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-end{
  justify-content: space-between;
}
.invalid-proportion{
  color: #0C6FFF;
  cursor: pointer;
}
.tableRef{
  width: 100%;
  // height: 310px;
}
.title{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
::v-deep {
  .tableClassName>th{
    background: #F3F3F3 !important;
  }
}
.tableClassName{
  background: #F3F3F3 !important;
}
</style>
