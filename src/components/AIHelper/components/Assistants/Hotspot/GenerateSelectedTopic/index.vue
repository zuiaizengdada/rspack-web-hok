<template>
  <div class="generateSelectedTopic">
    <template v-if="!obj.isHistory">
      <!-- <div class="title">生成选题:</div> -->
      <div class="item">
        <!-- <i>*</i> -->
        <div class="lable">选题字数：</div>
        <el-input
          v-model.number="input"
          style="font-size: 14px"
          :disabled="obj.status > 0"
          placeholder="请输入内容"
        />
      </div>
      <div class="item">
        <div class="lable">IP老师：</div>
        <el-select
          v-model="value1"
          style="font-size: 14px"
          class="select-teacher"
          multiple
          :disabled="obj.status > 0"
          filterable
          clearable
          remote
          :remote-method="teacherQueryByName"
          :popper-append-to-body="false"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="item flex-top">
        <div class="lable" style="width: 88px">选题模版：</div>
        <el-input
          v-model="textarea"
          type="textarea"
          style="font-size: 14px"
          :rows="6"
          :disabled="obj.status > 0"
          maxlength="2000"
          show-word-limit
          resize="none"
          placeholder="请输入内容"
        />
      </div>
      <div v-if="obj.status === 0" class="bottom-operate">
        <div class="flex flex-middle">
          <div class="float-bottom" @click="submit">
            <img
              class="img-default"
              src="@/assets/image/aigc/qdsc.png"
              alt=""
            />
            <!-- <img
              class="img-hover"
              src="@/assets/image/aigc/qdscxt.png"
              alt=""
            > -->
            <span class="title-span"> 确定生成 </span>
          </div>
          <span class="close" @click.stop="close">
            <img
              class="img-default"
              src="@/assets/image/aigc/close-qxsc.png"
              alt=""
            />
            取消生成</span>
        </div>
        <div class="float-bottom2" @click="isSelectedTopicTemplate = true">
          <img class="img-default" src="@/assets/image/aigc/xzmb.png" alt="" />
          <span class="title-span title-span-reset"> 选题参考模板</span>

          <SelectedTopicTemplate
            v-if="isSelectedTopicTemplate"
            ref="selectedTopicTemplateRef"
            @selectItem="handleSelectItem"
            @handleClose="isSelectedTopicTemplate = false"
          />
        </div>
      </div>
    </template>

    <template v-if="obj.status > 0">
      <el-divider />
      <!-- 选题文案 -->
      <!-- <div class="title2">选题文案</div> -->
      <div class="xt-Content">
        <div class="selectedTopicContent">
          <VueMarkdown :source="content" />
        </div>
        <div class="bottom-operate">
          <div
            v-if="!obj.isHistory && isEnd"
            class="float-bottom"
            @click="regeneration"
          >
            <img
              class="img-default"
              src="@/assets/image/aigc/reset-cxsc.png"
              alt=""
            />
            <span class="title-span">重新生成</span>
          </div>
          <div v-if="obj.isHistory || !isEnd" />
          <div
            v-if="isEnd || obj.isHistory"
            class="float-bottom-right"
            @click="copyText"
          >
            <img
              class="img-default"
              src="@/assets/image/aigc/copy.png"
              alt=""
            />
            <!-- <img
            class="img-hover"
            src="@/assets/image/aigc/copy-hover.png"
            alt=""
          > -->
            <div class="tip">复制</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { teacherQueryByName } from '@/api/tearchCenter'
