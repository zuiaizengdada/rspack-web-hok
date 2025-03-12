<template>
  <el-dialog
    :title="'标记 @ '+form.startTime"
    :visible.sync="visibleDialog"
    class="dialog-mark"
    :close-on-click-modal="false"
    width="614px"
    @close="handleClickCancel"
  >
    <div class="mark-content flex justify-between">
      <el-form
        ref="form"
        :model="form"
        size="mini"
        label-width="70px"
        style="width: 460px"
        :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" :maxlength="20" />
          <p class="name-tips">注：标记名称不能特殊字符</p>
        </el-form-item>
        <el-form-item label="时间">
          <div class="time-item flex justify-between">
            <div class="start-time">{{ form.startTime }}</div>
            <el-form-item label="持续时间" prop="durationTime" style="margin-bottom: 0">
              <el-input v-model="form.durationTime" />
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="注释" prop="notes">
          <el-input
            v-model="form.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入标签内容"
            maxlength="200"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 8}"
          />
        </el-form-item>
        <el-form-item label="标记颜色">
          <p class="mark-colors flex h-full items-center justify-between" style="padding-top: 3px">
            <span
              v-for="item in colorList"
              :key="item.label"
              :style="{ background: item.label, borderColor: item.label }"
              :class="{'active':form.color === item.label}"
              class="cursor-pointer flex items-center justify-center"
              @click="form.color = item.label"
            >
              <i v-if="form.color === item.label" class="el-icon-check" />
            </span>
          </p>
        </el-form-item>
      </el-form>
      <div class="form-buttons">
        <el-button
          class="block button"
          size="mini"
          type="primary"
          :loading="isLoading"
          @click="handleClickOk"
        >确定</el-button>
        <el-button
          class="block cancel button"
          size="mini"
          @click="handleClickCancel"
        >取消</el-button>
        <el-button
          v-if="isEditDialog"
          class="block button"
          size="mini delete"
          @click="handleClickDelete"
        >删除</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import OSS from 'ali-oss'
