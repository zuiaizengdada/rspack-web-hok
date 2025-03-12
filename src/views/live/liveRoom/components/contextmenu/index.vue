<template>
  <div v-show="visible" ref="contextmenu" :style="{left:left+'px',top:getTop(top)}" class="contextmenu">
    <div v-for="(item,index) in tools" :key="index" class="contextmenuTool">
      <div v-for="(el, i) in item" :key="i" class="contextmenuLi">
        <div v-if="el === '标记颜色'" class="mark">
          <div>标记颜色</div>
          <div class="markBox">
            <div v-for="(c, ci) in markColor" :key="ci" class="markLi" :style="{background: c.color}" @click="colorClick(el, c)">
              <i v-if="markType === c.value" class="el-icon-check" />
            </div>
          </div>
        </div>
        <li v-else @click="onhandleClick(el)">
          <template v-if="typeof el === 'string'">{{ el }}</template>
          <div v-else class="iconMenuText">
            <svg-icon :icon-class="el.icon" class-name="icon" />
            <span class="iconText"> {{ el.text }}</span>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { markColor } from '../../../columns'
export default {
  components: {},
  data() {
    return {
      markColor,
      visible: false,
      left: 0,
      top: 0,
      markHeight: 310,
      tools: [['私聊Ta', '修改备注'], ['禁言', '拉黑并踢出', '自嗨'], ['标记颜色']],
      onClickFn: () => {},
      markType: 0
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {},
  methods: {
    closeMenu() {
      this.visible = false
    },
    onhandleClick(el) {
      this.onClickFn(el)
    },
    colorClick(el, item) {
      this.onClickFn(el, item)
    },
    getTop(top) {
      const windHeight = document.body.clientHeight
      const markHeight = this.markHeight
      if (Number(markHeight + top) >= windHeight) {
        return Number(top - markHeight) + 'px'
      } else {
        return top + 'px'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 10px;
  // font-size: 12px;
  // font-weight: 400;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  width: 158px;
  box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
  border-radius: 6px;
  .contextmenuLi {
    .mark {
      padding: 6px 10px;
      .markBox {
        display: flex;
        padding-top: 12px;
        .markLi {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          &:hover {
            transform: scale(1.4);
          }
          .icon-select {
            color: red;
            font-size: 14px;
            z-index: 2;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
        .markLi + .markLi {
          margin-left: 12px;
        }
        .el-icon-check {
          color: #fff;
          position: absolute;
          top: 0;
          left: 0;
          width: 14px;
          height: 14px;
        }
      }
    }
    .iconMenuText {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background: #F5F5F5;
        border-radius: 4px;
      }
      .icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
      }
      .iconText {
        margin-left: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
      }
    }
  }
}
.contextmenu li {
  margin: 0;
  padding: 6px 10px;
  cursor: pointer;
}
.contextmenuLi + .contextmenuLi {
  margin-top: 10px;
}
.contextmenuTool + .contextmenuTool{
  border-top: 1px solid #F5F5F5;
  margin-top: 10px;
  padding-top: 10px;
}
.contextmenu li:hover {
  background: #F5F5F5;
  border-radius: 4px;
}
</style>
