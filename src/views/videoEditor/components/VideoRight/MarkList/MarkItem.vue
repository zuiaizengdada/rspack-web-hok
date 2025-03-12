<template>
  <div class="relative mark-item-container">
    <div class="flex">
      <div class="image-box" :index="form.pictureUrl">
        <p class="color-tag" :style="{ backgroundColor: form.color}" />
        <el-image class="image" lazy :src="form.pictureUrl" fit="cover " />
      </div>
      <div class="flex justify-between flex-1 content">
        <div class="flex flex-col justify-between info">
          <div
            class="flex items-center"
          ><label class="flex-none font-normal">名称:</label>
            <p @click.stop="handleClickEdit('name',$event)">
              <el-input v-show="isEditName" ref="name" v-model="form.name" class="input" size="mini" @keyup.enter.native="validInputName" @blur="validInputName" />
              <span v-show="!isEditName" style="color: #d9d9d9; display:block;width:70px" class="truncate">{{ form.name }}</span>
            </p>
          </div>
          <div
            class="flex items-center"
          ><label class="flex-none font-normal">入点:</label>
            <p @click.stop="handleClickEdit('start',$event)">
              <el-input v-show="isEditStart" ref="start" v-model="form.startTime" class="input" size="mini" @keyup.enter.native="validInputStart" @blur.stop="validInputStart" />
              <span v-show="!isEditStart">{{ form.startTime }}</span>
            </p>
          </div>
          <div
            class="flex items-center"
          ><label class="flex-none font-normal">出点:</label>
            <p @click.stop="handleClickEdit('end',$event)">
              <el-input v-show="isEditEnd" ref="end" v-model="form.endTime" class="input" size="mini" @keyup.enter.native="validInputEnd" @blur.stop="validInputEnd" />
              <span v-show="!isEditEnd">{{ form.endTime }}</span>
            </p>
          </div>
        </div>
        <div class="other" :title="form.notes" :class="{border:form.notes.length}">
          <p @click.stop="handleClickEdit('notes',$event)">
            <el-input v-show="isEditNotes" ref="notes" v-model="form.notes" class="input" type="textarea" maxlength="200" size="mini" @keyup.enter.native="validItemNotes" @blur.stop="validItemNotes" />
            <span v-show="!isEditNotes">{{ form.notes }}</span>
          </p>
        </div>
      </div>
    </div>
    <p class="item-line" />
  </div>
