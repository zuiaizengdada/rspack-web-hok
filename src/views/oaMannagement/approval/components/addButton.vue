<template>
  <div class="add">
    <div class="add-btn">
      <span /><img class="add-img1" src="@/assets/image/add.png" /><img class="add-img2" src="@/assets/image/down.png" />
    </div>
    <div class="add-flow flex">
      <div @click="$emit('add', 1)">
        <img src="@/assets/image/shenpi.png" />
        审批
      </div>
      <div @click="$emit('add', 2)">
        <img src="@/assets/image/chaosong.png" />抄送
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.add {
  color: #409eff;
  margin: 10px auto 30px;
  font-size: 20px;
  position: relative;
  &:hover {
    .add-flow {
      opacity: 1;
    }
  }
  .add-btn {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      display: inline-block;
      width: 2px;
      height: 28px;
      background: #cccccc;
    }
    .line {
      height: 28px;
      color: #cccccc;
    }
    .add-img1{
      width: 24px;
      height: 24px;
      margin: 2px 0;
    }
    .add-img2{
      width: 7px;
      height: 28px;
    }
  }
  .add-flow {
    cursor: pointer;
    position: absolute;
    width: 120px;
    left: 40px;
    top: 30px;
    opacity: 0;
    > div {
      color: #777777;
      font-size: 12px;
      text-align: center;
      margin-right: 19px;
      img {
        width: 28px;
        height: 28px;
        display: block;
      }
    }
  }
}
</style>
