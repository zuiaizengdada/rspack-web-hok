<template>
  <el-dialog
    title="上传视频"
    :visible.sync="config.visible"
    class="warpDialog"
    width="568px"
    @close="handleClose"
  >
    <div class="errorTips">
      <i class="el-icon-warning-outline" />
      上传视频中请勿关闭浏览器，否则会导致上传失败！
    </div>
    <div class="box">
      <img class="mp4Img" src="@/assets/image/mp4.png" alt="" srcset="" />
      <div class="progressBox">
        <el-progress :percentage="percentage" :stroke-width="10" :format="format" />
        <div class="progressMessge">
          <span>视频上传中{{ percentage }}%</span>
          <div v-if="uploadMssage===1">
            <img src="@/assets/image/check-circle-filled.png" alt="" srcset="" />
            <span>视频上传成功</span>
          </div>
          <div v-if="uploadMssage===0">
            <img src="@/assets/image/close-circle-filled.png" alt="" srcset="" />
            <span class="errText">数据导入失败</span>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="uploadMssage===1" type="primary" @click="handleOk">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        tcVod: '',
        data: {},
        visible: false,
        uploader: ''
      })
    }
  },
  data: () => ({
    percentage: 0,
    uploadMssage: ''
  }),
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.initTxUpload()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleClose() {
      this.percentage = 0
      this.uploadMssage = ''
      this.config.visible = false
      if (this.uploader && this.uploader.cancel) {
        this.uploader.cancel()
      }
    },
    handleOk() {
      this.handleClose()
      this.$emit('Ok')
    },
    initTxUpload() {
      console.log(this.config.data, 'this.config.data')
      this.uploader = this.config.tcVod.upload(this.config.data)
      // 视频上传完成时
      this.uploader.on('media_upload', () => {
        this.uploadMssage = true
      })
      // 视频上传进度
      this.uploader.on('media_progress', (info) => {
        this.percentage = parseInt(info.percent * 100)
      })
      // 封面上传完成时
      this.uploader.on('cover_upload', function(info) {
        console.log(info)
      })
      // 封面上传进度
      this.uploader.on('cover_progress', function(info) {
        console.log(info)
      })
      // 视频上传状态
      this.uploader.done().then((res) => {
        console.log(res, '视频上传状态')
        this.uploadMssage = 1
      }).catch((err) => {
        console.log(err, 'err')
        this.uploadMssage = 0
      })
    },
    format() {
      return ''
    }
  }
}
</script>
<style lang="scss" scoped>
    ::v-deep{
        .el-progress-bar{
            padding-right: 0
        }
    }
.errorTips {
    width: 100%;
    padding: 8px 20px;
    background: rgba(254, 236, 236, .4);
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
    line-height: 22px;
  }
  .box{
    width: 528px;
    height: 101px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    margin-top: 20px;
    margin-bottom: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding:0 20px;
    >.mp4Img{
        width:48px;
        height:48px;
        margin-right: 20px;
    }
    >.progressBox {
        flex:1;
        padding-top: 22px;
        >.progressMessge{
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 10px;
            >div{
                display: flex;
                align-items: center;
                color:#00B42A;
                >img{
                    width:14px;
                    height:14px;
                    margin-right: 3px;
                }
            }
            .errText{
              color:#F53F3F !important;
            }
        }

    }
  }
</style>
