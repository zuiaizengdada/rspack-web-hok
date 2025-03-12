<template>
  <div class="groupDrawer">
    <div class="form">
      <div v-loading="loading" class="page_wrap">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          label-position="top"
          :rules="rules"
        >
          <div class="m-t-20">
            <el-form-item label="标题" prop="title">
              <el-input
                v-model.trim="form.title"
                style="width: 100%"
                maxlength="30"
                type="text"
                placeholder="请输入标题"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="正文" prop="content">
              <AppEditor
                ref="AppUEditor"
                v-model="form.content"
                :maximum-words="2000" 
                :show-word-count="true" 
                style="width: 897px"
                @change="handleChangeContent"
              />
            </el-form-item>
            <div class="punchFiles">
              <div style="margin-bottom: 16px">
                <div class="flex">
                  <Upload
                    btn-name="新增图片"
                    accept="image/jpeg,image/png,image/jpg"
                    :before-video-upload="beforeImgUpload"
                    @change="imageChange"
                  />
                  <Upload
                    btn-name="新增视频"
                    accept="video/mp4"
                    @change="videoChange"
                  />
                  <Upload
                    btn-name="新增音频"
                    accept="audio/*"
                    :before-video-upload="beforeAudioUpload"
                    @change="audioChange"
                  />
                </div>
              </div>
              <div class="tips1">
                图片小于5M，音频小于50M，支持MP3格式，视频小于1G，支持MP4格式；文件最多支持20个
              </div>
              <div id="sortable" class="punchFiles-content">
                <div
                  v-for="(item, index) in form.punchFiles"
                  :key="item.id"
                  class="flex"
                >
                  <div
                    class="alignCenter"
                    style="cursor: move; margin-right: 10px"
                  >
                    <i class="el-icon-sort" />
                  </div>
                  <div class="fileContent">
                    <el-image
                      v-if="item.fileType === 1"
                      style="width: 70px; height: 70px; border-radius: 4px"
                      fit="contain"
                      class="pointer"
                      :src="item.fileUrl"
                      :preview-src-list="[item.fileUrl]"
                    />
                    <VideoShow
                      v-else
                      :type="item.fileType"
                      :url="item.fileUrl"
                    />
                  </div>
                  <div class="fileName flex-1 alignCenter">
                    {{ item.fileName }}
                  </div>
                  <div class="alignCenter"> 
                    <el-button
                      type="danger"
                      size="small"
                      plain
                      @click="deleteFile(index)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <el-form-item label="有效期:" prop="datePicker">
              <el-date-picker
                ref="datePickerRef"
                v-model="form.datePicker"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item label="打卡次数">
              <el-radio-group v-model="form.punchLimit">
                <div>
                  <el-radio :label="1" class="m-t-10">最多 </el-radio>
                  <el-input-number
                    v-model.number="punchLimit"
                    :min="0"
                    :max="999"
                    controls-position="right"
                  />
                  <span>次</span>
                </div>
                <el-radio :label="0" class="m-t-10">不限制次数 </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="提交内容要求">
              <el-radio-group v-model="form.requireContent">
                <el-radio :label="0" class="m-t-10">不限制 </el-radio>
                <el-radio :label="1" class="m-t-10">自定义</el-radio>
              </el-radio-group>
              <div v-if="form.requireContent === 1" class="limitbox">
                <div class="flex" style="margin-bottom: 10px">
                  <div>
                    文字 不低于
                    <el-input-number
                      v-model.number="form.textLimit"
                      :min="0"
                      :max="600"
                      placeholder="0-600"
                      controls-position="right"
                      style="width: 200px"
                    />
                    字
                  </div>
                  <div style="margin-left: 20px">
                    语音 不少于
                    <el-input-number
                      v-model.number="form.audioLimit"
                      :min="0"
                      :max="600"
                      placeholder="0-600"
                      controls-position="right"
                      style="width: 200px"
                    />
                    秒
                  </div>
                </div>
                <div class="flex">
                  <div>
                    图片 不低于
                    <el-input-number
                      v-model.number="form.imageLimit"
                      :min="0"
                      :max="9"
                      placeholder="0-9"
                      controls-position="right"
                      style="width: 200px"
                    />
                    张
                  </div>
                  <div style="margin-left: 20px">
                    视频 不少于
                    <el-input-number
                      v-model.number="form.videoLimit"
                      :min="0"
                      :max="300"
                      placeholder="0-300"
                      controls-position="right"
                      style="width: 200px"
                    />
                    秒
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="demo-drawer__footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Sortable from 'sortablejs'
import AppEditor from '@/components/AppEditor'
import { addTask, getTaskDetail } from '@/api/deliver/punch.js'
import VideoShow from '../../components/videoShow.vue'
import Upload from '../../components/upload.vue'

