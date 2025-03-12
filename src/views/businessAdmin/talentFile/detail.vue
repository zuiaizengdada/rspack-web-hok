<template>
  <div class="main_content">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item>
          <router-link
            :to="`${currentBackUrl}?currentComponent=${currentComponent}`"
            >{{ leftTitle }}</router-link
          >
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div>
        <!-- <el-button type="text" @click="back">导出</el-button> -->
        <el-button type="text" @click="back">返回</el-button>
      </div>
    </div>
    <div class="main-content-container">
      <div class="main_left">
        <div class="general_set">
          <span>档案目录</span>
        </div>
        <template v-if="showPersonDetail">
          <div
            v-for="item in personDetailsTitle"
            :key="item.name"
            class="child_item"
            :class="{ three_item_active: item.name === currTabName }"
            @click="tabClick(item.name, item.meta.title)"
          >
            <div class="third-level-item" :title="item.meta.detailsTitle">
              {{ item.meta.detailsTitle }}
            </div>
          </div>
        </template>

        <div class="divide"></div>
        <div
          v-for="item in arr"
          :key="item.name"
          class="child_item"
          :class="{ three_item_active: item.name === currTabName }"
          @click="tabClick(item.name, item.meta.title)"
        >
          <div class="third-level-item" :title="item.meta.title">
            {{ item.meta.title }}
          </div>
        </div>
      </div>
      <template
        v-if="
          [
            'baseInfo',
            'workInfo',
            'familyInfo',
            'documentInfo',
            'evaluateInfo'
          ].includes(currTabName) && showPersonDetail
        "
      >
        <div class="main_personDetailsRight" ref="scrollContainer">
          <personDetailsForm showType="waitingEntryList" />
        </div>
      </template>
      <div class="main_right" v-else>
        <InterviewRegistrationForm
          height="100%"
          class="interviewRegistrationForm"
          v-if="currTabName === 'interviewRegistrationForm'"
        />
        <InterviewRecord v-else-if="currTabName === 'interviewRecord'" />
        <template v-else-if="currTabName === 'waitingPersonForm'">
          <waitingPersonForm
            :canDown="true"
            height="100%"
            ref="waitingPersonFormRef"
            class="waitingPersonForm"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import InterviewRecord from './interviewRecord.vue'
import InterviewRegistrationForm from './interviewRegistrationForm.vue'
import waitingPersonForm from './waitingPersonForm.vue'
import personDetailsForm from './personDetailsForm.vue'

