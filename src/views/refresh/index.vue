<template>
  <div />
</template>
<script>
export default {
  beforeRouteEnter(to, from, next) {
    console.log(from)
    next(vm => {
      vm.$router.replace(from.fullPath)
    })
  }
}
</script>
