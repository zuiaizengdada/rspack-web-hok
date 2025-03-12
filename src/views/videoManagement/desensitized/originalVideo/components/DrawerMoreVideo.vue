<template>
  <el-drawer title="全部视频" :visible.sync="visibleDrawer" @close="visibleDrawer=false">
    <el-table :data="list" class="px-4 hk-table">
      <el-table-column prop="videoName" label="视频名称">
        <template slot-scope="scope">
          <div class="videoName">
            <span v-if="scope.row.isEmptyMirror === 1" class="emptyScene">空镜</span>
            <p class="hover-p" style="cursor:pointer" @click="toShowVideo(scope.row)">{{ scope.row.videoName }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="autoDesensitizedStatus" width="135" label="自动脱敏状态">
        <template slot-scope="scope">
          <p v-if="scope.row.autoDesensitizedStatus === 2" class="autod"><img src="@/assets/image/video/zdtm_hover.png" />已完成</p>
          <p v-else class="unauto"><img src="@/assets/image/video/zdtm.png" />未完成</p>
        </template>
      </el-table-column>
      <el-table-column prop="desensitizedTime" width="160" label="自动脱敏完成时间">
        <template slot-scope="scope">
          <p>{{ scope.row.desensitizedTime || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column property="manualDesensitizedStatus" width="135" label="人工脱敏视频">
        <template slot-scope="scope">
          <p v-if="scope.row.manualDesensitizedStatus === 2" class="rgdown"><img src="@/assets/image/video/sdtm_hover.png" />已完成</p>
          <p v-else class="unauto"><img src="@/assets/image/video/sdtm.png" />未完成</p>
        </template>
      </el-table-column>
      <el-table-column prop="generateTime" width="160" label="人工脱敏完成时间">
        <template slot-scope="scope">
          <p>{{ scope.row.generateTime || '--' }}</p>
        </template>
      </el-table-column>
      <el-table-column property="shareStatus" width="135" label="共享视频">
        <template slot-scope="scope">
          <p v-if="scope.row.shareStatus === 0" class="unauto"><img src="@/assets/image/video/gxsp.png" />未分享</p>
          <p v-if="scope.row.shareStatus === 1" class="shared"><img src="@/assets/image/video/gxsp_hover.png" />已分享</p>
        </template>
      </el-table-column>
      <el-table-column prop="videoLatestShareTime" width="135" label="共享时间">
        <template slot-scope="scope">
          <p>{{ scope.row.videoLatestShareTime || '--' }}</p>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>
<script>
import AppVideo from '@/components/AppVideo'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    visibleDrawer: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    toShowVideo(row) {
      console.log('wwwwwwW:', row)
      AppVideo.play({
        visible: true,
        url: row.url,
        videoName: row.videoName,
        videoId: row.id,
        idForVideo: row.videoid,
        // autoplayMuted: true,
        autoplay: false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer.rtl{
  width:60%!important;
}
::v-deep .el-dialog__close{
  color:#000;
}
::v-deep .el-drawer__header{
  padding:22px 20px;
  margin-bottom:0;
  line-height: 1;
  border-bottom:1px solid #E7E7E7;
  span{
    color:#333;
    font-weight: bold;
    font-size:16px;
  }
}
::v-deep .has-gutter .el-table__cell{
  background: rgb(245, 245, 245);
  line-height: 1;
  border-radius: 6px;;
  border-bottom:none!important;
  .cell{
    line-height: 1;
    padding:0 20px;
  }
}
::v-deep .el-drawer__body{
  padding-top:18px;
}

::v-deep .el-table__body,::v-deep .el-table__header{
  width:auto!important
}
.videoName{
  display: flex;
  align-items: center;
  .emptyScene{
    width: 32px;
    height: 18px;
    background: #52D3B6;
    border-radius: 4px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 17px;
    text-align: center;
    margin-right: 5px;
  }
}
.unauto {
  color: #999;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.rgdown {
  color: #8A3FD4;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.shared {
  color: #00C07A;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.autod {
  color: #3CBFFF;
  img {
    width: 24px;
    margin-right: 8px;
    display: inline-block;
  }
}

.hover-p {
  cursor: pointer;
}

.hover-p:hover{
  color: #0C6FFF;
}
</style>
