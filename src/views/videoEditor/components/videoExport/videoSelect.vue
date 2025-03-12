<template>
  <div class="videoSelect">
    <div>
      <div class="videoSelectTitle">
        <span>选择视频内容（{{ selectLength }}/{{ allFragmentNums }}）</span>
        <span>
          筛选：
          <el-select v-model="value" style="width: 150px;" size="mini" placeholder="请选择" @change="handleChangeContent">
            <el-option
              v-for="item in options"
              :key="item.value"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </span>
      </div>
      <div class="optPane" export-v-step="0">
        <div class="selectContent myoverflowOuto">
          <template v-for="(frameList, index) in list">
            <FragmentList
              :ref="`FragmentList${index}`"
              :key="index"
              :frame-list="frameList.cutting"
              :obj="frameList"
              :name="frameList.name"
              :export-status="frameList.exportStatus"
              :active-cutting-id="activeCuttingId"
              :select-length="selectLength"
              :max-can-select="maxCanSelect"
              @preview="preview"
              @previewPause="handleClickPreviewPause"
              @check="check"
            />
          </template>
          <template v-if="list.length === 0">
            <div class="noData">
              <img :src="nodataImg" alt="" style="width: 120px;height: 120px;" />
              <span class="noData-font">暂无数据</span>
            </div>
          </template>
        </div>
        <div class="selectAll">
          <el-checkbox v-model="selectAll" :indeterminate="isIndeterminate" @change="handleCheckAll">全选（最多选择{{ maxCanSelect }}条）</el-checkbox>
        </div>
      </div>
      <!-- <div class="saveLocation">保存位置：{{ catalogue }}</div> -->
    </div>
    <div>
      <VideoSort ref="videoSortRef" export-v-step="1" :file-info="selectObj" @del="videoDel" />
    </div>
    <tipsModel ref="tipsModel" />
  </div>
</template>

