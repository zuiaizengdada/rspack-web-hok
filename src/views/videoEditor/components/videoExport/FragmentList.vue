<template>
  <div class="fragment-container video-custom-scroll">
    <div class="check-title">
      <el-checkbox v-model="checkAll" :disabled="disableCheckAll() " :indeterminate="isIndeterminate" class="head" @change="handleChangeAll">
        <span v-if="obj.isEmptyMirror === 1" class="emptyScene">空镜</span>
        {{ name }}（{{ frameList.length }}）
      </el-checkbox>
      <span v-if="exportStatus!==1" :class="`exportStatus${exportStatus}`">{{ exportStatusMap[exportStatus] }}</span>
      <i v-if="obj.loading" class="el-icon-loading treeIcon" />
      <i v-else class="el-icon-caret-bottom treeIcon" :class="{active: !obj.open}" @click="openTree" />
    </div>
    <div v-if="obj.open" class="check-list">
      <el-checkbox-group v-model="checkList" @change="handleCheckedItem">
        <div
          v-for="(item, index) in frameList"
          :key="item.cuttingId"
          class="flex justify-between items-center check-item"
          :class="{active:(index===activePlayingIndex && activeCuttingId === item.uid),preview:(index===previewPlayIndex && activeCuttingId === item.uid)}"
        >
          <el-checkbox :label="item.label" :disabled="disableCheckbox(item)">
            <span v-if="item.name">{{ item.name }}</span>
            <span v-else>片段 {{ index + 1 }}</span>
            <em class="label-time">{{ item.label }}</em>
          </el-checkbox>
          <svg-icon v-if="frameList.length>1" icon-class="video_updataName" class="video_updataName" @click.prevent="updataName(item)" />
          <mark-list :list="item.markList" />
          <span class="right">
            <el-tooltip class="item" effect="dark" content="已导出" placement="top">
              <svg-icon v-if="item.isExport === 2" icon-class="exportStatus3" class="frame-export" />
            </el-tooltip>
            <em @click="handleClickPreview(item,index)">预览</em>
            <i class="el-icon-arrow-right" />
          </span>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import MarkList from './MarkList.vue'
