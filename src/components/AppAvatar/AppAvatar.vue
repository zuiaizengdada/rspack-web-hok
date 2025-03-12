<template>
  <div class="app-avatar" :style="{ width: !noName ? '3em' : '' }">
    <div
      :class="{ 'comm-avatar': true, 'comm-avatar-name': !avatar }"
      :style="avaStyle"
    >
      <span v-if="!avatar">{{ userName }}</span>
      <img v-else :src="avatar" />
    </div>
    <div v-if="!noName" class="userName">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'AppAvatar',
  // eslint-disable-next-line vue/require-prop-types
  props: ['avatar', 'name', 'width', 'noName'],
  data() {
    return {
      avaStyle: {
        width: (this.width || 55) + 'px',
        height: (this.width || 55) + 'px',
        'line-height': (this.width || 55) + 'px',
        'font-size': ((this.width || 55) < 36 ? 12 : this.width / 3) + 'px'
      }
    }
  },
  computed: {
    userName() {
      let showName = this.name || ''
      let arr = []
      const _isEnglish = showName.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null

      if (_isEnglish) {
        // 英文名字
        // 将“,.”转为空格 & 将连续空格转换为单个空格
        showName = showName.replace(/,|\./g, ' ').replace(/\s+/g, ' ')
        arr = showName.split(' ')
        if (arr.length === 1) {
          return showName.slice(0, 3)
        }
        return arr[0].slice(0, 1) + arr[1].slice(0, 1)
      }
      // 中文名字 - 取后两位
      return showName.replace(/,|\.|\s+/g, '').slice(0, 1)
    }
  }
}
</script>

<style lang="scss">
.app-avatar {
  display: flex;
  flex-direction: column;
  .comm-avatar {
    border-radius: 50%;
    background-color: #fff;
    color: #fff;
    text-align: center;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;

    img {
      width: 100%;
      min-height: 100%;
    }
  }

  .comm-avatar-name {
    background-color: #3f9af4;
  }

  .userName {
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #999;
  }
}
</style>
