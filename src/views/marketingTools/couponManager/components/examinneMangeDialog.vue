<template>
  <el-dialog :visible.sync="visibleDialogExamineManage" title="审核人员管理" @close="dialogClose">
    <div class="m-t-8 m-b-32 shop-notice">
      <div class="shop-line">
        <span class="shop-line-label">初审人员</span>
        <addUser
          :loading="couponPreliminaryExaminationLoadding"
          :shop-notice-flag="couponPEFlag"
          btn-text="添加初审人员"
          :data="couponPreliminaryExamination"
          @del="val => del('couponPreliminaryExamination', val)"
          @add="val => add('couponPreliminaryExamination', val)"
        />
      </div>
      <div class="shop-line">
        <span class="shop-line-label">复审人员</span>
        <addUser
          :loading="couponReexamineLoading"
          :shop-notice-flag="couponReexamineFlag"
          btn-text="添加复审人员"
          :data="couponReexamine"
          @del="val => del('couponReexamine', val)"
          @add="val => add('couponReexamine', val)"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import addUser from './addUser'
import { couponAuditorSearch,
  couponAuditorSetting } from '@/api/deliver/baseSeeting'
export default {
  components: {
    addUser
  },
  data() {
    return {
      visibleDialogExamineManage: false,
      couponPreliminaryExaminationLoadding: false,
      couponPEFlag: false,
      couponPreliminaryExamination: [],
      couponReexamineLoading: false,
      couponReexamineFlag: false,
      couponReexamine: []
    }
  },
  methods: {
    // 获取优惠券审核人员列表
    getCouponAuditorList() {
      this.couponReexamine = []
      this.couponPreliminaryExamination = []
      couponAuditorSearch().then(res => {
        console.log('优惠券rreesss:', res)
        if (res.code === 1) {
          res.data.some(item => {
            const obj = {
              userId: '',
              nickName: ''
            }
            if (item.auditStage === 1) {
              obj.userId = item.auditUserId
              obj.nickName = item.auditNickName
              this.couponPreliminaryExamination.push(obj)
            } else if (item.auditStage === 2) {
              obj.userId = item.auditUserId
              obj.nickName = item.auditNickName
              this.couponReexamine.push(obj)
            }
          })
        }
      })
    },
    del(key, index) {
      console.log(key, index)
      if (this[key].length === 1) {
        return this.$message.error('最后一个提醒人员不可删除')
      }
      const users = JSON.parse(JSON.stringify(this[key]))
      const type = {
        couponPreliminaryExamination: 13, // 优惠券初审人员
        couponReexamine: 14 // 优惠券复审人员
      }
      users.splice(index, 1)
      this.addCouponPreliminaryExamination(type[key], users)
    },
    add(key, row) {
      const type = {
        couponPreliminaryExamination: 13, // 优惠券初审人员
        couponReexamine: 14 // 优惠券复审人员
      }
      this[key] && (this[key] = row)
      this.addCouponPreliminaryExamination(type[key], row)
    },
    addCouponPreliminaryExamination(type, row) {
      console.log('addCouponPreliminaryExamination---type', type)
      console.log('addCouponPreliminaryExamination---row:::', row)
      const params = {
        beforeAuditUserIdList: [],
        afterAuditUserIdList: []
      }
      if (type === 13) {
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params.beforeAuditUserIdList = sysUserIds
        this.couponReexamine.some(item => {
          params.afterAuditUserIdList.push(item.userId)
        })
      } else if (type === 14) {
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        params.afterAuditUserIdList = sysUserIds
        this.couponPreliminaryExamination.some(item => {
          params.beforeAuditUserIdList.push(item.userId)
        })
      }

      couponAuditorSetting(params).then(res => {
        if (res.code === 1) {
          this.getCouponAuditorList()
        }
      })
    },
    openDialog() {
      this.visibleDialogExamineManage = true
      this.getCouponAuditorList()
    },
    dialogClose() {
      this.visibleDialogExamineManage = false
      this.couponPreliminaryExaminationLoadding = false
      this.couponPEFlag = false
      this.couponPreliminaryExamination = []
      this.couponReexamineLoading = false
      this.couponReexamineFlag = false
      this.couponReexamine = []
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__body{
    padding: 0 20px;
  }
}
.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  height: 500px;
  overflow-y: auto;
  display: inline-block;
  .shop-line {
    float: left;
    width: 100%;
    margin-bottom: 10px;
    ::v-deep .assessBox {
      padding: 0;
      border: none;
    }

    .shop-line-text-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .inputNumber {
        width: 130px;
      }
      > div:nth-of-type(2) {
        padding-left: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 22px;
      }
    }
    .shop-line-label {
      float: left;
      font-size: 12px;
      width: 100px;
      line-height: 28px;
      color: #333;
    }
  }
  .boxText {
    font-size: 14px;
  }
}
.m-b-32 {
  margin-bottom: 32px;
}
</style>
