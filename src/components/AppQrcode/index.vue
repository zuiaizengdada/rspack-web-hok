<template>
  <!-- <div :id="ueId" :key="ueId" ref="qrcode" class="myQrcode" /> -->
  <vue-qr
    v-bind="$attrs"
    :text="src"
    :size="size"
  />
</template>

<script>
// import QRCode from 'qrcodejs2'
import VueQr from 'vue-qr'
export default {
  components: {
    VueQr
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      // qs: null,
      // ueId: `J_ueditorBox_${new Date().getTime()}`
    }
  },
  mounted() {
    // console.log(this.src, 'src')
    // this.qs = new QRCode(document.getElementById(this.ueId), {
    //   text: this.src,
    //   width: 200,
    //   height: 200,
    //   correctLevel: 3, // 取值为0|1|2|3 表示二维码的纠错级别0:L/1:M/2:Q/3:H ,默认0  可选参数
    //   errorCorrectionLevel: 'L',
    //   background: '#rrggbb', // 默认白色, 表示二维码的后景颜色 可选参数
    //   foreground: '#rrggbb', // 默认黑色, 表示二维码的前景颜色 可选参数
    //   render: 'table'// 取值:table/canvas , 默认table 可选参数
    //   // margin: 0, // 外边距
    //   // correctLevel: 3 // 容错级别。属性值有：QRCode.CorrectLevel.L、QRCode.CorrectLevel.M、QRCode.CorrectLevel.Q、QRCode.CorrectLevel.H
    // })
  }
}
</script>

<style lang='scss' scoped>
 .myQrcode {
    width: 200px;
    height: 200px;
  }
</style>
