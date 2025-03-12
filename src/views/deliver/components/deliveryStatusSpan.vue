<template>
  <div>
    <svg-icon :icon-class="`icon_deliveryStatus${current.deliveryStatus || 1}`" />
    <span :style="{color:classColor[current.deliveryStatus || 1]}"> {{ current.deliveryStatusName }}</span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      classColor: {
        1: '#F53F3F',
        2: '#0C6FFF',
        3: '#FF7D00',
        4: '#6E00FB',
        5: '#00B42A',
        6: '#777777'
      }
    }
  }
}
</script>

<style>

</style>
