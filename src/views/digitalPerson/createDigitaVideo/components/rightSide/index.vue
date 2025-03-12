<template>
  <div class="right-side">
    <div class="title-item">
      <div class="gang" />
      <span>效果演示</span>
      <el-tooltip class="item" effect="dark" placement="top">
        <template slot="content">
          <strong>系统支持调整形象的大小和位置，因形象不同，其位置和大小的调整会存在差异。</strong>
        </template>
        <img
          class="doubt"
          src="@/assets/image/aigc/digitalVideoManage/szro.png"
          alt=""
        />
      </el-tooltip>
    </div>
    <div v-if="thirdType !== 4" class="operate-header">
      <div class="flex flex-middle">
        <span class="label-op">调整</span>
        <el-select v-model="operateType" class="operate-type">
          <el-option
            v-for="item in operateTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="
              (item.value === 1 && !contentImg) || (item.value === 2 && !bgImg)
            "
          />
        </el-select>
        <span
          v-if="operateType === 2"
          class="label-op"
          style="margin-left: 16px"
        >模糊度</span>
        <el-slider
          v-if="operateType === 2"
          v-model="ambiguity"
          tooltip-class="tooltip-ambiguity-class"
          :show-tooltip="true"
          :step="0.1"
          :min="0"
          :max="10"
          class="slider"
        />
      </div>
      <div class="flex flex-middle">
        <!-- <el-divider class="divider-op" direction="vertical" /> -->
        <span class="label-op">大小</span>
        <img
          class="btn-bgm-op"
          src="@/assets/image/aigc/digitalVideoManage/amplify-bgm.png"
          alt=""
          @click="sizeChange(1)"
        />
        <img
          class="btn-bgm-op"
          src="@/assets/image/aigc/digitalVideoManage/reduce-bgm.png"
          alt=""
          @click="sizeChange(2)"
        />
        <div class="box-dv">
          <span
            class="label-op"
            style="margin-right: 0"
            @click="canvasReduction()"
          >
            还原
          </span>
        </div>
      </div>
    </div>
    <div v-if="thirdType !== 4" class="addLeft">
      <div class="img-box1">
        <dragScaleFabric
          ref="dragScaleFabricRef"
          :ambiguity="ambiguity"
          :operate-type="operateType"
          :background-img="bgImg"
          :img-url="contentImg"
          :third-type="thirdType"
          :is-vertical="type === 1"
          :is-to-info="isToInfo"
          :position-info="positionInfo"
          @offsetInfo="setoffsetInfo"
          @offsetInfoInit="offsetInfoInit"
          @isLoadImg="isLoadImg"
          @typeClick="typeClick"
        />
      </div>
    </div>
    <div v-if="thirdType === 4" style="margin-left: 20px;font-size: 20px;"><el-tag>该形象不支持调整</el-tag></div>
    <div v-if="formReject.auditName" class="title-item">
      <div class="gang" />
      <span>驳回原因</span>
    </div>
    <div v-if="formReject.auditName" class="reason-row">
      <div class="reason-content">
        <div class="content-header">
          <span>审核人：{{ formReject.auditName }}</span>
          <span>
            审核时间：{{
              moment(formReject.auditTime).format('YYYY-MM-DD HH:mm:ss')
            }}
          </span>
        </div>
        <div class="reason-content-reason">
          <div
            v-for="(item, index) in list"
            :key="index"
            @click="annotationsClick(item)"
          >
            <div class="title-rl">
              <div>{{ index + 1 }}、{{ item.inputContent }}</div>
            </div>
            <div
              :class="{
                'content-rl': true,
                'content-rl-select': item.isSelect
              }"
            >
              <div>原文：{{ item.title }}</div>
            </div>
          </div>
          <div v-if="formReject.auditReason">
            <div class="title-rl">
              <div>驳回原因:</div>
            </div>
            <div
              :class="{
                'content-rl': true
              }"
            >
              <div>{{ formReject.auditReason }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dragScaleFabricGuide
      v-if="isDragScaleFabricGuide"
      @ok="isDragScaleFabricGuide = false"
    />
  </div>
</template>

<script>
import dragScaleFabric from './dragScaleFabric'
import dragScaleFabricGuide from './dragScaleFabricGuide'
import { getReason, getAnnotionsDeltas } from '@/api/aiVideoManage'
import moment from 'moment'
export default {
  components: {
    dragScaleFabric,
    dragScaleFabricGuide
  },
  props: {
    bgImg: {
      type: String,
      default: undefined
    },
    type: {
      type: Number,
      default: 1
    },
    contentImg: {
      type: String,
      default: undefined
    },
    thirdType: {
      type: Number,
      default: undefined
    },
    positionInfo: {
      type: Object,
      default: undefined
    },
    stepValue: {
      type: Number,
      default: 1
    },
    isToInfo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moment,
      formReject: {
        auditName: '',
        auditTime: '',
        auditReason: ''
      },
      list: [],
      isDragScaleFabricGuide: false,
      // 1-形象 2-背景
      operateType: 1,
      operateTypeList: [
        {
          label: '形象',
          value: 1
        },
        {
          label: '背景',
          value: 2
        }
      ],
      ambiguity: 0
    }
  },

  created() {
    if (this.$route.query?.lastApproveDetailId) {
      getReason({ approveDetailId: this.$route.query?.lastApproveDetailId })
        .then(res => {
          const {
            approverUser,
            approvedTime,
            approvalOpinion,
            approverUserId
          } = res.data
          this.formReject = {
            auditName: approverUser,
            auditNameId: approverUserId,
            auditTime: approvedTime,
            auditReason: approvalOpinion
          }
          getAnnotionsDeltas({ videoId: this.$route.query.videoId }).then(
            res => {
              const info = res.data?.annotationInfo
                ? res.data?.annotationInfo.find(
                  f => f.createUserId === approverUserId && f.isHistory === 0
                )
                : undefined
              if (info) {
                const ls = info.annotations.map(m => ({
                  id: m.id,
                  isSelect: false,
                  status: 2,
                  loading: false,
                  title: m.text,
                  inputContent: m.content,
                  styleId: m.styleId,
                  time: moment(m.annotationTime)
                }))
                this.list = ls
              }
            }
          )
          this.visibleReject = true
        })
        .catch(() => {})
    }
  },
  mounted() {
    const dragScaleFabricGuideStatus = localStorage.getItem(
      'dragScaleFabricGuideStatus'
    )
    if (!dragScaleFabricGuideStatus) {
      this.isDragScaleFabricGuide = true
      localStorage.setItem('dragScaleFabricGuideStatus', 1)
    }
  },
  methods: {
    updateImg() {
      this.$refs.dragScaleFabricRef.updateToInfoImage()
    },
    removeAnnotationsClick() {
      this.list.forEach(m => {
        m.isSelect = false
      })
    },
    generateImg() {
      return this.$refs.dragScaleFabricRef.generateImg()
    },
    generateBackgroundImg() {
      return this.$refs.dragScaleFabricRef.generateBackgroundImg()
    },
    typeClick(val) {
      this.operateType = val
    },
    // 还原
    canvasReduction() {
      if (this.operateType === 2) {
        this.ambiguity = 0
      }
      this.$refs.dragScaleFabricRef.canvasReduction()
    },
    // 调整大小
    sizeChange(val) {
      this.$refs.dragScaleFabricRef.sizeChange(val)
    },
    isLoadImg(val) {
      this.$emit('isLoadImg', val)
    },
    annotationsClick(item) {
      if (this.stepValue === 1) return
      const isSelectTmp = !item.isSelect
      this.list.forEach(m => {
        if (m.id === item.id) {
          m.isSelect = isSelectTmp
        } else {
          m.isSelect = false
        }
      })
      if (isSelectTmp) {
        this.$emit('annotationsClick', item.title)
      } else {
        this.$emit('reductionannotationsStyle')
      }
    },
    offsetInfoInit(info) {
      this.$emit('offsetInfoInit', info)
    },
    setoffsetInfo(info) {
      this.$emit('offsetInfo', info)
    }
  }
}
</script>

