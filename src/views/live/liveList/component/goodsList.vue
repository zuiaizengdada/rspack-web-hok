<template>
  <div ref="resourceItemWrapperBox" class="resource-item-wrapper-box">
    <div v-for="(item) in data" :key="item.goodsId" class="packageCoure-check-view-group" :label="item.goodsId">
      <div class="packageCoure-item-wrapper-box-group">
        <div class="packageCoure-item-wrapper">
          <ImagePreviewer class="image-previewer" :src="item.coverVerticalUrl" alt="" fit="contain" />
          <div class="packageCoure-item-info">
            <div class="item-name">{{ item.contentName }}</div>
            <span v-if="isPlaform" style="color: #000">{{ item.tenantVO.tenantName + ' ' }}</span>
            <div style="display: flex">
              <div v-if="item.saleType === 0" class="item-price m-r-10">免费</div>
              <div v-if="item.saleType === 2" class="item-price m-r-10">加密</div>
              <div v-if="item.saleType === 1" class="item-price m-r-10">￥{{ item.salePrice | filtersMoney }}</div>
            </div>
          </div>
        </div>
        <div v-if="item.children" class="packageCoure-item-wrapper-left" @click.stop="onhandleOpen(item)">
          <div class="btn-left">{{ item.childrenOpen ? '收起' : '展开' }}<i :class="item.childrenOpen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" /></div>
        </div>
      </div>

      <div v-if="item.childrenOpen" class="packageCoure-item-children">
        <div v-for="(c) in item.children" :key="c._goodsId" class="packageCoure-item-wrapper-box-group" style="padding: 13px 0px 0px 13px;">
          <div class="packageCoure-item-wrapper">
            <ImagePreviewer class="image-previewer" :src="c.coverVerticalUrl" alt="" fit="contain" />
            <div class="packageCoure-item-info">
              <div class="item-chidren-name">
                <span class="item-name">{{ c.contentName }}</span>
                <span v-if="(c.goodsType === 3 || c.goodsType === 4) && c.productCategory === 0" style="margin-left: 15px" class="item-chidren-type">录播课</span>
                <span v-if="(c.goodsType === 3 || c.goodsType === 4) && c.productCategory === 2" style="margin-left: 15px" class="item-chidren-type item-chidren-type-offline">线下课</span>
                <span v-if="(c.goodsType === 3 || c.goodsType === 4) && c.productCategory === 1" style="margin-left: 15px" class="item-chidren-type item-chidren-type-live">直播课</span>
              </div>
              <span v-if="isPlaform" style="color: #000">{{ c.tenantVO.tenantName + ' ' }}</span>
              <div style="display: flex">
                <div v-if="c.saleType === 0" class="item-price m-r-10">免费</div>
                <div v-if="c.saleType === 2" class="item-price m-r-10">加密</div>
                <div v-if="c.saleType === 1" class="item-price m-r-10">￥{{ c.salePrice | filtersMoney }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isPlaform: false
    }
  },
  mounted() {},
  methods: {
    onhandleOpen(item) {
      item.childrenOpen = !item.childrenOpen
    }
  }
}
</script>

<style lang='scss' scoped>
.resource-item-wrapper-box {
  margin-top: 23px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: auto;
  max-height: 303px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #E4E4E4;
  .packageCoure-check-view-group {
    width: 100%;
    padding: 15px 0;
    min-height: 72px;
    .packageCoure-item-wrapper-box-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 418px;
      .packageCoure-item-wrapper {
        display: flex;
        flex: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
        cursor: pointer;
        line-height: 1;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        > img {
          width: 37px;
          height: 37px;
          border-radius: 2px;
          margin-right: 10px;
          border: 0;
          vertical-align: middle;
        }
        > .image-previewer {
          width: 37px;
          height: 37px;
          border-radius: 2px;
          margin-right: 10px;
          border: 0;
          vertical-align: middle;
          background: rgb(245, 247, 250);
        }
        .packageCoure-item-info {
          // max-width: 550px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 37px;
          .item-name {
            // max-width: 480px;
            height: 20px;
            line-height: 20px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            font-size: 14px;
          }
          .item-price {
            height: 24px;
            line-height: 24px;
            display: inline-block;
            color: #fb6161;
          }
          .item-chidren-name {
            display: flex;
            align-items: center;
            .item-name {
              margin-bottom: 0;
              max-width: 300px;
            }
            .item-chidren-type {
              height: 16px;
              line-height: 16px;
              font-size: 12px;
              padding: 0 7px;
              border-radius: 12px;
              background: #F7E7E6;
              color: #A13A00;
            }
            .item-chidren-type-live {
              background: #E6F7EA;
              color: #00B42A;
            }
            .item-chidren-type-offline {
              background: #FFE7D0;
              color: #8B3A00;
            }
          }
        }
      }
      > .packageCoure-item-wrapper-left {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-left: 10px;
        width: 68px;
        height: 24px;
        flex-shrink: 0;
        border-radius: 4px;
        border: 1px solid #DCDFE5;
        background: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .btn-left {
          color: #0c6fff;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 14px;
        }
      }
    }
    .packageCoure-item-children {
      max-height: 413px;
      overflow: auto;
    }
  }
  .packageCoure-check-view-group + .packageCoure-check-view-group {
    border-top: 1px solid #eeeeee;
  }
}
</style>
