<template>
  <div class="coupon-center-audit">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref" class="pd20" />
    <MPageLayout
      ref="couponTableRef"
      type="tablePage"
      class="coupon-table"
      :slot-arr="config.basics.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.basics.columns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >

      <!-- <template slot="image" slot-scope="scope">
        <el-image
          style="width: 120px; height: 120px"
          :src="scope.row.image"
          :preview-src-list="[scope.row.image]"
        />
      </template> -->
      <template slot="video" slot-scope="scope">
        <div class="video">
          <el-image
            style="width: 160px; height: 160px;border-radius: 5px;"
            fit="contain"
            :src="scope.row.image"
          />
          <img
            src="@/assets/image/icon_bofang.png"
            class=" icon cursor-pointer"
            @click="handleClickPlay(scope.row.video)"
          />
        </div>
      </template>
      <template slot="isOnline" slot-scope="scope">

        <div :class="{ status1: scope.row.isOnline, status2: !scope.row.isOnline }">

          {{ scope.row.isOnline ? '上架' : '下架' }}
        </div>
      </template>
      <template slot="templateType" slot-scope="scope">
        {{ scope.row.templateType ==='MEISHE' ? '美摄' : 'AE' }}
      </template>
      <template slot="templateFileSize" slot-scope="scope">
        {{ (scope.row.templateFileSize/1024/1024).toFixed(2) }} M
      </template>
      <template slot="infoJson" slot-scope="scope">
        <el-button type="text" @click="open(scope.row)"> 查看 </el-button>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="editFn(scope.row)"> 编辑 </el-button>
          <el-button type="text" @click="handleStatus(scope.row)"> {{ scope.row.isOnline ? '下架' : '上架' }} </el-button>
          <el-button type="text" class="c_red" @click="delFn(scope.row)"> 删除 </el-button>
          <!-- <el-button type="text" @click="open(scope.row)"> 模版元数据 </el-button> -->
        </div>
      </template>
    </MPageLayout>
    <AddDialog ref="addDialogRef" @callback="searchFn" />
    <video-player :visible="visibleVideoPlayer" />
  </div>
</template>