export default {
  name: 'TalentFileDetail',
  components: {
    InterviewRecord,
    InterviewRegistrationForm,
    waitingPersonForm,
    personDetailsForm
  },
  data() {
    return {
      arr: [],
      currTabName: '',
      currentTitle: '详情',
      leftTitle: '',
      personDetailsTitle: [
        {
          name: 'baseInfo',
          meta: {
            title: '详情',
            detailsTitle: '基本信息'
          },
          show: true
        },
        {
          name: 'workInfo',
          meta: {
            title: '详情',
            detailsTitle: '工作及学历'
          },
          show: true
        },
        {
          name: 'familyInfo',
          meta: {
            title: '详情',
            detailsTitle: '亲属信息'
          },
          show: true
        },
        {
          name: 'documentInfo',
          meta: {
            title: '详情',
            detailsTitle: '证件信息'
          },
          show: true
        },
        {
          name: 'evaluateInfo',
          meta: {
            title: '详情',
            detailsTitle: '自我评价'
          },
          show: true
        }
      ],
      currentComponent: '',
      sideNow: 0,
      currentBackUrl: ''
    }
  },
  mounted() {
    // 绑定滚动事件监听器
    this.$nextTick(() => {
      this.$refs.scrollContainer &&
        this.$refs.scrollContainer.addEventListener(
          'scroll',
          this.scrollHandlerThrottled
        )
    })
    this.currentComponent = this.$route.query.currentComponent
    this.currentBackUrl =
      this.$route.query.currentBackUrl || `/businessAdmin/talentFile`
    this.leftTitle = this.$route.query.leftTitle || '人才档案管理'
    const waitingPersonFormOption = [
      {
        name: 'waitingPersonForm',
        meta: {
          title: '入职登记表'
        }
      }
    ]

    if (this.showPersonDetail) {
      this.arr = [
        ...waitingPersonFormOption,
        {
          name: 'interviewRegistrationForm',
          meta: {
            title: '面试登记表'
          }
        },
        {
          name: 'interviewRecord',
          meta: {
            title: '面试记录'
          }
        }
      ]
      this.currTabName = 'baseInfo'
    } else {
      this.arr = [
        {
          name: 'interviewRegistrationForm',
          meta: {
            title: '面试登记表'
          }
        },
        {
          name: 'interviewRecord',
          meta: {
            title: '面试记录'
          }
        }
      ]
      this.currTabName = 'interviewRegistrationForm'
    }
  },
  methods: {
    scrollHandlerThrottled(e) {
      this.throttle(this.scrollHandler(), 120)
    },
    scrollHandler() {
      let itemDoms = this.$refs.scrollContainer.querySelectorAll(
        '.personDetailsForm-item'
      )
      let st = this.$refs.scrollContainer.scrollTop
      let idxOld = this.sideNow
      for (let index = 0; index < itemDoms.length; index++) {
        const element = itemDoms[index]
        if (Math.abs(st - element.offsetTop) < 60) {
          this.sideNow = index
        }
      }
      // 有时最后一条滚动不到容器顶部,这时直接高亮最后一个
      if (st - itemDoms[itemDoms.length - 2].offsetTop > 200) {
        this.sideNow = itemDoms.length - 1
      }
      if (this.sideNow !== idxOld) {
        this.currTabName = `${itemDoms[this.sideNow].id}`.match(/(.*?)Ref/)[1]
      }
    },
    throttle(fun, delay) {
      let last, deferTimer
      return function (args) {
        let that = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
          clearTimeout(deferTimer)
          deferTimer = setTimeout(function () {
            last = now
            fun.apply(that, _args)
          }, delay)
        } else {
          last = now
          fun.apply(that, _args)
        }
      }
    },
    back() {
      this.$router.push({
        path: this.currentBackUrl,
        query: {
          currentComponent: this.currentComponent
        }
      })
    },
    tabClick(name, title) {
      this.currTabName = name
      this.currentTitle = title
      this.$nextTick(() => {
        const element = document.getElementById(`${name}Ref`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  },
  computed: {
    //显示人员详情
    showPersonDetail() {
      return (
        ['WaitingEntryList'].includes(this.currentComponent) ||
        this.currentBackUrl === '/oaManagement/staffManagement/home'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  // background: #fff;
  border-radius: 10px;
  // height: 100%;
  padding-top: 15px;
  margin-top: -15px; //处理顶部菜单遮挡
  // height: calc(100vh - 160px);
  height: calc(100vh - 145px);
  display: flex;
  flex-direction: column;

  .page_top {
    background: #fff;
    padding: 0px 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .main-content-container {
    display: flex;
    height: calc(100% - 36px);
  }
  .main_left {
    width: 140px;
    height: 321px;
    margin-top: 20px;
    border: 1px solid #e4e7ed;
    flex-direction: row;
    background-color: #fff;
    border-radius: 10px;
    //position: fixed;
    .divide {
      height: 1px;
      width: 100%;
      background-color: #f0f3f7;
      margin: 6px 0;
    }
    .general_set {
      width: 138px;
      height: 32px;
      line-height: 32px;
      background: linear-gradient(57deg, #d6edff 0%, #c7ddff 100%);
      border-radius: 10px 10px 0 0;
      text-align: center;
      span {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
    }
    .child_item {
      width: 100%;
      height: 32px;
      line-height: 32px;
      color: #333;
      margin-top: 2px;
      font-size: 14px;
      cursor: pointer;
      text-align: center;
    }
    .three_item_active {
      color: #0c6fff;
      //border-left: 4px solid #0c6fff;
      background: #63a2ff;
      //border: 1px solid #979797;
      color: #fff;
      // background: linear-gradient(
      //   90deg,
      //   #e7f0ff 0%,
      //   rgba(245, 249, 255, 0) 100%
      // );
    }
  }
  .main_right {
    width: calc(100% - 236px);
    // height: calc(100% - 40px);
    flex-direction: row;
    // margin: 20px 0 20px 20px;
    margin: 20px 0 0 20px;
    border-radius: 10px;
    display: inline-block;
    border: 1px solid #e4e7ed;
    background-color: #fff;
    position: relative;
    overflow: auto;
    flex: 1;
    // padding: 20px;

    .box-card {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  .main_personDetailsRight {
    width: calc(100% - 236px);
    // height: calc(100% - 40px);
    height: 100%;
    position: relative;
    overflow: auto;
    flex: 1;
    .box-card {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
}
.waitingPersonForm {
  padding: 20px 0;
}
.waitingPersonForm ::v-deep .waitingPersonForm-view {
  width: 1080px;
  margin: 0 auto;
}
.t_a_c {
  text-align: center;
}
.interviewRegistrationForm {
  padding-bottom: 20px;
}
</style>