export default {
  name: 'ColumnEdit',
  components: {
    AppEditor,
    VideoShow,
    Upload
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      loading: false,
      form: {
        title: '',
        content: '',
        punchFiles: [],
        punchLimit: '',
        startTime: '',
        endTime: '',
        requireContent: 0,
        datePicker: []
      },
      punchLimit: undefined, 
      isClear: false,
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入可补打卡总次数', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() <= Date.now() - 8.64e7 
        }
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    handleChangeContent(val) {
      this.form.content = val 
    }, 
    beforeImgUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('图片大小限5M以内')
      }
      return isLt5M
    },
    beforeAudioUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('音频大小限50M以内')
      }
      return isLt50M
    },
    // 初始化
    init() {
      if (this.type !== 'add') {
        this.getDetail()
      }
    },
    async getDetail() {
      const { data } = await getTaskDetail(this.data.id)
      this.form = {
        ...data,
        datePicker: [
          moment(data.startTime).format('YYYY-MM-DD HH:mm:ss'),
          moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
        ]
      }
      if (data.punchLimit) {
        this.punchLimit = data.punchLimit
        this.form.punchLimit = 1
      }
      if (this.type === 'copy') {
        delete this.form.id
      }
      this.$refs.MUploadImg &&
        this.$refs.MUploadImg.setFileList([
          {
            status: 3,
            url: this.form.coverImage
          }
        ])
      this.dragFile()
    },
    handleDateChange(val) {
      this.form.startTime = val[0]
      this.form.endTime = val[1]
    },
    dragFile() {
      this.$nextTick(() => {
        const el = document.getElementById('sortable')
        const _this = this
        new Sortable(el, {
          onEnd({ newIndex, oldIndex }) {
            console.log('拖动了行', '当前序号: ' + newIndex, oldIndex)
            const currRow = _this.form.punchFiles.splice(oldIndex, 1)[0]
            _this.form.punchFiles.splice(newIndex, 0, currRow)
            console.log(_this.form.punchFiles)
          }
        })
      })
    },
    handleInputChange(val) {
      this.form.contentName = val
    },
    handleValidator(val) {
      this.form.subTitle = val.replace(/[{}【】（）‘’\']/gi, '')
    },
    // 选择图片
    getImgUrl(key) {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: res => {
          console.log(res, 'res')
          this.form[key] = res.materialUrl
        }
      })
    },
    getCoverUrlList(coverUrlList) {
      this.form.coverImage = coverUrlList[0].materialUrl
    },
    // 删除图文
    delMaterialUrl() {
      this.form.materialVo = {
        dirId: '',
        materialDes: '',
        materialId: '',
        materialFrameUrl: '',
        materialName: '',
        materialSize: '',
        materialType: '',
        materialUrl: ''
      }
    },
    // 编辑图文
    changeMaterialUrl(res) {
      this.form.materialVo.materialUrl = res
    },
    // 点击保存
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await addTask({
            ...this.form,
            punchLimit: this.form.punchLimit === 0 ? 0 : this.punchLimit,
            punchId: this.$route.query?.id
          })
          this.$message.success('操作成功')
          this.$emit('success')
        } else {
          console.log('error submit!!')
          this.$notify({
            title: '警告',
            message: '请完成必填项!',
            type: 'warning'
          })
          return false
        }
      })
    },
    success() {
      this.config = {
        visible: false,
        data: {}
      }
      this.$emit('success')
    },
    // 选择图文
    getImage() {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: res => {
          this.form.coverImage = res.materialUrl
          this.$refs.MUploadImg.setFileList([
            {
              status: 3,
              url: this.form.coverImage
            }
          ])
        }
      })
    },
    audioChange(res) {
      if (this.form.punchFiles.length >= 20) {
        this.$message.error('最多支持20个文件')
        return
      }
      this.form.punchFiles.push({
        fileType: 2,
        fileUrl: res.url,
        punchType: 2,
        fileName: res.file.name,
        id: res.uid
      })
      this.dragFile()
    },
    videoChange(res) {
      if (this.form.punchFiles.length >= 20) {
        this.$message.error('最多支持20个文件')
        return
      }
      this.form.punchFiles.push({
        fileType: 3,
        fileUrl: res.url,
        fileName: res.file.name,
        punchType: 2,
        id: res.uid
      })
      this.dragFile()
    },
    imageChange(res) {
      if (this.form.punchFiles.length >= 20) {
        this.$message.error('最多支持20个文件')
        return
      }
      this.form.punchFiles.push({
        fileType: 1,
        fileUrl: res.url,
        fileName: res.file.name,
        punchType: 2,
        id: res.uid
      })
      this.dragFile()
    },
    deleteFile(index) {
      this.form.punchFiles.splice(index, 1)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  background-color: #fff;
  border-radius: 4px;

  .tips1 {
    color: #999999;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
  }

  .tips {
    margin-left: 20px;
  }

  .punchFiles {
    border-radius: 4px;
    border: 1px solid #dcdfe5;
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;

    .punchFiles-content {
      margin-top: 10px;
      > div {
        padding: 10px;
        border-bottom: 1px solid #eff2f6;
        border-radius: 4px;
        &:hover {
          background-color: #eff2f6;
        }
      }
    }
  }

  .header {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 24px;
    margin-bottom: 30px;
  }

  .spec-btn {
    background: #e7f0ff;
    color: #0c6fff;
  }

  .header_tips {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    position: relative;
    padding-left: 10px;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0c6fff;
      border-radius: 3px;
    }
  }

  .tips {
    // margin-top: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }

  .image_poster {
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    > span {
      margin-top: 13px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
    }

    &:hover {
      border: 1px dashed #1472ff;
    }
  }

  .numberBox::v-deep {
    display: flex;

    > input {
      border: 4px 0 0 4px !important;
    }

    > div:nth-last-of-type(1) {
      height: 36px;
      width: 53px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
      background: #f5f7fa;
      border: 1px solid #dcdfe6;
      border-radius: 0 4px 4px 0;
      box-sizing: border-box;
      border-left: none;
    }
  }

  .setting-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 776px;
    padding: 27px 20px;
    background: #f5f7fa;
  }

  .add-course-ware-btn {
    width: 106px;
    height: 35px;
    border-radius: 4px;
    border: 1px dashed #1890ff;
    font-size: 14px;
    font-weight: 400;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    cursor: pointer;
    color: #1890ff;
  }

  .EC1 {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #0052d9;
    line-height: 24px;
  }

  .sale-container {
    position: relative;
    width: 776px;
    padding: 20px;
    margin: 4px 0 10px 25px;
    background: #f5f5f5;
  }

  .vaildTimeText {
    display: inline-block;
    vertical-align: top;
  }

  .validTime {
    margin-top: 12px;
    display: inline-block;
    width: 600px;
    margin-left: 30px;
  }

  .sale-input__label {
    display: inline-block;
    width: 85px;
  }

  .sale-input__input {
    display: inline-block;
    // display: flex;
  }
}

