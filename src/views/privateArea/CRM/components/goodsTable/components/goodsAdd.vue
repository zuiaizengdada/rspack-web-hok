<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="900px"
    height="640px"
    @success="successFn"
  >
    <div v-loading="loading" class="choose_resource">
      <div class="window-search">
        <el-input v-model.trim="search" class="m-r-10" style="width: 240px" placeholder="请输入内容" prefix-icon="el-icon-search" clearable />
        <el-button @click="searchFn">搜索</el-button>
      </div>
      <div class="window-tab">
        <div class="tab-wrapper">
          <div
            v-for="(item) in tabList"
            :key="item.id"
            class="tab-item"
            :class="{ 'tab-active': item.id === currentId }"
            @click="changTab(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="window-list">
        <div class="resource-item-wrapper">
          <el-checkbox-group v-model="checkList" v-infinite-scroll="getList" infinite-scroll-disabled="disabled">
            <el-checkbox
              v-for="(item, index) in tableData"
              :key="item.goodsId"
              :label="item.goodsId"
              :disabled="check.includes(item.goodsId)"
              @change="(res) => checkChange(res, item, index)"
            >
              <div class="item-wrapper">
                <ImagePreviewer class="image-previewer" :src="item.coverUrl" alt="" />
                <div class="item-info">
                  <div class="item-name">{{ item.contentName }}</div>
                  <div v-if="item.saleType === 0" class="item-price">免费</div>
                  <div v-if="item.saleType === 2" class="item-price">加密</div>
                  <div v-if="item.saleType === 1" class="item-price">￥{{ item.salePrice | filtersMoney }}</div>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  getGoodsList
} from '@/api/course'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    check: {
      type: Array,
      default: () => {
        return []
      }
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      tabList: [
        { id: '4', name: '大专栏', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '2', name: '视频', api: '' },
        { id: '1', name: '音频', api: '' },
        { id: '0', name: '图文', api: '' }
      ],
      currentId: '4',
      checkList: [], // 记录id
      checkListInfo: [], // 记录对象
      current: 1,
      size: 10,
      total: 0,
      tableData: [],
      noMore: false
    }
  },
  computed: {
    // noMore() {
    //   return this.tableData.length >= this.total
    // },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init(currentId) {
      this.currentId = '4'
      this.current = 1
      this.checkList = []
      this.tableData = []
      this.checkListInfo = []
      this.search = ''
      this.getList()
    },
    changTab(row) {
      this.search = ''
      this.currentId = row.id
      this.tableData = []
      this.current = 1
      this.total = 0
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.current,
        size: this.size,
        contentName: this.search,
        goodsType: this.currentId
      }
      getGoodsList(params).then(res => {
        this.tableData = this.tableData.concat(res.data.records)
        this.total = res.data.total
        this.noMore = this.tableData.length >= this.total
        this.current = this.current + 1
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    successFn() {
      // console.log(this.checkList, this.checkListInfo)
      this.success(this.checkListInfo)
      this.visible = false
    },
    checkChange(res, item, index) {
      if (res) {
        // 添加
        this.checkListInfo.push(item)
      } else {
        // 删除
        const i = this.checkListInfo.findIndex(v => v.goodsId === item.goodsId)
        this.checkListInfo.splice(i, 1)
      }
    },
    // 点击搜索
    searchFn() {
      this.current = 1
      this.tableData = []
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .choose_resource {
    .window-search {
      position: relative;
      height: 36px;
      line-height: 36px;
      margin: 20px 20px 10px 20px;
    }
    .window-tab {
      margin: 0 20px;
      .tab-wrapper {
        display: flex;
        width: 100%;
        height: inherit;
        border-bottom: 1px solid #eeeeee;
        .tab-item {
          width: 70px;
          height: 100%;
          line-height: 40px;
          position: relative;
          bottom: -1px;
          text-align: center;
          cursor: pointer;
        }
        .tab-active {
          border-bottom: 2px solid #2a75ed;
          color: #2a75ed;
        }
      }
    }
    .window-list{
      width: 100%;
      height: 376px;
      overflow-y: scroll;
      padding: 0 20px;
      position: relative;

      &::-webkit-scrollbar {
          width: 8px;
          height: 10px;
          background-color: rgba(0,0,0,0);
      }

      &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0,0,0,.2);
          transition: all .4s ease;
          -moz-transition: all .4s ease;
          -webkit-transition: all .4s ease;
          -o-transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
          background-color: rgba(0,0,0,.1);
      }
      ::v-deep {
        .resource-item-wrapper {
          width: 100%;
          padding: 15px 0;
          min-height: 72px;
          display: -webkit-flex;
          display: flex;
          -webkit-align-items: center;
          -moz-align-items: center;
          -ms-align-items: center;
          -o-align-items: center;
          align-items: center;
          .el-checkbox-group {
            width: 100%;
            .el-checkbox {
              width: 100%;
              display: flex;
              align-items: center;
              padding: 15px 0;
              min-height: 72px;
              border-bottom: 1px solid #EEEEEE;
              .item-wrapper {
                display: flex;
                flex: 1;
                display: flex;
                align-items: center;
                cursor: pointer;
                line-height: 1;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                > image-previewer {
                  width: 80px;
                  height: 60px;
                  border-radius: 2px;
                  margin-right: 10px;
                  border: 0;
                  vertical-align: middle;
                }
                .item-info {
                  max-width: 550px;
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  .item-name {
                    height: 20px;
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin-bottom: 6px;
                    color: #353535;
                  }
                  .item-price {
                    height: 22px;
                    line-height: 22px;
                    display: inline-block;
                    color: #fb6161;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
