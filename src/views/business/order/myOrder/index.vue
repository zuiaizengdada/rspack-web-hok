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
  name: 'Order',
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
        return v.path === '/business'
      })
      if (currentRouter.length > 0 && currentRouter[0].children) {
        const liveListArr = currentRouter[0].children.filter(v => {
          return v.path === 'myOrder'
        })
        if (liveListArr.length > 0) {
          this.arr = liveListArr[0].children || []
        }
      }
      if (this.$route.path === '/business/myOrder') {
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
