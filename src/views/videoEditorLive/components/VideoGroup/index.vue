<template>
  <div class="video-group-container flex">
    <group-nav class="group-nav" @active="activeGropuNav" />
    <video-list v-show="activeGroupComponents === 'VideoList'" class="group-content" @active="activeGroupItem" />
    <maps-list v-show="activeGroupComponents === 'MapsList'" class="group-content" @active="activeGroupItem" />
    <!-- <component :is="activeGroupComponents" class="group-content" @active="activeGroupItem" /> -->
  </div>
</template>
<script>
import GroupNav from './GroupNav'
import VideoList from './VideoList'
import MapsList from './MapsList'
export default {
  components: {
    GroupNav,
    VideoList,
    MapsList

  },
  data() {
    return {
      activeGroupComponents: 'VideoList'
    }
  },

  methods: {
    activeGropuNav(data) {
      this.activeGroupComponents = data.componentName
    },
    activeGroupItem(data) {
      this.$emit('add', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.video-group-container{
    border-right:4px solid #000;
    .group-nav{
        width:88px;
        border-right: 4px solid #000;;
    }
    .group-content{
        width:404px;
    }
}

</style>