.video-selector__left {
  position: relative;
  background: #f7f8f9;
  border-radius: 2px;
  overflow: hidden;

  > img {
    width: 100%;
    height: 100%;
  }
}

.video-preview {
  height: 112px;
  width: 200px;

  > audio {
    width: 100%;
    height: 100%;
  }
}

.m-picture-title {
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  word-break: break-all;
  color: #333;
  width: 188px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.m-picture-property {
  height: 18px;
  line-height: 18px;
  color: #888;
}

.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;

  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .demo-drawer__footer {
    width: 100%;
    height: 50px; 
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }

  .form_avatar {
    display: flex;
    align-items: center;

    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }

  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}

::v-deep {
  .el-table {
    width: 99.9%;
  }

  .el-radio__label,
  .el-checkbox__label {
    color: #000000;
  }
  .el-form-item__label {
    color: #000000;
    text-align: right;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px;
  }
}

::v-deep .validity-days .el-input-group__append .el-input__inner {
  width: 60px;
}

.tipsBtn {
  .btn {
    margin-top: 96%;
  }
}
.fileName {
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
}
.alignCenter {
  align-items: center;
  display: flex;
}
.fileContent {
  margin: 0 20px;
}
.limitbox {
  border-radius: 4px;
  border: 1px solid #dcdfe5;
  padding: 20px;
  margin: 20px;
}
</style>
