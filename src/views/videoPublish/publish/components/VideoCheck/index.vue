<template>
  <div class="container">
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-press-escape="false"
    >
      <div slot="title">
        <p class="p-title">更换视频</p>
      </div>
      <div class="videoCheck_content">
        <!--表格渲染-->
        <MPageLayout
          ref="MPageLayout"
          v-loading="loading"
          type="tablePage"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          layout="total, sizes, prev, pager, next, jumper"
          @selectionChange="handleSelectionChange"
          @size-change="handleListSizeChange"
          @current-change="handleListCurrentChange"
        >
          <el-form
            slot="search"
            style="padding-right: 0px"
            :inline="true"
            :model="videoForm"
            size="small"
            class="demo-form-inline"
          >
            <el-form-item label="关键字">
              <el-input v-model="videoForm.videoName" placeholder="请输入关键字" @change="getList" />
            </el-form-item>
            <el-form-item label="IP">
              <el-select
                v-model="videoForm.teacherId"
                filterable
                placeholder="请选择IP"
                clearable
                @change="getList"
              >
                <el-option
                  v-for="item in tearchArray"
                  :key="item.teacherId"
                  :label="item.teacherName"
                  :value="item.teacherId"
                />
              </el-select>
            </el-form-item>

          </el-form>
          <div slot="radio" slot-scope="scope">
            <el-radio v-model="radioIdSelect" :label="scope.row" />
          </div>
          <div slot="size" slot-scope="scope">
            <p>{{ scope.row.size | filterSize }}</p>
          </div>
          <div slot="duration" slot-scope="scope">
            <p>{{ getPlayDuration(scope.row.duration * 1000) }}</p>
          </div>
          <div slot="teacherName" slot-scope="scope">
            <p>{{scope.row.teacherName || '--'  }}</p>
          </div>
          <div slot="subtitleStatus" slot-scope="scope">
            <StatusShow
              :subtitlestatus="scope.row.subtitleStatus"
              :videotype="4"
              :semi-video-id="scope.row.finishVideoId"
              @reloadData="getList"
            />
          </div>
          <div slot="status" slot-scope="scope" class="videoStatus">
            <span :class="scope.row.status === 1 ? 'success-span' : 'error-span'">
              <i
                :class="
                  scope.row.status === 1 ? 'el-icon-success' : 'el-icon-error'
                "
              />
              {{ scope.row.status === 1 ? '已发布' : '未发布' }}
            </span>
          </div>
          <div slot="sensitiveWordStatus" slot-scope="scope">
            <mgcStatusShow
              :sensitivewordstatus="scope.row.sensitiveWordStatus"
              :videotype="4"
              :refvideoid="scope.row.finishVideoId"
              @reloadData="getList"
            />
          </div>
          <div slot="footer" />
        </MPageLayout>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="radioIdSelect===''" @click="sumitVideoCheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DateFormat, getPlayDuration } from '@/utils/index'

import { getFinishedVedioList } from '@/api/videoManagement/vedioSetting'
import {
  teacherQueryByName
} from '@/api/tearchCenter/index'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      slotArr: [
        'search',
        'name',
        'subtitleStatus',
        'size',
        'duration',
        'sensitiveWordStatus',
        'status',
        'action',
        'radio',
        'footer',
        'teacherName'
      ],
      radioIdSelect: '',
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'radio',
            label: '',
            width: 30,
            type: 'slot'
          },
          {
            prop: 'name',
            label: '视频名称',
            width: 200,
            type: 'text',
            visible: true
          },
          {
            prop: 'teacherName',
            label: '录制IP',
            width: 150,
            visible: true,
            type: 'slot'
          },
          { prop: 'size', label: '视频大小', type: 'slot', visible: true },
          { prop: 'duration', label: '视频时长', type: 'slot', visible: true },
          {
            prop: 'uploadTime',
            label: '上传时间',
            width: 180,
            type: 'text',
            visible: true
          },
          {
            prop: 'status',
            label: '发布状态',
            type: 'slot',
            width: 130,
            visible: true
          }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tearchArray: [],
      videoForm: {
        videoName: '',
        teacherId: '',
        timeArray: [],
        startTime: '',
        endTime: '',
        me: true,
        status: ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.loadTeacherData()
        this.init()
      }
    }
  },
  methods: {
    getPlayDuration,
    handleSelectionChange(row) {
      console.log(row, 'row')
      this.radioIdSelect = row
    },
    loadTeacherData() {
      const params = {
        name: ''
      }
      teacherQueryByName(params)
        .then(res => {
          this.tearchArray = res.data
        })
        .catch(() => {})
    },
    sumitVideoCheck() {
      this.$emit('sumitVideoCheck', this.radioIdSelect)
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    init() {
      this.videoForm = {
        videoName: '',
        teacherId: '',
        timeArray: [],
        startTime: '',
        endTime: '',
        me: true,
        status: ''
      }
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        teacherId: this.videoForm.teacherId,
        startTime:
          this.videoForm.timeArray && this.videoForm.timeArray[0]
            ? DateFormat(new Date(this.videoForm.timeArray[0]), 'yyyy-MM-dd')
            : '',
        endTime:
          this.videoForm.timeArray && this.videoForm.timeArray[1]
            ? DateFormat(new Date(this.videoForm.timeArray[1]), 'yyyy-MM-dd')
            : '',
        uploaderId: this.videoForm.uploaderId,
        videoName: this.videoForm.videoName,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        me: this.videoForm.me,
        status: this.videoForm.status,
        finishVideoId: this.$route.query.finishVideoId
      }
      getFinishedVedioList(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.tableData = res.data.items
          // 过来当前finishVideoId数据 删除该条数据
          this.config.tableData.forEach((item, index) => {
            if (item.finishVideoId === this.$route.query.finishVideoId) {
              this.config.tableData.splice(index, 1)
              res.data.total -= 1
            }
          })
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.$nextTick(() => {
            this.$refs.MPageLayout.doLayout()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 15px;
}
.p-title{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
.videoCheck_content{
  height: 500px;
}
.videoStatus {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  span {
    border-radius: 10px;
    padding: 0 10px;
  }
  .success-span {
    color: #00b42a;
    background: #e6f7ea;
  }
  .error-span {
    color: #717f99;
    background: #eef2f9;
  }
}
</style>
