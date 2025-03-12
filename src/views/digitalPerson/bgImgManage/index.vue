<template>
  <MCard class="page_wrap overflowOuto">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="form-breadcrumb m-b-16"
    >
      <el-breadcrumb-item :to="{ name: 'DigitalVideoManage' }">
        数字人
      </el-breadcrumb-item>
      <el-breadcrumb-item>背景图管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row
      type="flex"
      justify="end"
      align="middle"
      style="position: absolute; right: 1vw; top: 5vh; z-index: 999"
    >
      <el-checkbox v-model="isMe" style="margin-right: 20px" @change="getList">
        我创建的背景
      </el-checkbox>
      <el-button
        class="addImg"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="onhandleAdd"
      >
        新增图片
      </el-button>
    </el-row>
    <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
      <el-tab-pane label="竖版图片" name="first">
        <el-empty v-if="!config.tableData.length" description="暂时没有图片" />
        <div v-loading="loading" class="imgList">
          <div
            v-for="(item, index) in config.tableData"
            :key="index"
            class="imgDetails flex flex-center"
            style="flex-wrap: wrap"
          >
            <el-image lazy :src="item.url" fit="scale-down" />
            <div class="opt">
              <div @click="lookOver(item)">
                <i class="el-icon-zoom-in" />
                <span class="m-l-8">大图</span>
              </div>
              <div v-if="item.auth == 1" @click="deleteImg(item.imagesId)">
                <i class="el-icon-delete" />
                <span class="m-l-8">删除</span>
              </div>
            </div>
            <div class="imgName">
              <div style="width: 198px">{{ item.name }}</div>
              <img
                v-if="item.auth == 1"
                :src="aiedit"
                class="aiedit"
                @click="editImg(item)"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="横版图片" name="second">
        <el-empty v-if="config.tableData == ''" description="暂时没有图片" />
        <div v-else v-loading="loading" class="imgList">
          <div
            v-for="(item, index) in config.tableData"
            :key="index"
            class="imgDetails"
          >
            <el-image lazy :src="item.url" fit="scale-down" />
            <div class="opt">
              <div @click="lookOver(item)">
                <i class="el-icon-zoom-in" />
                <span class="m-l-8">大图</span>
              </div>
              <div v-if="item.auth == 1" @click="deleteImg(item.imagesId)">
                <i class="el-icon-delete" />
                <span class="m-l-8">删除</span>
              </div>
            </div>
            <div class="imgName">
              <div style="width: 256px">{{ item.name }}</div>
              <img
                v-if="item.auth == 1"
                :src="aiedit"
                class="aiedit"
                @click="editImg(item)"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="pagination">
      <el-pagination
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="bgImgTitle"
      style="height: 800px"
      :visible.sync="bigImgVisible"
      :before-close="handleClose"
    >
      <div class="flex flex-center">
        <el-image lazy :src="bigImg" fit="scale-down" />
      </div>
    </el-dialog>
    <!-- 弹框层 -->
    <addDialog
      :config="addConfig"
      @success="closeAddDialog"
      @close="addConfig.visible = false"
    />
  </MCard>
</template>

<script>
import aiedit from '@/assets/svg/aiManage/aibgImg.svg'
import addDialog from './components/addDialog.vue'
import { getBackgroundImage, backgroundImageDelete } from '@/api/aiVideoManage'
export default {
  name: 'Index',
  components: {
    addDialog
  },
  data() {
    return {
      aiedit,
      activeName: 'first',
      total: 0,
      bgImgTitle: '',
      url: 'https://cbs-digital-human-cn-north-4.obs.cn-north-4.myhuaweicloud.com:443/character/user_character/offline/01d1e69894b146d3bc24a12e6ec11a7a/huoke_zhangqi/huoke_zhangqi_photo.png?AccessKeyId=EHAEEDH1I4LVACFHO5IB&Expires=1682303315&Signature=QlSdKc0cOIXvG31hXBrG72iTVxo%3D',
      addConfig: {
        type: 1, // 1新增 2编辑
        radio: 1,
        coverPhoto: '',
        row: {},
        visible: false
      },
      loading: false,
      bigImgVisible: false,
      bigImg: '',
      config: {
        tableData: [],
        pageSizes: [20, 50, 100],
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      isMenu: false,
      isMe: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        resolutionType: this.activeName === 'first' ? '1' : '0',
        isMeCrate: Number(this.isMe)
      }
      const res = await getBackgroundImage(params)
      this.loading = false
      this.config.tableData = res.data.items
      this.config.currentPage = res.data.pageIndex
      this.config.total = res.data.total
      console.log(res, '111')
    },
    // 图片编辑
    editImg(item) {
      console.log(item, '点了编辑')
      this.addConfig = {
        row: {
          imagesId: item.imagesId,
          type: 2, // 1新增 2编辑
          radio: item.resolutionType,
          name: item.name,
          coverPhoto: item.url
        },
        visible: true,
        disable: true
      }
    },
    deleteImg(id) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确定删除图片?</div>`,
        success: () => {
          this.loading = true
          const data = {
            imagesId: id
          }
          backgroundImageDelete(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    lookOver(item) {
      this.bigImg = item.url
      this.bgImgTitle = item.name
      this.bigImgVisible = true
    },
    handleClose() {
      this.bigImgVisible = false
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.addConfig = {
        type: 1,
        radio: 1,
        row: {},
        visible: true
      }
    },
    handleClick() {
      this.config.tableData = []
      this.getList()
    },
    // 点击关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.onSearchFn()
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  min-width: 1200px;
  height: calc(100vh - 90px);
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  .tabs {
    flex: 1;
  }
  .imgList {
    // max-width: 1200px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .imgDetails {
      width: 169px;
      border-radius: 4px;
      margin-right: 20px;
      margin-bottom: 16px;
      position: relative;
      &:last-child {
        margin-right: auto;
      }
    }
    .bgimg {
      border-radius: 4px;
      width: 198px;
      height: 352px;
      background: #f5f5f5;
    }
    .horizontal-bgimg {
      border-radius: 4px;
      width: 256px;
      height: 144px;
    }
    .opt {
      width: 100%;
      height: 32px;
      background: #000000;
      border-radius: 0px 0px 4px 4px;
      opacity: 0.6;
      display: none;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 34px;
      div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 14px;
        line-height: 32px;
        cursor: pointer;
      }
    }
    .aiedit {
      display: none;
    }
    .imgDetails:hover .opt {
      display: flex;
    }
    .imgDetails:hover .aiedit {
      display: block;
    }
    .imgName {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      width: 100%;
      div {
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        width: 100%;
        max-width: 100%;
        // 文本溢出隐藏
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .addImg {
  }
}

.pagination {
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
