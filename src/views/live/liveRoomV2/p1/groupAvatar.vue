<template>
  <div class="groupAvatar no-select">
    <div :class="{'comm-avatar':true, 'comm-avatar-name': !avatar}" :style="avaStyle">
      <div v-if="!avatar">{{ userName }}</div>
      <img v-else :src="avatar" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppAvatar',
  // eslint-disable-next-line vue/require-prop-types
  props: ['avatar', 'name', 'width'],
  data() {
    return {
      avaStyle: {
        'width': (this.width || 55) + 'px',
        'height': (this.width || 55) + 'px',
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
          return showName.slice(0, 2)
        }
        return arr[0].slice(0, 1) + arr[1].slice(0, 1)
      }
      // 中文名字 - 取前四位
      return showName.replace(/,|\.|\s+/g, '').slice(0, 2)
    }
  }
}

</script>

<style lang="scss">
.groupAvatar {
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
    background-color: #fff;
    color: #0C6FFF;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    text-align: center;
    > div {
      display: inline-block;
      width: 100%;
      height: 100%;
      padding: 3px;
      line-height: 17px;
      word-break: break-all;
      word-wrap: break-word;
    }
  }
}
</style>
