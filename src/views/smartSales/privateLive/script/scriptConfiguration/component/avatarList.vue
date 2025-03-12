<template>
  <div class="page_wrap">
    <div class="avatarList" :style="{width: `${(list.length > 5 ? 5 : list.length) * 18 + 18}px`}">
      <template v-for="(item, index) in list">
        <AppAvatar
          v-if="index < 5"
          :key="index"
          class="avatarViewFlex"
          :style="{transform: `translateX(-${index * 16}px)`}"
          :avatar="item.robotHeadPic"
          :name="item.robotNickName"
          :width="32"
          :no-name="true"
        />
      </template>
    </div>
    <div v-if="list.length > 5" class="affixIndex">
      {{ list.length }}
    </div>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: {
    AppAvatar
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.page_wrap {
    display: flex;
    align-items: center;
    position: relative;
    .avatarList {
        display: flex;
        align-items: center;
        .avatarViewFlex {
            float: left;
            border-radius: 50%;
            border: 1px solid #fff;
        }
    }
    .affixIndex {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        font-weight: 400;
        font-size: 12px;
        background: #0C6FFF;
        color: #FFFFFF;
        text-align: center;
        line-height: 20px;
    }
}
</style>
