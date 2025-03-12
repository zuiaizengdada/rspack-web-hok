<template>
  <div>
    <template v-if="url">
      <div v-if="/.pdf/.test(url)" class="imgView">
        <svg-icon icon-class="pdfwenjian" class="pdficon" />
        <span class="a_link" @click="openPdf(url)">点击查看</span>
      </div>
      <div v-else class="imgView">
        <ImagePreviewer style="width: 100%; height: 100%" :src="url" fit="contain" :preview-src-list="[url]" :scale-width="120" :scale-height="90">
          <img slot="error" src="@/assets/image/tupianjiazaishibai.png" alt="" style="width: 100%; height: 100%" />
        </ImagePreviewer>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    openPdf(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.imgView {
  width: 120px;
  height: 90px;
  border-radius: 4px;
  background: #fbfcfe;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 22px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fafafa;
  justify-content: center;
  .pdficon {
    margin-bottom: 6px;
    width: 30px;
    height: 32px;
    font-size: 30px;
  }
}
</style>
