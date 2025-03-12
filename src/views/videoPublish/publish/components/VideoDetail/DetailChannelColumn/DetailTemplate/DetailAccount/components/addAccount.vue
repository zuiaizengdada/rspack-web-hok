<template>
  <div v-if="visible" :class="selectIdList.length%3 == 0 ?'addContent':'addContent1'">
    <div class="title">{{ title }}</div>
    <div class="check-content overflowOuto">
      <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
        <el-checkbox v-for="(item,index) in accountList" :key="item.accountId" :label="item.accountId">
          <div class="ag-details">
            <div class="fl fl_ai_c">
              <div class="ag-avatar">
                <img :src="item.avatar" />
              </div>
              <div class="fl ag-details-name">
                <span
                  :class="index == 3 ? 'name active' : 'name'"
                >{{ item.name }}</span>
                <!--校验信息-->
                <!--<span v-if="index == 3" class="hiatus">(信息不完整,无法添加)</span>-->
              </div>
            </div>
            <!-- <div v-if="index == 3" class="perfect" @click="acFlag = true">-->
            <!--    完善信息-->
            <!-- </div>-->
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="ss-material-box-bottom">
      <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-button size="small" type="primary" @click="success">确定</el-button>
      <el-button size="small" @click="close()">取消</el-button>
    </div>
    <AccountConfiguration :visible="acFlag" @close="closeAc" />
  </div>
</template>

<script>
import AccountConfiguration from '@/components/AccountGrouping/AccountConfiguration.vue'
export default {
  name: 'AddAccount',
  components: {
    AccountConfiguration
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectIdList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '选择抖音账号'
    }
  },
  inject: ['getAccountList'],
  data() {
    return {
      acFlag: false,
      imgSrc:
        'http://tiebapic.baidu.com/forum/w%3D580/sign=9d3fa8074dfa513d51aa6cd60d6f554c/be9cbf5594eef01f3699251ea5fe9925bd317d6b.jpg?tbpicau=2023-03-08-05_63ddd71c18d0bd5caa488512ed575580',
      checkedList: [],
      checkAll: false
    }
  },
  computed: {
    accountList () {
      return this.getAccountList()
    }
  },
  watch: {
    visible: {
      handler(newVal, oldVal) {
        this.checkedList = this.selectIdList
        this.handleCheckedChange(this.selectIdList)
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      const allCheck = this.accountList.map(item => item.accountId)
      this.checkedList = val ? allCheck : []
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.accountList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accountList.length
    },
    close() {
      this.checkedList = []
      this.checkAll = false
      this.$emit('close')
    },
    closeAc() {
      this.acFlag = false
    },
    // 成功选择
    success() {
      const res = this.accountList.filter(item => this.checkedList.includes(item.accountId))
      console.log(res, '选中账号。。。。')
      this.$emit('success', res)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-checkbox{
  display: flex !important;
  align-items: center !important;
  margin-top: 10px;
  margin-right: 0px !important;
  width: 100%;
  .el-checkbox__label{
    width: 100%;
  }
}
.addContent1,.addContent{
  margin-top: 15px;
  width: 420px;
  height: 400px;
  background: #FFFFFF;
  box-shadow: 0px 4px 12px 0px rgba(22,22,22,0.25);
  position: absolute;
  z-index: 9999;
  margin-left: 80px;
}
.addContent1{
  right: 2%;
}
.addContent{
  left: -58%;
}
.addContent1:before,
.addContent1:after{
  left: 85%;
}
.addContent:before,
.addContent:after{
  left:16%;
}
.addContent1:before,
.addContent1:after,
.addContent:before,
.addContent:after{
  position:absolute;
  content:'';
  width:14px;
  height:14px;
  top:-7px;
  margin-left:-7px;
  overflow:hidden;
  pointer-events:none;
  -webkit-transform:rotate(-135deg);
  -mz-transform:rotate(-135deg);
  transform:rotate(-135deg);
}
.addContent1:before,
.addContent:before{
  //background:red;
  box-shadow:1px 1px 1px rgba(22,22,22,0.25)
}
.addContent1:after,
.addContent:after{
  bottom:-7px;
  background:#fff;
}
.ag-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .perfect {
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #0c6fff;
    font-size: 14px;
    font-weight: 400;
    color: #0c6fff;
    padding: 5px 20px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .ag-details-name {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .hiatus {
      margin-top: 4px;
      font-size: 14px;
      font-weight: 400;
      color: #f53f3f;
    }
    .name {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
    }
    .active {
      color: #777777;
    }
  }
}
.ag-avatar {
  position: relative;
  .subscript {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    bottom: 0;
    right: 0;
  }
  img {
    width: 52px;
    height: 52px;
    border-radius: 50%;
  }
}
.check-content{
  height: 270px;
  padding:0 20px;
  box-sizing: border-box;
}
.title{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  padding: 15px 20px;
  border-bottom: 1px solid #E7E7E7;
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
  position: absolute;
  box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.05);
  bottom: 0;
}
</style>