<script>
import FragmentList from './FragmentList.vue'
import { videoGenerateDetail, videoGgenerate, qryPercentage, updateIsExport, screenExportStatus } from '../../api'
import { getFormatSSS } from '../../utils'
import nodataImg from '@/assets/image/video/export_noData.png'
import tipsModel from './tipsModel.vue'
import VideoSort from './sort.vue'
export default {
  components: {
    FragmentList,
    tipsModel,
    VideoSort
  },
  props: {
    projectId: {
      type: String,
      default: ''
    },
    projectVideoId: {
      type: String,
      default: ''
    },
    cutLineActiveList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      nodataImg,
      list: [],
      options: [{
        value: '',
        label: '全部',
        disabled: false
      }, {
        value: '3',
        label: '已导出',
        disabled: true
      }, {
        value: '2',
        label: '部分导出',
        disabled: true
      }, {
        value: '1',
        label: '未导出',
        disabled: true
      }],
      value: '',
      isIndeterminate: false,
      catalogue: '', // 保存位置
      maxCanSelect: 60, // 可选的最大片段数量
      selectLength: 0, // 已选的片段数量
      allFragmentNums: 0, // 总共有多少片段
      checkIndex: 0,
      selectAll: false, // 是否全选
      selectObj: {}, // 选中的数据
      activeCuttingId: '', // 当前预览的片段id
      percentage: 0, // 预计时长
      checkedArray: [],
      exportedVideoIdArray: []
    }
  },
  watch: {
    projectId: {
      handler(val) {
        val && this.getVideoList()
      },
      immediate: true
    }
  },
  mounted() {
    console.log('videoSelect------------')
    this.getExportStatus()
  },
  methods: {
    handleChangeContent() {
      this.$emit('changeContent')
      this.clearAll()
      this.getVideoList(1)
    },
    async getExportStatus() {
      const res = await screenExportStatus({ projectId: this.projectId })
      // 1-未导出 2-部分导出 3-已导出
      res.data.includes(1) && (this.options[3].disabled = false)
      res.data.includes(2) && (this.options[2].disabled = false)
      res.data.includes(3) && (this.options[1].disabled = false)
    },
    clearAll() {
      this.$nextTick(() => {
        this.checkIndex = 0
        this.list.forEach((item, index) => {
          this.$refs[`FragmentList${index}`][0].handleChangeAll(false, null, true)
        })
      })
    },
    handleCheckAll(val) {
      console.log(val, 'this.list')
      if (val) {
        this.$nextTick(() => {
          // 第一个标识为是否选中  第三个标识为是否是全选
          if (this.$refs[`FragmentList${this.checkIndex}`] && this.$refs[`FragmentList${this.checkIndex}`][0].geSelctAllStatus()) {
            // 获取是否全选中了  全选中直接到下一个
            this.checkIndex++
            this.handleCheckAll(val)
          } else {
            this.$refs[`FragmentList${this.checkIndex}`][0].handleChangeAll(val, null, true)
            this.checkIndex++
          }
        })
      } else {
        this.clearAll()
      }
    },
    changeCount(flag) {
      flag ? this.checkIndex++ : this.checkIndex--
    },
    // 获取视频列表
    getVideoList(isChange) {
      this.loading = true
      videoGenerateDetail({ projectId: this.projectId, exportStatus: this.value }).then(res => {
        let index = -1
        res.data && res.data.map((v, i) => {
          v.open = false
          v.loading = false
          if (this.projectVideoId) {
            v.videoId === this.projectVideoId && (index = i)
          }
          if (v.cutting) {
            v.cutting.map(e => {
              e.uid = this.getUuiD(22)
              e.start = e.start * 1000
              e.end = e.end * 1000
              e.markList = []
              e.label = getFormatSSS(e.start) + '-' + getFormatSSS(e.end)
            })
          } else {
            v.cutting = [
              {
                uid: this.getUuiD(22),
                cuttingId: '',
                start: 0,
                end: v.duration * 1000,
                label: getFormatSSS(0) + '-' + getFormatSSS(v.duration * 1000),
                isExport: v.exportStatus === 3 ? 2 : 1,
                markList: []
              }
            ]
          }
        })

        this.list = res.data
        // res.data里面cutting.leng的数量
        let count = 0
        for (const item of res.data) {
          if (item.cutting) {
            count += item.cutting.length
          }
        }
        this.allFragmentNums = count
        // this.allFragmentNums = res.data.length
        const cunArray = JSON.parse(sessionStorage.getItem('exportedVideoIdArray'))
        this.list.some(item => {
          if (cunArray && cunArray.length > 0) {
            for (var i = 0; i < cunArray.length; i++) {
              if (item.videoId === cunArray[i].videoId) {
                this.$set(item, 'exportChecked', true)
                if (item.cutting && item.cutting.length === 1) {
                  this.$set(item.cutting[0], 'exportChecked', true)
                } else if (item.cutting && item.cutting.length > 1) {
                  item.cutting.some(obj => {
                    if (obj.start === cunArray[i].startTime) {
                      this.$set(obj, 'exportChecked', true)
                    }
                  })
                }
              }
            }
          }
        })
        if (res.data.length > 0) {
          this.catalogue = res.data[0].catalogue
          this.percentage = res.data[0].percentage
          this.$emit('getName', res.data[0].generateProjectName || '')
        }
        if (index !== -1) {
          this.$nextTick(() => {
            if (this.$refs[`FragmentList${index}`]) {
              this.$refs[`FragmentList${index}`][0].openTree().then(() => {
                let i
                if (this.cutLineActiveList.length > 0) {
                  i = this.cutLineActiveList[0]
                } else {
                  i = 0
                }
                if (isChange !== 2) {
                  this.$refs[`FragmentList${index}`][0].handleClickPreviewPause(this.list[index].cutting[i], i)
                  this.$refs[`FragmentList${index}`][0].checkInit(this.cutLineActiveList)
                }
                // this.$refs[`FragmentList${index}`][0].checkInit(this.cutLineActiveList)
              })
            }
          })
        }
        if (isChange === 1) {
          this.$nextTick(() => {
            const arr = this.list[0]
            let obj = null
            if (arr.cutting && arr.cutting.length > 0) {
              obj = { ...arr, ...arr.cutting[0] }
              obj.videoName = arr.name
              obj.previewPlayIndex = 1
              this.handleClickPreviewPause(obj)
            }
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    check(res, val, isAll) {
      // this.selectObj[res.videoId] = res.list
      this.list.some((item, index) => {
        if (item.videoId === res.videoId) {
          this.checkedArray[index] = res
        }
      })
      this.selectObj = {}
      this.checkedArray.forEach(item => {
        if (item.list.length > 0) {
          this.selectObj[item.videoId] = item.list
        }
      })
      let sum = 0
      for (const key in this.selectObj) {
        sum += this.selectObj[key].length
      }
      this.selectLength = sum
      if (isAll && (this.selectLength !== 0 && !val || (this.selectLength < this.maxCanSelect && this.selectLength < this.allFragmentNums) && val)) {
        this.handleCheckAll(val)
      }
      this.isIndeterminate = this.selectLength > 0 && this.selectLength < this.maxCanSelect && this.selectLength < this.allFragmentNums
      this.selectAll = this.selectLength === this.allFragmentNums || this.selectLength === this.maxCanSelect
      this.$emit('selectLength', this.selectLength)
    },
    // 取消勾选
    videoDel(item) {
      const index = this.list.findIndex(f => f.videoId === item.videoId)
      if (index < 0) return
      this.$refs['FragmentList' + index][0]?.splice(item)
    },
    // 点击预览
    preview(res) {
      console.log(res)
      this.activeCuttingId = res.uid
      this.$emit('preview', res)
    },
    handleClickPreviewPause(res) {
      console.log(res, '点击预览')
      this.activeCuttingId = res.uid
      this.$emit('previewPause', res)
    },
    clearCheckList() {
      this.list.some((item, index) => {
        this.$nextTick(() => {
          const str = 'FragmentList' + index
          this.$refs[`${str}`][0].clearCheckArray()
          this.selectObj = {}
          this.checkedArray = []
          this.selectLength = 0
        })
      })
    },
    changeGrayExport() {
      console.log('hangeGrayExport-----')
      this.clearCheckList()
      this.selectAll = false
      this.checkIndex = 0
      this.isIndeterminate = false
      this.getVideoList(2)
      this.getExportStatus()
      // const cunArray = JSON.parse(sessionStorage.getItem('exportedVideoIdArray'))
      // this.list.some(item => {
      //   if (cunArray && cunArray.length > 0) {
      //     for (var i = 0; i < cunArray.length; i++) {
      //       if (item.videoId === cunArray[i].videoId) {
      //         if (item.cutting && item.cutting.length === 1) {
      //           this.$set(item.cutting[0], 'exportChecked', true)
      //         } else if (item.cutting && item.cutting.length > 1) {
      //           item.cutting.some(obj => {
      //             if (obj.start === cunArray[i].startTime) {
      //               this.$set(obj, 'exportChecked', true)
      //             }
      //           })
      //         }
      //       }
      //     }
      //   }
      // })
    },
    // 导出
    operateClipsGenerate(form) {
      const projectName = form.name
      return new Promise((resolve, reject) => {
        const list = []
        const updataTipsList = []
        const cuttingIds = []
        // for (const key in this.selectObj) {
        //   console.log('this.selectObj---', this.selectObj)
        //   const item = this.list.find(v => v.videoId === key)
        //   console.log('this.selectObj---item', item)
        //   if (item.cutting.length > 1) {
        //     this.selectObj[key].forEach(v => {
        //       console.log(v, '导出的v')
        //       const obj = {
        //         endTime: v.end,
        //         startTime: v.start,
        //         cuttingId: v.cuttingId,
        //         videoId: key
        //       }
        //       updataTipsList.push({ videoCuttingId: v.cuttingId, videoId: key })
        //       list.push(obj)
        //       v.cuttingId && cuttingIds.push(v.cuttingId)
        //     })
        //   } else {
        //     this.selectObj[key].forEach(v => {
        //       const obj = { videoId: key }
        //       list.push(obj)
        //       updataTipsList.push({ videoId: key })
        //       v.cuttingId && cuttingIds.push(v.cuttingId)
        //     })
        //   }
        // }
        console.log('this.$refs.videoSortRef.list---', this.$refs.videoSortRef.list)
        const videoList = this.$refs.videoSortRef.list || []
        videoList.forEach(f => {
          if (f.draggableId === f.videoId) {
            // 视频组只有一个片段
            const obj = { videoId: f.videoId }
            list.push(obj)
            updataTipsList.push({ videoId: f.videoId })
            f.cuttingId && cuttingIds.push(v.cuttingId)
          } else {
            // 视频组多个片段
            const obj = {
              endTime: f.end,
              startTime: f.start,
              cuttingId: f.cuttingId,
              videoId: f.videoId
            }
            updataTipsList.push({ videoCuttingId: f.cuttingId, videoId: f.videoId })
            list.push(obj)
            f.cuttingId && cuttingIds.push(f.cuttingId)
          }
        })
        console.log(cuttingIds, 'cuttingIds')
        if (cuttingIds.length > 0) {
          qryPercentage(cuttingIds).then(res => {
            this.percentage = res.data || 0
            this.$refs.tipsModel.open({
              projectName: projectName,
              selectLength: this.selectLength,
              percentage: this.percentage,
              catalogue: this.catalogue,
              success: () => {
                const data = {
                  catalogue: this.catalogue,
                  list,
                  percentage: this.percentage,
                  projectName: projectName,
                  isExportMark: form.isExportMark,
                  isExportSubtitle: form.isExportSubtitle
                }
                videoGgenerate(data).then(() => {
                  resolve(list)
                }).catch(() => {
                  reject()
                })
              },
              fail: () => {
                reject()
              }
            })
          }).catch((err) => {
            reject(err)
          })
        } else {
          this.percentage = 60
          this.$refs.tipsModel.open({
            projectName: projectName,
            selectLength: this.selectLength,
            percentage: this.percentage,
            catalogue: this.catalogue,
            success: () => {
              const data = {
                catalogue: this.catalogue,
                list,
                percentage: this.percentage,
                projectName: projectName,
                isExportMark: form.isExportMark,
                isExportSubtitle: form.isExportSubtitle
              }
              videoGgenerate(data).then(() => {
                resolve(list)
              }).catch(() => {
                reject()
              })
            },
            fail: () => {
              reject()
            }
          })
        }
        updateIsExport(updataTipsList)
      })
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    }
  }
}
</script>

<style lang='scss' scoped>
.videoSelect {
  display: flex;
  .videoSelectTitle {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #DEDEDE;
    line-height: 24px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .noData{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    .noData-font{
      margin-top: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
  .optPane{
    border: 1px solid #000000;
  }
  .selectAll{
    margin-left: 20px;
    margin-bottom: 17px;
  }
  .selectContent {
    width: 556px;
    height: 454px;
    padding: 16px 0;
  }
  .saveLocation {
    padding: 16px 0;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #D9D9D9;
    line-height: 22px;
  }
}
.myoverflowOuto {
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 6px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    // background-color: rgba(0, 0, 0, 0.2);
    background-color: #A6A6A6;
    transition: all 0.4s ease;
  }
  &::-webkit-scrollbar-track {
    background-color: #4D4D4D;
  }
}
</style>
