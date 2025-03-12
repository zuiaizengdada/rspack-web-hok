<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="701px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="dis-cnt">
      <div v-for="(item, index) in texts" :key="index" class="flex">
        <div class="cell">
          <div class="cell-label w80">视频名称：</div>
          <div class="cell-cnt mw290">
            <template v-if="item.videoName">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.videoName"
                placement="top"
              >
                <p class="txt-hidden">{{ item.videoName }}</p>
              </el-tooltip>
            </template>
            <template v-else>
              <p class="txt-hidden">--</p>
            </template>
          </div>
        </div>
        <div class="cell shrink">
          <div class="cell-label">IP：</div>
          <div class="cell-cnt mw100 txt-hidden">
            <template v-if="item.teacherName">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.teacherName"
                placement="top"
              >
                <p class="txt-hidden">{{ item.teacherName }}</p>
              </el-tooltip>
            </template>
            <template v-else>
              <p class="txt-hidden">--</p>
            </template>
          </div>
        </div>
        <div class="cell shrink">
          <div class="cell-label">大小：</div>
          <div class="cell-cnt">
            {{ item.size | filterSize }}
          </div>
        </div>
        <div class="cell shrink">
          <div class="cell-label">时长：</div>
          <div class="cell-cnt">
            {{ getPlayDuration(item.duration * 1000) }}
          </div>
        </div>
        <!-- <div class="txt-item flex">
          <span class="flex-none">视频名称：</span>
          <span>{{ item.videoName }}</span>
        </div>
        <div class="txt-item flex-none">
          <span>IP：</span>
          <span>{{ item.teacherName || '--' }}</span>
        </div>
        <div class="txt-item flex-none">
          <span>大小：</span>
          <span>{{ item.size | filterSize }}</span>
        </div>
        <div class="txt-item flex-none">
          <span>时长：</span>
          <span>{{ getPlayDuration(item.duration * 1000) }}</span>
        </div> -->
      </div>
      <p class="title">请选择分发合作机构</p>
      <div v-loading="orgLoading" class="org-list">
        <template v-if="orgList && orgList.length === 0">
          <div class="empty-txt flex flex-center flex-middle">暂无合作机构</div>
        </template>
        <template v-else-if="orgList && orgList.length > 0">
          <el-checkbox-group v-model="checkedOrgs" @change="checkedOrgChange">
            <el-checkbox
              v-for="orgItem in orgList"
              :key="orgItem.orgId"
              :label="orgItem.orgId"
            >
              {{ orgItem.orgName }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </div>
      <div class="flex flex-between flex-middle">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <div v-if="orgList && orgList.length === 0" class="desc">
          若无合作机构，请先前往合作协议中新增合作机构
        </div>
      </div>
      <div slot="footer" />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  videoContentDeliveryApi,
  desensitizedContentDeliveryApi
} from '@/api/videoManagement/vedioSetting'
import { getEffectiveOrgListApi } from '@/api/coOpProtocol/index.js'

import { getPlayDuration } from '@/utils/index'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      title: '',
      loading: false,
      visible: false,
      top: '114px',
      orgList: null,
      orgLoading: false,
      checkAll: false,
      checkedOrgs: [],
      texts: [],
      type: '' // tm => 脱敏 cp => 成品
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.checkedOrgs = []
          this.getOrgAppId()
        }
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    getPlayDuration,
    dialogOperation(type, info) {
      this.checkAll = false
      if (type === 'open') {
        this.texts = info.texts
        this.type = info.type
        this.title = info.title
        this.reqInfo = info.reqInfo
        this.visible = true
      } else {
        this.visible = false
      }
    },
    async getOrgAppId() {
      this.orgLoading = true
      try {
        const { data } = await getEffectiveOrgListApi({
          type: this.type === 'tm' ? 1 : 2,
          teacherId: this.texts[0]
            ? this.texts[0].teacherId || undefined
            : undefined
        })
        this.orgList = data
      } catch (error) {
        console.log(error)
      }
      this.orgLoading = false
    },
    handleCheckAllChange(val) {
      this.checkedOrgs = val ? this.orgList.map(m => m.orgId) : []
    },
    checkedOrgChange(value) {
      const len = value.length
      this.checkAll = this.checkedOrgs.length > 0 && len === this.orgList.length
    },

    async sure() {
      if (this.checkedOrgs.length < 1) {
        this.$message.warning('请选择分发合作机构')
        return
      }
      this.loading = true
      try {
        let result = null
        if (this.type === 'tm') {
          result = await desensitizedContentDeliveryApi({
            cpOrgIdList: this.checkedOrgs,
            ...this.reqInfo
          })
        } else {
          result = await videoContentDeliveryApi({
            cpOrgIdList: this.checkedOrgs,
            ...this.reqInfo
          })
        }
        if (result.data) {
          this.$message.success('分发成功！')
          this.$emit('success')
          this.dialogOperation('close')
        } else {
          this.$message.error(result.message)
        }
        console.log(result)
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.mw290 {
  max-width: 290px;
}
.dis-cnt {
  max-height: 398px;
  padding: 16px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  .txt-item {
    padding-left: 16px;
    margin-bottom: 10px;
    &:first-child {
      padding-left: 0;
    }
    span {
      color: #777777;
      font-size: 14px;
      font-weight: 400;
      &:nth-child(2) {
        color: #333333;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0;
  }
  .org-list {
    width: 661px;
    max-height: 176px;
    border-radius: 4px;
    opacity: 1;
    border: 1px solid #c2c6ce;
    overflow-y: auto;
    margin-bottom: 20px;
    padding: 14px 20px;
  }
  .empty-txt {
    color: #808080;
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    width: 100%;
    min-height: 136px;
  }
  .desc {
    color: #ff2020;
    font-size: 14px;
    font-weight: 400;
  }
  .cell {
    display: flex;
    margin-bottom: 20px;
    .cell-label {
      width: 55px;
      color: #777777;
      font-size: 14px;
      font-weight: 400;
      text-align: right;
      flex-shrink: 0;
      &.w80 {
        width: 80px;
      }
    }
    .cell-cnt {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
      &.mw100 {
        max-width: 60px;
      }
    }
  }
  .desc {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    padding-left: 70px;
  }
}
::v-deep .ss-material-box-bottom {
  box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.05);
}
::v-deep .org-list {
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
    .el-checkbox {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
.txt-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0; // 避免flex布局的影响
}
</style>
