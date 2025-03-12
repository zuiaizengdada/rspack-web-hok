<template>
  <!--
    2022-09-07
    该组件是 el-image 组件的二次，以实现原组件的属性和事件监听的继承
    且已经对原 src 属性做好二次处理。即：利用 OSS 的在线压缩图片，压缩图片至合理的大小，提升加载速度
    202209-08
    修改原生 preview-src-list 的行为，解决了同时预览多张图片时第一张图片和缩略图不符合的情况
    例子：我的店铺 > 轮播图 > 添加轮播图。（先把以下的 :preview-src-list="previewSrcList" 该行代码去掉就可以看到该 bug）
   -->

  <el-image
    ref="image-previewer"
    v-bind="$attrs"
    :src="src"
    :preview-src-list="previewSrcList"
    v-on="$listeners"
  >
    <div slot="error" class="image-slot">
      <img slot="error" src="@/assets/image/tupianjiazaishibai.png" alt="" style="width: 100%; height: 100%; object-fit: contain" />
    </div>
  </el-image>

</template>

<script>
import zanwutupian from '@/assets/image/zanwutupian.png'
export default {
  props: {
    scaleWidth: {
      type: Number,
      default: 100
    },
    scaleHeight: {
      type: Number,
      default: 100
    },
    errorSlot: {
      type: Boolean,
      default: false
    },
    /**
     * 解决同时预览多张图片时第一张图片和缩略图不符合的情况而增加的参数
     * previewIndex 这个表示在循环列表中的第几位（指 =》 index）用于调整 previewSrcList 数组的排序。
     */
    previewIndex: {
      type: [Number, null],
      default: null
    }
  },
  data() {
    return {
      zanwutupian
    }
  },
  computed: {
    src() {
      const src = this.$attrs.src
      if (!src) return zanwutupian
      // 如果服务端返回的 src 带有 x-oss-process query 参数，说明已经处理过缩略图，不需要继续处理。
      // 主要解决视频的缩略图
      if (src.includes('x-oss-process=')) return src
      // 如果压缩长、高度为 0 则不做处理
      if (this.scaleWidth === 0 && this.scaleHeight === 0) return src
      return `${src}?x-oss-process=image/resize,w_${this.scaleWidth},h_${this.scaleHeight || this.scaleWidth}`
    },
    previewSrcList() {
      let previewSrcList = this.$attrs['preview-src-list']
      // 如果没传 previewIndex 则说明不需要处理同时预览多张图片
      if (this.previewIndex === null && Array.isArray(previewSrcList) && (previewSrcList?.length && previewSrcList[0])) return JSON.parse(JSON.stringify(previewSrcList))
      if (previewSrcList?.length && previewSrcList[0]) {
        /**
         * 给 previewSrcList 做一次深拷贝，如果不做深拷贝，
         * 会出现意料之外的情况
         */
        previewSrcList = JSON.parse(JSON.stringify(previewSrcList))
        const rest = previewSrcList.splice(0, this.previewIndex)
        const result = previewSrcList.concat(rest)
        return result
      }
      return []
    }
  }
}
</script>

<style>
.image-slot{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #C0C4CC;
  font-size: 12px;
}
</style>
