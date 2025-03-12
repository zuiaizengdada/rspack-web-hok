<template>
  <div
    class="course-container"
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
    <van-tabs
      v-show="item.options.dataSource.length && tabsKey.length && item.options.isShowCourseGroupName"
      :key="JSON.stringify(tabsKey)"
      v-model="realActive"
      :ellipsis="false"
      swipeable
    >
      <van-tab
        v-for="list in tabsKey"
        :key="list.key"
        :title="list.value"
      />
    </van-tabs>
    <van-tabs
      v-show="item.options.dataSource.length &&!tabsKey.length && item.options.isShowCourseGroupName"
      v-model="active"
      :ellipsis="false"
      swipeable
    >
      <van-tab
        v-for="title in defaultTabs"
        :key="title"
        :title="title"
      />
    </van-tabs>
    <el-row
      v-if="sortType !== '5'"
      class="flex flex-wrap"
      :gutter="gutter"
      :style="{'margin-top':`-${gutter / 2}px`,'margin-bottom':`-${gutter / 2}px` }"
    >
      <template
        v-for="(list,index) in item.options.dataSource"
      >
        <el-col
          v-if="showItem(list)"
          :key="index"
          :span="lineClass[sortType]"
          :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
        >
          <div
            class="course-content-content"
            :class="{
              'line1':sortType === '1',
              'line2':sortType === '2',
              'line3':sortType === '3',
              'line4':sortType === '4',
            }"
          >
            <div class="line">
              <img
                :src="list.coverVerticalUrl"
              />
            </div>
            <div
              v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
              class="course-content-text"
            >
              <span
                v-if="item.options.showNameType !== 0"
                class="title"
                :class="{
                  ellipsis:item.options.showNameType === 1,
                  ellipsis2:item.options.showNameType === 2,
                }"
              >
                {{ list.contentName }}
              </span>
              <span
                v-if="item.options.showIntroductionType !== 0"
                :class="{
                  ellipsis:item.options.showIntroductionType === 1,
                  ellipsis2:item.options.showIntroductionType === 2,
                }"
                class="tips"
              >
                {{ list.columnContent }}
              </span>
            </div>
            <div class="sale ellipsis">
              <span v-if="item.options.isShowGoodsScore && list.salePrice" class="price">
                <span>¥</span>
                <span class="money">{{ (list.salePrice / 100).toFixed(2) }}</span>
              </span>
              <span v-if="item.options.isShowGoodsPopularity && list.marketPrice" class="market">
                <span>¥</span>
                <span class="money">{{ (list.marketPrice / 100).toFixed(2) }}</span>
              </span>
            </div>
          </div>
        </el-col>
      </template>

      <template v-if="!item.options.dataSource.length">
        <el-col
          v-for="list in +sortType"
          :key="list"
          :span="lineClass[sortType]"
          :style="{'padding-top':`${gutter / 2}px`,'padding-bottom':`${gutter / 2}px` }"
        >
          <div
            class="course-content-content"
            :class="{
              'line1':sortType === '1',
              'line2':sortType === '2',
              'line3':sortType === '3',
              'line4':sortType === '4',
            }"
          >
            <div
              class="course-content-line default-line"
            >
              <img
                :src="defaultImgUrl"
                :class="sortType === '1' ? 'img1':'img2'"
              />
            </div>
            <div
              v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
              class="course-content-text"
            >
              <span
                v-if="item.options.showNameType !== 0"
                class="title"
                :class="{
                  ellipsis:item.options.showNameType === 1,
                  ellipsis2:item.options.showNameType === 2,
                }"
              >此处显示课程名称，超出该行显示…</span>
              <span
                v-if="item.options.showIntroductionType !== 0"
                :class="{
                  ellipsis:item.options.showIntroductionType === 1,
                  ellipsis2:item.options.showIntroductionType === 2,
                }"
                class="tips"
              >
                此处显示课程简介，超出该行显示…
              </span>
            </div>
            <div class="sale ellipsis">
              <span v-if="item.options.isShowGoodsScore" class="price">
                <span>¥</span>
                <span class="money">0</span>
              </span>
              <span v-if="item.options.isShowGoodsPopularity" class="market">
                <span>¥</span>
                <span class="money">0</span>
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
              class="course-content-content line5"
              style="flex-shrink: 0"
            >
              <div
                class="course-content-line line"
              >
                <img :src="defaultImgUrl" class="img2" />
              </div>
              <div
                v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
                class="course-content-text"
              >
                <span
                  v-if="item.options.showNameType !== 0"
                  class="title"
                  :class="{
                    ellipsis:item.options.showNameType === 1,
                    ellipsis2:item.options.showNameType === 2,
                  }"
                >此处显示课程名称，超出该行显示…</span>
                <span
                  v-if="item.options.showIntroductionType !== 0"
                  :class="{
                    ellipsis:item.options.showIntroductionType === 1,
                    ellipsis2:item.options.showIntroductionType === 2,
                  }"
                  class="tips"
                >
                  此处显示课程简介，超出该行显示…
                </span>
              </div>
              <div class="sale ellipsis">
                <span v-if="item.options.isShowGoodsScore" class="price">
                  <span>¥</span>
                  <span class="money">0</span>
                </span>
                <span v-if="item.options.isShowGoodsPopularity" class="market">
                  <span>¥</span>
                  <span class="money">0</span>
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <template v-for="(list,index) in item.options.dataSource">
              <div
                v-if="showItem(list)"
                :key="index"
                :style="`margin-right:${index !== 8? gutter:0}px`"
                class="course-content-content line5"
                style="flex-shrink: 0"
              >

                <img :src="list.coverVerticalUrl" class="line" />
                <div
                  v-if="item.options.showNameType !== 0 || item.options.showIntroductionType !== 0"
                  class="course-content-text"
                >
                  <span
                    v-if="item.options.showNameType !== 0"
                    class="title"
                    :class="{
                      ellipsis:item.options.showNameType === 1,
                      ellipsis2:item.options.showNameType === 2,
                    }"
                  >{{ list.contentName }}</span>
                  <span
                    v-if="item.options.showIntroductionType !== 0"
                    :class="{
                      ellipsis:item.options.showIntroductionType === 1,
                      ellipsis2:item.options.showIntroductionType === 2,
                    }"
                    class="tips"
                  >
                    {{ list.columnContent }}
                  </span>
                </div>
                <div class="sale ellipsis">
                  <span v-if="item.options.isShowGoodsScore && list.salePrice" class="price">
                    <span>¥</span>
                    <span class="money">{{ (list.salePrice / 100).toFixed(2) }}</span>
                  </span>
                  <span v-if="item.options.isShowGoodsPopularity && list.marketPrice" class="market">
                    <span>¥</span>
                    <span class="money">{{ (list.marketPrice / 100).toFixed(2) }}</span>
                  </span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </vueCustomScrollbar>
    </template>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import tab from 'vant/lib/tab'