<style lang="scss">
.tooltip-ambiguity-class {
  color: #ffffff;
  background: #666666 !important;
  .popper__arrow {
    border-color: #333333 !important;
    &::after {
      border-color: #666666 transparent !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.right-side {
  width: 41.17%;
  height: 100%;
  border-radius: 0 0 10px 10px;
  background-color: #fff;
  user-select: none;
  position: relative;
  .title-item {
    display: flex;
    align-items: center;
    margin: 20px;
    .gang {
      width: 4px;
      height: 24px;
      background: #0c6fff;
      border-radius: 6px;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
    .doubt {
      width: 18px;
      height: 18px;
      margin-left: 8px;
      padding-top: 1px;
    }
  }
  .addLeft {
    width: calc(100% - 40px);
    background: #fff;
    box-sizing: border-box;
    border: 1px solid #e1e6ed;
    border-top: none;
    margin-left: 20px;
    //flex: 1;
  }
  .operate-header {
    width: calc(100% - 40px);
    height: 58px;
    margin-left: 20px;
    border-radius: 4px 4px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #333333;
    padding: 0 10px;
    user-select: none;
    .label-op {
      font-size: 14px;
      color: #ffffff;
      margin-right: 16px;
      opacity: 0.95;
    }
    .box-dv {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      padding: 4px 0;
      border-radius: 4px;
      border: 1px solid #ffffff;
      cursor: pointer;
      margin-left: 8px;
    }
    .btn-bgm-op {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      cursor: pointer;
    }
  }
  .img-box1 {
    display: flex;
    justify-content: center;
    background: #f4f4f4;
  }

  .reason-row {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 16px;
    .reason-content {
      width: 100%;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e1e6ed;
      padding-bottom: 10px;

      .content-header {
        background: #f4f4f4;
        width: 100%;
        padding: 9px 18px;
        font-size: 14px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e1e6ed;
      }
      .reason-content-reason {
        width: 100%;
        height: calc(15.4vw - 50px - 58px);
        padding: 12px 14px 0 14px;
        font-size: 14px;
        color: #333333;
        word-break: break-all;
        overflow-y: auto;
        .title-rl {
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
        .content-rl {
          background: #e8ebee;
          padding: 7px 9px;
          margin: 8px 0;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #777777;
          border-radius: 4px;
          cursor: pointer;
        }
        .content-rl-select {
          padding: 6px 8px;
          background: #e5f0ff;
          color: #0c6fff;
          border: 1px solid #0c6fff;
        }
        &::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          background: #d8d8d8;
          transition: all 0.4s ease;
        }

        &::-webkit-scrollbar-track {
          background: #fff;
        }
      }
    }
  }
}
::v-deep {
  .operate-type {
    width: 68px;
    height: 28px;
    .el-input {
      input {
        border-radius: 4px;
        border: 1px solid #ffffff;
        padding: 0 11px;
        height: 28px;
        line-height: 2;
        background: #333333;
        color: rgba(255, 255, 255, 0.95);
      }
      .el-input__suffix {
        display: flex;
        justify-content: center;
        i {
          line-height: initial;
        }
      }
    }
  }
  .divider-op {
    margin: 0 20px;
    height: 20px;
  }
  .slider {
    width: 130px;
    // margin-right: 16px;
    .el-slider__runway {
      height: 8px;
      margin: 0;
      border-radius: 6px;
      .el-slider__bar {
        background-color: #cfcfcf;
        height: 8px;
        border-radius: 6px;
      }
      .el-slider__button-wrapper {
        top: -14px;
        .el-tooltip {
          width: 15px;
          height: 15px;
          border: solid 3px #fff;
          background-color: #666666;
        }
      }
    }
  }
}
</style>
