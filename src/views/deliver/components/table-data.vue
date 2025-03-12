e<template>
  <div class="table-cont-btn">
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      :data="orders"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="date"
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toDetail(scope)">详情</el-button>
          <el-button type="primary" size="small" @click="clickFollowUser(scope)">分配</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="className"
        label="班期"
      />
      <el-table-column
        prop="userName"
        label="客户姓名"
      />
      <el-table-column
        prop="orderNo"
        label="订单号"
      />
      <el-table-column
        prop="goodsName"
        label="商品名称"
      />
      <el-table-column
        prop="userPhone"
        label="客户手机"
      />
      <el-table-column
        prop="afterSaleStatus"
        label="售后状态"
      >
        <template slot-scope="scope">
          <p>{{ afterSaleStatusArray[scope.row.afterSaleStatus] }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="签到状态"
      >
        <template slot-scope="scope">
          <p>{{ asignArray [scope.row.signedIn] }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="payerTotal"
        label="订单金额"
      />
      <el-table-column
        prop="payTime"
        label="支付时间"
      />
      <el-table-column
        prop="signedOn"
        label="签到时间"
      />
      <el-table-column
        prop="folowers"
        label="跟进人"
      />
    </el-table>
    <div class="page-row">
      <el-pagination
        :current-page="datas.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="datas.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="datas.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-button class="signedin-btn" type="primary" @click="signedInChoose">签到</el-button>
    <el-dialog class="detail-data" title="详情" :visible.sync="detailBtnVisible">
      <div class="detail-btn-row">
        <div class="row-cont">
          <span class="title">客户手机：</span>
          <span class="detail-span">{{ editBianjiObject.userPhone }}</span>
        </div>
        <div class="row-cont">
          <span class="title">客户姓名：</span>
          <span class="detail-span">{{ editBianjiObject.userName }}</span>
        </div>
        <div class="row-cont">
          <span class="title">商品名称：</span>
          <span class="detail-span">{{ editBianjiObject.goodsName }}</span>
        </div>
        <div class="row-cont">
          <span class="title">订单金额：</span>
          <span class="detail-span">{{ editBianjiObject.payerTotal }}</span>
        </div>
        <div class="row-cont">
          <span class="title">支付时间：</span>
          <span class="detail-span">{{ editBianjiObject.payTime }}</span>
        </div>
        <div class="row-cont">
          <span class="title">公司名称：</span>
          <span class="detail-span">{{ editBianjiObject.company }}</span>
        </div>
        <div class="row-cont">
          <span class="title">职位：</span>
          <span class="detail-span">{{ editBianjiObject.position }}</span>
        </div>
        <div class="row-cont">
          <span class="title">行业：</span>
          <span class="detail-span">{{ editBianjiObject.industry }}</span>
        </div>
        <div class="row-cont">
          <span class="title">营业规模：</span>
          <span class="detail-span">{{ editBianjiObject.turnover }}</span>
        </div>
        <div class="row-cont">
          <span class="title">班期：</span>
          <el-select v-model="banqiValue" style="width: 400px" :disabled="editBianjiObject.signedIn === 1" placeholder="请选择" class="w-200">
            <el-option
              v-for="item in classData"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </div>
        <div class="row-cont" style="height: 110px">
          <span class="title">销售备注：</span>
          <el-input
            v-model="editBianjiObject.salesRemarks"
            disabled
            style="width: 400px;"
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          />
        </div>
        <div class="row-cont">
          <span class="title">服务备注：</span>
          <el-input
            v-model="fuwubeizhu"
            style="width: 400px;"
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureToEditOrders">确 定</el-button>
        <el-button v-if="editBianjiObject.signedIn === 0" type="primary" @click="sigleTpsignin">签到</el-button>
      </div>
    </el-dialog>
    <!-- 跟进人员弹框 -->
    <AppDialog v-model="followUserModel.visible" :title="followUserModel.title" width="800px" height="auto">
      <div class="follow-user-model">
        <div v-for="(item, index) in followUserModel.data" :key="index">
          <div class="clearfix follow-user">
            <div class="fl roleName">{{ item.roleName }}</div>
            <div class="fl selectUser">
              <el-tag v-if="item.userId" closable @close="delFollowUser(item, index)">{{ item.userName }}</el-tag>
              <el-button v-else class="button-new-tag" size="small" @click="addFollowUser(index)">+ 选择人员</el-button>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="follow-user-footer">
        <el-button type="primary" @click="sureFollowUser">确定</el-button>
        <el-button @click="closeFollowUserModel">取消</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import {
  addFollowSave
} from '@/api/business'
import { singInForData, getClassDataByGoodId, editOrdersNotMy } from '@/api/liveDeliver'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'TableData',
  components: { AppDialog },
  // eslint-disable-next-line vue/require-prop-types
  props: ['orders', 'search', 'datas'],
  data() {
    return {
      asignArray: ['未签到', '已签到'],
      classData: [],
      editBianjiObject: {},
      afterSaleStatusArray: ['---', '可申请', '申请中', '已完成', '用户关闭', '超时关闭'],
      distributionVisible: false,
      detailBtnVisible: false,
      nowChangeObject: {},
      banqiValue: '',
      fuwubeizhu: '',
      currentPage4: 1,
      tableData: [],
      multipleSelection: [],
      // 跟进人员弹框
      followUserModel: {
        visible: false,
        data: [
          { userId: '', userName: '', roleName: '班主任', role: 1 },
          { userId: '', userName: '', roleName: '销售', role: 2 },
          { userId: '', userName: '', roleName: '客服', role: 3 }
        ],
        orderNo: '',
        subOrderId: '',
        title: '添加跟进人员'
      }
    }
  },
  created() {
  },
  methods: {
    sureToEditOrders() {
      const params = {
        id: this.editBianjiObject.id,
        orderNo: this.editBianjiObject.orderNo,
        serviceRemarks: this.fuwubeizhu,
        subOrderId: this.editBianjiObject.subOrderId,
        classId: this.banqiValue,
        goodsId: this.editBianjiObject.goodsId
      }
      editOrdersNotMy(params).then(res => {
        if (res.code === 1) {
          this.$message.success('修改成功！')
          this.detailBtnVisible = false
          this.$parent.searchFn(this.search)
        }
      })
    },
    // 选择跟进人员
    addFollowUser(index) {
      this.$AddressBook({
        visible: true,
        type: [1],
        multiple: false,
        success: (res) => {
          if (res.user.length > 0) {
            const userInfo = res.user[0]
            this.followUserModel.data[index].userId = userInfo.userId
            this.followUserModel.data[index].userName = userInfo.userName
          }
        }
      })
    },
    delFollowUser(item, index) {
      this.followUserModel.data[index].userId = ''
      this.followUserModel.data[index].userName = ''
    },
    // 点击跟进人员
    clickFollowUser(row) {
      this.followUserModel.data = [
        { userId: '', userName: '', roleName: '班主任', role: 1 },
        { userId: '', userName: '', roleName: '销售', role: 2 },
        { userId: '', userName: '', roleName: '客服', role: 3 }
      ]
      this.followUserModel.orderNo = row.row.orderNo
      this.followUserModel.subOrderId = row.row.subOrderId
      if (row.row.followers && row.row.followers.length > 0) {
        // this.followUserModel.data
        row.row.followers.map((v) => {
          this.followUserModel.data[v.role - 1].userId = v.userId
          this.followUserModel.data[v.role - 1].userName = v.userName
        })
      }
      this.followUserModel.visible = true
    },
    sureFollowUser() {
      const data = {
        orderNo: this.followUserModel.orderNo,
        subOrderId: this.followUserModel.subOrderId,
        users: this.followUserModel.data
      }
      addFollowSave(data)
        .then((res) => {
          // this.getList()
          this.followUserModel.visible = false
          this.$parent.searchFn(this.search)
        })
        .catch(() => {
          this.loading = false
        })
    },
    closeFollowUserModel() {
      this.followUserModel.visible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.search.size = val
      this.$parent.searchFn(this.search)
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.$parent.searchFn(this.search)
    },
    addPerson() {
      const disabledUser = []
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        checkDept: [],
        checkUserIds: [],
        disabledUser,
        success: (res) => {
        }
      })
    },
    toDetail(row) {
      this.editBianjiObject = row.row
      this.banqiValue = row.row.classId
      this.fuwubeizhu = row.row.serviceRemarks
      const params = {
        goodsId: this.editBianjiObject.goodsId
      }
      getClassDataByGoodId(params).then(res => {
        if (res.code === 1) {
          this.classData = res.data
          this.banqiValue = this.editBianjiObject.classId
        }
      })
      this.detailBtnVisible = true
    },
    signedInChoose() {
      if (this.multipleSelection.length <= 0) {
        this.$message.error('请勾选需要签到的订单')
        return false
      }
      const array = []
      this.multipleSelection.some(item => {
        array.push(item.id)
      })
      const params = {
        ids: array
      }
      singInForData(params).then(res => {
        if (res.code === 1) {
          this.$message.success('签到成功！')
          this.$parent.searchFn(this.search)
        }
      })
    },
    sigleTpsignin() {
      const array = []
      array.push(this.editBianjiObject.id)
      const params = {
        ids: array
      }
      singInForData(params).then(res => {
        if (res.code === 1) {
          this.detailBtnVisible = false
          this.$message.success('签到成功！')
          this.$parent.searchFn(this.search)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-row {
    padding: 20px 0;
    text-align: right;
}

.disstribution-center {
  width: 500px;
  height: 150px;
  margin: 0 auto;
  .dis-cen-row {
    width: 100%;
    height: 40px;
    margin-bottom: 10px;
    .cen-row-title {
      width: 160px;
      height: 40px;
      line-height: 40px;
      text-align: right;
      font-weight: bold;
      display: inline-block;
    }
    .cen-row-data {
      width: 100px;
      height: 35px;
      margin-right: 20px;
      border-radius: 5px;
      border: 1px solid #67c23a;
      margin-left: 20px;
      display: inline-block;
      position: relative;
      text-align: center;
      line-height: 35px;
      color: #67c23a;
      i {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 16px;
        cursor: pointer;
        color: #606266;
      }
    }
  }
}

.detail-btn-row {
  width: 600px;
  .row-cont {
    height: 30px;
    width: 100%;
    line-height: 30px;
    margin-bottom: 10px;
    .title {
      display: inline-block;
      width: 130px;
      text-align: right;
      font-weight: bold;
    }
    .detail-span {
      display: inline-block;
      width: 460px;
      margin-left: 10px;
    }
    .beizhu {
      height: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
.detail-data ::v-deep .el-dialog__body {
  height: 650px;
}
.page_wrap {
  // min-width: 1200px;
  height: 100%;
  // background-color: #fff;
  border-radius: 4px;
  .content {
    height: 100%;
    overflow: auto;
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
    .filter_top {
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .footer-tabs {
      margin-top: 16px;
    }
    .table-module {
      padding: 20px;
      margin-top: 20px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      .ss-pagination-warpper {
        text-align: right;
      }
      .table-empty-text {
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 16px;
        text-align: center;
        color: #5e7382;
      }
      .main-table {
        width: 100%;
        .table-header {
          width: 100%;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;
          background: #f6f8fa;
          color: #353535;
          .header-item {
            float: left;
            box-sizing: border-box;
            position: relative;
            &:nth-child(1) {
              width: 20%;
              padding-left: 16px;
            }
            &:nth-child(2) {
              width: 10%;
            }
            &:nth-child(3) {
              width: 5%;
            }
            &:nth-child(4) {
              width: 10%;
            }
            &:nth-child(5) {
              width: 5%;
            }
            &:nth-child(6) {
              width: 10%;
            }
            &:nth-child(7) {
              width: 10%;
            }
            &:nth-child(8) {
              width: 10%;
            }
            &:nth-child(9) {
              width: 10%;
            }
            &:nth-child(10) {
              width: 10%;
            }
          }
        }

        .table-body {
          width: 100%;
          font-size: 14px;
          .table-title-row {
            position: relative;
            padding: 0 50px 0 15px;
            margin-top: 16px;
            background: #f7f9fb;
            border: 1px solid #eee;
            min-height: 44px;
            line-height: 28px;
            height: auto;
            overflow: hidden;
            color: #333;
            font-size: 14px;
            .title-item {
              margin-right: 24px;
              height: 42px;
              line-height: 42px;
              float: left;
            }

            .color-tag-area {
              display: flex;
              align-items: center;
              position: absolute;
              right: 0;
              top: 0;
              padding: 0 15px;
              height: 42px;
              line-height: 42px;
              color: #105cfb;
              cursor: pointer;
              > img {
                width: 16px;
                height: 16px;
              }
            }
          }
          .table-body-row {
            width: 100%;
            display: flex;
            align-items: center;
            min-height: 93px;
            border-left: 1px solid #eeeeee;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .body-item {
              box-sizing: border-box;
              position: relative;
              height: 100%;
              &:nth-child(1) {
                width: 20%;
                padding-left: 15px;
              }
              &:nth-child(2) {
                width: 10%;
              }
              &:nth-child(3) {
                width: 5%;
              }
              &:nth-child(4) {
                width: 10%;
              }
              &:nth-child(5) {
                width: 5%;
              }
              &:nth-child(6) {
                width: 10%;
              }
              &:nth-child(7) {
                width: 10%;
              }
              &:nth-child(8) {
                width: 10%;
              }
              &:nth-child(9) {
                width: 10%;
              }
              &:nth-child(10) {
                width: 10%;
              }

              .goods-img-info {
                display: flex;
                align-items: center;
                .goods-img {
                  width: 64px;
                  height: 64px;
                  min-width: 64px;
                  background: #eee;
                }
                .goods-info {
                  min-height: 60px;
                  padding-left: 8px;
                  display: grid;

                  .goods-type {
                    width: 100%;
                    height: 18px;
                    line-height: 18px;
                    font-size: 14px;
                    color: #999999;
                    margin-right: 8px;
                  }
                  .goods-period {
                    width: 100%;
                    height: 16px;
                    font-size: 12px;
                    color: #b2b2b2;
                    line-height: 16px;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.customer-info-box {
  max-height: 400px;
  overflow: auto;
  padding-top: 20px;
}
.memberCard {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.memberInfo {
  width: 450px;
  line-height: 20px;
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 33.33%;
    > span:nth-child(1) {
      // margin-right: 8px;
      word-break: keep-all;
      line-height: 22px;
      font-size: 14px;
    }
    > span:nth-child(2) {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 22px;
      font-size: 14px;
    }
  }
}
.table-empty-text {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 16px;
  text-align: center;
  color: #5e7382;
}
.change-price-model {
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
}
.goods_picture {
  width: 82px;
  height: 60px;
  border-radius: 4px;
  background: rgb(245, 247, 250);
}
.goods_info {
  line-height: 1.5;
  width: calc(100% - 82px);
  height: 60px;
  flex: 1;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  .goods_name {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    word-wrap: break-word;
    font-size: 14px;
    color: #353535;
    cursor: pointer;
  }

}
.change-price-model-footer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .change-price-model-footer-view {
    display: flex;
    margin-top: 20px;
    width: 50%;
    .change-price-model-footer-view-label {
      width: 82px;
      margin-right: 12px;
      font-size: 14px;
      color: #606266;
    }
    .change-price-model-footer-view-name {
      font-size: 14px;
      color: #606266;
    }
  }
}
.follow-user-model {
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
  .follow-user {
    margin-bottom: 20px;
    line-height: 32px;
    .roleName {
      width: 80px;
    }
  }
}
.follow-user-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
.followerUserTips {
  color: #1890ff;
  cursor: pointer;
  // &:active {
  //   color: ;
  // }
}

.signedin-btn {
  float: left;
  margin-top: -50px;
}
</style>
