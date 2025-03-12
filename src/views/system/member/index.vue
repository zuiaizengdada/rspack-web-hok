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
  name: 'MemberManage',
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
    this.pageInit()
  },
  created() {
    this.pageInit()
  },
  mounted() {},
  methods: {
    pageInit() {
      // rodoRouter------- 需要替换正确的路径
      const currentRouter = this.permission_routes.filter(v => {
        return v.path === '/ptyy'
      })
      if (currentRouter.length > 0 && currentRouter[0].children) {
        const liveListArr = currentRouter[0].children.filter(v => {
          return v.path === 'member'
        })
        if (liveListArr.length > 0) {
          this.arr = liveListArr[0].children || []
        }
      }
      if (this.$route.path === '/ptyy/member') {
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
}
</style>
