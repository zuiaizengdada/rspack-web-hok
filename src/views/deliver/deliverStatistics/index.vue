<template>
  <!-- 班期管理 -->
  <div class="pageWrap">
    <MCard>
      <!-- <div class="navHeader">
        <div
          v-for="(item, index) in arr"
          :key="index"
          class="navItem"
          :class="{active: $route.name === item.name}"
          @click="itemClick(item)"
        >
          {{ item.meta.title }}
        </div>
      </div> -->
      <div class="content">
        <router-view />
      </div>
    </MCard>
    <MCard v-if="$route.name === 'DeliveringCourses'" class="m-t-20">
      <deliveringCoursesByMonth />
    </MCard>
    <followUp style="marginTop:20px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import followUp from './components/followUp'
import deliveringCoursesByMonth from './components/deliveringCoursesByMonth.vue'
export default {
  name: 'DeliverStatistics',
  components: {
    deliveringCoursesByMonth,
    followUp
  },
  data() {
    return {
      arr: []
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes'
    ])
  },
  // mounted() {
  //   console.log(6666666)
  //   this.$router.replace({ path: '/deliver/deliverStatistics/deliveringCourses' })
  // },

  activated() {
    console.log(77777777)
    this.$router.replace({ path: '/deliver/deliverStatistics/deliveringCourses' })
  },
  methods: {
    // pageInit() {
    //   const currentRouter = this.permission_routes.filter(v => {
    //     return v.path === '/deliver'
    //   })
    //   if (currentRouter.length > 0 && currentRouter[0].children) {
    //     const liveListArr = currentRouter[0].children.filter(v => {
    //       return v.path === 'deliverStatistics'
    //     })
    //     if (liveListArr.length > 0) {
    //       this.arr = liveListArr[0]?.children?.filter(item => item.name === 'DeliveringCourses') || []
    //     }
    //   }
    //   if (this.$route.path === '/deliver/deliverStatistics') {
    //     if (this.arr.length > 0) {
    //       console.log('路由跳转')
    //       this.$router.replace({ name: '/deliver/deliverStatistics/deliveringCourses' })
    //     }
    //   }
    // },
    itemClick(item) {
      this.$router.push({ name: item.name })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  min-width: 1200px;
  .navHeader {
    display: flex;
    border-bottom:1px solid #EFF2F6;
    padding-left: 20px;
    .navItem {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      border-bottom: 2px solid #fff;
      padding-bottom: 9px;
      margin-right: 20px;
      cursor: pointer;
    }
    .active {
      color: #0C6FFF;
      border-color: #0C6FFF;
    }
  }
}
.content {
  height: calc(100% - 36px);
}
</style>
