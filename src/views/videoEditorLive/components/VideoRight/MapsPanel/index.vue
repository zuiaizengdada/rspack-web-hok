<template>
  <div class="maps-panel-container">
    <p class="title flex items-center">贴图设置</p>
    <div class="maps-panel-content">
      <!-- <div class="header flex justify-between items-center">
        <p>位置大小</p>
        <el-image />
      </div> -->
      <ul>
        <!-- <li class="flex items-center">
          <label>缩放</label>
          <div class="flex items-center">
            <el-slider v-model="scale" size="mini" style="width:240px;margin-right:10px" />
            <el-input :value="scale" size="mini" disabled />
          </div>
        </li>
        <li class="flex items-center">
          <label>坐标</label>
          <div class="flex">
            x:&nbsp;&nbsp;<el-input v-model="location.x" size="mini" style="margin-right:10px;" disabled />
            y:&nbsp;&nbsp;<el-input v-model="location.y" size="mini" disabled />
          </div>
        </li>
        <li class="flex items-center">
          <label>旋转</label>
          <div>
            <el-input v-model="rotate" size="mini" disabled />
          </div>
        </li> -->
        <li class="flex items-center">
          <label>颜色版</label>
          <div>
            <el-color-picker v-model="color" size="mini" style="margin-top:6px;" @change="handleChangeColor" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['video', 'updateRightTickerPanel'],
  props: {
    panel: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      color: '#fff',
      rotate: '',
      location: {
        x: '',
        y: ''
      },
      scale: 1
    }
  },
  watch: {
    panel(val) {
      if (val) {
        this.initPanelData(val.canvas)
      }
    }
  },
  mounted() {
    this.initPanelData(this.panel.canvas)
  },
  methods: {
    initPanelData(canvas) {
      // const { angle, fill, left, top, scaleX } = canvas
      const fill = canvas.fill
      this.color = fill
      // this.rotate = angle
      // this.location.x = left
      // this.location.y = top
      // this.scale = scaleX
    },
    handleChangeColor(val) {
      this.updateRightTickerPanel(val)
      const data = this.video.currentMoveMapsItemData
      data.color = val
      // data.panelColor = val
    }
  }
}
</script>
<style lang="scss" scoped>
.maps-panel-container{
    color:#DEDEDE;
    .title{
        height:40px;
        border-bottom: 1px solid #000;
        padding-left:16px;
    }
    .maps-panel-content{
        padding:12px 16px;
        .header{
            margin-bottom:16px;
            p{
                font-size:14px;
            }
        }
        ul{
            li{
                margin-bottom:20px;
                label{
                    width:46px;
                    flex:none;
                    font-size:14px;
                    font-weight: 300;
                    margin-right:10px;
                }
            }
        }
    }
}

 ::v-deep .el-input--mini .el-input__inner{
    width:80px;
    height:24px;
    line-height: 24px;
    padding:0 8px;
    background: none;
    border:1px solid #4D4D4D;
    color:#fff;
 }
</style>
