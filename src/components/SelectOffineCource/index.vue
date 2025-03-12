<template>
  <AppDialog v-model="visible" :loading="btnLoading" :title="title" width="900px" height="465px" top="10vh" @success="successFn">
    <div v-loading="loading" class="choose_resource">
      <div class="window-search">
        <TeacherSelect
          ref="teacherSelect"
          class="m-r-10"
          placeholder="请选择IP"
          :default-tearch-id="tearch.lecturerId"
          :value="tearch.lecturerName"
          @selected="teacherSelect"
        />
        <el-input
          v-model.trim="search"
          size="small"
          style="width: 240px"
          placeholder="请输入关键词"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchFn"
          @clear="searchFn"
        />
        <el-button size="small" class="m-l-10" @click="searchFn">搜索</el-button>
      </div>
      <div class="window-list">
        <div class="resource-item-wrapper">
          <div class="resource-item-wrapper-box" :class="{ noMultiple: !multiple }">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                v-for="(item, index) in tableData"
                :key="item.goodsId"
                :label="item.goodsId"
                :disabled="check.includes(item.goodsId) || disabledFn(item)"
                @change="(res) => checkChange(res, item, index)"
              >
                <div class="item-wrapper">
                  <ImagePreviewer class="image-previewer" :src="item.coverUrl" alt="" />
                  <div class="item-info">
                    <div class="item-name">{{ item.contentName }}</div>
                    <div v-if="item.saleType === 0" class="item-price">免费</div>
                    <div v-if="item.saleType === 2" class="item-price">加密</div>
                    <div v-if="item.saleType === 1" class="item-price">{{ salePrice(item) }}</div>
                    <div v-else class="item-price">{{ salePrice(item) }}</div>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialogFooter">
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="size"
          :current-page="current"
          @current-change="handleCurrentChange"
        />
      </div>
      <div>
        <el-button type="primary" @click="successFn()">确定</el-button>
        <el-button @click="close()">取消</el-button>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import { getGoodsList } from '@/api/course'
import { filtersMoney } from '@/filters/index'
export default {
  components: {
    AppDialog,
    TeacherSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    submitRequest: {
      type: Function,
      default: undefined
    },
    title: {
      type: String,
      default: '选择'
    },
    // 禁选项目
    check: {
      type: Array,
      default: () => {
        return []
      }
    },
    initSearch: {
      type: Object,
      default: undefined
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: true
    },
    // 选中项
    defaultValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      currentId: '5',
      loading: false,
      search: '',
      tearch: {
        lecturerId: '',
        lecturerName: ''
      },
      disabledFn: () => false,
      checkList: [], // 记录id
      checkListInfo: [], // 记录对象
      current: 1,
      size: 10,
      total: 0,
      tableData: [],
      btnLoading: false,
      noMore: false,
      form: {
        id: '',
        name: ''
      },
      classlist: [],
      treeLoading: false,
      onlineFlag: 1 // 是否线上(0线上，1线下)
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible: {
      handler(val) {
        console.log(val, 'val')
        if (val) {
          console.log('打开弹框')
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.current = 1
      this.checkList = this.defaultValue
      this.tableData = []
      this.checkListInfo = []
      this.search = ''
      this.tearch = {
        lecturerId: '',
        lecturerName: ''
      }
      this.getList()
    },
    salePrice(item) {
      return item?.onlineList?.map(i => '￥' + filtersMoney(i.salePrice)).join(',') || ''
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
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.tableData = []
      this.getList()
    },
    // 获取商品列表
    getGoodsList() {
      this.loading = true
      const onlineFlag = 1
      const params = {
        current: this.current,
        size: this.size,
        contentName: this.search,
        goodsType: this.currentId,
        lecturerId: this.tearch.lecturerId,
        onlineFlag,
        shelveFlag: 0,
        ...this.params
      }
      getGoodsList(params)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    async successFn() {
      console.log(this.submitRequest)
      if (this.submitRequest) {
        this.btnLoading = true
        const { code } = await this.submitRequest(this.checkList)
        this.btnLoading = false
        if (code !== 1) return
      }
      if (!this.checkListInfo.length) {
        this.success(this.checkListInfo, this.checkList)
        this.visible = false
        return
      }

      this.success(this.checkListInfo, this.checkList)
      this.visible = false
    },
    close() {
      this.visible = false
    },
    checkChange(res, item, index) {
      if (this.multiple) {
        // 多选
        if (res) {
          // 添加
          this.checkListInfo.push(item)
        } else {
          // 删除
          const i = this.checkListInfo.findIndex((v) => {
            return v.goodsId === item.goodsId
          })
          if (i !== -1) this.checkListInfo.splice(i, 1)
        }
      } else {
        // 单选
        this.checkListInfo = []
        this.checkList = []
        this.checkListInfo.push(item)
        this.checkList.push(item.goodsId)
      }
    },
    // 点击搜索
    searchFn() {
      this.current = 1
      this.tableData = []
      this.getList()
    },
    // 选择讲师触发回调事件
    teacherSelect(val) {
      this.tearch.lecturerId = val.lecturerId
      this.tearch.lecturerName = val.lecturerName
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
        padding: 0 20px;
        // width: 70px;
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
  .window-list {
    width: 100%;
    height: 376px;
    // overflow-y: scroll;
    // padding: 0 20px;
    box-sizing: border-box;
    position: relative;

    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    ::v-deep {
      .resource-item-wrapper {
        width: 100%;
        padding: 0 20px;
        min-height: 72px;
        display: -webkit-flex;
        display: flex;
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
        -o-align-items: center;
        align-items: center;
        .resource-item-wrapper-box {
          padding: 0 20px;
          height: 376px;
          width: 100%;
          box-sizing: border-box;
          overflow: auto;
        }
        .el-checkbox-group {
          width: 100%;
          .el-checkbox {
            width: 100%;
            display: flex;
            align-items: center;
            padding: 15px 0;
            min-height: 72px;
            border-bottom: 1px solid #eeeeee;
          }
        }

        > .ss-material-main-tree {
          width: 100%;
          display: flex;
          height: 376px;
          .ss-material-main-tree-left {
            width: 210px;
            border: 1px solid #ebebeb;
            margin-right: 10px;
          }
          .ss-material-main-tree-right {
            width: calc(100% - 200px);
            height: 376px;
            overflow: auto;
          }
        }
      }
    }
  }
}
.size-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: 20px;
}
img {
  object-fit: contain;
  background: #f5f7fa;
}
.dialogFooter {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
}
.noData {
  width: 100%;
  text-align: center;
  padding: 20px;
}
::v-deep {
  .noMultiple {
    .el-checkbox__inner {
      border-radius: 50%;
    }
  }
}
</style>
