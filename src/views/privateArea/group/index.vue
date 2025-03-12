<template>
  <div class="main_content">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Video',
  components: {},
  data() {
    return {
      arr: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  activated() {
    // console.log('456')
    this.pageInit()
  },
  created() {
    this.pageInit()
  },
  mounted() {},
  methods: {
    pageInit() {
      const currentRouter = this.permission_routes.filter(v => {
        return v.path === '/privateArea'
      })
      if (currentRouter.length > 0 && currentRouter[0].children) {
        const groupListArr = currentRouter[0].children.filter(v => {
          return v.path === 'group'
        })
        if (groupListArr.length > 0) {
          this.arr = groupListArr[0].children || []
        }
      }
      if (this.$route.path === '/privateArea/group') {
        if (this.arr.length > 0) {
          this.$router.push({ name: this.arr[0].name })
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
  height: 100%;
}
</style>
