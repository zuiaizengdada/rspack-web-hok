<template>
  <div>
    <div class="add-tools flex" style="margin-bottom:10px;">
      <el-button type="primary" @click="handleClickAdd">新增</el-button>
      <p style="margin-left:10px;">
        <el-checkbox v-model="allowNotRepeat" @change="handleChange">整场直播间不允许同一人重复中奖</el-checkbox>
      </p>
    </div>
    <ul v-show="luckDrawList.length > 0" class="luck-draw-list">
      <li v-for="(item,index) in luckDrawList" :key="item.id" class="flex justify-between items-center">
        <span>{{ item.prizeDrawName }}</span>
        <el-button type="danger" @click="handleCLickDelete(index)">删除</el-button>
      </li>
    </ul>

  </div>
</template>
<script>
import Dialog from '@/views/live/creatLiveRoom/components/Dialog/index.js'
export default {
  components: {

  },
  data() {
    return {
      allowNotRepeat: true,
      luckDrawList: [],
      visibleDialogLuckDraw: false
    }
  },
  methods: {
    handleChange(val) {
      const allowRepeat = !val
      this.$emit('change', allowRepeat)
    },
    handleClickAdd() {
      Dialog.open({
        type: 'AddLottery',
        liveRoomId: '1',
        visible: true,
        success: (res) => {
          console.log(res, 999999)
          this.luckDrawList.push(res)
          this.$emit('add', this.luckDrawList)
          // this.getList()
        }
      })
    },
    handleCLickDelete(index) {
      this.luckDrawList.splice(index, 1)
      this.$emit('add', this.luckDrawList)
    }
  }
}
</script>
<style lang="scss" scoped>
.luck-draw-list{
  width:600px;
  border:1px solid #DCDFE5;
  border-radius: 6px;
  li{
    border-bottom:1px solid rgba(217, 217, 217, 0.3);
    height:52px;
    padding:0 6px;
    &:last-child{
      border-bottom:none;
    }
    span{
      color:#333;
    }
  }
}
</style>
