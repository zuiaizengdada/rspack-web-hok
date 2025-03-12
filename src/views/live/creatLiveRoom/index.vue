<template>
  <div
    ref="box"
    v-loading="loading"
    class="create-room-container"
    element-loading-text="直播间创建中。。。"
    element-loading-spinner="el-icon-loading"
  >
    <base-info ref="baseInfo" class="set-item" />
    <sign-set ref="signSet" class="set-item" />
    <operate-set ref="operateSet" class="set-item" />
    <div class="flex justify-center bottom-buttons">
      <el-button
        size="mini"
        type="primary"
        @click="handleClickSubmit"
      >确定</el-button>
      <el-button size="mini" @click="handleClickCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import BaseInfo from './components/BaseInfo/index'
import SignSet from './components/SignSet/index'
import OperateSet from './components/OperateSet/index'
import { addLiveRoom, getLiveRoomIdV2 } from './api/index.js'

export default {
  components: {
    BaseInfo,
    SignSet,
    OperateSet
  },
  data() {
    return {
      loading: false,
      global: {
        liveRoomId: ''
      }
    }
  },
  provide() {
    return {
      global: this.global
    }
  },
  mounted() {
    this.initLiveRoomId()
    console.log(this.global, 1111)
  },
  methods: {
    async initLiveRoomId() {
      const res = await getLiveRoomIdV2()
      this.global.liveRoomId = res.data
    },
    async handleClickSubmit() {
      // const $dom = document.querySelector('body')
      // $dom.classList.add('fixed')
      const $baseInfo = this.$refs.baseInfo
      const $signSet = this.$refs.signSet
      const $operateSet = this.$refs.operateSet
      $baseInfo.submitForm()
      $signSet.submitForm()
      $operateSet.submitForm()
      console.log($baseInfo.submitForm(), 11118888888888888)
      console.log($signSet.submitForm(), 333333)
      console.log($operateSet.submitForm(), 44444444444)
      await Promise.all([
        $baseInfo.submitForm(),
        $signSet.submitForm(),
        $operateSet.submitForm()
      ])

      const _data = { ...$baseInfo.form, ...$signSet.form, ...$operateSet.form, id: this.global.liveRoomId }
      console.log(_data, 22222)
      this.$store.dispatch('creatLiveRoom/setHistoryAddLiveForm', _data)
      this.loading = true
      try {
        const res = await addLiveRoom(_data)
        const roomId = res.data
        this.loading = false
        this.$message.success('创建成功！')
        const goodsList = $baseInfo.goodsList

        if (goodsList) {
          this.$router.push(
            `/privateLive/room/detail/${roomId}?goodsList=${$baseInfo.goodsList}`
          )
        } else {
          this.$router.push(`/privateLive/room/detail/${roomId}`)
        }
        // this.$router.push(`/privateLive/room/${roomId}`)
      } catch (err) {
        this.loading = false
      }
    },
    handleClickCancel() {
      this.$router
        .push({ path: '/privateLive/liveNewRoom/newRoom' })
        .then(() => {
          location.reload()
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.create-room-container {
  padding: 20px;

  .set-item {
    background: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
  }
  .bottom-buttons {
    background: #fff;
    border-radius: 16px;
    padding: 20px 0;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 10;
  }
}
::v-deep .el-loading-spinner {
  top: auto !important;
  bottom: 20% !important;
}
</style>
