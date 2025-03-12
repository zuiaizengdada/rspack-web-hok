<template>
  <div class="right-side flex flex-column" style="width: 680px;">
    <template v-if="list.length">
      <div class="my_top flex flex-middle">
        <span class="text_hidden_1 flex-1" :title="detailForm &&detailForm.projectName">工程名称：{{ detailForm && detailForm.projectName }}</span>
        <span>{{
          detailForm && detailForm.createTime
            ? DateFormat(new Date(detailForm.createTime), 'yyyy-MM-dd hh:mm:ss')
            : ''
        }}</span>
        <span>IP：{{ detailForm && detailForm.teacherName }}</span>
        <span>交付场景：{{ detailForm && detailForm.sceneName }}</span>
      </div>
      <div class="my_table">
        <el-table
          ref="multipleTable"
          v-model="externalSelectedData"
          :data="list"
          height="100%"
          tooltip-effect="dark"
          :header-cell-style="{ background: '#2b2b2b' }"
          :row-class-name="rowClassName"
          :reserve-selection="true"
          row-key="projectVideoId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="selectableMethod"
          />
          <el-table-column label="视频">
            <template slot-scope="scope">
              <div class="flex flex-middle ">
                <span class="playVideo">
                  <el-image
                    :src="getHuoshanPosterUrl(scope.row.posterUrl)"
                    class="posterImg"
                    fit="contain"
                  >
                    <img
                      slot="error"
                      src="@/assets/image/noPoster.png"
                      alt=""
                      style="width: 100%; height: 100%; object-fit: fill"
                    />
                  </el-image>
                  <svg-icon
                    icon-class="bofang"
                    class="icon-svg"
                    :class="{ active: active }"
                    @click="playVideo(scope.row)"
                  />
                </span>
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时长" width="160px">
            <template slot-scope="scope">
              <span>{{ getPlayDuration(scope.row.duration * 1000) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="大小" width="160px">
            <template slot-scope="scope">
              <span>{{ scope.row.size | filterSize }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-else>
      <div class="noData">
        <img src="~@/assets/image/materialBg.png" alt="" />
        <div class="m-t-10 noDataText">暂无内容</div>
      </div>
    </template>
  </div>
</template>

<script>
import { getMyprojectDetail } from '@/api/videoManagement/clipWork'
import { DateFormat, getPlayDuration, getHuoshanPosterUrl } from '@/utils/index'
import AppVideo from '@/components/AppVideo'

export default {
  name: 'RightSide',
  // Add your component's logic here
  props: {
    externalSelectedData: {
      type: Array,
      default: () => []
    },
    rightList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // Add your data properties here
      detailForm: {},
      rowSelectFlag: false,
      list: [],
      active: false
    }
  },
  methods: {
    DateFormat,
    getPlayDuration,
    getHuoshanPosterUrl,
    // 获取我的工程详情数据
    async getDetail(newName) {
      this.detailForm = null
      this.loading = true
      this.projectId = newName
      if (newName === '') {
        return false
      }
      const params = {
        projectId: newName
      }
      const res = await getMyprojectDetail(params)
      console.log(res, '工程详情')
      this.detailForm = res.data
      this.list = res.data.videos || []
      // 选中rightlist里面对应工程的数据
      console.log(this.rightList, 'rightList')
      const selectedIds = new Set()

      this.rightList.forEach(item => {
        if (item.projectId === newName) {
          item.projectVideoIds.forEach(id => {
            selectedIds.add(id)
          })
        }
      })

      if (this.externalSelectedData.length > 0) {
        this.externalSelectedData.forEach((id) => {
          selectedIds.add(String(id))
        })
      }
      console.log(selectedIds, '要选中的列表')

      this.detailForm.videos.forEach((item) => {
        if (selectedIds.has(String(item.projectVideoId))) {
          this.$nextTick(() => {
            this.rowSelectFlag = true
            this.$refs.multipleTable.toggleRowSelection(item, true)
            this.rowSelectFlag = false
          })
        }
      })
      this.loading = false
    },
    clearData() {
      this.detailForm = {}
      this.list = []
    },
    selectableMethod(row, index) {
      console.log(this.externalSelectedData, '禁用的')
      if (this.externalSelectedData.length > 0) {
        return !this.externalSelectedData.some(
          (item) => item === row.projectVideoId
        )
      } else {
        return true
      }
    },
    handleSelectionChange(row) {
      // if (this.rowSelectFlag) return
      console.log(this.projectId, 'this.projectId')
      this.$emit('handleSelectionChange', row, this.projectId)
    },
    playVideo(item) {
      console.log(item, '当前播放视频信息')
      AppVideo.play({
        visible: true,
        url: item.videoUrl,
        videoName: item.name,
        videoId: item.projectVideoId,
        idForVideo: item.projectVideoId,
        videoType: 2,
        closeOnPressEscape: true,
        autoplay: false
      })
    },
    rowClassName() {
      return 'my_row'
    }
  }
}
</script>

<style scoped lang="scss">
.right-side {
  .noData {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > img {
      width: 180px;
    }
    > .noDataText {
      margin-top: 10px;
      font-size: 14px;
      color: #919293;
      line-height: 26px;
    }
  }
  /* Add your styles for the right side component here */
  margin-left: 20px;
  flex: 1;
  .playVideo{
    width: 125px;
    height: 71px;
    position: relative;
    background-color: #f0edf1;
    margin-right: 8px;
  }
  .posterImg {
    width: 125px;
    height: 71px;
  }
  .icon-svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    &:hover {
      transform: translate(-50%, -50%) scale(1.2, 1.2);
    }
  }
  ::v-deep {
    .el-table {
      border-radius: 8px;
      height: 100%;
      background: transparent;
    }
    .el-table tr:hover > td {
      background-color: #2b2b2b !important; /* 设置悬停时的背景颜色 */
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
      border: 1px solid transparent;
      background-color:#4b4b4b;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
      border-color:#fff !important;
    }
    .el-table .el-table__cell.gutter{
        width: 0px !important;
        background: #2b2b2b;
        border-bottom: 1px solid #4d4d4d;
    }
    /*这一点很重要，否则可能会导致hover行时操作列还是原来的背景色*/
    .el-table__body tr.hover-row > td {
      background-color: #2b2b2b !important; /* 设置悬停时的背景颜色 */
    }
    .el-table::before,
    .el-table--group::after,
    .el-table--border::after {
      background: transparent;
    }
    .el-table th.el-table__cell.is-leaf,
    .el-table td.el-table__cell {
      background: transparent;
      border-bottom: 1px solid #4d4d4d;
    }
    .el-table tr {
      background: transparent;
      color: #a6a6a6;
    }
  }
  .my_top {
    width: 100%;
    color: #a6a6a6;
    font-size: 16px;
    span {
      flex: 1;
    }
  }
  .my_table {
    margin-top: 18px;
    flex: 1;
    border-radius: 8px;
    border: 1px solid #4d4d4d;
    overflow: hidden;
  }
}

</style>
