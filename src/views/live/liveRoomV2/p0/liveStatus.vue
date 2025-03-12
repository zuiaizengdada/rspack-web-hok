<template>
  <span
    class="liveRoomLiveState m-l-10 m-r-20"
    :class="`liveRoomLiveState${status}`"
  >
    <slot>
      <template v-if="status === 1">
        <img
          class="liveing"
          src="@/assets/image/liveRoom/liveIng_iSpt.png"
          alt=""
        />
      </template>
      <template v-else>
        <svg-icon
          v-if="status === 1 || status === '-1'"
          class-name="liveTypeicon"
          :icon-class="statusObj[status]"
        />
      </template>
    </slot>
    {{ status | getOptionsValue(liveStateOption) }}
  </span>
</template>

<script>
import { liveStateOption } from '../../columns'
export default {
  components: {},
  props: {
    status: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      statusObj: {
        '-1': '_wating',
        0: '',
        1: 'liveIng',
        2: 'liveSuspend',
        3: 'liveError',
        9: 'audit_info'
      },
      liveStateOption
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.liveRoomLiveState {
  display: inline-block;
  border-radius: 20px;
  height: 28px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.liveing {
  height: 14px;
  width: 14px;
  margin-right: 3px;
}
.liveTypeicon {
  margin-right: 2px;
  font-size: 24px;
  margin-left: -8px;
}
.liveRoomLiveState0,
.liveRoomLiveState-1 {
  background: #0000004d;
  color: #ffffff;
}
.liveRoomLiveState1 {
  background: #0c6fff;
  color: #ffffff;
}
.liveRoomLiveState2 {
  background: #fff2e6;
  color: #ff7d00;
}
.liveRoomLiveState3 {
  background: #0000004d;
  color: #ffffff;
}
.liveRoomLiveState9 {
  background: #0000004d;
  color: #ffffff;
}
</style>