import tabs from 'vant/lib/tabs'
import 'vant/lib/tabs/style'
import 'vant/lib/tab/style'
export default {
  name: 'CourseComponents',
  components: {
    vueCustomScrollbar,
    vanTab: tab,
    vanTabs: tabs
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
      },
      defaultTabs: ['默认课程组', '默认课程组1'],
      active: '',
      realActive: ''
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
    tabsKey() {
      return this.item?.options?.tabsKey ?? []
    },
    defaultImgUrl() {
      const defaultUrl = require('../../assets/images/page_image_bg.png')
      const defaultUrl2 = require('../../assets/images/page_image_bg2.png')
      return this.sortType === '1' ? defaultUrl : defaultUrl2
    }
  },
  methods: {
    showItem(list) {
      const item =
        this.tabsKey[this.realActive] &&
        this.tabsKey[this.realActive].key
      return (
        list.tabsKey === item || !this.item?.options?.isShowCourseGroupName
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.course-container ::v-deep{
  overflow: hidden;
  .van-tabs__nav{
    background-color: transparent;
  }
  .van-tabs {
    margin-left: -12px;
  }
  .van-tab{
    font-size: 16px;
  }
  .course-content{
    img{
      height: 148px;
      width: 100%;
    }
  }
  .van-tab--active{
    font-weight: 600;
  }
  .course-content-content{
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
  .course-content-line{
    background: #F5F7FA;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .course-content-text{
    display: flex;
    flex-direction: column;
    color: #333333;
    .tips{
      color: #666666;
    }
  }
  .sale{
    line-height: 20px;
    .price{
      font-weight: 500;
      color: #FF3333;
      font-size: 12px;
      line-height: 17px;
      .money{
        font-size: 18px;
      }
    }
    .market{
      color: #999999;
      font-size: 14px;
      line-height: 14px;
      margin-left: 5px;
      text-decoration: line-through;
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
  .title{
    margin-bottom: 8px;
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
    .course-content-text{
      margin:10px 10px 5px 10px;
    }
    .sale{
      margin:0 10px 15px;
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
    .course-content-text{
      margin:10px;
    }
    .sale{
      margin:0 10px 10px;
    }
    .title{
      font-size: 14px;
    }
    .tips{
      font-size: 12px;
    }
  }
  .line3{
    .default-line{
      height: 109px;
    }
    .course-content-text{
      margin:8px;
    }
    .sale{
      margin:0 8px 8px;
    }
    .money{
      font-size: 16px !important;
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
    .course-content-text{
      margin:4px;
    }
    .sale{
      margin:0 4px 4px;
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
    .course-content-text{
      margin:4px;
    }
    .money{
      font-size: 14px !important;
    }
    .title{
      font-size: 14px;
    }
    .sale{
      margin:0 4px 4px;
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
