<template>
  <div class="main_content">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TeacherAssessment',
  components: {},
  data() {
    return {
      arr: [],
      isRouterAlive: true
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  activated() {
    this.pageInit()
    this.isRouterAlive = !this.isRouterAlive
    this.isRouterAlive = !this.isRouterAlive
  },
  created() {
    this.pageInit()
  },
  mounted() {},
  methods: {
    pageInit() {
      const currentRouter = this.permission_routes.filter((v) => {
        return v.path === '/teacherCenter'
      })
      if (currentRouter.length > 0 && currentRouter[0].children) {
        const liveListArr = currentRouter[0].children.filter((v) => {
          return v.path === 'findTeacher'
        })
        if (liveListArr.length > 0) {
          this.arr = liveListArr[0].children || []
        }
      }
      if (this.$route.path === '/teacherCenter/findTeacher') {
        if (this.arr.length > 0) {
          this.$router.replace({ name: this.arr[0].name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  overflow: auto;
  // padding: 10px;
  min-width: 1200px;
}
</style>
