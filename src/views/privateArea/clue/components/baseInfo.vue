<template>
  <div class="baseInfo">
    <MTitle>跟进人信息</MTitle>
    <el-table
      ref="myTable"
      :data="data"
      class="tableBorder"
      border
      :header-cell-style="{ background: '#F2F9FF' }"
    >
      <el-table-column prop="followUserName" label="所属员工" width="130" />
      <el-table-column prop="createTime" label="分配时间" width="170" />
      <el-table-column prop="isAddQw" label="添加企微" width="95">
        <template slot-scope="{ row }">
          <MIconStatus
            :background="
              getOptionsValueByKey(
                'value',
                'background',
                row.isAddQw,
                followWechatStatus
              )
            "
            :color="
              getOptionsValueByKey(
                'value',
                'color',
                row.isAddQw,
                followWechatStatus
              )
            "
            :icon-class="
              getOptionsValueByKey(
                'value',
                'icon',
                row.isAddQw,
                followWechatStatus
              )
            "
            :title="
              getOptionsValueByKey(
                'value',
                'label',
                row.isAddQw,
                followWechatStatus
              )
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="isAddGw" label="添加个微" width="95">
        <template slot-scope="{ row }">
          <MIconStatus
            style="cursor: pointer"
            :background="
              getOptionsValueByKey(
                'value',
                'background',
                row.isAddGw,
                followPrivateWechatStatus
              )
            "
            :color="
              getOptionsValueByKey(
                'value',
                'color',
                row.isAddGw,
                followPrivateWechatStatus
              )
            "
            :icon-class="
              getOptionsValueByKey(
                'value',
                'icon',
                row.isAddGw,
                followPrivateWechatStatus
              )
            "
            :title="
              getOptionsValueByKey(
                'value',
                'label',
                row.isAddGw,
                followPrivateWechatStatus
              )
            "
            class-name="isAddGwIconClass"
            @click.native="editIsAddGw(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="addQwType" label="添加企微好友场景" width="150">
        <template slot-scope="{ row }">
          {{ { 1: '营销通', 2: '获客助手', 3: '微伴同步' }[row.addQwType] }}
        </template>
      </el-table-column>
      <el-table-column prop="externalUserTags" label="标签">
        <template slot-scope="{ row }">
          <div class="tagBox">
            <div
              v-for="(item, index) in row.externalUserTags"
              :key="index"
              class="tagView m-r-10 m-b-10"
            >
              {{ item.tagName }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <MTitle class="m-t-32">基本信息</MTitle>
    <div class="formDetail">
      <div class="detailFormView">
        <div class="detailFormLabel">学员姓名：</div>
        <div class="detailFormValue">
          {{ userInfoData.name }}
        </div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">学员电话：</div>
        <div class="detailFormValue">
          <tablePhoneItem
            v-model="phone"
            :phone-area-code="userInfoData.phoneAreaCode"
            :row-data="{ id: clueId }"
            type="clue"
          />
        </div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">性别：</div>
        <div class="detailFormValue">
          {{ { 0: '未知', 1: '男', 2: '女' }[userInfoData.sex] }}
        </div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">年龄：</div>
        <div class="detailFormValue">{{ userInfoData.ageCodeName }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">备用手机：</div>
        <div class="detailFormValue">{{ userInfoData.sparePhone }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel" style="min-width: 96px">微信备注名：</div>
        <div class="detailFormValue">{{ userInfoData.wechatRemark }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel" style="min-width: 96px">直播手机号：</div>
        <div class="detailFormValue">
          <tablePhoneItem
            v-model="userInfoData.livePhone"
            :phone-area-code="userInfoData.watchLivePhoneAreaCode"
            :row-data="{ id: clueId }"
            type="clueLive"
          />
          <!-- <span v-else>{{ userInfoData.livePhone }}</span> -->
        </div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel" style="min-width: 80px">邮箱：</div>
        <div class="detailFormValue">
          <tableEmailItem
            v-model="userInfoData.email"
            :row-data="{ userId: userInfoData.uid }"
            type="user"
          />
          <!-- <span v-else>{{ userInfoData.livePhone }}</span> -->
        </div>
      </div>
      <div class="detailFormRemake">
        <div class="detailFormLabel">备注：</div>
        <div class="detailFormValue">
          <textShowMore :text="userInfoData.description" :line-clamp="3" />
        </div>
      </div>
      <div class="detailFormRemake" style="margin-top: 5px">
        <div class="detailFormLabel">个人标签：</div>
        <div class="detailFormValue detailFormValueWidth">
          <el-tag
            v-for="(item, index) in tagList"
            :key="index"
            :closable="item.isCanDelete"
            :disable-transitions="false"
            @close="handleClose(item)"
          >
            {{ item.tagName }}
          </el-tag>
          <el-button
            class="button-new-tag"
            size="mini"
            @click="handleAddTag"
          >+ 新增</el-button>
        </div>
      </div>
    </div>
    <MTitle class="m-t-32">公司信息</MTitle>
    <div class="formDetail">
      <div class="detailFormView">
        <div class="detailFormLabel">公司名称：</div>
        <div class="detailFormValue">
          <textShowMore2 :text="userInfoData.company" :line-clamp="1" />
        </div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">职位：</div>
        <div class="detailFormValue">{{ userInfo.position }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel" style="min-width: 96px">年营业额：</div>
        <div class="detailFormValue">{{ userInfoData.turnover }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">所在行业：</div>
        <div class="detailFormValue">{{ userInfoData.industry }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel">主营业务：</div>
        <div class="detailFormValue">{{ userInfoData.introduce }}</div>
      </div>
      <div class="detailFormView">
        <div class="detailFormLabel" style="min-width: 96px">公司所在地：</div>
        <div class="detailFormValue">{{ userInfoData.areaName }}</div>
      </div>
    </div>
    <tagDialog
      :tag-list="tagList"
      :platform-user-id="platformUserId"
      :visible.sync="visible"
      @handleOk="handleOk"
    />
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index.vue'
import textShowMore2 from '@/components/textShowMore/index2.vue'
import { followWechatStatus, followPrivateWechatStatus } from '../columns'
import { getOptionsValueByKey } from '@/filters/index'
import tagDialog from './tagDialog'
import { editIsAddGw } from '@/api/privateArea/clue'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import { userTagList, userTagDelete } from '@/api/privateArea/CRM.js'
export default {
  components: {
    textShowMore,
    textShowMore2,
    tablePhoneItem,
    tableEmailItem,
    tagDialog
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          age: '',
          avatar: '',
          corpAddress: '',
          corpName: '',
          description: '',
          externalUserId: '',
          followQwUserId: '',
          followWbUserId: '',
          gender: '',
          industries: '',
          mainBusiness: '',
          name: '',
          phone: '',
          position: '',
          relStatus: 0,
          remark: '',
          sparePhone: '',
          tags: [],
          cluePersonTags: [],
          wbExternalUserId: '',
          yearlyTurnover: ''
        }
      }
    },
    platformUserId: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    clueId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userInfoData: { ...this.userInfo },
      visible: false,
      followWechatStatus,
      followPrivateWechatStatus,
      tagList: [],
      livePhone: ''
    }
  },
  computed: {
    // userInfoData() {
    //   return this.userInfo
    // },
    phone: {
      get() {
        return this.userInfo.phone
      },
      set(val) {
        this.userInfo.phone = val
      }
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.$refs.myTable && this.$refs.myTable.doLayout()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.handleOk()
  },
  methods: {
    async handleOk() {
      const { data } = await userTagList(this.platformUserId)
      this.tagList = data
    },
    handleAddTag() {
      this.visible = true
    },
    async handleClose(item) {
      const { code } = await userTagDelete(item.id)
      if (code === 1) {
        this.tagList = [...this.tagList].filter(n => n.id !== item.id) || []
        this.$message.success('删除成功！')
      }
      console.log(code)
    },
    getOptionsValueByKey,
    editIsAddGw(row) {
      if (!row.loginIsFollowUser) {
        return this.$message.error('只能操作所属员工是自己的')
      }
      this.$delModal({
        tips: { 0: '是否确认已加个微？', 1: '是否确认变更为未加个微？' }[
          row.isAddGw
        ],
        success: () => {
          this.loading = true
          const data = {
            clueId: row.id
          }
          editIsAddGw(data)
            .then(res => {
              this.loading = false
              // this.getList()
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.baseInfo {
  padding-top: 22px;
  .tableBorder {
    border-radius: 6px;
    width: 100%;
    margin-top: 16px;
  }
  .formDetail {
    margin-top: 16px;
    padding: 20px;
    background: #f2f9ff;
    border-radius: 8px;
    background: #f2f9ff;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    .detailFormView {
      flex: 33.33% 0 0;
      display: flex;
      margin-bottom: 16px;
    }
    .detailFormLabel {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      width: 80px;
      max-width: 80px;
      min-width: 80px;
      text-align: right;
    }
    .detailFormValue {
      padding-top: 2px;
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      > span {
        margin-right: 6px;
      }
    }
    .detailFormRemake {
      width: 100%;
      display: flex;
      .detailFormValue {
        flex: 1 0 0;
        display: flex;
      }
    }
  }
}
.detailFormValueWidth {
  max-width: 550px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  > span,
  button {
    margin-bottom: 5px;
  }
}
.m-t-32 {
  margin-top: 32px;
}
.tagBox {
  display: flex;
  writing-mode: vertical-lr;
  // flex-wrap: wrap;
  .tagView {
    writing-mode: horizontal-tb;
    height: 20px;
    background: #e7f0ff;
    border-radius: 2px;
    max-width: 100px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 20px;
    padding: 0 8px;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 17px;
  }
}
</style>
