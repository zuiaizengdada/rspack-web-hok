<template>
  <div class="task-child-upload">
    <div class="task-child-upload-l">
      <svg-icon :icon-class="info.icon" class="task-child-upload-l-icon" />
      <div v-if="info.status === 'pause'" class="task-child-upload-l-stop">
        <svg-icon icon-class="t_suspend" />
      </div>
    </div>
    <div class="task-child-upload-r">
      <div class="task-child-upload-r-info">
        <div class="task-child-upload-r-info-title">{{ info.filename }}</div>
        <div class="task-child-upload-r-info-status">{{ info.origin }}</div>
      </div>
      <div v-if="info.status === 'uploading' || info.status === 'pause'" class="m-t-8">
        <el-progress :stroke-width="6" :percentage="progress" :format="progressFormat" />
      </div>
      <div class="task-child-upload-r-upload-msg">
        <div class="task-child-upload-r-upload-msg-l">
          <div>{{ info.size | getFileSize }}</div>
          <template>
            <div v-if="info.status === 'parsing-wait'" class="m-l-16">等待中…</div>
            <div v-if="info.status === 'parsing'" class="task-color-orange m-l-16">解析中</div>
            <div v-else-if="info.status === 'uploading'" class="m-l-16">上传中</div>
            <div v-else-if="info.status === 'wait'" class="m-l-16">等待中…</div>
            <div v-else-if="info.status === 'pause'" class="m-l-16">暂停中</div>
            <div v-else-if="info.status === 'fail'" class="task-color-red m-l-16">
              <span style="margin-right: 4px">上传失败</span>
              <el-popover placement="bottom" width="268" trigger="hover">
                <span class="errorReason">{{ info.errorReason }}</span>
                <svg-icon slot="reference" icon-class="questionRed" style="font-size: 16px;margin-top:1px;" />
              </el-popover>
            </div>
            <div v-else-if="info.status === 'success'" class="task-color-green m-l-16">上传成功</div>
            <div v-if="info.status === 'uploading' || info.status === 'pause'" class="m-l-5">{{ progress }}%</div>
          </template>
        </div>
        <div>
          <el-button v-if="info.status === 'pause'" type="text" :loading="info.loading" class="task-child-upload-r-upload-msg-r-action" @click.stop="debounceMethods(handleClickReload)">继续上传</el-button>
          <el-button v-if="info.status === 'uploading'" type="text" :loading="info.loading" class="task-child-upload-r-upload-msg-r-action" @click.stop="debounceMethods(handleClickPause)">暂停上传</el-button>
          <!-- <el-button v-if="info.status === 'fail'" :loading="info.loading" type="text" class="task-child-upload-r-upload-msg-r-action" @click.stop="handleClickAgain">重新上传</el-button> -->
          <el-button v-if="info.status !== 'uploading' && info.status !== 'parsing'" :loading="info.loading" type="text" class="task-child-upload-r-upload-msg-r-action-del" @click.stop="delUploadFile">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  filters: {
    // 获取文件大小
    getFileSize(size) {
      if (typeof size !== 'number') {
        return '未知'
      }
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      return size
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          icon: 't_video', // 展示图标
          status: '', // 上传状态 parsing 解析中 parsing-wait解析等待中 uploading上传中 wait等待中 pause暂停中 fail上传失败 success 上传成功
          filename: '', // 文件名称
          origin: '', // 文件来源
          originUrl: '', // 上传来源地址pathName
          progress: '', // 文件进度
          errorReason: '', // 错误原因
          loading: false //
        }
      }
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      debounceTimer: null
    }
  },
  watch: {},
  destroyed() {},
  mounted() {},
  methods: {
    // 点击重新上传
    handleClickAgain() {
      this.$emit('handleClickAgain')
    },
    // 点击删除按钮
    delUploadFile() {
      console.log('点击删除')
      this.$emit('fairing')
    },
    // 指定进度条文字内容
    progressFormat(percentage) {
      return ''
    },
    debounceMethods(func, ...args) {
      const context = this
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      const callNow = !this.debounceTimer // 是否立即执行
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null
      }, 1000)
      if (callNow) func.apply(context, args)
    },
    // 点击暂停上传
    handleClickPause() {
      this.$emit('handleClickPause')
    },
    // 点击继续上传
    handleClickReload() {
      if (this.info.status !== 'pause') {
        return
      }
      this.$emit('handleClickReload')
    }
  }
}
</script>

<style lang='scss' scoped>
 .task-child-upload {
    width: 438px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #EFF2F6;
    display: flex;
    line-height: normal;
    margin: 16px auto 0;
    .task-child-upload-l {
        margin-right: 8px;
        display: flex;
        align-infos: center;
        justify-content: center;
        width: 52px;
        min-width: 52px;
        height: 52px;
        background: #ECF5FE;
        border-radius: 4px;
        position: relative;
        display: flex;
        align-items: center;
        justify-items: center;
        .task-child-upload-l-icon {
            font-size: 38px;
        }
        .task-child-upload-l-stop {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            font-size: 38px;
            display: flex;
            align-infos: center;
            justify-content: center;
            background: rgba(71,160,251,0.4);
            border-radius: 4px;
            backdrop-filter: blur(1px);
            display: flex;
            align-items: center;
            justify-items: center;
        }
    }
    .task-child-upload-r {
        line-height: normal;
        flex: 1;
        .task-child-upload-r-info {
          display: flex;
            .task-child-upload-r-info-title {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 258px;
            }
            .task-child-upload-r-info-status {
                padding: 0 10px;
                font-size: 12px;
                font-family: MicrosoftYaHei;
                color: #333333;
                background: #EFF2F6;
                border-radius: 4px;
                border: 1px solid #E1E6ED;
                margin-left: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 95px;
            }
        }
        .task-child-upload-r-upload-msg {
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 8px;
            .task-child-upload-r-upload-msg-l {
                display: flex;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #999999;
            }
            .task-child-upload-r-upload-msg-r-action {
              // font-size: 14px;
              color: #0C6FFF;
              // font-family: MicrosoftYaHei;
              // padding-top: 0;
              // padding-bottom: 0;
            }
            .task-child-upload-r-upload-msg-r-action-del {
                color: #F53F3F;
                // font-size: 14px;
                // font-family: MicrosoftYaHei;
                // padding-top: 0;
                // padding-bottom: 0;
            }
        }
    }
    .task-color-green {
        color: #00B42A;
    }
    .task-color-red {
      display: flex;
      align-items: center;
      color: #F53F3F;
    }
    .task-color-orange {
      font-size: 14px;
      color: #FF7D00;
    }
}
.m-l-5 {
  margin-left: 5px;
}
.errorReason {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}
::v-deep {
  .el-popover {
    padding: 8px;
  }
  .el-popover__reference-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
