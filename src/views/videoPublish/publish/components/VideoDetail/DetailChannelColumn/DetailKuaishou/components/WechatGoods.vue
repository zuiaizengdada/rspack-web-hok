<template>
  <AppDialog :height="'620px'" :width="'860px'" :value="visible" :title="title" :btn-footer="false" @close="close()">
    <div class="addGoods">
      <div class="goodsTop">
        <el-input
          v-model="input4"
          placeholder="请输入商品ID或关键词"
          style="width: 200px;height: 32px"
          @change="searchGoods"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <div class="goodsTable">
        <el-table
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
                    <img :src="scope.row.hokImage" style="width: 68px;height: 68px" />
                  </div>
                  <div class="goodsName" style="flex: 1">
                    <span class="goodsNameTit text_hidden">{{ scope.row.hokName }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="right"
            prop="yixiaoerPrice"
            label="价格"
            sortable
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
      type: String,
      default: ''
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
      tableData: [],
      copy,
      value: '',
      radio: 0,
      templateSelection: ''
    }
  },
  watch: {
    visible: {
      handler() {
        this.initData()
      }
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        this.tableData.forEach((item, index) => {
          if (item.yixiaoerId === this.selectId) {
            console.log(this.radio, '当前选中商品')
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
      console.log('搜索')
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          newVersion: this.allChannelSwitch[this.channel.id],
          mediaTypeEnum: 'hVideo',
          dataType: 6, // 5小程序、6商品
          keyWord: this.input4 // 小程序链接或者商品链接 必填
        }
        isUseNewClient(this.channel.id, 'get-minAppOrGoods', this.publishChannelData.activeData.account.platformAccountId, '购物车/小程序').emit('get-minAppOrGoods', JSON.stringify(params), response => {
          const data = JSON.parse(response)
          console.log(data, '商品')
          this.$nextTick(() => {
            this.tableData = data.dataBody
          })
        })
      }
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    close() {
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
