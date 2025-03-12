<template>
  <AppDialog :height="'620px'" :width="'860px'" :value="visible" :title="title" :btn-footer="false" @close="close">
    <div class="addGoods">
      <div class="goodsTop">
        <el-input
          v-model="input4"
          placeholder="请输入商品ID或关键词"
          style="width: 200px;height: 32px"
          @change="searchGoods"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchGoods" />
        </el-input>
      </div>
      <div class="goodsTable">
        <el-table
          v-loading="loading"
          :header-cell-style="{background:'#eef1f6',color:'#606266'}"
          :data="tableData"
          class="goodsTable"
          max-height="500"
        >
          <el-table-column
            prop="date"
            label="分组名"
            width="360"
          >
            <template slot-scope="scope">
              <div class="goodsGroups">
                <el-radio
                  v-model="radio"
                  style="margin: 0px"
                  :label="scope.$index"
                  @change.native="getCurrentRow(scope.row,scope.$index)"
                >{{ '' }}</el-radio>
                <div class="fl fl_ai_c">
                  <div>
                    <img :src="scope.row.yixiaoerImage[0]" style="width: 68px;height: 68px" />
                  </div>
                  <div class="goodsName" style="flex: 1">
                    <span class="goodsNameTit text_hidden">{{ scope.row.yixiaoerName }}</span>
                    <span class="goodsId"><span>ID：{{ scope.row.yixiaoerId }}</span><img :src="copy" class="m-l-4" @click="handleCopy(scope.row.yixiaoerId,$event)" /></span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="yixiaoerPrice"
            label="价格"
            sortable
          />
          <el-table-column
            prop="yixiaoerStock"
            label="库存"
          />
        </el-table>
      </div>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button
        size="small"
        @click="close()"
      >取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="succese()"
      >添加</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import copy from '@/assets/svg/videoManga/copy_icon.svg'
import clip from '@/utils/clipboard'
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'

export default {
  name: 'WechatGoods',
  components: {
    AppDialog
  },
  mixins: [mixinsAllOperations],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectId: {
      type: Number,
      default: 0
    },
    goodsList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '从橱窗添加商品'
    }
  },
  data() {
    return {
      input4: '',
      options: [],
      copy,
      value: '',
      loading: false,
      tableData: [],
      radio: 0,
      templateSelection: ''
    }
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        if (val) {
          this.initData()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.tableData = this.goodsList
  },
  methods: {
    initData() {
      this.searchGoods()
      this.$nextTick(() => {
        this.tableData.forEach((item, index) => {
          if (item.yixiaoerId === this.selectId) {
            this.radio = index
          }
        })
        this.tableData = this.goodsList
      })
    },
    getCurrentRow(row, index) {
      // 获取选中数据 row表示选中这一行的数据，可以从里面提取所需要的值
      this.templateSelection = row
      this.radio = index
    },
    // 搜索
    searchGoods() {
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'hVideo',
          dataType: 6, // 5小程序、6商品
          keyWord: this.input4 // 小程序链接或者商品链接 必填
        }
        console.log(params, '商品')
        this.loading = true
        isUseNewClient(this.channel.id, 'get-minAppOrGoods', this.publishChannelData.activeData.account.platformAccountId, '购物车/小程序').emit('get-minAppOrGoods', JSON.stringify(params), response => {
          const data = JSON.parse(response)
          console.log(data, '商品')
          data.dataBody.forEach(item => {
            item.yixiaoerImage = item.yixiaoerImage || item.hokImage
            item.yixiaoerName = item.yixiaoerName || item.hokName
            item.yixiaoerId = item.yixiaoerId || item.hokId
          })
          this.loading = false
          this.tableData = data.dataBody
        })
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    close() {
      this.radio = 0
      this.input4 = ''
      this.$emit('close')
    },
    succese() {
      this.$emit('succese', this.tableData[this.radio])
    }
  }
}
</script>

<style lang="scss" scoped>
  .addGoods{
    padding: 20px;
    box-sizing: border-box;
  }
  .el-icon-search{
    cursor: pointer;
  }
  .goodsTop{
    display: flex;
    align-items: center;
  }
  .goodsTable{
    margin-top: 20px;
  }
  .goodsGroups{
    display: flex;
    align-items: center;
  }
  .goodsName{
    margin-left: 10px;
    .goodsNameTit{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .goodsId{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      display: flex;
      align-items: center;
    }
  }
  .ss-material-box-bottom {
    background: #ffffff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
    border-radius: 0px 0px 10px 10px;
  }
</style>
