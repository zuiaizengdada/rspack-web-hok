<template>
  <div class="certificate-preview-box vertical" :style="certificateStyle">
    <!-- 证书标题 -->
    <span class="certificate-preview-title">
      {{ certificateForm.info.title }}
    </span>

    <!-- 证书皇冠 -->
    <img
      class="certificate-preview-crown"
      src="@/assets/image/certificate-bg-crown.png"
    />

    <!-- 用户名称 -->
    <span class="certificate-preview-name">学员姓名</span>

    <!-- 完成文案 -->
    <span
      class="certificate-preview-content"
      v-html="certificateForm.info.content"
    />

    <!-- 关联班级名称 -->
    <span
      v-if="certificateForm.info.showCourseTitle === 1"
      class="certificate-preview-class-name"
    >
      <span v-if="certificateForm.info.customTitle">
        {{ certificateForm.info.customTitle }}
      </span>
      <span v-else> 原课程名称 </span>
    </span>

    <!-- 完成任务(项) -->
    <div class="certificate-preview-counts-wrapper">
      <div
        v-if="displayObj.isShowFinishTask"
        class="certificate-preview-task-count"
      >
        <span class="certificate-preview-task-count-number">10</span>
        <span class="certificate-preview-task-count-text"> 完成任务(项) </span>
      </div>

      <div
        v-if="displayObj.isShowFinishCourse"
        class="certificate-preview-course-count"
      >
        <span class="certificate-preview-course-count-number">10</span>
        <span class="certificate-preview-course-count-text">
          学习课程(节)
        </span>
      </div>

      <div
        v-if="displayObj.isShowFinishPunch"
        class="certificate-preview-punch-count"
      >
        <span class="certificate-preview-punch-count-number">10</span>
        <span class="certificate-preview-punch-count-text"> 完成打卡(次) </span>
      </div>
    </div>

    <!-- 鼓励文案 -->
    <span
      class="certificate-preview-encourage"
      v-html="certificateForm.info.encourageContent"
    />

    <!-- 二维码分享 -->
    <div class="certificate-preview-qr-code">
      <template v-if="certificateForm.share.showQrCode === 1">
        <img
          :src="
            certificateForm.share.customQrCode ||
              'https://hok-one-oss.oss-accelerate.aliyuncs.com/file/image/2025/1/19/bd42a30f-370b-4728-b690-66afbbb07689.png'
          "
          alt="二维码"
        />
      </template>

      <div class="certificate-preview-qr-code-text">
        <span class="certificate-preview-qr-code-text-content">
          {{ certificateForm.share.shareContent }}
        </span>
        <span
          v-if="certificateForm.share.showQrCode === 1"
          class="certificate-preview-qr-code-text-content"
        >
          {{ certificateForm.share.guidanceContent }}
        </span>
      </div>
    </div>

    <!-- 发证信息 -->
    <div class="certificate-preview-issue-info">
      <span
        style="color: #000000"
        class="certificate-preview-issue-info-text org"
      >
        {{ certificateForm.issueInfo.certificateTenant }}
      </span>
      <span
        v-if="certificateForm.issueInfo.showTime"
        class="certificate-preview-issue-info-text time"
      >
        2024年12月29号
      </span>
      <span
        v-if="certificateForm.issueInfo.certificateNumber"
        class="certificate-preview-issue-info-text number"
      >
        证书编号: 000000000000000
      </span>

      <div
        class="certificate-preview-issue-info-seal"
        :style="{
          backgroundImage: `url(${certificateForm.issueInfo.seal})`
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    certificateForm: {
      type: Object,
      required: true
    },
    displayObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    certificateStyle() {
      return {
        backgroundImage: `url(${this.certificateForm.style.backgroundImage})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.certificate-preview-box {
  width: 100%;
  position: relative;
  transform-origin: top left;
  background-color: #f5f5f5;
  overflow: hidden;
  box-sizing: border-box;

  &.vertical {
    width: 56.25%;
    aspect-ratio: 9/15.6;
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  // 证书标题
  .certificate-preview-title {
    position: absolute;
    top: 7%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1vw;
    color: #000000;
    font-weight: 700;
    width: 90%;
    text-align: center;
  }

  // 证书皇冠
  .certificate-preview-crown {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 15%;
  }

  // 用户名称
  .certificate-preview-name {
    position: absolute;
    top: 26%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7vw;
    color: #000000;
    font-weight: 700;
    width: 90%;
    text-align: center;
  }

  // 完成文案
  .certificate-preview-content {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    text-align: center;
  }

  // 关联班级名称
  .certificate-preview-class-name {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7vw;
    color: #000000;
    font-weight: 700;
    width: 90%;
    text-align: center;
  }

  // 新增包裹容器样式
  .certificate-preview-counts-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    display: flex;
    justify-content: space-evenly;
  }

  // 修改计数div的样式，移除定位相关属性
  .certificate-preview-task-count,
  .certificate-preview-course-count,
  .certificate-preview-punch-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    text-align: center;

    &-number {
      color: #000000;
      font-size: 0.7vw;
      font-weight: 700;
    }

    &-text {
      color: #999999;
      font-size: 0.5vw;
      font-weight: 500;
    }
  }

  // 鼓励文案
  .certificate-preview-encourage {
    position: absolute;
    top: 59%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    text-align: center;
  }

  // 二维码分享
  .certificate-preview-qr-code {
    position: absolute;
    top: 71%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    img {
      width: 2.3vw;
      height: 2.3vw;
    }

    .certificate-preview-qr-code-img {
      width: 2vw;
      height: 2vw;
      background-color: #777777;
    }

    .certificate-preview-qr-code-text {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .certificate-preview-qr-code-text-content {
        font-size: 0.5vw;
        color: #777777;
        font-weight: 700;
      }
    }
  }

  // 发证信息
  .certificate-preview-issue-info {
    &-text {
      font-size: 0.5vw;
      color: #777777;
      font-weight: 700;
    }

    .org {
      position: absolute;
      top: 82%;
      right: 14.5%;
      transform: none;
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .time {
      position: absolute;
      top: 85%;
      right: 2%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .number {
      position: absolute;
      top: 88%;
      right: -8.5%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      text-align: right;
    }
  }

  // 印章
  .certificate-preview-issue-info-seal {
    position: absolute;
    top: 81%;
    right: 10%;
    transform: translateX(-50%);
    width: 3vw;
    height: 3vw;
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
