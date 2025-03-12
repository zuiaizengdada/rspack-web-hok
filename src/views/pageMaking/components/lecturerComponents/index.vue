<template>
  <div
    class="lecturer-container"
    :style="{
      'padding-left':leftAndRightSpacing + 'px',
      'padding-right':leftAndRightSpacing + 'px',
      'padding-top':topAndBottomSpacing + 'px',
      'padding-bottom':topAndBottomSpacing + 'px',
      backgroundColor:item.options.backgroundStyle.backgroundType === 2 ? item.options.backgroundStyle.backgroundVal :'',
      backgroundImage:`url(${item.options.backgroundStyle.backgroundType === 3 ? item.options.backgroundStyle.imageUrl[0] :''})`
    }"
    :class="{'widget-form-bg':item.options.backgroundStyle.backgroundType === 3 }"
  >
    <el-row
      v-if="sortType !== '5'"
      :gutter="gutter"
      class="flex flex-wrap"
      :style="{'margin-top':`-${gutter / 2}px`,'margin-bottom':`-${gutter / 2}px` }"
    >
      <el-col
        v-for="list in item.options.dataSource"
        :key="list.headUrl"
        :span="lineClass[sortType]"
        :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
      >
        <div
          class="lecturer-content-content"
          :class="{
            'line1':sortType === '1',
            'line2':sortType === '2',
            'line3':sortType === '3',
            'line4':sortType === '4',
          }"
        >
          <div class="line">
            <img
              :src="list.headUrl"
            />
          </div>
          <div
            v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
            class="lecturer-content-text"
          >
            <span
              v-if="item.options.showNameType !== 0"
              class="title"
              :class="{
                ellipsis:item.options.showNameType === 1,
                ellipsis2:item.options.showNameType === 2,
              }"
            >{{ list.lecturerName }}</span>
            <span
              v-if="item.options.showIntroductionType !== 0"
              :class="{
                ellipsis:item.options.showIntroductionType === 1,
                ellipsis2:item.options.showIntroductionType === 2,
              }"
              class="tips"
            >
              {{ list.lecturerLabel }}
            </span>
          </div>
        </div>
      </el-col>
      <template v-if="!item.options.dataSource.length">
        <el-col
          v-for="list in +sortType"
          :key="list"
          :span="lineClass[sortType]"
          :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
        >
          <div
            class="lecturer-content-content"
            :class="{
              'line1':sortType === '1',
              'line2':sortType === '2',
              'line3':sortType === '3',
              'line4':sortType === '4',
            }"
          >
            <div
              class="lecturer-content-line default-line"
            >
              <img
                :src="defaultImgUrl"
                :class="sortType === '1' ? 'img1':'img2'"
              />
            </div>
            <div
              v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
              class="lecturer-content-text"
            >
              <span
                v-if="item.options.showNameType !== 0"
                class="title"
                :class="{
                  ellipsis:item.options.showNameType === 1,
                  ellipsis2:item.options.showNameType === 2,
                }"
              >IP姓名</span>
              <span
                v-if="item.options.showIntroductionType !== 0"
                :class="{
                  ellipsis:item.options.showIntroductionType === 1,
                  ellipsis2:item.options.showIntroductionType === 2,
                }"
                class="tips"
              >
                此处显示IP简介，超出该行显示…
              </span>
            </div>
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
              class="lecturer-content-content line5"
              style="flex-shrink: 0"
            >
              <div
                class="lecturer-content-line line"
              >
                <img :src="defaultImgUrl" class="img2" />
              </div>
              <div
                v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
                class="lecturer-content-text"
              >
                <span
                  v-if="item.options.showNameType !== 0"
                  class="title"
                  :class="{
                    ellipsis:item.options.showNameType === 1,
                    ellipsis2:item.options.showNameType === 2,
                  }"
                >IP姓名</span>
                <span
                  v-if="item.options.showIntroductionType !== 0"
                  :class="{
                    ellipsis:item.options.showIntroductionType === 1,
                    ellipsis2:item.options.showIntroductionType === 2,
                  }"
                  class="tips"
                >
                  此处显示IP简介，超出该行显示…
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(list,index) in item.options.dataSource"
              :key="list.headUrl"
              :style="`margin-right:${index !== 8? gutter:0}px`"
              class="lecturer-content-content line5"
              style="flex-shrink: 0"
            >

              <img :src="list.headUrl" class="line" />
              <div
                v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
                class="lecturer-content-text"
              >
                <span
                  v-if="item.options.showNameType !== 0"
                  class="title"
                  :class="{
                    ellipsis:item.options.showNameType === 1,
                    ellipsis2:item.options.showNameType === 2,
                  }"
                >{{ list.lecturerName }}</span>
                <span
                  v-if="item.options.showIntroductionType !== 0"
                  :class="{
                    ellipsis:item.options.showIntroductionType === 1,
                    ellipsis2:item.options.showIntroductionType === 2,
                  }"
                  class="tips"
                >
                  {{ list.lecturerLabel }}
                </span>
              </div>
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
  name: 'LecturerComponents',
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
.lecturer-container ::v-deep{
  overflow: hidden;
  .lecturer-content{
    img{
      height: 148px;
      width: 100%;
    }
  }
  .lecturer-content-content{
    display: flex;
    flex-direction: column;
    background: #fff;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    img{
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
    }
  }
  .lecturer-content-line{
    background: #F5F7FA;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .lecturer-content-text{
    display: flex;
    flex-direction: column;
    color: #333333;
    .ellipsis {
      min-height: 19px;
    }
    .ellipsis2 {
      min-height: 38px;
    }
    .tips{
      color: #666666;
      margin-top: 8px;
    }
  }

  .ellipsis{
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ellipsis2{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // 超出多少行
    -webkit-box-orient: vertical;
  }
  .img1{
    height: 70px;
    width: 95px;
  }
  .img2{
    height: 24px;
    width: 24px;
  }
  .line1{
    .default-line{
      height: 351px;
    }
    .lecturer-content-text{
      margin:10px;
    }
    .title{
      font-size: 16px;
    }
    .tips{
      font-size: 14px;
    }
  }
  .wid-100{
    width: 100%;
  }
  .line2{
    .default-line{
      height: 169px;
    }
    .lecturer-content-text{
      margin:10px;
    }
    .title{
      font-size: 14px;
    }
    .tips{
      font-size: 14px;
    }
  }
  .line3{
    .default-line{
      height: 109px;
    }
    .lecturer-content-text{
      margin:8px;
    }
    .title{
      font-size: 14px;
    }
    .tips{
      font-size: 12px;
    }
  }
  .line4{
    .default-line{
      height: 79px;
    }
    .lecturer-content-text{
      margin:4px;
    }
    .title{
      font-size: 12px;
    }
    .tips{
      font-size: 10px;
    }
  }
  .line5{
    width: 72px;
    .lecturer-content-text{
      margin:4px;
    }
    .title{
      font-size: 12px;
    }
    .tips{
      font-size: 10px;
    }
  }
  .row-1{
    display: flex;
  }
}
</style>