</template>
<script>
import { updateMark } from '../../../api'
import { getFormatSSS, formatPrTime, getColorValue } from '../../../utils'
export default {
  inject: ['video', 'getMarkList'],
  directives: {
    focus: {
      bind(el) {
        el.focus()
      }
    }

  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        startTime: '',
        endTime: '',
        name: '',
        notes: ''
      },
      isEditStart: false,
      isEditEnd: false,
      isEditName: false,
      isEditNotes: false
    }
  },
  watch: {
    data: {
      handler(val) {
        this.form = val
        this.initMark()
      },
      deep: true
    }
  },
  mounted() {
    this.initMark()
    document.addEventListener('click', () => {
      this.resetInit()
    })
  },
  methods: {
    initMark() {
      this.form = JSON.parse(JSON.stringify(this.data))
      this.form.startTime = getFormatSSS(this.data.startTime * 1000)
      this.form.endTime = getFormatSSS(this.data.endTime * 1000)
    },
    validInputName() {
      const reg = /^[\w\u4E00-\u9FA5]+$/
      if (!reg.test(this.form.name)) {
        this.form.name = this.data.name
        this.resetInit()
      } else if (this.form.name.length === 0) {
        this.form.name = this.data.name
        this.resetInit()
      } else {
        this.updateMarkItem()
      }
    },
    validInputStart() {
      const start = formatPrTime(this.form.startTime)
      const end = formatPrTime(this.form.endTime)
      if (start || start === 0) {
        if (start > end) {
          this.form.startTime = getFormatSSS(this.data.startTime * 1000)
        } else {
          this.form.startTime = getFormatSSS(start * 1000)
          this.updateMarkItem()
        }
      } else {
        this.form.startTime = getFormatSSS(this.data.startTime * 1000)
      }
      this.resetInit()
    },
    validInputEnd() {
      const start = formatPrTime(this.form.startTime)
      let end = formatPrTime(this.form.endTime)
      if (end || end === 0) {
        const duration = this.video.detail.duration
        end = end > duration ? duration : end
        if (end < start) {
          this.form.endTime = getFormatSSS(this.data.endTime * 1000)
        } else {
          this.form.endTime = getFormatSSS(end * 1000)
          this.updateMarkItem()
        }
      } else {
        this.form.endTime = getFormatSSS(this.data.endTime * 1000)
      }
      this.resetInit()
    },
    validItemInput() {
      const duration = this.video.detail.duration
      let start = formatPrTime(this.form.startTime)
      let end = formatPrTime(this.form.endTime)
      if (end > duration) {
        end = duration
      } else if (end < start) {
        end = this.data.endTime
      } else if (start > end) {
        start = this.data.startTime
      }
      this.form.startTime = getFormatSSS(start * 1000) || this.data.startTime
      this.form.endTime = getFormatSSS(end * 1000) || this.data.endTime
      this.resetInit()
      this.updateMarkItem()
    },
    validItemNotes() {
      this.resetInit()
      this.updateMarkItem()
    },
    async updateMarkItem() {
      const item = JSON.parse(JSON.stringify(this.form))
      item.startTime = formatPrTime(this.form.startTime)
      item.endTime = formatPrTime(this.form.endTime)
      item.videoId = this.video.detail.id
      item.color = getColorValue(item.color)
      await updateMark(item)
      this.resetInit()
      this.getMarkList()
    },
    handleClickEdit(type, e) {
      this.resetInit()

      if (type === 'start') {
        this.isEditStart = true
        // this.$refs.start.focus()
      } else if (type === 'end') {
        this.isEditEnd = true
        // this.$refs.end.focus()
      } else if (type === 'name') {
        this.isEditName = true
        // this.$refs.name.focus()
      } else if (type === 'notes') {
        this.isEditNotes = true
        // this.$refs.notes.focus()
      }

      // const input = e.currentTarget.firstElementChild.querySelector('input')
      // input.focus()
    },
    resetInit() {
      this.isEditStart = false
      this.isEditEnd = false
      this.isEditName = false
      this.isEditNotes = false
    }

  }
}
</script>
<style lang="scss" scoped>
  .mark-item-container {
    position: relative;
    .image-box {
      width: 125px;
      height: 70px;
      flex: none;
      position: relative;
      .image {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
      .color-tag {
        position: absolute;
        top: 50%;
        left: 0;
        height: 50px;
        transform: translateY(-50%);
        border-radius: 0px 100px 100px 0px;
        width: 4px;
        z-index: 2;
      }
    }
    .content {
      font-size: 12px;
      color: #a6a6a6;
      margin-left:12px;
      .info {
        line-height: 20px;
        width:116px;
        p {
          margin-bottom: 5px;
          &:last-child {
            margin-bottom: 0;
          }
          span {
            color: #73aeff;
            margin-left: 4px;
          }
        }
      }
      .other {
        flex: 1;
        margin-left: 6px;
        border-radius: 4px;
        font-size:12px;
        border: 1px solid #4D4D4D;
        p{
          height:100%;
          span{
              line-height: 20px;
              padding:4px 6px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              text-overflow: -webkit-ellipsis-lastline;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              line-clamp: 3;
              -webkit-box-orient: vertical;
          }
        }
      }
    }
    .item-line{
      height: 1px;
      padding: 0 24px;
      background: #4d4d4d;
      margin-top:10px;
    }
  }
  ::v-deep .el-input--mini .el-input__inner {
    height: 18px;
    line-height: 18px;
    margin-left: 4px;
    width: 78px;
    padding: 0 4px;
    font-size: 12px;
  }
  ::v-deep .el-textarea.el-input--mini{
    height:100%;
  }
  ::v-deep .el-textarea__inner{
    height: 100%;
    padding:4px 6px;
    line-height: 20px;
  }
</style>
