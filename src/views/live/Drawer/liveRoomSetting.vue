<template>
  <HokDrawer v-model="visible" :loading="loading" :title="title" />
</template>
<script>
import HokDrawer from '@/views/live/Drawer/drawer'
export default {
  components: {
    HokDrawer
  },
  data() {
    return {
      loading: false,
      title: '页面设置',
      visible: false
    }
  },
  mounted() {},
  methods: {
  }
}
</script>

<style lang='scss' scoped>
</style>
