<template>
  <div class="reply-right">
    <span v-if="!hideTitle" style="margin-bottom: 10px">欢迎语</span>
    <el-form
      v-if="!hideContent"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="0px"
      class="form-container"
    >
      <el-form-item prop="content">
        <el-input
          ref="contentInput"
          v-model="form.content"
          :disabled="disabled"
          type="textarea"
          :rows="8"
          placeholder="请输入"
          maxlength="600"
          show-word-limit
          @focus="handleFocus"
          @change="getData('change')"
          @blur="getSelectionStart"
        />
        <div v-if="isHint" class="taps">
          任务中的欢迎语优先级高于个人设置，若任务中已设置欢迎语超过9条，此处设置无效
        </div>
      </el-form-item>
    </el-form>
    <img
      v-if="showStudyCard"
      class="xuxiCard"
      src="@/assets/image/xuxiCard.png"
      alt=""
    />
    <div class="reply-right-btn">
      <el-button
        v-if="!disabled"
        v-show="isAdd"
        type="primary"
        size="mini"
        plain
        @click="handleAdd"
      >
        <i class="el-icon-plus el-icon--left" style="font-weight: 900" />
        新增附件
      </el-button>
      <el-button
        v-if="!disabled"
        v-show="isAdd"
        type="primary"
        size="mini"
        plain
        @click="handleAddCourse"
      >
        <i class="el-icon-plus el-icon--left" style="font-weight: 900" />
        添加课程学习入口
      </el-button>
      <el-button
        v-if="!disabled"
        v-show="isAdd"
        type="primary"
        size="mini"
        plain
        @click="handleAddWXnickName"
      >
        <i class="el-icon-plus el-icon--left" style="font-weight: 900" />
        插入昵称
      </el-button>
    </div>
    <div v-if="isAdd" class="reply-content">
      <draggable
        :list="items"
        tag="div"
        draggable=".reply-items"
        v-bind="{
          animation: 500,
          handle: '.draggle'
        }"
        :move="handleMove"
        @end="getData('sort')"
      >
        <template v-for="(item, index) in items">
          <div
            v-if="item.type"
            :key="item.type + index + item.linkImgUrl"
            class="reply-items"
          >
            <div class="reply-items__content">
              <template v-if="item.type === 2">
                <div class="reply-items__title">
                  {{ item.linkTitle }}
                </div>
                <div class="flex flex-middle">
                  <div class="reply-items__desc">
                    {{ item.linkDesc }}
                  </div>
                  <img :src="item.linkImgUrl" alt="" />
                </div>
              </template>
              <template v-else-if="item.type === 1">
                <img class="reply-items__img" :src="item.linkImgUrl" alt="" />
              </template>
              <template v-else-if="item.type === 3">
                <img
                  class="reply-items__img"
                  src="@/assets/image/task_qrCode.png"
                  alt=""
                />
              </template>
              <template v-else-if="item.type === 5">
                <div class="videoBox">
                  <video :src="item.videoUrl" />
                  <div>{{ item.name }}</div>
                </div>
              </template>
              <template v-else-if="item.type === 6">
                <div class="videoBox">
                  <img
                    v-if="showFileImg(['xls', 'xlsx', 'cvs', 'xlsm'], item)"
                    src="@/assets/image/pdf.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img
                    v-else-if="showFileImg(['ppt', 'pptx'], item)"
                    src="@/assets/image/ppt.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img
                    v-else-if="showFileImg(['pdf'], item)"
                    src="@/assets/image/ppt2.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img
                    v-else-if="showFileImg(['word', 'doc', 'docx'], item)"
                    src="@/assets/image/word.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img
                    v-else-if="showFileImg(['txt'], item)"
                    src="@/assets/image/txt.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img
                    v-else-if="showFileImg(['zip', 'rar', '7z', 'tar', 'gz'], item)"
                    src="@/assets/image/zip.png"
                    fit="contain"
                    class="size-icon"
                  />
                  <img v-else src="@/assets/image/word.png" />
                  <div>
                    {{
                      item.name
                        ? item.name
                        : item.fileUrl
                          ? item.fileUrl.split('/').pop()
                          : ''
                    }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="reply-items__dafault">
                  根据任务中实际配置的直播间给用户推送带跟进人参数的链接地址，示例如下：直播名称直播名称直播名称
                </div>
                <div class="flex flex-middle">
                  <div class="reply-items__desc">xxx邀您观看直播</div>
                  <img src="@/assets/image/task_dafultImg.png" alt="" />
                </div>
              </template>
            </div>
            <div v-if="!disabled">
              <el-button type="text" class="draggle"> 排序 </el-button>
              <el-button
                type="text"
                style="color: #f53f3f"
                @click="handleDel(item, index)"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <addAnnexDialog
      ref="addAnnexDialog"
      :type-tour="typeTour"
      :is-wx-off="isWxOff"
      @save="handleSave"
    />
  </div>
</template>

<script>
import addAnnexDialog from '../../../components/addAnnexDialog'
import draggable from 'vuedraggable'
import { taskWelcomDel, taskWelcomSave } from '@/api/privateArea/CRM'
export default {
  components: {
    addAnnexDialog,
    draggable
  },
  props: {
    isWxOff: {
      default: true,
      type: Boolean
    },
    isAdd: {
      default: true,
      type: Boolean
    },
    isHint: {
      default: false,
      type: Boolean
    },
    showStudyCard: {
      default: false,
      type: Boolean
    },
    hideContent: {
      default: false,
      type: Boolean
    },
    type: {
      default: 'wechat',
      type: String
    },
    hideTitle: {
      default: false,
      type: Boolean
    },
    typeTour: {
      default: true,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    taskId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      form: {
        content: ''
      },
      items: [],
      rules: {
        content: [{ required: true, message: '请输入欢迎语', trigger: 'blur' }]
      },
      cursorPosition: 0
    }
  },
  methods: {
    handleFocus() {
      this.$emit('handleFocus')
    },
    showFileImg(list, item) {
      const str =
        item?.name?.split('.').pop() || item?.fileUrl?.split('.').pop()
      console.log(str, 'str')
      return list.includes(str)
    },
    handleAdd() {
      const len = this.items.filter(i => i.type).length // 过滤欢迎语
      const max = this.type === 'wechat' ? 8 : 3
      if (len >= max) {
        this.$message.error(`附件最多只能新增${max}个`)
        return
      }
      this.$refs.addAnnexDialog.open(this.type)
    },
    clearValidate(value) {
      this.$refs.form.clearValidate(value)
    },
    async handleDel(item, index) {
      const { code } = await taskWelcomDel(item.id)
      if (code === 1) {
        this.items.splice(index, 1)
        this.getData('change')
      }
    },
    handleMove() {
      return true
    },
    validate(callback) {
      return this.$refs.form.validate(callback)
    },
    getItems() {
      const items = this.items
        .filter(i => i.type)
        .map((i, index) => {
          return {
            ...i,
            sort: index + 1
          }
        })
      if (this.form.content) {
        items.unshift({
          content: this.form.content
        })
      }
      return items
    },
    getData(event = 'change') {
      const items = this.items
        .filter(i => i.type)
        .map((i, index) => {
          return {
            ...i,
            sort: index + 1
          }
        })
      if (this.form.content) {
        items.unshift({
          content: this.form.content
        })
      }
      this.$emit(event, items)
    },
    async handleSave(params) {
      console.log(params, 'params')
      const { data, code } = await taskWelcomSave({
        ...params,
        taskId: this.taskId
      })
      if (code === 1) {
        this.items.push({
          ...params,
          id: data
        })
        this.getData('change')
      }
    },
    getSelectionStart() {
      // 获取失焦时光标位置
      this.cursorPosition = this.$refs.contentInput.$refs.textarea.selectionStart
    },
    handleAddWXnickName() {
      // 根据当前光标的位置插入文本@{微信昵称}，未找到光标位置则插入到末尾
      const content = this.form.content
      const cursorPosition = this.cursorPosition
      this.form.content = content.slice(0, cursorPosition) + '@{微信昵称}' + content.slice(cursorPosition)
      this.getData('change')
    },
    async handleAddCourse() {
      const params = {
        link: 'tempLink',
        linkDesc: '课程简介',
        linkImgUrl: 'https://oss.hokkj.cn/hok_admin/img/0d80f70a552a4464921596d0aa6fb8ec.png',
        linkTitle: '课程简称（根据购买情况显示）',
        type: 2
      }
      const { data, code } = await taskWelcomSave({
        ...params,
        taskId: this.taskId
      })
      if (code === 1) {
        this.items.push({
          ...params,
          id: data
        })
        this.getData('change')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.taps {
  font-weight: 400;
  font-size: 12px;
  color: #999999;
  line-height: 17px;
  text-align: left;
  font-style: normal;
  margin-top: 10px;
}
.videoBox {
  display: flex;
  align-items: center;
  > img {
    width: 50px;
  }
  > video {
    width: 100px;
    height: 100px;
  }
  > div {
    margin-left: 10px;
    max-width: 200px;
    overflow: hidden; /*必须结合的属性,当内容溢出元素框时发生的事情*/
    text-overflow: ellipsis; /*可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
    display: -webkit-box; /*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    -webkit-box-orient: vertical;
  }
}
.reply-right ::v-deep {
  padding: 20px;
  display: flex;
  flex-direction: column;
  .draggle {
    cursor: move;
  }
  .reply-right-btn {
    margin: 20px 0 20px 0;
    .el-button {
      color: #0c6fff;
      background: #fff;
      border-color: #0c6fff;
    }
  }
  .reply-content {
    .reply-items {
      width: 450px;
      background: #f5f9ff;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .reply-items__content {
        width: 305px;
        margin-right: 40px;
        .reply-items__title {
          color: #333333;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .reply-items__dafault {
          color: #333333;
          font-size: 16px;
          line-height: 20px;
        }
        .reply-items__desc {
          overflow: hidden;
          width: 245px;
          height: 43px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #777777;
          font-size: 14px;
          margin-right: 10px;
        }
        img {
          width: 48px;
          height: 48px;
          border-radius: 2px;
        }
        .reply-items__img {
          width: 80px;
          height: 80px;
          border-radius: 2px;
        }
      }
    }
  }
  .el-textarea {
    width: 80%;
    margin: 0;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #606266;
    background-color: #ffffff;
    border-color: #dfe4ed;
    cursor: not-allowed;
  }
  .xuxiCard {
    width: 280px;
    height: 85px;
    margin: 12px 0;
  }
}
</style>