<script>
import VideoPlayer from '@/views/videoManagement/component/videoplayer/videoplayer.vue'
import videoplayer from '@/views/videoManagement/component/videoplayer/index.js'
import moment from 'moment'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import AddDialog from './cpns/addDialog.vue'
import { cloneDeep } from 'lodash'
import { curwordOpts } from './data.js'
import { deepClone } from '@/utils/FormGenerator/index'
import { guziGetTagList, guziModelList, deleTemplate, statusTemplate } from '@/api/guzi/videoModel.js'
export default {
  components: { HokSearchForm, AddDialog, VideoPlayer },
  filters: {

  },
  data() {
    return {
      formOpts: {
        ...cloneDeep(curwordOpts.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          },
          {
            label: '新增',
            fn: this.addFn
          }
        ]
      },
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: cloneDeep(curwordOpts.table)
      },
      loading: false,
      visibleVideoPlayer: false
    }
  },
  created() {
    this.loadTagsList()
    this.getTableInfo()
  },
  methods: {

    open(row) {
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: `<div style="font-size: 14px;color: #ff4949;line-height: 23px;">
                ${row.infoJson}
              </div>`
      })
      // this.$alert(row.infoJson, '模版元数据', {
      //   dangerouslyUseHTMLString: true
      // })
    },
    handleClickPlay(videoUrl) {
      videoplayer.play({
        visible: true,
        url: videoUrl,
        autoplay: true
      })
    },
    loadTagsList() {
      guziGetTagList().then(res => {
        if (res.code === 1) {
          const objArray = []
          res.data.some((item, index) => {
            const obj = {
              value: '',
              label: ''
            }
            obj.label = item
            obj.value = item
            objArray.push(obj)
          })
          this.formOpts.optionsObj.tagName = objArray
        }
      })
    },
    formMat() {
      const req = deepClone(this.formOpts.formData)
      delete req.createTime
      if (
        this.formOpts.formData.createTime &&
        this.formOpts.formData.createTime[0] &&
        this.formOpts.formData.createTime[1]
      ) {
        req.createTime = `${moment(this.formOpts.formData.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')},${moment(this.formOpts.formData.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')}`
        // req.startTime = moment(this.formOpts.formData.time[0]).format('YYYY-MM-DD')
        // req.endTime = moment(this.formOpts.formData.time[1]).format('YYYY-MM-DD')
      }
      for (const key in req) {
        if (req[key] === '') {
          delete req[key]
        }
      }
      return req
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.formMat()
        const { data } = await guziModelList({
          ...req,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$nextTick(() => {
          this.$refs.couponTableRef?.doLayout()
        })
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    searchFn() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    clearFn() {
      this.formOpts.ref.resetFields()
      this.formOpts.formData = cloneDeep(curwordOpts.form.formData)
      this.getTableInfo()
    },
    editFn(row) {
      this.$refs.addDialogRef.dialogFn(true, row)
    },
    addFn(row) {
      this.$refs.addDialogRef.dialogFn(true, {})
    },
    delFn(row) {
      // 二次确认
      this.$confirm('确认删除该模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleTemplate({ templateId: row.id })
        if (res.code === 1) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.searchFn()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleStatus(row) {
      // 二次确认
      this.$confirm(`确认${row.isOnline ? '下架' : '上架'}该模板吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await statusTemplate(row.id, !row.isOnline)
        if (res.code === 1) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500
          })
          this.searchFn()
        }
      }).catch(() => {
      })
    },
    // MPageLayout
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.coupon-center-audit {
  @include responsive-height(20px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;

  .pd20 {
    padding: 20px;
  }

  .pl10 {
    padding-left: 10px;
  }

  .icon-copy {
    cursor: pointer;
  }

  .coupon-table {
    flex: 1;
    overflow: hidden;

    .title {
      color: #161616;
      font-family: 'PingFang SC';
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }

    .txt {
      color: #161616;
      font-family: 'PingFang SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }

    .blue-desc {
      color: #0c6fff;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }

    .orange-desc {
      color: #ff7d00;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }

    .grey-desc {
      color: #999999;
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }

    .audit-status-box {
      font-family: 'PingFang SC';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      padding: 0 10px;
      display: inline-block;
      position: relative;

      &.audit-status1 {
        padding-left: 24px;
        color: #ff7d00;
        flex-shrink: 0;
        border-radius: 12px;
        background: #fff2e6;

        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_chushen.png') no-repeat;
          background-size: 100%;
        }
      }

      &.audit-status2 {
        padding-left: 24px;
        color: #f53f3f;
        flex-shrink: 0;
        border-radius: 12px;
        background: #feecec;

        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_bohui.png') no-repeat;
          background-size: 100%;
        }
      }

      &.audit-status3 {
        padding-left: 24px;
        color: #00b42a;
        flex-shrink: 0;
        border-radius: 12px;
        background: #e6f7ea;

        &::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          height: 12px;
          width: 12px;
          background: url('~@/assets/image/coupon/icn_check.png') no-repeat;
          background-size: 100%;
        }
      }
    }
  }

  .two-min-select {
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 1px solid #dcdee1;

    &.w102 {
      width: 102px !important;
    }
  }
}

::v-deep .el-table {
  th.el-table__cell>.cell {
    font-weight: 600;
  }

  .cell {
    font-weight: 450;
    font-size: 14px;
    color: #333;
  }

  .el-button+.el-button {
    margin-left: 20px;
  }
}

.status1 {
  color: #34C759;
}

.status2 {
  color: #FF2E00;
}

.video {
  height: 160px;
  width: 160px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  >img {
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    font-size:50px;
  }

}
::v-deep .el-message-box {
  width: 60% !important;
}
::v-deep .el-message-box__message {
  p{
    word-break: break-all;
  }
}
</style>