import { markList, editPartName } from '../../api'
import {
  getDurationSS,
  formatPrTime,
  getDurationMS
} from '../../utils'
export default {
  components: {
    MarkList
  },
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    frameList: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    },
    activeCuttingId: {
      type: String,
      default: ''
    },
    selectLength: {
      type: Number,
      default: 0
    },
    maxCanSelect: {
      type: Number,
      default: 0
    },
    exportStatus: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      checkList: [],
      exportStatusMap: {
        1: '未导出',
        2: '部分导出',
        3: '已导出'
      },
      checkAll: false,
      isIndeterminate: false,
      videoName: '',
      activePlayingIndex: -1,
      previewPlayIndex: -1
    }
  },
  watch: {
    list: {
      handler(val) {
        this.initFrameList(val)
      },
      deep: true
    },
    name(val) {
      this.videoName = val
    }
  },
  methods: {
    initFrameList(list) {
      // const activeList = this.$route.query.list.split(',')
      // this.frameList = list
      // activeList.forEach(item => {
      //   if (item) {
      //     this.checkList.push(list[item].label)
      //   }
      // })
      // setTimeout(() => { this.emitCheckedItem() }, 1000)
    },
    updataName(item) {
      console.log(item, 'item')
      //  不能包含（/ : * ? " < > |）这些字符且不能超过30个字符
      this.$prompt('请输入片段名称', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: item.name,
        inputPattern: /^[^\/\:\*\?\"\<\>\|]{1,30}$/,
        inputErrorMessage: '不超过30个字且不包含（/ : * ? " < > |）特殊字符'
      }).then(({ value }) => {
        const params = {
          videoId: this.obj.videoId,
          cuttingId: item.cuttingId,
          name: value
        }
        editPartName(params).then(res => {
          item.name = value
          this.handleCheckedItem(this.checkList)
          this.$message.success('修改成功')
        })
      }).catch(() => {})
    },
    geSelctAllStatus() {
      return this.checkList.length === this.frameList.length
    },
    clearCheckArray() {
      this.$nextTick(() => {
        this.checkList = []
        this.isIndeterminate = false
        this.activePlayingIndex = -1
        this.previewPlayIndex = -1
        this.checkAll = false
      })
      this.obj.cutting?.some(item => {
        if (item.exportChecked) {
          this.$set(this.obj, 'exportChecked', true)
        }
      })
    },
    handleChangeAll(val, e, val1) {
      if (val) {
        let length = this.maxCanSelect - this.selectLength
        const ids = this.checkList.reduce((pre, next) => {
          pre.push(next.item)
          return pre
        }, [])
        if (this.frameList.length <= length) {
          const labelList = []
          this.frameList.forEach(item => {
            labelList.push(item.label)
          })
          this.checkList = labelList
        } else {
          this.frameList.forEach(item => {
            if (!ids.includes(item.label) && length > 0) {
              this.checkList.push(item.label)
              length--
            }
          })
        }
      } else {
        this.checkList = []
      }

      this.checkAll = this.checkList.length === this.frameList.length
      this.isIndeterminate = this.checkList.length > 0 && this.checkList.length < this.frameList.length
      this.emitCheckedItem(val, val1)
    },
    handleCheckedItem(val) {
      console.log('handleCheckedItem---------', this.frameList)
      const checkedCount = val.length
      // 如果选中的个数等于总个事表示全部选中
      this.checkAll = checkedCount === this.frameList.length
      if (this.checkAll) {
        this.$emit('changeCount', true)
      }
      if (checkedCount === 0) {
        this.$emit('changeCount', false)
      }
      // 全选样式判断
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.frameList.length
      const list = []
      val.forEach((item) => {
        const duration = this.getDurationTime(item)
        let index
        let start
        let end
        let name
        let cuttingId
        this.frameList.forEach((_item, _index) => {
          if (item === _item.label) {
            index = _index
            start = _item.start
            end = _item.end
            name = _item.name
            cuttingId = _item.cuttingId
          }
        })
        list.push({ index, item, start, end, name, duration, cuttingId, videoName: this.name })
      })
      this.$emit('check', { list, videoId: this.obj.videoId })
    },
    emitCheckedItem(val, val1) {
      console.log('emitCheckedItem-----', val, val1)
      const list = []
      this.checkList.forEach((item) => {
        const duration = this.getDurationTime(item)
        const arr = item.replaceAll(' ', '').split('-')
        const start = formatPrTime(arr[0]) * 1000
        const end = formatPrTime(arr[1]) * 1000
        let index
        let cuttingId
        let name
        this.frameList.forEach((_item, _index) => {
          if (item === _item.label) {
            index = _index
            cuttingId = _item.cuttingId
            name = _item.name
          }
        })
        list.push({ index, item: item, start, end, duration, cuttingId, name, videoName: this.name })
      })
      this.$emit('check', { list, videoId: this.obj.videoId }, val, val1)
    },
    // 视频预览
    handleClickPreview(data, index) {
      console.log(data, index)
      this.previewPlayIndex = index
      data.previewPlayIndex = index
      data.videoName = this.name
      data.videoUrl = this.obj.videoUrl
      data.duration = getDurationSS((data.end - data.start))
      this.$emit('preview', data)
    },
    // 视频预览不播放
    handleClickPreviewPause(data, index) {
      this.previewPlayIndex = index
      data.previewPlayIndex = index
      data.videoName = this.name
      data.videoUrl = this.obj.videoUrl
      data.duration = getDurationSS((data.end - data.start))
      this.$emit('previewPause', data)
    },
    getDurationTime(str) {
      const list = str.replaceAll(' ', '').split('-')
      const t1 = formatPrTime(list[0])
      const t2 = formatPrTime(list[1])
      return getDurationMS((t2 - t1) * 1000)
    },
    updateActiveItem(index) {
      this.activePlayingIndex = index
    },
    // 点击展开
    openTree() {
      return new Promise((resolve) => {
        if (this.obj.open) {
          this.obj.open = false
          resolve()
        } else {
          this.obj.loading = true
          const params = {
            videoId: this.obj.videoId
          }
          markList(params).then(res => {
            console.log(res, this.obj)
            this.obj.cutting.forEach((item, index) => {
              const markList = []
              if (res.data.length) {
                res.data.forEach(_item => {
                  if ((item.end / 1000) > _item.startTime && (item.start / 1000) < _item.endTime) {
                    markList.push(_item)
                  }
                })
              }
              item.markList = markList
            })
            // this.obj.markList = res.data
            // this.frameList
            this.obj.loading = false
            this.obj.open = true
            resolve()
          }).catch(() => {
            this.obj.open = true
            this.obj.loading = false
            resolve()
          })
        }
      })
    },
    // 默认选中
    checkInit(arr = []) {
      console.log('进来了默认选中')
      this.checkList = []
      if (arr.length > 0 && this.obj?.cutting?.length > 0) {
        arr.map((v, i) => {
          i < 10 && this.checkList.push(this.obj.cutting[v].label)
        })
        this.handleCheckedItem(this.checkList)
      }
    },
    disableCheckbox(data) {
      return !this.checkList.includes(data.label) && this.selectLength === this.maxCanSelect
      // const disableMark = !data.cuttingId && data.markList.length > 0
      // if (disableMark) {
      //   return true
      // } else {
      //   return !this.checkList.includes(data.label) && this.selectLength === this.maxCanSelect
      // }
    },
    // 外部删除 选中项
    splice(row) {
      const index = this.checkList.indexOf(row.item)
      if (index < 0) return
      this.checkList.splice(index, 1)
      this.handleCheckedItem(this.checkList)
    },
    disableCheckAll() {
      // console.log(this.obj, 1111111)
      // const cuttingList = this.obj.cutting
      // if (cuttingList.length < 2) {
      //   const markList = cuttingList[0].markList
      //   if (markList.length > 0) {
      //     return true
      //   } else {
      //     return false
      //   }
      // } else {
      //   return (this.selectLength === this.maxCanSelect) && !this.checkAll
      // }
      return (this.selectLength === this.maxCanSelect) && !this.checkAll
      // const cuttingList = this.obj.cutting
      // if (cuttingList.length < 2) {
      //   return true
      // } else {
      //   return (this.selectLength === this.maxCanSelect) && !this.checkAll
      // }
    }

  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-checkbox {
      color: #d9d9d9;
      display: flex;
      align-items: center;
      .el-checkbox__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 220px;
      }
    }
    .emptyScene{
      padding: 0 8px;
      height: 18px;
      background: #52D3B6;
      border-radius: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height:20px;
      text-align: center;
      margin-right: 4px;
    }
    .check-title {
      display: flex;
      align-items: center;
      .exportStatus2,.exportStatus3{
        border-radius: 10px;
        padding: 0 10px;
        height: 18px;
        line-height: 18px;
        box-sizing: border-box;
        font-size: 12px;
        font-weight: 400;
        color: #FFFFFF;
        margin-right: 10px;
        position: absolute;
        right: 32px;
      }
      .exportStatus2{
        background: #1A8EC7;
      }
      .exportStatus3{
        background: #00B42A;
      }
      .head {
        display: flex;
        align-items: center;
        height: 28px;
        line-height: 28px;
        max-width: 440px;
        .el-checkbox__label {
          font-size: 16px;
          font-weight: 400;
          width: 450px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 28px;
        }
      }
    }
    .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
      border-color: #0C6FFF;
      &::before {
        background-color: #0C6FFF;
      }
    }
  }
  .fragment-container + .fragment-container {
    margin-top: 16px;
  }
  .fragment-container {
    user-select: none;
    .check-title{
      height: 28px;
      position: relative;
      margin-left:10px;
      margin-right: 18px;
      padding-left: 10px;
      padding-right: 28px;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        background: #444;
        border-radius: 4px;
      }
      .treeIcon {
        cursor: pointer;
        width: 18px;
        height: 18px;
        position: absolute;
        right: 10px;
        top: 5px;
        font-size: 18px;
        color: #D9D9D9;
        // transform: rotate(0);
        transition: all .5s inherit;
      }
      .active {
        transform: rotate(-90deg);
      }
    }
    .check-list{
      padding: 16px 18px 0px 10px;
      border-radius: 8px;
      // border: 1px solid #4d4d4d;
      width: 100%;
      // overflow: auto;
      // height: 410px;
      .check-item:hover .video_updataName{
        display: inline-block;
      }
      .check-item{
         margin-bottom:16px;
         height: 28px;
         padding-right: 10px;
         padding-left: 33px;
         font-size:14px;
         .video_updataName{
          display: none;
          font-size: 18px;
          margin-left: 6px;
        }
         .right{
          // width:52px;
          text-align:center;
          display: flex;
          align-items: center;
          .frame-export{
            margin-right: 8px;
          }
          em{
            cursor: pointer;
            font-style: normal;
            color:#1778FF;
          }
          i{
            font-size:16px;
            margin-top:2px;
            color: #D9D9D9;
            font-weight: bold;
            text-align: right;
            display: none;
          }
         }
        &.preview{
          .right{
            em{
              display: none;
            }
            i{
              display: block;
            }
          }
        }
        &.active,&:hover,&.preview{
          background:#444 ;
          border-radius: 4px;
        }
        &.active{
          i{
            display: block;
          }
        }
      }
    }
    .label-time{
      margin-left:8px;
      font-style: normal;
    }
  }

  .grayChecked {
    // background: #323232;
    ::v-deep .el-checkbox__label {
      color: #999;
    }
  }

</style>
