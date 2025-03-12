<template>
  <router-view v-if="isRouterAlive" />
</template>
<script>
export default {
  data() {
    return {
      isRouterAlive: true
    }
  },
  activated() {
    this.isRouterAlive = !this.isRouterAlive
    this.isRouterAlive = !this.isRouterAlive
  },
  created() {
    this.isRouterAlive = !this.isRouterAlive
    this.isRouterAlive = !this.isRouterAlive
  }
}
</script>
