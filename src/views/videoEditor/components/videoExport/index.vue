<template>
  <div class="dialog">
    <el-dialog
      :width="width"
      :title="title"
      :visible.sync="visible"
      custom-class="dialog-body"
      :show-close="false"
      :close-on-click-modal="false"
      :press-escape="false"
      :close-on-press-escape="false"
      :top="top"
      @closed="closed"
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">{{ title }}</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div
        :style="{ width: width, height: height }"
        class="dialog-body-content"
      >
        <detailContent
          v-if="visible"
          ref="detailContent"
          :project-video-id="projectVideoId"
          :project-id="projectId"
          :cut-line-active-list="cutLineActiveList"
          @getName="getGenerateProjectName"
          @selectLength="getSelectLength"
          @changeContent="changeContent"
        />
        <div class="p-l-20">
          <el-form
            ref="form"
            size="small"
            :model="form"
            label-width="80px"
            :rules="rules"
          >
            <el-form-item label="名称" prop="name">
              <el-input
                v-model.trim="form.name"
                style="width: 506px"
                maxlength="50"
                show-word-limit
                @input="delNoNumber"
              />
              <div class="tips">{{ tips }}</div>
            </el-form-item>
            <el-form-item label="导出内容">
              <el-checkbox-group
                v-model="form.checkList"
                class="el-check-form"
                size="mini"
                @change="chooseCheck"
              >
                <el-checkbox label="视频" disabled />
                <el-checkbox label="标记" />
                <el-checkbox label="字幕" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="ss-material-box-bottom">
        <span class="my_tips">
          <!-- <template v-if="!isShowMemory">
            <svg-icon icon-class="closeTips" class="icon-warning" />
            云桌面F盘存储空间即将不足，系统将于近期对历史老数据进行清理！
          </template> -->
        </span>
        <span>
          <el-button
            class="myBtn btnCancel"
            size="small"
            :loading="loading"
            @click="close()"
            >取消</el-button
          >
          <el-button
            export-v-step="2"
            :disabled="selectLength === 0"
            class="myBtn"
            size="small"
            :loading="loading"
            type="primary"
            @click="succeseFn()"
            >导出</el-button
          >
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import detailContent from './detail.vue'
import eventBus from '@/utils/eventBus'
import { setItem, getItem } from '@/utils/localStorage'
export default {
  components: {
    detailContent
  },
  data() {
    return {
      visible: false,
      width: '1400px',
      height: '652px',
      title: '视频导出',
      top: '0px',
      loading: false,
      succese: null,
      tips: '注：名称不能包含下列任何字符：\ / : * ? " < > |',
      form: {
        name: '',
        checkList: ['视频', '标记', '字幕'],
        isExportMark: 2,
        isExportSubtitle: 2
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      projectId: '',
      projectVideoId: '',
      selectLength: 0,
      cutLineActiveList: [],
      exportedVideoIdArray: [],
      // 指引相关配置
      tourInfo: {
        options: {
          // 是否显示黑色遮罩层
          useModalOverlay: true,
          // 键盘按钮控制步骤
          keyboardNavigation: true,
          defaultStepOptions: {
            // 显示关闭按钮
            cancelIcon: {
              enabled: true
            },
            scrollTo: { behavior: 'smooth', block: 'center' },
            // 高亮元素四周要填充的空白像素
            modalOverlayOpeningPadding: 8,
            // 空白像素的圆角
            modalOverlayOpeningRadius: 4,
            buttons: [
              {
                action() {
                  return this.back()
                },
                text: '上一步',
                classes: 'shepherd-back-button'
              },
              {
                action() {
                  return this.next()
                },
                text: '下一步',
                classes: 'shepherd-next-button'
              }
            ]
          }
        }
      }
    }
  },
  mounted() {
    this.top = Math.abs(document.body.scrollHeight - 784) / 2 + 'px'
    const localLayoutMoveDataString = localStorage.getItem(
      'localLayoutMoveDataList'
    )
    const dataArray = JSON.parse(localLayoutMoveDataString)
    if (dataArray?.length > 0) {
      this.form.isExportSubtitle = dataArray[0].isExportSubtitle
      this.form.isExportMark = dataArray[0].isExportMark
      if (this.form.isExportSubtitle === 1 && this.form.isExportMark === 1) {
        this.form.checkList = ['视频', '标记', '字幕']
      }
      if (this.form.isExportSubtitle === 1 && this.form.isExportMark !== 1) {
        this.form.checkList = ['视频', '字幕']
      }
      if (this.form.isExportSubtitle !== 1 && this.form.isExportMark === 1) {
        this.form.checkList = ['视频', '标记']
      }
      if (this.form.isExportSubtitle !== 1 && this.form.isExportMark !== 1) {
        this.form.checkList = ['视频']
      }
    }
    this.initStep() // 功能引导
  },
  methods: {
    initStep() {
      if (getItem('export-v-step')) return
      this.$nextTick(() => {
        setTimeout(() => {
          setItem('export-v-step', true)
          const tour = this.$shepherd(this.tourInfo.options)
          const steps = [
            {
              title: '功能上新：自定义排序导出视频',
              text: `选择要导出的视频素材或片段`,
              showCancelLink: true,
              canClickTarget: false,
              attachTo: {
                element: "[export-v-step='0']",
                on: 'bottom'
              },
              buttons: [
                {
                  text: '下一步',
                  action: tour.next,
                  classes: 'shepherd-next-button'
                }
              ]
            },
            {
              title: '功能上新：自定义排序导出视频',
              text: `拖动【排序按钮】对导出视频进行排序`,
              showCancelLink: true,
              canClickTarget: false,
              attachTo: {
                element: "[export-v-step='1']",
                on: 'bottom'
              },
              buttons: [
                {
                  text: '上一步',
                  action: tour.back,
                  classes: 'shepherd-back-button'
                },
                {
                  text: '下一步',
                  action: tour.next,
                  classes: 'shepherd-next-button'
                }
              ]
            },
            {
              title: '功能上新：自定义排序导出视频',
              text: `点击【导出】，即按排序顺序进行导出`,
              showCancelLink: true,
              canClickTarget: false,
              attachTo: {
                element: "[export-v-step='2']",
                on: 'top'
              },
              buttons: [
                {
                  text: '上一步',
                  action: tour.back,
                  classes: 'shepherd-back-button'
                },
                {
                  text: '完成',
                  action: tour.next,
                  classes: 'shepherd-next-button'
                }
              ]
            }
          ]
          steps.forEach(item => {
            tour.addStep(item)
          })
          tour.start()
        }, 1000)
      })
    },
    changeContent() {
      this.cutLineActiveList = []
    },
    chooseCheck() {
      this.setApplactionData()
    },
    delNoNumber(e) {
      this.form.name = e.replace(/[(\/)(\\)(\:)(\*)(\?)(\")(\<)(\>)(\|)]/g, '')
    },
    close() {
      this.visible = false
    },
    succeseFn() {
      if (this.loading) {
        return
      }
      console.log('点击导出提交过来的form表单数据', this.form)
      this.form.isExportMark = 2
      this.form.isExportSubtitle = 2
      this.form.checkList.some(item => {
        if (item === '字幕') {
          this.form.isExportSubtitle = 1
        }
        if (item === '标记') {
          this.form.isExportMark = 1
        }
      })
      this.$uweb && this.$uweb.setAction('Event_onlineEditing_exportSure')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          // 点击导出
          this.$refs.detailContent
            .operateClipsGenerate(this.form)
            .then(res => {
              this.exportedVideoIdArray = JSON.parse(
                sessionStorage.getItem('exportedVideoIdArray')
              )
                ? JSON.parse(sessionStorage.getItem('exportedVideoIdArray'))
                : []
              const arrFor = this.exportedVideoIdArray
              res.some(item => {
                let hasFlag = false
                for (var i = 0; i < arrFor.length; i++) {
                  if (
                    item.videoId === arrFor[i].videoId &&
                    item.startTime === arrFor[i].startTime
                  ) {
                    hasFlag = true
                    break
                  }
                }
                if (!hasFlag) {
                  this.exportedVideoIdArray.push(item)
                }
              })
              sessionStorage.setItem(
                'exportedVideoIdArray',
                JSON.stringify(this.exportedVideoIdArray)
              )
              this.$refs.detailContent.changeGrayExport()
              this.loading = false
              eventBus.$emit('updateVideoList')
              this.$notify.success({
                title: '操作成功',
                message: '具体进度可前往任务中心查看！'
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })

      // this.succese && this.succese()
    },
    setApplactionData() {
      this.form.isExportMark = 2
      this.form.isExportSubtitle = 2
      this.form.checkList.some(item => {
        if (item === '字幕') {
          this.form.isExportSubtitle = 1
        }
        if (item === '标记') {
          this.form.isExportMark = 1
        }
      })
      const localLayoutMoveDataString = localStorage.getItem(
        'localLayoutMoveDataList'
      )
      const dataArray = JSON.parse(localLayoutMoveDataString)
      if (dataArray.length > 0) {
        dataArray[0].isExportSubtitle = this.form.isExportSubtitle
        dataArray[0].isExportMark = this.form.isExportMark
      }
      localStorage.setItem('localLayoutMoveDataList', JSON.stringify(dataArray))
    },
    done() {
      this.visible = false
    },
    closed() {
      this.$refs.form && this.$refs.form.clearValidate()
      this.$refs.detailContent && this.$refs.detailContent.init()
      this.form.name = ''
      this.projectId = ''
      this.selectLength = 0
      console.log('关闭')
    },
    getGenerateProjectName(res) {
      // console.log('获取名称', res)
      this.form.name = res
    },
    getSelectLength(res) {
      this.selectLength = res
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog ::v-deep .el-dialog__wrapper {
  background: rgb(0 0 0 / 70%);
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 1400px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #1e1f1e;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 30px !important;
    border-radius: 10px;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      // background: #fafbfc;
      background: #1e1f1e;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #000000;
      color: #d9d9d9;
      font-size: 16px;
      // font-weight: 500;
      font-weight: bold;
      .ss-material-box-header-title {
        // max-width: 300px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .close {
      color: #d9d9d9;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      padding-right: 20px;
      padding-left: 20px;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 80px;
      // background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
      .my_tips {
        color: #e96f24;
        font-size: 14px;
        font-weight: 400;
      }
      .myBtn {
        width: 104px;
        height: 40px;
        // background: #1778FF;
        border-radius: 6px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #fff;
      }
      .btnCancel {
        width: 104px;
        height: 40px;
        border-radius: 6px;
        border: 1px solid #4d4d4d;
        background: transparent;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #dedede;
      }
    }
  }
  .el-form-item__label {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 32px;
    font-weight: 400;
  }
  .el-popper[x-placement^='bottom'] {
    margin-top: 20px;
  }
}
.c_FF7D00 {
  font-size: 28px;
  color: #ff7d00;
}
.tips {
  margin-top: 8px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #d9d9d9;
  line-height: 20px;
}

.el-check-form {
  ::v-deep .el-checkbox__label {
    color: #d9d9d9;
  }
  ::v-deep .is-checked {
    .el-checkbox__label {
      color: #1778ff;
    }
  }
}
</style>
