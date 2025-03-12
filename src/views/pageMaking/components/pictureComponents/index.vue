<template>
  <div
    class="picture-container"
    :style="{
      'padding-left':leftAndRightSpacing + 'px',
      'padding-right':leftAndRightSpacing + 'px',
      'padding-top':topAndBottomSpacing + 'px',
      'padding-bottom':topAndBottomSpacing + 'px'
    }"
  >
    <el-row
      v-if="sortType !== '5'"
      class="flex flex-wrap"
      :gutter="gutter"
      :style="{'margin-top':`-${gutter / 2}px`,'margin-bottom':`-${gutter / 2}px` }"
    >
      <el-col
        v-for="list in item.options.dataSource"
        :key="list.url"
        :span="lineClass[sortType]"
        :class="{
          'line2':sortType === '2',
          'line3':sortType === '3',
          'line4':sortType === '4',
        }"
        :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
      >

        <img
          :src="list.url"
          style="width: 100%;height: 100%;"
        />
      </el-col>
      <template v-if="!item.options.dataSource.length">
        <el-col
          v-for="list in +sortType"
          :key="list"
          :span="lineClass[sortType]"
          :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
        >
          <div
            class="picture-content-line"
            :class="{
              'line1':sortType === '1',
              'line2':sortType === '2',
              'line3':sortType === '3',
              'line4':sortType === '4',
            }"
          >
            <img
              :src="defaultImgUrl"
              :class="sortType === '1' ? 'img1':'img2'"
            />
          </div>
        </el-col>
      </template>
    </el-row>
    <template v-else>
      <vueCustomScrollbar>
        <div
          class="row-1"
          style="width: 100%;"
        >
          <template
            v-if="!item.options.dataSource.length"
          >
            <div
              v-for="(list,index) in 8"
              :key="list"
              :style="`margin-right:${index !== 8? gutter:0}px`"
              class="picture-content-line line5"
              style="flex-shrink: 0"
            >
              <img :src="defaultImgUrl" class="img2" />
            </div>
          </template>
          <template v-else>
            <div
              v-for="(list,index) in item.options.dataSource"
              :key="list.url"
              class="line5"
              style="flex-shrink: 0"
              :style="`margin-right:${index !== 8? gutter:0}px`"
            >
              <img
                :src="list.url"
              />
            </div>

          </template>
        </div>
      </vueCustomScrollbar>
    </template>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
export default {
  name: 'PictureComponents',
  components: {
    vueCustomScrollbar
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      lineClass: {
        1: 24,
        2: 12,
        3: 8,
        4: 6,
        5: 6
      }
    }
  },
  computed: {
    items() {
      return this.item?.options?.dataSource ?? []
    },
    gutter() {
      return this.item?.options?.style.gutter ?? 0
    },
    leftAndRightSpacing() {
      return this.item?.options?.style.leftAndRightSpacing ?? 0
    },
    topAndBottomSpacing() {
      return this.item?.options?.style.topAndBottomSpacing ?? 0
    },
    sortType() {
      return this.item?.options?.sortType ?? '1'
    },
    defaultImgUrl() {
      const defaultUrl = require('../../assets/images/page_image_bg.png')
      const defaultUrl2 = require('../../assets/images/page_image_bg2.png')
      return this.sortType === '1' ? defaultUrl : defaultUrl2
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.picture-container ::v-deep{
  overflow: hidden;
  .picture-content{
    img{
      height: 148px;
      width: 100%;
    }
  }
  .picture-content-line{
    background: #F5F7FA;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .img1{
    height: 70px;
    width: 95px;
  }
  .img2{
    height: 24px;
    width: 24px;
  }
  .wid-100{
    width: 100%;
  }
  .line5{
     width: 72px;
     img{
      height: 100%;
      width: 100%;
     }
  }
  .row-1{
    display: flex;
  }
}
</style>
