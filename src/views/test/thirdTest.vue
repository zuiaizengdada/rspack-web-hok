<template lang="">
  <div>
    第三方测试
    <div>
      测试西瓜播放器
      <div id="mse" />
    </div>

    <div>
      测试图片裁剪
      <el-button @click="cropper">点击裁剪</el-button>
    </div>

    <div>
      <AppMyImage />
    </div>
    <AppStatus />

    <!-- <div class="m-t-20">
      <el-button @click="mapVisible = true">打开地图</el-button>
    </div> -->
    <!-- <AppAmap /> -->

    <AppUEditor />

    <div id="qrcode" ref="qrcode" />
    <el-button @click="handleClick">
      检测cookie是否失效
    </el-button>
  </div>
</template>
<script>
import Player from 'xgplayer'
import AppMyImage from '@/components/AppMyImage'
import AppStatus from '@/components/AppStatus'
// import AppAmap from '@/components/AppAmap'
import AppUEditor from '@/components/AppUEditor'
import QRCode from 'qrcodejs2'
export default {
  components: {
    AppMyImage,
    AppStatus,
    // AppAmap,
    AppUEditor
  },
  data() {
    return {
      player: null,
      posterShow: true,
      url: 'http://211.94.219.1/268769823.mp4',
      // 裁剪组件的基础配置option
      option: {
        img: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F02.imgmini.eastday.com%2Fmobile%2F20180531%2F20180531063723_300a8f663cf704bd551453bf1642cf3e_2.jpeg&refer=http%3A%2F%2F02.imgmini.eastday.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649830372&t=87873e9d493f83d0c0b75b08318a28c0', // 裁剪图片的地址
        outputSize: 1, // 裁剪生成图片的质量(可选0.1 - 1)
        outputType: 'png', // 裁剪生成图片的格式（jpeg || png || webp）
        info: true, // 裁剪框的大小信息，图片大小信息
        // full: true,          //是否输出原图比例的截图，false按原比例裁切图片，不失真
        height: true, // 是否按照设备的dpr 输出等比例图片
        maxImgSize: 2000, // 限制图片最大宽度和高度
        enlarge: 1, // 图片根据截图框输出比例倍数
        canScale: true, // 图片是否允许滚轮缩放 默认true
        autoCrop: true, // 是否默认生成截图框 默认false
        canMove: true, // 上传图片是否可以移动 默认true
        autoCropWidth: 200, // 默认生成截图框宽度	容器的80%	0~max
        autoCropHeight: 200, // 默认生成截图框高度	容器的80%	0~max
        fixedBox: true, // 固定截图框大小 不允许改变	false	true | false
        fixed: true, // 是否开启截图框宽高固定比例
        original: false, // 上传图片按照原始比例渲染	false	true | false
        infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
        centerBox: false, // 截图框是否被限制在图片里面	false	true | false
        canMoveBox: true, // 截图框能否拖动	true	true | false
        fixedNumber: [1, 1] // 截图框的宽高比例 [宽度, 高度]
      },
      dialogVisible: false,
      loading: false,
      mapVisible: false
    }
  },
  mounted() {
    this.player = new Player({
      id: 'mse',
      url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4'
    })

    new QRCode(document.getElementById('qrcode'), {
      text: location.href,
      correctLevel: QRCode.CorrectLevel.L // 容错级别。属性值有：QRCode.CorrectLevel.L、QRCode.CorrectLevel.M、QRCode.CorrectLevel.Q、QRCode.CorrectLevel.H
    })
  },
  methods: {
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        console.log(data, 'data')
      })
    },
    // 检测yixiaoercookie
    handleClick() {
      // const cookie = '[{\"name\":\"sessionid\",\"value\":\"BgAAi39tUrgwB41a5selzvXD5o89chtGLEhvS5mPrhJtVS2hJ%2BYHhyBzD7Evo1SKHcPBSJUwjzdaATw7hQJum3ViKQBAsYpbDa%2FC\",\"domain\":\"channels.weixin.qq.com\",\"hostOnly\":true,\"path\":\"/\",\"secure\":true,\"httpOnly\":false,\"session\":false,\"expirationDate\":255093877661.40485,\"sameSite\":\"no_restriction\"},{\"name\":\"wxuin\",\"value\":\"1206109428\",\"domain\":\"channels.weixin.qq.com\",\"hostOnly\":true,\"path\":\"/\",\"secure\":true,\"httpOnly\":false,\"session\":false,\"expirationDate\":255093877661.40488,\"sameSite\":\"no_restriction\"},{\"name\":\"authorId\",\"value\":\"v2_060000231003b20faec8c6e78a18cad2cc06ef36b07760523b2e96995c291729ce332d36fc59@finder\",\"domain\":\".channels.weixin.qq.com\",\"hostOnly\":false,\"path\":\"/\",\"secure\":false,\"httpOnly\":false,\"session\":false,\"expirationDate\":255033043504.14465}]'
      const cookie = '[{"name":"feugc-status","value":"online","domain":".creator.xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1691726647.465884,"sameSite":"unspecified"},{"name":"feugc-status.sig","value":"B9ChOZWemdxggiLg0HsBku4anQtV-2bl8oVorYSDQEw","domain":".creator.xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1691726647.465946,"sameSite":"unspecified"},{"name":"xsecappid","value":"ugc","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":1723176248,"sameSite":"unspecified"},{"name":"a1","value":"189dd9db695ktzv2x78vbtgc7oxbtcv5tigdqwvar50000137755","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":1723176247,"sameSite":"unspecified"},{"name":"webId","value":"67b433261cd4aaed5c5a41ae0dd98303","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":1723176247,"sameSite":"unspecified"},{"name":"gid","value":"yYjffjfDYK9SyYjffjfDK3Ehj2T9uhJCWYhDk0F9kSWlCf28D9Sh2A888yqWW228fJdqW4i2","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":3162869176.859088,"sameSite":"unspecified"},{"name":"customerBeakerSessionId","value":"42226972957610cf0f74322513c2d5ba50f1c6bcgAJ9cQAoWBAAAABjdXN0b21lclVzZXJUeXBlcQFLAVgOAAAAX2NyZWF0aW9uX3RpbWVxAkdB2TUYcVi0OVgJAAAAYXV0aFRva2VucQNYQQAAADc5ODJjMmM4MzNkZjRiMGJiZWE1NTFhZjJjNTA2ZjlhLWMyMGU3NmJmNjNiYzQyODBiYTFkNjQ3N2MwY2MyNmE2cQRYAwAAAF9pZHEFWCAAAAA0YzlkZDhjODExOWE0ODAxOTM1ODc5NjZjOWUwNzIwOXEGWA4AAABfYWNjZXNzZWRfdGltZXEHR0HZNRhxWLQ5WAYAAAB1c2VySWRxCFgYAAAANjI3MWZjZmEwMDAwMDAwMDIxMDIwMDI0cQlYAwAAAHNpZHEKWBgAAAA2NGQ0NjFjNTc1MDAwMDAwMDAwMDAwMDNxC3Uu","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1692245061.820536,"sameSite":"unspecified"},{"name":"customerClientId","value":"958284587380880","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":true,"httpOnly":true,"session":false,"expirationDate":1849320261.820566,"sameSite":"unspecified"},{"name":"customer-sso-sid","value":"64d461c57500000000000003","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1849320261.820578,"sameSite":"unspecified"},{"name":"x-user-id-creator.xiaohongshu.com","value":"6271fcfa0000000021020024","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1849320261.820587,"sameSite":"unspecified"},{"name":"access-token-creator.xiaohongshu.com","value":"customer.ares.AT-f6251adf91dc4aecad9d97ccf2e4d9d3-b4551eb2a50647e5ae0cee49c3535291","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":true,"session":false,"expirationDate":1723176261.878547,"sameSite":"unspecified"},{"name":"galaxy_creator_session_id","value":"qnHtWPxo3ZerHZOCBmYZgw4IkBDD5lE8hsTV","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":1692245061.934951,"sameSite":"unspecified"},{"name":"galaxy.creator.beaker.session.id","value":"1691640261494074170391","domain":".xiaohongshu.com","hostOnly":false,"path":"/","secure":false,"httpOnly":false,"session":false,"expirationDate":1692245061.934984,"sameSite":"unspecified"}]'
      const params = [
        {
          platformId: 31,
          platformAccountId: '1689224497695166464',
          cookie: cookie,
          token: '222222222222222222222123'
        }
      ]
      window.videoPublishSocket.emit('check-account-login-status', JSON.stringify(params), (response) => {
        // console.log(JSON.parse(response), '检测账号登录情况。。。')
        const checkAccountLoginStatusRes = JSON.parse(response)
        console.log(checkAccountLoginStatusRes, '检测账号登录情况。。。')
      })
    },
    changeFixed(res) {
      switch (res) {
        case 1:
          // this.$set(this.option, 'fixedNumber', [4, 3])
          this.option.fixedBox = true
          this.option.fixedNumber = [4, 3]
          this.option.autoCropWidth = 300
          this.option.autoCropHeight = Math.round((300 * 3) / 4)
          break
        case 2:
          // this.$set(this.option, 'fixedNumber', [3, 4])
          this.option.fixedBox = true
          this.option.fixedNumber = [3, 4]
          this.option.autoCropWidth = 300
          this.option.autoCropHeight = Math.round((300 * 4) / 3)
          break
        case 3:
          // this.$set(this.option, 'fixedNumber', [1, 1])
          this.option.fixedBox = true
          this.option.fixedNumber = [1, 1]
          this.option.autoCropWidth = 300
          this.option.autoCropHeight = 300
          break
      }
    },
    changeFree() {
      this.option.fixedBox = false
    },
    cropper() {
      // dialogVisible = true
      this.$AppImageCropper({
        visible: true,
        url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F02.imgmini.eastday.com%2Fmobile%2F20180531%2F20180531063723_300a8f663cf704bd551453bf1642cf3e_2.jpeg&refer=http%3A%2F%2F02.imgmini.eastday.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1649830372&t=87873e9d493f83d0c0b75b08318a28c0',
        title: '裁剪图片',
        width: 300
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
</style>
