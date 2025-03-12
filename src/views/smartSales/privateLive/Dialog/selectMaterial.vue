<template>
  <!-- 暖场素材选择弹框 -->
  <AppDialog
    v-model="visible"
    title="选择"
    width="984px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 添加优惠券弹框 -->
    <div v-loading="loading" class="selectMaterial">
      <div class="filterHeader">
        <span class="formLabel">文件名称</span>
        <el-input v-model.trim="search.fileName" size="small" placeholder="请输入文件名称" style="width: 200px" class="m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
        <el-input v-model.trim="search.tagName" size="small" placeholder="请输入标签名称" style="width: 200px" class="m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" />
        <el-button size="small" type="primary" @click="searchFn">查询</el-button>
      </div>
      <div class="myTable">
        <div class="tableView overflowOuto">
          <div v-for="(item) in list" :key="item.materialId" class="listView" :class="{selectView: select && select.materialId === item.materialId}">
            <uploadShow :url="item.url" width="166" height="125" disabled />
            <div class="ListContent" @click="rowClick(item)">
              <div class="fileName">
                <textShowMore :line-clamp="1" :text="item.name" style="152px" />
              </div>
              <div class="createUserName">
                <span class="createUserNameLabel">创建人：</span>
                <div class="createUserNameText">
                  <textShowMore :line-clamp="1" :text="item.createUserName" />
                </div>
              </div>
              <div class="createTime">{{ item.createTime | parseTime }}</div>
            </div>
            <img v-if="select && select.materialId === item.materialId" src="~@/assets/image/coupon/selectIconBlue.png" class="selectIcon" />
          </div>

          <div v-if="list.length === 0" class="noData">
            <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
            <div class="noDataText">暂无数据</div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import textShowMore from '@/components/textShowMore/index2.vue'
import uploadShow from '@/components/AppUploadView/uploadShow'
import { warmUpMaterialList } from '@/api/liveRoom/index.js'
export default {
  components: {
    AppDialog,
    textShowMore,
    uploadShow
  },
  data() {
    return {
      top: '114px',
      loading: false,
      visible: false,
      list: [],
      select: null,
      fileType: 1, // 1:图片,2:视频
      search: {
        fileName: '',
        tagName: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.select = null
          this.getList()
        } else {
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.select = null
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    rowClick(row) {
      console.log(row)
      this.select = row
    },
    sure() {
      if (!this.select) {
        return this.$message.error('请选择数据')
      }
      this.success && this.success(this.select)
      // this.loading = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const parame = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        name: this.search.fileName,
        type: this.fileType,
        tag: this.search.tagName
      }
      warmUpMaterialList(parame).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.search = { fileName: '' }
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.selectMaterial {
  height: 622px;
  padding: 10px 0;
  .filterHeader {
    padding: 0 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
    align-items: center;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      margin-right: 8px;
    }
  }
  .myTable {
    width: 100%;
    height: 560px;
    margin-top: 20px;
    background: #FFFFFF;
    // border-radius: 6px;
    // border: 1px solid #CBCFD3;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .tableView {
      padding: 0 20px;
      display: flex;
      flex: 1 0 0;
      flex-wrap: wrap;
      .listView {
        width: 168px;
        height: 197px;
        // margin-right: 20px;
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 20px;
        border-radius: 4px 4px 0px 0px;
        border: 1px solid #E7E7E7;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        .ListContent {
          width: 166px;
          padding: 5px 7px;
          .fileName {
            width: 100%;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            height: 17px;
          }
          .createUserName {
            display: flex;
            align-items: center;
            margin: 4px 0 6px;
            .createUserNameLabel {
              width: 4em;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333;
              line-height: 12px;
              margin-right: 5px;
            }
            .createUserNameText {
              flex: 1 0 0;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              line-height: 12px;
            }
          }
          .createTime {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999;
            line-height: 17px;
          }
        }
        .selectIcon {
          position: absolute;
          top: -1px;
          right: -1px;
          width: 24px;
          height: 24px;
        }
      }
      .selectView {
        border: 1px solid #1778FF;
      }
    }
  }
  .pagination {
    height: 60px;
    display: flex;
    padding-right: 33px;
    align-items: center;
    justify-content: right;
    box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.05);
  }
}
::v-deep {
  .el-input-group__prepend {
    background-color: #fff;
  }
}
::v-deep {
  .uploadShow {
    .fileView {
      border: none;
      background: #EDEDED;
    }
  }
  .textShowMore .showMore{
    font-size: 12px;
    line-height: 17px;
  }
  .dialog-body .ss-material-box-bottom {
    padding-right: 33px;
  }
}
.noData {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > img {
    width: 250px;
  }
  .noDataText {
    margin-top: 16px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 22px;
  }
}
</style>
