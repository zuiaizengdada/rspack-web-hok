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
  name: 'PaySetting',
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
          return v.path === 'paySetting'
        })
        let arr = []
        if (liveListArr.length > 0) {
          arr = liveListArr[0].children || []
        }
        if (this.$route.path === found[0].path + '/paySetting') {
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