import SelectedTopicTemplate from './SelectedTopicTemplate.vue'
import { copy } from '@/utils'
import VueMarkdown from '../../../ChatFrame/VueMarkdown.vue'
export default {
  inject: ['getWS', 'createWS', 'getTypeAIList'],
  components: {
    SelectedTopicTemplate,
    VueMarkdown
  },
  props: {
    /**
     * 详情
     * @type {Object} obj
     * @property {string} status  选题生成状态 0-未生成 1-生成中 2-生成成功
     * @property {string} content 选题文案
     * @property {string} id id
     */
    obj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      input: '',
      value1: [],
      options: [],
      textarea: '',
      isSelectedTopicTemplate: false,
      content: '选题生成中...',
      copy,
      isEnd: false
    }
  },
  watch: {
    obj: {
      handler(val) {
        if (val.selectTopic) {
          this.content = val.selectTopic
        }
        // if (val.isHistory) {
        //   this.obj.isHistory = true
        // }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // this.teacherQueryByName('')
    document.addEventListener('click', this.closeSelectedTopicTemplate)
  },
  deactivated() {
    document.removeEventListener('click', this.closeSelectedTopicTemplate)
  },
  methods: {
    handleSelectItem(item) {
      this.textarea = item
      this.isSelectedTopicTemplate = false
    },
    // 复制内容到剪切板
    async copyText() {
      this.copy(this.content)
      this.$message.success({
        message: '复制成功',
        customClass: 'amap-sug-result'
      })
    },
    regeneration() {
      this.content = '选题生成中...'
      this.submit()
    },
    close() {
      this.$emit('close')
    },
    async submit() {
      if (!this.input) {
        this.$message.warning({
          message: '请输入选题字数',
          customClass: 'amap-sug-result'
        })
        return
      }
      // if (!this.value1.length) {
      //   this.$message.warning({
      //     message: '请选择IP老师',
      //     customClass: 'amap-sug-result'
      //   })
      //   return
      // }
      if (!this.textarea) {
        this.$message.warning({
          message: '请输入选题模版',
          customClass: 'amap-sug-result'
        })
        return
      }
      let ws = this.getWS()
      if (!ws || ws.readyState !== 1) {
        ws = await this.createWS()
        console.log('ws创建完成')
      }
      ws.onmessage = event => {
        const info = {
          ...JSON.parse(event.data)
        }
        if (
          info.reply === 'check' &&
          info.conversation_id === 'check' &&
          info.status === 'CHECK' &&
          info.source === 'SYSTEM'
        ) {
          return
        }
        if (this.content === '选题生成中...') {
          this.content = ''
        }
        this.content += info.reply
        const distanceToBottom =
          document.getElementById('listSelectedTopic').scrollHeight -
          document.getElementById('listSelectedTopic').scrollTop -
          document.getElementById('listSelectedTopic').clientHeight
        if (distanceToBottom < 10) {
          this.$nextTick(() => {
            // 滚动条置底
            document.getElementById('listSelectedTopic').scrollTop =
              document.getElementById('listSelectedTopic').scrollHeight
          })
        }
        if (info.status === 'DONE') {
          this.isEnd = true
          this.$emit('generateSelectedTopicSend')
        }
      }
      const tsInfo = []
      this.value1.forEach(item => {
        const data = this.options.find(f => f.value === item)
        if (data) {
          tsInfo.push({
            teacherId: data.value,
            teacherName: data.label
          })
        }
      })
      const tmp = this.getTypeAIList.find(item => item.checked)
      ws.send(
        JSON.stringify({
          scene_id: tmp.type,
          qa_mode: 'selectTopic',
          user: JSON.stringify({
            id: this.obj.id,
            content: this.obj.content,
            template: this.textarea,
            num: this.input,
            teacherInfo: tsInfo
          })
        })
      )
      this.isEnd = false
      this.obj.status = 1
      this.$nextTick(() => {
        // 滚动条置底
        document.getElementById('listSelectedTopic').scrollTop =
          document.getElementById('listSelectedTopic').scrollHeight
      })
    },
    teacherQueryByName(query) {
      teacherQueryByName({ name: query }).then(res => {
        this.options = res.data.map(item => {
          return {
            value: item.teacherId,
            label: item.teacherName
          }
        })
      })
    },
    closeSelectedTopicTemplate(e) {
      const el = this.$refs.selectedTopicTemplateRef
      // 判断点击是否在el内部
      if (
        !(el && el.$el.contains(e.target)) &&
        e.target.className !== 'title-span title-span-reset'
      ) {
        e.stopPropagation()
        this.isSelectedTopicTemplate = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.generateSelectedTopic {
  position: relative;
  margin-top: 24px;
  .title {
    font-weight: 400;
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }
  .title2 {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
  }
  .flex-top {
    align-items: baseline !important;
  }
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .lable {
      width: 80px;
      font-size: 14px;
      color: #333333;
      text-align: right;
      i {
        color: red;
        margin-right: 2px;
      }
    }
    .el-input {
      flex: 1;
    }
  }
  .bottom-operate {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    position: relative;
    .close {
      width: 132px;
      height: 40px;
      border-radius: 20px 20px 20px 20px;
      border: 1px solid #0c6fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #488ff6;
      margin-left: 20px;
      font-size: 16px;
      color: #3a7fff;
      cursor: pointer;
      .img-default {
        width: 24px;
        min-width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }
  }
  .float-bottom-right {
    user-select: none;
    position: relative;
    cursor: pointer;
    .img-default {
      width: 20px;
      min-width: 20px;
      height: 20px;
    }

    .tip {
      position: absolute;
      display: none;
      padding: 4px 8px;
      height: 25px;
      background: #f7f7f7;
      box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #67686b;
      top: -32px;
      left: -7px;
      white-space: nowrap;
    }
    &:hover {
      .tip {
        display: block;
      }
    }
  }
  .float-bottom2 {
    width: 159px;
    height: 40px;
    background: #fff;
    box-shadow: 0px 4px 10px 0px rgba(37, 62, 162, 0.2);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #488ff6;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;

    .title-span {
      font-size: 16px;
      color: #3a7fff;
    }
    .img-default {
      width: 24px;
      min-width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
  .float-bottom {
    width: 132px;
    height: 40px;
    background: #3a7fff;
    box-shadow: 0px 4px 10px 0px rgba(37, 62, 162, 0.2);
    border-radius: 20px 20px 20px 20px;
    border: 1px solid #488ff6;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;

    .tip {
      position: absolute;
      display: none;
      padding: 4px 8px;
      height: 25px;
      background: #f7f7f7;
      box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #67686b;
      top: -32px;
      left: -7px;
      white-space: nowrap;
    }
    .title-span {
      font-size: 16px;
      color: #ffffff;
    }
    .img-default {
      width: 24px;
      min-width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    .img-default2 {
      width: 20px;
      min-width: 20px;
      height: 20px;
    }
    .img-hover {
      width: 20px;
      min-width: 20px;
      height: 20px;
      display: none;
    }
    // .title-span-reset {
    //   color: #3a7fff;
    // }
    &:hover {
      // .img-default {
      //   display: none;
      // }
      // .img-hover {
      //   display: block;
      // }
      .tip {
        display: block;
      }
      // .title-span-reset {
      //   color: #3a89ff86;
      // }
    }
  }
  .xt-Content {
    padding: 0 16px 16px 16px;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #e6e9f0;
  }
  .selectedTopicContent {
    font-size: 14px;
    color: #333333;
    width: 100%;
    // white-space: pre-wrap;
    // word-break: break-all;
    margin-top: 10px;
  }
}
::v-deep {
  .select-teacher {
    flex: 1;
    .el-select__tags .el-tag {
      background: #e7f0ff;
      color: #0c6fff;
    }
  }
  .el-input__count {
    bottom: 10px;
  }
  .el-divider {
    background-color: #e6e9f0;
  }
  .el-textarea__inner {
    padding: 16px;
    color: #333;
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d0d0d0;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
  .text-content {
    font-size: 14px;
  }
  .el-select {
    .el-select__tags {
      .el-tag {
        display: flex;
        align-items: center;
      }
      .el-tag__close {
        padding-top: 1px;
        font-size: 16px;
        color: #0c6fff;
        background-color: #e7f0ff;
      }
    }
  }
}
</style>
