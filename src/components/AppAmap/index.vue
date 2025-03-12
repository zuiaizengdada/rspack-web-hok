<template>
  <div style="width: 100%; height: 500px">
    <div class="fl map_box">
      <div id="mapChart" />
      <div class="map_search">
        <el-input id="input_id" v-model.trim="search" />
      </div>
      <div class="tableView">
        <div v-for="(item, index) in markerArr" :key="item.adress" class="fl table_view">
          <div class="table_body">
            <div class="adress" :title="item.address">{{ item.address }}</div>
            <div class="m-t-10">{{ item.cityName }}</div>
            <div>
              <span class="m-r-10">经度: {{ item.lat }}</span>
              <span>纬度: {{ item.lon }}</span>
            </div>
          </div>
          <div class="del" @click="del(item, index)">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
export default {
  props: {
    markerArr: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      map: null
      // markerArr: [] // 选择的点标记
    }
  },
  watch: {
    markerArr: {
      handler(val) {
        if (val.length > 0) {
          this.loading = true
          this.map.clearMap()
          this.markerArr && this.markerArr.map(v => {
            const marker = new AMap.Marker({
              offset: new AMap.Pixel(-20, -20),
              position: [v.lon, v.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
              icon: require('../../assets/image/mark.png')
            })
            this.map.add(marker)
          })
          this.loading = false
        }
      }
    }
  },
  mounted() {
    this.initmapFn()
  },
  methods: {
    initmapFn() {
      this.loading = true
      var _this = this
      // 创建地图，同时给地图设置中心点、级别、显示模式、自定义样式等属性
      this.map = new AMap.Map('mapChart', {
        resizeEnable: true,
        zoom: 12
      })

      // 插件依旧写在回调函数内,通过AMap.plugin方法按需引入插件，第一个参数是插件名,第二个是在plugin回调之后使用插件功能。
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.Autocomplete'], function() {
        _this.map.addControl(new AMap.ToolBar())
        _this.map.addControl(new AMap.Scale())
        _this.map.addControl(new AMap.OverView({ isOpen: true }))
      })
      AMap.plugin('AMap.Geocoder', function() {
        var geocoder = new AMap.Geocoder()
        _this.map.on('click', function(ev) {
          console.log('点击触发', ev)
          const lnglat = [ev.lnglat.lng, ev.lnglat.lat]
          geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              // result为对应的地理位置详细信息
              var marker = new AMap.Marker({
                offset: new AMap.Pixel(-20, -20),
                position: lnglat, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                icon: require('../../assets/image/mark.png')
              })
              _this.markerArr.push({
                address: result.regeocode.formattedAddress,
                cityCode: result.regeocode.addressComponent.adcode,
                cityName: result.regeocode.addressComponent.city || result.regeocode.addressComponent.province,
                lat: ev.lnglat.lat,
                lon: ev.lnglat.lng
              })
              _this.map.add(marker)
            }
          })
        })
      })
      _this.map.clearMap()// 清除所有的覆盖物信息

      AMap.plugin('AMap.Autocomplete', function() {
        // 实例化Autocomplete
        var autoOptions = {
          // input 为绑定输入提示功能的input的DOM ID
          input: 'input_id'
        }
        var autoComplete = new AMap.Autocomplete(autoOptions)
        AMap.service('AMap.PlaceSearch', function () {
          // var placeSearch = new AMap.PlaceSearch({
          //   // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          //   city: '010'
          // })
          var placeSearch = new AMap.PlaceSearch({
            map: _this.map
          }) // 构造地点查询类
          AMap.event.addListener(autoComplete, 'select', select)// 注册监听，当选中某条记录时会触发
          function select(e) {
            placeSearch.setCity(e.poi.adcode)
            placeSearch.search(e.poi.name) // 关键字查询查询
          }
        })
      })

      this.markerArr && this.markerArr.map(v => {
        const marker = new AMap.Marker({
          offset: new AMap.Pixel(-20, -20),
          position: [v.lon, v.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          icon: require('../../assets/image/mark.png')
        })
        this.map.add(marker)
      })
      this.loading = false
    },
    successFn() {},
    close() {
      this.$emit('input', false)
    },
    succese() {
      this.$emit('success')
    },
    del(item, index) {
      // console.log(item)
      this.loading = true
      this.markerArr.splice(index, 1)
      this.map.clearMap()
      this.markerArr && this.markerArr.map(v => {
        const marker = new AMap.Marker({
          offset: new AMap.Pixel(-20, -20),
          position: [v.lon, v.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          icon: require('../../assets/image/mark.png')
        })
        this.map.add(marker)
      })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
#mapChart{
  height: 100%;
  flex: 1
}
.tableView {
    width: 400px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
    .table_view {
      width: 100%;
      min-width: 400px;
      border-bottom: 1px solid #eee;
      .table_body {
          padding: 10px 20px;
          flex: 1;
          .adress {
              font-weight: bold;
              font-size: 16px;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
          }
      }
      .del {
        border-left: 1px solid #eee;
        width: 60px;
        color: red;
        line-height: 69px;
        text-align: center;
        cursor: pointer;
      }
    }
}
.map_box {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
  .map_search {
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: .25rem;
    position: absolute;
    top: 1rem;
    background-color: white;
    width: auto;
    min-width: 22rem;
    border-width: 0;
    right: 420px;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }
}
</style>