import { getOssToken } from '@/api/qiniu'
import { toBlob } from 'dom-to-image'
import { addMark, updateMark, deleteMark } from '../../api'
import { getFormatSSS, formatPrTime, markColors, getColorValue } from '../../utils'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  inject: ['video', 'getMarkList'],
  data() {
    const checkDurationTime = (rule, value, callback) => {
      let durationSs = formatPrTime(value)
      const startSs = formatPrTime(this.form.startTime)
      const duration = this.video.detail.duration
      if (durationSs) {
        const maxSs = duration - startSs
        durationSs = durationSs > maxSs ? maxSs : durationSs
        this.form.durationTime = getFormatSSS(durationSs * 1000)
        const endSs = startSs + durationSs
        this.form.endTime = endSs
      } else {
        const durationTime = getFormatSSS((this.form.endTime - startSs) * 1000)
        const time = this.edit ? durationTime : '00:00:00:000'
        this.form.durationTime = time
      }
      callback()
    }
    const checkName = (rule, value, callback) => {
      // const reg = /[a-zA-Z0-9_\u4e00-\u9fa5]+$/
      const reg2 = /^[\w\u4E00-\u9FA5]+$/
      if (!reg2.test(value)) {
        callback(new Error('标记名称不能包含“”、""、\\'))
      } else {
        callback()
      }
    }
    return {
      form: {
        markId: null,
        name: '',
        color: '#718637',
        durationTime: '00:00:01:000',
        startTime: '',
        endTime: '',
        notes: '',
        pictureUrl: '',
        videoId: ''
      },
      colorList: markColors,
      rules: {
        name: [{ required: true, message: '标签名称不能为空' }, { validator: checkName, trigger: 'blur' }],
        durationTime: [{ validator: checkDurationTime, trigger: 'blur' }]
      },
      isEditDialog: false,
      isLoading: false
    }
  },
  computed: {
    visibleDialog: {
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
        this.initForm()
      }
    },
    edit: {
      handler(val) {
        this.isEditDialog = val
        if (val) {
          this.initEditForm(this.data)
        }
      },
      deep: true
    }

  },
  methods: {
    initForm() {
      const startTime = getFormatSSS(this.video.currentTime * 1000)
      this.form.startTime = startTime
      this.form.endTime = this.video.data.currentTime
      this.form.color = '#718637'
      this.title = '标记 @ ' + startTime
    },
    initEditForm(data) {
      this.$nextTick(() => {
        const startTime = getFormatSSS(data.startTime * 1000)
        const durationTime = getFormatSSS((data.endTime - data.startTime) * 1000)
        const form = JSON.parse(JSON.stringify(data))
        form.startTime = startTime
        form.durationTime = durationTime
        this.form = form
      })
    },
    handleClickOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isLoading = true
          this.playerToImage()
        } else {
          return false
        }
      })
    },
    handleClickCancel() {
      this.$refs.form.resetFields()
      this.visibleDialog = false
      this.isLoading = false
      this.$emit('cancel')
    },

    async handleClickDelete() {
      await deleteMark({ markId: this.form.markId })
      this.getMarkList()
      this.handleClickCancel()
    },
    getImageItemNode() {
      const time = formatPrTime(this.form.startTime)
      const nodes = document.querySelectorAll('.frame-item')
      const firstItemIndex = Number(nodes[0].getAttribute('index'))
      let n
      if (nodes.length > 1) {
        const secondItemIndex = Number(nodes[1].getAttribute('index'))
        n = secondItemIndex - firstItemIndex
      }
      let node
      if (time > 30 * n) {
        let index = (Math.floor(time) - firstItemIndex)
        index = index < 0 ? 0 : Math.floor(index / n)
        node = nodes[index]
      } else {
        const index = Math.floor(time / n)
        index < 1 ? 1 : Math.floor(index) + 1
        node = nodes[index]
      }
      return node || nodes[0]
    },
    async playerToImage() {
      const node = this.getImageItemNode()
      if (node) {
        const blob = await toBlob(node)
        const file = new File([blob], 'file', {
          type: blob.type,
          lastModified: Date.now()
        })
        const { data } = await getOssToken()
        const fileName = 'hok_video/' + new Date().getTime() + '.png'
        const oss = new OSS({
          region: 'oss-accelerate',
          accessKeyId: data.accessKeyId,
          accessKeySecret: data.accessKeySecret,
          bucket: data.ossBucket,
          secure: true
        })
        await oss.multipartUpload(fileName, file, {})
        this.form.pictureUrl = `${data.ossBucketUrl}${fileName}`
      } else {
        this.form.pictureUrl = ''
      }
      this.updateMarkItem()
    },

    async updateMarkItem() {
      const form = JSON.parse(JSON.stringify(this.form))
      // const duration = this.video.detail.duration
      form.videoId = this.video.detail.id
      form.startTime = formatPrTime(this.form.startTime)
      form.color = getColorValue(this.form.color)
      form.duration = this.form.duration
      let msg = ''
      // form.endTime = form.endTime > duration ? duration : form.endTime
      if (this.isEditDialog) {
        await updateMark(form)
        msg = '编辑成功'
      } else {
        await addMark(form)
        msg = '添加成功'
      }
      this.isLoading = false
      this.$message.success(msg)
      this.getMarkList()
      this.handleClickCancel()
    }

  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-dialog {
    background: #232324;
    border-radius: 10px;
  }
  ::v-deep .el-dialog__body {
    padding-bottom: 0;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #000;
    padding: 20px;
    height: 64px;
  }
  ::v-deep .el-dialog__title {
    color: #dedede;
    font-size: 16px;
  }
  ::v-deep .el-form-item--mini.el-form-item {
    margin-bottom: 20px;
  }
  ::v-deep .el-form-item__label {
    color: #999;
  }
  ::v-deep .el-input__inner {
    &:focus{
      background: #fff;

    }
    background: none;
  }
  ::v-deep .el-input--mini .el-input__inner {
    height: 32px;
    line-height: 32px;
    color: #D9D9D9;
    border-color: #4d4d4d;
    &:focus{
      color:#333333;
    }
  }
  ::v-deep .el-textarea__inner {
    padding: 4px 8px;
    background: none;
    color: #999;
    border-color: #4d4d4d;
    line-height: 22px;
    &:hover,
    &:active,
    &:focus {
      border-color: #4d4d4d;
    }
    &:focus{
      background: #fff;
    }
  }
  ::v-deep .el-form-item--mini .el-form-item__error {
    padding-top: 6px;
  }
  ::v-deep .el-input__count{
    background: none;
    bottom:10px;
  }
  .mark-colors {
    span {
      width: 24px;
      height: 24px;
      border-radius: 3px;
      // margin-right: 24px;
      border: 1px solid #fff;
      &.active {
        border-color: #fff !important;
      }
      &:nth-child(5), &:nth-child(6),&:nth-child(8){
        &.active {
          border:1px solid #000 !important;
           i {
             color: #000;
          }
        }
      }
      i {
        color: #fff;
      }
    }
  }
  .form-buttons {
    .button {
      width: 82px;
      height: 32px;
      margin: 0;
      margin-bottom: 10px;
      font-size: 14px;
      border-radius: 4px;
      &.cancel {
        background: none;
        color: #999;
        border: 1px solid #a6a6a6;
      }
      &.delete {
        background: none;
        color: #f54a4c;
        border: 1px solid #f99597;
      }
    }
  }
  .name-tips{
    padding-top:6px;
    font-size:12px;
    line-height: 20px;
    color:#D9D9D9
  }
  .start-time{
    color:#D9D9D9
  }
</style>
