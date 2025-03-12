<template>
  <div class="page_wrap">
    <div class="header_tab">
      <div v-for="(item) in mobilePage" :key="item.id" :class="{'active': current == item.id}" @click="changeCurrent(item.id)">
        {{ item.name }}
      </div>
    </div>

    <div class="page_wrap_content">
      <div class="main-content">
        <div class="shop-home-page">
          <div class="mobile_wrap">
            <div class="mobile_wrap_header" />

            <div v-if="!loading" class="mobile_wrap_content">
              <div class="content_image" :style="mobilePage[current].styleObject">
                <div
                  v-for="item in mobilePage[current].children"
                  :key="item.id"
                  :class="{
                    banner1: item.canSelect,
                    tips: item.canSelect,
                    active: (item.id === typeId && item.canSelect)
                  }"
                  :style="item.styleObject"
                  @click="item.canSelect && domClick(item.id, item)"
                >
                  <span v-if="item.canSelect">
                    <i class="el-icon-plus" />点击设置
                  </span>
                </div>
              </div>
            </div>

            <div class="mobile_wrap_footer" />
          </div>

          <bannerTable :row="row" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import bannerTable from './banner/index.vue'
export default {
  name: 'Banner',
  components: {
    bannerTable
  },
  data() {
    return {
      loading: false,
      current: '0', // 控制顶部的tab
      typeId: '02', // (1.首页顶部，2.首页中部，3.线上课程，4.线下课程)
      mobilePage: [
        {
          id: '0',
          name: '线上课程',
          styleObject: {
            backgroundImage: `url(${require('../../assets/image/banner.png')})`,
            height: '2250px'
          },
          children: [
            {
              id: '01',
              name: '未知模块',
              styleObject: {
                height: '144px'
              }
            },
            {
              id: '02',
              name: '线上课程顶部',
              canSelect: true,
              styleObject: {
                width: '344px',
                height: '149px'
              },
              data: {
                type: '1',
                title: '首页/线上课程/顶部轮播图',
                width: 343,
                height: 148
              }
            },
            {
              id: '03',
              name: '未知模块',
              styleObject: {
                height: '1305px'
              }
            },
            {
              id: '04',
              name: '线上课程中部',
              canSelect: true,
              styleObject: {
                width: '344px',
                height: '149px'
              },
              data: {
                type: '2',
                title: '首页/线上课程/中部轮播图',
                width: 343,
                height: 148
              }
            }
          ]
        },
        {
          id: '1',
          name: '线下课程',
          styleObject: {
            backgroundImage: `url(${require('../../assets/image/banner2.png')})`,
            height: '2259px'
          },
          children: [
            {
              id: '11',
              name: '未知模块',
              styleObject: {
                height: '144px'
              }
            },
            {
              id: '12',
              name: '线下课程顶部',
              canSelect: true,
              styleObject: {
                width: '344px',
                height: '149px'
              },
              data: {
                type: 3,
                title: '首页/线下课程/顶部轮播图',
                width: 343,
                height: 148
              }
            }
          ]
        },
        {
          id: '2',
          name: '导师专区',
          styleObject: {
            backgroundImage: `url(${require('../../assets/image/banner3.png')})`,
            height: '812px'
          },
          children: [
            {
              id: '21',
              name: '未知模块',
              styleObject: {
                height: '144px'
              }
            },
            {
              id: '22',
              name: '导师专区顶部',
              canSelect: true,
              styleObject: {
                width: '344px',
                height: '149px'
              },
              data: {
                type: 5,
                title: '首页/导师专区/顶部轮播图',
                width: 343,
                height: 148
              }
            }
          ]
        }
      ],
      row: {
        type: '1',
        title: '首页/线上课程/顶部轮播图',
        width: 343,
        height: 148
      }
    }
  },
  methods: {
    domClick(i, row) {
      this.typeId = i
      console.log(row)
      this.row = row.data
    },
    changeCurrent(id) {
      this.loading = true
      this.current = id
      this.$nextTick(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.h_100p {
  height: 100%!important;
  overflow: auto;
}
.page_wrap {
    height: 100%;
    min-width: 1200px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .header_tab {
        display: flex;
        height: 50px;
        background-color: #fafbfc;
        border-bottom: 1px solid #f2f2f2;
        padding: 0 10px;
        > div {
            height: 50px;
            line-height: 50px;
            margin: 0;
            padding: 0;
            color: #353535;
            font-size: 14px;
            font-family: 'Microsoft YaHei';
            display: block;
            margin: 0 10px;
            cursor: pointer;
        }
        .active {
            color: #2a75ed;
            border-bottom: 2px solid #2a75ed;
        }
    }
    .page_wrap_content {
      height: calc(100% - 50px);

      .main-content {
        width: 100%;
        position: relative;
        padding: 20px;
        .shop-home-page {
            width: 100%;
            // background: pink;
            height: 833px;
            overflow: auto;
            display: flex;
            .mobile_wrap {
                width: 383px;
                min-width: 375px;
                height: 833px;
                background: #fff;
                border: 4px solid #000;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
                > .mobile_wrap_header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 44px;
                    background-image: url(~@/assets/image/banner.png);
                    background-size: 375px auto;
                    background-repeat: no-repeat;
                    background-position: 0 0;
                    z-index: 2;
                }
                > .mobile_wrap_content {
                    height: 100%;
                    overflow: auto;
                    width: 100%;
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    .content_image {
                        width: 100%;
                        background-size: 375px auto;
                        background-repeat: no-repeat;
                        background-position: 0 0;
                        > .tips {
                            position: relative;
                            background: pink;
                            margin: auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.4);
                            line-height: 20px;
                            &:hover {
                                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                            }

                        }
                        > .active {
                            // border: 2px solid #4390df;
                            &:before{
                                position: absolute;
                                display: block;
                                border-top: 28px solid #4390df;
                                border-left: 28px solid transparent;
                                right: 0;
                                top: 0;
                                content: "";
                                z-index: 1;
                            }
                            &:after{
                                position: absolute;
                                display: block;
                                content: "√";
                                top: 0;
                                right: 0;
                                font-family: Glyphicons Halflings;
                                font-size: 10pt;
                                font-weight: normal;
                                z-index: 1;
                                color: #fff;
                            }
                        }
                    }
                }
                > .mobile_wrap_footer {
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 82px;
                    background-image: url(~@/assets/image/banner.png);
                    background-size: 375px auto;
                    background-repeat: no-repeat;
                    background-position: 0% 100%;
                    z-index: 2;
                }
            }
        }
      }
    }
}
</style>
