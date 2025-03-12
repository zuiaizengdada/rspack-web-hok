<template>
  <div class="drawerDetails">
    <!-- Your code here -->
    <el-drawer
      title=""
      :visible.sync="drawerDetails"
      :direction="direction"
      :before-close="handleClose"
      :size="730"
    >
      <div class="drawer-content">
        <div class="videoInfo">
          <el-row :gutter="20" style="margin-bottom: 12px">
            <el-col
              :span="8"
            ><div class="grid-content bg-purple" />
              <span class="col-title">视频名称</span><span class="col-content  flex-1 text_hidden_1" :title="videoDetails.videoName">{{ videoDetails.videoName }}</span></el-col>
            <el-col
              :span="10"
            ><div class="grid-content bg-purple" />
              <span class="col-title">视频组标题</span><span class="col-content">{{ videoDetails.videoGroupTitle }}</span></el-col>
            <el-col
              :span="6"
            ><div class="grid-content bg-purple" />
              <span class="col-title">IP</span><span class="col-content text_hidden_1" :title="videoDetails.teacherName || '--'">{{ videoDetails.teacherName || '--' }}</span></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col
              :span="8"
            ><div class="grid-content bg-purple" />
              <span class="col-title">标记分类</span><span class="col-content  flex-1 text_hidden_1" :title="videoDetails.hotMarkTypeName || videoDetails.sensitiveMarkTypeName">{{ videoDetails.hotMarkTypeName || videoDetails.sensitiveMarkTypeName }}</span></el-col>
            <el-col
              :span="10"
            ><div class="grid-content bg-purple" />
              <span class="col-title">标记时间</span><span class="col-content">{{ videoDetails.desensitizedTime }}</span></el-col>
            <el-col
              :span="6"
            ><div class="grid-content bg-purple" />
              <span class="col-title">创建者</span><span class="col-content">{{ videoDetails.createUserName }}</span></el-col>
          </el-row>
        </div>
        <div v-if="activeName !== 'first'">
          <div class="title-container flex items-center m-t-20 m-b-20">
            <em />
            <span> 标记描述</span>
          </div>
          <div class="tagsDescribe">
            {{ videoDetails.hotMarkRemarks }}
          </div>
        </div>
        <div>
          <div class="title-container flex items-center m-t-20 m-b-20">
            <em />
            <span> 标记字幕</span>
            <span v-clipboard:copy="videoDetails.subtitleList || videoDetails.subtitleContent" v-clipboard:success="clipboardSuccess" class="m-l-14 a_link">
              <i class="el-icon-document-copy a_link " />
              <span class="copyDescribe">复制</span>
            </span>
          </div>
          <div class="tagsDescribe subtitleList">
            <!-- 每句话之间拼接 /  -->
            {{ videoDetails.subtitleList || videoDetails.subtitleContent }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'TagsDetails',
  directives: {
    clipboard
  },
  props: {
    drawerDetails: {
      type: Boolean,
      default: false
    },
    videoDetails: {
      type: Object,
      default: () => {}
    },
    activeName: {
      type: String,
      default: 'first'
    }
  },
  data() {
    return {
      // Your data here
      direction: 'rtl'
    }
  },
  methods: {
    // Your methods here
    handleClose() {
      this.$emit('close')
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    }
  }
  // Your code here
}
</script>

<style lang="scss" scoped>
/* Your styles here */
.drawerDetails {
  .nowrap{
    white-space: nowrap;
  }
  ::v-deep{
    .el-col{
      word-break: break-all;
      // overflow: hidden;
      display: flex;
      align-items: center;
    }
  }
  .tagsDescribe {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    padding-left: 12px;
    box-sizing: border-box;
    line-height: 26px;
  }
  .copyDescribe{
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #0C6FFF;
  }
  .title-container {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
    em {
      width: 4px;
      height: 24px;
      margin-right: 8px;
      border-radius: 6px;
      background: rgb(12, 111, 255);
    }
  }
  .drawer-content {
    padding: 20px;
    box-sizing: border-box;
    .videoInfo {
      padding: 12px 14px;
      box-sizing: border-box;
      background: #f2f9ff;
    }
    .col-title {
      font-size: 14px;
      font-weight: 500;
      color: #777777;
      margin-right: 12px;
    }
    .col-content {
      flex: 1;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
  }
}
</style>
