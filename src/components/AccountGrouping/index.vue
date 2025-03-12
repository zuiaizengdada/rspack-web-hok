<template>
  <div>
    <AppDialog
      :height="'400px'"
      :width="'694px'"
      :value="visible"
      :title="'选择账号分组'"
      @close="close()"
    >
      <div v-if="groupList.length>=1" class="content">
        <div class="ag-left overflowOuto">
          <div
            v-for="(item,index) in groupList"
            :key="index"
            :class="activeIndex == index ? 'item activeList' : 'item'"
            @click="selectActive(item.groupId,index)"
          >
            {{ item.groupName }}({{ item.list&&item.list.length>=1?item.list.length:0 }})
          </div>
        </div>
        <div class="ag-right overflowOuto">
          <div v-for="(ele,ind) in accountList" :key="ind" class="ag-details">
            <div class="fl fl_ai_c">
              <div class="ag-avatar">
                <img :src="ele.avatar" />
                <img
                  class="subscript"
                  :src="imgMap.get(ele.platformId)"
                />
              </div>
              <div class="fl ag-details-name">
                <!--                :class="o == 3 ? 'name active' : 'name'"-->
                <span>{{ ele.name }}</span>
                <!--                <span v-if="o == 3" class="hiatus">(信息不完整,无法添加)</span>-->
              </div>
            </div>
            <!--            <div v-if="o == 3" class="perfect" @click="acFlag = true">-->
            <!--              完善信息-->
            <!--            </div>-->
          </div>
        </div>
      </div>
      <div v-if="groupList.length == 0" class="empty">
        <el-image :src="defaultImage" style="margin-top: 59px" />
        <div class="m-t-12">
          您还没有分组，快去创建分组吧～
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
import bilibili from '@/assets/svg/videoManga/bilibili_icon.svg'
import kuaishou from '@/assets/svg/videoManga/kuaishou_icon.svg'
import titok from '@/assets/svg/videoManga/titok_icon.svg'
import wechart from '@/assets/svg/videoManga/wechart_icon.svg'
import tikTok1 from '@/assets/svg/videoManga/icon-TikTok1.svg'
import xhs from '@/assets/svg/videoManga/xhs_icon.svg'
import defaultImage from '@/views/videoPublish/images/account-empty.png'
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
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    groupList: {
      type: Array,
      default: () => {
        return []
      }
    },
    accountList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      acFlag: false,
      defaultImage,
      imgMap: new Map([
        [15, bilibili],
        [19, titok],
        [32, wechart],
        [24, kuaishou],
        [31, xhs],
        [20, tikTok1]
      ]),
      imgSrc:
        'http://tiebapic.baidu.com/forum/w%3D580/sign=9d3fa8074dfa513d51aa6cd60d6f554c/be9cbf5594eef01f3699251ea5fe9925bd317d6b.jpg?tbpicau=2023-03-08-05_63ddd71c18d0bd5caa488512ed575580'
    }
  },
  methods: {
    selectActive(o, index) {
      this.$emit('selectActive', index)
    },
    closeAc() {
      this.acFlag = false
    },
    close() {
      this.$emit('close')
    },
    succese() {
      this.$emit('succese', this.accountList)
    }
  }
}
</script>

<style lang="scss" scoped>
.ss-material-box-bottom {
  background: #ffffff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);
  border-radius: 0px 0px 10px 10px;
}
.empty{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    height: 400px;
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
