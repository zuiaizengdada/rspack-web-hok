<template>
  <div class="course-select-container">
    <div class="course-select-content">
      <el-tabs v-model="active" stretch>
        <el-tab-pane
          v-for="item in tabsKey"
          :key="item.key"
          :label="item.value"
          :name="item.key"
        />
      </el-tabs>
      <div v-if="dataSource.length" class="course-box">
        <draggable
          :list="dataSource"
          tag="div"
          draggable=".course-items"
          v-bind="{
            animation:500 ,
            handle:'.course-icon',
          }"
          :move="handleMove"
        >
          <template v-for="(item, index) in dataSource">
            <div
              v-show="item.tabsKey === active"
              :key="index"
              :class="{'m-b-12':index !== items.length - 1}"
              class="flex flex-middle course-items"
            >
              <svg-icon
                icon-class="icon_draggable"
                class="course-icon"
              />
              <ImagePreviewer
                class="course-image"
                :src="item.coverVerticalUrl"
                fit="contain"
                :preview-src-list="[item.coverVerticalUrl]"
              />
              <div class="flex-1 flex flex-column" style="height:80px">
                <div class="title ellipsis">
                  <el-tag
                    v-if="item.status"
                    type="danger"
                    size="mini"
                    :color="statusList[item.status].color"
                    :style="{color:statusList[item.status].textColor}"
                  >
                    {{ statusList[item.status].label }}
                  </el-tag>
                  {{ item.contentName }}
                </div>
                <div class="tips ellipsis2">{{ item.columnContent }}</div>
                <div class="sale">
                  <span class="price">
                    <span>¥</span>
                    <span class="money">{{ (item.salePrice / 100).toFixed(2) }}</span>
                  </span>
                  <span class="market">
                    <span>¥</span>
                    <span class="money">{{ (item.marketPrice / 100).toFixed(2) }}</span>
                  </span>
                </div>
              </div>
              <svg-icon
                icon-class="icon_delete"
                class="icon_delete"
                @click="handleDel(item.value)"
              />
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <div
      class="course-content-btn"
      :class="{disabled:items.length >= max}"
      @click="selectGoods"
    >
      <i class="el-icon-plus" style="font-weight: 600;" />
      <span>{{ `选择课程(${items.length}/${max})` }}</span>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { specialGetGoods } from '@/api/messageManagement/special'
export default {
  components: {
    draggable
  },
  props: {
    max: {
      type: Number,
      default: 3
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    tabsKey: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: '',
      statusList: {
        1: {
          label: '已隐藏',
          color: '#F2E6FF',
          textColor: '#FF351E'
        },
        2: {
          label: '已下架',
          color: '#F5F5F5',
          textColor: '#777777'
        },
        3: {
          label: '无库存',
          color: '#FFF2E6',
          textColor: '#FF7D00'
        },
        4: {
          label: '已删除',
          color: '#FFE6E6',
          textColor: '#8F00FF'
        }
      }
    }
  },
  computed: {
    items() {
      return this.dataSource?.filter(i => i.tabsKey === this.active) ?? []
    },
    sourceItems: {
      get() {
        return this.dataSource
      },
      set(val) {
        this.$emit('update:dataSource', val)
      }
    }
  },
  methods: {
    handleMove() {
      return true
    },
    handleDel(value) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          const dataSource = JSON.parse(JSON.stringify(this.dataSource))
          const index = dataSource.findIndex(i => i.tabsKey === this.active && i.value === value)
          if (index !== -1) {
            dataSource.splice(index, 1)
          }
          this.$emit('update:dataSource', dataSource)
        }
      })
    },
    selectGoods() {
      if (this.items.length >= this.max) {
        return
      }
      this.$SelectGoods({
        visible: true,
        multiple: false,
        currentId: '3',
        disabledFn: (res) => {
          const ids = this.dataSource.filter(i => i.tabsKey === this.active).map(i => i.goodsId)
          if (res.onlineList && res.goodsType === 5 && res.onlineList && res.onlineList.length > 0) {
            const sum = res.onlineList.reduce((pre, next) => {
              return pre + (next.availableNum ? Number(next.availableNum) : 0)
            }, 0)
            return sum <= 0
          } else if (ids.includes(res.goodsId)) {
            return true
          } else {
            return false
          }
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        success: (res) => {
          if (res.length > 0) {
            this.setDataSource(res)
          }
        }
      })
    },
    async setDataSource(res) {
      const goodsId = res[0].goodsId
      const { data } = await specialGetGoods({ goodsId })
      const item = data[0]
      this.$emit('update:dataSource', [
        ...this.dataSource,
        {
          ...item,
          tabsKey: this.active,
          value: item.goodsId
        }
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.course-select-container ::v-deep{
  .el-tabs__nav{
    .el-tabs__item{
      width: 130px;
      text-align: center;
    }
  }
  .el-tabs__nav-next, .el-tabs__nav-prev{
    font-size: 16px;
  }
  .el-tabs__item{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .course-select-content{
    border-radius: 4px;
    border: 1px solid #E6E6E6;
    margin-bottom: 15px;
  }
  .el-tabs__header{
    margin:0px;
  }
  .el-tabs__nav-wrap{
    border-bottom: 1px solid #E6E6E6;
    &::after{
      height: 0px;
    }
  }
  .course-content-btn{
    height: 40px;
    background: #F5F9FF;
    border-radius: 4px;
    border: 1px dashed #66A4FF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0C6FFF;
    font-size: 14px;
    cursor: pointer;
    &.disabled{
      background: #EBEBEB;
      color: #999999;
      border: 0px;
      cursor: not-allowed;
    }
  }
  .course-items{
    background: #FFFFFF;
    border-radius: 2px;
    padding: 10px;
  }
  .course-box{
    background: #F5F5F5;
    border-radius: 4px;
    padding: 12px;
  }
  .course-icon{
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right:10px;
    color: #999999;
    cursor: move;
    &:hover{
        color: #2980FF ;
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
  .course-image{
    width: 94px;
    height: 94px;
    margin-right:10px;
    border-radius: 4px;
  }
  .m-b-12{
    margin-bottom: 12px;
  }
  .title{
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    line-height: 22px;
    width: 280px;
  }
  .tips{
    font-weight: 400;
    color: #666666;
    font-size: 14px;
    line-height: 20px;
    flex: 1;
    width: 280px;
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
}
</style>
