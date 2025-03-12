<template>
  <div class="main_content">
    <keep-alive>
      <router-view v-if="isRouterAlive" />
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PackageCollegeColumn',
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
    console.log(this.$route)
    console.log(this.$router)
    this.pageInit()
  },
  mounted() {},
  methods: {
    pageInit() {
      const found = []
      this.permission_routes.forEach(r => {
        ;(r.children || []).forEach(ch => {
          if (r.path + '/' + ch.path === this.$route.path) {
            found.push(r)
          }
        })
      })
      console.log(found)
      if (found.length > 0 && found[0].children) {
        const liveListArr = found[0].children.filter(v => {
          return v.path === 'packageCollegeColumn'
        })
        let arr = []
        if (liveListArr.length > 0) {
          arr = liveListArr[0].children || []
        }
        if (this.$route.path === found[0].path + '/packageCollegeColumn') {
          if (arr.length > 0) {
            this.$router.push({ name: arr[0].name })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main_content {
  overflow: auto;
  /* padding: 10px; */
  min-width: 1200px;
}
</style>
