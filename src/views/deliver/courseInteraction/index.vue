<template>
  <MCard class="pageWrap">
    <router-view v-if="isDetail" />
    <template v-else>
      <div class="navHeader">
        <div class="flex">
          <div
            v-if="showHomework"
            class="navItem"
            :class="{ 'navItem-active': activeName === 'clockIn' }"
            @click="handlePath('clockIn')"
          >
            打卡
          </div>
          <div
            v-if="showCertificate"
            class="navItem"
            :class="{ 'navItem-active': activeName === 'certificate' }"
            @click="handlePath('certificate')"
          >
            证书
          </div>
        </div>
        <div class="back" @click="back">返回</div>
      </div>
      <div v-if="activeName === 'clockIn'" class="choose-channel-block">
        <span v-if="showHomework" class="active">作业打卡</span>
      </div>
      <div class="content">
        <component :is="componentName" />
      </div>
    </template>
  </MCard>
</template>
<script>
import { mapGetters } from 'vuex'
import Homework from './homework.vue'
import Certificate from './certificate.vue'
export default {
  name: 'LayoutBox',
  components: {
    Homework,
    Certificate
  },
  data() {
    return {
      componentName: 'Homework',
      activeName: this.$route.query.type || 'clockIn',
      pathList: [],
      showHomework: false,
      showCertificate: false,
      value: 0,
      isDetail: false
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'initPage'])
  },
  // },
  async created() {
    this.showHomework = false
    this.pageInit()
    if (this.activeName === 'certificate') {
      this.componentName = 'Certificate'
    }
  },

  mounted() {
    if (this.$route.name === 'courseInteractionDetail') {
      this.isDetail = true
    } else {
      this.isDetail = false
    }
  },
  activated() {
  },
  methods: {
    handlePath(name) {
      this.activeName = name
      if (this.activeName === 'clockIn' && this.showHomework) {
        this.componentName = 'Homework'
      } else {
        this.componentName = 'Certificate'
      }
    },
    pageInit() {
      this.permission_routes?.forEach(i => {
        if (i.path === '/deliver') {
          i.children &&
            i.children?.forEach(j => {
              if (j.path === 'generalSettings') {
                j.children?.forEach(k => {
                  if (k.path === '/deliver/courseInteraction') {
                    k.children?.forEach(l => {
                      if (l.path === '/deliver/courseInteraction/homework') {
                        this.showHomework = true
                      }
                      if (l.path === '/deliver/courseInteraction/certificate') {
                        this.showCertificate = true
                      }
                    })
                  }
                })
              }
            })
        }
      })
    },
    back() {
      this.$router.push({
        path: '/deliver/scheduleManagement/scheduleLive/my'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  // min-width: 1400px;
  height: calc(100vh - 165px);
  display: flex;
  flex-direction: column;
}
.card {
  padding: 10px 0 0 0;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-left: 20px;
  justify-content: space-between;
  padding-right: 20px;
  .navItem {
    font-size: 14px;
    font-family: 'Microsoft YaHei';
    color: #000;
    line-height: 24px;
    border-bottom: 2px solid #fff;
    padding-bottom: 9px;
    margin-right: 20px;
    cursor: pointer;
    font-weight: 600;
  }
  .navItem-active {
    color: #0c6fff;
    border-color: #0c6fff;
  }
  .back {
    width: 54px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #ededed;
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
}
.content {
  height: 100%;
}

.choose-channel-block {
  height: 32px;
  margin: 20px 10px 0px;
  display: inline-block;
  width: fit-content;
  border-radius: 4px;
  background: #f0f0f0;
  padding: 3px 2px;
  span {
    width: 80px;
    height: 26px;
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    line-height: 26px;
    cursor: pointer;
    display: inline-block;
    border-radius: 4px;
  }
  span.active {
    font-weight: 600;
    color: #0c6fff;
    background: #fff;
  }
}
</style>
