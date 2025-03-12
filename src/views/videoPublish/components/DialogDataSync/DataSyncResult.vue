<template>
  <div class="data-sync-result-container">
    <!-- 部分成功-->
    <!--    <div v-if="errNums===0">-->
    <!--      <div class="icon-info  text-center">-->
    <!--        <el-image :src="successFailImg" />-->
    <!--        <p>数据部分同步成功</p>-->
    <!--      </div>-->
    <!--      <div class="result-info text-center">-->
    <!--        <p>本次共同步<span>7</span>个 账号,同步成功<span>4</span>个,同步失败<span class="red">3</span>个<br>其中3个账号授权过期,请登录失效账号,重新同步</p>-->
    <!--      </div>-->
    <!--    </div>-->
    <div v-if="errNums==0&&loseEfficacy==0">
      <div class="icon-info  text-center">
        <el-image :src="successImg" />
        <p>数据同步成功</p>
      </div>
      <div class="result-info text-center">
        <p>本次共同步<span>{{ successNums+errNums }}</span>个账号,同步成功<span class="green">{{ successNums }}</span>个,同步失败<span>0</span>个</p>
      </div>
    </div>
    <div v-if="errNums!==0 || loseEfficacy!=0">
      <div class="icon-info  text-center">
        <el-image :src="errorImg" />
        <p>数据同步失败</p>
      </div>
      <div class="result-info text-center">
        <p>本次共同步<span>{{ successNums+errNums+loseEfficacy }}</span>个 账号,同步成功<span>{{ successNums }}</span>个,同步失败<span class="red">{{ loseEfficacy+errNums }}</span>个<br />其中<span>{{ loseEfficacy }}</span>个账号授权过期,请登录失效账号,重新同步</p>
      </div>
    </div>
  </div>
</template>
<script>
import successFailImg from '../../images/svg/success-01.svg'
import successImg from '../../images/svg/success-02.svg'
import errorImg from '../../images/svg/error.svg'
export default {
  props: {
    successNums: {
      type: Number,
      default: 0
    },
    errNums: {
      type: Number,
      default: 0
    },
    loseEfficacy: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      successFailImg,
      successImg,
      errorImg,
      dataSyncResultType: 3
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-info{
    padding-top:40px;
    p{
      font-size:24px;
      color:#333;
      margin-bottom: 36px;
      padding-top: 12px
    }
}
.result-info{
    font-size:16px;
    color:#333;
    line-height: 24px;
    padding-bottom:60px;
    span{
        font-size:24px;
        padding:0 6px;
        &.red{
            color:#F53F3F
        }
        &.green{
            color:#00B42A
        }
    }
}
</style>
