<template>
  <div class="wrapper">
    <!-- 标题 -->
    <div class="header">
      <span class="header-parent" @click="goBack">数字人</span>
      <span class="header-icon">
        <i class="el-icon-arrow-right" />
      </span>
      <span class="header-current">{{ title }}</span>
    </div>
    <div class="horizontal-divide"><div /></div>
    <div v-loading="loading" class="content">
      <!-- 左侧内容 -->
      <leftSide
        ref="leftSideRef"
        @characterImage="setInfo"
        @stepValueEmit="stepValueEmit"
        @loadingEmit="
          e => {
            loading = e
          }
        "
        @removeAnnotationsClick="removeAnnotationsClick"
      />
      <!-- 分割线 -->
      <div class="line" />
      <!-- 右侧内容 -->
      <rightSide
        ref="rightSideRef"
        :bg-img="bgImg"
        :type="type"
        :third-type="thirdType"
        :content-img="contentImg"
        :position-info="positionInfo"
        :step-value="stepValue"
        :is-to-info="isToInfo"
        @offsetInfo="setoffsetInfo"
        @annotationsClick="annotationsClick"
        @reductionannotationsStyle="reductionannotationsStyle"
        @offsetInfoInit="offsetInfoInit"
        @isLoadImg="isLoadImg"
      />
    </div>
  </div>
</template>

<script>
import leftSide from './components/leftSide'
import rightSide from './components/rightSide'
import { checkSignDigitalhuman } from '@/api/aiVideoManage'

export default {
  provide() {
    return {
      generateBackgroundImg: this.generateBackgroundImg,
      generateImg: this.generateImg,
      setLoading: this.setLoading
    }
  },
  components: {
    leftSide,
    rightSide
  },
  data() {
    return {
      bgImg: '',
      type: 1,
      contentImg: '',
      thirdType: undefined,
      positionInfo: {
        // left: 0,
        // top: 0
      },
      stepValue: 1,
      loading: false,
      isToInfo: false
    }
  },
  computed: {
    title() {
      return this.$route?.query?.videoId ? '编辑视频' : '创建视频'
    }
  },
  created() {
    checkSignDigitalhuman().then(res => {
      if (res.data) {
        const checkSignObj = { ...res.data }
        localStorage.setItem(
          'checkSignDigitalhuman' + this.$store.state.user.userInfo.userId,
          checkSignObj.employeeSignStatus
        )
        if (Number(checkSignObj.employeeSignStatus) !== 1) {
          this.$router.push({
            path: '/digitalPerson/digitalVideoManage'
          })
        }
      }
    })
  },
  methods: {
    setLoading(val) {
      this.loading = val
    },
    removeAnnotationsClick() {
      this.$refs.rightSideRef.removeAnnotationsClick()
    },
    generateImg() {
      return this.$refs.rightSideRef.generateImg()
    },
    generateBackgroundImg() {
      return this.$refs.rightSideRef.generateBackgroundImg()
    },
    isLoadImg(val) {
      this.$refs.leftSideRef.isLoadImg(val)
    },
    stepValueEmit(val) {
      this.stepValue = Number(val)
    },
    reductionannotationsStyle() {
      this.$refs.leftSideRef.reductionannotationsStyle()
    },
    annotationsClick(text) {
      this.$refs.leftSideRef.annotationsClick(text)
    },
    offsetInfoInit(info) {
      this.$refs.leftSideRef.offsetInfoInit(info)
    },
    setoffsetInfo(info) {
      this.$refs.leftSideRef.setoffsetInfo(info)
    },
    setInfo(record) {
      // console.error(record, 'record')
      if (!record.bgImg && this.bgImg) {
        this.bgImg = undefined
      }
      if (!record.bgImg && !record.rightPhotoUrl) return
      this.isToInfo = record.isToInfo
      this.thirdType = Number(record.thirdType)
      this.type = Number(record.resolutionType)
      this.bgImg = record.bgImg ? record.bgImg : undefined
      // if (this.contentImg === record.rightPhotoUrl) {
      //   this.$refs.rightSideRef.updateImg()
      // }
      this.contentImg = record.rightPhotoUrl ? record.rightPhotoUrl : undefined
      const width = this.type === 1 ? 199 : 491
      const ratio = this.type === 1 ? 1080 / width : 1920 / width
      if (
        record.roleLeftOffset ||
        record.positionX ||
        record.positionY ||
        record.roleTopOffset
      ) {
        const l = record.roleLeftOffset || record.positionX || 0
        const t = record.roleTopOffset || record.positionY || 0
        const val = this.type === 1 ? 1920 : 1080
        this.positionInfo = {
          // 位置信息
          left:
            this.thirdType > 1 ? l / ratio : (l - record.roleWidth / 2) / ratio,
          top: this.thirdType > 1 ? t / ratio : (val - t) / ratio,
          scaleValue:
            (this.thirdType === 3 ? record.positionWidth : record.roleWidth) /
              ratio || undefined,
          roleWidth:
            this.thirdType === 3 ? record.positionWidth : record.roleWidth,
          originalInfo: {
            // 原始信息
            left: l,
            top: t,
            roleWidth:
              this.thirdType === 3 ? record.positionWidth : record.roleWidth
          }
        }
      } else {
        this.isToInfo = false
        this.positionInfo = undefined
      }
    },
    goBack() {
      this.$router.replace({
        path: '/digitalPerson/digitalVideoManage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  min-width: 1300px;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  .header {
    width: 100%;
    height: 65px;
    padding: 20px;
    background-color: #fff;
    span {
      font-size: 16px;
      font-weight: 400;
    }
    .header-parent {
      color: #777777;
      cursor: pointer;
    }
    .header-icon {
      font-size: 14px;
      color: #000;
      margin: 0 10px;
      user-select: none;
    }
    .header-current {
      user-select: none;
      color: #000;
    }
  }
  .horizontal-divide {
    width: 100%;
    height: 1px;
    padding: 0 20px;
    background-color: #fff;
    div {
      width: 100%;
      height: 100%;
      background-color: #eff2f6;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 65px);
    display: flex;

    .line {
      width: 0.73%;
      height: 100%;
      background-color: #eeeeee;
    }
  }
}
</style>
