<template>
  <div class="submit-page">
    <div class="submit-content">
      <div class="title">离职申请</div>
      <div>
        <div class="label">申请人</div>
        <div class="value">自动获取</div>
      </div>
      <div>
        <div class="label">所在部门</div>
        <div class="value">自动获取</div>
      </div>
      <div>
        <div class="label"><i>* </i>离职日期</div>
        <div class="value">请选择日期</div>
      </div>
      <div>
        <div class="label"><i>* </i>离职类型</div>
        <div class="value">请选择离职类型</div>
      </div>
      <div class="textarea">
        <div class="label"><i>* </i>离职原因</div>
        <div class="value">请输入具体离职原因
          <span>0/200</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.submit-page {
  width: 375px;
  margin: 35px auto 0;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
  background: #fafafa;
  height: 550px;
  box-shadow: 0 2px 6px 0 #0000001a;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  .submit-content {
    font-size: 14px;
    background: #fafafa;
    > div {
      display: flex;
      min-height: 40px;
      line-height: 40px;
      background: #fff;
      margin-bottom: 6px;
      justify-content: space-between;
      padding: 0 16px;
      &.title {
        justify-content: center;
        margin-bottom: 16px;
      }
      &.textarea {
        flex-direction: column;
        background: #fff;
        .value {
          min-height: 120px;
          text-align: left;
          position: relative;
          span{
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
      .label {
        color: #000000;
        font-weight: 400;
        text-align: left;
        i{
          color: red;
        }
      }
      .value {
        color: #999999;
        text-align: right;
      }
    }
  }
}
</style>
