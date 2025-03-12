<template>
  <div>
    <AppDialog
      :height="'400px'"
      :width="'694px'"
      :value="visible"
      :title="'选择账号分组'"
      @success="submit()"
      @close="close()"
    >
      <div class="content">
        <div class="ag-left">
          <div
            v-for="o in 5"
            :key="o"
            :class="activeIndex == o ? 'item activeList' : 'item'"
            @click="selectActive(o)"
          >
            {{ '列表内容 ' + o }}
          </div>
        </div>
        <div class="ag-right overflowOuto">
          <div v-for="o in 10" :key="o" class="ag-details">
            <div class="fl fl_ai_c">
              <div class="ag-avatar">
                <img :src="imgSrc" />
                <img
                  class="subscript"
                  src="http://tiebapic.baidu.com/forum/w%3D580/sign=6f7097d24cf79052ef1f47363cf1d738/87a2f81249540923928087bfd758d109b2de491e.jpg?tbpicau=2023-03-09-05_47843d33b4ec6384b9ae4ac649756601"
                />
              </div>
              <div class="fl ag-details-name">
                <span
                  :class="o == 3 ? 'name active' : 'name'"
                >账号名称账号名称</span>
                <span v-if="o == 3" class="hiatus">(信息不完整,无法添加)</span>
              </div>
            </div>
            <div v-if="o == 3" class="perfect" @click="acFlag = true">
              完善信息
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="ss-material-box-bottom">
        <el-button
          size="small"
          :loading="loading"
          @click="close()"
        >取消</el-button>
        <el-button
          size="small"
          :loading="loading"
          type="primary"
          @click="succese()"
        >确定</el-button>
      </div>
      <AccountConfiguration :visible="acFlag" @close="closeAc" />
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AccountConfiguration from './AccountConfiguration'

export default {
  name: 'Index',
  components: {
    AppDialog,
    AccountConfiguration
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeIndex: 1,
      loading: false,
      acFlag: false,
      imgSrc:
        'http://tiebapic.baidu.com/forum/w%3D580/sign=9d3fa8074dfa513d51aa6cd60d6f554c/be9cbf5594eef01f3699251ea5fe9925bd317d6b.jpg?tbpicau=2023-03-08-05_63ddd71c18d0bd5caa488512ed575580'
    }
  },
  methods: {
    selectActive(o) {
      this.activeIndex = o
    },
    closeAc() {
      this.acFlag = false
    },
    close() {
      this.$emit('close')
    },
    submit() {}
  }
}
</script>

<style lang="scss" scoped>
.ss-material-box-bottom {
  background: #ffffff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 0px 0px 10px 10px;
}
.content {
  height: 100%;
  display: flex;
  .ag-left {
    width: 200px;
    height: 100%;
    border-right: 1px solid #ccc;
    .item {
      padding: 10px 20px;
      cursor: pointer;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    .activeList {
      background: #e7f0ff;
    }
  }
  .ag-right {
    width: 100%;
    flex: 1;
    padding-top: 16px;
    .ag-details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      margin-bottom: 16px;
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
  }
}
</style>
